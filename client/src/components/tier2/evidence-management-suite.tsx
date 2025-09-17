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
  Database,
  Upload,
  Search,
  Shield,
  FileText,
  Image,
  Video,
  Mic,
  Link,
  Tag,
  Clock,
  User,
  Lock,
  Eye,
  Download,
  Share,
  AlertTriangle,
  CheckCircle,
  Star,
  Filter
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  caseId: string;
  type: 'document' | 'photo' | 'video' | 'audio' | 'digital' | 'physical';
  title: string;
  description: string;
  tags: string[];
  uploadDate: string;
  status: 'processing' | 'ready' | 'review_required' | 'privileged';
  metadata: {
    size: number;
    format: string;
    checksum: string;
    encrypted: boolean;
  };
  analysis: {
    aiExtractedKeywords: string[];
    relevanceScore: number;
    duplicateCheck: string;
    privilegeReview: string;
  };
  chainOfCustody: Array<{
    timestamp: string;
    action: string;
    user: string;
    location: string;
  }>;
}

interface EvidenceUploadRequest {
  caseId: string;
  evidenceType: string;
  title: string;
  description: string;
  tags: string[];
  digitalForensics?: boolean;
}

export default function EvidenceManagementSuite() {
  const [uploadRequest, setUploadRequest] = useState<EvidenceUploadRequest>({
    caseId: '',
    evidenceType: 'document',
    title: '',
    description: '',
    tags: []
  });

  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [result, setResult] = useState<EvidenceItem | null>(null);

  // Mock evidence data
  const mockEvidence: EvidenceItem[] = [
    {
      id: 'ev-001',
      caseId: 'case-123',
      type: 'document',
      title: 'Contract Agreement v2.1',
      description: 'Main contract document with amendments',
      tags: ['contract', 'primary', 'signed'],
      uploadDate: '2024-09-15T10:00:00Z',
      status: 'ready',
      metadata: {
        size: 245760,
        format: 'PDF',
        checksum: 'a1b2c3d4e5f6',
        encrypted: true
      },
      analysis: {
        aiExtractedKeywords: ['payment terms', 'termination clause', 'liability'],
        relevanceScore: 95,
        duplicateCheck: 'no_duplicates_found',
        privilegeReview: 'no_privilege_detected'
      },
      chainOfCustody: [
        {
          timestamp: '2024-09-15T10:00:00Z',
          action: 'uploaded',
          user: 'Attorney Smith',
          location: 'Legal Office'
        }
      ]
    },
    {
      id: 'ev-002',
      caseId: 'case-123',
      type: 'photo',
      title: 'Property Damage Photos',
      description: 'Site inspection photographs showing damage',
      tags: ['photos', 'damage', 'inspection'],
      uploadDate: '2024-09-14T14:30:00Z',
      status: 'ready',
      metadata: {
        size: 5242880,
        format: 'JPEG',
        checksum: 'f6e5d4c3b2a1',
        encrypted: false
      },
      analysis: {
        aiExtractedKeywords: ['structural damage', 'water damage', 'before/after'],
        relevanceScore: 88,
        duplicateCheck: 'no_duplicates_found',
        privilegeReview: 'no_privilege_detected'
      },
      chainOfCustody: [
        {
          timestamp: '2024-09-14T14:30:00Z',
          action: 'uploaded',
          user: 'Investigator Jones',
          location: 'Property Site'
        }
      ]
    }
  ];

  const evidenceMutation = useMutation({
    mutationFn: async (data: EvidenceUploadRequest): Promise<EvidenceItem> => {
      const response = await fetch('/api/tier2/evidence-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload evidence');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleAddTag = () => {
    if (selectedTag && !uploadRequest.tags.includes(selectedTag)) {
      setUploadRequest({
        ...uploadRequest,
        tags: [...uploadRequest.tags, selectedTag]
      });
      setSelectedTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setUploadRequest({
      ...uploadRequest,
      tags: uploadRequest.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadRequest.title || !uploadRequest.evidenceType) {
      return;
    }
    evidenceMutation.mutate(uploadRequest);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'photo': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      case 'digital': return <Database className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'review_required': return 'bg-yellow-100 text-yellow-800';
      case 'privileged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredEvidence = mockEvidence.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Evidence Management Suite</h1>
        <p className="mt-2 text-lg text-gray-600">
          Advanced evidence organization, analysis, and chain of custody tracking
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload Evidence</TabsTrigger>
          <TabsTrigger value="browse">Browse Evidence</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="custody">Chain of Custody</TabsTrigger>
        </TabsList>

        {/* Upload Evidence Tab */}
        <TabsContent value="upload">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload New Evidence
                </CardTitle>
                <CardDescription>
                  Add evidence items with automatic analysis and metadata extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="caseId">Case ID</Label>
                    <Input
                      id="caseId"
                      value={uploadRequest.caseId}
                      onChange={(e) => setUploadRequest({...uploadRequest, caseId: e.target.value})}
                      placeholder="CASE-2024-001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="evidenceType">Evidence Type</Label>
                    <Select
                      value={uploadRequest.evidenceType}
                      onValueChange={(value) => setUploadRequest({...uploadRequest, evidenceType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select evidence type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="photo">Photograph</SelectItem>
                        <SelectItem value="video">Video Recording</SelectItem>
                        <SelectItem value="audio">Audio Recording</SelectItem>
                        <SelectItem value="digital">Digital Evidence</SelectItem>
                        <SelectItem value="physical">Physical Evidence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Evidence Title</Label>
                    <Input
                      id="title"
                      value={uploadRequest.title}
                      onChange={(e) => setUploadRequest({...uploadRequest, title: e.target.value})}
                      placeholder="Contract Agreement - Final Version"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadRequest.description}
                      onChange={(e) => setUploadRequest({...uploadRequest, description: e.target.value})}
                      placeholder="Detailed description of the evidence item..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex space-x-2 mt-1">
                      <Select value={selectedTag} onValueChange={setSelectedTag}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="correspondence">Correspondence</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="photos">Photos</SelectItem>
                          <SelectItem value="expert_report">Expert Report</SelectItem>
                          <SelectItem value="deposition">Deposition</SelectItem>
                          <SelectItem value="discovery">Discovery</SelectItem>
                          <SelectItem value="privileged">Privileged</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={handleAddTag} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {uploadRequest.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">Drag and drop files here, or click to browse</p>
                    <p className="text-sm text-gray-500 mt-2">Supports all file types up to 100MB</p>
                    <Button variant="outline" className="mt-4">
                      Select Files
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={evidenceMutation.isPending}
                  >
                    {evidenceMutation.isPending ? 'Processing Evidence...' : 'Upload Evidence'}
                  </Button>

                  {evidenceMutation.error && (
                    <div className="text-red-600 text-sm">
                      Error: {evidenceMutation.error.message}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Upload Result */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    Upload Successful
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium">Evidence ID</Label>
                    <div className="text-sm text-gray-600">{result.id}</div>
                  </div>

                  <div>
                    <Label className="font-medium">Processing Status</Label>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <Label className="font-medium">AI Analysis</Label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Relevance Score:</span>
                        <span className={getRelevanceColor(result.analysis.relevanceScore)}>
                          {result.analysis.relevanceScore}%
                        </span>
                      </div>
                      <div>
                        <Label className="text-xs">Extracted Keywords:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.analysis.aiExtractedKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Security</Label>
                    <div className="flex items-center space-x-2 text-sm">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span>Encrypted: {result.metadata.encrypted ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>Checksum: {result.metadata.checksum}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Browse Evidence Tab */}
        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Evidence Repository
              </CardTitle>
              <CardDescription>
                Search and filter evidence items with advanced metadata
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search evidence by title, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="photo">Photos</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvidence.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{item.description}</p>

                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Relevance: <span className={getRelevanceColor(item.analysis.relevanceScore)}>{item.analysis.relevanceScore}%</span></span>
                        <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEvidence.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Database className="mx-auto h-12 w-12 mb-4" />
                  <p>No evidence items found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  AI Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{mockEvidence.length}</div>
                    <div className="text-sm text-gray-600">Total Evidence Items</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(mockEvidence.reduce((acc, item) => acc + item.analysis.relevanceScore, 0) / mockEvidence.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Relevance Score</div>
                  </div>
                </div>

                {/* Privilege Review */}
                <div>
                  <Label className="font-medium">Privilege Review Results</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">No Privilege Detected</span>
                      <Badge className="bg-green-100 text-green-800">
                        {mockEvidence.filter(e => e.analysis.privilegeReview === 'no_privilege_detected').length} items
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Attorney-Client Privilege</span>
                      <Badge className="bg-yellow-100 text-yellow-800">0 items</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Work Product</span>
                      <Badge className="bg-red-100 text-red-800">0 items</Badge>
                    </div>
                  </div>
                </div>

                {/* Duplicate Analysis */}
                <div>
                  <Label className="font-medium">Duplicate Detection</Label>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">No duplicate evidence items detected</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keyword Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Most Frequent Keywords</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['contract', 'payment terms', 'liability', 'damages', 'breach', 'termination']
                        .map((keyword, index) => (
                          <Badge key={index} variant="outline" className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {keyword}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Evidence Categories</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Contractual Documents</span>
                        <Badge variant="outline">1 item</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Physical Evidence</span>
                        <Badge variant="outline">1 item</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Expert Reports</span>
                        <Badge variant="outline">0 items</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chain of Custody Tab */}
        <TabsContent value="custody">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Chain of Custody Tracking
              </CardTitle>
              <CardDescription>
                Complete audit trail for all evidence items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockEvidence.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.title}</span>
                        <Badge variant="outline">{item.id}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {item.chainOfCustody.map((entry, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 border rounded">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">
                                {new Date(entry.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{entry.user}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{entry.action}</Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>at {entry.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}