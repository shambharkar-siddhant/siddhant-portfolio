// Enhanced test API endpoints script
import fetch from 'node-fetch';

// Test both localhost and Replit domain
const localApiUrl = 'http://localhost:5000';
// Get the Replit URL from environment variables
const replitSlug = process.env.REPL_SLUG || 'workspace';
const replitOwner = process.env.REPL_OWNER || 'shambharkarsidd';
const replitApiUrl = `https://${replitSlug}.${replitOwner}.repl.co`;

console.log('Available environment variables:');
console.log('REPL_SLUG:', process.env.REPL_SLUG);
console.log('REPL_OWNER:', process.env.REPL_OWNER);
console.log('REPL_ID:', process.env.REPL_ID);

console.log('\nTesting API endpoints on:');
console.log(`1. Local URL: ${localApiUrl}`);
console.log(`2. Replit URL: ${replitApiUrl}`);

// Helper function to test endpoint
async function testEndpoint(baseUrl, method, path, body = null) {
  console.log(`\nTesting ${method} ${path} on ${baseUrl}...`);
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseUrl}${path}`, options);
    const data = await response.json();
    console.log(`Response (${response.status}):`, JSON.stringify(data, null, 2));
    return { success: true, data, status: response.status };
  } catch (error) {
    console.error(`Error:`, error.message);
    return { success: false, error };
  }
}

// Run test on both URLs
async function runTests() {
  const endpoints = [
    { method: 'GET', path: '/api/profile' },
    { method: 'GET', path: '/api/projects?status=active' },
    { method: 'GET', path: '/api/skills?category=backend' },
    { 
      method: 'POST', 
      path: '/api/contact',
      body: {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message"
      }
    }
  ];
  
  console.log('\n=== TESTING LOCAL URL ===');
  
  for (const endpoint of endpoints) {
    await testEndpoint(
      localApiUrl, 
      endpoint.method, 
      endpoint.path, 
      endpoint.body
    );
  }
  
  console.log('\n=== TESTING REPLIT URL ===');
  
  for (const endpoint of endpoints) {
    await testEndpoint(
      replitApiUrl, 
      endpoint.method, 
      endpoint.path, 
      endpoint.body
    );
  }
}

// Run all tests
runTests().catch(err => {
  console.error('Test runner error:', err);
});