import { Plus, AlertTriangle, HandHeart, Upload, Clock, Phone, Book, Mail, Sparkles, ShoppingBag, TrendingUp, Star, Gift } from "lucide-react";
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
        <Card className="border-4 border-dashed border-purple-200 bg-gradient-to-br from-blue-50 to-purple-50 p-8" data-testid="main-header">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Upload className="text-blue-600 text-6xl mx-auto" />
              <Sparkles className="absolute -top-2 -right-2 text-yellow-500 text-2xl animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Massachusetts Federal District Court Filing
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
              AI-powered document preparation and filing for the U.S. District Court for the District of Massachusetts.
              <span className="font-semibold text-green-600"> Completely free forever</span> - no subscriptions, no limits.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                <Gift className="w-4 h-4 text-green-500 mr-1" />
                <span>Always Free</span>
              </div>
              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span>Unlimited Usage</span>
              </div>
            </div>
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

        {/* Premium Services */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-purple-600 text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Premium Services</h3>
                <p className="text-sm text-gray-500">Optional premium enhancements</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/premium-marketplace">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  data-testid="button-premium-services"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explore Premium
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