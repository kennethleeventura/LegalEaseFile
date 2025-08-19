import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/layout/navigation";
import Dashboard from "@/pages/dashboard";
import FileDocument from "@/pages/file-document";
import EmergencyFiling from "@/pages/emergency-filing";
import ProBonoSearch from "@/pages/pro-bono-search";
import CaseManagement from "@/pages/case-management";
import NBCAssistant from "@/pages/nbc-assistant";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/file-document" component={FileDocument} />
      <Route path="/emergency-filing" component={EmergencyFiling} />
      <Route path="/pro-bono-search" component={ProBonoSearch} />
      <Route path="/case-management" component={CaseManagement} />
      <Route path="/nbc-assistant" component={NBCAssistant} />
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
