import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/layout/navigation";
import Dashboard from "@/pages/dashboard";
import FileDocument from "@/pages/file-document";
import EmergencyFiling from "@/pages/emergency-filing";
import ProBonoSearch from "@/pages/pro-bono-search";
import CaseManagement from "@/pages/case-management";
import MPCAssistant from "@/pages/mpc-assistant";
import Subscribe from "@/pages/subscribe";
import Pricing from "@/pages/pricing";
import PremiumMarketplace from "@/pages/premium-marketplace";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import NotFound from "@/pages/not-found";
import Landing from "./pages/landing";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/file-document" component={FileDocument} />
          <Route path="/emergency-filing" component={EmergencyFiling} />
          <Route path="/pro-bono-search" component={ProBonoSearch} />
          <Route path="/case-management" component={CaseManagement} />
          <Route path="/mpc-assistant" component={MPCAssistant} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/premium-marketplace" component={PremiumMarketplace} />
          <Route path="/analytics" component={AnalyticsDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
