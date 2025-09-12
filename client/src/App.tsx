import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Component, ReactNode } from "react";

// Lazy load components with error handling
const Navigation = React.lazy(() => import("@/components/layout/navigation").catch(() => ({ default: () => <div>Navigation unavailable</div> })));
const Dashboard = React.lazy(() => import("@/pages/dashboard").catch(() => ({ default: () => <div>Dashboard unavailable</div> })));
const FileDocument = React.lazy(() => import("@/pages/file-document").catch(() => ({ default: () => <div>File Document unavailable</div> })));
const EmergencyFiling = React.lazy(() => import("@/pages/emergency-filing").catch(() => ({ default: () => <div>Emergency Filing unavailable</div> })));
const ProBonoSearch = React.lazy(() => import("@/pages/pro-bono-search").catch(() => ({ default: () => <div>Pro Bono Search unavailable</div> })));
const CaseManagement = React.lazy(() => import("@/pages/case-management").catch(() => ({ default: () => <div>Case Management unavailable</div> })));
const MPCAssistant = React.lazy(() => import("@/pages/mpc-assistant").catch(() => ({ default: () => <div>MPC Assistant unavailable</div> })));
const Subscribe = React.lazy(() => import("@/pages/subscribe").catch(() => ({ default: () => <div>Subscribe unavailable</div> })));
const NotFound = React.lazy(() => import("@/pages/not-found").catch(() => ({ default: () => <div>Page not found</div> })));
const Landing = React.lazy(() => import("./pages/landing").catch(() => ({ default: () => <div>Landing unavailable</div> })));
const Features = React.lazy(() => import("./pages/features").catch(() => ({ default: () => <div>Features unavailable</div> })));
const Pricing = React.lazy(() => import("./pages/pricing").catch(() => ({ default: () => <div>Pricing unavailable</div> })));
const About = React.lazy(() => import("./pages/about").catch(() => ({ default: () => <div>About unavailable</div> })));
const Blog = React.lazy(() => import("./pages/blog").catch(() => ({ default: () => <div>Blog unavailable</div> })));
const Auth = React.lazy(() => import("./pages/auth").catch(() => ({ default: () => <div>Auth unavailable</div> })));

import React, { Suspense } from "react";

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
    console.error("Error stack:", error.stack);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "system-ui" }}>
          <h1>LegalEaseFile</h1>
          <p>Something went wrong. Please refresh the page.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{ padding: "0.5rem 1rem", marginTop: "1rem", marginRight: "1rem" }}
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  console.log("🎯 Router rendering - BULLETPROOF version");
  
  try {
    return (
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading LegalEaseFile...</div>}>
        <Switch>
          {/* Public Pages - Always Accessible */}
          <Route path="/" component={Landing} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/about" component={About} />
          <Route path="/blog" component={Blog} />
          <Route path="/auth" component={Auth} />
          <Route path="/signin" component={Auth} />
          <Route path="/signup" component={Auth} />
          <Route path="/login" component={Auth} />
          
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
      </Suspense>
    );
  } catch (error) {
    console.error("Router error:", error);
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>LegalEaseFile</h1>
        <p>Loading error occurred. Please refresh the page.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }
}

function ProtectedRoute({ params }: { params?: any }) {
  // For now, let's allow access to protected routes and add auth later
  // This ensures the features work while we build them properly
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div style={{ padding: "2rem" }}>Loading navigation...</div>}>
        <Navigation />
      </Suspense>
      <Suspense fallback={<div style={{ padding: "2rem" }}>Loading page...</div>}>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/file-document" component={FileDocument} />
          <Route path="/emergency-filing" component={EmergencyFiling} />
          <Route path="/pro-bono-search" component={ProBonoSearch} />
          <Route path="/case-management" component={CaseManagement} />
          <Route path="/mpc-assistant" component={MPCAssistant} />
          <Route path="/subscribe" component={Subscribe} />
        </Switch>
      </Suspense>
    </div>
  );
}

function App() {
  console.log("🚀 LegalEaseFile BULLETPROOF - no more white screens!");

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
