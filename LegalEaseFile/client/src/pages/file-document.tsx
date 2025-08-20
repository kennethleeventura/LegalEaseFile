import { useState } from "react";
import { FileText, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import FileUploadZone from "@/components/document/file-upload-zone";
import DocumentTemplates from "@/components/document/document-templates";
import EmergencyAlert from "@/components/legal/emergency-alert";
import type { UploadResponse } from "@/lib/types";
import type { DocumentTemplate } from "@shared/schema";

const FILING_STEPS = [
  { id: 1, name: "Upload or Generate", description: "Upload existing documents or generate from templates" },
  { id: 2, name: "Review & Validate", description: "AI analysis and compliance check" },
  { id: 3, name: "Prepare for Filing", description: "Format and finalize documents" },
  { id: 4, name: "Submit", description: "File with CM/ECF system" },
];

export default function FileDocument() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  const handleUploadComplete = (result: UploadResponse) => {
    setUploadedDocuments(prev => [...prev, result.document]);
    // Auto-advance to next step after upload
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    console.log("Template selected for generation:", template);
    // TODO: Navigate to template form
  };

  const handleNextStep = () => {
    if (currentStep < FILING_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / FILING_STEPS.length) * 100;

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" data-testid="file-document-page">
      <EmergencyAlert />

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
          <FileText className="text-primary-600 text-3xl mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">File New Document</h1>
            <p className="text-lg text-gray-600">
              Prepare and file legal documents with AI assistance
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-6" data-testid="progress-indicator">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Step {currentStep} of {FILING_STEPS.length}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="mt-2" />
            </div>
            <div className="flex justify-between">
              {FILING_STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center ${
                    step.id <= currentStep ? "text-primary-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                      step.id < currentStep
                        ? "bg-primary-600 text-white"
                        : step.id === currentStep
                        ? "bg-primary-100 text-primary-600 border-2 border-primary-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                    data-testid={`step-${step.id}`}
                  >
                    {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <p className="text-xs font-medium">{step.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <div data-testid="step-upload-generate">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Step 1: Upload or Generate Document</CardTitle>
                <CardDescription>
                  Upload an existing document for analysis or generate a new one from our templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* File Upload Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Existing Document</h3>
                    <FileUploadZone onUploadComplete={handleUploadComplete} />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* Template Selection */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Generate from Template</h3>
                    <DocumentTemplates onSelectTemplate={handleTemplateSelect} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div data-testid="step-review-validate">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Review & Validate</CardTitle>
                <CardDescription>
                  AI analysis results and compliance validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {uploadedDocuments.map((doc, index) => (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="pt-4">
                          <h4 className="font-medium text-gray-900" data-testid={`document-${index}`}>
                            {doc.filename}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Status: {doc.status} | Type: {doc.documentType || "Unknown"}
                          </p>
                          {/* TODO: Display detailed AI analysis results */}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No documents uploaded yet. Please go back to Step 1.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <div data-testid="step-prepare">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Prepare for Filing</CardTitle>
                <CardDescription>
                  Format documents for CM/ECF submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Document preparation interface will be implemented here.
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 4 && (
          <div data-testid="step-submit">
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Submit to Court</CardTitle>
                <CardDescription>
                  Final review and submission to CM/ECF system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  CM/ECF submission interface will be implemented here.
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8" data-testid="step-navigation">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          data-testid="prev-step-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={currentStep === FILING_STEPS.length}
          data-testid="next-step-button"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </main>
  );
}
