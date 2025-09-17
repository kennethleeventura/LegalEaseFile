import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Brain,
  Target,
  DollarSign,
  Clock,
  Scale,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  FileText,
  Award,
  Zap,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface PredictiveAnalysisRequest {
  caseType: string;
  jurisdiction: string;
  factPattern: string;
  caseValue: number;
  opposingCounsel?: string;
  judgeAssignment?: string;
  timeframe: string;
  clientBudget: number;
}

interface OutcomePrediction {
  scenario: 'best_case' | 'most_likely' | 'worst_case';
  probability: number;
  expectedOutcome: string;
  estimatedValue: number;
  timeToResolution: string;
  keyFactors: string[];
}

interface MarketIntelligence {
  similarCases: Array<{
    caseType: string;
    outcome: string;
    duration: string;
    settlement: number;
    jurisdiction: string;
  }>;
  judgeAnalytics: {
    name: string;
    rulingTendencies: Array<{
      category: string;
      percentage: number;
    }>;
    averageTrialLength: string;
    settlementRate: number;
  };
  opposingCounselProfile: {
    name: string;
    winRate: number;
    averageSettlement: number;
    tacticalPreferences: string[];
  };
}

interface CostBenefitAnalysis {
  scenarios: Array<{
    strategy: string;
    estimatedCosts: number;
    expectedReturn: number;
    roi: number;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  breakEvenAnalysis: {
    minimumSettlement: number;
    costToTrial: number;
    probabilityBreakEven: number;
  };
}

interface PredictiveResult {
  id: string;
  caseStrength: number;
  winProbability: number;
  predictions: OutcomePrediction[];
  marketIntelligence: MarketIntelligence;
  costBenefitAnalysis: CostBenefitAnalysis;
  riskFactors: Array<{
    factor: string;
    impact: number;
    mitigation: string;
  }>;
  strategicRecommendations: string[];
  confidenceScore: number;
  dataPoints: number;
  lastUpdated: string;
}

export default function AIPredictiveAnalytics() {
  const [analysisRequest, setAnalysisRequest] = useState<PredictiveAnalysisRequest>({
    caseType: '',
    jurisdiction: '',
    factPattern: '',
    caseValue: 0,
    timeframe: '12_months',
    clientBudget: 0
  });

  const [result, setResult] = useState<PredictiveResult | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(false);

  // Mock predictive analytics mutation
  const analyticsMutation = useMutation({
    mutationFn: async (data: PredictiveAnalysisRequest): Promise<PredictiveResult> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult: PredictiveResult = {
        id: crypto.randomUUID(),
        caseStrength: Math.floor(Math.random() * 30) + 70,
        winProbability: Math.floor(Math.random() * 40) + 60,
        predictions: [
          {
            scenario: 'best_case',
            probability: 25,
            expectedOutcome: 'Full victory with attorney fees',
            estimatedValue: data.caseValue * 1.2,
            timeToResolution: '8-10 months',
            keyFactors: ['Strong evidence', 'Favorable precedent', 'Experienced counsel']
          },
          {
            scenario: 'most_likely',
            probability: 60,
            expectedOutcome: 'Favorable settlement',
            estimatedValue: data.caseValue * 0.75,
            timeToResolution: '6-8 months',
            keyFactors: ['Settlement negotiations', 'Mediation success', 'Cost considerations']
          },
          {
            scenario: 'worst_case',
            probability: 15,
            expectedOutcome: 'Unfavorable outcome',
            estimatedValue: data.caseValue * 0.1,
            timeToResolution: '12-18 months',
            keyFactors: ['Trial complexity', 'Evidence challenges', 'Appeal potential']
          }
        ],
        marketIntelligence: {
          similarCases: [
            { caseType: data.caseType, outcome: 'Plaintiff Victory', duration: '8 months', settlement: 185000, jurisdiction: data.jurisdiction },
            { caseType: data.caseType, outcome: 'Settlement', duration: '6 months', settlement: 120000, jurisdiction: data.jurisdiction },
            { caseType: data.caseType, outcome: 'Defendant Victory', duration: '14 months', settlement: 0, jurisdiction: data.jurisdiction }
          ],
          judgeAnalytics: {
            name: data.judgeAssignment || 'Judge TBD',
            rulingTendencies: [
              { category: 'Plaintiff Favorable', percentage: 65 },
              { category: 'Defendant Favorable', percentage: 35 }
            ],
            averageTrialLength: '12 days',
            settlementRate: 78
          },
          opposingCounselProfile: {
            name: data.opposingCounsel || 'Opposing Counsel',
            winRate: 68,
            averageSettlement: 145000,
            tacticalPreferences: ['Aggressive discovery', 'Early motions', 'Settlement pressure']
          }
        },
        costBenefitAnalysis: {
          scenarios: [
            {
              strategy: 'Aggressive Litigation',
              estimatedCosts: 85000,
              expectedReturn: 200000,
              roi: 135,
              riskLevel: 'high'
            },
            {
              strategy: 'Settlement Focus',
              estimatedCosts: 35000,
              expectedReturn: 150000,
              roi: 329,
              riskLevel: 'medium'
            },
            {
              strategy: 'Mediation First',
              estimatedCosts: 15000,
              expectedReturn: 120000,
              roi: 700,
              riskLevel: 'low'
            }
          ],
          breakEvenAnalysis: {
            minimumSettlement: 45000,
            costToTrial: 125000,
            probabilityBreakEven: 85
          }
        },
        riskFactors: [
          { factor: 'Statute of Limitations', impact: 15, mitigation: 'File within 30 days' },
          { factor: 'Evidence Quality', impact: 25, mitigation: 'Strengthen documentation' },
          { factor: 'Opposing Counsel Reputation', impact: 20, mitigation: 'Prepare for aggressive tactics' }
        ],
        strategicRecommendations: [
          'Focus on early settlement negotiations',
          'Prepare strong discovery strategy',
          'Consider alternative dispute resolution',
          'Monitor statute of limitations closely'
        ],
        confidenceScore: 87,
        dataPoints: 15842,
        lastUpdated: new Date().toISOString()
      };

      return mockResult;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisRequest.caseType || !analysisRequest.jurisdiction || !analysisRequest.factPattern) {
      return;
    }
    analyticsMutation.mutate(analysisRequest);
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'best_case': return 'bg-green-100 text-green-800';
      case 'most_likely': return 'bg-blue-100 text-blue-800';
      case 'worst_case': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (realTimeUpdates && result) {
      interval = setInterval(() => {
        setResult(prev => prev ? {
          ...prev,
          winProbability: Math.max(0, Math.min(100, prev.winProbability + (Math.random() - 0.5) * 5)),
          caseStrength: Math.max(0, Math.min(100, prev.caseStrength + (Math.random() - 0.5) * 3)),
          confidenceScore: Math.max(0, Math.min(100, prev.confidenceScore + (Math.random() - 0.5) * 2)),
          lastUpdated: new Date().toISOString()
        } : prev);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [realTimeUpdates, result]);

  // Chart data preparation
  const outcomeData = result?.predictions.map(p => ({
    scenario: p.scenario.replace('_', ' '),
    probability: p.probability,
    value: p.estimatedValue
  })) || [];

  const costBenefitData = result?.costBenefitAnalysis.scenarios.map(s => ({
    strategy: s.strategy,
    cost: s.estimatedCosts / 1000,
    return: s.expectedReturn / 1000,
    roi: s.roi
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">AI-Powered Predictive Analytics</h1>
        <p className="mt-2 text-lg text-gray-600">
          Advanced machine learning models for outcome prediction and strategic optimization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Request Form */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Predictive Analysis Setup
              </CardTitle>
              <CardDescription>
                Configure parameters for AI-powered case outcome prediction
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
                      <SelectItem value="tort">Personal Injury</SelectItem>
                      <SelectItem value="employment">Employment Law</SelectItem>
                      <SelectItem value="business">Business Litigation</SelectItem>
                      <SelectItem value="intellectual_property">IP Litigation</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
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
                  <Label htmlFor="caseValue">Case Value ($)</Label>
                  <Input
                    id="caseValue"
                    type="number"
                    value={analysisRequest.caseValue}
                    onChange={(e) => setAnalysisRequest({...analysisRequest, caseValue: parseInt(e.target.value)})}
                    placeholder="250000"
                  />
                </div>

                <div>
                  <Label htmlFor="clientBudget">Client Budget ($)</Label>
                  <Input
                    id="clientBudget"
                    type="number"
                    value={analysisRequest.clientBudget}
                    onChange={(e) => setAnalysisRequest({...analysisRequest, clientBudget: parseInt(e.target.value)})}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="timeframe">Expected Timeframe</Label>
                  <Select
                    value={analysisRequest.timeframe}
                    onValueChange={(value) => setAnalysisRequest({...analysisRequest, timeframe: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6_months">6 months</SelectItem>
                      <SelectItem value="12_months">12 months</SelectItem>
                      <SelectItem value="18_months">18 months</SelectItem>
                      <SelectItem value="24_months">24+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="opposingCounsel">Opposing Counsel (Optional)</Label>
                  <Input
                    id="opposingCounsel"
                    value={analysisRequest.opposingCounsel || ''}
                    onChange={(e) => setAnalysisRequest({...analysisRequest, opposingCounsel: e.target.value})}
                    placeholder="Law firm or attorney name"
                  />
                </div>

                <div>
                  <Label htmlFor="judgeAssignment">Judge Assignment (Optional)</Label>
                  <Input
                    id="judgeAssignment"
                    value={analysisRequest.judgeAssignment || ''}
                    onChange={(e) => setAnalysisRequest({...analysisRequest, judgeAssignment: e.target.value})}
                    placeholder="Judge name if known"
                  />
                </div>

                <div>
                  <Label htmlFor="factPattern">Case Facts & Key Details</Label>
                  <Textarea
                    id="factPattern"
                    value={analysisRequest.factPattern}
                    onChange={(e) => setAnalysisRequest({...analysisRequest, factPattern: e.target.value})}
                    placeholder="Detailed case facts for AI analysis..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={analyticsMutation.isPending}
                >
                  {analyticsMutation.isPending ? 'Analyzing...' : 'Generate Predictions'}
                </Button>

                {analyticsMutation.error && (
                  <div className="text-red-600 text-sm">
                    Error: {analyticsMutation.error.message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Real-time Monitoring */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Live Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Real-time Updates</Label>
                    <Button
                      variant={realTimeUpdates ? "destructive" : "default"}
                      size="sm"
                      onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                    >
                      {realTimeUpdates ? 'Stop' : 'Start'}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Win Probability</span>
                      <span className="font-medium">{result.winProbability}%</span>
                    </div>
                    <Progress value={result.winProbability} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span className="font-medium">{result.confidenceScore}%</span>
                    </div>
                    <Progress value={result.confidenceScore} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(result.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analytics Results */}
        <div className="lg:col-span-2">
          {result ? (
            <Tabs defaultValue="predictions" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
                <TabsTrigger value="costs">Cost-Benefit</TabsTrigger>
                <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Strategy</TabsTrigger>
              </TabsList>

              {/* Predictions Tab */}
              <TabsContent value="predictions">
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.winProbability}%</div>
                        <div className="text-sm text-gray-600">Win Probability</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{result.caseStrength}%</div>
                        <div className="text-sm text-gray-600">Case Strength</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{result.confidenceScore}%</div>
                        <div className="text-sm text-gray-600">AI Confidence</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Outcome Scenarios */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Outcome Scenarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.predictions.map((prediction, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium capitalize">{prediction.scenario.replace('_', ' ')}</h3>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getScenarioColor(prediction.scenario)}>
                                    {prediction.probability}% chance
                                  </Badge>
                                  <Badge variant="outline">
                                    ${prediction.estimatedValue.toLocaleString()}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{prediction.expectedOutcome}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{prediction.timeToResolution}</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Label className="text-xs">Key Factors:</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {prediction.keyFactors.map((factor, factorIndex) => (
                                    <Badge key={factorIndex} variant="outline" className="text-xs">
                                      {factor}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Outcome Probability Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Outcome Probability Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={outcomeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="scenario" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="probability" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Market Intelligence Tab */}
              <TabsContent value="intelligence">
                <div className="space-y-4">
                  {/* Judge Analytics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Scale className="mr-2 h-4 w-4" />
                        Judge Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium">Judge: {result.marketIntelligence.judgeAnalytics.name}</Label>
                          <div className="mt-2 space-y-2 text-sm">
                            <div>Settlement Rate: <span className="font-medium">{result.marketIntelligence.judgeAnalytics.settlementRate}%</span></div>
                            <div>Avg Trial Length: <span className="font-medium">{result.marketIntelligence.judgeAnalytics.averageTrialLength}</span></div>
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium">Ruling Tendencies</Label>
                          <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                              <Pie
                                data={result.marketIntelligence.judgeAnalytics.rulingTendencies}
                                dataKey="percentage"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                fill="#8884d8"
                              >
                                {result.marketIntelligence.judgeAnalytics.rulingTendencies.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Opposing Counsel Profile */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Opposing Counsel Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium">{result.marketIntelligence.opposingCounselProfile.name}</Label>
                          <div className="mt-2 space-y-2 text-sm">
                            <div>Win Rate: <span className="font-medium">{result.marketIntelligence.opposingCounselProfile.winRate}%</span></div>
                            <div>Avg Settlement: <span className="font-medium">${result.marketIntelligence.opposingCounselProfile.averageSettlement.toLocaleString()}</span></div>
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium">Tactical Preferences</Label>
                          <div className="mt-2 space-y-1">
                            {result.marketIntelligence.opposingCounselProfile.tacticalPreferences.map((tactic, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tactic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Similar Cases */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Similar Case Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.marketIntelligence.similarCases.map((case_, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium text-sm">{case_.caseType} - {case_.jurisdiction}</div>
                              <div className="text-xs text-gray-600">{case_.outcome} in {case_.duration}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${case_.settlement.toLocaleString()}</div>
                              <div className="text-xs text-gray-600">Settlement</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Cost-Benefit Analysis Tab */}
              <TabsContent value="costs">
                <div className="space-y-4">
                  {/* Strategy Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategy Cost-Benefit Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={costBenefitData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="strategy" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="cost" fill="#ff7875" name="Cost ($K)" />
                          <Bar dataKey="return" fill="#87d068" name="Expected Return ($K)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Strategy Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.costBenefitAnalysis.scenarios.map((scenario, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{scenario.strategy}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Cost:</span>
                            <span className="font-medium">${scenario.estimatedCosts.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Expected Return:</span>
                            <span className="font-medium text-green-600">${scenario.expectedReturn.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">ROI:</span>
                            <span className="font-medium text-blue-600">{scenario.roi}%</span>
                          </div>
                          <Badge className={getRiskColor(scenario.riskLevel)}>
                            {scenario.riskLevel} risk
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Break-even Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Break-even Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded">
                          <div className="text-2xl font-bold text-red-600">
                            ${result.costBenefitAnalysis.breakEvenAnalysis.minimumSettlement.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Minimum Settlement</div>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <div className="text-2xl font-bold text-orange-600">
                            ${result.costBenefitAnalysis.breakEvenAnalysis.costToTrial.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Cost to Trial</div>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <div className="text-2xl font-bold text-green-600">
                            {result.costBenefitAnalysis.breakEvenAnalysis.probabilityBreakEven}%
                          </div>
                          <div className="text-sm text-gray-600">Break-even Probability</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Risk Analysis Tab */}
              <TabsContent value="risks">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Risk Factor Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.riskFactors.map((risk, index) => (
                        <Card key={index} className="border-l-4 border-l-orange-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{risk.factor}</h3>
                              <Badge variant="outline">{risk.impact}% impact</Badge>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Mitigation Strategy:</Label>
                              <p className="text-sm text-gray-600">{risk.mitigation}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Strategic Recommendations Tab */}
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-4 w-4" />
                      AI Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.strategicRecommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-sm">{recommendation}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center text-blue-800 mb-2">
                        <Zap className="h-4 w-4 mr-2" />
                        <span className="font-medium">AI Insights</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Analysis based on {result.dataPoints.toLocaleString()} data points with {result.confidenceScore}% confidence.
                        Recommendations updated in real-time as new data becomes available.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Brain className="mx-auto h-12 w-12 mb-4" />
                <p>Configure case parameters to generate AI-powered predictions</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}