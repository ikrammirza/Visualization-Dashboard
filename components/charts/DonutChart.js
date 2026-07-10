"use client";

import "@/lib/chartSetup";
import { Doughnut } from "react-chartjs-2";

const PALETTE = [
  "#3E63DD", "#F5A524", "#10B981", "#EF4444", "#8B5CF6",
  "#06B6D4", "#F43F5E", "#84CC16", "#EAB308", "#6366F1",
];

export default function DonutChart({ data = [], maxSlices = 8 }) {
  const top = [...data].sort((a, b) => b.count - a.count).slice(0, maxSlices);
  const rest = data.slice(maxSlices).reduce((sum, d) => sum + d.count, 0);

  const labels = top.map((d) => d._id);
  const values = top.map((d) => d.count);
  if (rest > 0) {
    labels.push("Other");
    values.push(rest);
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: PALETTE,
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 10, font: { size: 10 }, padding: 8 },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted">
        No data matches the current filters.
      </div>
    );
  }

  return <Doughnut data={chartData} options={options} />;
}
