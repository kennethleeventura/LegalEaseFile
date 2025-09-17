import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  CheckCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Users,
  Phone,
  MapPin,
  ExternalLink,
  Lightbulb,
  Target,
  FileText,
  Scale,
  HelpCircle,
  ArrowRight,
  Star
} from 'lucide-react';

interface GuidanceRequest {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  caseType: string;
  jurisdiction: string;
  currentStep: string;
  question?: string;
}

interface GuidanceRecommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  estimatedTime: string;
}

interface GuidanceResource {
  title: string;
  url: string;
  description: string;
  type: 'form' | 'guide' | 'video' | 'contact';
}

interface GuidanceResult {
  id: string;
  userLevel: string;
  currentStep: string;
  recommendations: GuidanceRecommendation[];
  nextSteps: string[];
  warningsAndTips: string[];
  resources: GuidanceResource[];
  progressTracking: {
    completedSteps: number;
    totalSteps: number;
    percentComplete: number;
  };
}

export default function ProSeGuidanceSystem() {
  const [guidanceRequest, setGuidanceRequest] = useState<GuidanceRequest>({
    userLevel: 'beginner',
    caseType: '',
    jurisdiction: '',
    currentStep: 'getting_started',
    question: ''
  });

  const [result, setResult] = useState<GuidanceResult | null>(null);

  const guidanceMutation = useMutation({
    mutationFn: async (data: GuidanceRequest): Promise<GuidanceResult> => {
      const response = await fetch('/api/tier2/pro-se-guidance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get guidance');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidanceRequest.caseType || !guidanceRequest.jurisdiction) {
      return;
    }
    guidanceMutation.mutate(guidanceRequest);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'form': return <FileText className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'video': return <GraduationCap className="h-4 w-4" />;
      case 'contact': return <Phone className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  // Mock legal aid organizations
  const legalAidOrganizations = [
    {
      name: "California Legal Aid Foundation",
      description: "Free legal services for low-income individuals",
      phone: "(555) 123-4567",
      website: "https://calegalaid.org",
      services: ["Family Law", "Housing", "Immigration"],
      eligibility: "Income below 125% of federal poverty level"
    },
    {
      name: "Self-Help Legal Access Center",
      description: "Self-help resources and assistance",
      phone: "(555) 234-5678",
      website: "https://selfhelplegal.org",
      services: ["Document Preparation", "Court Navigation", "Legal Education"],
      eligibility: "Open to all"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Pro Se Guidance System</h1>
        <p className="mt-2 text-lg text-gray-600">
          Intelligent assistance for self-represented litigants with step-by-step guidance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guidance Request Form */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Get Personalized Guidance
              </CardTitle>
              <CardDescription>
                Tell us about your situation to receive customized assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="userLevel">Your Legal Experience Level</Label>
                  <Select
                    value={guidanceRequest.userLevel}
                    onValueChange={(value) => setGuidanceRequest({...guidanceRequest, userLevel: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - New to legal processes</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                      <SelectItem value="advanced">Advanced - Familiar with legal procedures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="caseType">Type of Legal Matter</Label>
                  <Select
                    value={guidanceRequest.caseType}
                    onValueChange={(value) => setGuidanceRequest({...guidanceRequest, caseType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small_claims">Small Claims</SelectItem>
                      <SelectItem value="family">Family Law</SelectItem>
                      <SelectItem value="landlord_tenant">Landlord/Tenant</SelectItem>
                      <SelectItem value="debt_collection">Debt Collection</SelectItem>
                      <SelectItem value="employment">Employment Issues</SelectItem>
                      <SelectItem value="contract">Contract Dispute</SelectItem>
                      <SelectItem value="other">Other Civil Matter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="jurisdiction">Your Location</Label>
                  <Select
                    value={guidanceRequest.jurisdiction}
                    onValueChange={(value) => setGuidanceRequest({...guidanceRequest, jurisdiction: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currentStep">Where are you in the process?</Label>
                  <Select
                    value={guidanceRequest.currentStep}
                    onValueChange={(value) => setGuidanceRequest({...guidanceRequest, currentStep: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select current step" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="getting_started">Just getting started</SelectItem>
                      <SelectItem value="researching">Researching my options</SelectItem>
                      <SelectItem value="preparing_documents">Preparing documents</SelectItem>
                      <SelectItem value="ready_to_file">Ready to file</SelectItem>
                      <SelectItem value="case_filed">Case already filed</SelectItem>
                      <SelectItem value="court_proceedings">In court proceedings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="question">Specific Question (Optional)</Label>
                  <Textarea
                    id="question"
                    value={guidanceRequest.question || ''}
                    onChange={(e) => setGuidanceRequest({...guidanceRequest, question: e.target.value})}
                    placeholder="What specific help do you need?"
                    className="min-h-[80px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={guidanceMutation.isPending}
                >
                  {guidanceMutation.isPending ? 'Getting Guidance...' : 'Get Personalized Guidance'}
                </Button>

                {guidanceMutation.error && (
                  <div className="text-red-600 text-sm">
                    Error: {guidanceMutation.error.message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Progress Tracker */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Case Progress</span>
                    <span>{result.progressTracking.percentComplete}% Complete</span>
                  </div>
                  <Progress value={result.progressTracking.percentComplete} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {result.progressTracking.completedSteps} of {result.progressTracking.totalSteps} steps completed
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Guidance Results */}
        <div className="lg:col-span-2">
          {result ? (
            <Tabs defaultValue="recommendations" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="legal_aid">Legal Aid</TabsTrigger>
                <TabsTrigger value="tips">Tips & Warnings</TabsTrigger>
              </TabsList>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5" />
                      Personalized Recommendations
                    </CardTitle>
                    <CardDescription>
                      Based on your experience level and case type
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.recommendations.map((rec, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{rec.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority}
                              </Badge>
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {rec.estimatedTime}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                          <div>
                            <Label className="text-sm font-medium">Action Items:</Label>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {rec.actionItems.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Next Steps */}
                    <Card className="bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Your Next Steps
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {result.nextSteps.map((step, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text border border-blue-300" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                                {index + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Helpful Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.resources.map((resource, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                              {getResourceIcon(resource.type)}
                              <span className="font-medium text-sm">{resource.title}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                            <Button size="sm" variant="outline" className="w-full">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Access Resource
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Quick Reference Guides */}
                    <div className="mt-6">
                      <Label className="text-lg font-semibold">Quick Reference Guides</Label>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Court Filing Checklist
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Scale className="h-4 w-4 mr-2" />
                          Legal Terminology Guide
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Clock className="h-4 w-4 mr-2" />
                          Important Deadlines
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          Court Locations & Info
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Legal Aid Tab */}
              <TabsContent value="legal_aid">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Legal Aid & Assistance
                    </CardTitle>
                    <CardDescription>
                      Free and low-cost legal help in your area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {legalAidOrganizations.map((org, index) => (
                        <Card key={index} className="border">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{org.name}</h3>
                              <Badge variant="outline">Free Services</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-gray-600">{org.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="font-medium">Contact:</Label>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-3 w-3" />
                                  <span>{org.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <ExternalLink className="h-3 w-3" />
                                  <a href={org.website} className="text-blue-600 hover:underline">
                                    {org.website}
                                  </a>
                                </div>
                              </div>
                              <div>
                                <Label className="font-medium">Services:</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {org.services.map((service, serviceIndex) => (
                                    <Badge key={serviceIndex} variant="outline" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="font-medium text-green-700">Eligibility:</Label>
                              <div className="text-sm text-green-600">{org.eligibility}</div>
                            </div>

                            <div className="flex space-x-2">
                              <Button size="sm" className="flex-1">
                                <Phone className="h-3 w-3 mr-1" />
                                Call Now
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Visit Website
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tips & Warnings Tab */}
              <TabsContent value="tips">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-amber-700">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Important Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.warningsAndTips.map((warning, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                            <span className="text-sm">{warning}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-700">
                        <Star className="mr-2 h-5 w-5" />
                        Pro Tips for Success
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Organize all documents chronologically before going to court</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Practice your presentation and prepare for likely questions</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Arrive early to court and dress professionally</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Bring extra copies of all documents for the judge and opposing party</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5" />
                        When to Consider an Attorney
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>Consider hiring an attorney if:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Your case involves complex legal issues</li>
                          <li>Significant money or property is at stake</li>
                          <li>The other party has an attorney</li>
                          <li>You feel overwhelmed by the legal process</li>
                          <li>Criminal charges are involved</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <GraduationCap className="mx-auto h-12 w-12 mb-4" />
                <p>Complete the guidance form to receive personalized assistance</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}