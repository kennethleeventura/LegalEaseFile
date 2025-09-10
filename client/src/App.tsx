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
import NotFound from "@/pages/not-found";
import Landing from "./pages/landing";

function Router() {
  try {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div style={{ padding: '50px', textAlign: 'center', backgroundColor: 'yellow' }}>
          <h2>Loading authentication...</h2>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Landing />;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/file-document" component={FileDocument} />
          <Route path="/emergency-filing" component={EmergencyFiling} />
          <Route path="/pro-bono-search" component={ProBonoSearch} />
          <Route path="/case-management" component={CaseManagement} />
          <Route path="/mpc-assistant" component={MPCAssistant} />
          <Route path="/subscribe" component={Subscribe} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '50px', backgroundColor: 'red', color: 'white' }}>
        <h1>Error in Router</h1>
        <p>{error.toString()}</p>
        <h2>Fallback: Welcome to LegalEaseFile!</h2>
      </div>
    );
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
          <h1 style={{ color: 'black', fontSize: '24px' }}>LegalEaseFile App Loading...</h1>
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
