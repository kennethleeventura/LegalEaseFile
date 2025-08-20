import { useState, useCallback } from "react";
import { CloudUpload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { UploadResponse, DocumentAnalysisResult } from "@/lib/types";

interface FileUploadZoneProps {
  onUploadComplete?: (result: UploadResponse) => void;
}

export default function FileUploadZone({ onUploadComplete }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'demo-user-id'); // In production, get from auth context
      
      const response = await apiRequest('POST', '/api/documents/upload', formData);
      return response.json() as Promise<UploadResponse>;
    },
    onSuccess: (data) => {
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      }
      
      toast({
        title: "Document uploaded successfully",
        description: data.analysis ? "AI analysis complete" : "Document uploaded, analysis in progress",
      });

      // Invalidate documents query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      
      onUploadComplete?.(data);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      uploadMutation.mutate(file);
    }
  }, [uploadMutation]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="space-y-6" data-testid="file-upload-zone">
      <Card
        className={`border-2 border-dashed transition-colors duration-200 ${
          dragActive
            ? "border-primary-400 bg-primary-50"
            : "border-gray-300 hover:border-primary-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        data-testid="drop-zone"
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div>
              {uploadMutation.isPending ? (
                <Loader2 className="text-primary-600 text-4xl animate-spin mx-auto" data-testid="upload-spinner" />
              ) : (
                <CloudUpload className="text-gray-400 text-4xl mx-auto" data-testid="upload-icon" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Upload Legal Documents</h3>
              <p className="text-gray-600">Drag and drop files here, or click to browse</p>
              <p className="text-sm text-gray-500 mt-1">Supports PDF, DOC, DOCX (Max 10MB per file)</p>
            </div>
            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={uploadMutation.isPending}
                data-testid="file-input"
              />
              <Button
                asChild
                className="bg-primary-600 text-white hover:bg-primary-700"
                disabled={uploadMutation.isPending}
                data-testid="upload-button"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <CloudUpload className="mr-2 h-4 w-4" />
                  {uploadMutation.isPending ? "Uploading..." : "Choose Files"}
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {analysisResult && (
        <Alert className="bg-primary-50 border border-primary-200" data-testid="analysis-results">
          <FileText className="text-primary-600 h-5 w-5" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <h4 className="font-medium text-primary-900">AI Analysis Complete</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Document Type:</strong>{" "}
                  <span className="text-primary-700" data-testid="doc-type">
                    {analysisResult.docType}
                  </span>
                </p>
                <p>
                  <strong>Jurisdiction:</strong>{" "}
                  <span className="text-primary-700" data-testid="jurisdiction">
                    {analysisResult.jurisdiction}
                  </span>
                </p>
                <p>
                  <strong>Compliance Status:</strong>{" "}
                  <span 
                    className={analysisResult.compliance.includes("Compliant") ? "text-success-600" : "text-warning-600"}
                    data-testid="compliance-status"
                  >
                    {analysisResult.compliance.includes("Compliant") ? "✓" : "⚠"} {analysisResult.compliance}
                  </span>
                </p>
                <p>
                  <strong>Recommendations:</strong>{" "}
                  <span className="text-primary-700" data-testid="recommendations">
                    {analysisResult.recommendations.join(", ")}
                  </span>
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
