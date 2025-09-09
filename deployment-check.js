#!/usr/bin/env node

/**
 * LegalFile AI Deployment Readiness Check
 * Validates all required environment variables and configurations
 */

import { readFileSync } from 'fs';

const REQUIRED_ENV_VARS = {
  // Database
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL database connection string',
    example: 'postgresql://user:password@host:port/database'
  },
  
  // Authentication
  REPLIT_DOMAINS: {
    required: false,
    description: 'Comma-separated list of allowed domains (legacy)',
    example: 'your-app.onrender.com'
  },
  ALLOWED_DOMAINS: {
    required: false,
    description: 'Comma-separated list of allowed domains',
    example: 'your-app.onrender.com,your-custom-domain.com'
  },
  DOMAINS: {
    required: false,
    description: 'Comma-separated list of allowed domains (alternative)',
    example: 'your-app.onrender.com'
  },
  SESSION_SECRET: {
    required: true,
    description: 'Secret key for session encryption',
    example: 'your-secure-session-secret-key'
  },
  
  // Payment Processing
  STRIPE_SECRET_KEY: {
    required: true,
    description: 'Stripe secret key for payment processing',
    example: 'sk_live_... or sk_test_...'
  },
  VITE_STRIPE_PUBLIC_KEY: {
    required: true,
    description: 'Stripe publishable key for frontend',
    example: 'pk_live_... or pk_test_...'
  },
  
  // AI Services
  OPENAI_API_KEY: {
    required: true,
    description: 'OpenAI API key for document analysis',
    example: 'sk-...'
  },
  
  // Case Management
  AIRTABLE_API_KEY: {
    required: true,
    description: 'Airtable API key for case management',
    example: 'key...'
  },
  AIRTABLE_BASE_ID: {
    required: true,
    description: 'Airtable base ID for case management',
    example: 'app...'
  },
  
  // Optional but recommended
  NODE_ENV: {
    required: false,
    description: 'Environment mode',
    example: 'production'
  },
  PORT: {
    required: false,
    description: 'Server port',
    example: '5000'
  }
};

function checkEnvironmentVariables() {
  console.log('🔍 Checking Environment Variables...\n');
  
  const missing = [];
  const warnings = [];

  // Check if at least one domain variable is set
  const domainVars = ['REPLIT_DOMAINS', 'ALLOWED_DOMAINS', 'DOMAINS'];
  const hasDomainVar = domainVars.some(varName => process.env[varName]);

  if (!hasDomainVar) {
    missing.push({
      name: 'ALLOWED_DOMAINS (or REPLIT_DOMAINS/DOMAINS)',
      description: 'At least one domain variable must be set for authentication',
      example: 'your-app.onrender.com'
    });
  }

  for (const [varName, config] of Object.entries(REQUIRED_ENV_VARS)) {
    const value = process.env[varName];
    
    if (config.required && !value) {
      missing.push({
        name: varName,
        description: config.description,
        example: config.example
      });
    } else if (value) {
      console.log(`✅ ${varName}: SET`);
      
      // Additional validation
      if (varName === 'STRIPE_SECRET_KEY' && !value.startsWith('sk_')) {
        warnings.push(`⚠️  ${varName} should start with 'sk_'`);
      }
      if (varName === 'VITE_STRIPE_PUBLIC_KEY' && !value.startsWith('pk_')) {
        warnings.push(`⚠️  ${varName} should start with 'pk_'`);
      }
      if (varName === 'OPENAI_API_KEY' && !value.startsWith('sk-')) {
        warnings.push(`⚠️  ${varName} should start with 'sk-'`);
      }
      if (varName === 'AIRTABLE_API_KEY' && !value.startsWith('key')) {
        warnings.push(`⚠️  ${varName} should start with 'key'`);
      }
      if (varName === 'AIRTABLE_BASE_ID' && !value.startsWith('app')) {
        warnings.push(`⚠️  ${varName} should start with 'app'`);
      }
    } else {
      console.log(`ℹ️  ${varName}: NOT SET (optional)`);
    }
  }
  
  return { missing, warnings };
}

