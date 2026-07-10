"use client";

import "@/lib/chartSetup";
import { Line } from "react-chartjs-2";

export default function TrendChart({ data = [] }) {
  const labels = data.map((d) => d._id);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Avg Intensity",
        data: data.map((d) => d.avgIntensity),
        borderColor: "#F5A524",
        backgroundColor: "rgba(245, 165, 36, 0.12)",
        tension: 0.35,
        fill: true,
        pointRadius: 2,
      },
      {
        label: "Avg Likelihood",
        data: data.map((d) => d.avgLikelihood),
        borderColor: "#3E63DD",
        backgroundColor: "rgba(62, 99, 221, 0.08)",
        tension: 0.35,
        fill: false,
        pointRadius: 2,
      },
      {
        label: "Avg Relevance",
        data: data.map((d) => d.avgRelevance),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        tension: 0.35,
        fill: false,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#EEF0F5" }, beginAtZero: true },
    },
  };

  if (labels.length === 0) {
    return <EmptyState />;
  }

  return <Line data={chartData} options={options} />;
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center text-sm text-muted">
      No records with a start year match the current filters.
    </div>
  );
}
