import mongoose from 'mongoose';
import { seedData } from '../utils/seed';
import fs from 'fs';
import path from 'path';

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
  var mongodServer: any;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://suneelsoni4u_db:MuniyA7264@tracker.dbbwb2b.mongodb.net/mamafarm?retryWrites=true&w=majority&appName=tracker';

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is disconnected or closing, reset cache
  if (cached.conn && cached.conn.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        console.log('Connecting to MongoDB Atlas SRV URL...');
        const instance = await mongoose.connect(MONGODB_URI, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`MongoDB Atlas Connected: ${instance.connection.host}`);
        await seedData();
        return instance;
      } catch (error: any) {
        console.warn(`MongoDB Atlas Connection Error: ${error.message}`);
        console.log('Falling back to local persistent embedded MongoDB...');

        try {
          const instance = await mongoose.connect('mongodb://127.0.0.1:27017/mamafarm', {
            serverSelectionTimeoutMS: 2000,
          });
          console.log(`Local MongoDB Connected: ${instance.connection.host}`);
          await seedData();
          return instance;
        } catch {
          const { MongoMemoryServer } = await import('mongodb-memory-server');

          const dbPath = path.join(process.cwd(), '.mongo-data');
          if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
          }

          if (!global.mongodServer) {
            global.mongodServer = await MongoMemoryServer.create({
              instance: {
                dbName: 'mamafarm',
                dbPath,
                storageEngine: 'wiredTiger',
              },
            });
          }

          const memoryUri = global.mongodServer.getUri();
          const instance = await mongoose.connect(memoryUri);
          console.log(`Embedded Persistent MongoDB Connected at: ${dbPath}`);
          await seedData();
          return instance;
        }
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
