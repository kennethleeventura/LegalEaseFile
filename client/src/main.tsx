import { createRoot } from "react-dom/client";

console.log("🚀 DEBUGGING: Script started");

// Minimal test to isolate the issue
function MinimalApp() {
  console.log("🎯 MinimalApp rendering");
  
  try {
    return (
      <div style={{ 
        padding: '50px', 
        backgroundColor: 'green', 
        color: 'white',
        minHeight: '100vh',
        fontSize: '20px'
      }}>
        <h1>🟢 MINIMAL APP WORKING!</h1>
        <p>This proves React can render basic components.</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
        
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'darkgreen' }}>
          <h2>Next: Test complex components</h2>
          <p>If you see this, the issue is in the full App component imports/dependencies.</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("💥 Error in MinimalApp:", error);
    return (
      <div style={{ padding: '50px', backgroundColor: 'red', color: 'white' }}>
        <h1>❌ MinimalApp Error: {error.message}</h1>
      </div>
    );
  }
}

setTimeout(() => {
  console.log("🔄 Starting minimal React render");
  
  try {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      console.log("✅ Root found, rendering MinimalApp");
      createRoot(rootElement).render(<MinimalApp />);
      console.log("🎊 MinimalApp rendered successfully");
    } else {
      console.error("❌ No root element found");
      const newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      createRoot(newRoot).render(<MinimalApp />);
      console.log("✅ Created root and rendered MinimalApp");
    }
  } catch (error) {
    console.error("💥 Error rendering MinimalApp:", error);
    document.body.innerHTML = `<h1 style="padding: 50px; background: red; color: white;">💥 Fatal Error: ${error.message}</h1>`;
  }
}, 500);