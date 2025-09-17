import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, AlertCircle, Zap, Quote, Download } from 'lucide-react';

interface SmartDocumentRequest {
  templateId: string;
  jurisdiction: string;
  clientData: Record<string, any>;
  caseData: Record<string, any>;
  autoPopulate?: boolean;
  includeCitations?: boolean;
}

interface AssembledDocument {
  id: string;
  templateId: string;
  jurisdiction: string;
  sections: Array<{
    name: string;
    content: string;
    populated: boolean;
    requiredFields: string[];
  }>;
  clientData: Record<string, any>;
  caseData: Record<string, any>;
  citations: string[];
  complianceChecks: {
    formatting: boolean;
    jurisdiction: boolean;
    completeness: boolean;
  };
  estimatedCompletionTime: string;
  createdAt: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  jurisdiction: string;
  estimatedTime: string;
  template: string;
}

export default function SmartDocumentAssembly() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [jurisdiction, setJurisdiction] = useState<string>('');
  const [autoPopulate, setAutoPopulate] = useState<boolean>(true);
  const [includeCitations, setIncludeCitations] = useState<boolean>(true);
  const [clientData, setClientData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    attorney: '',
    barNumber: ''
  });
  const [caseData, setCaseData] = useState({
    caseNumber: '',
    caseType: '',
    courtType: 'state_trial',
    opposingParty: '',
    description: ''
  });
  const [assembledDocument, setAssembledDocument] = useState<AssembledDocument | null>(null);

  // Fetch available templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['templates', jurisdiction],
    queryFn: async (): Promise<DocumentTemplate[]> => {
      const url = jurisdiction
        ? `/api/templates/jurisdiction/${jurisdiction}`
        : '/api/templates';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch templates');
      return response.json();
    },
    enabled: !!jurisdiction
  });

  // Assembly mutation
  const assemblyMutation = useMutation({
    mutationFn: async (data: SmartDocumentRequest): Promise<AssembledDocument> => {
      const response = await fetch('/api/documents/assemble', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assemble document');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAssembledDocument(data);
    },
  });

  const handleAssemble = () => {
    if (!selectedTemplate || !jurisdiction) return;

    const request: SmartDocumentRequest = {
      templateId: selectedTemplate,
      jurisdiction,
      clientData,
      caseData,
      autoPopulate,
      includeCitations
    };

    assemblyMutation.mutate(request);
  };

  const handleDownload = () => {
    if (!assembledDocument) return;

    // Create downloadable document content
    const content = assembledDocument.sections
      .map(section => `${section.name.toUpperCase()}\n\n${section.content}\n\n`)
      .join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Smart Document Assembly</h1>
        <p className="mt-2 text-lg text-gray-600">
          AI-powered document generation with auto-population and jurisdiction compliance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Document Configuration
              </CardTitle>
              <CardDescription>
                Configure your document settings and template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FEDERAL">Federal Court</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {jurisdiction && (
                <div>
                  <Label htmlFor="template">Document Template</Label>
                  {templatesLoading ? (
                    <div className="text-sm text-gray-500">Loading templates...</div>
                  ) : (
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates?.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} ({template.estimatedTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoPopulate">Auto-populate content</Label>
                  <Switch
                    id="autoPopulate"
                    checked={autoPopulate}
                    onCheckedChange={setAutoPopulate}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeCitations">Include legal citations</Label>
                  <Switch
                    id="includeCitations"
                    checked={includeCitations}
                    onCheckedChange={setIncludeCitations}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={clientData.name}
                  onChange={(e) => setClientData({...clientData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Input
                  id="clientAddress"
                  value={clientData.address}
                  onChange={(e) => setClientData({...clientData, address: e.target.value})}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData({...clientData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="attorney">Attorney Name</Label>
                <Input
                  id="attorney"
                  value={clientData.attorney}
                  onChange={(e) => setClientData({...clientData, attorney: e.target.value})}
                  placeholder="Jane Smith, Esq."
                />
              </div>
            </CardContent>
          </Card>

          {/* Case Information */}
          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="caseType">Case Type</Label>
                <Select value={caseData.caseType} onValueChange={(value) => setCaseData({...caseData, caseType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="tort">Tort</SelectItem>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="criminal">Criminal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="caseNumber">Case Number</Label>
                <Input
                  id="caseNumber"
                  value={caseData.caseNumber}
                  onChange={(e) => setCaseData({...caseData, caseNumber: e.target.value})}
                  placeholder="CV-2024-001234"
                />
              </div>
              <div>
                <Label htmlFor="opposingParty">Opposing Party</Label>
                <Input
                  id="opposingParty"
                  value={caseData.opposingParty}
                  onChange={(e) => setCaseData({...caseData, opposingParty: e.target.value})}
                  placeholder="ABC Corporation"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleAssemble}
            className="w-full"
            disabled={!selectedTemplate || !jurisdiction || assemblyMutation.isPending}
          >
            {assemblyMutation.isPending ? 'Assembling Document...' : 'Assemble Document'}
          </Button>

          {assemblyMutation.error && (
            <div className="text-red-600 text-sm">
              Error: {assemblyMutation.error.message}
            </div>
          )}
        </div>

        {/* Document Preview */}
        <div className="lg:col-span-2">
          {assembledDocument ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Assembled Document
                    </CardTitle>
                    <CardDescription>
                      Generated on {new Date(assembledDocument.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Compliance Status */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    {assembledDocument.complianceChecks.formatting ? (
                      <CheckCircle className="h-4 w-4 gradient-green" />
                    ) : (
                      <AlertCircle className="h-4 w-4 gradient-red" />
                    )}
                    <span className="text-sm">Formatting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assembledDocument.complianceChecks.jurisdiction ? (
                      <CheckCircle className="h-4 w-4 gradient-green" />
                    ) : (
                      <AlertCircle className="h-4 w-4 gradient-red" />
                    )}
                    <span className="text-sm">Jurisdiction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assembledDocument.complianceChecks.completeness ? (
                      <CheckCircle className="h-4 w-4 gradient-green" />
                    ) : (
                      <AlertCircle className="h-4 w-4 gradient-red" />
                    )}
                    <span className="text-sm">Completeness</span>
                  </div>
                </div>

                {/* Document Sections */}
                <div className="space-y-4">
                  {assembledDocument.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">
                          {section.name.replace('_', ' ')}
                        </h3>
                        <Badge variant={section.populated ? 'default' : 'secondary'}>
                          {section.populated ? 'Populated' : 'Template'}
                        </Badge>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                        {section.content || '[Section content will appear here]'}
                      </div>
                      {section.requiredFields.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Required fields: {section.requiredFields.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Citations */}
                {assembledDocument.citations.length > 0 && (
                  <div>
                    <h3 className="font-medium flex items-center mb-2">
                      <Quote className="mr-2 h-4 w-4" />
                      Legal Citations
                    </h3>
                    <div className="space-y-1">
                      {assembledDocument.citations.map((citation, index) => (
                        <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                          {citation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Document Metadata</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Jurisdiction:</span> {assembledDocument.jurisdiction}
                    </div>
                    <div>
                      <span className="font-medium">Estimated Completion:</span> {assembledDocument.estimatedCompletionTime}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p>Select a template and click "Assemble Document" to begin</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}