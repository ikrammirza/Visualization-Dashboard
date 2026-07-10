// Loads jsondata.json into MongoDB, cleaning types along the way.
// Run with: npm run seed
// Requires MONGODB_URI (and optionally MONGODB_DB) in .env.local

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "insight_dashboard";

if (!uri) {
  console.error("Missing MONGODB_URI. Add it to .env.local first.");
  process.exit(1);
}

// Converts "" -> null, and numeric-looking strings/numbers -> Number
function toNumberOrNull(val) {
  if (val === "" || val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

// Converts "" -> null, keeps other strings trimmed
function toStringOrNull(val) {
  if (val === "" || val === null || val === undefined) return null;
  return String(val).trim();
}

// Parses "January, 20 2017 03:51:25" style dates -> JS Date or null
function toDateOrNull(val) {
  if (!val) return null;
  const cleaned = String(val).replace(",", "");
  const d = new Date(cleaned);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  const raw = readFileSync(join(__dirname, "..", "data", "jsondata.json"), "utf-8");
  const records = JSON.parse(raw);

  const cleaned = records.map((r) => ({
    end_year: toNumberOrNull(r.end_year),
    start_year: toNumberOrNull(r.start_year),
    intensity: toNumberOrNull(r.intensity),
    likelihood: toNumberOrNull(r.likelihood),
    relevance: toNumberOrNull(r.relevance),
    sector: toStringOrNull(r.sector),
    topic: toStringOrNull(r.topic),
    region: toStringOrNull(r.region),
    country: toStringOrNull(r.country),
    pestle: toStringOrNull(r.pestle),
    source: toStringOrNull(r.source),
    title: toStringOrNull(r.title),
    insight: toStringOrNull(r.insight),
    url: toStringOrNull(r.url),
    impact: toStringOrNull(r.impact),
    added: toDateOrNull(r.added),
    published: toDateOrNull(r.published),
    // These two fields don't exist in the source data at all.
    // Kept explicitly null so the schema documents the gap rather than
    // hiding it, and so the UI can detect "no data" vs "not loaded".
    city: null,
    swot: null,
  }));

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("insights");

    const existing = await collection.countDocuments();
    if (existing > 0) {
      console.log(`Collection already has ${existing} docs. Dropping before reseed...`);
      await collection.drop();
    }

    const result = await collection.insertMany(cleaned);
    console.log(`Inserted ${result.insertedCount} documents into ${dbName}.insights`);

    // Indexes for the filter fields we'll query most often
    await collection.createIndex({ end_year: 1 });
    await collection.createIndex({ topic: 1 });
    await collection.createIndex({ sector: 1 });
    await collection.createIndex({ region: 1 });
    await collection.createIndex({ pestle: 1 });
    await collection.createIndex({ source: 1 });
    await collection.createIndex({ country: 1 });
    console.log("Indexes created.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
