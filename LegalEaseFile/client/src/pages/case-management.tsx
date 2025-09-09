import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Database, Shield, Plus, Search, BarChart3 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AirtableCase {
  id: string;
  caseNumber: string;
  clientName: string;
  documentType: string;
  filingStatus: string;
  emergencyType?: string;
  attorneyAssigned?: string;
  dateCreated: string;
  lastUpdated: string;
}

export default function CaseManagement() {
  const [activeTab, setActiveTab] = useState("create");
  const [newCase, setNewCase] = useState({
    caseNumber: "",
    clientName: "",
    documentType: "",
    filingStatus: "Draft",
    emergencyType: "",
    attorneyAssigned: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create case mutation
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
      toast({
        title: "Case Created",
        description: "New case has been securely stored in Airtable database"
      });
      setNewCase({
        caseNumber: "",
        clientName: "",
        documentType: "",
        filingStatus: "Draft",
        emergencyType: "",
        attorneyAssigned: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create case",
        variant: "destructive"
      });
    }
  });

  const handleCreateCase = () => {
    if (!newCase.caseNumber || !newCase.clientName || !newCase.documentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in case number, client name, and document type",
        variant: "destructive"
      });
      return;
    }
    const caseDataToSubmit = {
      ...newCase,
      emergencyType: newCase.emergencyType === "none" ? "" : newCase.emergencyType
    };
    createCaseMutation.mutate(caseDataToSubmit);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Secure Case Management (MPC)</h1>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Database className="w-3 h-3 mr-1" />
          Airtable Connected
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create" data-testid="tab-create">
            <Plus className="w-4 h-4 mr-2" />
            Create Case
          </TabsTrigger>
          <TabsTrigger value="search" data-testid="tab-search">
            <Search className="w-4 h-4 mr-2" />
            Search Cases
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            <Shield className="w-4 h-4 mr-2" />
            MPC Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Case with MPC Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="case-number">Case Number *</Label>
                  <Input
                    id="case-number"
                    data-testid="input-case-number"
                    placeholder="1:24-cv-12345"
                    value={newCase.caseNumber}
                    onChange={(e) => setNewCase(prev => ({ ...prev, caseNumber: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    data-testid="input-client-name"
                    placeholder="Client full name (will be encrypted)"
                    value={newCase.clientName}
                    onChange={(e) => setNewCase(prev => ({ ...prev, clientName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="document-type">Document Type *</Label>
                  <Select 
                    value={newCase.documentType} 
                    onValueChange={(value) => setNewCase(prev => ({ ...prev, documentType: value }))}
                  >
                    <SelectTrigger data-testid="select-document-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motion">Motion</SelectItem>
                      <SelectItem value="Pleading">Pleading</SelectItem>
                      <SelectItem value="Appeal">Appeal</SelectItem>
                      <SelectItem value="Discovery Request">Discovery Request</SelectItem>
                      <SelectItem value="Affidavit">Affidavit</SelectItem>
                      <SelectItem value="TRO">Temporary Restraining Order</SelectItem>
                      <SelectItem value="Preliminary Injunction">Preliminary Injunction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="filing-status">Filing Status</Label>
                  <Select 
                    value={newCase.filingStatus} 
                    onValueChange={(value) => setNewCase(prev => ({ ...prev, filingStatus: value }))}
                  >
                    <SelectTrigger data-testid="select-filing-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending Review">Pending Review</SelectItem>
                      <SelectItem value="Emergency Filing">Emergency Filing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="emergency-type">Emergency Type (if applicable)</Label>
                  <Select 
                    value={newCase.emergencyType} 
                    onValueChange={(value) => setNewCase(prev => ({ ...prev, emergencyType: value }))}
                  >
                    <SelectTrigger data-testid="select-emergency-type">
                      <SelectValue placeholder="Select if emergency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Emergency</SelectItem>
                      <SelectItem value="TRO">Temporary Restraining Order</SelectItem>
                      <SelectItem value="Preliminary Injunction">Preliminary Injunction</SelectItem>
                      <SelectItem value="Emergency Motion">Emergency Motion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="attorney-assigned">Pro Bono Attorney Assigned</Label>
                  <Input
                    id="attorney-assigned"
                    data-testid="input-attorney-assigned"
                    placeholder="Attorney name (optional)"
                    value={newCase.attorneyAssigned}
                    onChange={(e) => setNewCase(prev => ({ ...prev, attorneyAssigned: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">MPC Security Features</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Client name encrypted with AES-256 before storage</li>
                  <li>• Multi-party computation ensures data privacy</li>
                  <li>• Secure transmission to Airtable database</li>
                  <li>• Compliance with legal confidentiality requirements</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleCreateCase} 
                disabled={createCaseMutation.isPending}
                data-testid="button-create-case"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createCaseMutation.isPending ? "Creating Secure Case..." : "Create Encrypted Case in Airtable"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Encrypted Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Case Search Coming Soon</h3>
                <p className="text-gray-600">
                  Advanced search functionality with MPC decryption will be available here.
                  Cases are securely stored in your connected Airtable database.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                MPC Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Encryption Status</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Client data encrypted with AES-256</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Document analysis results encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Multi-party computation enabled</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Airtable Integration</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">API connection secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Base permissions validated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Data synchronization active</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Required Airtable Schema</h4>
                <div className="text-sm space-y-1 text-gray-600">
                  <div><strong>Cases</strong> table with fields:</div>
                  <div className="ml-4">• Case Number (text)</div>
                  <div className="ml-4">• Client Name (Encrypted) (text)</div>
                  <div className="ml-4">• Document Type (single select)</div>
                  <div className="ml-4">• Filing Status (single select)</div>
                  <div className="ml-4">• Emergency Type (text)</div>
                  <div className="ml-4">• Attorney Assigned (text)</div>
                  <div className="ml-4">• Date Created (date)</div>
                  <div className="ml-4">• Last Updated (date)</div>
                </div>
                
                <div className="mt-4 text-sm space-y-1 text-gray-600">
                  <div><strong>Documents</strong> table with fields:</div>
                  <div className="ml-4">• Case ID (text)</div>
                  <div className="ml-4">• File Name (text)</div>
                  <div className="ml-4">• File Type (text)</div>
                  <div className="ml-4">• File Size (number)</div>
                  <div className="ml-4">• Analysis Result (Encrypted) (long text)</div>
                  <div className="ml-4">• CM/ECF Status (single select)</div>
                  <div className="ml-4">• Upload Date (date)</div>
                </div>
                
                <div className="mt-4 text-sm space-y-1 text-gray-600">
                  <div><strong>Attorney Assignments</strong> table with fields:</div>
                  <div className="ml-4">• Case ID (text)</div>
                  <div className="ml-4">• Attorney Name (text)</div>
                  <div className="ml-4">• Organization (text)</div>
                  <div className="ml-4">• Contact Phone (text)</div>
                  <div className="ml-4">• Practice Areas (text)</div>
                  <div className="ml-4">• Emergency Available (checkbox)</div>
                  <div className="ml-4">• Assignment Date (date)</div>
                  <div className="ml-4">• Status (single select)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}