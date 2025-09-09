#!/usr/bin/env node

/**
 * Environment Variables Test Script
 * Run this to verify your environment variables are properly set
 */

console.log("🔍 Environment Variables Test\n");

const requiredVars = [
  'DATABASE_URL',
  'SESSION_SECRET', 
  'STRIPE_SECRET_KEY',
  'VITE_STRIPE_PUBLIC_KEY',
  'OPENAI_API_KEY',
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID'
];

const domainVars = [
  'REPLIT_DOMAINS',
  'ALLOWED_DOMAINS', 
  'DOMAINS'
];

console.log("📋 Required Environment Variables:");
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? "✅ SET" : "❌ NOT SET";
  console.log(`${varName}: ${status}`);
});

console.log("\n🌐 Domain Environment Variables:");
let domainFound = false;
domainVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? "✅ SET" : "❌ NOT SET";
  console.log(`${varName}: ${status}`);
  if (value) {
    console.log(`   Value: ${value}`);
    domainFound = true;
  }
});

console.log("\n🔍 All Environment Variables containing 'DOMAIN':");
Object.keys(process.env)
  .filter(key => key.toUpperCase().includes('DOMAIN'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key]}`);
  });

console.log("\n📊 Summary:");
if (domainFound) {
  console.log("✅ Domain configuration found - authentication should work");
} else {
  console.log("❌ No domain configuration found!");
  console.log("💡 Set one of these environment variables:");
  console.log("   ALLOWED_DOMAINS=your-app.onrender.com");
  console.log("   REPLIT_DOMAINS=your-app.onrender.com");  
  console.log("   DOMAINS=your-app.onrender.com");
}

const missingRequired = requiredVars.filter(varName => !process.env[varName]);
if (missingRequired.length > 0) {
  console.log(`❌ Missing ${missingRequired.length} required variables:`, missingRequired.join(', '));
} else {
  console.log("✅ All required environment variables are set");
}

console.log("\n" + "=".repeat(50));
