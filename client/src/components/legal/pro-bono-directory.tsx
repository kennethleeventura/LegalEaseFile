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

  // Comprehensive pro bono legal resources for Massachusetts - Based on verified 2025 data
  const sampleOrganizations: LegalAidOrganization[] = [
    // HOUSING ORGANIZATIONS
    {
      id: '1',
      name: "Greater Boston Legal Services (GBLS)",
      description: "Free civil legal aid for evictions, landlord/tenant, public housing in Boston and surrounding areas",
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
      name: "Community Legal Aid (CLA)",
      description: "Statewide legal aid for low-income Central and Western Mass (Berkshire, Franklin, Hampden, Hampshire, Worcester counties)",
      website: "https://communitylegal.org",
      phone: "(855) 252-5342",
      email: "info@communitylegal.org",
      address: "370 Main St, Ste 300, Worcester, MA 01608",
      location: "worcester",
      practiceAreas: JSON.stringify(["housing", "family", "benefits", "disability", "employment"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Full representation", "Housing assistance", "Filing assistance", "Benefits advocacy"]),
      eligibilityRequirements: "Low-income residents of Central/Western MA",
      createdAt: Date.now(),
    },
    {
      id: '3',
      name: "South Coastal Counties Legal Services (SCCLS)",
      description: "Free civil legal aid in Southeastern Mass, Cape Cod & Islands including eviction defense, foreclosure defense",
      website: "https://sccls.org",
      phone: "(800) 244-9023",
      email: "intake@sccls.org",
      address: "460 West Main St, Hyannis, MA 02601",
      location: "cape-cod",
      practiceAreas: JSON.stringify(["housing", "family", "benefits", "bankruptcy", "consumer"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Eviction defense", "Foreclosure defense", "Divorce", "Bankruptcy", "Filing assistance"]),
      eligibilityRequirements: "Low-income tenants, homeowners, victims of abuse",
      createdAt: Date.now(),
    },
    {
      id: '4',
      name: "MetroWest Legal Services (MWLS)",
      description: "Free legal aid in MetroWest region (Middlesex, Norfolk counties) including family law, housing, elder law",
      website: "https://metrowestlegal.org",
      phone: "(508) 620-1830",
      email: "intake@mwls.org",
      address: "63 Fountain St, Ste 304, Framingham, MA 01702",
      location: "framingham",
      practiceAreas: JSON.stringify(["family", "housing", "benefits", "elder-law", "immigration"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Family law", "Housing assistance", "Elder law", "Immigration", "Filing assistance"]),
      eligibilityRequirements: "Low-income residents of MetroWest",
      createdAt: Date.now(),
    },
    {
      id: '5',
      name: "Northeast Legal Aid (NLA)",
      description: "Free legal aid for low-income and elderly in Northeast MA (Essex and N. Middlesex counties)",
      website: "https://northeastlegalaid.org",
      phone: "(978) 458-1465",
      email: "intake@northeastlegalaid.org",
      address: "50 Island St, Ste 203A, Lawrence, MA 01840",
      location: "lawrence",
      practiceAreas: JSON.stringify(["housing", "family", "benefits", "consumer", "employment", "immigration"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Housing assistance", "Eviction defense", "Family law", "Benefits advocacy", "Filing assistance"]),
      eligibilityRequirements: "Low-income individuals in Essex and N. Middlesex counties",
      createdAt: Date.now(),
    },

    // PRO BONO PROGRAMS
    {
      id: '6',
      name: "Volunteer Lawyers Project (VLP)",
      description: "Boston-based pro bono provider serving Greater Boston with family law, housing, consumer debt",
      website: "https://vlpnet.org",
      phone: "(617) 603-1700",
      email: "intake@vlpnet.org",
      address: "29 Temple Place, Boston, MA 02111",
      location: "boston",
      practiceAreas: JSON.stringify(["family", "housing", "consumer", "guardianship", "small-business"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Pro bono attorney matching", "Family law", "Housing", "Consumer debt", "Filing assistance"]),
      eligibilityRequirements: "≤200% FPL for families in Greater Boston",
      createdAt: Date.now(),
    },
    {
      id: '7',
      name: "Boston College Legal Assistance Bureau (BCLAB)",
      description: "Student-run clinic providing free legal services for domestic violence, elder law, family law, real estate",
      website: "https://bc.edu/bc-web/schools/law/sites/students/lawyering-skills/legal-assistance-bureau.html",
      phone: "(617) 552-0248",
      email: "bclab@bc.edu",
      address: "885 Centre St, 3rd Floor Stuart Building, Newton, MA 02459",
      location: "newton",
      practiceAreas: JSON.stringify(["family", "elder-law", "housing", "civil-rights"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Domestic violence assistance", "Elder law", "Family law", "Landlord/tenant", "Filing assistance"]),
      eligibilityRequirements: "Low-income individuals",
      createdAt: Date.now(),
    },

    // SPECIALIZED SERVICES
    {
      id: '8',
      name: "Disability Law Center (DLC)",
      description: "Free legal advocacy for people with disabilities statewide (no income limit)",
      website: "https://dlc-ma.org",
      phone: "(800) 872-9992",
      email: "mail@dlc-ma.org",
      address: "11 Beacon Street, Boston, MA 02108",
      location: "statewide",
      practiceAreas: JSON.stringify(["disability", "civil-rights", "education", "healthcare", "housing"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Disability advocacy", "Special education", "ADA issues", "SSI appeals", "Filing assistance"]),
      eligibilityRequirements: "People with disabilities (no income limit)",
      createdAt: Date.now(),
    },

    // IMMIGRATION SERVICES
    {
      id: '9',
      name: "Political Asylum/Immigration Representation (PAIR) Project",
      description: "Nonprofit providing pro bono immigration representation including asylum and family visas",
      website: "https://pairproject.org",
      phone: "(617) 742-9296",
      email: "info@pairproject.org",
      address: "98 N. Washington St, Ste 106, Boston, MA 02114",
      location: "boston",
      practiceAreas: JSON.stringify(["immigration", "asylum", "family-visas"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Asylum representation", "Family visa petitions", "Immigration court defense", "Filing assistance"]),
      eligibilityRequirements: "Low-income immigrants",
      createdAt: Date.now(),
    },
    {
      id: '10',
      name: "Student Clinic for Immigrant Justice (SCIJ)",
      description: "Law student clinic handling asylum, family-based immigration, citizenship, victim visas",
      website: "https://immigrantjusticeclinic.org",
      phone: "(508) 794-9972",
      email: "info@immigrantjusticeclinic.org",
      address: "217 Hanover St, Ste 320, Boston, MA 02113",
      location: "boston",
      practiceAreas: JSON.stringify(["immigration", "asylum", "citizenship", "victim-visas"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Asylum cases", "Family immigration", "Citizenship applications", "Victim visas", "Filing assistance"]),
      eligibilityRequirements: "Low-income immigrants",
      createdAt: Date.now(),
    },

    // ELDER LAW & BENEFITS
    {
      id: '11',
      name: "Massachusetts Senior Legal Helpline (VLP)",
      description: "Free legal information and referrals for residents 60+ covering Medicare, Social Security, housing, estate planning",
      website: "https://vlpnet.org/senior-legal-helpline",
      phone: "(800) 342-5297",
      email: "seniors@vlpnet.org",
      address: "Telephone service statewide",
      location: "statewide",
      practiceAreas: JSON.stringify(["elder-law", "benefits", "housing", "consumer", "estate-planning"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Legal information", "Attorney referrals", "Medicare/Medicaid help", "Social Security", "Filing assistance"]),
      eligibilityRequirements: "Massachusetts residents 60 and older",
      createdAt: Date.now(),
    },

    // BANKRUPTCY & CONSUMER
    {
      id: '12',
      name: "VLP Bankruptcy Clinics",
      description: "Free bankruptcy clinics for eligible Chapter 7 debtors in Boston area",
      website: "https://vlpnet.org/bankruptcy",
      phone: "(617) 603-1700",
      email: "bankruptcy@vlpnet.org",
      address: "29 Temple Place, Boston, MA 02111",
      location: "boston",
      practiceAreas: JSON.stringify(["bankruptcy", "consumer", "debt-relief"]),
      availability: "within-week",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Chapter 7 bankruptcy", "Debt relief counseling", "Filing assistance", "Pro bono attorneys"]),
      eligibilityRequirements: "Income-eligible debtors",
      createdAt: Date.now(),
    },

    // COURT SELF-HELP
    {
      id: '13',
      name: "Massachusetts Court Service Centers",
      description: "Court-based self-help centers providing form completion and procedure guidance for pro se litigants",
      website: "https://mass.gov/court-service-centers",
      phone: "(617) 788-8810",
      email: "courthelp@jud.state.ma.us",
      address: "Multiple courthouse locations statewide",
      location: "statewide",
      practiceAreas: JSON.stringify(["family", "housing", "small-claims", "probate", "civil"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Filing assistance", "Form completion", "Procedure guidance", "Resource referrals", "Self-help materials"]),
      eligibilityRequirements: "All pro se litigants",
      createdAt: Date.now(),
    },

    // SLIDING SCALE SERVICES
    {
      id: '14',
      name: "De Novo Center for Justice and Healing",
      description: "Free and sliding-scale legal services for domestic violence victims and trafficking survivors",
      website: "https://denovocenter.org",
      phone: "(617) 661-1010",
      email: "intake@denovocenter.org",
      address: "47 Thorndike St, Cambridge, MA 02141",
      location: "cambridge",
      practiceAreas: JSON.stringify(["family", "housing", "immigration", "benefits"]),
      availability: "within-week",
      isEmergency: true,
      servicesOffered: JSON.stringify(["Domestic violence legal aid", "Housing assistance", "Immigration relief", "Sliding-scale fees", "Filing assistance"]),
      eligibilityRequirements: "Domestic violence/trafficking victims",
      createdAt: Date.now(),
    },

    // NATIONAL RESOURCES
    {
      id: '15',
      name: "Legal Services Corporation (LSC) Directory",
      description: "National directory to find legal aid organizations across the United States",
      website: "https://lsc.gov/find-legal-aid",
      phone: "(202) 295-1500",
      email: "info@lsc.gov",
      address: "National directory service",
      location: "national",
      practiceAreas: JSON.stringify(["all-areas"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Legal aid directory", "Resource referrals", "Out-of-state assistance", "National coordination"]),
      eligibilityRequirements: "Varies by local organization",
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
