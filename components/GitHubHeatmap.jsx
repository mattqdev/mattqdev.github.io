"use client";
// components/GitHubHeatmap.jsx
// Fetches the last 90 days of public GitHub events for mattqdev,
// aggregates by date, and renders a contribution-style heatmap.
// Uses the public /events API — no auth token needed.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const USERNAME = "mattqdev";
const DAYS = 84; // 12 weeks × 7
const ACCENT = "#ff4d5a";

/* ── Date utilities ─────────────────────────────────────── */
function isoDate(d) {
  return d.toISOString().split("T")[0];
}

function buildEmptyGrid() {
  // Build last DAYS days ending today, aligned to Sunday
  const grid = {}; // 'YYYY-MM-DD' → count
  const today = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    grid[isoDate(d)] = 0;
  }
  return grid;
}

/* ── Fetch & aggregate ──────────────────────────────────── */
async function fetchActivity() {
  // GitHub returns max 300 events across up to 10 pages
  const pages = [1, 2, 3];
  const results = await Promise.allSettled(
    pages.map((p) =>
      fetch(
        `https://api.github.com/users/${USERNAME}/events/public?per_page=100&page=${p}`,
        { headers: { Accept: "application/vnd.github+json" } }
      ).then((r) => (r.ok ? r.json() : []))
    )
  );
  const events = results.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );
  const grid = buildEmptyGrid();
  for (const ev of events) {
    const day = ev.created_at?.split("T")[0];
    if (day && day in grid) grid[day]++;
  }
  return grid;
}

/* ── Color scale ────────────────────────────────────────── */
function cellColor(count, max) {
  if (count === 0) return "rgba(255,255,255,0.04)";
  const pct = Math.min(count / Math.max(max, 1), 1);
  // Interpolate: low activity → dim red, high → bright primary
  const alpha = 0.15 + pct * 0.85;
  return `rgba(255, 77, 90, ${alpha.toFixed(2)})`;
}

/* ── Tooltip state ──────────────────────────────────────── */
function Tooltip({ day, count, style }) {
  if (!day) return null;
  return (
    <div className="heatmap-tooltip" style={style}>
      <strong>{count}</strong> event{count !== 1 ? "s" : ""} on{" "}
      {new Date(day + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </div>
  );
}

export default function GitHubHeatmap() {
  const [grid, setGrid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState(null); // { day, count, x, y }

  useEffect(() => {
    fetchActivity()
      .then((g) => {
        setGrid(g);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Build ordered day keys (oldest → newest)
  const days = grid ? Object.keys(grid).sort() : [];
  const max = grid ? Math.max(...Object.values(grid), 1) : 1;
  const total = grid ? Object.values(grid).reduce((a, b) => a + b, 0) : 0;

  // Group into weeks (columns of 7)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Month labels (first day of each month that appears)
  const monthLabels = [];
  if (days.length) {
    let lastMonth = "";
    weeks.forEach((week, wi) => {
      const firstDay = week[0];
      const month = new Date(firstDay + "T00:00:00").toLocaleDateString(
        "en-US",
        { month: "short" }
      );
      if (month !== lastMonth) {
        monthLabels.push({ wi, label: month });
        lastMonth = month;
      }
    });
  }

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-header">
        <span className="heatmap-title">GitHub Activity</span>
        {!loading && !error && (
          <span className="heatmap-total">
            {total} public events in the last 12 weeks
          </span>
        )}
      </div>

      {loading && (
        <div className="heatmap-loading">
          <div className="github-loading-dot" />
          <div className="github-loading-dot" />
          <div className="github-loading-dot" />
          <span>Loading activity…</span>
        </div>
      )}

      {error && <p className="heatmap-error">Couldn't load GitHub activity.</p>}

      {!loading && !error && grid && (
        <div className="heatmap-scroll">
          {/* Month labels row */}
          <div
            className="heatmap-months"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}
          >
            {weeks.map((_, wi) => {
              const label = monthLabels.find((m) => m.wi === wi);
              return (
                <div key={wi} className="heatmap-month-label">
                  {label ? label.label : ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div
            className="heatmap-grid"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}
          >
            {weeks.map((week, wi) =>
              week.map((day, di) => {
                const count = grid[day] ?? 0;
                return (
                  <motion.div
                    key={day}
                    className="heatmap-cell"
                    style={{ background: cellColor(count, max) }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.003, duration: 0.2 }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        day,
                        count,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    aria-label={`${count} events on ${day}`}
                  />
                );
              })
            )}
          </div>

          {/* Legend */}
          <div className="heatmap-legend">
            <span className="heatmap-legend-label">Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
              <div
                key={i}
                className="heatmap-cell"
                style={{ background: cellColor(pct * max, max), flexShrink: 0 }}
              />
            ))}
            <span className="heatmap-legend-label">More</span>
          </div>
        </div>
      )}

      {tooltip && (
        <Tooltip
          day={tooltip.day}
          count={tooltip.count}
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        />
      )}
    </div>
  );
}
