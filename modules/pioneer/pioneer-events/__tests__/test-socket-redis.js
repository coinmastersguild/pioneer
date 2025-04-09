/**
 * Socket-Redis Integration Test
 * 
 * This test verifies that messages published to Redis are properly
 * received by WebSocket subscribers after authentication.
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const Events = require("../lib").Events;
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

console.log("⚡ STARTING SOCKET-REDIS INTEGRATION TEST ⚡");
console.log("Username:", TEST_USERNAME);
console.log("Query Key:", TEST_QUERY_KEY);
console.log("WebSocket URL:", WSS_URL);

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
 * Wait for specified milliseconds
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Monkeypatch the Events class to expose socket for testing
 */
function monkeyPatchEvents() {
  console.log("Adding event listeners to Events class for test...");
  
  // Original init function
  const originalInit = Events.prototype.init;
  
  // Override init to add direct socket event listeners
  Events.prototype.init = async function() {
    // Call original init
    const result = await originalInit.apply(this);
    
    // Add direct event listeners to socket
    if (this.socket) {
      this.socket.on('subscribedToUsername', (data) => {
        console.log("Socket received subscribedToUsername event:", data);
        this.events.emit('subscribedToUsername', data);
      });
    }
    
    return result;
  };
  
  return () => {
    // Return function to restore original behavior
    Events.prototype.init = originalInit;
  };
}

/**
 * Test WebSocket connection and authentication
 */
async function testSocketConnection() {
  try {
    console.log("\n🔄 Testing WebSocket connection and authentication...");
    
    // Create client configuration
    const config = {
      username: TEST_USERNAME,
      queryKey: TEST_QUERY_KEY,
      wss: WSS_URL
    };
    
    console.log("Creating Events instance with config:", JSON.stringify(config));
    
    // Monkeypatch Events class for testing
    const restoreEvents = monkeyPatchEvents();
    
    // Initialize client
    const client = new Events(config);
    
    // Setup event handlers before connecting
    const connectionPromise = new Promise((resolve, reject) => {
      // Set timeout for connection
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout after 30 seconds"));
      }, 30000);
      
      // Listen for subscribedToUsername event 
      client.events.on('subscribedToUsername', (data) => {
        console.log("✅ Authentication successful! Received subscribedToUsername event:", data);
        if (data.success && data.username === TEST_USERNAME) {
          clearTimeout(timeout);
          resolve(client);
        }
      });
      
      // Also listen for messages as fallback
      client.events.on('message', (message) => {
        console.log("📩 Received message:", typeof message === 'string' ? message : JSON.stringify(message));
        receivedMessages.push(message);
        
        // Check if this is our auth success message
        if (message.success && message.username === TEST_USERNAME) {
          console.log("✅ Authentication successful through message event");
          clearTimeout(timeout);
          resolve(client);
        }
      });
      
      // Listen for connection errors
      client.events.on('error', (error) => {
        console.error("❌ Socket error:", error);
        reject(error);
      });
    });
    
    // Initialize the connection
    console.log("Initializing WebSocket connection...");
    await client.init();
    console.log("✅ WebSocket connection initialized. Attempting authentication...");
    
    // Authenticate with username and query key
    await client.pair(TEST_USERNAME);
    console.log("Pair request sent for username:", TEST_USERNAME);
    
    // Wait for connection status - fallback for message event
    let connectionCheckAttempts = 0;
    const MAX_CONNECTION_CHECKS = 10;
    
    // Additional check for connection in case events aren't firing
    while (connectionCheckAttempts < MAX_CONNECTION_CHECKS) {
      await wait(3000); // Wait 3 seconds between checks
      connectionCheckAttempts++;
      
      // Check if we have any messages
      if (receivedMessages.length > 0) {
        console.log(`Received ${receivedMessages.length} messages so far`);
        break;
      }
      
      console.log(`Still waiting for messages... (Attempt ${connectionCheckAttempts}/${MAX_CONNECTION_CHECKS})`);
      
      // Send a test message periodically to try to get a response
      if (connectionCheckAttempts % 3 === 0) {
        try {
          // Try sending a join message directly to socket
          console.log("Sending join message directly...");
          client.socket.emit('join', {
            username: TEST_USERNAME,
            queryKey: TEST_QUERY_KEY
          });
        } catch (e) {
          console.log("Error sending direct message:", e.message);
        }
      }
    }
    
    // Wait for successful connection
    const connectedClient = await connectionPromise;
    console.log("✅ Socket connection and authentication successful");
    testsPassed++;
    
    // Restore original Events behavior
    restoreEvents();
    
    return connectedClient;
  } catch (error) {
    console.error("❌ Socket connection test failed:", error);
    testsFailed++;
    throw error;
  }
}

