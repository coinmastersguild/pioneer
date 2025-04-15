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
    // Fix MongoDB connection string format for newer Node.js versions
    let connectionString = process.env['MONGO_CONNECTION']
    
    // Check if the connection string is in the old format (contains @ but not mongodb://)
    if (connectionString.includes('@') && !connectionString.startsWith('mongodb://') && !connectionString.startsWith('mongodb+srv://')) {
        // Parse the old connection string format
        const [auth, hosts] = connectionString.split('@')
        const [username, password] = auth.split(':')
        
        // Reconstruct in the new format
        if (hosts && hosts.includes('/')) {
            const [hostList, dbAndParams] = hosts.split('/', 2)
            const [dbName, ...params] = dbAndParams ? dbAndParams.split('?') : ['pioneer']
            const paramsStr = params.length ? `?${params.join('?')}` : ''
            
            // Create proper MongoDB connection string
            connectionString = `mongodb://${username}:${password}@${hostList}/${dbName}${paramsStr}`
            console.log("Reformatted MongoDB connection string to new format")
        }
    }
    
    connection = monk(connectionString)
    
    // Add a method to the connection to get a collection from a specific database
    connection.getFromDb = function(collection, dbName) {
        // Check if the connection string already has a database
        let connectionString = process.env['MONGO_CONNECTION']
        
        // Fix MongoDB connection string format for this method as well
        if (connectionString.includes('@') && !connectionString.startsWith('mongodb://') && !connectionString.startsWith('mongodb+srv://')) {
            const [auth, hosts] = connectionString.split('@')
            const [username, password] = auth.split(':')
            
            if (hosts && hosts.includes('/')) {
                const [hostList] = hosts.split('/', 1)
                connectionString = `mongodb://${username}:${password}@${hostList}/${dbName || 'pioneer'}`
            }
        } else if (!connectionString.includes('/')) {
            connectionString = connectionString + '/pioneer'
        } else {
            // For properly formatted URLs, extract the host part
            if (connectionString.startsWith('mongodb://') || connectionString.startsWith('mongodb+srv://')) {
                // Extract the protocol and authority parts
                const parts = connectionString.split('/')
                // Reconstruct without database part
                connectionString = parts.slice(0, 3).join('/')
                connectionString += `/${dbName || 'pioneer'}`
            } else {
                // Extract the host part (without the database)
                let host = connectionString.split('/')[0]
                connectionString = `${host}/${dbName || 'pioneer'}`
            }
        }
        
        // Connect to the specified database
        const db = monk(connectionString)
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
