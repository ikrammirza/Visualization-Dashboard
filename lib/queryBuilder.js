// Builds a MongoDB filter object from the dashboard's query params.
// Every filter is optional and multi-select (comma-separated values).

const MULTI_VALUE_FIELDS = ["topic", "sector", "region", "pestle", "source", "country"];

export function buildFilterFromParams(searchParams) {
  const filter = {};

  for (const field of MULTI_VALUE_FIELDS) {
    const raw = searchParams.get(field);
    if (raw) {
      const values = raw.split(",").map((v) => v.trim()).filter(Boolean);
      if (values.length === 1) {
        filter[field] = values[0];
      } else if (values.length > 1) {
        filter[field] = { $in: values };
      }
    }
  }

  // end_year: exact match filter, as requested in the brief
  const endYear = searchParams.get("end_year");
  if (endYear) {
    filter.end_year = Number(endYear);
  }

  // Optional numeric range filters on intensity/likelihood/relevance,
  // used by the scatter/heatmap views but not required by the brief.
  for (const field of ["intensity", "likelihood", "relevance"]) {
    const min = searchParams.get(`${field}_min`);
    const max = searchParams.get(`${field}_max`);
    if (min || max) {
      filter[field] = {};
      if (min) filter[field].$gte = Number(min);
      if (max) filter[field].$lte = Number(max);
    }
  }

  return filter;
}
