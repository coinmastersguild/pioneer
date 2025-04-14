# MongoDB Atlas Connection Manager

A modern, robust connection manager for MongoDB Atlas specifically designed for the Pioneer platform.

## Features

- Proper connection pooling and reuse
- Support for MongoDB Atlas connection strings
- Automatic reconnection
- Connection caching
- Monk-like API for backward compatibility
- MongoDB native driver for optimal performance

## Usage

```javascript
const mongo = require('@pioneer-platform/mongo-atlas');

// Get a collection from a specific database
async function getTickets() {
  const ticketsCollection = await mongo.get('tickets', 'support');
  return ticketsCollection.find({ status: 'open' });
}

// Use the MongoDB native collection
async function advancedQuery() {
  const collection = await mongo.get('users', 'admin');
  return collection.collection.aggregate([
    { $match: { active: true } },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]).toArray();
}
```

## Environment Variables

- `MONGO_CONNECTION`: MongoDB connection string (required)
- `MONGO_DEFAULT_DB`: Default database name (optional, defaults to 'pioneer')

## Installation

```bash
npm install @pioneer-platform/mongo-atlas
```

## Migrating from @pioneer-platform/default-mongo

### Before:
```javascript
const connection = require('@pioneer-platform/default-mongo');
const ticketsDb = connection.get('tickets');

// Using ticketsDb
const tickets = await ticketsDb.find({ status: 'open' });
```

### After:
```javascript
const mongo = require('@pioneer-platform/mongo-atlas');

// Make sure to await the get method as it's now async
const ticketsDb = await mongo.get('tickets', 'support');

// The same methods are available
const tickets = await ticketsDb.find({ status: 'open' });
```

## License

MIT 