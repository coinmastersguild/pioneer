/**
 * Basic Socket.io Authentication Test
 * 
 * This test focuses only on the WebSocket authentication process
 * with a direct socket.io approach.
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const io = require('socket.io-client');
const { publisher } = require("@pioneer-platform/default-redis");

// Test configuration
const TEST_USERNAME = "tester_" + Math.floor(Math.random() * 10000);
const TEST_QUERY_KEY = "test_key_" + Date.now();
const WSS_URL = process.env.TEST_WSS_URL || "ws://127.0.0.1:9001";

console.log("⚡ STARTING BASIC SOCKET.IO AUTHENTICATION TEST ⚡");
console.log("Username:", TEST_USERNAME);
console.log("Query Key:", TEST_QUERY_KEY);
console.log("WebSocket URL:", WSS_URL);

/**
 * Wait for specified milliseconds
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Set up Redis records for authentication
 */
async function setupRedis() {
  try {
    console.log("Setting up test data in Redis...");
    
    // Store username <-> queryKey mapping
    await publisher.hset(TEST_QUERY_KEY, "username", TEST_USERNAME);
    await publisher.hset(TEST_USERNAME, "queryKey", TEST_QUERY_KEY);
    
    // Verify the data
    const usernameCheck = await publisher.hget(TEST_QUERY_KEY, "username");
    const queryKeyCheck = await publisher.hget(TEST_USERNAME, "queryKey");
    
    console.log("Verification - Username in Redis:", usernameCheck);
    console.log("Verification - QueryKey in Redis:", queryKeyCheck);
    
    console.log("✅ Redis setup complete");
  } catch (error) {
    console.error("❌ Failed to setup Redis:", error);
    process.exit(1);
  }
}

/**
 * Clean up Redis records
 */
async function cleanupRedis() {
  try {
    console.log("\n🧹 Cleaning up Redis data...");
    await publisher.del(TEST_QUERY_KEY);
    await publisher.del(TEST_USERNAME);
    console.log("✅ Redis cleanup complete");
  } catch (error) {
    console.error("❌ Failed to cleanup Redis:", error);
  }
}

/**
 * Test socket connection with authentication
 */
async function testSocketAuth() {
  return new Promise((resolve, reject) => {
    console.log("Connecting to WebSocket server...");
    
    // Socket.io options
    const options = {
      reconnection: true,
      rejectUnauthorized: false,
      transports: ['websocket'],
      timeout: 10000
    };
    
    // Create socket
    const socket = io(WSS_URL, options);
    
    // Set timeout
    const timeout = setTimeout(() => {
      socket.disconnect();
      reject(new Error("Connection timeout after 20 seconds"));
    }, 20000);
    
    // Connection event
    socket.on('connect', () => {
      console.log("✅ Socket connected! Socket ID:", socket.id);
      
      // Send join message for authentication
      console.log("Sending join event with auth data...");
      socket.emit('join', {
        username: TEST_USERNAME,
        queryKey: TEST_QUERY_KEY
      });
    });
    
    // Connection error
    socket.on('connect_error', (error) => {
      console.error("❌ Connection error:", error.message);
    });
    
    // Generic error
    socket.on('error', (error) => {
      console.error("❌ Socket error:", error);
    });
    
    // Listen for subscribedToUsername event
    socket.on('subscribedToUsername', (data) => {
      console.log("✅ Authentication successful! Received subscribedToUsername event:", data);
      clearTimeout(timeout);
      socket.disconnect();
      resolve(true);
    });
    
    // Listen for error messages
    socket.on('errorMessage', (error) => {
      console.error("❌ Error message from server:", error);
    });
    
    // Listen for general messages (might contain auth response)
    socket.on('message', (data) => {
      console.log("📩 Received message:", typeof data === 'string' ? data : JSON.stringify(data));
      
      // Try to parse if it's a string
      let message = data;
      if (typeof data === 'string') {
        try {
          message = JSON.parse(data);
        } catch (e) {
          // Not JSON, continue with string
        }
      }
      
      // Check if this looks like an auth success message
      if (message && message.success && message.username === TEST_USERNAME) {
        console.log("✅ Authentication successful based on message content!");
        clearTimeout(timeout);
        socket.disconnect();
        resolve(true);
      }
    });
    
    // Disconnect event
    socket.on('disconnect', (reason) => {
      console.log("❌ Socket disconnected:", reason);
      if (reason === 'io server disconnect') {
        // The server has forcefully disconnected the socket
        console.error("❌ Server forcefully disconnected the socket");
      }
    });
  });
}

/**
 * Main test function
 */
async function runTest() {
  try {
    // Setup
    await setupRedis();
    
    // Test auth
    await testSocketAuth();
    
    console.log("\n✅ Socket authentication test PASSED!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  } finally {
    // Clean up
    await cleanupRedis();
  }
}

// Run the test
runTest(); 