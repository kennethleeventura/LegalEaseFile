import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import type { DocumentTemplate } from "@shared/schema";

export default function TemplateForm() {
  const [location, setLocation] = useLocation();
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);

  // Parse template ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('id');
    const templateName = urlParams.get('name');

    if (templateId && templateName) {
      // Simulate loading template details
      setTemplate({
        id: templateId,
        name: decodeURIComponent(templateName),
        description: `Complete this ${decodeURIComponent(templateName)} with AI assistance`,
        category: 'form',
        template: JSON.stringify({}),
        isEmergency: templateId.includes('emergency'),
        estimatedTime: '30-45 minutes',
        createdAt: Date.now(),
      });
    }
  }, []);

  // Get form fields based on template type
  const getFormFields = () => {
    if (!template) return [];

    const templateName = template.name.toLowerCase();

    if (templateName.includes('divorce')) {
      return [
        { id: 'petitioner_name', label: 'Petitioner Full Name', type: 'text', required: true },
        { id: 'respondent_name', label: 'Respondent Full Name', type: 'text', required: true },
        { id: 'marriage_date', label: 'Date of Marriage', type: 'date', required: true },
        { id: 'separation_date', label: 'Date of Separation', type: 'date', required: false },
        { id: 'children', label: 'Minor Children (Yes/No)', type: 'select', options: ['No', 'Yes'], required: true },
        { id: 'grounds', label: 'Grounds for Divorce', type: 'select', options: ['Irretrievable breakdown', 'Living apart'], required: true },
        { id: 'address', label: 'Current Address', type: 'textarea', required: true },
      ];
    } else if (templateName.includes('bankruptcy')) {
      return [
        { id: 'debtor_name', label: 'Debtor Full Name', type: 'text', required: true },
        { id: 'debtor_address', label: 'Debtor Address', type: 'textarea', required: true },
        { id: 'chapter', label: 'Bankruptcy Chapter', type: 'select', options: ['Chapter 7', 'Chapter 13'], required: true },
        { id: 'total_debt', label: 'Total Debt Amount', type: 'text', required: true },
        { id: 'monthly_income', label: 'Monthly Income', type: 'text', required: true },
        { id: 'assets', label: 'Major Assets', type: 'textarea', required: false },
      ];
    } else if (templateName.includes('restraining') || templateName.includes('209a')) {
      return [
        { id: 'plaintiff_name', label: 'Your Full Name', type: 'text', required: true },
        { id: 'defendant_name', label: 'Defendant Full Name', type: 'text', required: true },
        { id: 'relationship', label: 'Relationship to Defendant', type: 'select', options: ['Spouse', 'Former spouse', 'Dating relationship', 'Family member', 'Other'], required: true },
        { id: 'incident_date', label: 'Date of Most Recent Incident', type: 'date', required: true },
        { id: 'description', label: 'Description of Abuse/Harassment', type: 'textarea', required: true },
        { id: 'relief_sought', label: 'Relief Requested', type: 'textarea', required: true },
        { id: 'emergency', label: 'Is this an emergency?', type: 'select', options: ['No', 'Yes - immediate danger'], required: true },
      ];
    } else if (templateName.includes('immigration') || templateName.includes('i-485')) {
      return [
        { id: 'full_name', label: 'Full Legal Name', type: 'text', required: true },
        { id: 'country_birth', label: 'Country of Birth', type: 'text', required: true },
        { id: 'current_status', label: 'Current Immigration Status', type: 'text', required: true },
        { id: 'priority_date', label: 'Priority Date (if applicable)', type: 'date', required: false },
        { id: 'sponsor', label: 'Petitioner/Sponsor Name', type: 'text', required: true },
        { id: 'address', label: 'Current US Address', type: 'textarea', required: true },
      ];
    } else {
      // Generic form fields
      return [
        { id: 'full_name', label: 'Full Legal Name', type: 'text', required: true },
        { id: 'address', label: 'Address', type: 'textarea', required: true },
        { id: 'phone', label: 'Phone Number', type: 'text', required: true },
        { id: 'email', label: 'Email Address', type: 'email', required: true },
        { id: 'case_details', label: 'Case Details', type: 'textarea', required: true },
      ];
    }
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate document generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    setGeneratedDocument(`
# ${template?.name}

## Document Generated Successfully

This ${template?.name} has been generated with your information:

${Object.entries(formData).map(([key, value]) => `**${key.replace('_', ' ')}**: ${value}`).join('\n\n')}

---

*This document was generated by LegalEaseFile AI. Please review carefully before filing.*
    `);

    setIsGenerating(false);
  };

  const formFields = getFormFields();

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Template Not Found</h2>
            <p className="text-gray-600 mb-4">The requested template could not be loaded.</p>
            <Link href="/file-document">
              <Button>Back to Templates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/file-document">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
          </Link>
        </div>

        <div className="flex items-center mb-4">
          <FileText className="text-primary-600 text-3xl mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
            <p className="text-lg text-gray-600">
              AI-guided document completion
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {template.isEmergency && (
            <Badge variant="destructive">Emergency Filing</Badge>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            <span>{template.estimatedTime}</span>
          </div>
        </div>
      </div>

      {!generatedDocument ? (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Document</CardTitle>
            <CardDescription>
              Fill out the information below to generate your {template.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <Textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <Select onValueChange={(value) => handleInputChange(field.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/file-document">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.full_name}
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                {isGenerating ? 'Generating...' : 'Generate Document'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CheckCircle className="text-green-500 h-6 w-6 mr-3" />
              <div>
                <CardTitle>Document Generated Successfully</CardTitle>
                <CardDescription>
                  Your {template.name} is ready for review and filing
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <pre className="whitespace-pre-wrap text-sm">{generatedDocument}</pre>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setGeneratedDocument(null)}>
                Edit Information
              </Button>
              <Button className="bg-primary-600 text-white hover:bg-primary-700">
                Download PDF
              </Button>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                File with Court
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}