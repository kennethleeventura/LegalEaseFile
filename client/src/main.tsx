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
  const rootElement = document.getElementById("root");
  console.log("🎯 Root element:", rootElement);
  
  if (rootElement) {
    const root = createRoot(rootElement);
    console.log("✅ Creating React root...");
    root.render(<TestApp />);
    console.log("🎊 React app rendered!");
  } else {
    document.body.innerHTML = '<div style="background: red; color: white; padding: 50px;">❌ No root element found!</div>';
  }
  
} catch (error) {
  console.error("💥 Error in main.tsx:", error);
  document.body.innerHTML = `<div style="background: red; color: white; padding: 50px;">💥 Error: ${error.message}</div>`;
}