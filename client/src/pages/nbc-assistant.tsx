import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, FileText, Lightbulb, Search, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExhibitListItem {
  exhibitNumber: string;
  description: string;
  documentType: string;
  dateCreated: string;
  relevance: string;
  source: string;
}

interface CaseInsights {
  similarCases: any[];
  riskFactors: string[];
  recommendations: string[];
  timelineEstimate: string;
  requiredDocuments: string[];
}

export default function NBCAssistant() {
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [formParams, setFormParams] = useState({
    clientName: "",
    caseType: "",
    documentType: "",
    formType: ""
  });
  const [templateParams, setTemplateParams] = useState({
    documentType: "",
    emergencyType: "",
    clientName: ""
  });

  const { toast } = useToast();

  // Fetch available cases
  const { data: casesData } = useQuery({
    queryKey: ['/api/airtable/cases'],
    enabled: true
  });

  // Generate exhibit list mutation
  const exhibitMutation = useMutation({
    mutationFn: async (caseId: string) => {
      const response = await fetch(`/api/nbc/exhibit-list/${caseId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to generate exhibit list');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Exhibit List Generated",
        description: "NBC AI has created your exhibit list based on case database"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate exhibit list",
        variant: "destructive"
      });
    }
  });

  // Auto-populate form mutation
  const autoPopulateMutation = useMutation({
    mutationFn: async (params: typeof formParams) => {
      const response = await fetch('/api/nbc/auto-populate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error('Failed to auto-populate form');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Form Auto-Populated",
        description: "NBC AI has populated your form using existing case data"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to auto-populate form",
        variant: "destructive"
      });
    }
  });

  // Case insights query
  const { data: insightsData, refetch: fetchInsights, isLoading: insightsLoading } = useQuery({
    queryKey: [`/api/nbc/insights/${selectedCaseId}`],
    enabled: false
  });

  // Template selection mutation
  const templateMutation = useMutation({
    mutationFn: async (params: typeof templateParams) => {
      const response = await fetch('/api/nbc/select-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error('Failed to select template');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Optimal Template Selected",
        description: "NBC AI has selected the best template based on case history"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to select template",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">NBC AI Assistant</h1>
            <p className="text-gray-600">Pull from existing case database to auto-populate forms and create exhibit lists</p>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-600">
          <Zap className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <Tabs defaultValue="exhibits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="exhibits" data-testid="tab-exhibits">
            <FileText className="w-4 h-4 mr-2" />
            Exhibit Lists
          </TabsTrigger>
          <TabsTrigger value="forms" data-testid="tab-forms">
            <Search className="w-4 h-4 mr-2" />
            Auto-Populate Forms
          </TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">
            <Lightbulb className="w-4 h-4 mr-2" />
            Case Insights
          </TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">
            <Brain className="w-4 h-4 mr-2" />
            Smart Templates
          </TabsTrigger>
        </TabsList>

        {/* Exhibit List Generation */}
        <TabsContent value="exhibits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Exhibit List from Case Database</CardTitle>
              <CardDescription>
                NBC AI analyzes your existing case data to automatically create comprehensive exhibit lists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="case-select">Select Case</Label>
                <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                  <SelectTrigger data-testid="select-case">
                    <SelectValue placeholder="Choose a case for exhibit generation" />
                  </SelectTrigger>
                  <SelectContent>
                    {(casesData as any)?.cases?.map((case_: any) => (
                      <SelectItem key={case_.id} value={case_.id}>
                        {case_.caseNumber} - {case_.clientName} ({case_.documentType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => selectedCaseId && exhibitMutation.mutate(selectedCaseId)}
                disabled={!selectedCaseId || exhibitMutation.isPending}
                data-testid="button-generate-exhibits"
                className="w-full"
              >
                {exhibitMutation.isPending ? "Generating..." : "Generate Exhibit List"}
              </Button>

              {exhibitMutation.data?.exhibitList && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Generated Exhibit List</h3>
                  <div className="space-y-3">
                    {exhibitMutation.data.exhibitList.map((exhibit: ExhibitListItem, index: number) => (
                      <Card key={index} className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">{exhibit.exhibitNumber}</Badge>
                            <Badge variant="outline">{exhibit.documentType}</Badge>
                          </div>
                          <h4 className="font-medium mb-1">{exhibit.description}</h4>
                          <p className="text-sm text-gray-600 mb-2">{exhibit.relevance}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Source: {exhibit.source}</span>
                            <span>Created: {exhibit.dateCreated}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Auto-Population */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Populate Forms from Database</CardTitle>
              <CardDescription>
                Let NBC AI fill out form fields based on patterns from your existing cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    data-testid="input-client-name"
                    placeholder="Enter client name"
                    value={formParams.clientName}
                    onChange={(e) => setFormParams(prev => ({...prev, clientName: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="case-type">Case Type</Label>
                  <Input
                    id="case-type"
                    data-testid="input-case-type"
                    placeholder="e.g., Civil, Criminal"
                    value={formParams.caseType}
                    onChange={(e) => setFormParams(prev => ({...prev, caseType: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select 
                    value={formParams.documentType} 
                    onValueChange={(value) => setFormParams(prev => ({...prev, documentType: value}))}
                  >
                    <SelectTrigger data-testid="select-form-document-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motion">Motion</SelectItem>
                      <SelectItem value="Pleading">Pleading</SelectItem>
                      <SelectItem value="Appeal">Appeal</SelectItem>
                      <SelectItem value="Discovery Request">Discovery Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="form-type">Form Type *</Label>
                  <Select 
                    value={formParams.formType} 
                    onValueChange={(value) => setFormParams(prev => ({...prev, formType: value}))}
                  >
                    <SelectTrigger data-testid="select-form-type">
                      <SelectValue placeholder="Select form type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Civil Cover Sheet">Civil Cover Sheet</SelectItem>
                      <SelectItem value="Motion for Summary Judgment">Motion for Summary Judgment</SelectItem>
                      <SelectItem value="TRO Application">TRO Application</SelectItem>
                      <SelectItem value="Discovery Motion">Discovery Motion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={() => autoPopulateMutation.mutate(formParams)}
                disabled={!formParams.formType || autoPopulateMutation.isPending}
                data-testid="button-auto-populate"
                className="w-full"
              >
                {autoPopulateMutation.isPending ? "Auto-Populating..." : "Auto-Populate Form"}
              </Button>

              {autoPopulateMutation.data?.data && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Auto-Populated Data</h3>
                  <Card className="bg-blue-50">
                    <CardContent className="pt-4">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(autoPopulateMutation.data.data, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Case Insights */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Insights & Recommendations</CardTitle>
              <CardDescription>
                Get AI-powered insights based on similar cases in your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="insights-case">Select Case for Analysis</Label>
                <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                  <SelectTrigger data-testid="select-insights-case">
                    <SelectValue placeholder="Choose a case for insights" />
                  </SelectTrigger>
                  <SelectContent>
                    {(casesData as any)?.cases?.map((case_: any) => (
                      <SelectItem key={case_.id} value={case_.id}>
                        {case_.caseNumber} - {case_.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => fetchInsights()}
                disabled={!selectedCaseId || insightsLoading}
                data-testid="button-generate-insights"
                className="w-full"
              >
                {insightsLoading ? "Analyzing..." : "Generate Insights"}
              </Button>

              {(insightsData as any)?.insights && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Case Analysis Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Risk Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {((insightsData as any).insights as CaseInsights).riskFactors?.map((risk: string, index: number) => (
                            <li key={index} className="text-sm text-red-600">• {risk}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {((insightsData as any).insights as CaseInsights).recommendations?.map((rec: string, index: number) => (
                            <li key={index} className="text-sm text-green-600">• {rec}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Timeline Estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{((insightsData as any).insights as CaseInsights).timelineEstimate}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Templates */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Smart Template Selection</CardTitle>
              <CardDescription>
                NBC AI selects the optimal template based on your case database history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="template-document-type">Document Type *</Label>
                  <Select 
                    value={templateParams.documentType} 
                    onValueChange={(value) => setTemplateParams(prev => ({...prev, documentType: value}))}
                  >
                    <SelectTrigger data-testid="select-template-document-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motion">Motion</SelectItem>
                      <SelectItem value="Pleading">Pleading</SelectItem>
                      <SelectItem value="TRO">Temporary Restraining Order</SelectItem>
                      <SelectItem value="Preliminary Injunction">Preliminary Injunction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="template-emergency-type">Emergency Type</Label>
                  <Select 
                    value={templateParams.emergencyType} 
                    onValueChange={(value) => setTemplateParams(prev => ({...prev, emergencyType: value}))}
                  >
                    <SelectTrigger data-testid="select-template-emergency-type">
                      <SelectValue placeholder="Emergency type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Emergency</SelectItem>
                      <SelectItem value="TRO">TRO</SelectItem>
                      <SelectItem value="Preliminary Injunction">Preliminary Injunction</SelectItem>
                      <SelectItem value="Emergency Motion">Emergency Motion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="template-client-name">Client Name *</Label>
                  <Input
                    id="template-client-name"
                    data-testid="input-template-client-name"
                    placeholder="Enter client name"
                    value={templateParams.clientName}
                    onChange={(e) => setTemplateParams(prev => ({...prev, clientName: e.target.value}))}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => templateMutation.mutate(templateParams)}
                disabled={!templateParams.documentType || !templateParams.clientName || templateMutation.isPending}
                data-testid="button-select-template"
                className="w-full"
              >
                {templateMutation.isPending ? "Selecting..." : "Select Optimal Template"}
              </Button>

              {templateMutation.data?.template && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommended Template</h3>
                  <Card className="bg-green-50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{templateMutation.data.template.templateName}</h4>
                        <Badge className="bg-green-100 text-green-700">
                          {Math.round(templateMutation.data.template.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div>
                        <h5 className="text-sm font-medium mb-2">Customizations:</h5>
                        <pre className="text-sm bg-white p-3 rounded border">
                          {JSON.stringify(templateMutation.data.template.customizations, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}