import { useState, useCallback } from "react";
import { CloudUpload, FileText, Loader2, Scale, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { UploadResponse, DocumentAnalysisResult } from "@/lib/types";

interface FileUploadZoneProps {
  onUploadComplete?: (result: UploadResponse) => void;
}

const MA_COURTS = [
  { id: 'barnstable-probate', name: 'Barnstable Probate & Family Court', type: 'Probate & Family' },
  { id: 'barnstable-superior', name: 'Barnstable Superior Court', type: 'Superior' },
  { id: 'barnstable-district', name: 'Barnstable District Court', type: 'District' },
  { id: 'ma-fed-district', name: 'MA Federal District Court', type: 'Federal' },
  { id: 'suffolk-superior', name: 'Suffolk Superior Court', type: 'Superior' },
  { id: 'middlesex-probate', name: 'Middlesex Probate & Family Court', type: 'Probate & Family' },
  { id: 'worcester-superior', name: 'Worcester Superior Court', type: 'Superior' },
  { id: 'hampden-probate', name: 'Hampden Probate & Family Court', type: 'Probate & Family' }
];

export default function FileUploadZone({ onUploadComplete }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedCourt, setSelectedCourt] = useState('barnstable-probate');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('courtId', selectedCourt);
      formData.append('userId', 'demo-user-id');
      
      const response = await apiRequest('POST', '/api/documents/upload', formData);
      return response.json() as Promise<UploadResponse>;
    },
    onSuccess: (data) => {
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      }
      
      toast({
        title: "Document uploaded successfully",
        description: "AI analysis complete with court validation",
      });

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
    <div className="space-y-6">
      {/* Court Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <span>Select Massachusetts Court</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourt} onValueChange={setSelectedCourt}>
            <SelectTrigger>
              <SelectValue placeholder="Choose the court for filing" />
            </SelectTrigger>
            <SelectContent>
              {MA_COURTS.map((court) => (
                <SelectItem key={court.id} value={court.id}>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">{court.type}</Badge>
                    <span>{court.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* File Upload */}
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                disabled={uploadMutation.isPending}
                data-testid="upload-button"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <CloudUpload className="mr-2 h-4 w-4" />
                  {uploadMutation.isPending ? "Analyzing..." : "Choose Files"}
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Analysis Results */}
      {analysisResult && (
        <div className="space-y-4" data-testid="analysis-results">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Upload & Analysis Complete</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <Badge variant="secondary">{analysisResult.docType || "Unknown"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Suggested Court:</span>
                  <span className="font-medium text-sm">{analysisResult.courtValidation?.suggestedCourt || selectedCourt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jurisdiction:</span>
                  <span className="font-medium text-sm">{analysisResult.jurisdiction}</span>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">HIPAA Compliant:</span>
                  <Badge variant={analysisResult.complianceDetails?.hipaaCompliant ? 'default' : 'destructive'}>
                    {analysisResult.complianceDetails?.hipaaCompliant ? 'Yes' : 'Needs Review'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Format Compliant:</span>
                  <Badge variant={analysisResult.complianceDetails?.formatCompliant ? 'default' : 'destructive'}>
                    {analysisResult.complianceDetails?.formatCompliant ? 'Yes' : 'Needs Review'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Content Complete:</span>
                  <Badge variant={analysisResult.complianceDetails?.contentComplete ? 'default' : 'destructive'}>
                    {analysisResult.complianceDetails?.contentComplete ? 'Yes' : 'Needs Review'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Court Valid:</span>
                  <Badge variant={analysisResult.courtValidation?.isValidForCourt ? 'default' : 'destructive'}>
                    {analysisResult.courtValidation?.isValidForCourt ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
            
          {/* Issues and Recommendations */}
          {(analysisResult.complianceDetails?.issues?.length > 0 || 
            analysisResult.recommendations?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.complianceDetails?.issues?.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Issues Found:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {analysisResult.complianceDetails.issues.map((issue: string, index: number) => (
                        <li key={index} className="text-sm">{issue}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {analysisResult.recommendations?.length > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recommendations:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Filing Requirements */}
          {analysisResult.courtValidation?.filingRequirements?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filing Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {analysisResult.courtValidation.filingRequirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}