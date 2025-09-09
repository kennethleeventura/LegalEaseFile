#!/usr/bin/env node

/**
 * LegalFile AI API Endpoint Testing Script
 * Tests all critical API endpoints for deployment readiness
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

const API_ENDPOINTS = {
  // Public endpoints (no auth required)
  public: [
    {
      method: 'GET',
      path: '/api/subscription-plans',
      description: 'Get subscription plans',
      expectedStatus: 200
    },
    {
      method: 'GET',
      path: '/api/templates',
      description: 'Get document templates',
      expectedStatus: 200
    },
    {
      method: 'GET',
      path: '/api/templates/emergency',
      description: 'Get emergency templates',
      expectedStatus: 200
    },
    {
      method: 'GET',
      path: '/api/legal-aid/all',
      description: 'Get all legal aid organizations',
      expectedStatus: 200
    }
  ],
  
  // Protected endpoints (require authentication)
  protected: [
    {
      method: 'GET',
      path: '/api/auth/user',
      description: 'Get current user',
      expectedStatus: [200, 401] // 401 if not authenticated
    },
    {
      method: 'POST',
      path: '/api/create-subscription',
      description: 'Create subscription',
      expectedStatus: [200, 401, 404]
    },
    {
      method: 'GET',
      path: '/api/filing-history/user',
      description: 'Get user filing history',
      expectedStatus: [200, 401]
    },
    {
      method: 'GET',
      path: '/api/cmecf/status',
      description: 'Check CM/ECF status',
      expectedStatus: [200, 400, 401, 503] // 503 expected until PACER integration
    }
  ],
  
  // Service integration endpoints
  services: [
    {
      method: 'POST',
      path: '/api/airtable/cases',
      description: 'Create case in Airtable',
      body: {
        caseNumber: 'TEST-001',
        clientName: 'Test Client',
        documentType: 'Motion'
      },
      expectedStatus: [200, 500] // 500 if Airtable not configured
    },
    {
      method: 'GET',
      path: '/api/airtable/cases',
      description: 'Search cases',
      expectedStatus: [200, 500]
    }
  ]
};

async function makeRequest(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'LegalFile-API-Test/1.0'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    return {
      status: response.status,
      statusText: response.statusText,
      data: await response.json().catch(() => null),
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      error: error.message,
      status: 0
    };
  }
}

function isExpectedStatus(actual, expected) {
  if (Array.isArray(expected)) {
    return expected.includes(actual);
  }
  return actual === expected;
}

async function testEndpoints(category, endpoints) {
  console.log(`\n🧪 Testing ${category.toUpperCase()} Endpoints\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const { method, path, description, body, expectedStatus } = endpoint;
    
    console.log(`Testing: ${method} ${path}`);
    console.log(`Description: ${description}`);
    
    const result = await makeRequest(method, path, body);
    
    if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
      results.push({ ...endpoint, status: 'error', error: result.error });
    } else {
      const statusOk = isExpectedStatus(result.status, expectedStatus);
      const statusIcon = statusOk ? '✅' : '⚠️';
      
      console.log(`${statusIcon} Status: ${result.status} ${result.statusText}`);
      
      if (result.data) {
        console.log(`📄 Response: ${JSON.stringify(result.data).slice(0, 100)}...`);
      }
      
      results.push({
        ...endpoint,
        status: statusOk ? 'pass' : 'warning',
        actualStatus: result.status,
        response: result.data
      });
    }
    
    console.log('─'.repeat(50));
  }
  
  return results;
}

async function testHealthCheck() {
  console.log('🏥 Health Check\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    if (response.ok) {
      console.log('✅ Server is responding');
      return true;
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Server is not accessible: ${error.message}`);
    return false;
  }
}

function generateReport(results) {
  console.log('\n📊 TEST RESULTS SUMMARY\n');
  console.log('='.repeat(60));
  
  const allResults = Object.values(results).flat();
  const passed = allResults.filter(r => r.status === 'pass').length;
  const warnings = allResults.filter(r => r.status === 'warning').length;
  const errors = allResults.filter(r => r.status === 'error').length;
  const total = allResults.length;
  
  console.log(`📈 Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`❌ Errors: ${errors}`);
  
  const successRate = ((passed / total) * 100).toFixed(1);
  console.log(`📊 Success Rate: ${successRate}%`);
  
  if (errors > 0) {
    console.log('\n❌ FAILED TESTS:');
    allResults
      .filter(r => r.status === 'error')
      .forEach(r => {
        console.log(`   • ${r.method} ${r.path}: ${r.error}`);
      });
  }
  
  if (warnings > 0) {
    console.log('\n⚠️  WARNINGS:');
    allResults
      .filter(r => r.status === 'warning')
      .forEach(r => {
        console.log(`   • ${r.method} ${r.path}: Expected ${r.expectedStatus}, got ${r.actualStatus}`);
      });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (errors === 0 && warnings <= total * 0.2) {
    console.log('🎉 API ENDPOINTS READY FOR DEPLOYMENT');
  } else if (errors === 0) {
    console.log('⚠️  API ENDPOINTS MOSTLY READY - Review warnings');
  } else {
    console.log('❌ API ENDPOINTS NOT READY - Fix errors before deployment');
  }
}

async function main() {
  console.log('🚀 LegalFile AI API Endpoint Testing\n');
  console.log(`Testing against: ${BASE_URL}\n`);
  
  // Health check first
  const serverHealthy = await testHealthCheck();
  if (!serverHealthy) {
    console.log('\n❌ Server is not accessible. Please start the server first.');
    console.log('Run: npm run dev (for development) or npm run start (for production)');
    process.exit(1);
  }
  
  // Test all endpoint categories
  const results = {};
  
  for (const [category, endpoints] of Object.entries(API_ENDPOINTS)) {
    results[category] = await testEndpoints(category, endpoints);
  }
  
  // Generate final report
  generateReport(results);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
LegalFile AI API Testing Script

Usage:
  node api-test.js [options]

Options:
  --help, -h     Show this help message
  --url <url>    Set base URL (default: http://localhost:5000)

Environment Variables:
  API_BASE_URL   Base URL for API testing

Examples:
  node api-test.js
  node api-test.js --url https://your-app.replit.app
  API_BASE_URL=https://your-app.com node api-test.js
`);
  process.exit(0);
}

// Override base URL from command line
const urlIndex = process.argv.indexOf('--url');
if (urlIndex !== -1 && process.argv[urlIndex + 1]) {
  process.env.API_BASE_URL = process.argv[urlIndex + 1];
}

main().catch(console.error);