/**
 * Test Redis -> WebSocket message propagation
 */
async function testRedisToSocket(client) {
  try {
    console.log("\n🔄 Testing Redis to WebSocket message propagation...");
    
    // Promise that resolves when we receive the test message
    const messagePromise = new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        reject(new Error("Message timeout after 15 seconds"));
      }, 15000);
      
      // Clear previous messages
      receivedMessages.length = 0;
      
      // Add listener for messages
      const messageHandler = (message) => {
        try {
          if (typeof message === 'string') {
            message = JSON.parse(message);
          }
          
          console.log("Checking message for test content:", JSON.stringify(message));
          
          if (message.content && message.content.includes('REDIS_TEST_MESSAGE')) {
            console.log("✅ Received test message from Redis through socket");
            clearTimeout(timeout);
            client.events.removeListener('message', messageHandler);
            resolve(message);
          }
        } catch (err) {
          console.error("Error processing message:", err);
        }
      };
      
      client.events.on('message', messageHandler);
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
async function testSocketToRedisToSocket(client) {
  try {
    console.log("\n🔄 Testing Socket -> Redis -> Socket message propagation...");
    
    // Promise that resolves when we receive the test message
    const messagePromise = new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        reject(new Error("Message timeout after 15 seconds"));
      }, 15000);
      
      // Clear previous messages
      receivedMessages.length = 0;
      
      // Add listener for messages
      const messageHandler = (message) => {
        try {
          if (typeof message === 'string') {
            message = JSON.parse(message);
          }
          
          console.log("Checking message for socket test content:", JSON.stringify(message));
          
          if (message.content && message.content.includes('SOCKET_TEST_MESSAGE')) {
            console.log("✅ Received test message from Socket through Redis");
            clearTimeout(timeout);
            client.events.removeListener('message', messageHandler);
            resolve(message);
          }
        } catch (err) {
          console.error("Error processing message:", err);
        }
      };
      
      client.events.on('message', messageHandler);
    });
    
    // Create test event
    const testEvent = 'SOCKET_TEST_MESSAGE_' + Date.now();
    
    console.log("📤 Sending message through socket:", testEvent);
    
    // Send message through socket
    await client.send('event', testEvent);
    
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
 * Test room-specific messages
 */
async function testRoomMessages(client) {
  try {
    console.log("\n🔄 Testing room-specific messages...");
    
    // Promise that resolves when we receive the test message
    const messagePromise = new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        reject(new Error("Room message timeout after 15 seconds"));
      }, 15000);
      
      // Clear previous messages
      receivedMessages.length = 0;
      
      // Add listener for messages
      const messageHandler = (message) => {
        try {
          if (typeof message === 'string') {
            message = JSON.parse(message);
          }
          
          console.log("Checking message for room test content:", JSON.stringify(message));
          
          if (message.ticketId === TEST_ROOM && 
              message.content && 
              message.content.includes('ROOM_TEST_MESSAGE')) {
            console.log("✅ Received room test message");
            clearTimeout(timeout);
            client.events.removeListener('message', messageHandler);
            resolve(message);
          }
        } catch (err) {
          console.error("Error processing message:", err);
        }
      };
      
      client.events.on('message', messageHandler);
    });
    
    // Create a test message for the room
    const testMessage = {
      queryKey: TEST_QUERY_KEY,
      type: 'message',
      user: TEST_USERNAME,
      ticketId: TEST_ROOM,
      content: 'ROOM_TEST_MESSAGE_' + Date.now(),
      timestamp: Date.now()
    };
    
    console.log("📤 Publishing room message to Redis:", JSON.stringify(testMessage));
    
    // Publish message to Redis
    await publisher.publish(REDIS_CHANNEL, JSON.stringify(testMessage));
    
    // Wait for the message to be received
    const receivedMessage = await messagePromise;
    console.log("✅ Room message test passed");
    testsPassed++;
    
    return receivedMessage;
  } catch (error) {
    console.error("❌ Room message test failed:", error);
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
  try {
    await setupTestUser();
    
    // Connect to socket and authenticate
    const client = await testSocketConnection();
    
    // Test Redis -> WebSocket message propagation
    await testRedisToSocket(client);
    
    // Test WebSocket -> Redis -> WebSocket message propagation
    await testSocketToRedisToSocket(client);
    
    // Test room-specific messages
    await testRoomMessages(client);
    
    console.log("\n✅ All tests completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
  } finally {
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