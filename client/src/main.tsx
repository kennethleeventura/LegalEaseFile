import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add console logging to debug production issues
console.log("🚀 LegalEaseFile main.tsx loaded");
console.log("📍 Document readyState:", document.readyState);
console.log("📍 Current time:", new Date().toISOString());

// Wait for DOM to be ready - this was the key fix!
document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM Content Loaded event fired");
  const rootElement = document.getElementById("root");
  console.log("🎯 Root element found:", !!rootElement);
  
  if (rootElement) {
    console.log("🎊 Creating React root and rendering App");
    createRoot(rootElement).render(<App />);
    console.log("✅ React App rendered successfully");
  } else {
    console.log("⚠️ Root element not found, creating one");
    // Fallback: create root element if missing
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    createRoot(newRoot).render(<App />);
    console.log("✅ Created root element and rendered App");
  }
});