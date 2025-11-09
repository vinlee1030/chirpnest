/**
 * MongoDB Database Connection
 * 
 * TODO(Setup): Make sure you have:
 * 1. Created a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
 * 2. Created a cluster and database user
 * 3. Added IP whitelist: 0.0.0.0/0 (or specific IPs)
 * 4. Copied connection string to .env as MONGODB_URI
 */

import { MongoClient, Db } from 'mongodb';

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('Please add your MONGODB_URI to .env');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the client across hot reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, create a new client
    client = new MongoClient(uri, options);
    return client.connect();
  }
}

// Lazy getter - only initialize when accessed
function getClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = getMongoClient();
  }
  return clientPromise;
}

// Don't export default - it's not used anywhere
// If needed in the future, export as: export default getClientPromise;

// Helper to get database
export async function getDb(): Promise<Db> {
  try {
    const client = await getClientPromise();
    return client.db();
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.message?.includes('MONGODB_URI')) {
      throw new Error('MONGODB_URI environment variable is not set. Please add it to your Vercel environment variables.');
    }
    if (error.message?.includes('authentication failed')) {
      throw new Error('MongoDB authentication failed. Please check your username and password in MONGODB_URI.');
    }
    if (error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED')) {
      throw new Error('Cannot connect to MongoDB. Please check: 1) Your connection string is correct, 2) MongoDB Atlas Network Access allows all IPs (0.0.0.0/0), 3) Your cluster is running.');
    }
    throw error;
  }
}

// Collection names
export const Collections = {
  USERS: 'users',
  FOLLOWS: 'follows',
  POSTS: 'posts',
  LIKES: 'likes',
  DRAFTS: 'drafts',
} as const;

