/*
    Mongo
 */

let TAG = ' | monk | '
const monk = require('monk')

let connection

if(!process.env['MONGO_CONNECTION']) {
    console.log("Looking for mongo on: 127.0.0.1:27017/pioneer")
    process.env.MONGO_CONNECTION = "127.0.0.1:27017/pioneer"
}

try{
    connection = monk(process.env['MONGO_CONNECTION'])
    
    // Add a method to the connection to get a collection from a specific database
    connection.getFromDb = function(collection, dbName) {
        // Check if the connection string already has a database
        let connectionString = process.env['MONGO_CONNECTION']
        if (!connectionString.includes('/')) {
            connectionString = connectionString + '/pioneer'
        }
        
        // Extract the host part (without the database)
        let host = connectionString.split('/')[0]
        
        // Connect to the specified database
        const db = monk(`${host}/${dbName || 'pioneer'}`)
        return db.get(collection)
    }
    
    // Override the get method to use support database for specific collections
    const originalGet = connection.get.bind(connection)
    connection.get = function(collection, dbOverride) {
        // If a specific database is requested, use it
        if (dbOverride) {
            return connection.getFromDb(collection, dbOverride)
        }
        
        // Auto-detect which database to use based on collection name
        if (collection === 'tickets' || 
            collection === 'chats' || 
            collection === 'messages' || 
            collection === 'support_logs') {
            return connection.getFromDb(collection, 'support')
        }
        
        // Default to the original behavior
        return originalGet(collection)
    }
}catch(e){
    console.error("error: ",e)
}

module.exports = exports = connection
