#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function createDirectorySafe(dirPath) {
  if (fs.existsSync(dirPath)) {
    return true;
  }

  try {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
    return true;
  } catch (error) {
    if (error.code === 'EPERM') {
      console.log(`⚠️  Permission denied creating ${dirPath}. Trying alternative methods...`);

      // Method 1: Try without recursive option
      try {
        fs.mkdirSync(dirPath);
        console.log(`📁 Created directory: ${dirPath} (alternative method)`);
        return true;
      } catch (retryError) {
        // Method 2: Try using command line
        try {
          const isWindows = process.platform === 'win32';
          const mkdirCmd = isWindows ? `mkdir "${dirPath}"` : `mkdir -p "${dirPath}"`;
          execSync(mkdirCmd, { stdio: 'pipe' });
          console.log(`📁 Created directory: ${dirPath} (command line fallback)`);
          return true;
        } catch (cmdError) {
          console.error(`❌ Failed to create directory ${dirPath} with all methods`);
          console.error('Solutions:');
          console.error('1. Run command prompt as administrator');
          console.error('2. Manually create the directory');
          console.error('3. Change to a directory with write permissions');
          throw error;
        }
      }
    } else {
      throw error;
    }
  }
}

console.log('🚀 Starting LegalEaseFile build process...');
console.log('📍 Current directory:', process.cwd());
console.log('📍 Node version:', process.version);

function runCommand(command, description) {
  console.log(`\n${description}`);
  console.log(`▶️  Running: ${command}`);
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log(`✅ ${description} - SUCCESS`);
  } catch (error) {
    console.error(`❌ ${description} - FAILED`);
    console.error(`Command: ${command}`);
    console.error(`Exit code: ${error.status}`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

try {
  // Step 1: Verify we have package.json
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found in current directory');
  }
  console.log('✅ package.json found');

  // Step 2: Install dependencies
  runCommand('npm install', '📦 Step 1: Installing dependencies');

  // Step 3: Build client
  runCommand('npx vite build', '🏗️  Step 2: Building client with Vite');

  // Step 4: Create dist directory if it doesn't exist
  createDirectorySafe('dist');

  // Step 5: Build server
  runCommand(
    'npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node18',
    '⚙️  Step 3: Building server with ESBuild'
  );

  // Step 6: Verify build outputs
  console.log('\n🔍 Verifying build outputs...');
  
  const clientBuildExists = fs.existsSync('dist/public/index.html');
  const serverBuildExists = fs.existsSync('dist/index.js');
  
  console.log(`📄 Client build (dist/public/index.html): ${clientBuildExists ? '✅' : '❌'}`);
  console.log(`⚙️  Server build (dist/index.js): ${serverBuildExists ? '✅' : '❌'}`);
  
  if (!serverBuildExists) {
    throw new Error('Server build failed - dist/index.js not found');
  }
  
  if (!clientBuildExists) {
    throw new Error('Client build failed - dist/public/index.html not found');
  }

  console.log('\n🎉 Build completed successfully!');
  console.log('📂 Build artifacts:');
  
  if (fs.existsSync('dist')) {
    const distFiles = fs.readdirSync('dist');
    distFiles.forEach(file => {
      console.log(`   - dist/${file}`);
    });
  }

} catch (error) {
  console.error('\n💥 BUILD FAILED!');
  console.error('❌ Error:', error.message);
  console.error('\n🔧 Debugging info:');
  console.error('📍 Working directory:', process.cwd());
  console.error('📍 Node version:', process.version);
  console.error('📍 NPM version:', (() => {
    try {
      return execSync('npm --version', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  })());
  
  process.exit(1);
}