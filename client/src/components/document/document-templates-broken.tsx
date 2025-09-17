import { useState } from "react";
import { FileText, Clock, Gavel, AlertTriangle, Search, Filter, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { DocumentTemplate } from "@shared/schema";

interface DocumentTemplatesProps {
  onSelectTemplate?: (template: DocumentTemplate) => void;
}

interface TemplateFilters {
  search?: string;
  category?: string;
  jurisdiction?: string;
  sortBy?: string;
}

export default function DocumentTemplates({ onSelectTemplate }: DocumentTemplatesProps) {
  const [filters, setFilters] = useState<TemplateFilters>({});
  // Comprehensive template library based on Master Implementation Guide
  const sampleTemplates: DocumentTemplate[] = [
    // Federal Forms - Immigration
    {
      id: 'FED-IMM-001',
      name: 'Form I-485 - Application to Register Permanent Residence',
      description: 'Apply for adjustment of status to permanent resident',
      category: 'immigration',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 95 }),
      isEmergency: false,
      estimatedTime: '90-120 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'FED-IMM-002',
      name: 'Form N-400 - Application for Naturalization',
      description: 'Apply for U.S. citizenship through naturalization',
      category: 'immigration',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 88 }),
      isEmergency: false,
      estimatedTime: '60-90 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'FED-IMM-003',
      name: 'Form I-130 - Petition for Alien Relative',
      description: 'Petition for family member immigration',
      category: 'immigration',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 82 }),
      isEmergency: false,
      estimatedTime: '45-75 minutes',
      createdAt: Date.now(),
    },

    // Federal Forms - Bankruptcy
    {
      id: 'FED-BNK-001',
      name: 'Chapter 7 Bankruptcy Petition',
      description: 'File for Chapter 7 liquidation bankruptcy',
      category: 'bankruptcy',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 78 }),
      isEmergency: false,
      estimatedTime: '120-180 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'FED-BNK-002',
      name: 'Chapter 13 Bankruptcy Petition',
      description: 'File for Chapter 13 reorganization bankruptcy',
      category: 'bankruptcy',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 65 }),
      isEmergency: false,
      estimatedTime: '150-210 minutes',
      createdAt: Date.now(),
    },

    // Federal Forms - Civil Rights
    {
      id: 'FED-CIV-001',
      name: 'Section 1983 Civil Rights Complaint',
      description: 'File civil rights violation complaint against government officials',
      category: 'civil-rights',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 72 }),
      isEmergency: false,
      estimatedTime: '90-120 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'FED-CIV-002',
      name: 'ADA Discrimination Complaint',
      description: 'File Americans with Disabilities Act violation complaint',
      category: 'civil-rights',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 58 }),
      isEmergency: false,
      estimatedTime: '75-105 minutes',
      createdAt: Date.now(),
    },

    // Massachusetts State Forms - Family Law
    {
      id: 'MA-FAM-001',
      name: 'Massachusetts Divorce Petition (1A)',
      description: 'No-fault divorce petition for Massachusetts courts',
      category: 'family',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 89 }),
      isEmergency: false,
      estimatedTime: '60-90 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'MA-FAM-002',
      name: 'Child Custody Modification Motion',
      description: 'Modify existing child custody arrangements in Massachusetts',
      category: 'family',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 75 }),
      isEmergency: false,
      estimatedTime: '45-75 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'MA-FAM-003',
      name: 'Restraining Order Petition (209A)',
      description: 'File for protective order in domestic violence cases',
      category: 'family',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 67 }),
      isEmergency: true,
      estimatedTime: '30-45 minutes',
      createdAt: Date.now(),
    },

    // Massachusetts State Forms - Housing
    {
      id: 'MA-HSG-001',
      name: 'Summary Process Summons and Complaint',
      description: 'Eviction proceedings in Massachusetts Housing Court',
      category: 'housing',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 84 }),
      isEmergency: false,
      estimatedTime: '45-60 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'MA-HSG-002',
      name: 'Tenant Answer to Eviction',
      description: 'Respond to eviction proceedings as tenant',
      category: 'housing',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 71 }),
      isEmergency: true,
      estimatedTime: '30-45 minutes',
      createdAt: Date.now(),
    },

    // Business Forms
    {
      id: 'MA-BUS-001',
      name: 'Massachusetts LLC Articles of Organization',
      description: 'Form a Limited Liability Company in Massachusetts',
      category: 'business',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 92 }),
      isEmergency: false,
      estimatedTime: '30-45 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'FED-BUS-001',
      name: 'Employment Contract Template',
      description: 'Comprehensive employment agreement template',
      category: 'business',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 86 }),
      isEmergency: false,
      estimatedTime: '60-90 minutes',
      createdAt: Date.now(),
    },

    // Criminal Forms
    {
      id: 'MA-CRM-001',
      name: 'Motion to Suppress Evidence',
      description: 'Challenge illegally obtained evidence in criminal case',
      category: 'criminal',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 63 }),
      isEmergency: false,
      estimatedTime: '90-120 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'FED-CRM-001',
      name: 'Federal Habeas Corpus Petition',
      description: 'Challenge federal conviction or sentencing',
      category: 'criminal',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 55 }),
      isEmergency: false,
      estimatedTime: '120-180 minutes',
      createdAt: Date.now(),
    },

    // Personal Injury
    {
      id: 'MA-PI-001',
      name: 'Personal Injury Complaint',
      description: 'File personal injury lawsuit in Massachusetts Superior Court',
      category: 'personal-injury',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 79 }),
      isEmergency: false,
      estimatedTime: '75-105 minutes',
      createdAt: Date.now(),
    },

    // Employment
    {
      id: 'FED-EMP-001',
      name: 'EEOC Discrimination Charge',
      description: 'File workplace discrimination complaint with EEOC',
      category: 'employment',
      template: JSON.stringify({ jurisdiction: 'Federal', popularity: 73 }),
      isEmergency: false,
      estimatedTime: '45-75 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'MA-EMP-001',
      name: 'Massachusetts Wage Claim',
      description: 'File unpaid wage claim with Massachusetts Attorney General',
      category: 'employment',
      template: JSON.stringify({ jurisdiction: 'Massachusetts', popularity: 68 }),
      isEmergency: false,
      estimatedTime: '30-45 minutes',
      createdAt: Date.now(),
    },
  ];

  const sampleEmergencyTemplates: DocumentTemplate[] = [
    {
      id: 'e1',
      name: 'Temporary Restraining Order (TRO)',
      description: 'Emergency motion for immediate court intervention',
      category: 'emergency',
      template: JSON.stringify({}),
      isEmergency: true,
      estimatedTime: '30-45 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'e2',
      name: 'Preliminary Injunction',
      description: 'Motion for preliminary injunctive relief',
      category: 'emergency',
      template: JSON.stringify({}),
      isEmergency: true,
      estimatedTime: '45-60 minutes',
      createdAt: Date.now(),
    },
    {
      id: 'e3',
      name: 'Emergency Custody Motion',
      description: 'Emergency motion for child custody/protection',
      category: 'emergency',
      template: JSON.stringify({}),
      isEmergency: true,
      estimatedTime: '30-45 minutes',
      createdAt: Date.now(),
    },
  ];

  // Advanced filtering and search functionality
  const getFilteredTemplates = () => {
    let filtered = sampleTemplates;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        template.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
        template.category.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(template => template.category === filters.category);
    }

    // Jurisdiction filter
    if (filters.jurisdiction && filters.jurisdiction !== 'all') {
      filtered = filtered.filter(template => {
        const templateData = JSON.parse(template.template || '{}');
        return templateData.jurisdiction === filters.jurisdiction;
      });
    }

    // Sort by popularity, name, or category
    if (filters.sortBy) {
      filtered = filtered.sort((a, b) => {
        const aData = JSON.parse(a.template || '{}');
        const bData = JSON.parse(b.template || '{}');

        switch (filters.sortBy) {
          case 'popularity':
            return (bData.popularity || 0) - (aData.popularity || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'category':
            return a.category.localeCompare(b.category);
          case 'time':
            // Sort by estimated time (shortest first)
            const aTime = parseInt(a.estimatedTime.split('-')[0]);
            const bTime = parseInt(b.estimatedTime.split('-')[0]);
            return aTime - bTime;
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const templates = getFilteredTemplates();
  const emergencyTemplates = sampleEmergencyTemplates.filter(template => {
    if (filters.search) {
      return template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
             template.description.toLowerCase().includes(filters.search.toLowerCase());
    }
    return true;
  });
  const isLoading = false;

  // Get popular templates (top 6 by popularity score)
  const popularTemplates = sampleTemplates
    .sort((a, b) => {
      const aData = JSON.parse(a.template || '{}');
      const bData = JSON.parse(b.template || '{}');
      return (bData.popularity || 0) - (aData.popularity || 0);
    })
    .slice(0, 6);

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
    <div className="mb-8" data-testid="document-templates">
      {/* Popular Templates Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center">
            <TrendingUp className="text-primary-600 mr-3 h-6 w-6" />
            <div>
              <CardTitle>Most Popular Templates</CardTitle>
              <CardDescription>
                Top-rated forms used by thousands of users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map((template) => {
              const templateData = JSON.parse(template.template || '{}');
              return (
                <Card
                  key={template.id}
                  className="border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <Star className="text-yellow-500 h-4 w-4 mr-1" />
                          <Badge variant="secondary" className="text-xs">
                            {templateData.popularity}% popular
                          </Badge>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {template.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{templateData.jurisdiction}</span>
                          <span>{template.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Template Library */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Template Library</CardTitle>
          <CardDescription>
            AI-powered document generation with 100+ jurisdiction-specific templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Advanced Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates, forms, or legal procedures..."
                  className="pl-10"
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <Filter className="text-gray-400 h-5 w-5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="immigration">Immigration</SelectItem>
                  <SelectItem value="bankruptcy">Bankruptcy</SelectItem>
                  <SelectItem value="civil-rights">Civil Rights</SelectItem>
                  <SelectItem value="family">Family Law</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="criminal">Criminal</SelectItem>
                  <SelectItem value="employment">Employment</SelectItem>
                  <SelectItem value="personal-injury">Personal Injury</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, jurisdiction: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Jurisdictions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jurisdictions</SelectItem>
                  <SelectItem value="Federal">Federal</SelectItem>
                  <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Texas">Texas</SelectItem>
                  <SelectItem value="Florida">Florida</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="time">Fastest Completion</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({})}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {templates.filter(t => !t.isEmergency).length + emergencyTemplates.length} templates
            {filters.search && ` for "${filters.search}"`}
            {filters.category && filters.category !== 'all' && ` in ${filters.category.replace('-', ' ')}`}
            {filters.jurisdiction && filters.jurisdiction !== 'all' && ` for ${filters.jurisdiction}`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Regular Templates */}
            {templates?.filter(t => !t.isEmergency).map((template) => {
              const templateData = JSON.parse(template.template || '{}');
              return (
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
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className="text-xs border-primary-200 text-primary-700"
                          >
                            {templateData.jurisdiction || 'General'}
                          </Badge>
                          {templateData.popularity && templateData.popularity > 70 && (
                            <div className="flex items-center text-xs text-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1" data-testid="template-name">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2" data-testid="template-description">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            <span data-testid="template-time">{template.estimatedTime}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {template.category.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

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

            {(!templates || (templates.filter(t => !t.isEmergency).length === 0 && emergencyTemplates.length === 0)) && (
              <div className="col-span-full text-center py-8 text-gray-500" data-testid="no-templates">
                No templates found matching your criteria. Try adjusting your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
