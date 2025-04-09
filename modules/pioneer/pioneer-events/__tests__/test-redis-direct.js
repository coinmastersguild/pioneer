/**
 * Redis Direct Test
 * 
 * This test verifies direct Redis publish/subscribe functionality
 * without involving WebSockets.
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

// Import Redis module
const { publisher, subscriber } = require("@pioneer-platform/default-redis");

// Test channels
const TEST_CHANNEL = "test-channel-" + Date.now();
const KEEPKEY_SUPPORT_CHANNEL = "keepkey-support";
const PIONEER_EVENTS_CHANNEL = "pioneer-events";

// Track test results
let testsPassed = 0;
let testsFailed = 0;

console.log("⚡ STARTING DIRECT REDIS TEST ⚡");
console.log("Test channel:", TEST_CHANNEL);

/**
 * Test basic Redis connectivity
 */
async function testRedisConnectivity() {
  try {
    console.log("\n🔄 Testing Redis connectivity...");
    
    // Test publisher connection
    const pingResult = await publisher.ping();
    console.log("Redis ping result:", pingResult);
    
    if (pingResult === "PONG") {
      console.log("✅ Redis publisher connection is working");
      testsPassed++;
      return true;
    } else {
      throw new Error("Redis ping did not return PONG");
    }
  } catch (error) {
    console.error("❌ Redis connectivity test failed:", error);
    testsFailed++;
    return false;
  }
}

/**
 * Test basic publish/subscribe on test channel
 */
async function testBasicPubSub() {
  try {
    console.log("\n🔄 Testing basic publish/subscribe on test channel...");
    
    const messagePromise = new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        subscriber.unsubscribe(TEST_CHANNEL);
        reject(new Error("Message timeout after 5 seconds"));
      }, 5000);
      
      // Subscribe to test channel
      subscriber.subscribe(TEST_CHANNEL, (err) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
        } else {
          console.log("Successfully subscribed to", TEST_CHANNEL);
        }
      });
      
      // Set up message handler
      subscriber.on("message", (channel, message) => {
        if (channel === TEST_CHANNEL) {
          console.log("Received message on", channel, ":", message);
          if (message.includes("TEST_MESSAGE")) {
            clearTimeout(timeout);
            resolve(message);
          }
        }
      });
    });
    
    // Give a moment for subscription to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Publish test message
    const testMessage = "TEST_MESSAGE_" + Date.now();
    console.log("Publishing message to", TEST_CHANNEL, ":", testMessage);
    await publisher.publish(TEST_CHANNEL, testMessage);
    
    // Wait for message to be received
    const receivedMessage = await messagePromise;
    console.log("✅ Basic publish/subscribe test passed");
    testsPassed++;
    
    // Unsubscribe from test channel
    subscriber.unsubscribe(TEST_CHANNEL);
    
    return receivedMessage;
  } catch (error) {
    console.error("❌ Basic publish/subscribe test failed:", error);
    testsFailed++;
    
    // Ensure we unsubscribe
    subscriber.unsubscribe(TEST_CHANNEL);
    
    throw error;
  }
}

/**
 * Test keepkey-support channel
 */
async function testKeepKeyChannel() {
  try {
    console.log("\n🔄 Testing keepkey-support channel...");
    
    const messagePromise = new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        subscriber.unsubscribe(KEEPKEY_SUPPORT_CHANNEL);
        reject(new Error("Message timeout after 5 seconds"));
      }, 5000);
      
      // Subscribe to channel
      subscriber.subscribe(KEEPKEY_SUPPORT_CHANNEL, (err) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
        } else {
          console.log("Successfully subscribed to", KEEPKEY_SUPPORT_CHANNEL);
        }
      });
      
      // Set up message handler
      const messageHandler = (channel, message) => {
        if (channel === KEEPKEY_SUPPORT_CHANNEL) {
          console.log("Received message on", channel, ":", message);
          try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.content && parsedMessage.content.includes("SUPPORT_TEST")) {
              clearTimeout(timeout);
              subscriber.removeListener("message", messageHandler);
              resolve(parsedMessage);
            }
          } catch (err) {
            console.log("Received non-JSON message:", message);
          }
        }
      };
      
      subscriber.on("message", messageHandler);
    });
    
    // Give a moment for subscription to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Publish test message
    const testMessage = {
      type: 'message',
      user: 'test-user',
      ticketId: 'test-ticket',
      content: 'SUPPORT_TEST_' + Date.now(),
      timestamp: Date.now()
    };
    
    console.log("Publishing message to", KEEPKEY_SUPPORT_CHANNEL, ":", JSON.stringify(testMessage));
    await publisher.publish(KEEPKEY_SUPPORT_CHANNEL, JSON.stringify(testMessage));
    
    // Wait for message to be received
    const receivedMessage = await messagePromise;
    console.log("✅ KeepKey support channel test passed");
    testsPassed++;
    
    // Unsubscribe from channel
    subscriber.unsubscribe(KEEPKEY_SUPPORT_CHANNEL);
    
    return receivedMessage;
  } catch (error) {
    console.error("❌ KeepKey support channel test failed:", error);
    testsFailed++;
    
    // Ensure we unsubscribe
    subscriber.unsubscribe(KEEPKEY_SUPPORT_CHANNEL);
    
    throw error;
  }
}

