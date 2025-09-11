import { createRoot } from "react-dom/client";

console.log("🚀 TESTING: Bypass QueryClient - test just Landing component");

// Simple Landing component test
function TestLanding() {
  console.log("🎯 TestLanding rendering");
  
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: 'blue', 
      color: 'white',
      minHeight: '100vh',
      fontSize: '18px'
    }}>
      <h1>🔵 TESTING LANDING COMPONENT</h1>
      <p>This tests if the issue is in authentication/QueryClient.</p>
      <p>If you see this blue screen, the issue is specifically with:</p>
      <ul>
        <li>useAuth hook making API calls</li>
        <li>QueryClient configuration</li>
        <li>Authentication flow</li>
      </ul>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'darkblue' }}>
        <h2>🔧 DIAGNOSIS</h2>
        <p>The App component imports useAuth which makes an API call immediately.</p>
        <p>This API call likely fails and crashes the whole component tree.</p>
        <p>Solution: Fix the QueryClient error handling or make auth optional.</p>
      </div>
    </div>
  );
}

setTimeout(() => {
  console.log("🔄 Starting Landing component test");
  
  try {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      console.log("✅ Root found, rendering TestLanding");
      createRoot(rootElement).render(<TestLanding />);
      console.log("🎊 TestLanding rendered successfully");
    } else {
      console.error("❌ No root element found");
      const newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      createRoot(newRoot).render(<TestLanding />);
      console.log("✅ Created root and rendered TestLanding");
    }
  } catch (error) {
    console.error("💥 Error rendering TestLanding:", error);
    document.body.innerHTML = `<h1 style="padding: 50px; background: red; color: white;">💥 Fatal Error: ${error.message}</h1>`;
  }
}, 500);