import { FileText, Clock, Gavel, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { DocumentTemplate } from "@shared/schema";

interface DocumentTemplatesProps {
  onSelectTemplate?: (template: DocumentTemplate) => void;
}

export default function DocumentTemplates({ onSelectTemplate }: DocumentTemplatesProps) {
  const { data: templates, isLoading } = useQuery<DocumentTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const { data: emergencyTemplates } = useQuery<DocumentTemplate[]>({
    queryKey: ["/api/templates/emergency"],
  });

  const handleTemplateSelect = (template: DocumentTemplate) => {
    onSelectTemplate?.(template);
  };

  if (isLoading) {
    return (
      <Card data-testid="templates-loading">
        <CardHeader>
          <CardTitle>Document Templates</CardTitle>
          <CardDescription>Loading templates...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-8" data-testid="document-templates">
      <CardHeader>
        <CardTitle>Document Templates</CardTitle>
        <CardDescription>
          AI-powered document generation from templates pre-configured for MA Federal District Court
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Regular Templates */}
          {templates?.filter(t => !t.isEmergency).map((template) => (
            <Card 
              key={template.id}
              className="border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleTemplateSelect(template)}
              data-testid={`template-${template.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FileText className="text-primary-600 text-xl" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <h4 className="font-medium text-gray-900" data-testid="template-name">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1" data-testid="template-description">
                      {template.description}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      <span data-testid="template-time">{template.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Emergency Templates */}
          {emergencyTemplates?.map((template) => (
            <Card 
              key={template.id}
              className="border border-error-200 hover:border-error-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-error-50"
              onClick={() => handleTemplateSelect(template)}
              data-testid={`emergency-template-${template.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {template.name.includes("TRO") ? (
                      <AlertTriangle className="text-error-600 text-xl" />
                    ) : (
                      <Gavel className="text-error-600 text-xl" />
                    )}
                  </div>
                  <div className="ml-3 flex-grow">
                    <h4 className="font-medium text-gray-900" data-testid="emergency-template-name">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1" data-testid="emergency-template-description">
                      {template.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center text-xs text-error-600">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        <span>Emergency Filing</span>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        URGENT
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!templates || templates.length === 0) && (
          <div className="text-center py-8 text-gray-500" data-testid="no-templates">
            No templates available. Please check back later.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
