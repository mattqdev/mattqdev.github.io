"use client";
// components/About.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";
import { useRobloxFollowers, useRobloxGameStats } from "@/hooks/useRobloxStats";
import { formatNumber } from "@/lib/format";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function useCounter(end, duration, trigger) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!trigger) return;
    if (reduceMotion) {
      setValue(end);
      return;
    }
    let start = null;
    let frame;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(pct * pct * (3 - 2 * pct) * end));
      if (pct < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [trigger, end, duration, reduceMotion]);
  return value;
}

// Parses portfolio metric strings ("3.2M+", "680K+", "65,000+") into numbers.
function parseMetric(str) {
  const match = String(str || "")
    .replace(/,/g, "")
    .match(/([\d.]+)\s*([KkMm]?)/);
  if (!match) return 0;
  const [, num, suffix] = match;
  const n = parseFloat(num);
  if (suffix.toUpperCase() === "K") return Math.round(n * 1_000);
  if (suffix.toUpperCase() === "M") return Math.round(n * 1_000_000);
  return Math.round(n);
}

// Every Roblox game that tracks a "Total Visits" achievement, with its
// static achievement number kept as a fallback for delisted/banned games
// (the live API reports 0 visits for those instead of their real history).
const ROBLOX_GAMES = projects
  .map((p) => {
    const link = p.links?.find(
      (l) =>
        (l.type === "play" || l.type === "live") &&
        l.url?.includes("roblox.com/games/")
    );
    const visitsAchievement = p.achievements?.find(
      (a) => a.title === "Total Visits"
    );
    if (!link || !visitsAchievement) return null;
    return { url: link.url, fallback: parseMetric(visitsAchievement.metric) };
  })
  .filter(Boolean);

// Renders nothing — just resolves one game's live visit count (or its
// static fallback) and reports it up via onUpdate. Kept as its own
// component so each call site owns a single, rules-of-hooks-safe hook call.
function GameVisitsFetcher({ url, fallback, index, onUpdate }) {
  const { stats } = useRobloxGameStats(url);
  useEffect(() => {
    onUpdate(index, stats?.visits > 0 ? stats.visits : fallback);
  }, [stats, fallback, index, onUpdate]);
  return null;
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [gameVisits, setGameVisits] = useState(() =>
    ROBLOX_GAMES.map((g) => g.fallback)
  );
  const handleVisitsUpdate = useCallback((index, value) => {
    setGameVisits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);
  const totalVisits = gameVisits.reduce((a, b) => a + b, 0);

  const { count: liveFollowers } = useRobloxFollowers();
  const followerCount = liveFollowers ?? 15200;

  const visits = useCounter(totalVisits, 2200, isInView);
  const followers = useCounter(followerCount, 1800, isInView);
  const shipped = useCounter(projects.length, 1200, isInView);

  const stats = [
    { value: formatNumber(visits) + "+", label: "Game Visits" },
    { value: formatNumber(shipped) + "+", label: "Projects Shipped" },
    { value: formatNumber(followers), label: "Followers" },
  ];

  return (
    <section id="about" className="section">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="section-head">
          <div className="section-head-main">
            <span className="label">01 · Background</span>
            <motion.h2 className="h-display" variants={fadeUp}>
              About me<span className="dot-red">.</span>
            </motion.h2>
          </div>
        </div>

        <div className="about-grid">
          <motion.div className="about-text" variants={containerVariants}>
            <motion.h3 className="about-heading" variants={fadeUp}>
              Making games, tools and websites since 2020
            </motion.h3>
            <motion.p variants={fadeUp}>
              I build polished web apps and Roblox games, from first pixel to
              final deploy. Since 2022 I&rsquo;ve focused heavily on Roblox
              development, pairing game design with full-stack engineering.
            </motion.p>

            <motion.ul className="about-disciplines" variants={fadeUp}>
              {["Web Development", "Roblox Development", "UI/UX Design"].map(
                (h, i) => (
                  <li key={h}>
                    <span className="mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {h}
                  </li>
                )
              )}
            </motion.ul>
          </motion.div>

          <motion.div className="about-stats" ref={ref} variants={fadeUp}>
            <div className="about-stats-head label">
              <span className="live-ring" aria-hidden="true" />
              Live stats
            </div>
            <dl className="stats">
              {stats.map((s) => (
                <div key={s.label} className="stat-row">
                  <dt className="stat-label">{s.label}</dt>
                  <dd className="stat-value">{s.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </motion.div>

      {ROBLOX_GAMES.map((g, i) => (
        <GameVisitsFetcher
          key={g.url}
          url={g.url}
          fallback={g.fallback}
          index={i}
          onUpdate={handleVisitsUpdate}
        />
      ))}
    </section>
  );
}
