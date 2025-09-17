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
  BookOpen,
  Search,
  Plus,
  Brain,
  Zap,
  Volume2,
  Link,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  Globe,
  Users,
  Filter,
  BarChart3
} from 'lucide-react';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  pronunciation?: string;
  etymology?: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  related_terms: string[];
  synonyms: string[];
  antonyms?: string[];
  example_usage: string;
  legal_citation?: string;
  jurisdiction_specific: string[];
  practice_areas: string[];
  seo_keywords: string;
  usage_frequency: number;
  is_ai_generated: boolean;
  ai_confidence_score: number;
  review_status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

interface GlossaryGenerationRequest {
  term: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  jurisdiction?: string;
}

export default function AutomatedGlossarySystem() {
  const [generationRequest, setGenerationRequest] = useState<GlossaryGenerationRequest>({
    term: '',
    category: '',
    difficulty_level: 'intermediate'
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  // Fetch glossary terms
  const { data: glossaryData, isLoading } = useQuery({
    queryKey: ['glossary-terms', filterCategory, filterDifficulty, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterDifficulty !== 'all') params.append('difficulty', filterDifficulty);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/glossary/terms?${params}`);
      if (!response.ok) throw new Error('Failed to fetch glossary terms');
      return response.json();
    }
  });

  // Generate glossary term
  const generateMutation = useMutation({
    mutationFn: async (data: GlossaryGenerationRequest): Promise<GlossaryTerm> => {
      const response = await fetch('/api/glossary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate glossary term');
      }

      return response.json();
    }
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generationRequest.term || !generationRequest.category) return;
    generateMutation.mutate(generationRequest);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTerms = glossaryData?.terms || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Automated Glossary System</h1>
        <p className="mt-2 text-lg text-gray-600">
          AI-powered legal dictionary with intelligent term generation and management
        </p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Terms</TabsTrigger>
          <TabsTrigger value="generate">AI Generator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        {/* Browse Terms */}
        <TabsContent value="browse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search and Filters */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    Search & Filter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search Terms</Label>
                    <Input
                      id="search"
                      placeholder="Search legal terms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Contract Law">Contract Law</SelectItem>
                        <SelectItem value="Court Procedures">Court Procedures</SelectItem>
                        <SelectItem value="Evidence">Evidence</SelectItem>
                        <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                        <SelectItem value="Civil Procedure">Civil Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total Terms:</span>
                        <span className="font-medium">{glossaryData?.total || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>AI Generated:</span>
                    <span className="font-medium">
                      {filteredTerms.filter((t: GlossaryTerm) => t.is_ai_generated).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Approved:</span>
                    <span className="font-medium text-green-600">
                      {filteredTerms.filter((t: GlossaryTerm) => t.review_status === 'approved').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Review:</span>
                    <span className="font-medium text-yellow-600">
                      {filteredTerms.filter((t: GlossaryTerm) => t.review_status === 'pending').length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Terms List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Terms Dictionary</CardTitle>
                  <CardDescription>
                    {isLoading ? 'Loading...' : `${filteredTerms.length} terms found`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading glossary terms...</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredTerms.map((term: GlossaryTerm) => (
                        <div
                          key={term.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                            selectedTerm?.id === term.id ? 'border-blue-500 bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedTerm(term)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{term.term}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getDifficultyColor(term.difficulty_level)}>
                                {term.difficulty_level}
                              </Badge>
                              <Badge className={getStatusColor(term.review_status)}>
                                {term.review_status}
                              </Badge>
                              {term.is_ai_generated && (
                                <Badge variant="outline">
                                  <Zap className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm mb-2 line-clamp-2">{term.definition}</p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{term.category}</span>
                            <div className="flex items-center space-x-3">
                              {term.pronunciation && (
                                <div className="flex items-center">
                                  <Volume2 className="h-3 w-3 mr-1" />
                                  Pronunciation
                                </div>
                              )}
                              <div className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {term.usage_frequency} uses
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Selected Term Details */}
              {selectedTerm && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedTerm.term}</span>
                      <div className="flex items-center space-x-2">
                        {selectedTerm.pronunciation && (
                          <Button size="sm" variant="outline">
                            <Volume2 className="h-3 w-3 mr-1" />
                            Listen
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Link className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-medium">Definition</Label>
                      <p className="text-gray-700 mt-1">{selectedTerm.definition}</p>
                    </div>

                    {selectedTerm.pronunciation && (
                      <div>
                        <Label className="font-medium">Pronunciation</Label>
                        <p className="text-gray-600 font-mono mt-1">{selectedTerm.pronunciation}</p>
                      </div>
                    )}

                    {selectedTerm.etymology && (
                      <div>
                        <Label className="font-medium">Etymology</Label>
                        <p className="text-gray-600 mt-1">{selectedTerm.etymology}</p>
                      </div>
                    )}

                    <div>
                      <Label className="font-medium">Example Usage</Label>
                      <p className="text-gray-700 italic mt-1">"{selectedTerm.example_usage}"</p>
                    </div>

                    {selectedTerm.related_terms.length > 0 && (
                      <div>
                        <Label className="font-medium">Related Terms</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTerm.related_terms.map((relatedTerm, index) => (
                            <Badge key={index} variant="outline" className="cursor-pointer">
                              {relatedTerm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTerm.synonyms.length > 0 && (
                      <div>
                        <Label className="font-medium">Synonyms</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTerm.synonyms.map((synonym, index) => (
                            <Badge key={index} variant="secondary">
                              {synonym}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <Label className="font-medium">Practice Areas</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTerm.practice_areas.map((area, index) => (
                            <Badge key={index} variant="outline">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium">Jurisdictions</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTerm.jurisdiction_specific.map((jurisdiction, index) => (
                            <Badge key={index} variant="outline">
                              {jurisdiction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedTerm.legal_citation && (
                      <div>
                        <Label className="font-medium">Legal Citation</Label>
                        <p className="text-gray-600 font-mono mt-1">{selectedTerm.legal_citation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* AI Generator */}
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Term Generator
                </CardTitle>
                <CardDescription>
                  Generate comprehensive legal term definitions using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <Label htmlFor="term">Legal Term</Label>
                    <Input
                      id="term"
                      value={generationRequest.term}
                      onChange={(e) => setGenerationRequest({...generationRequest, term: e.target.value})}
                      placeholder="E.g., Habeas Corpus"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={generationRequest.category}
                      onValueChange={(value) => setGenerationRequest({...generationRequest, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contract Law">Contract Law</SelectItem>
                        <SelectItem value="Court Procedures">Court Procedures</SelectItem>
                        <SelectItem value="Evidence">Evidence</SelectItem>
                        <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                        <SelectItem value="Civil Procedure">Civil Procedure</SelectItem>
                        <SelectItem value="Constitutional Law">Constitutional Law</SelectItem>
                        <SelectItem value="Business Law">Business Law</SelectItem>
                        <SelectItem value="Employment Law">Employment Law</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty_level">Difficulty Level</Label>
                    <Select
                      value={generationRequest.difficulty_level}
                      onValueChange={(value) => setGenerationRequest({...generationRequest, difficulty_level: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="jurisdiction">Jurisdiction (Optional)</Label>
                    <Select
                      value={generationRequest.jurisdiction || ''}
                      onValueChange={(value) => setGenerationRequest({...generationRequest, jurisdiction: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Federal">Federal</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="General">General/Common Law</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={generateMutation.isPending}
                  >
                    {generateMutation.isPending ? 'Generating Definition...' : 'Generate Term Definition'}
                  </Button>

                  {generateMutation.error && (
                    <div className="text-red-600 text-sm">
                      Error: {generateMutation.error.message}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Generated Term Preview */}
            {generateMutation.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    Generated Definition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium">Term</Label>
                    <div className="text-lg font-semibold">{generateMutation.data.term}</div>
                  </div>

                  <div>
                    <Label className="font-medium">Definition</Label>
                    <p className="text-gray-700 mt-1">{generateMutation.data.definition}</p>
                  </div>

                  <div>
                    <Label className="font-medium">Pronunciation</Label>
                    <p className="text-gray-600 font-mono mt-1">{generateMutation.data.pronunciation}</p>
                  </div>

                  <div>
                    <Label className="font-medium">Example Usage</Label>
                    <p className="text-gray-700 italic mt-1">"{generateMutation.data.example_usage}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">Category</Label>
                      <div>{generateMutation.data.category}</div>
                    </div>
                    <div>
                      <Label className="font-medium">Difficulty</Label>
                      <Badge className={getDifficultyColor(generateMutation.data.difficulty_level)}>
                        {generateMutation.data.difficulty_level}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Related Terms</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generateMutation.data.related_terms.map((term, index) => (
                        <Badge key={index} variant="outline">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">AI Confidence Score</Label>
                    <div className="font-semibold text-green-600">{generateMutation.data.ai_confidence_score}%</div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Approve & Add
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit First
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{glossaryData?.total || 0}</div>
                <div className="text-sm text-gray-600">Total Terms</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredTerms.filter((t: GlossaryTerm) => t.review_status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredTerms.filter((t: GlossaryTerm) => t.is_ai_generated).length}
                </div>
                <div className="text-sm text-gray-600">AI Generated</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(filteredTerms.reduce((sum: number, t: GlossaryTerm) => sum + t.ai_confidence_score, 0) / filteredTerms.length) || 0}%
                </div>
                <div className="text-sm text-gray-600">Avg AI Score</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Term Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTerms.slice(0, 10).map((term: GlossaryTerm) => (
                  <div key={term.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{term.term}</div>
                      <div className="text-sm text-gray-600">{term.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{term.usage_frequency} uses</div>
                      <div className="text-sm text-green-600">{term.ai_confidence_score}% confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Management */}
        <TabsContent value="management">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTerms
                    .filter((t: GlossaryTerm) => t.review_status === 'pending')
                    .slice(0, 5)
                    .map((term: GlossaryTerm) => (
                      <div key={term.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{term.term}</div>
                          <div className="text-sm text-gray-600">{term.category}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Approve</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Reject</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-approve high-confidence terms</Label>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Minimum confidence threshold</Label>
                  <Select defaultValue="85">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="85">85%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Include pronunciation guides</Label>
                  <Button variant="outline" size="sm">Yes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}