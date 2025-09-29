import { AlertTriangle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";

export default function EmergencyAlert() {
  return (
    <Alert className="mb-6 bg-warning-50 border-l-4 border-warning-500 shadow-sm" data-testid="emergency-alert">
      <AlertTriangle className="text-warning-500 h-5 w-5" />
      <AlertDescription className="text-warning-700">
        <strong>Emergency Filing Notice:</strong> For time-sensitive matters (TRO, preliminary injunctions),{" "}
        <Link href="/emergency-filing">
          <span className="underline font-medium cursor-pointer hover:text-warning-800" data-testid="emergency-link">
            click here for immediate assistance
          </span>
        </Link>{" "}
        or call{" "}
        <a 
          href="tel:6177489200" 
          className="underline font-medium hover:text-warning-800"
          data-testid="emergency-phone"
        >
          (617) 748-9200
        </a>
        .
      </AlertDescription>
    </Alert>
  );
}
