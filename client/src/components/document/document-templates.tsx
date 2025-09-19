import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, AlertTriangle, Clock, Zap, Download } from "lucide-react";

// Template data structure
interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  timeToComplete: string;
  isEmergency?: boolean;
  isPopular?: boolean;
  tags: string[];
}

// Mock template data
const templateData: Template[] = [
  {
    id: "complaint-civil",
    title: "Civil Complaint",
    description: "General civil complaint template for damages and relief",
    category: "civil-rights",
    jurisdiction: "federal",
    complexity: "intermediate",
    timeToComplete: "45 minutes",
    isPopular: true,
    tags: ["damages", "relief", "federal-court"]
  },
  {
    id: "motion-summary-judgment",
    title: "Motion for Summary Judgment",
    description: "Standard motion for summary judgment with supporting brief",
    category: "civil-rights",
    jurisdiction: "federal",
    complexity: "advanced",
    timeToComplete: "2 hours",
    isPopular: true,
    tags: ["motion", "summary-judgment", "brief"]
  },
  {
    id: "tro-request",
    title: "Temporary Restraining Order",
    description: "Emergency TRO request with expedited filing",
    category: "emergency",
    jurisdiction: "federal",
    complexity: "advanced",
    timeToComplete: "30 minutes",
    isEmergency: true,
    tags: ["emergency", "tro", "injunctive-relief"]
  }
];

interface DocumentTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

export default function DocumentTemplates({ onSelectTemplate }: DocumentTemplatesProps) {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    jurisdiction: 'all',
    complexity: 'all'
  });

  // Filter templates based on current filters
  const filteredTemplates = useMemo(() => {
    return templateData.filter(template => {
      const matchesSearch = !filters.search ||
        template.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        template.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));

      const matchesCategory = filters.category === 'all' || template.category === filters.category;
      const matchesJurisdiction = filters.jurisdiction === 'all' || template.jurisdiction === filters.jurisdiction;
      const matchesComplexity = filters.complexity === 'all' || template.complexity === filters.complexity;

      return matchesSearch && matchesCategory && matchesJurisdiction && matchesComplexity;
    });
  }, [filters]);

  const popularTemplates = templateData.filter(t => t.isPopular);
  const emergencyTemplates = templateData.filter(t => t.isEmergency);

  return (
    <div className="mb-8" data-testid="document-templates">
      {/* Popular Templates Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Popular Templates</CardTitle>
          <CardDescription>
            Most frequently used document templates by legal professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="h-5 w-5 mt-1 gradient-icon" />
                    <Badge variant="outline" className="text-xs">
                      {template.timeToComplete}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{template.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onSelectTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Template Library */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Template Library</CardTitle>
          <CardDescription>
            AI-powered document generation with essential legal templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 gradient-icon" />
                <Input
                  placeholder="Search templates, forms, or legal procedures..."
                  className="pl-10"
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <Filter className="h-5 w-5 gradient-icon" />
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
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="massachusetts">Massachusetts</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="california">California</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, complexity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Complexity</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => setFilters({ search: '', category: 'all', jurisdiction: 'all', complexity: 'all' })}>
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Emergency Templates */}
            {emergencyTemplates.map((template) => (
              <Card key={`emergency-${template.id}`} className="border-red-200 bg-red-50 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 gradient-icon" />
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        Emergency
                      </Badge>
                    </div>
                    <Zap className="h-4 w-4 gradient-icon" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1 gradient-icon" />
                      {template.timeToComplete}
                    </div>
                    <Badge variant="outline">
                      {template.complexity}
                    </Badge>
                  </div>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Download className="h-4 w-4 mr-2 gradient-icon" />
                    Emergency Filing
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Regular Templates */}
            {filteredTemplates.filter(t => !t.isEmergency).map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-6 w-6 gradient-icon" />
                    {template.isPopular && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1 gradient-icon" />
                      {template.timeToComplete}
                    </div>
                    <Badge variant="outline">
                      {template.complexity}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Download className="h-4 w-4 mr-2 gradient-icon" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}

            {filteredTemplates.length === 0 && (
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