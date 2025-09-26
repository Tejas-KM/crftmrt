import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise;
