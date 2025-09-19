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

  // Temporary hardcoded data until server is restarted with fixes
  const sampleOrganizations: LegalAidOrganization[] = [
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
      servicesOffered: JSON.stringify(["Legal representation", "Self-help resources", "Community education"]),
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
      servicesOffered: JSON.stringify(["Legal representation", "Emergency assistance", "Self-help clinics"]),
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
      location: "statewide",
      practiceAreas: JSON.stringify(["housing", "civil-rights", "benefits", "immigration"]),
      availability: "immediate",
      isEmergency: false,
      servicesOffered: JSON.stringify(["Legal representation", "Benefits advocacy", "Housing assistance"]),
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
      servicesOffered: JSON.stringify(["24/7 hotline", "Emergency legal assistance", "Safety planning"]),
      eligibilityRequirements: "Domestic violence survivors",
      createdAt: Date.now(),
    },
  ];

  // Filter the hardcoded organizations based on current filters
  const getFilteredOrganizations = () => {
    let results = sampleOrganizations;

    if (filters.location) {
      results = results.filter(org =>
        org.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.availability) {
      results = results.filter(org => org.availability === filters.availability);
    }

    if (filters.isEmergency !== undefined) {
      results = results.filter(org => org.isEmergency === filters.isEmergency);
    }

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
        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-testid="search-filters">
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
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
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
                <SelectItem value="statewide">Statewide</SelectItem>
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
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            try {
                              const areas = typeof org.practiceAreas === 'string'
                                ? JSON.parse(org.practiceAreas)
                                : org.practiceAreas || [];
                              return areas.map((area: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-primary-100 text-primary-800"
                                  data-testid={`practice-area-${index}`}
                                >
                                  {area}
                                </Badge>
                              ));
                            } catch (e) {
                              return <span className="text-gray-500">Practice areas not available</span>;
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
