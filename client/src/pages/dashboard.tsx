import { Plus, AlertTriangle, HandHeart, Upload, Clock, Phone, Book, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import EmergencyAlert from "@/components/legal/emergency-alert";
import FileUploadZone from "@/components/document/file-upload-zone";
import DocumentTemplates from "@/components/document/document-templates";
import CMECFStatusCard from "@/components/legal/cmecf-status";
import ProBonoDirectory from "@/components/legal/pro-bono-directory";

export default function Dashboard() {
  const { data: recentActivity = [] } = useQuery({
    queryKey: ["/api/filing-history", "demo-user-id"],
    queryFn: async () => {
      // Mock recent activity for dashboard
      return [
        {
          id: "1",
          title: "Motion for Summary Judgment",
          status: "Draft saved - Ready for review",
          timestamp: "2 hours ago",
        },
        {
          id: "2", 
          title: "Discovery Request",
          status: "Filed successfully",
          timestamp: "1 day ago",
        },
      ];
    },
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
                <p className="text-sm text-gray-600">Start the filing process with AI assistance</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/file-document">
                <Button 
                  className="w-full bg-primary-600 text-white hover:bg-primary-700"
                  onClick={handleStartFiling}
                  data-testid="start-filing-button"
                >
                  Start Filing Process
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Filing */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-error-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-error-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Emergency Filing</h3>
                <p className="text-sm text-gray-600">TRO, preliminary injunctions, urgent matters</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/emergency-filing">
                <Button 
                  className="w-full bg-error-600 text-white hover:bg-error-700"
                  onClick={handleEmergencyFiling}
                  data-testid="emergency-filing-button"
                >
                  Emergency Filing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Find Legal Help */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <HandHeart className="text-success-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Find Legal Help</h3>
                <p className="text-sm text-gray-600">Pro bono lawyers and legal aid organizations</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/pro-bono-search">
                <Button 
                  className="w-full bg-success-600 text-white hover:bg-success-700"
                  data-testid="find-legal-help-button"
                >
                  Search Directory
                </Button>
              </Link>
            </div>
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
              {recentActivity.map((activity: any) => (
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
              ))}
            </div>
            <div className="mt-4">
              <Button 
                variant="ghost" 
                className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                data-testid="view-all-activity"
              >
                View all activity
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
                      href="mailto:ecfhelp@mad.uscourts.gov" 
                      className="text-primary-600 hover:text-primary-700"
                      data-testid="help-email"
                    >
                      ecfhelp@mad.uscourts.gov
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">Do not email documents</p>
                </div>
              </div>

              <div className="flex items-start">
                <Book className="text-primary-600 text-lg mt-1" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">User Manual</h4>
                  <p className="text-sm text-gray-600">
                    <a
                      href="https://www.mad.uscourts.gov/caseinfo/pdf/training/ECFmanual-MA.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline"
                      data-testid="help-manual"
                    >
                      Download CM/ECF Manual
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
