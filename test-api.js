/**
 * Simple API test script for CU Hire Backend
 * Run this after starting the server to test basic functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  name: 'Test Recruiter',
  email: 'test@example.com',
  password: 'password123',
  role: 'recruiter',
  company: 'Test Company',
  phone: '+1234567890'
};

const testJob = {
  title: 'Software Engineer',
  description: 'We are looking for a talented software engineer to join our team.',
  location: 'San Francisco, CA',
  salary: 100000,
  jobType: 'Full-time',
  skills: ['JavaScript', 'Node.js', 'React'],
  experience: '3+ years'
};

let authToken = '';

async function testAPI() {
  console.log('🚀 Starting CU Hire API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: Register User
    console.log('2. Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ User Registration:', registerResponse.data.message);
      authToken = registerResponse.data.data.token;
      console.log('🔑 Auth Token received');
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('ℹ️  User already exists, proceeding with login...');
        
        // Test 3: Login
        console.log('3. Testing User Login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✅ User Login:', loginResponse.data.message);
        authToken = loginResponse.data.data.token;
        console.log('🔑 Auth Token received');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 4: Get User Profile
    console.log('4. Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User Profile:', profileResponse.data.data.user.name);
    console.log('');

    // Test 5: Create Job
    console.log('5. Testing Job Creation...');
    const createJobResponse = await axios.post(`${BASE_URL}/jobs`, testJob, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Job Created:', createJobResponse.data.data.job.title);
    const jobId = createJobResponse.data.data.job._id;
    console.log('');

    // Test 6: Get All Jobs
    console.log('6. Testing Get All Jobs...');
    const allJobsResponse = await axios.get(`${BASE_URL}/jobs`);
    console.log('✅ All Jobs Retrieved:', allJobsResponse.data.data.jobs.length, 'jobs found');
    console.log('');

    // Test 7: Get Single Job
    console.log('7. Testing Get Single Job...');
    const singleJobResponse = await axios.get(`${BASE_URL}/jobs/${jobId}`);
    console.log('✅ Single Job Retrieved:', singleJobResponse.data.data.job.title);
    console.log('');

    // Test 8: Get My Jobs
    console.log('8. Testing Get My Jobs...');
    const myJobsResponse = await axios.get(`${BASE_URL}/jobs/my-jobs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ My Jobs Retrieved:', myJobsResponse.data.data.jobs.length, 'jobs found');
    console.log('');

    // Test 9: Update Job
    console.log('9. Testing Job Update...');
    const updateJobResponse = await axios.put(`${BASE_URL}/jobs/${jobId}`, {
      title: 'Senior Software Engineer',
      salary: 120000
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Job Updated:', updateJobResponse.data.data.job.title);
    console.log('');

    // Test 10: Search Jobs
    console.log('10. Testing Job Search...');
    const searchResponse = await axios.get(`${BASE_URL}/jobs?search=engineer&jobType=Full-time`);
    console.log('✅ Job Search:', searchResponse.data.data.jobs.length, 'jobs found');
    console.log('');

    // Test 11: Delete Job
    console.log('11. Testing Job Deletion...');
    const deleteJobResponse = await axios.delete(`${BASE_URL}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Job Deleted:', deleteJobResponse.data.message);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('📊 API is working correctly and ready for production use.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
