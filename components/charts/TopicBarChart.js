"use client";

import "@/lib/chartSetup";
import { Bar } from "react-chartjs-2";

export default function TopicBarChart({ data = [] }) {
  const sorted = [...data].sort((a, b) => a.count - b.count);

  const chartData = {
    labels: sorted.map((d) => d._id),
    datasets: [
      {
        label: "Records",
        data: sorted.map((d) => d.count),
        backgroundColor: "#3E63DD",
        borderRadius: 4,
        barThickness: 14,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: "#EEF0F5" }, beginAtZero: true },
      y: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  if (sorted.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted">
        No topics match the current filters.
      </div>
    );
  }

  return <Bar data={chartData} options={options} />;
}
