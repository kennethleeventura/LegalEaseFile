import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import Features from "./pages/features";
import Pricing from "./pages/pricing";
import About from "./pages/about";
import Blog from "./pages/blog";

function Router() {
  console.log("🎯 Router rendering - BULLETPROOF version");
  
  return (
    <Switch>
      {/* Public Pages - Always Accessible */}
      <Route path="/" component={Landing} />
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      
      {/* Protected Pages - Full Features */}
      <Route path="/dashboard" component={ProtectedRoute} />
      <Route path="/file-document" component={ProtectedRoute} />
      <Route path="/emergency-filing" component={ProtectedRoute} />
      <Route path="/pro-bono-search" component={ProtectedRoute} />
      <Route path="/case-management" component={ProtectedRoute} />
      <Route path="/mpc-assistant" component={ProtectedRoute} />
      <Route path="/subscribe" component={ProtectedRoute} />
      
      {/* 404 Page */}
      <Route component={NotFound} />
    </Switch>
  );
}

function ProtectedRoute({ params }: { params?: any }) {
  // For now, let's allow access to protected routes and add auth later
  // This ensures the features work while we build them properly
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/file-document" component={FileDocument} />
        <Route path="/emergency-filing" component={EmergencyFiling} />
        <Route path="/pro-bono-search" component={ProBonoSearch} />
        <Route path="/case-management" component={CaseManagement} />
        <Route path="/mpc-assistant" component={MPCAssistant} />
        <Route path="/subscribe" component={Subscribe} />
      </Switch>
    </div>
  );
}

function App() {
  console.log("🚀 LegalEaseFile BULLETPROOF - no more white screens!");

  return (
    <TooltipProvider>
      <Router />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
