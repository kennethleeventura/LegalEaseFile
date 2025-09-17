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
  PenTool,
  FileText,
  Eye,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit,
  Share,
  BarChart3,
  Globe,
  Target,
  Zap,
  Clock,
  Users
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  category: string;
  tags: string[];
  reading_time: number;
  view_count: number;
  is_ai_generated: boolean;
  content_score: number;
  seo_title: string;
  seo_description: string;
  target_audience: string;
  published_at?: number;
  createdAt: number;
}

interface BlogGenerationRequest {
  topic: string;
  category: string;
  target_audience: string;
  legal_area: string;
  keywords: string[];
}

export default function AutomatedBlogSystem() {
  const [generationRequest, setGenerationRequest] = useState<BlogGenerationRequest>({
    topic: '',
    category: '',
    target_audience: 'lawyers',
    legal_area: '',
    keywords: []
  });

  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch blog posts
  const { data: blogData, isLoading } = useQuery({
    queryKey: ['blog-posts', filterCategory, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/blog/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  // Generate blog post
  const generateMutation = useMutation({
    mutationFn: async (data: BlogGenerationRequest): Promise<BlogPost> => {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate blog post');
      }

      return response.json();
    }
  });

  const handleAddKeyword = () => {
    if (selectedKeyword && !generationRequest.keywords.includes(selectedKeyword)) {
      setGenerationRequest({
        ...generationRequest,
        keywords: [...generationRequest.keywords, selectedKeyword]
      });
      setSelectedKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setGenerationRequest({
      ...generationRequest,
      keywords: generationRequest.keywords.filter(k => k !== keyword)
    });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generationRequest.topic || !generationRequest.category) return;
    generateMutation.mutate(generationRequest);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPosts = blogData?.posts?.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Automated Blog System</h1>
        <p className="mt-2 text-lg text-gray-600">
          AI-powered content creation with SEO optimization and automated publishing
        </p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="generate">AI Generator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Blog Posts Management */}
        <TabsContent value="posts">
          <div className="space-y-4">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Blog Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="contract">Contract Law</SelectItem>
                      <SelectItem value="court">Court Procedures</SelectItem>
                      <SelectItem value="evidence">Evidence Law</SelectItem>
                      <SelectItem value="litigation">Litigation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Posts Grid */}
                {isLoading ? (
                  <div className="text-center py-8">Loading blog posts...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPosts.map((post: BlogPost) => (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                            {post.is_ai_generated && (
                              <Badge variant="outline">
                                <Zap className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>

                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {post.reading_time} min read
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {post.view_count} views
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-500">Content Score</div>
                              <div className="text-sm font-medium">{post.content_score}%</div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Share className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Content Generator */}
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenTool className="mr-2 h-5 w-5" />
                  AI Blog Generator
                </CardTitle>
                <CardDescription>
                  Generate SEO-optimized legal content using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={generationRequest.topic}
                      onChange={(e) => setGenerationRequest({...generationRequest, topic: e.target.value})}
                      placeholder="E.g., Contract Formation Basics"
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
                        <SelectItem value="Evidence Law">Evidence Law</SelectItem>
                        <SelectItem value="Litigation">Litigation</SelectItem>
                        <SelectItem value="Employment Law">Employment Law</SelectItem>
                        <SelectItem value="Business Law">Business Law</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target_audience">Target Audience</Label>
                    <Select
                      value={generationRequest.target_audience}
                      onValueChange={(value) => setGenerationRequest({...generationRequest, target_audience: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lawyers">Lawyers</SelectItem>
                        <SelectItem value="pro_se">Pro Se Litigants</SelectItem>
                        <SelectItem value="general">General Public</SelectItem>
                        <SelectItem value="law_students">Law Students</SelectItem>
                        <SelectItem value="paralegals">Paralegals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="legal_area">Legal Area/Jurisdiction</Label>
                    <Select
                      value={generationRequest.legal_area}
                      onValueChange={(value) => setGenerationRequest({...generationRequest, legal_area: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Federal">Federal Law</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="General">General/Multi-State</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>SEO Keywords</Label>
                    <div className="flex space-x-2 mt-1">
                      <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add keyword" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contract law">contract law</SelectItem>
                          <SelectItem value="legal advice">legal advice</SelectItem>
                          <SelectItem value="court filing">court filing</SelectItem>
                          <SelectItem value="legal document">legal document</SelectItem>
                          <SelectItem value="attorney">attorney</SelectItem>
                          <SelectItem value="litigation">litigation</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={handleAddKeyword} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {generationRequest.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveKeyword(keyword)}
                        >
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={generateMutation.isPending}
                  >
                    {generateMutation.isPending ? 'Generating Content...' : 'Generate Blog Post'}
                  </Button>

                  {generateMutation.error && (
                    <div className="text-red-600 text-sm">
                      Error: {generateMutation.error.message}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Generated Content Preview */}
            {generateMutation.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium">Title</Label>
                    <div className="p-2 bg-gray-50 rounded text-sm">{generateMutation.data.title}</div>
                  </div>

                  <div>
                    <Label className="font-medium">SEO Title</Label>
                    <div className="p-2 bg-gray-50 rounded text-sm">{generateMutation.data.seo_title}</div>
                  </div>

                  <div>
                    <Label className="font-medium">Meta Description</Label>
                    <div className="p-2 bg-gray-50 rounded text-sm">{generateMutation.data.seo_description}</div>
                  </div>

                  <div>
                    <Label className="font-medium">Excerpt</Label>
                    <div className="p-2 bg-gray-50 rounded text-sm">{generateMutation.data.excerpt}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">Reading Time</Label>
                      <div>{generateMutation.data.reading_time} minutes</div>
                    </div>
                    <div>
                      <Label className="font-medium">Content Score</Label>
                      <div className="font-semibold text-green-600">{generateMutation.data.content_score}%</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Save Draft
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Publish
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
                <div className="text-2xl font-bold text-blue-600">
                  {blogData?.total || 0}
                </div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {blogData?.posts?.filter((p: BlogPost) => p.status === 'published').length || 0}
                </div>
                <div className="text-sm text-gray-600">Published</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {blogData?.posts?.reduce((sum: number, p: BlogPost) => sum + p.view_count, 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {blogData?.posts?.filter((p: BlogPost) => p.is_ai_generated).length || 0}
                </div>
                <div className="text-sm text-gray-600">AI Generated</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Content Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogData?.posts?.slice(0, 5).map((post: BlogPost) => (
                  <div key={post.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">{post.title}</div>
                      <div className="text-sm text-gray-600">{post.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{post.view_count} views</div>
                      <div className="text-sm text-green-600">{post.content_score}% score</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Generation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-publish AI content</Label>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>SEO optimization level</Label>
                  <Select defaultValue="high">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Content review required</Label>
                  <Button variant="outline" size="sm">Yes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-generate frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Preferred publish time</Label>
                  <Input type="time" defaultValue="09:00" className="w-32" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Content categories</Label>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}