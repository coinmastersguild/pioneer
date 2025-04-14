/*
 * MongoDB Atlas Connection Manager
 * Modern, robust connection handling for MongoDB Atlas
 */

const { MongoClient } = require('mongodb');
const debug = require('debug')('mongo-atlas');

// Connection cache to avoid multiple connections to the same DB
const connectionCache = {
  clients: {},
  databases: {}
};

// Default options for MongoDB connections
const defaultOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 15000,
  maxPoolSize: 20,
  minPoolSize: 5
};

// Get or create a MongoClient for a connection string
async function getOrCreateClient(connectionString, options = {}) {
  // Use original connection string as the cache key
  if (!connectionCache.clients[connectionString]) {
    debug(`Creating new MongoClient for ${connectionString}`);
    const client = new MongoClient(connectionString, { ...defaultOptions, ...options });
    await client.connect();
    connectionCache.clients[connectionString] = client;
    
    // Set up automatic reconnection
    client.on('close', () => {
      debug(`Connection to ${connectionString} closed, will reconnect on next use`);
      delete connectionCache.clients[connectionString];
    });
  }
  
  return connectionCache.clients[connectionString];
}

// Main connection object
const connection = {
  /**
   * Get a collection from a specific database
   * @param {string} collection - Collection name
   * @param {string} dbName - Database name (defaults to env variable or 'pioneer')
   * @param {object} options - MongoDB connection options
   * @returns {object} - MongoDB collection with added helper methods
   */
  async get(collection, dbName, options = {}) {
    const connectionString = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/pioneer';
    const targetDb = dbName || process.env.MONGO_DEFAULT_DB || 'pioneer';
    
    debug(`Getting collection ${collection} from database ${targetDb}`);
    
    try {
      const client = await getOrCreateClient(connectionString, options);
      const db = client.db(targetDb);
      const mongoCollection = db.collection(collection);
      
      // Cache the database connection
      const cacheKey = `${connectionString}:${targetDb}`;
      connectionCache.databases[cacheKey] = db;
      
      // Enhance the collection with useful methods
      return enhanceCollection(mongoCollection);
    } catch (error) {
      debug(`Error getting collection ${collection}: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get a database instance
   * @param {string} dbName - Database name
   * @returns {object} - MongoDB database instance
   */
  async getDb(dbName) {
    const connectionString = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/pioneer';
    const targetDb = dbName || process.env.MONGO_DEFAULT_DB || 'pioneer';
    
    debug(`Getting database ${targetDb}`);
    
    try {
      const client = await getOrCreateClient(connectionString);
      return client.db(targetDb);
    } catch (error) {
      debug(`Error getting database ${targetDb}: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Close all connections
   */
  async close() {
    debug('Closing all connections');
    
    const clients = Object.values(connectionCache.clients);
    for (const client of clients) {
      await client.close();
    }
    
    connectionCache.clients = {};
    connectionCache.databases = {};
  }
};

// Add Monk-like methods to a MongoDB collection
function enhanceCollection(collection) {
  return {
    // Original collection
    collection,
    
    // Monk-like methods for backward compatibility
    find: (query = {}, options = {}) => collection.find(query, options).toArray(),
    findOne: (query = {}, options = {}) => collection.findOne(query, options),
    insert: (doc, options = {}) => collection.insertOne(doc, options),
    update: (query, update, options = {}) => collection.updateOne(query, update, options),
    findOneAndUpdate: (query, update, options = {}) => collection.findOneAndUpdate(query, update, { returnDocument: 'after', ...options }),
    remove: (query, options = {}) => collection.deleteOne(query, options),
    removeMany: (query, options = {}) => collection.deleteMany(query, options),
    count: (query = {}) => collection.countDocuments(query),
    distinct: (field, query = {}) => collection.distinct(field, query)
  };
}

// Handle process termination
process.on('SIGINT', async () => {
  debug('Received SIGINT, closing connections');
  await connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  debug('Received SIGTERM, closing connections');
  await connection.close();
  process.exit(0);
});

module.exports = connection; 