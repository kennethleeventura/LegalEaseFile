import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Target,
  TrendingUp,
  Scale,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Clock,
  FileText,
  Users,
  Shield,
  Lightbulb
} from 'lucide-react';

interface StrategyAnalysisRequest {
  caseId?: string;
  caseType: string;
  jurisdiction: string;
  factPattern: string;
  clientGoals: string[];
  budget: number;
  timeline: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  opposingCounsel?: string;
  judgeHistory?: string;
}

interface StrategicRecommendation {
  id: string;
  strategyType: 'litigation' | 'settlement' | 'alternative_dispute_resolution' | 'negotiation';
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  estimatedCost: number;
  estimatedTimeframe: string;
  successProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  requiredActions: string[];
  keyConsiderations: string[];
}

interface CompetitiveAnalysis {
  opposingCounselProfile: {
    name: string;
    experience: number;
    specialties: string[];
    winRate: number;
    typicalStrategies: string[];
    knownWeaknesses: string[];
  };
  judgeProfile: {
    name: string;
    tendencies: string[];
    rulingHistory: string[];
    preferences: string[];
  };
  marketIntelligence: {
    similarCases: Array<{
      title: string;
      outcome: string;
      strategy: string;
      timeline: string;
    }>;
    industryTrends: string[];
  };
}

