// Simple test to verify React is mounting
console.log("🚀 main.tsx starting...");

import { createRoot } from "react-dom/client";

// Add visible element first to show JS is running
document.body.innerHTML = '<div style="background: green; color: white; padding: 50px; font-size: 24px;">✅ JavaScript is running! Loading React...</div>';

console.log("📦 React DOM imported");

// Simple test component
function TestApp() {
  return (
    <div style={{ 
      background: 'blue', 
      color: 'white', 
      padding: '50px', 
      fontSize: '24px',
      minHeight: '100vh'
    }}>
      <h1>🎉 React is working!</h1>
      <h2>LegalEaseFile Test Mode</h2>
      <p>If you see this, React is mounting correctly.</p>
    </div>
  );
}

try {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded!");
    
    const rootElement = document.getElementById("root");
    console.log("🎯 Root element:", rootElement);
    console.log("🎯 Document body:", document.body);
    console.log("🎯 All elements with id:", document.querySelectorAll('[id]'));
    
    if (rootElement) {
      const root = createRoot(rootElement);
      console.log("✅ Creating React root...");
      root.render(<TestApp />);
      console.log("🎊 React app rendered!");
    } else {
      // Create root element if it doesn't exist
      const newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      
      const root = createRoot(newRoot);
      root.render(<TestApp />);
      console.log("🎊 Created root element and rendered!");
    }
  });
  
} catch (error) {
  console.error("💥 Error in main.tsx:", error);
  document.body.innerHTML = `<div style="background: red; color: white; padding: 50px;">💥 Error: ${error.message}</div>`;
}