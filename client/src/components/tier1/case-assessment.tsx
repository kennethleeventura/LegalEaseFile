import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, DollarSign, Scale, TrendingUp, Users } from 'lucide-react';

interface CaseAssessmentData {
  caseType: string;
  jurisdiction: string;
  factPattern: string;
  partyType?: 'plaintiff' | 'defendant' | 'petitioner' | 'respondent';
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
}

interface CaseAssessmentResult {
  id: string;
  caseStrength: 'strong' | 'moderate' | 'weak';
  keyIssues: string[];
  recommendedStrategy: string;
  estimatedTimeframe: string;
  riskFactors: string[];
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
  estimatedCost: number;
  deadlines: Array<{
    type: string;
    date: string;
    description: string;
  }>;
  recommendedForms: Array<{
    id: string;
    name: string;
    urgency: string;
  }>;
  aiAnalysis: {
    caseStrength: string;
    keyIssues: string[];
    recommendedStrategy: string;
    estimatedTimeframe: string;
    riskFactors: string[];
  };
}

export default function CaseAssessment() {
  const [assessmentData, setAssessmentData] = useState<CaseAssessmentData>({
    caseType: '',
    jurisdiction: '',
    factPattern: '',
    partyType: undefined,
    urgency: undefined,
  });

  const [result, setResult] = useState<CaseAssessmentResult | null>(null);

  const assessmentMutation = useMutation({
    mutationFn: async (data: CaseAssessmentData): Promise<CaseAssessmentResult> => {
      const response = await fetch('/api/case-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assess case');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentData.caseType || !assessmentData.jurisdiction || !assessmentData.factPattern) {
      return;
    }
    assessmentMutation.mutate(assessmentData);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'weak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Case Assessment & Triage</h1>
        <p className="mt-2 text-lg text-gray-600">
          Get intelligent legal strategy recommendations and case analysis powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="mr-2 h-5 w-5" />
              Case Assessment Form
            </CardTitle>
            <CardDescription>
              Provide details about your case for AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="caseType">Case Type</Label>
                <Select
                  value={assessmentData.caseType}
                  onValueChange={(value) => setAssessmentData({...assessmentData, caseType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract Dispute</SelectItem>
                    <SelectItem value="tort">Personal Injury/Tort</SelectItem>
                    <SelectItem value="employment">Employment Law</SelectItem>
                    <SelectItem value="family">Family Law</SelectItem>
                    <SelectItem value="criminal">Criminal Defense</SelectItem>
                    <SelectItem value="business">Business Law</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="intellectual_property">Intellectual Property</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select
                  value={assessmentData.jurisdiction}
                  onValueChange={(value) => setAssessmentData({...assessmentData, jurisdiction: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FEDERAL">Federal Court</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="partyType">Your Role in Case</Label>
                <Select
                  value={assessmentData.partyType || ''}
                  onValueChange={(value) => setAssessmentData({...assessmentData, partyType: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plaintiff">Plaintiff</SelectItem>
                    <SelectItem value="defendant">Defendant</SelectItem>
                    <SelectItem value="petitioner">Petitioner</SelectItem>
                    <SelectItem value="respondent">Respondent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency">Case Urgency</Label>
                <Select
                  value={assessmentData.urgency || ''}
                  onValueChange={(value) => setAssessmentData({...assessmentData, urgency: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Standard timeline</SelectItem>
                    <SelectItem value="medium">Medium - Some time pressure</SelectItem>
                    <SelectItem value="high">High - Urgent deadlines</SelectItem>
                    <SelectItem value="emergency">Emergency - Immediate action needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="factPattern">Case Description</Label>
                <Textarea
                  id="factPattern"
                  placeholder="Describe the facts of your case, including key events, parties involved, and legal issues..."
                  value={assessmentData.factPattern}
                  onChange={(e) => setAssessmentData({...assessmentData, factPattern: e.target.value})}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={assessmentMutation.isPending || !assessmentData.caseType || !assessmentData.jurisdiction || !assessmentData.factPattern}
              >
                {assessmentMutation.isPending ? 'Analyzing Case...' : 'Get AI Assessment'}
              </Button>

              {assessmentMutation.error && (
                <div className="text-red-600 text-sm">
                  Error: {assessmentMutation.error.message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Assessment Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                AI Assessment Results
              </CardTitle>
              <CardDescription>
                Strategic analysis and recommendations for your case
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Case Strength & Complexity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Case Strength</Label>
                  <Badge className={`${getStrengthColor(result.caseStrength)} mt-1 w-full justify-center`}>
                    {result.caseStrength.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Complexity</Label>
                  <Badge className={`${getComplexityColor(result.estimatedComplexity)} mt-1 w-full justify-center`}>
                    {result.estimatedComplexity.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Estimated Cost & Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <Label className="text-sm font-medium">Est. Cost</Label>
                    <div className="text-lg font-semibold">${result.estimatedCost.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <Label className="text-sm font-medium">Timeline</Label>
                    <div className="text-lg font-semibold">{result.estimatedTimeframe}</div>
                  </div>
                </div>
              </div>

              {/* Recommended Strategy */}
              <div>
                <Label className="text-sm font-medium">Recommended Strategy</Label>
                <div className="mt-1 p-3 bg-blue-50 rounded-lg text-blue-900">
                  {result.recommendedStrategy}
                </div>
              </div>

              {/* Key Issues */}
              <div>
                <Label className="text-sm font-medium">Key Issues to Address</Label>
                <div className="mt-2 space-y-1">
                  {result.keyIssues.map((issue, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div>
                <Label className="text-sm font-medium">Risk Factors</Label>
                <div className="mt-2 space-y-1">
                  {result.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Forms */}
              <div>
                <Label className="text-sm font-medium">Recommended Filing Forms</Label>
                <div className="mt-2 space-y-2">
                  {result.recommendedForms.map((form, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{form.name}</span>
                      <Badge variant={form.urgency === 'immediate' ? 'destructive' : 'secondary'}>
                        {form.urgency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Deadlines */}
              <div>
                <Label className="text-sm font-medium">Critical Deadlines</Label>
                <div className="mt-2 space-y-2">
                  {result.deadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <div>
                        <div className="text-sm font-medium">{deadline.description}</div>
                        <div className="text-xs text-gray-600">{deadline.type}</div>
                      </div>
                      <Badge variant="destructive">
                        {new Date(deadline.date).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="mt-6 pt-4 border-t">
                <Button className="w-full">
                  Proceed to Document Generation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}