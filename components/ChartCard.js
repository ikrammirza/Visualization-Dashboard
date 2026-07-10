export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`bg-card rounded-2xl shadow-card border border-slate-100 p-5 flex flex-col ${className}`}
    >
      <div className="mb-3">
        <h3 className="font-display font-semibold text-ink text-[15px]">{title}</h3>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
