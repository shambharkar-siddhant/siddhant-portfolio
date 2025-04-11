// Node.js test script for the portfolio API endpoints
import fetch from 'node-fetch';

// Base URL for the server
const BASE_URL = 'http://localhost:5000';

const testEndpoints = async () => {
  console.log("Testing API endpoints on", BASE_URL);
  
  // Test the GET /api/profile endpoint
  try {
    console.log("\nTesting GET /api/profile...");
    const profileResponse = await fetch(`${BASE_URL}/api/profile`);
    const profileData = await profileResponse.json();
    console.log("Status:", profileResponse.status);
    console.log("Response:", JSON.stringify(profileData, null, 2));
  } catch (error) {
    console.error("Error testing profile endpoint:", error);
  }
  
  // Test the GET /api/projects endpoint
  try {
    console.log("\nTesting GET /api/projects...");
    const projectsResponse = await fetch(`${BASE_URL}/api/projects?status=active`);
    const projectsData = await projectsResponse.json();
    console.log("Status:", projectsResponse.status);
    console.log("Response:", JSON.stringify(projectsData, null, 2));
  } catch (error) {
    console.error("Error testing projects endpoint:", error);
  }
  
  // Test the GET /api/skills endpoint
  try {
    console.log("\nTesting GET /api/skills...");
    const skillsResponse = await fetch(`${BASE_URL}/api/skills?category=backend`);
    const skillsData = await skillsResponse.json();
    console.log("Status:", skillsResponse.status);
    console.log("Response:", JSON.stringify(skillsData, null, 2));
  } catch (error) {
    console.error("Error testing skills endpoint:", error);
  }
  
  // Test the POST /api/contact endpoint
  try {
    console.log("\nTesting POST /api/contact...");
    const contactResponse = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message"
      })
    });
    const contactData = await contactResponse.json();
    console.log("Status:", contactResponse.status);
    console.log("Response:", JSON.stringify(contactData, null, 2));
  } catch (error) {
    console.error("Error testing contact endpoint:", error);
  }
};

// Run the tests
testEndpoints();