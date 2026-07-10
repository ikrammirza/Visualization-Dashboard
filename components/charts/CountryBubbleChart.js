"use client";

import "@/lib/chartSetup";
import { Bubble } from "react-chartjs-2";

function intensityColor(intensity) {
  // Low intensity -> blue, high intensity -> red, roughly a 0-10 scale
  const t = Math.min(1, Math.max(0, (intensity || 0) / 10));
  const r = Math.round(62 + t * (239 - 62));
  const g = Math.round(99 + t * (68 - 99));
  const b = Math.round(221 + t * (68 - 221));
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

export default function CountryBubbleChart({ data = [] }) {
  const chartData = {
    datasets: [
      {
        label: "Countries",
        data: data.map((d) => ({
          x: d.avgLikelihood || 0,
          y: d.avgRelevance || 0,
          r: Math.max(4, Math.min(28, (d.count || 1) * 1.8)),
          country: d._id,
          count: d.count,
          avgIntensity: d.avgIntensity,
        })),
        backgroundColor: data.map((d) => intensityColor(d.avgIntensity)),
        borderColor: data.map((d) => intensityColor(d.avgIntensity).replace("0.7", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const d = ctx.raw;
            return `${d.country} — likelihood ${d.x.toFixed(1)}, relevance ${d.y.toFixed(1)}, ${d.count} records`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Avg Likelihood", font: { size: 11 } },
        grid: { color: "#EEF0F5" },
      },
      y: {
        title: { display: true, text: "Avg Relevance", font: { size: 11 } },
        grid: { color: "#EEF0F5" },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted">
        No countries match the current filters.
      </div>
    );
  }

  return <Bubble data={chartData} options={options} />;
}
