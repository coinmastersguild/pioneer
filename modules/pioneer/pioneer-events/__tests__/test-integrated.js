/**
 * Integrated Socket-Redis Test
 * 
 * This test verifies Redis message propagation through WebSockets
 * using direct socket.io connection.
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const io = require('socket.io-client');
const { publisher, subscriber } = require("@pioneer-platform/default-redis");

// For testing purposes we'll generate unique values
const TEST_USERNAME = "tester_" + Math.floor(Math.random() * 10000);
const TEST_QUERY_KEY = "test_key_" + Date.now();
const TEST_ROOM = "test_room_" + Date.now();

// Redis channel we'll use
const REDIS_CHANNEL = "keepkey-support";
const PIONEER_EVENTS_CHANNEL = "pioneer-events";

// Keep track of received messages
const receivedMessages = [];
let testsPassed = 0;
let testsFailed = 0;

// WebSocket server URL (default to localhost if not specified)
const WSS_URL = process.env.TEST_WSS_URL || "ws://127.0.0.1:9001";

console.log("⚡ STARTING INTEGRATED SOCKET-REDIS TEST ⚡");
console.log("Username:", TEST_USERNAME);
console.log("Query Key:", TEST_QUERY_KEY);
console.log("Room:", TEST_ROOM);
console.log("WebSocket URL:", WSS_URL);

/**
 * Wait for specified milliseconds
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Register user data in Redis to support authentication
 */
async function setupTestUser() {
  try {
    console.log("Setting up test user in Redis...");
    
    // Store username <-> queryKey mapping in Redis
    await publisher.hset(TEST_QUERY_KEY, "username", TEST_USERNAME);
    await publisher.hset(TEST_USERNAME, "queryKey", TEST_QUERY_KEY);
    
    // Add user to test room
    await publisher.sadd(`room:${TEST_ROOM}:users`, TEST_USERNAME);
    
    console.log("✅ Test user setup complete");
    
    // Verify the data was stored correctly
    const usernameCheck = await publisher.hget(TEST_QUERY_KEY, "username");
    const queryKeyCheck = await publisher.hget(TEST_USERNAME, "queryKey");
    
    console.log("Verification - Username in Redis:", usernameCheck);
    console.log("Verification - QueryKey in Redis:", queryKeyCheck);
    
    if (usernameCheck !== TEST_USERNAME || queryKeyCheck !== TEST_QUERY_KEY) {
      console.warn("⚠️ Redis data verification failed!");
    }
  } catch (error) {
    console.error("❌ Failed to setup test user:", error);
    process.exit(1);
  }
}

/**
 * Test socket connection with authentication
 */
async function connectAndAuthenticate() {
  return new Promise((resolve, reject) => {
    console.log("\n🔄 Connecting to WebSocket and authenticating...");
    
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
      reject(new Error("Authentication timeout after 20 seconds"));
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
    
    // Listen for subscribedToUsername event
    socket.on('subscribedToUsername', (data) => {
      console.log("✅ Authentication successful! Received subscribedToUsername event:", data);
      clearTimeout(timeout);
      testsPassed++;
      resolve(socket);
    });
    
    // Listen for error messages
    socket.on('errorMessage', (error) => {
      console.error("❌ Error message from server:", error);
    });
  });
}

/**
 * Test Redis -> WebSocket message propagation
 */
