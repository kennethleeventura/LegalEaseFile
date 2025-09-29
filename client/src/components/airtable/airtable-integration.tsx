import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CaseData {
  id: string;
  caseNumber: string;
  clientName: string;
  documentType: string;
  filingStatus: string;
  emergencyType?: string;
  attorneyAssigned?: string;
  dateCreated: string;
}

export default function AirtableIntegration() {
  const [searchFilters, setSearchFilters] = useState({
    caseNumber: "",
    documentType: "",
    filingStatus: ""
  });
  const [newCase, setNewCase] = useState({
    caseNumber: "",
    clientName: "",
    documentType: "",
    filingStatus: "Draft",
    emergencyType: "",
    attorneyAssigned: ""
  });
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cases from Airtable
  const { data: cases, isLoading: casesLoading } = useQuery<{ cases: CaseData[] }>({
    queryKey: ["/api/airtable/cases", searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/airtable/cases?${params}`);
      if (!response.ok) throw new Error('Failed to fetch cases');
      return response.json();
    }
  });

  // Create new case mutation
  const createCaseMutation = useMutation({
    mutationFn: async (caseData: typeof newCase) => {
      const response = await fetch('/api/airtable/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData)
      });
      if (!response.ok) throw new Error('Failed to create case');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/airtable/cases"] });
      setNewCase({
        caseNumber: "",
        clientName: "",
        documentType: "",
        filingStatus: "Draft",
        emergencyType: "",
        attorneyAssigned: ""
      });
      toast({ title: "Success", description: "Case created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to create case",
        variant: "destructive"
      });
    }
  });

  // Auto-populate form mutation
  const autoPopulateMutation = useMutation({
    mutationFn: async (params: { clientName: string; formType: string }) => {
      const response = await fetch('/api/mpc/auto-populate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error('Failed to auto-populate form');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: "Form auto-populated successfully" });
      // Update form fields with populated data
      if (data.data) {
        setNewCase(prev => ({
          ...prev,
          caseNumber: data.data.caseNumber || prev.caseNumber,
          documentType: data.data.documentType || prev.documentType
        }));
      }
    }
  });

  // Export PDF mutation
  const exportPDFMutation = useMutation({
    mutationFn: async (caseId: string) => {
      const response = await fetch(`/api/mpc/export-pdf/${caseId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to export PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Exhibit_List_${caseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "PDF exported successfully" });
    }
  });

  return (
    <div className="space-y-6">
      {/* Create New Case */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Case
          </CardTitle>
          <CardDescription>
            Create a new case in your Airtable database with AI-powered form population
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="caseNumber">Case Number</Label>
              <Input
                id="caseNumber"
                value={newCase.caseNumber}
                onChange={(e) => setNewCase(prev => ({ ...prev, caseNumber: e.target.value }))}
                placeholder="e.g., 1:24-cv-12345"
              />
            </div>
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <div className="flex gap-2">
                <Input
                  id="clientName"
                  value={newCase.clientName}
                  onChange={(e) => setNewCase(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Client name"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newCase.clientName) {
                      autoPopulateMutation.mutate({
                        clientName: newCase.clientName,
                        formType: "Case Creation Form"
                      });
                    }
                  }}
                  disabled={!newCase.clientName || autoPopulateMutation.isPending}
                >
                  Auto-Fill
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                value={newCase.documentType}
                onValueChange={(value) => setNewCase(prev => ({ ...prev, documentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Motion">Motion</SelectItem>
                  <SelectItem value="Complaint">Complaint</SelectItem>
                  <SelectItem value="Answer">Answer</SelectItem>
                  <SelectItem value="Discovery">Discovery</SelectItem>
                  <SelectItem value="TRO">Temporary Restraining Order</SelectItem>
                  <SelectItem value="Preliminary Injunction">Preliminary Injunction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filingStatus">Filing Status</Label>
              <Select
                value={newCase.filingStatus}
                onValueChange={(value) => setNewCase(prev => ({ ...prev, filingStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Ready to File">Ready to File</SelectItem>
                  <SelectItem value="Filed Successfully">Filed Successfully</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={() => createCaseMutation.mutate(newCase)}
            disabled={!newCase.caseNumber || !newCase.clientName || !newCase.documentType || createCaseMutation.isPending}
            className="w-full"
          >
            {createCaseMutation.isPending ? "Creating..." : "Create Case"}
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filter Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Case number"
              value={searchFilters.caseNumber}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, caseNumber: e.target.value }))}
            />
            <Input
              placeholder="Document type"
              value={searchFilters.documentType}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, documentType: e.target.value }))}
            />
            <Input
              placeholder="Filing status"
              value={searchFilters.filingStatus}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, filingStatus: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>Cases from Airtable Database</CardTitle>
          <CardDescription>
            {cases?.cases?.length || 0} cases found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {casesLoading ? (
            <div>Loading cases...</div>
          ) : (
            <div className="space-y-4">
              {cases?.cases?.map((case_) => (
                <div key={case_.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{case_.caseNumber}</h3>
                      <p className="text-sm text-gray-600">{case_.clientName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={case_.filingStatus === 'Filed Successfully' ? 'default' : 'secondary'}>
                        {case_.filingStatus}
                      </Badge>
                      {case_.emergencyType && (
                        <Badge variant="destructive">Emergency</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {case_.documentType} • {new Date(case_.dateCreated).toLocaleDateString()}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportPDFMutation.mutate(case_.id)}
                      disabled={exportPDFMutation.isPending}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}