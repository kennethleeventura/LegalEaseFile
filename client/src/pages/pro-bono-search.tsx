import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ProBonoDirectory from "@/components/legal/pro-bono-directory";
import EmergencyAlert from "@/components/legal/emergency-alert";

export default function ProBonoSearch() {
  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" data-testid="pro-bono-search-page">
      <EmergencyAlert />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="back-to-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Legal Help</h1>
          <p className="text-lg text-gray-600">
            Search for pro bono lawyers and legal aid organizations in Massachusetts
          </p>
        </div>
      </div>

      {/* Pro Bono Directory */}
      <ProBonoDirectory />
    </main>
  );
}
