import mongoose from 'mongoose';
import { seedData } from '../utils/seed';

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const connStr = process.env.MONGODB_URI;

      if (connStr) {
        try {
          console.log('Connecting to remote MONGODB_URI...');
          const instance = await mongoose.connect(connStr, {
            serverSelectionTimeoutMS: 4000,
          });
          console.log(`MongoDB Connected: ${instance.connection.host}`);
          await seedData();
          return instance;
        } catch (error: any) {
          console.error(`MongoDB Remote Connection Error: ${error.message}`);
          console.log('Falling back to local / embedded MongoDB engine...');
        }
      }

      // Try local MongoDB port 27017
      try {
        const instance = await mongoose.connect('mongodb://127.0.0.1:27017/mamafarm', {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`Local MongoDB Connected: ${instance.connection.host}`);
        await seedData();
        return instance;
      } catch {
        console.log('Initializing Embedded In-Memory MongoDB Engine...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({
          instance: { dbName: 'mamafarm' },
        });
        const memoryUri = mongod.getUri();
        const instance = await mongoose.connect(memoryUri);
        console.log(`Embedded MongoDB Connected: ${instance.connection.host}`);
        await seedData();
        return instance;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
