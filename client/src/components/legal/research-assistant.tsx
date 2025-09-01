import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  ExternalLink, 
  BookOpen, 
  Scale, 
  FileText,
  Star,
  Filter,
  Globe,
  ChevronRight,
  Gavel,
  Building,
  Users,
  Clock,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

interface LegalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  resourceType: "case_law" | "statute" | "regulation" | "form" | "guide" | "court_rule";
  jurisdiction: string;
  practiceArea?: string;
  court?: string;
  isOfficial: boolean;
  isFree: boolean;
  rating?: number;
  usageCount: number;
  tags: string[];
  lastVerified?: string;
}

const RESOURCE_TYPES = [
  { value: "case_law", label: "Case Law", icon: Scale, description: "Court decisions and precedents" },
  { value: "statute", label: "Statutes", icon: BookOpen, description: "Legislative laws and codes" },
  { value: "regulation", label: "Regulations", icon: Building, description: "Administrative rules and regulations" },
  { value: "court_rule", label: "Court Rules", icon: Gavel, description: "Procedural rules and local court rules" },
  { value: "form", label: "Forms", icon: FileText, description: "Legal forms and templates" },
  { value: "guide", label: "Guides", icon: Users, description: "Practice guides and how-to resources" },
];

const PRACTICE_AREAS = [
  "Civil Rights", "Contract Law", "Corporate Law", "Criminal Law", "Employment Law",
  "Family Law", "Immigration Law", "Intellectual Property", "Personal Injury", 
  "Real Estate", "Tax Law", "Bankruptcy", "Constitutional Law", "Environmental Law"
];

const JURISDICTIONS = [
  "Federal", "Massachusetts", "All States", "International"
];

// Curated free legal resources
const FEATURED_RESOURCES: LegalResource[] = [
  {
    id: "justia-case-law",
    title: "Justia Case Law",
    description: "Free access to millions of case law opinions from federal and state courts",
    url: "https://law.justia.com/cases/",
    resourceType: "case_law",
    jurisdiction: "Federal",
    isOfficial: false,
    isFree: true,
    rating: 4.5,
    usageCount: 1250,
    tags: ["comprehensive", "search", "free", "updated"]
  },
  {
    id: "google-scholar",
    title: "Google Scholar Legal",
    description: "Search case law, patents, and legal journals from Google Scholar",
    url: "https://scholar.google.com/schhp?hl=en&as_sdt=2006",
    resourceType: "case_law",
    jurisdiction: "Federal",
    isOfficial: false,
    isFree: true,
    rating: 4.2,
    usageCount: 980,
    tags: ["google", "academic", "patents", "journals"]
  },
  {
    id: "congress-gov",
    title: "Congress.gov",
    description: "Official source for federal legislation, congressional records, and bill tracking",
    url: "https://www.congress.gov/",
    resourceType: "statute",
    jurisdiction: "Federal",
    isOfficial: true,
    isFree: true,
    rating: 4.8,
    usageCount: 2100,
    tags: ["official", "federal", "bills", "congress"]
  },
  {
    id: "ma-courts",
    title: "Massachusetts Court System",
    description: "Official forms, rules, and procedures for Massachusetts state courts",
    url: "https://www.mass.gov/orgs/massachusetts-court-system",
    resourceType: "form",
    jurisdiction: "Massachusetts",
    court: "Massachusetts State Courts",
    isOfficial: true,
    isFree: true,
    rating: 4.6,
    usageCount: 850,
    tags: ["massachusetts", "official", "forms", "procedures"]
  },
  {
    id: "federal-rules",
    title: "Federal Rules of Civil Procedure",
    description: "Complete text of the Federal Rules of Civil Procedure with recent amendments",
    url: "https://www.law.cornell.edu/rules/frcp",
    resourceType: "court_rule",
    jurisdiction: "Federal",
    isOfficial: false,
    isFree: true,
    rating: 4.7,
    usageCount: 1500,
    tags: ["procedure", "federal", "rules", "cornell"]
  },
  {
    id: "cfr-ecfr",
    title: "Code of Federal Regulations (eCFR)",
    description: "Electronic Code of Federal Regulations - official daily updated version",
    url: "https://www.ecfr.gov/",
    resourceType: "regulation",
    jurisdiction: "Federal",
    isOfficial: true,
    isFree: true,
    rating: 4.5,
    usageCount: 750,
    tags: ["regulations", "federal", "official", "updated"]
  },
  {
    id: "legal-aid-forms",
    title: "LawHelp.org Forms",
    description: "Free legal forms and self-help resources for low-income individuals",
    url: "https://www.lawhelp.org/",
    resourceType: "form",
    jurisdiction: "All States",
    isOfficial: false,
    isFree: true,
    rating: 4.3,
    usageCount: 620,
    tags: ["pro-bono", "self-help", "forms", "legal-aid"]
  },
  {
    id: "nolo-legal-encyclopedia",
    title: "Nolo Legal Encyclopedia",
    description: "Plain-English legal information and guides for common legal issues",
    url: "https://www.nolo.com/legal-encyclopedia",
    resourceType: "guide",
    jurisdiction: "All States",
    isOfficial: false,
    isFree: true,
    rating: 4.4,
    usageCount: 890,
    tags: ["plain-english", "guides", "self-help", "practical"]
  }
];

