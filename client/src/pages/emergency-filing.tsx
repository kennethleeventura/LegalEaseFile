import { useState } from "react";
import { AlertTriangle, ArrowLeft, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DocumentTemplates from "@/components/document/document-templates";
import type { EmergencyFilingValidation } from "@/lib/types";
import type { DocumentTemplate } from "@shared/schema";

const EMERGENCY_TYPES = [
  {
    value: "TRO",
    label: "Temporary Restraining Order (TRO)",
    description: "Ex parte relief for immediate and irreparable harm",
    timeframe: "Same day filing possible",
  },
  {
    value: "PRELIMINARY_INJUNCTION",
    label: "Preliminary Injunction", 
    description: "Motion requiring notice and hearing under Winter standard",
    timeframe: "14 days notice required",
  },
];

const URGENCY_LEVELS = [
  { value: "IMMEDIATE", label: "Immediate (Same Day)", color: "destructive" },
  { value: "WITHIN_24_HOURS", label: "Within 24 Hours", color: "warning" },
  { value: "WITHIN_WEEK", label: "Within 1 Week", color: "default" },
];

export default function EmergencyFiling() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [urgencyLevel, setUrgencyLevel] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [validationResult, setValidationResult] = useState<EmergencyFilingValidation | null>(null);
  const { toast } = useToast();

  const validateMutation = useMutation({
    mutationFn: async (data: { documentId: string; filingType: string }) => {
      const response = await apiRequest('POST', '/api/emergency/validate', data);
      return response.json() as Promise<EmergencyFilingValidation>;
    },
    onSuccess: (result) => {
      setValidationResult(result);
      toast({
        title: result.isValid ? "Validation Successful" : "Validation Issues Found",
        description: result.isValid 
          ? "Document meets emergency filing requirements" 
          : `${result.issues.length} issues found`,
        variant: result.isValid ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedDocument(template.id);
    console.log("Emergency template selected:", template);
  };

  const handleValidateDocument = () => {
    if (!selectedDocument || !selectedType) {
      toast({
        title: "Missing Information",
        description: "Please select a document and filing type",
        variant: "destructive",
      });
      return;
    }

    validateMutation.mutate({
      documentId: selectedDocument,
      filingType: selectedType as 'TRO' | 'PRELIMINARY_INJUNCTION',
    });
  };

  const selectedEmergencyType = EMERGENCY_TYPES.find(type => type.value === selectedType);
  const selectedUrgency = URGENCY_LEVELS.find(level => level.value === urgencyLevel);

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" data-testid="emergency-filing-page">
      {/* Emergency Warning Banner */}
      <Alert className="mb-6 bg-error-50 border-l-4 border-error-500 shadow-sm" data-testid="emergency-warning">
        <AlertTriangle className="text-error-500 h-5 w-5" />
        <AlertDescription className="text-error-700">
          <strong>Emergency Filing Notice:</strong> Emergency filings require immediate attention and have specific deadlines.
          For TRO requests, contact the court directly at{" "}
          <a href="tel:6177489200" className="underline font-medium">(617) 748-9200</a> if filing after hours.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="back-to-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-error-600 text-3xl mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Filing</h1>
            <p className="text-lg text-gray-600">
              Expedited filing for time-sensitive legal matters
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Filing Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Emergency Type Selection */}
          <Card data-testid="emergency-type-selection">
            <CardHeader>
              <CardTitle>Emergency Filing Type</CardTitle>
              <CardDescription>
                Select the type of emergency relief you are seeking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {EMERGENCY_TYPES.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedType === type.value
                        ? "border-error-300 bg-error-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedType(type.value)}
                    data-testid={`emergency-type-${type.value}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="radio"
                            checked={selectedType === type.value}
                            onChange={() => setSelectedType(type.value)}
                            className="text-error-600"
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          <Badge variant="outline" className="mt-2">
                            {type.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Urgency Level */}
          <Card data-testid="urgency-selection">
            <CardHeader>
              <CardTitle>Urgency Level</CardTitle>
              <CardDescription>
                How quickly do you need this filed?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger data-testid="urgency-select">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Emergency Description */}
          <Card data-testid="emergency-description">
            <CardHeader>
              <CardTitle>Emergency Description</CardTitle>
              <CardDescription>
                Briefly describe the emergency and why immediate relief is needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the emergency circumstances, immediate harm, and why standard filing timeframes are insufficient..."
                rows={6}
                data-testid="description-textarea"
              />
            </CardContent>
          </Card>

          {/* Emergency Templates */}
          <Card data-testid="emergency-templates">
            <CardHeader>
              <CardTitle>Emergency Document Templates</CardTitle>
              <CardDescription>
                Select an emergency filing template to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentTemplates onSelectTemplate={handleTemplateSelect} />
            </CardContent>
          </Card>

          {/* Document Validation */}
          {selectedDocument && selectedType && (
            <Card data-testid="document-validation">
              <CardHeader>
                <CardTitle>Document Validation</CardTitle>
                <CardDescription>
                  Validate your document against emergency filing requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={handleValidateDocument}
                    disabled={validateMutation.isPending}
                    className="w-full"
                    data-testid="validate-button"
                  >
                    {validateMutation.isPending ? "Validating..." : "Validate Document"}
                  </Button>

                  {validationResult && (
                    <Alert
                      className={validationResult.isValid ? "bg-success-50 border-success-200" : "bg-error-50 border-error-200"}
                      data-testid="validation-result"
                    >
                      {validationResult.isValid ? (
                        <CheckCircle className="text-success-600 h-5 w-5" />
                      ) : (
                        <XCircle className="text-error-600 h-5 w-5" />
                      )}
                      <AlertDescription>
                        <h4 className={`font-medium mb-2 ${validationResult.isValid ? "text-success-900" : "text-error-900"}`}>
                          {validationResult.isValid ? "Document Validation Passed" : "Validation Issues Found"}
                        </h4>
                        {!validationResult.isValid && validationResult.issues.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-error-800 mb-1">Issues:</p>
                            <ul className="text-sm text-error-700 list-disc list-inside space-y-1">
                              {validationResult.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {validationResult.recommendations.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-primary-800 mb-1">Recommendations:</p>
                            <ul className="text-sm text-primary-700 list-disc list-inside space-y-1">
                              {validationResult.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Emergency Filing Guide Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6" data-testid="emergency-guide">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Emergency Filing Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TRO Requirements */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">TRO Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Immediate and irreparable injury</li>
                  <li>• Certification of notice efforts</li>
                  <li>• Specific facts in affidavit</li>
                  <li>• Security bond may be required</li>
                </ul>
              </div>

              {/* Preliminary Injunction Requirements */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Preliminary Injunction (Winter Test)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Likelihood of success on merits</li>
                  <li>• Irreparable harm without relief</li>
                  <li>• Balance of equities favors injunction</li>
                  <li>• Injunction serves public interest</li>
                </ul>
              </div>

              {/* Important Contacts */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Emergency Contacts</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">Court Emergency Line</p>
                    <a href="tel:6177489200" className="text-primary-600 hover:text-primary-700">
                      (617) 748-9200
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">CM/ECF Help Desk</p>
                    <a href="tel:8662396233" className="text-primary-600 hover:text-primary-700">
                      (866) 239-6233
                    </a>
                  </div>
                </div>
              </div>

              {/* Filing Timeline */}
              {selectedEmergencyType && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Filing Timeline</h4>
                  <Alert className="bg-warning-50 border-warning-200">
                    <Clock className="text-warning-600 h-4 w-4" />
                    <AlertDescription className="text-warning-700">
                      <strong>{selectedEmergencyType.label}:</strong>
                      <br />
                      {selectedEmergencyType.timeframe}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
