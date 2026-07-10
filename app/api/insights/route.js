import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { buildFilterFromParams } from "@/lib/queryBuilder";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = buildFilterFromParams(searchParams);

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(200, Number(searchParams.get("limit") || 50));
    const skip = (page - 1) * limit;

    const db = await getDb();
    const collection = db.collection("insights");

    const [records, total] = await Promise.all([
      collection.find(filter).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/insights failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
