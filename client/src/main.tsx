import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 LegalEaseFile starting - QueryClient fixed!");

// Fixed timeout approach that works
setTimeout(() => {
  console.log("🔄 Starting React render with FIXED QueryClient");
  
  try {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      console.log("✅ Root found, rendering FIXED LegalEaseFile App");
      createRoot(rootElement).render(<App />);
      console.log("🎊 FIXED LegalEaseFile App rendered successfully");
    } else {
      console.error("❌ No root element found");
      // Fallback: create root element
      const newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      createRoot(newRoot).render(<App />);
      console.log("✅ Created root and rendered FIXED App");
    }
  } catch (error) {
    console.error("💥 Error rendering FIXED LegalEaseFile:", error);
    document.body.innerHTML = `<h1 style="padding: 50px; background: red; color: white;">💥 Error: ${error.message}</h1>`;
  }
}, 500);