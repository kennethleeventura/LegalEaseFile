import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 LegalEaseFile starting - comprehensive site");

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
  root.render(<App />);
  console.log("✅ LegalEaseFile comprehensive app rendered successfully");
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