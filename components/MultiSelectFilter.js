"use client";

import { useEffect, useRef, useState } from "react";

export default function MultiSelectFilter({
  label,
  options = [],
  selected = [],
  onChange,
  disabled = false,
  disabledNote,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleValue(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const summary =
    selected.length === 0 ? "All" : selected.length === 1 ? selected[0] : `${selected.length} selected`;

  return (
    <div className="relative" ref={ref}>
      <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        title={disabled ? disabledNote : undefined}
        className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm border transition
          ${disabled
            ? "bg-panelLight/40 border-white/5 text-slate-500 cursor-not-allowed"
            : "bg-panelLight border-white/10 text-slate-100 hover:border-white/20"}`}
      >
        <span className="truncate">{disabled ? "Not available" : summary}</span>
        {!disabled && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 ml-2 opacity-60">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {disabled && disabledNote && (
        <p className="text-[10px] text-slate-500 mt-1 leading-snug">{disabledNote}</p>
      )}

      {open && !disabled && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-panelLight border border-white/10 rounded-lg shadow-xl py-1">
          {options.length === 0 && (
            <p className="px-3 py-2 text-xs text-slate-500">No options</p>
          )}
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleValue(opt)}
                className="accent-accent2"
              />
              <span className="truncate">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
