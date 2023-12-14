const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'nodeJSDB';

async function connectToDatabase() {
    await client.connect();
    console.log('Connected successfully to the server');
    return client.db(dbName);
}

async function closeConnection() {
    await client.close();
    console.log("MongoDB client closed");
}

module.exports = { closeConnection ,connectToDatabase, client, dbName};