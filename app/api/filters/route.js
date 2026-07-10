import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const DISTINCT_FIELDS = ["topic", "sector", "region", "pestle", "source", "country"];

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("insights");

    const distinctResults = await Promise.all(
      DISTINCT_FIELDS.map((field) =>
        collection.distinct(field, { [field]: { $ne: null } })
      )
    );

    const filters = {};
    DISTINCT_FIELDS.forEach((field, i) => {
      filters[field] = distinctResults[i].sort((a, b) => a.localeCompare(b));
    });

    const endYears = await collection.distinct("end_year", { end_year: { $ne: null } });
    filters.end_year = endYears.sort((a, b) => a - b);

    // These fields don't exist in the source dataset at all — reported
    // explicitly (empty array) so the UI can render them as disabled
    // rather than pretending they were never part of the spec.
    filters.city = [];
    filters.swot = [];

    return NextResponse.json({ filters });
  } catch (err) {
    console.error("GET /api/filters failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
