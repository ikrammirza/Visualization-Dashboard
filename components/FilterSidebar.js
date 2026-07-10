"use client";

import MultiSelectFilter from "./MultiSelectFilter";

const NO_DATA_NOTE = "This field does not exist in the source dataset.";

export default function FilterSidebar({ filters, values, onChange, onReset }) {
  if (!filters) return null;

  return (
    <aside className="w-72 shrink-0 bg-panel min-h-screen text-slate-100 flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <h1 className="font-display font-bold text-lg tracking-tight">Insight Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Global business trends, 2010–2030</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
            End Year
          </label>
          <select
            value={values.end_year || ""}
            onChange={(e) => onChange("end_year", e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-panelLight border border-white/10 text-slate-100"
          >
            <option value="">All</option>
            {filters.end_year.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <MultiSelectFilter
          label="Topics"
          options={filters.topic}
          selected={values.topic}
          onChange={(v) => onChange("topic", v)}
        />

        <MultiSelectFilter
          label="Sector"
          options={filters.sector}
          selected={values.sector}
          onChange={(v) => onChange("sector", v)}
        />

        <MultiSelectFilter
          label="Region"
          options={filters.region}
          selected={values.region}
          onChange={(v) => onChange("region", v)}
        />

        <MultiSelectFilter
          label="PEST(LE)"
          options={filters.pestle}
          selected={values.pestle}
          onChange={(v) => onChange("pestle", v)}
        />

        <MultiSelectFilter
          label="Source"
          options={filters.source}
          selected={values.source}
          onChange={(v) => onChange("source", v)}
        />

        <MultiSelectFilter
          label="Country"
          options={filters.country}
          selected={values.country}
          onChange={(v) => onChange("country", v)}
        />

        <MultiSelectFilter label="City" options={[]} selected={[]} onChange={() => {}} disabled disabledNote={NO_DATA_NOTE} />

        <MultiSelectFilter label="SWOT" options={[]} selected={[]} onChange={() => {}} disabled disabledNote={NO_DATA_NOTE} />
      </div>

      <div className="px-5 py-4 border-t border-white/10">
        <button
          onClick={onReset}
          className="w-full py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 text-slate-200 transition"
        >
          Reset all filters
        </button>
      </div>
    </aside>
  );
}
