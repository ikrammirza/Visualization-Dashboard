const KPI_CONFIG = [
  { key: "totalRecords", label: "Total Records", format: (v) => v ?? 0, accent: "bg-accent2" },
  { key: "avgIntensity", label: "Avg Intensity", format: (v) => (v ? v.toFixed(2) : "—"), accent: "bg-accent" },
  { key: "avgLikelihood", label: "Avg Likelihood", format: (v) => (v ? v.toFixed(2) : "—"), accent: "bg-emerald-500" },
  { key: "avgRelevance", label: "Avg Relevance", format: (v) => (v ? v.toFixed(2) : "—"), accent: "bg-violet-500" },
];

export default function KpiCards({ summary }) {
  const stats = summary?.[0] || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CONFIG.map(({ key, label, format, accent }) => (
        <div
          key={key}
          className="bg-card rounded-2xl shadow-card border border-slate-100 p-5 flex items-center gap-4"
        >
          <div className={`w-2 h-10 rounded-full ${accent}`} />
          <div>
            <p className="text-xs text-muted font-medium">{label}</p>
            <p className="font-display text-2xl font-semibold text-ink mt-0.5">
              {format(stats[key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
