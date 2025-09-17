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
import { AlertTriangle, Clock, Zap, FileText, Phone, Globe, CheckCircle, X, RefreshCw, Calendar, User, MapPin, Scale } from 'lucide-react';

interface EmergencyFiling {
  id: string;
  type: 'tro' | 'injunction' | 'restraining-order' | 'emergency-motion' | 'habeas-corpus' | 'protective-order';
  title: string;
  description: string;
  jurisdiction: string;
  court: string;
  urgency: 'critical' | 'high' | 'medium';
  timeLimit: string;
  requiredDocs: string[];
  status: 'draft' | 'ready' | 'filed' | 'granted' | 'denied';
  createdAt: string;
  filingDeadline: string;
  estimatedTime: number;
}

interface CourtInfo {
  name: string;
  jurisdiction: string;
  address: string;
  phone: string;
  emergencyContact: string;
  filingHours: string;
  afterHoursContact: string;
  expeditedFee: number;
  acceptsEFiling: boolean;
}

interface EmergencyTemplate {
  type: string;
  name: string;
  description: string;
  jurisdiction: string;
  timeLimit: string;
  requiredDocs: string[];
  estimatedTime: number;
  urgency: 'critical' | 'high' | 'medium';
}

export default function EmergencyFilingEngine() {
  const [filings, setFilings] = useState<EmergencyFiling[]>([]);
  const [courts, setCourts] = useState<CourtInfo[]>([]);
  const [templates, setTemplates] = useState<EmergencyTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [newFiling, setNewFiling] = useState({
    type: 'tro' as EmergencyFiling['type'],
    title: '',
    description: '',
    jurisdiction: '',
    court: '',
    urgency: 'high' as EmergencyFiling['urgency'],
    timeLimit: '',
    estimatedTime: 2
  });

  const emergencyTypes = [
    { value: 'tro', label: 'Temporary Restraining Order', urgency: 'critical' },
    { value: 'injunction', label: 'Emergency Injunction', urgency: 'critical' },
    { value: 'restraining-order', label: 'Restraining Order', urgency: 'high' },
    { value: 'emergency-motion', label: 'Emergency Motion', urgency: 'high' },
    { value: 'habeas-corpus', label: 'Habeas Corpus', urgency: 'critical' },
    { value: 'protective-order', label: 'Protective Order', urgency: 'high' }
  ];

  const jurisdictions = [
    'Federal District Court',
    'State Supreme Court',
    'State Superior Court',
    'Family Court',
    'Criminal Court',
    'Civil Court'
  ];

  useEffect(() => {
    fetchEmergencyFilings();
    fetchCourtInfo();
    fetchTemplates();
  }, []);

  const fetchEmergencyFilings = async () => {
    try {
      const response = await fetch('/api/emergency-filings');
      const data = await response.json();
      setFilings(data);
    } catch (error) {
      console.error('Error fetching emergency filings:', error);
    }
  };

  const fetchCourtInfo = async () => {
    try {
      const response = await fetch('/api/courts/emergency-info');
      const data = await response.json();
      setCourts(data);
    } catch (error) {
      console.error('Error fetching court info:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/emergency-templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const createEmergencyFiling = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/emergency-filings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFiling)
      });
      if (response.ok) {
        setNewFiling({
          type: 'tro',
          title: '',
          description: '',
          jurisdiction: '',
          court: '',
          urgency: 'high',
          timeLimit: '',
          estimatedTime: 2
        });
        fetchEmergencyFilings();
      }
    } catch (error) {
      console.error('Error creating emergency filing:', error);
    }
    setLoading(false);
  };

  const expediteFiling = async (filingId: string) => {
    try {
      await fetch(`/api/emergency-filings/${filingId}/expedite`, { method: 'POST' });
      fetchEmergencyFilings();
    } catch (error) {
      console.error('Error expediting filing:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-yellow-500';
      case 'medium': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'ready': return 'bg-blue-500';
      case 'filed': return 'bg-yellow-500';
      case 'granted': return 'bg-green-500';
      case 'denied': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return 'OVERDUE';
    if (hours < 1) return `${minutes}m`;
    if (hours < 24) return `${hours}h ${minutes}m`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  const criticalFilings = filings.filter(f => f.urgency === 'critical' && f.status !== 'granted' && f.status !== 'denied');
  const activeFilings = filings.filter(f => f.status === 'filed' || f.status === 'ready');
  const completedFilings = filings.filter(f => f.status === 'granted' || f.status === 'denied');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Emergency Filing Engine</h2>
          <p className="text-gray-600">Rapid response legal filing system for time-critical matters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-yellow-500 text-yellow-600">
            <Phone className="mr-2 h-4 w-4" />
            Emergency Hotline
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500">
            <Zap className="mr-2 h-4 w-4" />
            New Emergency Filing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Filings</p>
                <p className="text-2xl font-bold text-gray-900">{criticalFilings.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Filings</p>
                <p className="text-2xl font-bold text-gray-900">{activeFilings.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedFilings.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">47min</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="create">Create Filing</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="courts">Court Info</TabsTrigger>
          <TabsTrigger value="hotline">Emergency Hotline</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-6">
            {criticalFilings.length > 0 && (
              <Card className="border-red-500 border-2">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Critical Filings - Immediate Attention Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {criticalFilings.map((filing) => (
                    <div key={filing.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-red-900">{filing.title}</h4>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getUrgencyColor(filing.urgency)}`}>
                            <AlertTriangle className="h-3 w-3" />
                            {filing.urgency.toUpperCase()}
                          </div>
                        </div>
                        <p className="text-sm text-red-700 mb-2">{filing.description}</p>
                        <div className="flex items-center gap-4 text-sm text-red-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {getTimeRemaining(filing.filingDeadline)} remaining
                          </span>
                          <span className="flex items-center gap-1">
                            <Scale className="h-4 w-4" />
                            {filing.court}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => expediteFiling(filing.id)}>
                          <Zap className="h-4 w-4" />
                          EXPEDITE
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Emergency Filings</CardTitle>
                <CardDescription>Monitor all your emergency legal filings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {filings.map((filing) => (
                    <Card key={filing.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{filing.title}</h4>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getUrgencyColor(filing.urgency)}`}>
                              {filing.urgency}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getStatusColor(filing.status)}`}>
                              {filing.status}
                            </div>
                            <Badge variant="outline">{filing.type.replace('-', ' ')}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{filing.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {filing.jurisdiction}
                            </span>
                            <span className="flex items-center gap-1">
                              <Scale className="h-4 w-4" />
                              {filing.court}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Due: {getTimeRemaining(filing.filingDeadline)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Created: {new Date(filing.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Emergency Filing</CardTitle>
              <CardDescription>Quickly generate time-critical legal filings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Filing Type</Label>
                  <Select value={newFiling.type} onValueChange={(value: EmergencyFiling['type']) => setNewFiling({...newFiling, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emergencyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getUrgencyColor(type.urgency)}`} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Urgency Level</Label>
                  <Select value={newFiling.urgency} onValueChange={(value: EmergencyFiling['urgency']) => setNewFiling({...newFiling, urgency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          Critical (0-4 hours)
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          High (4-24 hours)
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          Medium (1-3 days)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Filing Title</Label>
                <Input
                  id="title"
                  placeholder="Emergency motion title"
                  value={newFiling.title}
                  onChange={(e) => setNewFiling({...newFiling, title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="description">Case Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the emergency circumstances requiring immediate court intervention"
                  value={newFiling.description}
                  onChange={(e) => setNewFiling({...newFiling, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Jurisdiction</Label>
                  <Select value={newFiling.jurisdiction} onValueChange={(value) => setNewFiling({...newFiling, jurisdiction: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      {jurisdictions.map(jurisdiction => (
                        <SelectItem key={jurisdiction} value={jurisdiction}>
                          {jurisdiction}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="court">Specific Court</Label>
                  <Input
                    id="court"
                    placeholder="Superior Court of California"
                    value={newFiling.court}
                    onChange={(e) => setNewFiling({...newFiling, court: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeLimit">Filing Deadline</Label>
                  <Input
                    id="timeLimit"
                    type="datetime-local"
                    value={newFiling.timeLimit}
                    onChange={(e) => setNewFiling({...newFiling, timeLimit: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedTime">Estimated Prep Time (hours)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={newFiling.estimatedTime}
                    onChange={(e) => setNewFiling({...newFiling, estimatedTime: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={createEmergencyFiling} disabled={loading || !newFiling.title || !newFiling.description} className="w-full bg-red-600 hover:bg-red-700">
                <Zap className="mr-2 h-4 w-4" />
                Create Emergency Filing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Filing Templates</CardTitle>
              <CardDescription>Pre-built templates for common emergency filings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getUrgencyColor(template.urgency)}`}>
                            {template.urgency}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>Jurisdiction: {template.jurisdiction}</span>
                          <span>Time Limit: {template.timeLimit}</span>
                          <span>Est. Time: {template.estimatedTime}h</span>
                        </div>
                        <div className="flex gap-1">
                          {template.requiredDocs.slice(0, 3).map((doc, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {doc}
                            </Badge>
                          ))}
                          {template.requiredDocs.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.requiredDocs.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Use Template
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courts">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Court Information</CardTitle>
              <CardDescription>24/7 contact information for emergency filings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {courts.map((court, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{court.name}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            {court.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            {court.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            Filing Hours: {court.filingHours}
                          </p>
                          <p className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            E-Filing: {court.acceptsEFiling ? 'Available' : 'Not Available'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Emergency Contacts</h5>
                        <div className="space-y-1 text-sm">
                          <p className="text-red-600 font-medium">Emergency: {court.emergencyContact}</p>
                          <p>After Hours: {court.afterHoursContact}</p>
                          <p>Expedited Fee: ${court.expeditedFee}</p>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4" />
                            E-File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotline">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                24/7 Emergency Legal Hotline
              </CardTitle>
              <CardDescription>Immediate assistance for time-critical legal matters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-3">Emergency Situations</h4>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li>• Restraining orders needed within hours</li>
                    <li>• Temporary custody emergencies</li>
                    <li>• Asset freeze requirements</li>
                    <li>• Criminal detention matters</li>
                    <li>• Business closure prevention</li>
                  </ul>
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Emergency Hotline
                  </Button>
                </div>

                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">Expert Legal Support</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• 24/7 attorney availability</li>
                    <li>• Immediate case assessment</li>
                    <li>• Emergency filing preparation</li>
                    <li>• Court contact facilitation</li>
                    <li>• Real-time legal guidance</li>
                  </ul>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    <User className="mr-2 h-4 w-4" />
                    Request Attorney Callback
                  </Button>
                </div>
              </div>

              <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3">Response Time Guarantee</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">< 5min</p>
                    <p className="text-sm text-yellow-800">Initial Response</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">< 30min</p>
                    <p className="text-sm text-yellow-800">Attorney Assignment</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">< 2hrs</p>
                    <p className="text-sm text-yellow-800">Filing Preparation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}