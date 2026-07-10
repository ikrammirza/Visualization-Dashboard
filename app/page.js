"use client";

import { useEffect, useMemo, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import KpiCards from "@/components/KpiCards";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import TrendChart from "@/components/charts/TrendChart";
import TopicBarChart from "@/components/charts/TopicBarChart";
import DonutChart from "@/components/charts/DonutChart";
import CountryBubbleChart from "@/components/charts/CountryBubbleChart";
import IntensityHistogram from "@/components/charts/IntensityHistogram";

const EMPTY_VALUES = {
  end_year: "",
  topic: [],
  sector: [],
  region: [],
  pestle: [],
  source: [],
  country: [],
};

export default function DashboardPage() {
  const [filterOptions, setFilterOptions] = useState(null);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load filter dropdown options once
  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then((json) => setFilterOptions(json.filters))
      .catch((err) => console.error("Failed to load filters:", err));
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (values.end_year) params.set("end_year", values.end_year);
    for (const field of ["topic", "sector", "region", "pestle", "source", "country"]) {
      if (values[field].length > 0) params.set(field, values[field].join(","));
    }
    return params.toString();
  }, [values]);

  // Refetch stats whenever filters change
  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats?${queryString}`)
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error("Failed to load stats:", err))
      .finally(() => setLoading(false));
  }, [queryString]);

  // Refetch table records whenever filters or page change
  useEffect(() => {
    const params = new URLSearchParams(queryString);
    params.set("page", page);
    params.set("limit", 10);
    fetch(`/api/insights?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setRecords(json.data || []);
        setPagination(json.pagination);
      })
      .catch((err) => console.error("Failed to load records:", err));
  }, [queryString, page]);

  function handleFilterChange(field, value) {
    setPage(1);
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset() {
    setPage(1);
    setValues(EMPTY_VALUES);
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <FilterSidebar
        filters={filterOptions}
        values={values}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      <main className="flex-1 px-8 py-7 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Overview</h2>
          <p className="text-sm text-muted mt-1">
            Intensity, likelihood, and relevance across sectors, regions, and topics.
          </p>
        </div>

        <KpiCards summary={stats?.summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ChartCard
            title="Intensity, Likelihood & Relevance over Time"
            subtitle="Averaged by record start year"
            className="lg:col-span-2 h-80"
          >
            <TrendChart data={stats?.byYear || []} />
          </ChartCard>

          <ChartCard title="Intensity Distribution" subtitle="Count of records by intensity score" className="h-80">
            <IntensityHistogram data={stats?.intensityDistribution || []} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ChartCard title="Top Topics" subtitle="By number of records" className="h-80">
            <TopicBarChart data={stats?.byTopic || []} />
          </ChartCard>

          <ChartCard title="By Region" subtitle="Share of records" className="h-80">
            <DonutChart data={stats?.byRegion || []} />
          </ChartCard>

          <ChartCard title="By PEST(LE) Category" subtitle="Share of records" className="h-80">
            <DonutChart data={stats?.byPestle || []} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ChartCard
            title="Country Landscape"
            subtitle="Likelihood vs relevance — bubble size = records, color = intensity"
            className="lg:col-span-2 h-96"
          >
            <CountryBubbleChart data={stats?.byCountry || []} />
          </ChartCard>

          <ChartCard title="By Sector" subtitle="Share of records" className="h-96">
            <DonutChart data={stats?.bySector || []} maxSlices={6} />
          </ChartCard>
        </div>

        <DataTable records={records} pagination={pagination} onPageChange={setPage} />

        {loading && (
          <p className="text-xs text-muted text-center py-2">Updating charts…</p>
        )}
      </main>
    </div>
  );
}
