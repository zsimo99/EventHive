import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Interface to define the shape of our cached connection
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the global object to include our mongoose cache
// This prevents TypeScript errors when accessing global.mongoose
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Initialize the cached connection variable from the global object
// If it doesn't exist yet, initialize it with null values
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export const connectDB = async (): Promise<Mongoose> => {
  // 1. If a connection already exists, return it immediately
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  // 2. If no connection promise exists, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('New database connection established');
      return mongoose;
    }).catch((error) => {
      console.error('Database connection failed:', error.message);
      cached.promise = null;
      throw error;
    });
  }

  // 3. Await the promise to get the established connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to connect to database:', e);
    throw e;
  }

  return cached.conn;
};