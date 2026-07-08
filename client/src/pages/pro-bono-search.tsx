import { useState } from "react";
import { ArrowLeft, Search, Phone, Globe, MapPin, CheckCircle, Filter, HandHeart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import EmergencyAlert from "@/components/legal/emergency-alert";

const organizations = [
  {
    id: 1,
    name: "Greater Boston Legal Services",
    phone: "(617) 603-1700",
    website: "www.gbls.org",
    location: "Boston, MA",
    state: "Massachusetts",
    practiceAreas: ["Family Law", "Housing", "Domestic Violence", "Immigration"],
    incomeThreshold: "125% Federal Poverty Level",
    caseTypes: ["Divorce", "Eviction Defense", "Restraining Orders"],
    description: "Comprehensive legal aid serving low-income individuals in greater Boston area.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish", "Portuguese"],
    emergency: true,
  },
  {
    id: 2,
    name: "Massachusetts Legal Aid",
    phone: "(617) 555-0120",
    website: "www.masslegalaid.org",
    location: "Statewide, MA",
    state: "Massachusetts",
    practiceAreas: ["Probate", "Elder Law", "Housing", "Benefits"],
    incomeThreshold: "200% Federal Poverty Level",
    caseTypes: ["Estate Administration", "Guardianship", "SSI/SSDI"],
    description: "Statewide network providing civil legal aid to Massachusetts residents.",
    availability: "Mon-Fri 8:30am-4:30pm",
    languages: ["English", "Spanish"],
    emergency: false,
  },
  {
    id: 3,
    name: "Cape Cod Legal Aid",
    phone: "(508) 775-7020",
    website: "www.capecodlegalaid.org",
    location: "Barnstable, MA",
    state: "Massachusetts",
    practiceAreas: ["Family Law", "Housing", "Probate", "Consumer"],
    incomeThreshold: "150% Federal Poverty Level",
    caseTypes: ["Divorce", "Child Custody", "Estate Disputes"],
    description: "Serving residents of Barnstable, Dukes, and Nantucket counties.",
    availability: "Mon-Thu 9am-4pm",
    languages: ["English", "Portuguese"],
    emergency: true,
  },
  {
    id: 4,
    name: "Volunteer Lawyers Project",
    phone: "(617) 423-0648",
    website: "www.vlpnet.org",
    location: "Boston, MA",
    state: "Massachusetts",
    practiceAreas: ["Family Law", "Housing", "Consumer", "Employment"],
    incomeThreshold: "200% Federal Poverty Level",
    caseTypes: ["Divorce", "Debt Collection", "Wrongful Termination"],
    description: "Pro bono legal assistance coordinated through volunteer attorneys.",
    availability: "Varies by volunteer",
    languages: ["English", "Spanish", "Haitian Creole"],
    emergency: false,
  },
  {
    id: 5,
    name: "Northeast Legal Aid",
    phone: "(978) 686-6900",
    website: "www.northeastlegalaid.org",
    location: "Lawrence, MA",
    state: "Massachusetts",
    practiceAreas: ["Immigration", "Housing", "Employment", "Family Law"],
    incomeThreshold: "125% Federal Poverty Level",
    caseTypes: ["DACA", "Eviction Defense", "Wage Theft"],
    description: "Serving Essex County and surrounding areas with a focus on immigrant communities.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish", "Portuguese", "Khmer"],
    emergency: true,
  },
  {
    id: 6,
    name: "California Rural Legal Assistance",
    phone: "(415) 777-2752",
    website: "www.crla.org",
    location: "San Francisco, CA",
    state: "California",
    practiceAreas: ["Immigration", "Labor", "Housing", "Family Law"],
    incomeThreshold: "125% Federal Poverty Level",
    caseTypes: ["Farmworker Rights", "Eviction Defense", "Immigration"],
    description: "Legal services for rural and migrant communities across California.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish"],
    emergency: false,
  },
  {
    id: 7,
    name: "Legal Aid Society of New York",
    phone: "(212) 577-3300",
    website: "www.legal-aid.org",
    location: "New York, NY",
    state: "New York",
    practiceAreas: ["Criminal Defense", "Family Law", "Housing", "Immigration"],
    incomeThreshold: "200% Federal Poverty Level",
    caseTypes: ["Public Defender", "Child Welfare", "Asylum"],
    description: "Nation's oldest and largest nonprofit legal services organization.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish", "Chinese", "Russian"],
    emergency: true,
  },
  {
    id: 8,
    name: "Texas RioGrande Legal Aid",
    phone: "(512) 374-2700",
    website: "www.trla.org",
    location: "Austin, TX",
    state: "Texas",
    practiceAreas: ["Immigration", "Housing", "Family Law", "Consumer"],
    incomeThreshold: "125% Federal Poverty Level",
    caseTypes: ["Asylum", "Domestic Violence", "Eviction Defense"],
    description: "Legal aid serving 68 counties in Southwest Texas and Puerto Rico.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish"],
    emergency: true,
  },
  {
    id: 9,
    name: "Florida Legal Services",
    phone: "(850) 385-9007",
    website: "www.floridalegal.org",
    location: "Tallahassee, FL",
    state: "Florida",
    practiceAreas: ["Housing", "Benefits", "Family Law", "Consumer"],
    incomeThreshold: "150% Federal Poverty Level",
    caseTypes: ["Hurricane Assistance", "Foreclosure Defense", "SSI"],
    description: "Statewide legal aid organization serving Florida's low-income residents.",
    availability: "Mon-Fri 8am-5pm",
    languages: ["English", "Spanish", "Haitian Creole"],
    emergency: false,
  },
  {
    id: 10,
    name: "Lawyers for Civil Rights",
    phone: "(617) 482-1145",
    website: "www.lawyersforcivilrights.org",
    location: "Boston, MA",
    state: "Massachusetts",
    practiceAreas: ["Civil Rights", "Immigration", "Employment", "Housing"],
    incomeThreshold: "No income limit",
    caseTypes: ["Discrimination", "Racial Justice", "Asylum"],
    description: "Fighting discrimination and advancing racial justice in New England.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish", "Somali", "Haitian Creole"],
    emergency: false,
  },
  {
    id: 11,
    name: "Harvard Law School Legal Aid Bureau",
    phone: "(617) 495-4408",
    website: "www.law.harvard.edu/students/orgs/lab",
    location: "Cambridge, MA",
    state: "Massachusetts",
    practiceAreas: ["Housing", "Family Law", "Benefits", "Consumer"],
    incomeThreshold: "125% Federal Poverty Level",
    caseTypes: ["Eviction Defense", "Child Custody", "Public Benefits"],
    description: "Student-staffed legal aid bureau providing free legal services to Cambridge residents.",
    availability: "Mon-Fri 9am-5pm (academic year)",
    languages: ["English", "Spanish"],
    emergency: false,
  },
  {
    id: 12,
    name: "MetroWest Legal Services",
    phone: "(508) 620-1830",
    website: "www.metrowestlegal.org",
    location: "Framingham, MA",
    state: "Massachusetts",
    practiceAreas: ["Housing", "Family Law", "Elder Law", "Immigration"],
    incomeThreshold: "200% Federal Poverty Level",
    caseTypes: ["Eviction", "Divorce", "Guardianship", "DACA"],
    description: "Legal services for residents of MetroWest Massachusetts communities.",
    availability: "Mon-Fri 9am-4pm",
    languages: ["English", "Spanish", "Portuguese", "Arabic"],
    emergency: true,
  },
  {
    id: 13,
    name: "Community Legal Aid",
    phone: "(508) 752-3718",
    website: "www.communitylegalaid.org",
    location: "Worcester, MA",
    state: "Massachusetts",
    practiceAreas: ["Housing", "Family Law", "Benefits", "Consumer"],
    incomeThreshold: "125% Federal Poverty Level",
    caseTypes: ["Eviction", "Domestic Violence", "SSI/SSDI"],
    description: "Legal aid serving Central and Western Massachusetts.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish", "Vietnamese"],
    emergency: true,
  },
  {
    id: 14,
    name: "Bay State Community Legal Services",
    phone: "(617) 939-4000",
    website: "www.bscls.org",
    location: "Chelsea, MA",
    state: "Massachusetts",
    practiceAreas: ["Immigration", "Housing", "Family Law", "Employment"],
    incomeThreshold: "150% Federal Poverty Level",
    caseTypes: ["Naturalization", "Eviction", "Wage Claims"],
    description: "Comprehensive legal services for low-income residents in Chelsea and surrounding cities.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish", "Portuguese"],
    emergency: false,
  },
  {
    id: 15,
    name: "Disability Law Center",
    phone: "(617) 723-8455",
    website: "www.dlc-ma.org",
    location: "Boston, MA",
    state: "Massachusetts",
    practiceAreas: ["Disability Rights", "Education", "Housing", "Benefits"],
    incomeThreshold: "No income limit (disability required)",
    caseTypes: ["Special Education", "ADA Accommodation", "SSI/SSDI Appeals"],
    description: "Protection and advocacy organization for people with disabilities in Massachusetts.",
    availability: "Mon-Fri 9am-5pm",
    languages: ["English", "Spanish"],
    emergency: true,
  },
];

