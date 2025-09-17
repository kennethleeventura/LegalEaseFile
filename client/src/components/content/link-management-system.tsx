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
import { AlertCircle, ExternalLink, Link, Plus, Search, TrendingUp, Monitor, Bot, Eye, CheckCircle, X, RefreshCw, Globe, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

interface LinkData {
  id: string;
  url: string;
  title: string;
  description: string;
  type: 'internal' | 'external';
  category: string;
  status: 'active' | 'broken' | 'redirect' | 'checking';
  clickCount: number;
  lastChecked: string;
  sourcePages: string[];
  targetKeywords: string[];
  domainAuthority?: number;
  pageAuthority?: number;
  trustFlow?: number;
  citationFlow?: number;
  createdAt: string;
  updatedAt: string;
}

interface LinkSuggestion {
  id: string;
  sourceContent: string;
  targetUrl: string;
  anchorText: string;
  relevanceScore: number;
  confidence: number;
  type: 'internal' | 'external';
  reason: string;
  keywords: string[];
  estimatedValue: number;
}

interface LinkPerformance {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  averagePosition: number;
}

export default function LinkManagementSystem() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
  const [performance, setPerformance] = useState<LinkPerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [newLink, setNewLink] = useState({
    url: '',
    title: '',
    description: '',
    type: 'internal' as 'internal' | 'external',
    category: 'legal-resources',
    targetKeywords: ''
  });

  const categories = [
    'legal-resources', 'court-forms', 'case-law', 'statutes', 'regulations',
    'legal-tools', 'practice-guides', 'news', 'educational', 'commercial'
  ];

  const linkTypes = ['all', 'internal', 'external'];

  useEffect(() => {
    fetchLinks();
    fetchSuggestions();
    fetchPerformance();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/links/suggestions');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await fetch('/api/links/performance');
      const data = await response.json();
      setPerformance(data);
    } catch (error) {
      console.error('Error fetching performance:', error);
    }
  };

  const addLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLink,
          targetKeywords: newLink.targetKeywords.split(',').map(k => k.trim())
        })
      });
      if (response.ok) {
        setNewLink({
          url: '',
          title: '',
          description: '',
          type: 'internal',
          category: 'legal-resources',
          targetKeywords: ''
        });
        fetchLinks();
      }
    } catch (error) {
      console.error('Error adding link:', error);
    }
    setLoading(false);
  };

  const checkLinkHealth = async (linkId: string) => {
    try {
      await fetch(`/api/links/${linkId}/check`, { method: 'POST' });
      fetchLinks();
    } catch (error) {
      console.error('Error checking link health:', error);
    }
  };

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      await fetch('/api/links/generate-suggestions', { method: 'POST' });
      fetchSuggestions();
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
    setLoading(false);
  };

  const implementSuggestion = async (suggestionId: string) => {
    try {
      await fetch(`/api/links/suggestions/${suggestionId}/implement`, { method: 'POST' });
      fetchSuggestions();
      fetchLinks();
    } catch (error) {
      console.error('Error implementing suggestion:', error);
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    const matchesType = selectedType === 'all' || link.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'broken': return 'bg-red-500';
      case 'redirect': return 'bg-yellow-500';
      case 'checking': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'broken': return <X className="h-4 w-4" />;
      case 'redirect': return <RefreshCw className="h-4 w-4" />;
      case 'checking': return <Monitor className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const totalLinks = links.length;
  const activeLinks = links.filter(l => l.status === 'active').length;
  const brokenLinks = links.filter(l => l.status === 'broken').length;
  const internalLinks = links.filter(l => l.type === 'internal').length;
  const externalLinks = links.filter(l => l.type === 'external').length;

  const linkHealthData = [
    { name: 'Active', value: activeLinks, color: '#10B981' },
    { name: 'Broken', value: brokenLinks, color: '#EF4444' },
    { name: 'Redirects', value: links.filter(l => l.status === 'redirect').length, color: '#F59E0B' }
  ];

  const linkTypeData = [
    { name: 'Internal', value: internalLinks, color: '#3B82F6' },
    { name: 'External', value: externalLinks, color: '#8B5CF6' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Link Management System</h2>
          <p className="text-gray-600">Manage internal and external links with AI-powered optimization</p>
        </div>
        <Button onClick={generateSuggestions} disabled={loading} className="bg-gradient-to-r from-pink-500 to-orange-500">
          <Bot className="mr-2 h-4 w-4" />
          Generate AI Suggestions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Links</p>
                <p className="text-2xl font-bold text-gray-900">{totalLinks}</p>
              </div>
              <Link className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Links</p>
                <p className="text-2xl font-bold text-gray-900">{activeLinks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Broken Links</p>
                <p className="text-2xl font-bold text-gray-900">{brokenLinks}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
                <p className="text-2xl font-bold text-gray-900">{suggestions.length}</p>
              </div>
              <Bot className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="links" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="links">Links Management</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="health">Link Health</TabsTrigger>
          <TabsTrigger value="add">Add New Link</TabsTrigger>
        </TabsList>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Link Inventory</CardTitle>
              <CardDescription>Manage your internal and external link portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Links</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by title, URL, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {linkTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredLinks.map((link) => (
                  <Card key={link.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{link.title}</h4>
                          <Badge variant={link.type === 'internal' ? 'default' : 'secondary'}>
                            {link.type}
                          </Badge>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getStatusColor(link.status)}`}>
                            {getStatusIcon(link.status)}
                            {link.status}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {link.url}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {link.clickCount} clicks
                          </span>
                          <span>Last checked: {new Date(link.lastChecked).toLocaleDateString()}</span>
                        </div>
                        {link.targetKeywords.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {link.targetKeywords.slice(0, 3).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {link.targetKeywords.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{link.targetKeywords.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => checkLinkHealth(link.id)}
                        >
                          <Monitor className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Link Suggestions</CardTitle>
              <CardDescription>Smart recommendations for improving your link strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-4 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{suggestion.anchorText}</h4>
                        <Badge variant={suggestion.type === 'internal' ? 'default' : 'secondary'}>
                          {suggestion.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-500">Relevance:</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${suggestion.relevanceScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{suggestion.relevanceScore}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>Target: {suggestion.targetUrl}</span>
                        <span>Estimated Value: ${suggestion.estimatedValue}</span>
                        <span>Confidence: {suggestion.confidence}%</span>
                      </div>
                      <div className="flex gap-1">
                        {suggestion.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => implementSuggestion(suggestion.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4" />
                        Implement
                      </Button>
                      <Button size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Link Health Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={linkHealthData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {linkHealthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Link Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={linkTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {linkTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Link Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="clicks" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="impressions" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Link Health Monitoring</CardTitle>
              <CardDescription>Monitor and maintain link quality across your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Health Score</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="flex-1" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Overall link portfolio health</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Last Full Scan</h4>
                  <p className="text-lg font-bold text-gray-900">2 hours ago</p>
                  <p className="text-xs text-gray-600">Next scan in 6 hours</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Issues Found</h4>
                  <p className="text-lg font-bold text-red-600">{brokenLinks}</p>
                  <p className="text-xs text-gray-600">Require immediate attention</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Recent Health Checks</h4>
                {links.filter(l => l.status === 'broken' || l.status === 'redirect').slice(0, 5).map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(link.status)}`}>
                        {getStatusIcon(link.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{link.title}</p>
                        <p className="text-sm text-gray-600">{link.url}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => checkLinkHealth(link.id)}>
                      <RefreshCw className="h-4 w-4" />
                      Recheck
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Link</CardTitle>
              <CardDescription>Manually add internal or external links to your inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/page"
                    value={newLink.url}
                    onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Page title or link description"
                    value={newLink.title}
                    onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the linked content"
                  value={newLink.description}
                  onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Link Type</Label>
                  <Select value={newLink.type} onValueChange={(value: 'internal' | 'external') => setNewLink({...newLink, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={newLink.category} onValueChange={(value) => setNewLink({...newLink, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="keywords">Target Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="keyword1, keyword2, keyword3"
                    value={newLink.targetKeywords}
                    onChange={(e) => setNewLink({...newLink, targetKeywords: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={addLink} disabled={loading || !newLink.url || !newLink.title} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}