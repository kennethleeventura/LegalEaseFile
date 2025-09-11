import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Wait for DOM to be ready - this was the key fix!
document.addEventListener('DOMContentLoaded', function() {
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    // Fallback: create root element if missing
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    createRoot(newRoot).render(<App />);
  }
});