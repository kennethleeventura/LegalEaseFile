#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting LegalEaseFile build process...');

// Ensure we're in the right directory
process.chdir(__dirname);

try {
  console.log('📦 Step 1: Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🏗️  Step 2: Building client with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('⚙️  Step 3: Building server with ESBuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  // Verify build artifacts exist
  if (!fs.existsSync('dist/index.js')) {
    throw new Error('Server build failed - index.js not found');
  }
  
  if (!fs.existsSync('dist/public/index.html')) {
    throw new Error('Client build failed - index.html not found');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Build artifacts:');
  console.log('   - dist/index.js (server)');
  console.log('   - dist/public/ (client assets)');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
