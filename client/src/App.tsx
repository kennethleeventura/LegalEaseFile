import { Switch, Route } from "wouter";
import Landing from "./pages/landing";
import Features from "./pages/features";
import Pricing from "./pages/pricing";
import About from "./pages/about";
import Blog from "./pages/blog";

function App() {
  console.log("🚀 LegalEaseFile loading - emergency fix");
  
  try {
    return (
      <div className="min-h-screen">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/about" component={About} />
          <Route path="/blog" component={Blog} />
          <Route component={() => <div className="p-8 text-center"><h1 className="text-2xl">Page Not Found</h1><p><a href="/" className="text-blue-600">Go Home</a></p></div>} />
        </Switch>
      </div>
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
