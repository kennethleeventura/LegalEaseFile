import { createRoot } from "react-dom/client";

console.log("🚀 PRODUCTION TEST: Script loaded");

// Simple test to show something is working
document.body.style.backgroundColor = 'lightgreen';
document.body.innerHTML = '<h1 style="padding: 50px; color: black;">✅ PRODUCTION TEST: JavaScript is running!</h1>';

setTimeout(() => {
  console.log("🔄 PRODUCTION TEST: Starting React render");
  
  // Clear the test content
  document.body.innerHTML = '<div id="root"></div>';
  document.body.style.backgroundColor = '';
  
  try {
    // Simple test component
    function TestApp() {
      return (
        <div style={{ 
          padding: '50px', 
          backgroundColor: 'blue', 
          color: 'white',
          minHeight: '100vh',
          fontSize: '24px'
        }}>
          <h1>🎉 PRODUCTION REACT IS WORKING!</h1>
          <p>This proves React can mount in production.</p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
      );
    }
    
    const rootElement = document.getElementById("root");
    if (rootElement) {
      console.log("✅ PRODUCTION TEST: Root found, rendering React");
      createRoot(rootElement).render(<TestApp />);
      console.log("🎊 PRODUCTION TEST: React rendered successfully");
    } else {
      console.error("❌ PRODUCTION TEST: No root element found");
    }
    
  } catch (error) {
    console.error("💥 PRODUCTION TEST: Error rendering React:", error);
    document.body.innerHTML = `<h1 style="padding: 50px; background: red; color: white;">❌ React Error: ${error.message}</h1>`;
  }
}, 1000);