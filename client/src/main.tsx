import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 LegalEaseFile starting - comprehensive site");

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(<App />);

console.log("✅ LegalEaseFile comprehensive app rendered successfully");