const states = ["All States", "Massachusetts", "California", "New York", "Texas", "Florida"];
const practiceAreas = ["All Areas", "Family Law", "Housing", "Immigration", "Probate", "Elder Law", "Civil Rights", "Disability Rights", "Consumer", "Employment", "Criminal Defense", "Benefits"];
const incomeOptions = ["Any Income Level", "Below 125% FPL", "Below 150% FPL", "Below 200% FPL", "No Income Limit"];
const caseTypeOptions = ["All Case Types", "Divorce", "Child Custody", "Eviction Defense", "Estate Administration", "Immigration/Asylum", "Domestic Violence", "Discrimination", "SSI/SSDI", "Criminal Defense"];

export default function ProBonoSearch() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedIncome, setSelectedIncome] = useState("Any Income Level");
  const [selectedCaseType, setSelectedCaseType] = useState("All Case Types");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const filtered = organizations.filter((org) => {
    const matchesSearch =
      !searchQuery ||
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === "All States" || org.state === selectedState;
    const matchesArea = selectedArea === "All Areas" || org.practiceAreas.includes(selectedArea);
    const matchesCaseType = selectedCaseType === "All Case Types" || org.caseTypes.some((c) => c.includes(selectedCaseType.split("/")[0]));
    const matchesEmergency = !emergencyOnly || org.emergency;
    return matchesSearch && matchesState && matchesArea && matchesCaseType && matchesEmergency;
  });

  const handleApply = (org: typeof organizations[0]) => {
    toast({
      title: "Application Started",
      description: `Opening intake form for ${org.name}. You will be contacted within 2-3 business days.`,
    });
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" data-testid="pro-bono-search-page">
      <EmergencyAlert />

      {/* Header */}
      <div className="mb-6 px-4 sm:px-0">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <HandHeart className="mr-3 h-8 w-8 text-blue-600" />
              Find Legal Help Near You
            </h1>
            <p className="text-lg text-gray-600">
              Search our directory of {organizations.length} pro bono and legal aid organizations across the country.
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
            {filtered.length} Organizations Found
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 sm:px-0">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Filter className="mr-2 h-4 w-4" />
                Filter Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Name or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">State</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Practice Area */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Practice Area</Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceAreas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Case Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Case Type</Label>
                <Select value={selectedCaseType} onValueChange={setSelectedCaseType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypeOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Income Level */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Income Level</Label>
                <Select value={selectedIncome} onValueChange={setSelectedIncome}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeOptions.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Emergency Only */}
              <div className="flex items-center space-x-2 pt-2 border-t">
                <input
                  type="checkbox"
                  id="emergency-only"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <Label htmlFor="emergency-only" className="text-sm font-medium cursor-pointer">
                  Emergency services only
                </Label>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedState("All States");
                  setSelectedArea("All Areas");
                  setSelectedIncome("Any Income Level");
                  setSelectedCaseType("All Case Types");
                  setEmergencyOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3 space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-500">No organizations found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <HandHeart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {org.location}
                          </div>
                        </div>
                        {org.emergency && (
                          <Badge className="bg-red-100 text-red-700 ml-auto sm:ml-0">Emergency</Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{org.description}</p>

                      {/* Practice Areas */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {org.practiceAreas.map((area) => (
                          <Badge key={area} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-3.5 w-3.5 mr-2 text-blue-500 flex-shrink-0" />
                          <a href={`tel:${org.phone.replace(/\D/g, "")}`} className="hover:text-blue-600">
                            {org.phone}
                          </a>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Globe className="h-3.5 w-3.5 mr-2 text-blue-500 flex-shrink-0" />
                          <a
                            href={`https://${org.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 truncate"
                          >
                            {org.website}
                          </a>
                        </div>
                        <div className="flex items-start text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><span className="font-medium">Eligibility:</span> {org.incomeThreshold}</span>
                        </div>
                        <div className="flex items-start text-gray-600">
                          <ChevronDown className="h-3.5 w-3.5 mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
                          <span><span className="font-medium">Hours:</span> {org.availability}</span>
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Languages: </span>
                        {org.languages.join(", ")}
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 sm:min-w-[130px]">
                      <Button
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleApply(org)}
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={() => {
                          toast({
                            title: "Contact Info Copied",
                            description: `${org.phone} copied to clipboard`,
                          });
                        }}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Help Banner */}
      <div className="mt-8 px-4 sm:px-0">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-gray-900">Need Immediate Help?</h3>
                <p className="text-sm text-gray-600">
                  Call the Massachusetts Legal Aid hotline for immediate assistance: <strong>(617) 603-1700</strong>
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
