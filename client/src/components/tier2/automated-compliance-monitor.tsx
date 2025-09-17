import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  FileText,
  Zap,
  TrendingUp,
  Bug,
  Wrench
} from 'lucide-react';

interface ComplianceMonitorRequest {
  documentId: string;
  jurisdiction: string;
  courtType: string;
  filingType: string;
  autoFix: boolean;
  realTimeMonitoring: boolean;
}

interface ComplianceViolation {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  category: 'formatting' | 'content' | 'procedural' | 'filing';
  description: string;
  location: string;
  suggestion: string;
  autoFixAvailable: boolean;
  ruleReference: string;
}

interface ComplianceResult {
  id: string;
  documentId: string;
  jurisdiction: string;
  complianceScore: number;
  overallStatus: 'compliant' | 'minor_issues' | 'major_issues' | 'critical_issues';
  violations: ComplianceViolation[];
  checkedRules: Array<{
    id: string;
    name: string;
    status: 'compliant' | 'violation' | 'warning' | 'not_checked';
  }>;
  autoFixesApplied: number;
  estimatedFixTime: string;
  nextReviewDate: string;
  lastChecked: string;
}

export default function AutomatedComplianceMonitor() {
  const [monitorRequest, setMonitorRequest] = useState<ComplianceMonitorRequest>({
    documentId: '',
    jurisdiction: '',
    courtType: 'state_trial',
    filingType: 'complaint',
    autoFix: true,
    realTimeMonitoring: false
  });

  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const complianceMutation = useMutation({
    mutationFn: async (data: ComplianceMonitorRequest): Promise<ComplianceResult> => {
      const response = await fetch('/api/tier2/compliance-monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to monitor compliance');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monitorRequest.documentId || !monitorRequest.jurisdiction) {
      return;
    }
    complianceMutation.mutate(monitorRequest);
  };

  const handleRealTimeMonitoring = (enabled: boolean) => {
    setMonitorRequest({ ...monitorRequest, realTimeMonitoring: enabled });
    setIsMonitoring(enabled);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'minor_issues': return 'bg-yellow-100 text-yellow-800';
      case 'major_issues': return 'bg-orange-100 text-orange-800';
      case 'critical_issues': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRuleStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'violation': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'not_checked': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Simulate real-time monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring && result) {
      interval = setInterval(() => {
        // Simulate score changes
        const newScore = Math.max(0, Math.min(100, result.complianceScore + (Math.random() - 0.5) * 10));
        setResult({
          ...result,
          complianceScore: Math.round(newScore),
          lastChecked: new Date().toISOString()
        });
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, result]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Automated Compliance Monitor</h1>
        <p className="mt-2 text-lg text-gray-600">
          Real-time compliance tracking with automated fixes and rule monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitor Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Compliance Monitor Setup
              </CardTitle>
              <CardDescription>
                Configure document compliance monitoring and automated fixes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="documentId">Document ID</Label>
                  <Input
                    id="documentId"
                    value={monitorRequest.documentId}
                    onChange={(e) => setMonitorRequest({...monitorRequest, documentId: e.target.value})}
                    placeholder="Enter document ID to monitor"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select
                    value={monitorRequest.jurisdiction}
                    onValueChange={(value) => setMonitorRequest({...monitorRequest, jurisdiction: value})}
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
                  <Label htmlFor="courtType">Court Type</Label>
                  <Select
                    value={monitorRequest.courtType}
                    onValueChange={(value) => setMonitorRequest({...monitorRequest, courtType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select court type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="federal">Federal Court</SelectItem>
                      <SelectItem value="state_trial">State Trial Court</SelectItem>
                      <SelectItem value="state_appellate">State Appellate Court</SelectItem>
                      <SelectItem value="state_supreme">State Supreme Court</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filingType">Filing Type</Label>
                  <Select
                    value={monitorRequest.filingType}
                    onValueChange={(value) => setMonitorRequest({...monitorRequest, filingType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select filing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="motion">Motion</SelectItem>
                      <SelectItem value="brief">Brief</SelectItem>
                      <SelectItem value="answer">Answer</SelectItem>
                      <SelectItem value="discovery">Discovery Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoFix">Enable Auto-Fix</Label>
                    <Switch
                      id="autoFix"
                      checked={monitorRequest.autoFix}
                      onCheckedChange={(checked) => setMonitorRequest({...monitorRequest, autoFix: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="realTimeMonitoring">Real-Time Monitoring</Label>
                    <Switch
                      id="realTimeMonitoring"
                      checked={monitorRequest.realTimeMonitoring}
                      onCheckedChange={handleRealTimeMonitoring}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={complianceMutation.isPending}
                >
                  {complianceMutation.isPending ? 'Analyzing Compliance...' : 'Start Compliance Check'}
                </Button>

                {complianceMutation.error && (
                  <div className="text-red-600 text-sm">
                    Error: {complianceMutation.error.message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Real-time Status */}
          {result && isMonitoring && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Score</span>
                    <span className="font-medium">{result.complianceScore}%</span>
                  </div>
                  <Progress value={result.complianceScore} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Last checked: {new Date(result.lastChecked).toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Compliance Results */}
        <div className="lg:col-span-2">
          {result ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="violations">Violations</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="fixes">Auto-Fixes</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Compliance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Compliance Score */}
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {result.complianceScore}%
                      </div>
                      <Badge className={getStatusColor(result.overallStatus)}>
                        {result.overallStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div className="mt-4">
                        <Progress value={result.complianceScore} className="h-3" />
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-semibold text-red-600">
                          {result.violations.filter(v => v.severity === 'error').length}
                        </div>
                        <div className="text-sm text-gray-600">Errors</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-semibold text-yellow-600">
                          {result.violations.filter(v => v.severity === 'warning').length}
                        </div>
                        <div className="text-sm text-gray-600">Warnings</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-semibold text-green-600">
                          {result.autoFixesApplied}
                        </div>
                        <div className="text-sm text-gray-600">Auto-Fixed</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-semibold text-blue-600">
                          {result.estimatedFixTime}
                        </div>
                        <div className="text-sm text-gray-600">Fix Time</div>
                      </div>
                    </div>

                    {/* Last Check Info */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Last Compliance Check</div>
                        <div className="text-sm text-gray-600">
                          {new Date(result.lastChecked).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Next Review</div>
                        <div className="text-sm text-gray-600">
                          {new Date(result.nextReviewDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Violations Tab */}
              <TabsContent value="violations">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Violations</CardTitle>
                    <CardDescription>
                      Detailed list of compliance issues and suggested fixes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.violations.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                          <p>No compliance violations found!</p>
                        </div>
                      ) : (
                        result.violations.map((violation, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getSeverityIcon(violation.severity)}
                                <h3 className="font-medium">{violation.description}</h3>
                              </div>
                              <div className="flex space-x-2">
                                <Badge variant="outline">{violation.category}</Badge>
                                {violation.autoFixAvailable && (
                                  <Badge className="border border-green-300">
                                    <Wrench className="h-3 w-3 mr-1 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                                    <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Auto-fixable</span>
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="font-medium">Location:</Label>
                                <div className="text-gray-600">{violation.location}</div>
                              </div>
                              <div>
                                <Label className="font-medium">Rule Reference:</Label>
                                <div className="text-gray-600">{violation.ruleReference || violation.ruleId}</div>
                              </div>
                            </div>

                            <div className="mt-3">
                              <Label className="font-medium">Suggested Fix:</Label>
                              <div className="text-gray-600 text-sm">{violation.suggestion}</div>
                            </div>

                            {violation.autoFixAvailable && (
                              <div className="mt-3">
                                <Button size="sm" variant="outline">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Apply Auto-Fix
                                </Button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rules Tab */}
              <TabsContent value="rules">
                <Card>
                  <CardHeader>
                    <CardTitle>Checked Rules</CardTitle>
                    <CardDescription>
                      Complete list of rules checked during compliance analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.checkedRules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            {getRuleStatusIcon(rule.status)}
                            <span className="font-medium">{rule.name}</span>
                          </div>
                          <Badge
                            variant={rule.status === 'compliant' ? 'default' : 'secondary'}
                            className={
                              rule.status === 'compliant' ? 'bg-green-100 text-green-800' :
                              rule.status === 'violation' ? 'bg-red-100 text-red-800' :
                              rule.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {rule.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Auto-Fixes Tab */}
              <TabsContent value="fixes">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Auto-Fix Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.autoFixesApplied > 0 ? (
                        <>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center text-green-800">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              <span className="font-medium">
                                {result.autoFixesApplied} issues automatically fixed
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {result.violations
                              .filter(v => v.autoFixAvailable)
                              .slice(0, result.autoFixesApplied)
                              .map((fix, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded bg-green-50">
                                  <div>
                                    <div className="font-medium text-green-800">Fixed: {fix.description}</div>
                                    <div className="text-sm text-green-600">Applied: {fix.suggestion}</div>
                                  </div>
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                              ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <Bug className="mx-auto h-12 w-12 mb-4" />
                          <p>No auto-fixes applied in this check</p>
                          <p className="text-sm">Enable auto-fix to automatically resolve common issues</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Shield className="mx-auto h-12 w-12 mb-4" />
                <p>Configure and start compliance monitoring to view results</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}