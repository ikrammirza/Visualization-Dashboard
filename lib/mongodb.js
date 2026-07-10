import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "insight_dashboard";

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI. Add it to a .env.local file at the project root."
  );
}

let client;
let clientPromise;

// In dev, Next.js hot-reloads modules, which would otherwise open a new
// MongoClient on every reload. Caching it on globalThis avoids that.
if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
