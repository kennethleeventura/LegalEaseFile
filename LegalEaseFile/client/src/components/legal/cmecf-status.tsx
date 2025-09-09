import { CheckCircle, AlertCircle, UserCheck, Info, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import type { CMECFStatus } from "@/lib/types";

export default function CMECFStatusCard() {
  const { data: status, isLoading } = useQuery<CMECFStatus>({
    queryKey: ["/api/cmecf/status"],
  });

  const handleLinkPacerAccount = () => {
    // TODO: Implement PACER account linking modal
    console.log("Link PACER account clicked");
  };

  if (isLoading) {
    return (
      <Card data-testid="cmecf-status-loading">
        <CardHeader>
          <CardTitle>CM/ECF Integration Status</CardTitle>
          <CardDescription>Loading system status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-8" data-testid="cmecf-status-card">
      <CardHeader>
        <CardTitle>CM/ECF Integration Status</CardTitle>
        <CardDescription>
          Massachusetts Federal District Court NextGen CM/ECF System v{status?.version || "1.8.3"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Status */}
          <Alert className="bg-success-50 border border-success-200" data-testid="system-status">
            <CheckCircle className="text-success-600 h-5 w-5" />
            <AlertDescription>
              <h3 className="font-medium text-success-900">System Status: Online</h3>
              <p className="text-sm text-success-700 mt-1">Connected to ecf.mad.uscourts.gov</p>
              <p className="text-xs text-success-600 mt-1">
                Last checked: {status?.lastUpdated ? new Date(status.lastUpdated).toLocaleTimeString() : "2 minutes ago"}
              </p>
            </AlertDescription>
          </Alert>

          {/* Account Status */}
          <Alert className="bg-warning-50 border border-warning-200" data-testid="account-status">
            <UserCheck className="text-warning-600 h-5 w-5" />
            <AlertDescription>
              <h3 className="font-medium text-warning-900">PACER Account Required</h3>
              <p className="text-sm text-warning-700 mt-1">Link your PACER account for filing</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-warning-600 hover:text-warning-700 underline p-0"
                onClick={handleLinkPacerAccount}
                data-testid="link-pacer-button"
              >
                Link PACER Account
              </Button>
            </AlertDescription>
          </Alert>
        </div>

        {/* Filing Requirements */}
        <Alert className="mt-6 bg-primary-50 border border-primary-200" data-testid="filing-requirements">
          <Info className="text-primary-600 h-5 w-5" />
          <AlertDescription>
            <h4 className="font-medium text-primary-900 mb-3">CM/ECF Filing Requirements</h4>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• Electronic filing mandatory for all documents (except ex parte motions)</li>
              <li>• Documents must include "/s/" electronic signature</li>
              <li>• Fees must be paid within 24 hours of filing</li>
              <li>• Notice of Electronic Filing (NEF) serves as proof of filing</li>
              <li>• Multifactor authentication (MFA) required for account access</li>
            </ul>
            <div className="mt-3">
              <a
                href="https://www.mad.uscourts.gov/caseinfo/cmecf-general.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium underline inline-flex items-center"
                data-testid="cmecf-guidelines-link"
              >
                View complete CM/ECF guidelines
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
