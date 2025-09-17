import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

console.log("🚀 LegalEaseFile LAUNCH READY - Full App Version");

// Add error handling for the root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ Root element not found - creating fallback");
  document.body.innerHTML = '<div id="root"></div>';
  const fallbackRoot = document.getElementById("root");
  if (!fallbackRoot) {
    throw new Error("Failed to create root element");
  }
}

try {
  const root = createRoot(rootElement!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
  console.log("✅ LegalEaseFile Full App rendered successfully - READY FOR LAUNCH");
} catch (error) {
  console.error("❌ Failed to render app:", error);
  document.body.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui;">
      <h1>LegalEaseFile</h1>
      <p>Application temporarily unavailable. Please refresh the page.</p>
      <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem;">Refresh Page</button>
    </div>
  `;
}