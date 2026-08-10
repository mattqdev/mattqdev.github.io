"use client";
// components/CategoryFilter.jsx
// Single-select dropdown filter with per-category counts. Replaces long
// rows of filter buttons, which get unreadable once there are more than
// a handful of categories.
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

const SEARCH_THRESHOLD = 8;

export default function CategoryFilter({ options, value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open && options.length > SEARCH_THRESHOLD) searchRef.current?.focus();
    if (!open) setQuery("");
  }, [open, options.length]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const active = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="category-filter" ref={rootRef}>
      <button
        type="button"
        className={`category-filter-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label && <span className="category-filter-label">{label}:</span>}
        <span className="category-filter-value">{active?.label}</span>
        {active?.count !== undefined && (
          <span className="category-filter-count">{active.count}</span>
        )}
        <FaChevronDown className="category-filter-chevron" />
      </button>

      {open && (
        <div className="category-filter-panel" role="listbox">
          {options.length > SEARCH_THRESHOLD && (
            <div className="category-filter-search">
              <FaSearch className="category-filter-search-icon" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search categories…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          <div className="category-filter-options">
            {filteredOptions.length === 0 ? (
              <div className="category-filter-empty">No matches</div>
            ) : (
              filteredOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  className={`category-filter-option ${o.value === value ? "active" : ""}`}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  <span>{o.label}</span>
                  {o.count !== undefined && (
                    <span className="category-filter-option-count">
                      {o.count}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
