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
import { AlertCircle, TrendingUp, Search, Target, Bot, Eye, CheckCircle, X, RefreshCw, Globe, BarChart3, Zap, FileText, Users, Clock, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface SEOMetric {
  id: string;
  page: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  currentRank: number;
  targetRank: number;
  searchVolume: number;
  difficulty: number;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  lastUpdated: string;
  status: 'optimized' | 'needs-work' | 'new' | 'monitoring';
}

interface SEORecommendation {
  id: string;
  page: string;
  type: 'title' | 'meta' | 'content' | 'technical' | 'links';
  priority: 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
  estimatedImpact: number;
  effort: 'low' | 'medium' | 'high';
  implementedAt?: string;
}

interface CompetitorData {
  domain: string;
  rank: number;
  keywords: number;
  backlinks: number;
  traffic: number;
  domainAuthority: number;
}

interface KeywordOpportunity {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  currentRank?: number;
  targetRank: number;
  competitorRank: number;
  opportunity: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
}

export default function SEOOptimizationSystem() {
  const [metrics, setMetrics] = useState<SEOMetric[]>([]);
  const [recommendations, setRecommendations] = useState<SEORecommendation[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [opportunities, setOpportunities] = useState<KeywordOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [auditTarget, setAuditTarget] = useState('');

  useEffect(() => {
    fetchSEOMetrics();
    fetchRecommendations();
    fetchCompetitorData();
    fetchKeywordOpportunities();
  }, []);

  const fetchSEOMetrics = async () => {
    try {
      const response = await fetch('/api/seo/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching SEO metrics:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/seo/recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchCompetitorData = async () => {
    try {
      const response = await fetch('/api/seo/competitors');
      const data = await response.json();
      setCompetitors(data);
    } catch (error) {
      console.error('Error fetching competitor data:', error);
    }
  };

  const fetchKeywordOpportunities = async () => {
    try {
      const response = await fetch('/api/seo/opportunities');
      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      console.error('Error fetching keyword opportunities:', error);
    }
  };

  const runSEOAudit = async () => {
    setLoading(true);
    try {
      await fetch('/api/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: auditTarget || window.location.origin })
      });
      fetchSEOMetrics();
      fetchRecommendations();
    } catch (error) {
      console.error('Error running SEO audit:', error);
    }
    setLoading(false);
  };

  const generateOptimizations = async () => {
    setLoading(true);
    try {
      await fetch('/api/seo/generate-optimizations', { method: 'POST' });
      fetchRecommendations();
    } catch (error) {
      console.error('Error generating optimizations:', error);
    }
    setLoading(false);
  };

  const implementRecommendation = async (recommendationId: string) => {
    try {
      await fetch(`/api/seo/recommendations/${recommendationId}/implement`, { method: 'POST' });
      fetchRecommendations();
      fetchSEOMetrics();
    } catch (error) {
      console.error('Error implementing recommendation:', error);
    }
  };

  const dismissRecommendation = async (recommendationId: string) => {
    try {
      await fetch(`/api/seo/recommendations/${recommendationId}`, { method: 'DELETE' });
      fetchRecommendations();
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-500';
      case 'needs-work': return 'bg-red-500';
      case 'new': return 'bg-blue-500';
      case 'monitoring': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesPage = selectedPage === 'all' || rec.page.includes(selectedPage);
    const matchesPriority = selectedPriority === 'all' || rec.priority === selectedPriority;
    return matchesPage && matchesPriority;
  });

  const overallScore = Math.round(metrics.length > 0 ?
    metrics.reduce((acc, metric) => acc + (metric.status === 'optimized' ? 100 : metric.status === 'monitoring' ? 75 : 50), 0) / metrics.length : 0
  );

  const totalClicks = metrics.reduce((acc, metric) => acc + metric.clicks, 0);
  const totalImpressions = metrics.reduce((acc, metric) => acc + metric.impressions, 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const averagePosition = metrics.length > 0 ? metrics.reduce((acc, metric) => acc + metric.position, 0) / metrics.length : 0;

  const performanceData = [
    { name: 'Clicks', value: totalClicks, color: '#3B82F6' },
    { name: 'Impressions', value: totalImpressions, color: '#10B981' },
    { name: 'CTR (%)', value: Math.round(averageCTR * 100) / 100, color: '#F59E0B' },
    { name: 'Avg Position', value: Math.round(averagePosition * 10) / 10, color: '#8B5CF6' }
  ];

  const radarData = [
    { subject: 'Technical SEO', score: 85, fullMark: 100 },
    { subject: 'Content Quality', score: 78, fullMark: 100 },
    { subject: 'Keywords', score: 92, fullMark: 100 },
    { subject: 'Backlinks', score: 67, fullMark: 100 },
    { subject: 'User Experience', score: 88, fullMark: 100 },
    { subject: 'Mobile Optimization', score: 95, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">SEO Optimization System</h2>
          <p className="text-gray-600">AI-powered SEO analysis and optimization recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateOptimizations} disabled={loading} variant="outline">
            <Bot className="mr-2 h-4 w-4" />
            Generate AI Optimizations
          </Button>
          <Button onClick={runSEOAudit} disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Search className="mr-2 h-4 w-4" />
            Run SEO Audit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">{overallScore}/100</p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-blue-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-500">{overallScore}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average CTR</p>
                <p className="text-2xl font-bold text-gray-900">{averageCTR.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Position</p>
                <p className="text-2xl font-bold text-gray-900">{averagePosition.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="audit">Site Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Performance Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Page Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.slice(0, 10).map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{metric.title}</h4>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getStatusColor(metric.status)}`}>
                            {metric.status}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{metric.page}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Rank: #{metric.currentRank}</span>
                          <span>Clicks: {metric.clicks}</span>
                          <span>CTR: {metric.ctr.toFixed(1)}%</span>
                          <span>Position: {metric.position.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(100 - metric.position) / 100 * 100} className="w-20" />
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Performance</CardTitle>
              <CardDescription>Track and optimize your keyword rankings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {metrics.map((metric) => (
                  <Card key={metric.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{metric.title}</h4>
                          <Badge variant="outline">Position #{metric.position.toFixed(0)}</Badge>
                          {metric.currentRank <= metric.targetRank && (
                            <Badge className="bg-green-500">Target Achieved</Badge>
                          )}
                        </div>
                        <div className="flex gap-1 mb-2">
                          {metric.keywords.slice(0, 5).map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {metric.keywords.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{metric.keywords.length - 5} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Search Volume: {metric.searchVolume.toLocaleString()}</span>
                          <span>Difficulty: {metric.difficulty}/100</span>
                          <span>Clicks: {metric.clicks}</span>
                          <span>Impressions: {metric.impressions.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Current vs Target</p>
                          <p className="font-bold text-lg">
                            <span className={metric.currentRank <= metric.targetRank ? 'text-green-600' : 'text-red-600'}>
                              #{metric.currentRank}
                            </span>
                            <span className="text-gray-400 mx-1">→</span>
                            <span className="text-blue-600">#{metric.targetRank}</span>
                          </p>
                        </div>
                        <Progress
                          value={Math.max(0, (100 - metric.currentRank) / (100 - metric.targetRank) * 100)}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered SEO Recommendations</CardTitle>
              <CardDescription>Implement these suggestions to improve your SEO performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pages</SelectItem>
                    {Array.from(new Set(recommendations.map(r => r.page))).map(page => (
                      <SelectItem key={page} value={page}>{page}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredRecommendations.map((recommendation) => (
                  <Card key={recommendation.id} className="p-4 border-l-4 border-blue-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{recommendation.issue}</h4>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getPriorityColor(recommendation.priority)}`}>
                            {recommendation.priority}
                          </div>
                          <Badge variant="outline">{recommendation.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{recommendation.recommendation}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Page: {recommendation.page}</span>
                          <span>Impact: +{recommendation.estimatedImpact}% expected</span>
                          <span>Effort: {recommendation.effort}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => implementRecommendation(recommendation.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissRecommendation(recommendation.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
              <CardDescription>Monitor your competitors' SEO performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors.map((competitor, index) => (
                  <div key={competitor.domain} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{competitor.domain}</h4>
                        <p className="text-sm text-gray-600">Domain Authority: {competitor.domainAuthority}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{competitor.keywords.toLocaleString()}</p>
                        <p className="text-gray-600">Keywords</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{competitor.backlinks.toLocaleString()}</p>
                        <p className="text-gray-600">Backlinks</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{competitor.traffic.toLocaleString()}</p>
                        <p className="text-gray-600">Traffic</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Opportunities</CardTitle>
              <CardDescription>Discover high-value keywords to target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {opportunities.map((opportunity, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{opportunity.keyword}</h4>
                          <Badge variant={opportunity.intent === 'commercial' ? 'default' : 'secondary'}>
                            {opportunity.intent}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{opportunity.opportunity}% opportunity</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Volume: {opportunity.searchVolume.toLocaleString()}</span>
                          <span>Difficulty: {opportunity.difficulty}/100</span>
                          <span>Target Rank: #{opportunity.targetRank}</span>
                          <span>Competitor Rank: #{opportunity.competitorRank}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Opportunity Score</p>
                          <p className="text-lg font-bold text-green-600">{opportunity.opportunity}%</p>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Target className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Site Audit</CardTitle>
              <CardDescription>Run a complete SEO analysis of your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter URL to audit (leave blank for current site)"
                  value={auditTarget}
                  onChange={(e) => setAuditTarget(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={runSEOAudit} disabled={loading}>
                  <Search className="mr-2 h-4 w-4" />
                  Run Audit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Technical SEO</h4>
                  <div className="flex items-center justify-between">
                    <Progress value={85} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Site speed, crawlability, indexing</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">On-Page SEO</h4>
                  <div className="flex items-center justify-between">
                    <Progress value={78} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Content, titles, meta descriptions</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Content Quality</h4>
                  <div className="flex items-center justify-between">
                    <Progress value={92} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Relevance, depth, uniqueness</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">User Experience</h4>
                  <div className="flex items-center justify-between">
                    <Progress value={88} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Mobile, speed, navigation</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Link Profile</h4>
                  <div className="flex items-center justify-between">
                    <Progress value={67} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Internal/external links quality</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Local SEO</h4>
                  <div className="flex items-center justify-between">
                    <Progress value={95} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">NAP consistency, local citations</p>
                </div>
              </div>

              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Recent Audit Results</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pages Crawled</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Issues Found</span>
                    <span className="font-medium text-red-600">23</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Opportunities</span>
                    <span className="font-medium text-green-600">15</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Audit</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}