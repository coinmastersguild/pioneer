const mongodb = require('mongodb');
const connection = require('../index');

// Mock MongoDB client
jest.mock('mongodb', () => {
  const mockCollection = {
    find: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    insertOne: jest.fn().mockResolvedValue({ insertedId: 'mock-id' }),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    findOneAndUpdate: jest.fn().mockResolvedValue({ value: {} }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 5 }),
    countDocuments: jest.fn().mockResolvedValue(10),
    distinct: jest.fn().mockResolvedValue(['value1', 'value2']),
    aggregate: jest.fn().mockReturnThis(),
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };

  const mockClient = {
    connect: jest.fn().mockResolvedValue(this),
    db: jest.fn().mockReturnValue(mockDb),
    close: jest.fn().mockResolvedValue(true),
    on: jest.fn(),
  };

  return {
    MongoClient: jest.fn().mockImplementation(() => mockClient),
  };
});

describe('MongoDB Atlas Connection Manager', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set environment variables for testing
    process.env.MONGO_CONNECTION = 'mongodb://localhost:27017/test';
  });
  
  afterEach(() => {
    // Clean up
    delete process.env.MONGO_CONNECTION;
    delete process.env.MONGO_DEFAULT_DB;
  });
  
  describe('get method', () => {
    it('should get a collection from the specified database', async () => {
      const collection = await connection.get('tickets', 'support');
      
      // Verify MongoClient was created with correct connection string
      expect(mongodb.MongoClient).toHaveBeenCalledWith(
        'mongodb://localhost:27017/test',
        expect.objectContaining({
          connectTimeoutMS: 10000,
          socketTimeoutMS: 45000,
        })
      );
      
      // Verify db was called with correct name
      const mockClientInstance = mongodb.MongoClient.mock.results[0].value;
      expect(mockClientInstance.db).toHaveBeenCalledWith('support');
      
      // Verify collection was requested
      const mockDbInstance = mockClientInstance.db.mock.results[0].value;
      expect(mockDbInstance.collection).toHaveBeenCalledWith('tickets');
      
      // Verify enhanced methods exist
      expect(collection.findOne).toBeDefined();
      expect(collection.find).toBeDefined();
      expect(collection.insert).toBeDefined();
      expect(collection.update).toBeDefined();
      expect(collection.findOneAndUpdate).toBeDefined();
      expect(collection.remove).toBeDefined();
      expect(collection.removeMany).toBeDefined();
      expect(collection.count).toBeDefined();
      expect(collection.distinct).toBeDefined();
    });
    
    it('should use default database when dbName is not specified', async () => {
      process.env.MONGO_DEFAULT_DB = 'default-db';
      
      await connection.get('users');
      
      // Verify db was called with default DB name
      const mockClientInstance = mongodb.MongoClient.mock.results[0].value;
      expect(mockClientInstance.db).toHaveBeenCalledWith('default-db');
    });
    
    it('should reuse existing client connection', async () => {
      // Get two collections
      await connection.get('tickets', 'support');
      await connection.get('users', 'admin');
      
      // MongoDB client should only be created once
      expect(mongodb.MongoClient).toHaveBeenCalledTimes(1);
      
      // But db should be called twice with different names
      const mockClientInstance = mongodb.MongoClient.mock.results[0].value;
      expect(mockClientInstance.db).toHaveBeenCalledTimes(2);
      expect(mockClientInstance.db).toHaveBeenNthCalledWith(1, 'support');
      expect(mockClientInstance.db).toHaveBeenNthCalledWith(2, 'admin');
    });
  });
  
  describe('getDb method', () => {
    it('should get a database instance', async () => {
      const db = await connection.getDb('custom-db');
      
      // Verify db was called with correct name
      const mockClientInstance = mongodb.MongoClient.mock.results[0].value;
      expect(mockClientInstance.db).toHaveBeenCalledWith('custom-db');
      expect(db).toBeDefined();
    });
  });
  
  describe('close method', () => {
    it('should close all connections', async () => {
      // Create a connection first
      await connection.get('tickets', 'support');
      
      // Close connections
      await connection.close();
      
      // Verify close was called
      const mockClientInstance = mongodb.MongoClient.mock.results[0].value;
      expect(mockClientInstance.close).toHaveBeenCalled();
    });
  });
}); 