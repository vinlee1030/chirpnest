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

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper to get database
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

// Collection names
export const Collections = {
  USERS: 'users',
  FOLLOWS: 'follows',
  POSTS: 'posts',
  LIKES: 'likes',
  DRAFTS: 'drafts',
} as const;