function checkPackageJson() {
  console.log('\n📦 Checking Package Configuration...\n');
  
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    // Check scripts
    const requiredScripts = ['dev', 'build', 'start', 'check'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length === 0) {
      console.log('✅ All required npm scripts present');
    } else {
      console.log(`❌ Missing npm scripts: ${missingScripts.join(', ')}`);
    }
    
    // Check dependencies
    const criticalDeps = [
      'express', 'drizzle-orm', 'openai', 'stripe', 'airtable',
      '@neondatabase/serverless', 'react', 'vite'
    ];
    
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const missingDeps = criticalDeps.filter(dep => !allDeps[dep]);
    
    if (missingDeps.length === 0) {
      console.log('✅ All critical dependencies present');
    } else {
      console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
    }
    
    return { scriptsOk: missingScripts.length === 0, depsOk: missingDeps.length === 0 };
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    return { scriptsOk: false, depsOk: false };
  }
}

function checkBuildConfiguration() {
  console.log('\n🏗️  Checking Build Configuration...\n');
  
  const checks = [];
  
  // Check TypeScript config
  try {
    const tsConfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
    console.log('✅ TypeScript configuration found');
    checks.push(true);
  } catch (error) {
    console.log('❌ TypeScript configuration missing or invalid');
    checks.push(false);
  }
  
  // Check Vite config
  try {
    readFileSync('vite.config.ts', 'utf8');
    console.log('✅ Vite configuration found');
    checks.push(true);
  } catch (error) {
    console.log('❌ Vite configuration missing');
    checks.push(false);
  }
  
  // Check Drizzle config
  try {
    readFileSync('drizzle.config.ts', 'utf8');
    console.log('✅ Drizzle configuration found');
    checks.push(true);
  } catch (error) {
    console.log('❌ Drizzle configuration missing');
    checks.push(false);
  }
  
  return checks.every(check => check);
}

function generateReport(envCheck, packageCheck, buildCheck) {
  console.log('\n📋 DEPLOYMENT READINESS REPORT\n');
  console.log('='.repeat(50));
  
  // Environment Variables
  console.log('\n🔧 ENVIRONMENT VARIABLES:');
  if (envCheck.missing.length === 0) {
    console.log('✅ All required environment variables are set');
  } else {
    console.log('❌ Missing required environment variables:');
    envCheck.missing.forEach(missing => {
      console.log(`   • ${missing.name}: ${missing.description}`);
      console.log(`     Example: ${missing.example}`);
    });
  }
  
  if (envCheck.warnings.length > 0) {
    console.log('\n⚠️  Environment Variable Warnings:');
    envCheck.warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  // Package Configuration
  console.log('\n📦 PACKAGE CONFIGURATION:');
  console.log(packageCheck.scriptsOk ? '✅ Scripts configured' : '❌ Scripts missing');
  console.log(packageCheck.depsOk ? '✅ Dependencies installed' : '❌ Dependencies missing');
  
  // Build Configuration
  console.log('\n🏗️  BUILD CONFIGURATION:');
  console.log(buildCheck ? '✅ Build configuration complete' : '❌ Build configuration incomplete');
  
  // Overall Status
  const isReady = envCheck.missing.length === 0 && packageCheck.scriptsOk && packageCheck.depsOk && buildCheck;
  
  console.log('\n🚀 DEPLOYMENT STATUS:');
  if (isReady) {
    console.log('✅ READY FOR DEPLOYMENT');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Test: npm run start');
    console.log('3. Deploy to production');
  } else {
    console.log('❌ NOT READY FOR DEPLOYMENT');
    console.log('\nPlease fix the issues above before deploying.');
  }
  
  console.log('\n' + '='.repeat(50));
}

// Run all checks
async function main() {
  console.log('🚀 LegalFile AI Deployment Readiness Check\n');
  
  const envCheck = checkEnvironmentVariables();
  const packageCheck = checkPackageJson();
  const buildCheck = checkBuildConfiguration();
  
  generateReport(envCheck, packageCheck, buildCheck);
}

main().catch(console.error);
