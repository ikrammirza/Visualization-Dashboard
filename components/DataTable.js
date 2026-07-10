"use client";

const COLUMNS = [
  { key: "title", label: "Title", className: "max-w-[280px]" },
  { key: "topic", label: "Topic" },
  { key: "sector", label: "Sector" },
  { key: "country", label: "Country" },
  { key: "region", label: "Region" },
  { key: "intensity", label: "Intensity" },
  { key: "likelihood", label: "Likelihood" },
  { key: "relevance", label: "Relevance" },
  { key: "end_year", label: "End Year" },
];

export default function DataTable({ records = [], pagination, onPageChange }) {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-slate-100 overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-display font-semibold text-ink text-[15px]">Records</h3>
        <p className="text-xs text-muted mt-0.5">
          {pagination?.total ?? 0} matching records
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-b border-slate-100 bg-slate-50/60">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="text-left font-medium text-muted px-4 py-2 whitespace-nowrap text-xs uppercase tracking-wide"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50/60">
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2.5 text-ink whitespace-nowrap ${col.className || ""} ${
                      col.key === "title" ? "whitespace-normal truncate" : ""
                    }`}
                  >
                    {r[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-muted text-sm">
                  No records match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