export default function LegalResearchAssistant() {
  const { user, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterJurisdiction, setFilterJurisdiction] = useState("all");
  const [filterPracticeArea, setFilterPracticeArea] = useState("all");
  const [onlyFree, setOnlyFree] = useState(true);
  const [onlyOfficial, setOnlyOfficial] = useState(false);

  // Filter resources based on current filters
  const filteredResources = FEATURED_RESOURCES.filter((resource) => {
    const matchesSearch = searchTerm === "" || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || resource.resourceType === filterType;
    const matchesJurisdiction = filterJurisdiction === "all" || resource.jurisdiction === filterJurisdiction;
    const matchesPracticeArea = filterPracticeArea === "all" || resource.practiceArea === filterPracticeArea;
    const matchesFree = !onlyFree || resource.isFree;
    const matchesOfficial = !onlyOfficial || resource.isOfficial;
    
    return matchesSearch && matchesType && matchesJurisdiction && matchesPracticeArea && matchesFree && matchesOfficial;
  });

  const handleResourceClick = (resource: LegalResource) => {
    // Track usage
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  const ResourceCard = ({ resource }: { resource: LegalResource }) => {
    const TypeIcon = RESOURCE_TYPES.find(t => t.value === resource.resourceType)?.icon || FileText;
    
    return (
      <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer group"
            onClick={() => handleResourceClick(resource)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TypeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                  <ExternalLink className="h-4 w-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {RESOURCE_TYPES.find(t => t.value === resource.resourceType)?.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {resource.jurisdiction}
                  </Badge>
                  {resource.isOfficial && (
                    <Badge className="text-xs bg-green-100 text-green-800">
                      Official
                    </Badge>
                  )}
                  {resource.isFree && (
                    <Badge className="text-xs bg-blue-100 text-blue-800">
                      Free
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {resource.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1">{resource.rating}</span>
                </div>
              )}
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4" />
                <span className="ml-1">{resource.usageCount}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
          
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 4).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {tag}
                </span>
              ))}
              {resource.tags.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{resource.tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const QuickSearchCard = ({ title, description, searchUrl, icon: Icon }: {
    title: string;
    description: string;
    searchUrl: string;
    icon: any;
  }) => (
    <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer group"
          onClick={() => window.open(searchUrl, '_blank', 'noopener,noreferrer')}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
              <ExternalLink className="h-4 w-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Legal Research Assistant</h2>
        <p className="text-gray-600">
          Access free legal databases, case law, statutes, and research tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="search">Research Database</TabsTrigger>
          <TabsTrigger value="quick">Quick Search</TabsTrigger>
          <TabsTrigger value="resources">Resource Types</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search legal resources, cases, statutes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>Resource Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {RESOURCE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Jurisdiction</Label>
                  <Select value={filterJurisdiction} onValueChange={setFilterJurisdiction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jurisdictions</SelectItem>
                      {JURISDICTIONS.map(jurisdiction => (
                        <SelectItem key={jurisdiction} value={jurisdiction}>
                          {jurisdiction}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Practice Area</Label>
                  <Select value={filterPracticeArea} onValueChange={setFilterPracticeArea}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Practice Areas</SelectItem>
                      {PRACTICE_AREAS.map(area => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-4 pt-6">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={onlyFree}
                      onChange={(e) => setOnlyFree(e.target.checked)}
                      className="rounded"
                    />
                    <span>Free only</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={onlyOfficial}
                      onChange={(e) => setOnlyOfficial(e.target.checked)}
                      className="rounded"
                    />
                    <span>Official sources</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find relevant legal resources.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quick" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickSearchCard
              title="Case Law Search"
              description="Search federal and state court decisions"
              searchUrl="https://scholar.google.com/schhp?hl=en&as_sdt=2006"
              icon={Scale}
            />
            
            <QuickSearchCard
              title="Federal Statutes"
              description="U.S. Code and federal legislation"
              searchUrl="https://www.congress.gov/"
              icon={BookOpen}
            />
            
            <QuickSearchCard
              title="Massachusetts Law"
              description="State statutes and regulations"
              searchUrl="https://malegislature.gov/Laws/GeneralLaws"
              icon={Building}
            />
            
            <QuickSearchCard
              title="Court Rules"
              description="Federal and local court rules"
              searchUrl="https://www.law.cornell.edu/rules"
              icon={Gavel}
            />
            
            <QuickSearchCard
              title="Legal Forms"
              description="Free legal forms and templates"
              searchUrl="https://www.lawhelp.org/"
              icon={FileText}
            />
            
            <QuickSearchCard
              title="Law Journals"
              description="Academic legal articles and journals"
              searchUrl="https://scholar.google.com/schhp?hl=en&as_sdt=2006&as_vis=1"
              icon={Users}
            />
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESOURCE_TYPES.map((type) => (
              <Card key={type.value}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <type.icon className="h-5 w-5 text-blue-600" />
                    <span>{type.label}</span>
                  </CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {FEATURED_RESOURCES
                      .filter(r => r.resourceType === type.value)
                      .slice(0, 3)
                      .map((resource) => (
                      <Button
                        key={resource.id}
                        variant="ghost"
                        className="w-full justify-start h-auto p-2"
                        onClick={() => handleResourceClick(resource)}
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{resource.title}</div>
                          <div className="text-xs text-gray-500">{resource.jurisdiction}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}