interface StrategyAnalysisResult {
  id: string;
  caseStrength: number;
  primaryRecommendation: StrategicRecommendation;
  alternativeStrategies: StrategicRecommendation[];
  competitiveAnalysis: CompetitiveAnalysis;
  riskFactors: Array<{
    type: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  timelineAnalysis: {
    criticalDeadlines: Array<{
      date: string;
      description: string;
      importance: 'low' | 'medium' | 'high';
    }>;
    strategicMilestones: Array<{
      phase: string;
      duration: string;
      objectives: string[];
    }>;
  };
  budgetAnalysis: {
    estimatedTotal: number;
    breakdown: Array<{
      category: string;
      amount: number;
      description: string;
    }>;
    costSavingOpportunities: string[];
  };
  aiInsights: {
    keyFactors: string[];
    hiddenOpportunities: string[];
    strategicWarnings: string[];
  };
}

export default function AILegalStrategyAdvisor() {
  const [analysisRequest, setAnalysisRequest] = useState<StrategyAnalysisRequest>({
    caseType: '',
    jurisdiction: '',
    factPattern: '',
    clientGoals: [],
    budget: 0,
    timeline: '',
    riskTolerance: 'moderate'
  });

  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [result, setResult] = useState<StrategyAnalysisResult | null>(null);

  const strategyMutation = useMutation({
    mutationFn: async (data: StrategyAnalysisRequest): Promise<StrategyAnalysisResult> => {
      const response = await fetch('/api/tier2/strategy-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze strategy');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleAddGoal = () => {
    if (selectedGoal && !analysisRequest.clientGoals.includes(selectedGoal)) {
      setAnalysisRequest({
        ...analysisRequest,
        clientGoals: [...analysisRequest.clientGoals, selectedGoal]
      });
      setSelectedGoal('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setAnalysisRequest({
      ...analysisRequest,
      clientGoals: analysisRequest.clientGoals.filter(g => g !== goal)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisRequest.caseType || !analysisRequest.jurisdiction || !analysisRequest.factPattern) {
      return;
    }
    strategyMutation.mutate(analysisRequest);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Legal Strategy Advisor</h1>
        <p className="mt-2 text-lg text-gray-600">
          Advanced strategic analysis with competitive intelligence and market insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Input Form */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Strategy Analysis Request
              </CardTitle>
              <CardDescription>
                Provide comprehensive case details for AI-powered strategic analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="caseType">Case Type</Label>
                  <Select
                    value={analysisRequest.caseType}
                    onValueChange={(value) => setAnalysisRequest({...analysisRequest, caseType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract Dispute</SelectItem>
                      <SelectItem value="tort">Personal Injury/Tort</SelectItem>
                      <SelectItem value="employment">Employment Law</SelectItem>
                      <SelectItem value="business">Business Law</SelectItem>
                      <SelectItem value="intellectual_property">IP Law</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="family">Family Law</SelectItem>
                      <SelectItem value="criminal">Criminal Defense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select
                    value={analysisRequest.jurisdiction}
                    onValueChange={(value) => setAnalysisRequest({...analysisRequest, jurisdiction: value})}
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
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="factPattern">Case Facts & Background</Label>
                  <Textarea
                    id="factPattern"
                    placeholder="Provide detailed case facts, timeline, and relevant background information..."
                    value={analysisRequest.factPattern}
                    onChange={(e) => setAnalysisRequest({...analysisRequest, factPattern: e.target.value})}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <Label>Client Goals & Objectives</Label>
                  <div className="flex space-x-2 mt-1">
                    <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Add client goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maximize_damages">Maximize Damages</SelectItem>
                        <SelectItem value="quick_settlement">Quick Settlement</SelectItem>
                        <SelectItem value="establish_precedent">Establish Precedent</SelectItem>
                        <SelectItem value="minimize_cost">Minimize Cost</SelectItem>
                        <SelectItem value="preserve_relationship">Preserve Relationship</SelectItem>
                        <SelectItem value="public_vindication">Public Vindication</SelectItem>
                        <SelectItem value="injunctive_relief">Injunctive Relief</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddGoal} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {analysisRequest.clientGoals.map((goal, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveGoal(goal)}
                      >
                        {goal.replace('_', ' ')} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={analysisRequest.budget}
                    onChange={(e) => setAnalysisRequest({...analysisRequest, budget: parseInt(e.target.value)})}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Desired Timeline</Label>
                  <Select
                    value={analysisRequest.timeline}
                    onValueChange={(value) => setAnalysisRequest({...analysisRequest, timeline: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (1-3 months)</SelectItem>
                      <SelectItem value="standard">Standard (6-12 months)</SelectItem>
                      <SelectItem value="extended">Extended (1-2 years)</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select
                    value={analysisRequest.riskTolerance}
                    onValueChange={(value) => setAnalysisRequest({...analysisRequest, riskTolerance: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative - Minimize risk</SelectItem>
                      <SelectItem value="moderate">Moderate - Balanced approach</SelectItem>
                      <SelectItem value="aggressive">Aggressive - High risk/reward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="opposingCounsel">Opposing Counsel (optional)</Label>
                  <Input
                    id="opposingCounsel"
                    value={analysisRequest.opposingCounsel || ''}
                    onChange={(e) => setAnalysisRequest({...analysisRequest, opposingCounsel: e.target.value})}
                    placeholder="Law firm or attorney name"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={strategyMutation.isPending}
                >
                  {strategyMutation.isPending ? 'Analyzing Strategy...' : 'Get Strategic Analysis'}
                </Button>

                {strategyMutation.error && (
                  <div className="text-red-600 text-sm">
                    Error: {strategyMutation.error.message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Strategy Analysis Results */}
        <div className="lg:col-span-2">
          {result ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="strategies">Strategies</TabsTrigger>
                <TabsTrigger value="competitive">Intelligence</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5" />
                      Strategic Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Case Strength Indicator */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">Case Strength Score</Label>
                        <div className="text-2xl font-bold text-blue-600">{result.caseStrength}%</div>
                      </div>
                      <Scale className="h-8 w-8 text-blue-600" />
                    </div>

                    {/* Primary Recommendation */}
                    <div>
                      <Label className="text-lg font-semibold">Primary Strategic Recommendation</Label>
                      <div className="mt-2 p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{result.primaryRecommendation.title}</h3>
                          <div className="flex space-x-2">
                            <Badge className={getRiskColor(result.primaryRecommendation.riskLevel)}>
                              {result.primaryRecommendation.riskLevel} risk
                            </Badge>
                            <Badge variant="outline">
                              <span className={getSuccessColor(result.primaryRecommendation.successProbability)}>
                                {result.primaryRecommendation.successProbability}% success
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{result.primaryRecommendation.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="font-medium text-green-700">Advantages:</Label>
                            <ul className="list-disc list-inside text-green-600">
                              {result.primaryRecommendation.pros.map((pro, index) => (
                                <li key={index}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <Label className="font-medium text-red-700">Considerations:</Label>
                            <ul className="list-disc list-inside text-red-600">
                              {result.primaryRecommendation.cons.map((con, index) => (
                                <li key={index}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div>
                      <Label className="text-lg font-semibold flex items-center">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        AI Strategic Insights
                      </Label>
                      <div className="mt-2 space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Key Success Factors:</Label>
                          <div className="space-y-1">
                            {result.aiInsights.keyFactors.map((factor, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                                {factor}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Hidden Opportunities:</Label>
                          <div className="space-y-1">
                            {result.aiInsights.hiddenOpportunities.map((opportunity, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <TrendingUp className="h-3 w-3 text-blue-600 mr-2" />
                                {opportunity}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Strategic Warnings:</Label>
                          <div className="space-y-1">
                            {result.aiInsights.strategicWarnings.map((warning, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <AlertTriangle className="h-3 w-3 text-amber-600 mr-2" />
                                {warning}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Alternative Strategies Tab */}
              <TabsContent value="strategies">
                <Card>
                  <CardHeader>
                    <CardTitle>Alternative Strategic Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.alternativeStrategies.map((strategy, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{strategy.title}</h3>
                          <div className="flex space-x-2">
                            <Badge className={getRiskColor(strategy.riskLevel)}>
                              {strategy.riskLevel} risk
                            </Badge>
                            <Badge variant="outline">
                              <span className={getSuccessColor(strategy.successProbability)}>
                                {strategy.successProbability}% success
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="font-medium text-blue-700">Cost:</Label>
                            <div className="text-blue-600">${strategy.estimatedCost.toLocaleString()}</div>
                          </div>
                          <div>
                            <Label className="font-medium text-purple-700">Timeline:</Label>
                            <div className="text-purple-600">{strategy.estimatedTimeframe}</div>
                          </div>
                          <div>
                            <Label className="font-medium text-orange-700">Type:</Label>
                            <div className="text-orange-600 capitalize">{strategy.strategyType.replace('_', ' ')}</div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Label className="text-sm font-medium">Required Actions:</Label>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {strategy.requiredActions.map((action, actionIndex) => (
                              <li key={actionIndex}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Competitive Intelligence Tab */}
              <TabsContent value="competitive">
                <div className="space-y-4">
                  {/* Opposing Counsel Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        Opposing Counsel Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium">Profile Summary</Label>
                          <div className="mt-1 space-y-1 text-sm">
                            <div><strong>Experience:</strong> {result.competitiveAnalysis.opposingCounselProfile.experience} years</div>
                            <div><strong>Win Rate:</strong> {result.competitiveAnalysis.opposingCounselProfile.winRate}%</div>
                            <div><strong>Specialties:</strong> {result.competitiveAnalysis.opposingCounselProfile.specialties.join(', ')}</div>
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium">Strategic Intelligence</Label>
                          <div className="mt-1 space-y-1 text-sm">
                            <div><strong>Typical Strategies:</strong></div>
                            <ul className="list-disc list-inside ml-2">
                              {result.competitiveAnalysis.opposingCounselProfile.typicalStrategies.map((strategy, index) => (
                                <li key={index}>{strategy}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Market Intelligence */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Market Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="font-medium">Similar Recent Cases</Label>
                          <div className="mt-2 space-y-2">
                            {result.competitiveAnalysis.marketIntelligence.similarCases.map((case_, index) => (
                              <div key={index} className="border rounded p-2 text-sm">
                                <div className="font-medium">{case_.title}</div>
                                <div className="grid grid-cols-3 gap-2 mt-1 text-xs">
                                  <div><strong>Outcome:</strong> {case_.outcome}</div>
                                  <div><strong>Strategy:</strong> {case_.strategy}</div>
                                  <div><strong>Timeline:</strong> {case_.timeline}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Timeline Analysis Tab */}
              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Strategic Timeline Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Critical Deadlines */}
                    <div>
                      <Label className="text-lg font-semibold">Critical Deadlines</Label>
                      <div className="mt-2 space-y-2">
                        {result.timelineAnalysis.criticalDeadlines.map((deadline, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">{deadline.description}</div>
                              <div className="text-sm text-gray-600">{deadline.date}</div>
                            </div>
                            <Badge variant={deadline.importance === 'high' ? 'destructive' : deadline.importance === 'medium' ? 'default' : 'secondary'}>
                              {deadline.importance}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strategic Milestones */}
                    <div>
                      <Label className="text-lg font-semibold">Strategic Milestones</Label>
                      <div className="mt-2 space-y-3">
                        {result.timelineAnalysis.strategicMilestones.map((milestone, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{milestone.phase}</h3>
                              <Badge variant="outline">{milestone.duration}</Badge>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Key Objectives:</Label>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {milestone.objectives.map((objective, objIndex) => (
                                  <li key={objIndex}>{objective}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Budget Analysis Tab */}
              <TabsContent value="budget">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Strategic Budget Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Total Estimate */}
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Label className="text-sm font-medium">Estimated Total Cost</Label>
                      <div className="text-3xl font-bold text-green-600">
                        ${result.budgetAnalysis.estimatedTotal.toLocaleString()}
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div>
                      <Label className="text-lg font-semibold">Cost Breakdown</Label>
                      <div className="mt-2 space-y-2">
                        {result.budgetAnalysis.breakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">{item.category}</div>
                              <div className="text-sm text-gray-600">{item.description}</div>
                            </div>
                            <div className="font-semibold">${item.amount.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cost Saving Opportunities */}
                    <div>
                      <Label className="text-lg font-semibold">Cost-Saving Opportunities</Label>
                      <div className="mt-2 space-y-1">
                        {result.budgetAnalysis.costSavingOpportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <DollarSign className="h-3 w-3 text-green-600 mr-2" />
                            {opportunity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Brain className="mx-auto h-12 w-12 mb-4" />
                <p>Complete the strategy request form to get AI-powered legal analysis</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}