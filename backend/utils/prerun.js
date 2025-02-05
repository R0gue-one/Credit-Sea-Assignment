const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('CreditSea'); // Replace with your DB name
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = { connectMongoDB };