"use client";
// components/ProgressRing.jsx
import { useState, useEffect } from "react";

/**
 * Self-contained scroll-to-top button with an SVG ring that fills
 * as the user scrolls. No props needed — reads window.scrollY itself.
 *
 * Also renders the thin top progress bar (pd-progress-bar) so
 * ProjectDetails and BlogArticle don't need their own scrollPct state.
 */
export function ProgressRing() {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const pct =
        (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
      setScrollPct(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set correct value on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - scrollPct / 100);

  return (
    <>
      {/* Thin top-of-page progress bar */}
      <div
        className="pd-progress-bar"
        style={{ width: `${scrollPct}%` }}
        aria-hidden="true"
      />

      {/* Floating scroll-to-top button with ring */}
      <button
        className="pd-fab progress-fab"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={`Scroll to top (${Math.round(scrollPct)}% read)`}
        title={`${Math.round(scrollPct)}% read — click to scroll to top`}
      >
        <svg width={44} height={44} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={22}
            cy={22}
            r={r}
            fill="none"
            stroke="rgba(255,77,90,0.15)"
            strokeWidth={3}
          />
          <circle
            cx={22}
            cy={22}
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={3}
            strokeDasharray={circ}
            strokeDashoffset={dash}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.15s linear" }}
          />
        </svg>
      </button>
    </>
  );
}
