"use client";

import "@/lib/chartSetup";
import { Bar } from "react-chartjs-2";

export default function IntensityHistogram({ data = [] }) {
  const buckets = data.filter((d) => d._id !== "other");

  const chartData = {
    labels: buckets.map((d) => `${d._id}`),
    datasets: [
      {
        label: "Records",
        data: buckets.map((d) => d.count),
        backgroundColor: "#F5A524",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: "Intensity score", font: { size: 11 } }, grid: { display: false } },
      y: { grid: { color: "#EEF0F5" }, beginAtZero: true },
    },
  };

  if (buckets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted">
        No intensity data matches the current filters.
      </div>
    );
  }

  return <Bar data={chartData} options={options} />;
}
