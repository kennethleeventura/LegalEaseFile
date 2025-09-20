import { useState } from "react";
import { Search, MapPin, Globe, Phone, ExternalLink, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import type { LegalAidOrganization } from "@shared/schema";
import type { LegalAidSearchFilters } from "@/lib/types";

export default function ProBonoDirectory() {
  const [filters, setFilters] = useState<LegalAidSearchFilters>({});

  // Comprehensive pro bono legal resources for Massachusetts
  const sampleOrganizations: LegalAidOrganization[] = [
    // Massachusetts Legal Aid Organizations
    {
      id: '1',
      name: "Greater Boston Legal Services",
      description: "Free civil legal assistance for low-income individuals and families",
      website: "https://gbls.org",
      phone: "(617) 371-1234",
      email: "intake@gbls.org",
      address: "197 Friend Street, Boston, MA 02114",
      location: "boston",
      practiceAreas: JSON.stringify(["housing", "family", "immigration", "benefits", "consumer"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Full representation", "Document preparation", "Filing assistance", "Self-help resources"]),
      eligibilityRequirements: "Low-income individuals and families",
      createdAt: Date.now(),
    },
    {
      id: '2',
      name: "Community Legal Aid",
      description: "Legal services for Central and Western Massachusetts",
      website: "https://communitylegal.org",
      phone: "(413) 781-7814",
      email: "info@communitylegal.org",
      address: "405 Main Street, Worcester, MA 01608",
      location: "worcester",
      practiceAreas: JSON.stringify(["family", "housing", "immigration", "benefits", "employment"]),
      availability: "immediate",
      isEmergency: true,
      servicesOffered: JSON.stringify(["Full representation", "Emergency assistance", "Filing assistance", "Self-help clinics"]),
      eligibilityRequirements: "Low to moderate income",
      createdAt: Date.now(),
    },
    {
      id: '3',
      name: "Northeast Legal Aid",
      description: "Comprehensive legal services for Northeastern Massachusetts",
      website: "https://northeastlegalaid.org",
      phone: "(978) 458-1465",
      email: "intake@northeastlegalaid.org",
      address: "Lawrence, Lowell, Haverhill offices",
      location: "lawrence",
      practiceAreas: JSON.stringify(["housing", "civil-rights", "benefits", "immigration"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Full representation", "Benefits advocacy", "Housing assistance", "Document review"]),
      eligibilityRequirements: "125% of Federal Poverty Guidelines",
      createdAt: Date.now(),
    },
    {
      id: '4',
      name: "REACH (Domestic Violence)",
      description: "Emergency domestic violence legal assistance",
      website: "https://reachma.org",
      phone: "(800) 899-4000",
      email: "legal@reachma.org",
      address: "24-hour hotline service",
      location: "statewide",
      practiceAreas: JSON.stringify(["family", "civil-rights"]),
      availability: "emergency",
      isEmergency: true,
      servicesOffered: JSON.stringify(["24/7 hotline", "Emergency filing", "Safety planning", "Court accompaniment"]),
      eligibilityRequirements: "Domestic violence survivors",
      createdAt: Date.now(),
    },
    // Additional Massachusetts Organizations
    {
      id: '5',
      name: "MetroWest Legal Services",
      description: "Legal aid for Framingham, Natick, and surrounding areas",
      website: "https://metrowestlegal.org",
      phone: "(508) 620-1830",
      email: "help@metrowestlegal.org",
      address: "73 Union Avenue, Framingham, MA 01702",
      location: "framingham",
      practiceAreas: JSON.stringify(["housing", "family", "benefits", "consumer", "elder-law"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Filing assistance", "Document preparation", "Legal clinics", "Self-help workshops"]),
      eligibilityRequirements: "Low-income residents of MetroWest",
      createdAt: Date.now(),
    },
    {
      id: '6',
      name: "South Coastal Counties Legal Services",
      description: "Legal aid for Plymouth, Bristol, and Barnstable Counties",
      website: "https://sccls.org",
      phone: "(508) 775-7020",
      email: "intake@sccls.org",
      address: "460 West Main Street, Hyannis, MA 02601",
      location: "cape-cod",
      practiceAreas: JSON.stringify(["housing", "family", "benefits", "immigration", "elder-law"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Full representation", "Filing assistance", "Senior legal clinic", "Immigration clinic"]),
      eligibilityRequirements: "Low-income individuals in service area",
      createdAt: Date.now(),
    },
    {
      id: '7',
      name: "Massachusetts Law Reform Institute",
      description: "Statewide policy advocacy and strategic litigation",
      website: "https://mlri.org",
      phone: "(617) 357-0700",
      email: "mlri@mlri.org",
      address: "99 Chauncy Street, Boston, MA 02111",
      location: "statewide",
      practiceAreas: JSON.stringify(["benefits", "housing", "healthcare", "civil-rights"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Policy advocacy", "Strategic litigation", "Legal research", "Training"]),
      eligibilityRequirements: "Systemic issues affecting low-income people",
      createdAt: Date.now(),
    },
    // Bar Association Pro Bono Programs
    {
      id: '8',
      name: "Boston Bar Association Volunteer Lawyers Project",
      description: "Pro bono legal services through volunteer attorneys",
      website: "https://bostonbar.org/vlp",
      phone: "(617) 742-0615",
      email: "vlp@bostonbar.org",
      address: "16 Beacon Street, Boston, MA 02108",
      location: "boston",
      practiceAreas: JSON.stringify(["family", "housing", "immigration", "disability", "elder-law"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Pro bono attorney matching", "Document preparation", "Filing assistance", "Legal clinics"]),
      eligibilityRequirements: "Low to moderate income",
      createdAt: Date.now(),
    },
    {
      id: '9',
      name: "Massachusetts Bar Association Pro Bono Program",
      description: "Statewide pro bono attorney referral service",
      website: "https://massbar.org/probono",
      phone: "(617) 338-0500",
      email: "probono@massbar.org",
      address: "20 West Street, Boston, MA 02111",
      location: "statewide",
      practiceAreas: JSON.stringify(["family", "housing", "immigration", "civil-rights", "bankruptcy"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Attorney matching", "Filing assistance", "Document review", "Brief legal consultations"]),
      eligibilityRequirements: "Financial hardship",
      createdAt: Date.now(),
    },
    // Self-Help and Filing Assistance Centers
    {
      id: '10',
      name: "Massachusetts Court Service Centers",
      description: "Court-based self-help centers for pro se litigants",
      website: "https://mass.gov/court-service-centers",
      phone: "(617) 788-8810",
      email: "courthelp@jud.state.ma.us",
      address: "Multiple courthouse locations statewide",
      location: "statewide",
      practiceAreas: JSON.stringify(["family", "housing", "small-claims", "probate"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Filing assistance", "Form completion", "Procedure guidance", "Resource referrals"]),
      eligibilityRequirements: "All pro se litigants",
      createdAt: Date.now(),
    },
    {
      id: '11',
      name: "Harvard Legal Aid Bureau",
      description: "Student-supervised legal clinic",
      website: "https://hls.harvard.edu/clinic/legal-aid-bureau",
      phone: "(617) 495-4408",
      email: "lab@law.harvard.edu",
      address: "122 Boylston Street, Jamaica Plain, MA 02130",
      location: "boston",
      practiceAreas: JSON.stringify(["family", "housing", "benefits", "immigration"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Full representation", "Filing assistance", "Document preparation", "Court accompaniment"]),
      eligibilityRequirements: "Low-income individuals",
      createdAt: Date.now(),
    },
    // Specialized Services
    {
      id: '12',
      name: "Disability Law Center",
      description: "Legal advocacy for people with disabilities",
      website: "https://dlc-ma.org",
      phone: "(617) 723-8455",
      email: "mail@dlc-ma.org",
      address: "11 Beacon Street, Boston, MA 02108",
      location: "statewide",
      practiceAreas: JSON.stringify(["disability", "civil-rights", "benefits", "education"]),
      availability: "immediate",
      isEmergency: true,
      servicesOffered: JSON.stringify(["Full representation", "Filing assistance", "Benefits advocacy", "Education advocacy"]),
      eligibilityRequirements: "People with disabilities",
      createdAt: Date.now(),
    },
    // Out-of-State Federal Resources
    {
      id: '13',
      name: "Legal Services Corporation (Federal)",
      description: "National directory of legal aid organizations",
      website: "https://lsc.gov/find-legal-aid",
      phone: "(202) 295-1500",
      email: "info@lsc.gov",
      address: "National headquarters with local referrals",
      location: "national",
      practiceAreas: JSON.stringify(["all-areas"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Legal aid directory", "Resource referrals", "National coordination"]),
      eligibilityRequirements: "Varies by local organization",
      createdAt: Date.now(),
    },
    {
      id: '14',
      name: "American Bar Association Free Legal Answers",
      description: "Online legal advice from volunteer attorneys",
      website: "https://abafreelegalanswers.org",
      phone: "Online service only",
      email: "support@abafreelegalanswers.org",
      address: "Virtual service",
      location: "national",
      practiceAreas: JSON.stringify(["family", "housing", "employment", "consumer", "immigration"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Online legal advice", "Document guidance", "Resource referrals"]),
      eligibilityRequirements: "Low-income individuals nationally",
      createdAt: Date.now(),
    }
  ];

  // Filter the hardcoded organizations based on current filters
  const getFilteredOrganizations = () => {
    let results = sampleOrganizations;

    // Location scope filtering (in-state vs national)
    if (filters.locationScope) {
      if (filters.locationScope === 'massachusetts') {
        results = results.filter(org => org.location !== 'national');
      } else if (filters.locationScope === 'national') {
        results = results.filter(org => org.location === 'national');
      }
    }

    // Specific location filtering
    if (filters.location) {
      results = results.filter(org =>
        org.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Service type filtering
    if (filters.serviceType) {
      results = results.filter(org => {
        const servicesOffered = JSON.parse(org.servicesOffered || "[]");
        const serviceMap: Record<string, string[]> = {
          'filing-assistance': ['Filing assistance', 'Emergency filing', 'Form completion'],
          'document-preparation': ['Document preparation', 'Document review'],
          'full-representation': ['Full representation', 'Legal representation'],
          'consultation': ['Brief legal consultations', 'Online legal advice'],
          'self-help': ['Self-help resources', 'Self-help workshops', 'Self-help clinics']
        };

        const targetServices = serviceMap[filters.serviceType!] || [];
        return servicesOffered.some((service: string) =>
          targetServices.some(target => service.toLowerCase().includes(target.toLowerCase()))
        );
      });
    }

    // Availability filtering
    if (filters.availability) {
      results = results.filter(org => org.availability === filters.availability);
    }

    // Emergency services filtering
    if (filters.isEmergency !== undefined) {
      results = results.filter(org => org.isEmergency === filters.isEmergency);
    }

    // Practice area filtering
    if (filters.practiceArea) {
      results = results.filter(org => {
        const practiceAreas = JSON.parse(org.practiceAreas || "[]");
        return practiceAreas.some((area: string) =>
          area.toLowerCase().includes(filters.practiceArea!.toLowerCase())
        );
      });
    }

    return results;
  };

  const organizations = getFilteredOrganizations();
  const isLoading = false;

  const handleFilterChange = (key: keyof LegalAidSearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? undefined : value
    }));
  };

  const handleContactOrg = (org: LegalAidOrganization) => {
    console.log(`Contacting ${org.name}`);
    // TODO: Implement contact functionality
  };

  return (
    <Card className="mb-8" data-testid="pro-bono-directory">
      <CardHeader>
        <CardTitle>Pro Bono Legal Services Directory</CardTitle>
        <CardDescription>
          Find qualified attorneys and legal aid organizations in Massachusetts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Service Type Information */}
        <Alert className="bg-blue-50 border border-blue-200 mb-6" data-testid="service-info">
          <Users className="h-5 w-5 gradient-icon" />
          <AlertDescription>
            <h3 className="font-medium text-blue-900 mb-2">Understanding Legal Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
              <div>
                <p className="font-medium">Filing Assistance:</p>
                <p>Help with court forms and filing procedures only</p>
              </div>
              <div>
                <p className="font-medium">Document Preparation:</p>
                <p>Legal document drafting and review services</p>
              </div>
              <div>
                <p className="font-medium">Full Representation:</p>
                <p>Attorney represents you throughout entire case</p>
              </div>
              <div>
                <p className="font-medium">Pro Se Resources:</p>
                <p>Self-help tools and guidance for representing yourself</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6" data-testid="search-filters">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Practice Area</label>
            <Select onValueChange={(value) => handleFilterChange('practiceArea', value)}>
              <SelectTrigger data-testid="filter-practice-area">
                <SelectValue placeholder="All Practice Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Practice Areas</SelectItem>
                <SelectItem value="family">Family Law</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="immigration">Immigration</SelectItem>
                <SelectItem value="employment">Employment</SelectItem>
                <SelectItem value="civil-rights">Civil Rights</SelectItem>
                <SelectItem value="bankruptcy">Bankruptcy</SelectItem>
                <SelectItem value="benefits">Benefits/Public Assistance</SelectItem>
                <SelectItem value="disability">Disability Law</SelectItem>
                <SelectItem value="elder-law">Elder Law</SelectItem>
                <SelectItem value="consumer">Consumer Protection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <Select onValueChange={(value) => handleFilterChange('serviceType', value)}>
              <SelectTrigger data-testid="filter-service-type">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="filing-assistance">Filing Assistance Only</SelectItem>
                <SelectItem value="document-preparation">Document Preparation</SelectItem>
                <SelectItem value="full-representation">Full Case Representation</SelectItem>
                <SelectItem value="consultation">Brief Consultation</SelectItem>
                <SelectItem value="self-help">Self-Help Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Scope</label>
            <Select onValueChange={(value) => handleFilterChange('locationScope', value)}>
              <SelectTrigger data-testid="filter-location-scope">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="massachusetts">Massachusetts Only</SelectItem>
                <SelectItem value="national">National/Out-of-State</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specific Location</label>
            <Select onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger data-testid="filter-location">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="boston">Boston</SelectItem>
                <SelectItem value="worcester">Worcester</SelectItem>
                <SelectItem value="springfield">Springfield</SelectItem>
                <SelectItem value="framingham">Framingham</SelectItem>
                <SelectItem value="lawrence">Lawrence/Lowell</SelectItem>
                <SelectItem value="cape-cod">Cape Cod</SelectItem>
                <SelectItem value="statewide">Massachusetts Statewide</SelectItem>
                <SelectItem value="national">National</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <Select onValueChange={(value) => handleFilterChange('availability', value)}>
              <SelectTrigger data-testid="filter-availability">
                <SelectValue placeholder="Any Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Availability</SelectItem>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="emergency">Emergency Only</SelectItem>
                <SelectItem value="within-week">Within 1 Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {/* Emergency Contacts */}
          <Alert className="bg-error-50 border border-error-200" data-testid="emergency-contacts">
            <Phone className="h-5 w-5 gradient-icon" />
            <AlertDescription>
              <div className="flex items-center mb-3">
                <h3 className="font-medium text-error-900">Emergency Legal Assistance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Domestic Violence</p>
                  <p className="text-error-700">
                    REACH:{" "}
                    <a 
                      href="tel:8008994000" 
                      className="underline"
                      data-testid="emergency-phone-reach"
                    >
                      (800) 899-4000
                    </a>
                  </p>
                </div>
                <div>
                  <p className="font-medium">Court Service Centers</p>
                  <p className="text-error-700">Immediate form assistance and referrals</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Organizations List */}
          {isLoading ? (
            <div className="text-center py-8" data-testid="organizations-loading">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading organizations...</p>
            </div>
          ) : organizations && organizations.length > 0 ? (
            organizations.map((org) => (
              <Card 
                key={org.id}
                className="border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200"
                data-testid={`organization-${org.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900" data-testid="org-name">
                        {org.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1" data-testid="org-description">
                        {org.description}
                      </p>

                      {/* Practice Areas */}
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Practice Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            try {
                              const areas = typeof org.practiceAreas === 'string'
                                ? JSON.parse(org.practiceAreas)
                                : org.practiceAreas || [];
                              return areas.map((area: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800 text-xs"
                                  data-testid={`practice-area-${index}`}
                                >
                                  {area.replace('-', ' ')}
                                </Badge>
                              ));
                            } catch (e) {
                              return <span className="text-gray-500">Practice areas not available</span>;
                            }
                          })()}
                        </div>
                      </div>

                      {/* Services Offered */}
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            try {
                              const services = typeof org.servicesOffered === 'string'
                                ? JSON.parse(org.servicesOffered)
                                : org.servicesOffered || [];
                              return services.map((service: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-green-50 border-green-200 text-green-800 text-xs"
                                  data-testid={`service-${index}`}
                                >
                                  {service}
                                </Badge>
                              ));
                            } catch (e) {
                              return <span className="text-gray-500">Services not available</span>;
                            }
                          })()}
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3 gradient-icon" />
                          <span data-testid="org-location">{org.location}</span>
                        </div>
                        {org.website && (
                          <div className="flex items-center">
                            <Globe className="mr-1 h-3 w-3 gradient-icon" />
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 underline"
                              data-testid="org-website"
                            >
                              {org.website.replace('https://', '')}
                            </a>
                          </div>
                        )}
                        {org.phone && (
                          <div className="flex items-center">
                            <Phone className="mr-1 h-3 w-3 gradient-icon" />
                            <a
                              href={`tel:${org.phone}`}
                              className="text-primary-600 hover:text-primary-700"
                              data-testid="org-phone"
                            >
                              {org.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Button
                        className="bg-primary-600 text-white hover:bg-primary-700"
                        onClick={() => handleContactOrg(org)}
                        data-testid="contact-org-button"
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500" data-testid="no-organizations">
              No organizations found matching your criteria. Try adjusting your filters.
            </div>
          )}

          {/* Mass Legal Resource Finder Integration */}
          <Alert className="bg-success-50 border border-success-200" data-testid="mass-legal-finder">
            <ExternalLink className="h-5 w-5 gradient-icon" />
            <AlertDescription>
              <div className="flex items-center">
                <div className="ml-3">
                  <h3 className="font-medium text-success-900">Massachusetts Legal Resource Finder</h3>
                  <p className="text-sm text-success-700 mt-1">
                    Access the official state portal for comprehensive legal help matching
                  </p>
                  <a
                    href="https://masslrf.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-success-600 hover:text-success-700 text-sm font-medium"
                    data-testid="masslrf-link"
                  >
                    Visit masslrf.org
                    <ExternalLink className="ml-1 h-3 w-3 gradient-icon" />
                  </a>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
