"use client";
// components/GitHubHeatmap.jsx
// Compact GitHub activity widget for mattqdev: a few headline numbers
// (events, current streak, most active day) plus a small 4-week heatmap
// strip — sized to earn its footprint instead of a full 12-week grid.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const USERNAME = "mattqdev";
const DAYS = 28; // 4 weeks × 7

/* ── Date utilities ─────────────────────────────────────── */
function isoDate(d) {
  return d.toISOString().split("T")[0];
}

function buildEmptyGrid() {
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

/* ── Derived headline numbers ──────────────────────────────── */
function computeSummary(grid) {
  const days = Object.keys(grid).sort();
  const total = days.reduce((sum, d) => sum + grid[d], 0);

  // Current streak: consecutive active days counting back from today.
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (grid[days[i]] > 0) streak++;
    else break;
  }

  // Most active day.
  let bestDay = null;
  let bestCount = 0;
  for (const d of days) {
    if (grid[d] > bestCount) {
      bestCount = grid[d];
      bestDay = d;
    }
  }

  return { total, streak, bestDay, bestCount };
}

/* ── Color scale ────────────────────────────────────────── */
function cellColor(count, max) {
  if (count === 0) return "rgba(255,255,255,0.04)";
  const pct = Math.min(count / Math.max(max, 1), 1);
  const alpha = 0.15 + pct * 0.85;
  return `rgba(255, 77, 90, ${alpha.toFixed(2)})`;
}

function Tooltip({ day, count, style }) {
  if (!day) return null;
  return (
    <div className="heatmap-tooltip" style={style}>
      <strong>{count}</strong> event{count !== 1 ? "s" : ""} on{" "}
      {new Date(day + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}
    </div>
  );
}

export default function GitHubHeatmap() {
  const [grid, setGrid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState(null);

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

  const days = grid ? Object.keys(grid).sort() : [];
  const max = grid ? Math.max(...Object.values(grid), 1) : 1;
  const summary = grid ? computeSummary(grid) : null;

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-header">
        <span className="heatmap-title">GitHub Activity</span>
        <span className="heatmap-total">last 4 weeks</span>
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

      {!loading && !error && grid && summary && (
        <>
          <div className="heatmap-stats-row">
            <div className="heatmap-stat">
              <span className="heatmap-stat-value">{summary.total}</span>
              <span className="heatmap-stat-label">Events</span>
            </div>
            <div className="heatmap-stat">
              <span className="heatmap-stat-value">{summary.streak}</span>
              <span className="heatmap-stat-label">
                Day{summary.streak !== 1 ? "s" : ""} streak
              </span>
            </div>
            <div className="heatmap-stat">
              <span className="heatmap-stat-value">
                {summary.bestDay
                  ? new Date(summary.bestDay + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )
                  : "—"}
              </span>
              <span className="heatmap-stat-label">Most active</span>
            </div>
          </div>

          <div className="heatmap-grid heatmap-grid-compact">
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
                    transition={{ delay: (wi * 7 + di) * 0.006, duration: 0.2 }}
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
        </>
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
