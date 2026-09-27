"use client";
// components/CategoryFilter.jsx
// Single-select dropdown filter with per-category counts. Replaces long
// rows of filter buttons, which get unreadable once there are more than
// a handful of categories.
//
// Implemented as a disclosure (button + panel of toggle buttons) rather
// than an ARIA listbox: plain buttons stay keyboard-reachable with Tab,
// and ArrowUp/ArrowDown move between them as a shortcut.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

const SEARCH_THRESHOLD = 8;

export default function CategoryFilter({ options, value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const optionsRef = useRef(null);
  const panelId = useId();

  const close = (returnFocus) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    // Focus the search box only with a fine pointer (avoids popping the
    // on-screen keyboard on touch devices); otherwise focus the active option.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (options.length > SEARCH_THRESHOLD && finePointer) {
      searchRef.current?.focus();
    } else {
      optionsRef.current
        ?.querySelector('[aria-pressed="true"], button')
        ?.focus();
    }
  }, [open, options.length]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const active = options.find((o) => o.value === value) ?? options[0];

  const moveFocus = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const buttons = Array.from(
      optionsRef.current?.querySelectorAll("button") ?? []
    );
    if (!buttons.length) return;
    e.preventDefault();
    const i = buttons.indexOf(document.activeElement);
    const next =
      e.key === "ArrowDown"
        ? buttons[(i + 1) % buttons.length]
        : buttons[(i - 1 + buttons.length) % buttons.length];
    next.focus();
  };

  return (
    <div className="category-filter" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`category-filter-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        {label && <span className="category-filter-label">{label}:</span>}
        <span className="category-filter-value">{active?.label}</span>
        {active?.count !== undefined && (
          <span className="category-filter-count">{active.count}</span>
        )}
        <FaChevronDown className="category-filter-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="category-filter-panel"
          id={panelId}
          onKeyDown={moveFocus}
        >
          {options.length > SEARCH_THRESHOLD && (
            <div className="category-filter-search">
              <FaSearch
                className="category-filter-search-icon"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                name="category-search"
                aria-label={`Search ${label ? label.toLowerCase() : "categories"}`}
                placeholder="Search categories…"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          <div className="category-filter-options" ref={optionsRef}>
            {filteredOptions.length === 0 ? (
              <div className="category-filter-empty" role="status">
                No matches — try a shorter search.
              </div>
            ) : (
              filteredOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={o.value === value}
                  className={`category-filter-option ${o.value === value ? "active" : ""}`}
                  onClick={() => {
                    onChange(o.value);
                    close(true);
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
