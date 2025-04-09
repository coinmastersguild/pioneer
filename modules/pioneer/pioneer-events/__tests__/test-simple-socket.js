/**
 * Simple Socket Connection Test
 * 
 * This test verifies basic WebSocket connectivity without Redis
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const Events = require("../lib").Events;
const io = require('socket.io-client');

// WebSocket server URL 
const WSS_URL = process.env.TEST_WSS_URL || "ws://127.0.0.1:9001";

console.log("⚡ STARTING SIMPLE SOCKET TEST ⚡");
console.log("WebSocket URL:", WSS_URL);

/**
 * Test direct socket.io connection
 */
async function testDirectSocket() {
  return new Promise((resolve, reject) => {
    console.log("Attempting direct socket.io connection to:", WSS_URL);
    
    // Set connection timeout
    const timeout = setTimeout(() => {
      reject(new Error("Direct socket.io connection timeout after 10 seconds"));
    }, 10000);
    
    try {
      // Connect using socket.io-client directly
      const socket = io(WSS_URL, {
        reconnect: true,
        rejectUnauthorized: false,
        transports: ['websocket'],
      });
      
      socket.on('connect', () => {
        console.log("✅ Direct socket.io connection successful!");
        clearTimeout(timeout);
        
        // Disconnect after success
        socket.disconnect();
        resolve(true);
      });
      
      socket.on('connect_error', (error) => {
        console.error("❌ Socket connection error:", error.message);
      });
      
      socket.on('error', (error) => {
        console.error("❌ Socket error:", error);
      });
    } catch (error) {
      clearTimeout(timeout);
      console.error("❌ Exception during socket connection:", error);
      reject(error);
    }
  });
}

/**
 * Test connection using Events class
 */
async function testEventsClass() {
  return new Promise((resolve, reject) => {
    console.log("Attempting connection using Events class to:", WSS_URL);
    
    // Set connection timeout
    const timeout = setTimeout(() => {
      reject(new Error("Events class connection timeout after 10 seconds"));
    }, 10000);
    
    try {
      // Create client configuration
      const config = {
        username: "test_user",
        queryKey: "test_key",
        wss: WSS_URL
      };
      
      // Initialize client
      const client = new Events(config);
      
      // Setup connection handler
      client.events.on('message', (message) => {
        console.log("Received message:", typeof message === 'string' ? message : JSON.stringify(message));
      });
      
      // Initialize the connection
      client.init().then(() => {
        console.log("✅ Events class connection successful!");
        clearTimeout(timeout);
        resolve(true);
      }).catch((error) => {
        clearTimeout(timeout);
        console.error("❌ Events class init error:", error);
        reject(error);
      });
    } catch (error) {
      clearTimeout(timeout);
      console.error("❌ Exception during Events class setup:", error);
      reject(error);
    }
  });
}

/**
 * Main function
 */
async function runTests() {
  try {
    console.log("\n🔄 Testing direct socket.io connection...");
    await testDirectSocket();
    
    console.log("\n🔄 Testing Events class connection...");
    await testEventsClass();
    
    console.log("\n✅ All socket connection tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
    process.exit(1);
  }
}

// Run the tests
runTests(); 