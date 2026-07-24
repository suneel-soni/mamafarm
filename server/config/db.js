const mongoose = require('mongoose');

const connectDB = async () => {
  const connStr = process.env.MONGODB_URI;
  if (connStr) {
    try {
      console.log('Connecting to provided MONGODB_URI...');
      const conn = await mongoose.connect(connStr, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(`MongoDB Atlas Connection Error: ${error.message}`);
      console.log('Falling back to local / embedded MongoDB engine...');
    }
  }

  // Try local MongoDB default port
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/mamafarm', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`Local MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch {
    // Fallback to MongoMemoryServer for instant zero-config database
    console.log('Local MongoDB port 27017 unreachable. Initializing Embedded In-Memory MongoDB Engine...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: { dbName: 'mamafarm' },
    });
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`Embedded MongoDB Server Connected successfully: ${conn.connection.host}`);
    return true;
  }
};

module.exports = connectDB;
