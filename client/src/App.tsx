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
import Features from "./pages/features";
import Pricing from "./pages/pricing";
import About from "./pages/about";
import Blog from "./pages/blog";

function Router() {
  console.log("🎯 Router rendering - comprehensive app restored");
  
  try {
    return (
      <Switch>
        {/* Public Pages - Always Accessible */}
        <Route path="/" component={Landing} />
        <Route path="/features" component={Features} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/about" component={About} />
        <Route path="/blog" component={Blog} />
        
        {/* Protected Pages - Require Authentication */}
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
  } catch (error) {
    console.error("💥 Router error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-700 mb-4">{error.toString()}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
}

function ProtectedRoute({ params }: { params?: any }) {
  const { isAuthenticated, isLoading, error } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading LegalEaseFile...</h2>
          <p className="text-gray-500 mt-2">Authenticating your session</p>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    // Show login prompt instead of hard redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access LegalEaseFile features</p>
          <button 
            onClick={() => window.location.href = "/api/login"} 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
          >
            Log In
          </button>
          <button 
            onClick={() => window.location.href = "/"} 
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

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
  console.log("🚀 LegalEaseFile comprehensive app - all features restored");

  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("💥 App error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">LegalEaseFile Error</h1>
          <p className="text-gray-700 mb-4">{error.toString()}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default App;
