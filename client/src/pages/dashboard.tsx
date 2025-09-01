import { Plus, AlertTriangle, HandHeart, Upload, Clock, Phone, Book, Mail, Calendar, Search, Scale, Target, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import EmergencyAlert from "@/components/legal/emergency-alert";
import FileUploadZone from "@/components/document/file-upload-zone";
import DocumentTemplates from "@/components/document/document-templates";
import CMECFStatusCard from "@/components/legal/cmecf-status";
import ProBonoDirectory from "@/components/legal/pro-bono-directory";
import DeadlineManager from "@/components/legal/deadline-manager";
import LegalResearchAssistant from "@/components/legal/research-assistant";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  
  const { data: recentActivity = [] } = useQuery({
    queryKey: ["/api/filing-history/user"],
    enabled: isAuthenticated,
    retry: false,
  });

  const handleStartFiling = () => {
    console.log("Starting filing process");
  };

  const handleEmergencyFiling = () => {
    console.log("Emergency filing initiated");
  };

  const handleTemplateSelect = (template: any) => {
    console.log("Template selected:", template);
    // TODO: Navigate to document generation
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" data-testid="dashboard">
      <EmergencyAlert />

      {/* Main Header */}
      <div className="px-4 py-6 sm:px-0">
        <Card className="border-4 border-dashed border-gray-200 bg-white p-8" data-testid="main-header">
          <div className="text-center">
            <Upload className="text-primary-500 text-6xl mb-4 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Massachusetts Federal District Court Filing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered document preparation and filing for the U.S. District Court for the District of Massachusetts.
              Let our system help you prepare, validate, and file your legal documents with confidence.
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-testid="quick-actions">
        {/* File New Document */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Plus className="text-primary-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">File New Document</h3>
                <p className="text-sm text-gray-500">Start a new legal document filing</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/file-document">
                <Button 
                  className="w-full" 
                  onClick={handleStartFiling}
                  data-testid="button-file-document"
                >
                  Start Filing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Filing */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Emergency Filing</h3>
                <p className="text-sm text-gray-500">Urgent court filings</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/emergency-filing">
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleEmergencyFiling}
                  data-testid="button-emergency-filing"
                >
                  Emergency Filing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pro Bono Help */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HandHeart className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Pro Bono Legal Aid</h3>
                <p className="text-sm text-gray-500">Find free legal assistance</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/pro-bono-search">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  data-testid="button-pro-bono"
                >
                  Find Help
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Deadline Management */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-purple-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Deadline Tracker</h3>
                <p className="text-sm text-gray-500">Manage court deadlines & reminders</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/deadlines">
                <Button 
                  variant="outline" 
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                  data-testid="button-deadlines"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Deadlines
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Legal Research */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Search className="text-green-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Legal Research</h3>
                <p className="text-sm text-gray-500">Access free legal databases</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/research">
                <Button 
                  variant="outline" 
                  className="w-full border-green-300 text-green-700 hover:bg-green-100"
                  data-testid="button-research"
                >
                  <Scale className="mr-2 h-4 w-4" />
                  Start Research
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Case Management */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-indigo-200 bg-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Target className="text-indigo-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Case Management</h3>
                <p className="text-sm text-gray-500">Organize cases & documents</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/case-management">
                <Button 
                  variant="outline" 
                  className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                  data-testid="button-case-management"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Manage Cases
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-testid="enhanced-features">
        {/* Deadline Management Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-purple-600" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>
              Critical deadlines and court dates requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800">Motion to Dismiss Response</p>
                    <p className="text-sm text-red-600">Due in 2 days</p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Critical</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-800">Discovery Deadline</p>
                    <p className="text-sm text-yellow-600">Due in 5 days</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">High</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4 text-purple-600 hover:text-purple-700">
              <Link href="/deadlines" className="flex items-center w-full">
                <Calendar className="mr-2 h-4 w-4" />
                View All Deadlines
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Legal Research Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-green-600" />
              Legal Research Tools
            </CardTitle>
            <CardDescription>
              Quick access to free legal databases and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start" 
                      onClick={() => window.open('https://scholar.google.com/schhp?hl=en&as_sdt=2006', '_blank')}>
                <Scale className="mr-2 h-4 w-4" />
                Search Case Law
              </Button>
              <Button variant="ghost" className="w-full justify-start"
                      onClick={() => window.open('https://www.congress.gov/', '_blank')}>
                <Book className="mr-2 h-4 w-4" />
                Federal Statutes
              </Button>
              <Button variant="ghost" className="w-full justify-start"
                      onClick={() => window.open('https://www.law.cornell.edu/rules', '_blank')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Court Rules
              </Button>
            </div>
            <Button variant="ghost" className="w-full mt-4 text-green-600 hover:text-green-700">
              <Link href="/research" className="flex items-center w-full">
                <Search className="mr-2 h-4 w-4" />
                Open Research Assistant
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Document Upload and AI Analysis Section */}
      <Card className="mb-8" data-testid="document-upload-section">
        <CardHeader>
          <CardTitle>Document Upload & AI Analysis</CardTitle>
          <CardDescription>
            Upload existing documents for AI analysis and automatic classification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadZone />
        </CardContent>
      </Card>

      {/* Document Templates */}
      <DocumentTemplates onSelectTemplate={handleTemplateSelect} />

      {/* Pro Bono Directory */}
      <ProBonoDirectory />

      {/* CM/ECF Integration Status */}
      <CMECFStatusCard />

      {/* Recent Activity and Help */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="bottom-section">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(recentActivity) && recentActivity.length > 0 ? (
                recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-start" data-testid={`activity-${activity.id}`}>
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Upload className="text-primary-600 text-sm" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900" data-testid="activity-title">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600" data-testid="activity-status">
                        {activity.status}
                      </p>
                      <p className="text-xs text-gray-500" data-testid="activity-timestamp">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start by uploading a document or creating a new filing</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button 
                variant="ghost" 
                className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                data-testid="view-all-activity"
              >
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="text-primary-600 text-lg mt-1" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">CM/ECF Help Desk</h4>
                  <p className="text-sm text-gray-600">
                    <a 
                      href="tel:8662396233" 
                      className="text-primary-600 hover:text-primary-700"
                      data-testid="help-phone"
                    >
                      (866) 239-6233
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">Monday-Friday, 8:30 AM - 4:30 PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-primary-600 text-lg mt-1" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Email Support</h4>
                  <p className="text-sm text-gray-600">
                    <a 
                      href="mailto:support@legalfileai.com" 
                      className="text-primary-600 hover:text-primary-700"
                      data-testid="help-email"
                    >
                      support@legalfileai.com
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <Book className="text-primary-600 text-lg mt-1" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Documentation</h4>
                  <p className="text-sm text-gray-600">
                    <a 
                      href="https://www.mad.uscourts.gov" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-600 hover:text-primary-700"
                      data-testid="help-docs"
                    >
                      Federal Court Guidelines
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">Official filing requirements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}