import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { buildFilterFromParams } from "@/lib/queryBuilder";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = buildFilterFromParams(searchParams);

    const db = await getDb();
    const collection = db.collection("insights");

    const [result] = await collection
      .aggregate([
        { $match: filter },
        {
          $facet: {
            // Average intensity/likelihood/relevance per year, for the trend line.
            // Uses start_year since it's populated more often than end_year.
            byYear: [
              { $match: { start_year: { $ne: null } } },
              {
                $group: {
                  _id: "$start_year",
                  avgIntensity: { $avg: "$intensity" },
                  avgLikelihood: { $avg: "$likelihood" },
                  avgRelevance: { $avg: "$relevance" },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],

            // Top topics by number of records
            byTopic: [
              { $match: { topic: { $ne: null } } },
              { $group: { _id: "$topic", count: { $sum: 1 }, avgIntensity: { $avg: "$intensity" } } },
              { $sort: { count: -1 } },
              { $limit: 12 },
            ],

            // Records by region
            byRegion: [
              { $match: { region: { $ne: null } } },
              { $group: { _id: "$region", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],

            // Records by sector
            bySector: [
              { $match: { sector: { $ne: null } } },
              { $group: { _id: "$sector", count: { $sum: 1 }, avgIntensity: { $avg: "$intensity" } } },
              { $sort: { count: -1 } },
            ],

            // Records by PESTLE category
            byPestle: [
              { $match: { pestle: { $ne: null } } },
              { $group: { _id: "$pestle", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],

            // Top countries by record count, with avg metrics — bubble chart source
            byCountry: [
              { $match: { country: { $ne: null } } },
              {
                $group: {
                  _id: "$country",
                  count: { $sum: 1 },
                  avgIntensity: { $avg: "$intensity" },
                  avgLikelihood: { $avg: "$likelihood" },
                  avgRelevance: { $avg: "$relevance" },
                },
              },
              { $sort: { count: -1 } },
              { $limit: 20 },
            ],

            // Intensity histogram buckets, 0-10 scale seen in the data
            intensityDistribution: [
              { $match: { intensity: { $ne: null } } },
              {
                $bucket: {
                  groupBy: "$intensity",
                  boundaries: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  default: "other",
                  output: { count: { $sum: 1 } },
                },
              },
            ],

            // High-level KPI cards
            summary: [
              {
                $group: {
                  _id: null,
                  totalRecords: { $sum: 1 },
                  avgIntensity: { $avg: "$intensity" },
                  avgLikelihood: { $avg: "$likelihood" },
                  avgRelevance: { $avg: "$relevance" },
                },
              },
            ],
          },
        },
      ])
      .toArray();

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/stats failed:", err);
    return NextResponse.json(
      { error: "Failed to compute stats" },
      { status: 500 }
    );
  }
}
