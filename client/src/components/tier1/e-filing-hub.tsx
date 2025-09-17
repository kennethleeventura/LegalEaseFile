import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Shield,
  FileText,
  ExternalLink
} from 'lucide-react';

interface EFilingIntegration {
  id: string;
  name: string;
  jurisdiction: string;
  courtSystem: string;
  status: string;
  supportedDocumentTypes: string[];
  maxFileSize: number;
  filingFees: Record<string, number>;
}

interface EFilingTransaction {
  id: string;
  documentId: string;
  targetCourt: string;
  jurisdiction: string;
  caseNumber?: string;
  filingType: string;
  urgency: string;
  status: string;
  submittedAt: string;
  confirmationNumber: string;
  estimatedProcessingTime: string;
  filingFee: number;
}

interface EFilingRequest {
  documentId: string;
  targetCourt: string;
  jurisdiction: string;
  caseNumber?: string;
  filingType: string;
  urgency: 'standard' | 'expedited' | 'emergency';
  serviceList?: string[];
  paymentMethod?: 'credit_card' | 'bank_account' | 'court_account';
}

export default function EFilingHub() {
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [jurisdiction, setJurisdiction] = useState<string>('');
  const [courtSystem, setCourtSystem] = useState<string>('');
  const [filingRequest, setFilingRequest] = useState<EFilingRequest>({
    documentId: '',
    targetCourt: '',
    jurisdiction: '',
    caseNumber: '',
    filingType: '',
    urgency: 'standard'
  });
  const [recentTransactions, setRecentTransactions] = useState<EFilingTransaction[]>([]);

  // Fetch available integrations
  const { data: integrations, isLoading: integrationsLoading } = useQuery({
    queryKey: ['e-filing-integrations', jurisdiction, courtSystem],
    queryFn: async (): Promise<EFilingIntegration[]> => {
      const params = new URLSearchParams();
      if (jurisdiction) params.append('jurisdiction', jurisdiction);
      if (courtSystem) params.append('courtSystem', courtSystem);

      const response = await fetch(`/api/e-filing/integrations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch integrations');
      return response.json();
    }
  });

  // Compliance check mutation
  const complianceMutation = useMutation({
    mutationFn: async (data: {
      documentId: string;
      jurisdiction: string;
      courtType?: string;
      filingType: string;
    }) => {
      const response = await fetch('/api/documents/compliance-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Compliance check failed');
      return response.json();
    },
  });

  // E-filing submission mutation
  const filingMutation = useMutation({
    mutationFn: async (data: EFilingRequest): Promise<EFilingTransaction> => {
      const response = await fetch('/api/e-filing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('E-filing submission failed');
      return response.json();
    },
    onSuccess: (transaction) => {
      setRecentTransactions(prev => [transaction, ...prev]);
    },
  });

  const handleComplianceCheck = () => {
    if (!filingRequest.documentId || !filingRequest.jurisdiction || !filingRequest.filingType) {
      return;
    }

    complianceMutation.mutate({
      documentId: filingRequest.documentId,
      jurisdiction: filingRequest.jurisdiction,
      filingType: filingRequest.filingType
    });
  };

  const handleSubmitFiling = () => {
    if (!filingRequest.documentId || !filingRequest.targetCourt || !filingRequest.jurisdiction) {
      return;
    }

    filingMutation.mutate(filingRequest);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'expedited':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">E-Filing Integration Hub</h1>
        <p className="mt-2 text-lg text-gray-600">
          Direct connection to CM/ECF, Tyler, File & ServeXpress, and other court systems
        </p>
      </div>

      <Tabs defaultValue="file" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file">File Documents</TabsTrigger>
          <TabsTrigger value="integrations">Available Systems</TabsTrigger>
          <TabsTrigger value="history">Filing History</TabsTrigger>
        </TabsList>

        {/* File Documents Tab */}
        <TabsContent value="file" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filing Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Submit E-Filing
                </CardTitle>
                <CardDescription>
                  File documents directly with court systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="documentId">Document ID</Label>
                  <Input
                    id="documentId"
                    value={filingRequest.documentId}
                    onChange={(e) => setFilingRequest({...filingRequest, documentId: e.target.value})}
                    placeholder="doc-12345"
                  />
                </div>

                <div>
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select
                    value={filingRequest.jurisdiction}
                    onValueChange={(value) => {
                      setFilingRequest({...filingRequest, jurisdiction: value});
                      setJurisdiction(value);
                    }}
                  >
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

                <div>
                  <Label htmlFor="targetCourt">Target Court</Label>
                  <Input
                    id="targetCourt"
                    value={filingRequest.targetCourt}
                    onChange={(e) => setFilingRequest({...filingRequest, targetCourt: e.target.value})}
                    placeholder="US District Court Central District of California"
                  />
                </div>

                <div>
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Input
                    id="caseNumber"
                    value={filingRequest.caseNumber}
                    onChange={(e) => setFilingRequest({...filingRequest, caseNumber: e.target.value})}
                    placeholder="2:24-cv-01234"
                  />
                </div>

                <div>
                  <Label htmlFor="filingType">Filing Type</Label>
                  <Select
                    value={filingRequest.filingType}
                    onValueChange={(value) => setFilingRequest({...filingRequest, filingType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select filing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="motion">Motion</SelectItem>
                      <SelectItem value="brief">Brief</SelectItem>
                      <SelectItem value="response">Response</SelectItem>
                      <SelectItem value="reply">Reply</SelectItem>
                      <SelectItem value="order">Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="urgency">Filing Urgency</Label>
                  <Select
                    value={filingRequest.urgency}
                    onValueChange={(value) => setFilingRequest({...filingRequest, urgency: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Filing</SelectItem>
                      <SelectItem value="expedited">Expedited Filing</SelectItem>
                      <SelectItem value="emergency">Emergency Filing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleComplianceCheck}
                    variant="outline"
                    className="w-full"
                    disabled={!filingRequest.documentId || !filingRequest.jurisdiction || !filingRequest.filingType || complianceMutation.isPending}
                  >
                    {complianceMutation.isPending ? 'Checking...' : 'Check Compliance'}
                  </Button>

                  <Button
                    onClick={handleSubmitFiling}
                    className="w-full"
                    disabled={!filingRequest.documentId || !filingRequest.targetCourt || !filingRequest.jurisdiction || filingMutation.isPending}
                  >
                    {filingMutation.isPending ? 'Submitting...' : 'Submit E-Filing'}
                  </Button>
                </div>

                {complianceMutation.error && (
                  <div className="text-red-600 text-sm">
                    Compliance Error: {complianceMutation.error.message}
                  </div>
                )}

                {filingMutation.error && (
                  <div className="text-red-600 text-sm">
                    Filing Error: {filingMutation.error.message}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compliance Results */}
            {complianceMutation.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Compliance Check Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Compliance</span>
                    {complianceMutation.data.isCompliant ? (
                      <Badge className="border border-green-300">
                        <CheckCircle className="mr-1 h-3 w-3 gradient-green" />
                        <span className="gradient-green">Compliant</span>
                      </Badge>
                    ) : (
                      <Badge className="border border-red-300">
                        <AlertCircle className="mr-1 h-3 w-3 gradient-red" />
                        <span className="gradient-red">Issues Found</span>
                      </Badge>
                    )}
                  </div>

                  {complianceMutation.data.violations?.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Violations</Label>
                      <div className="mt-1 space-y-2">
                        {complianceMutation.data.violations.map((violation: any, index: number) => (
                          <div key={index} className="p-2 bg-red-50 rounded text-sm">
                            <div className="font-medium">{violation.rule}</div>
                            <div className="text-gray-600">{violation.description}</div>
                            <div className="text-blue-600 mt-1">{violation.suggestion}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {complianceMutation.data.checkedRules && (
                    <div>
                      <Label className="text-sm font-medium">Rules Checked</Label>
                      <div className="mt-1 space-y-1">
                        {complianceMutation.data.checkedRules.map((rule: string, index: number) => (
                          <div key={index} className="flex items-center text-sm">
                            <CheckCircle className="mr-2 h-3 w-3 text-green-600" />
                            {rule}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Estimated fix time: {complianceMutation.data.estimatedFixTime}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filing Success */}
            {filingMutation.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    Filing Submitted Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Confirmation Number</Label>
                      <div className="font-mono text-lg">{filingMutation.data.confirmationNumber}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Filing Fee</Label>
                      <div className="text-lg">${filingMutation.data.filingFee}</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(filingMutation.data.status)}>
                      {filingMutation.data.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Estimated Processing Time</Label>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {filingMutation.data.estimatedProcessingTime}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Submitted: {new Date(filingMutation.data.submittedAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Available Systems Tab */}
        <TabsContent value="integrations">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Jurisdictions</SelectItem>
                  <SelectItem value="FEDERAL">Federal</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={courtSystem} onValueChange={setCourtSystem}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by court system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Systems</SelectItem>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {integrationsLoading ? (
              <div>Loading integrations...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations?.map((integration) => (
                  <Card key={integration.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge className={integration.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {integration.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {integration.jurisdiction} • {integration.courtSystem}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Supported Documents</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {integration.supportedDocumentTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Filing Fees</Label>
                        <div className="text-sm space-y-1">
                          {Object.entries(integration.filingFees).map(([type, fee]) => (
                            <div key={type} className="flex justify-between">
                              <span className="capitalize">{type}:</span>
                              <span>${fee}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Max File Size</Label>
                        <div className="text-sm">
                          {Math.round(integration.maxFileSize / (1024 * 1024))} MB
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedIntegration(integration.id)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Select System
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Filing History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent E-Filing Transactions</CardTitle>
              <CardDescription>
                Track your document submissions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 mb-4" />
                  <p>No filing transactions yet</p>
                  <p className="text-sm">Your submitted filings will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{transaction.filingType}</h3>
                          <p className="text-sm text-gray-600">
                            {transaction.targetCourt} • {transaction.jurisdiction}
                          </p>
                          {transaction.caseNumber && (
                            <p className="text-sm text-gray-600">
                              Case: {transaction.caseNumber}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                          <Badge className={`${getUrgencyColor(transaction.urgency)} ml-2`}>
                            {transaction.urgency}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Confirmation:</span>
                          <div className="font-mono">{transaction.confirmationNumber}</div>
                        </div>
                        <div>
                          <span className="font-medium">Fee:</span>
                          <div>${transaction.filingFee}</div>
                        </div>
                        <div>
                          <span className="font-medium">Processing Time:</span>
                          <div>{transaction.estimatedProcessingTime}</div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Submitted: {new Date(transaction.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}