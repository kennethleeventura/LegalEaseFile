import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, MapPin, Phone, Mail, Globe, Star, Calendar, Clock, Filter, Search, UserCheck, Scale, Gavel } from 'lucide-react';

interface ProBonoProvider {
  id: string;
  name: string;
  type: 'attorney' | 'law-firm' | 'legal-aid' | 'clinic' | 'nonprofit';
  specialties: string[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    languages: string[];
  };
  eligibility: {
    incomeLimit: number;
    assetLimit: number;
    caseTypes: string[];
    demographics: string[];
  };
  availability: {
    acceptingCases: boolean;
    waitTime: number;
    hoursPerWeek: number;
    nextAvailable: string;
  };
  ratings: {
    overall: number;
    responsiveness: number;
    expertise: number;
    communication: number;
    reviewCount: number;
  };
  verified: boolean;
  lastVerified: string;
}

interface EligibilityCheck {
  income: number;
  assets: number;
  familySize: number;
  caseType: string;
  location: string;
  language: string;
  urgency: 'immediate' | 'urgent' | 'routine';
}

interface ProBonoRequest {
  id: string;
  clientId: string;
  caseType: string;
  description: string;
  urgency: 'immediate' | 'urgent' | 'routine';
  location: string;
  preferredLanguage: string;
  status: 'pending' | 'matched' | 'declined' | 'completed';
  matchedProvider?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProBonoDirectory() {
  const [providers, setProviders] = useState<ProBonoProvider[]>([]);
  const [requests, setRequests] = useState<ProBonoRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [eligibilityForm, setEligibilityForm] = useState<EligibilityCheck>({
    income: 0,
    assets: 0,
    familySize: 1,
    caseType: '',
    location: '',
    language: 'English',
    urgency: 'routine'
  });

  const specialties = [
    'Family Law', 'Immigration', 'Housing', 'Employment', 'Consumer Rights',
    'Criminal Defense', 'Disability Rights', 'Bankruptcy', 'Civil Rights',
    'Domestic Violence', 'Elder Law', 'Veterans Affairs'
  ];

  const providerTypes = [
    { value: 'attorney', label: 'Individual Attorney' },
    { value: 'law-firm', label: 'Law Firm' },
    { value: 'legal-aid', label: 'Legal Aid Organization' },
    { value: 'clinic', label: 'Legal Clinic' },
    { value: 'nonprofit', label: 'Nonprofit Organization' }
  ];

  const urgencyLevels = [
    { value: 'immediate', label: 'Immediate (24-48 hours)', color: 'bg-red-500' },
    { value: 'urgent', label: 'Urgent (1-2 weeks)', color: 'bg-yellow-500' },
    { value: 'routine', label: 'Routine (1+ month)', color: 'bg-green-500' }
  ];

  useEffect(() => {
    fetchProviders();
    fetchRequests();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/pro-bono/providers');
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/pro-bono/requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const checkEligibility = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pro-bono/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eligibilityForm)
      });
      const data = await response.json();
      // Handle eligibility results
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
    setLoading(false);
  };

  const submitProBonoRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pro-bono/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eligibilityForm)
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    }
    setLoading(false);
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'all' || provider.specialties.includes(selectedSpecialty);
    const matchesLocation = selectedLocation === 'all' || provider.location.state === selectedLocation;
    const matchesType = selectedType === 'all' || provider.type === selectedType;
    return matchesSearch && matchesSpecialty && matchesLocation && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attorney': return <UserCheck className="h-4 w-4 gradient-icon" />;
      case 'law-firm': return <Scale className="h-4 w-4 gradient-icon" />;
      case 'legal-aid': return <Heart className="h-4 w-4 gradient-icon" />;
      case 'clinic': return <Users className="h-4 w-4 gradient-icon" />;
      case 'nonprofit': return <Gavel className="h-4 w-4 gradient-icon" />;
      default: return <UserCheck className="h-4 w-4 gradient-icon" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const totalProviders = providers.length;
  const availableProviders = providers.filter(p => p.availability.acceptingCases).length;
  const avgWaitTime = providers.length > 0 ?
    Math.round(providers.reduce((acc, p) => acc + p.availability.waitTime, 0) / providers.length) : 0;
  const totalHours = providers.reduce((acc, p) => acc + p.availability.hoursPerWeek, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Pro Bono Directory</h2>
          <p className="text-gray-600">Connect those in need with free legal assistance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-green-500 text-green-600">
            <Heart className="mr-2 h-4 w-4 gradient-icon" />
            Volunteer Attorney
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500">
            <Users className="mr-2 h-4 w-4 gradient-icon" />
            Request Pro Bono Help
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900">{totalProviders}</p>
              </div>
              <Users className="h-8 w-8 gradient-icon" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Now</p>
                <p className="text-2xl font-bold text-gray-900">{availableProviders}</p>
              </div>
              <UserCheck className="h-8 w-8 gradient-icon" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-gray-900">{avgWaitTime} days</p>
              </div>
              <Clock className="h-8 w-8 gradient-icon" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours/Week</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
              </div>
              <Heart className="h-8 w-8 gradient-icon" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="directory">Provider Directory</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility Check</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card>
            <CardHeader>
              <CardTitle>Pro Bono Legal Providers</CardTitle>
              <CardDescription>Find free legal assistance in your area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Providers</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 gradient-icon" />
                    <Input
                      id="search"
                      placeholder="Search by name, specialty, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Specialty</Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {providerTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredProviders.map((provider) => (
                  <Card key={provider.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(provider.type)}
                            <span className="text-sm text-gray-600">{providerTypes.find(t => t.value === provider.type)?.label}</span>
                          </div>
                          {provider.verified && (
                            <Badge className="bg-green-500">Verified</Badge>
                          )}
                          {provider.availability.acceptingCases && (
                            <Badge className="bg-blue-500">Accepting Cases</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(provider.ratings.overall)}
                          <span className="text-sm text-gray-600">
                            {provider.ratings.overall.toFixed(1)} ({provider.ratings.reviewCount} reviews)
                          </span>
                        </div>

                        <div className="flex gap-1 mb-3">
                          {provider.specialties.slice(0, 4).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {provider.specialties.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.specialties.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 gradient-icon" />
                              {provider.location.city}, {provider.location.state}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 gradient-icon" />
                              {provider.contact.phone}
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4 gradient-icon" />
                              {provider.contact.email}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="flex items-center gap-2">
                              <Clock className="h-4 w-4 gradient-icon" />
                              Wait time: {provider.availability.waitTime} days
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 gradient-icon" />
                              Next available: {new Date(provider.availability.nextAvailable).toLocaleDateString()}
                            </p>
                            <p className="text-xs">
                              Income limit: ${provider.eligibility.incomeLimit.toLocaleString()}/year
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-gray-500">
                            Languages: {provider.contact.languages.join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Phone className="h-4 w-4 gradient-icon" />
                          Contact
                        </Button>
                        {provider.contact.website && (
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4 gradient-icon" />
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility">
          <Card>
            <CardHeader>
              <CardTitle>Pro Bono Eligibility Check</CardTitle>
              <CardDescription>Check if you qualify for free legal assistance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income">Annual Household Income</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="$50,000"
                    value={eligibilityForm.income || ''}
                    onChange={(e) => setEligibilityForm({...eligibilityForm, income: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="assets">Total Assets (excluding home)</Label>
                  <Input
                    id="assets"
                    type="number"
                    placeholder="$10,000"
                    value={eligibilityForm.assets || ''}
                    onChange={(e) => setEligibilityForm({...eligibilityForm, assets: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="familySize">Family Size</Label>
                  <Input
                    id="familySize"
                    type="number"
                    min="1"
                    value={eligibilityForm.familySize}
                    onChange={(e) => setEligibilityForm({...eligibilityForm, familySize: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <Label>Case Type</Label>
                  <Select value={eligibilityForm.caseType} onValueChange={(value) => setEligibilityForm({...eligibilityForm, caseType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location (State)</Label>
                  <Input
                    id="location"
                    placeholder="California"
                    value={eligibilityForm.location}
                    onChange={(e) => setEligibilityForm({...eligibilityForm, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Preferred Language</Label>
                  <Select value={eligibilityForm.language} onValueChange={(value) => setEligibilityForm({...eligibilityForm, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Urgency Level</Label>
                <Select value={eligibilityForm.urgency} onValueChange={(value: 'immediate' | 'urgent' | 'routine') => setEligibilityForm({...eligibilityForm, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${level.color}`} />
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button onClick={checkEligibility} disabled={loading} className="flex-1">
                  <Filter className="mr-2 h-4 w-4 gradient-icon" />
                  Check Eligibility
                </Button>
                <Button onClick={submitProBonoRequest} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Heart className="mr-2 h-4 w-4 gradient-icon" />
                  Submit Request
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">General Eligibility Guidelines</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Income typically must be below 125% of Federal Poverty Guidelines</li>
                  <li>• Asset limits vary by organization and case type</li>
                  <li>• Priority given to urgent cases and vulnerable populations</li>
                  <li>• Some providers have specific demographic requirements</li>
                  <li>• Documentation of income and assets may be required</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>My Pro Bono Requests</CardTitle>
              <CardDescription>Track your requests for free legal assistance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 gradient-icon" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Yet</h3>
                  <p className="text-gray-600 mb-4">Submit your first pro bono request to get started</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Heart className="mr-2 h-4 w-4 gradient-icon" />
                    Submit Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <Card key={request.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{request.caseType}</h4>
                            <Badge variant={request.status === 'matched' ? 'default' : 'secondary'}>
                              {request.status}
                            </Badge>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${
                              urgencyLevels.find(u => u.value === request.urgency)?.color || 'bg-gray-500'
                            }`}>
                              {request.urgency}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Location: {request.location}</span>
                            <span>Language: {request.preferredLanguage}</span>
                            <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                          {request.matchedProvider && (
                            <div className="mt-2">
                              <Badge className="bg-green-500">
                                Matched with {request.matchedProvider}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {request.status === 'matched' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Phone className="h-4 w-4 gradient-icon" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteer">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer as a Pro Bono Attorney</CardTitle>
              <CardDescription>Join our network of attorneys providing free legal services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">Why Volunteer?</h4>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li>• Help those who cannot afford legal representation</li>
                    <li>• Gain experience in new practice areas</li>
                    <li>• Meet continuing education requirements</li>
                    <li>• Build professional network and reputation</li>
                    <li>• Make a meaningful impact in your community</li>
                  </ul>
                </div>

                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">Support Provided</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Malpractice insurance coverage</li>
                    <li>• Training and continuing education</li>
                    <li>• Mentorship from experienced attorneys</li>
                    <li>• Administrative and technical support</li>
                    <li>• Case referral and matching system</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3">Commitment Options</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-900">5-10 hrs</p>
                    <p className="text-sm text-yellow-800">Per month minimum</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-900">1-2 cases</p>
                    <p className="text-sm text-yellow-800">Concurrent active cases</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-900">6 months</p>
                    <p className="text-sm text-yellow-800">Minimum commitment</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Heart className="mr-2 h-4 w-4 gradient-icon" />
                  Apply to Volunteer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="mr-2 h-4 w-4 gradient-icon" />
                  Attend Info Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}