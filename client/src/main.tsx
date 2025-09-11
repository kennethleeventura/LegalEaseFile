import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 LegalEaseFile loading...");

// Use same approach that worked in the test but with full app
setTimeout(() => {
  console.log("🔄 Starting React render with full App");
  
  try {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      console.log("✅ Root found, rendering LegalEaseFile App");
      createRoot(rootElement).render(<App />);
      console.log("🎊 LegalEaseFile App rendered successfully");
    } else {
      console.error("❌ No root element found");
      // Fallback: create root element
      const newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      createRoot(newRoot).render(<App />);
      console.log("✅ Created root and rendered App");
    }
  } catch (error) {
    console.error("💥 Error rendering LegalEaseFile:", error);
  }
}, 500); // Shorter delay since we know it works