/**
 * Test pioneer-events channel
 */
async function testPioneerChannel() {
  try {
    console.log("\n🔄 Testing pioneer-events channel...");
    
    const messagePromise = new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        subscriber.unsubscribe(PIONEER_EVENTS_CHANNEL);
        reject(new Error("Message timeout after 5 seconds"));
      }, 5000);
      
      // Subscribe to channel
      subscriber.subscribe(PIONEER_EVENTS_CHANNEL, (err) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
        } else {
          console.log("Successfully subscribed to", PIONEER_EVENTS_CHANNEL);
        }
      });
      
      // Set up message handler
      const messageHandler = (channel, message) => {
        if (channel === PIONEER_EVENTS_CHANNEL) {
          console.log("Received message on", channel, ":", message);
          try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.event && parsedMessage.event.includes("PIONEER_TEST")) {
              clearTimeout(timeout);
              subscriber.removeListener("message", messageHandler);
              resolve(parsedMessage);
            }
          } catch (err) {
            console.log("Received non-JSON message:", message);
          }
        }
      };
      
      subscriber.on("message", messageHandler);
    });
    
    // Give a moment for subscription to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Publish test message
    const testMessage = {
      event: 'PIONEER_TEST_' + Date.now(),
      username: 'test-user',
      timestamp: Date.now()
    };
    
    console.log("Publishing message to", PIONEER_EVENTS_CHANNEL, ":", JSON.stringify(testMessage));
    await publisher.publish(PIONEER_EVENTS_CHANNEL, JSON.stringify(testMessage));
    
    // Wait for message to be received
    const receivedMessage = await messagePromise;
    console.log("✅ Pioneer events channel test passed");
    testsPassed++;
    
    // Unsubscribe from channel
    subscriber.unsubscribe(PIONEER_EVENTS_CHANNEL);
    
    return receivedMessage;
  } catch (error) {
    console.error("❌ Pioneer events channel test failed:", error);
    testsFailed++;
    
    // Ensure we unsubscribe
    subscriber.unsubscribe(PIONEER_EVENTS_CHANNEL);
    
    throw error;
  }
}

/**
 * Test Redis key-value operations
 */
async function testKeyValueOps() {
  try {
    console.log("\n🔄 Testing Redis key-value operations...");
    
    const testKey = "test-key-" + Date.now();
    const testValue = "test-value-" + Date.now();
    
    // Set a key
    await publisher.set(testKey, testValue);
    console.log("Set key", testKey, "to value", testValue);
    
    // Get the key
    const retrievedValue = await publisher.get(testKey);
    console.log("Retrieved value for key", testKey, ":", retrievedValue);
    
    if (retrievedValue === testValue) {
      console.log("✅ Key-value test passed");
      testsPassed++;
      
      // Clean up
      await publisher.del(testKey);
      return true;
    } else {
      throw new Error(`Value mismatch: expected ${testValue}, got ${retrievedValue}`);
    }
  } catch (error) {
    console.error("❌ Key-value test failed:", error);
    testsFailed++;
    throw error;
  }
}

/**
 * Test Redis hash operations
 */
async function testHashOps() {
  try {
    console.log("\n🔄 Testing Redis hash operations...");
    
    const testHash = "test-hash-" + Date.now();
    const testField = "test-field";
    const testValue = "test-value-" + Date.now();
    
    // Set a hash field
    await publisher.hset(testHash, testField, testValue);
    console.log("Set hash", testHash, "field", testField, "to value", testValue);
    
    // Get the hash field
    const retrievedValue = await publisher.hget(testHash, testField);
    console.log("Retrieved hash value for key", testHash, "field", testField, ":", retrievedValue);
    
    if (retrievedValue === testValue) {
      console.log("✅ Hash operations test passed");
      testsPassed++;
      
      // Clean up
      await publisher.del(testHash);
      return true;
    } else {
      throw new Error(`Value mismatch: expected ${testValue}, got ${retrievedValue}`);
    }
  } catch (error) {
    console.error("❌ Hash operations test failed:", error);
    testsFailed++;
    throw error;
  }
}

/**
 * Main test function
 */
async function runTests() {
  try {
    // Test Redis connectivity
    const connected = await testRedisConnectivity();
    if (!connected) {
      throw new Error("Cannot proceed with tests - Redis connection failed");
    }
    
    // Test basic pub/sub
    await testBasicPubSub();
    
    // Test key-value operations
    await testKeyValueOps();
    
    // Test hash operations
    await testHashOps();
    
    // Test KeepKey support channel
    await testKeepKeyChannel();
    
    // Test Pioneer events channel
    await testPioneerChannel();
    
    console.log("\n✅ All tests completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
  } finally {
    // Print test summary
    console.log("\n📊 TEST SUMMARY:");
    console.log(`Total tests: ${testsPassed + testsFailed}`);
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    
    // Exit with appropriate code
    process.exit(testsFailed > 0 ? 1 : 0);
  }
}

// Run the tests
runTests(); 