async function testRedisToSocket(socket) {
  try {
    console.log("\n🔄 Testing Redis to WebSocket message propagation...");
    
    // Promise that resolves when we receive the test message
    const messagePromise = new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        reject(new Error("Message timeout after 15 seconds"));
      }, 15000);
      
      // Add listener for messages
      const messageHandler = (data) => {
        try {
          let message = data;
          if (typeof data === 'string') {
            message = JSON.parse(data);
          }
          
          console.log("Checking message for test content:", typeof message === 'object' ? JSON.stringify(message) : message);
          
          if (message.content && message.content.includes('REDIS_TEST_MESSAGE')) {
            console.log("✅ Received test message from Redis through socket");
            clearTimeout(timeout);
            socket.off('message', messageHandler);
            resolve(message);
          }
        } catch (err) {
          console.error("Error processing message:", err);
        }
      };
      
      socket.on('message', messageHandler);
    });
    
    // Create a test message
    const testMessage = {
      queryKey: TEST_QUERY_KEY,
      type: 'message',
      user: TEST_USERNAME,
      ticketId: TEST_ROOM,
      content: 'REDIS_TEST_MESSAGE_' + Date.now(),
      timestamp: Date.now()
    };
    
    console.log("📤 Publishing message to Redis:", JSON.stringify(testMessage));
    
    // Publish message to Redis
    await publisher.publish(REDIS_CHANNEL, JSON.stringify(testMessage));
    
    // Wait for the message to be received
    const receivedMessage = await messagePromise;
    console.log("✅ Redis to WebSocket message test passed");
    testsPassed++;
    
    return receivedMessage;
  } catch (error) {
    console.error("❌ Redis to WebSocket test failed:", error);
    testsFailed++;
    throw error;
  }
}

/**
 * Test WebSocket -> Redis -> WebSocket message propagation
 */
async function testSocketToRedisToSocket(socket) {
  try {
    console.log("\n🔄 Testing Socket -> Redis -> Socket message propagation...");
    
    // Promise that resolves when we receive the test message
    const messagePromise = new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        reject(new Error("Message timeout after 15 seconds"));
      }, 15000);
      
      // Add listener for messages
      const messageHandler = (data) => {
        try {
          let message = data;
          if (typeof data === 'string') {
            message = JSON.parse(data);
          }
          
          console.log("Checking message for socket test content:", typeof message === 'object' ? JSON.stringify(message) : message);
          
          if (message.content && message.content.includes('SOCKET_TEST_MESSAGE')) {
            console.log("✅ Received test message from Socket through Redis");
            clearTimeout(timeout);
            socket.off('message', messageHandler);
            resolve(message);
          }
        } catch (err) {
          console.error("Error processing message:", err);
        }
      };
      
      socket.on('message', messageHandler);
    });
    
    // Create test event
    const testEvent = {
      content: 'SOCKET_TEST_MESSAGE_' + Date.now(),
      room: TEST_ROOM,
      ticketId: TEST_ROOM
    };
    
    console.log("📤 Sending message through socket:", JSON.stringify(testEvent));
    
    // Send message through socket
    socket.emit('event', testEvent);
    
    // Wait for the message to be received
    const receivedMessage = await messagePromise;
    console.log("✅ Socket -> Redis -> Socket test passed");
    testsPassed++;
    
    return receivedMessage;
  } catch (error) {
    console.error("❌ Socket -> Redis -> Socket test failed:", error);
    testsFailed++;
    throw error;
  }
}

/**
 * Clean up test data
 */
async function cleanup() {
  try {
    console.log("\n🧹 Cleaning up test data...");
    
    // Remove test user data from Redis
    await publisher.del(TEST_QUERY_KEY);
    await publisher.del(TEST_USERNAME);
    await publisher.del(`room:${TEST_ROOM}:users`);
    
    console.log("✅ Cleanup complete");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
}

/**
 * Main test function
 */
async function runTests() {
  let socket;
  
  try {
    // Setup test user in Redis
    await setupTestUser();
    
    // Connect and authenticate
    socket = await connectAndAuthenticate();
    
    // Test Redis -> WebSocket message propagation
    await testRedisToSocket(socket);
    
    // Test WebSocket -> Redis -> WebSocket message propagation
    await testSocketToRedisToSocket(socket);
    
    console.log("\n✅ All tests completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
  } finally {
    // Disconnect socket if connected
    if (socket) {
      socket.disconnect();
      console.log("Socket disconnected");
    }
    
    // Print test summary
    console.log("\n📊 TEST SUMMARY:");
    console.log(`Total tests: ${testsPassed + testsFailed}`);
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    
    // Clean up
    await cleanup();
    
    // Exit with appropriate code
    process.exit(testsFailed > 0 ? 1 : 0);
  }
}

// Run the tests
runTests(); 