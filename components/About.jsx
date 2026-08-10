"use client";
// components/About.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChartLine, FaLayerGroup, FaUser } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import About3D from "./About3D";
import GitHubHeatmap from "./GitHubHeatmap";
import { projects } from "@/data/projects";
import { useRobloxFollowers, useRobloxGameStats } from "@/hooks/useRobloxStats";

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
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(pct * pct * (3 - 2 * pct) * end));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, end, duration]);
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
      (l) => (l.type === "play" || l.type === "live") &&
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
    {
      icon: <FaChartLine />,
      value: visits.toLocaleString() + "+",
      label: "Game Visits",
    },
    {
      icon: <FaLayerGroup />,
      value: shipped.toLocaleString() + "+",
      label: "Projects Shipped",
    },
    { icon: <FaUser />, value: followers.toLocaleString(), label: "Followers" },
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
        <div className="section-title">
          <div className="section-label">Background</div>
          <motion.h2 variants={fadeUp}>
            About <em>Me</em>
          </motion.h2>
          <p>Developer & designer with a love for craft across platforms.</p>
        </div>

        <div className="about-content">
          <motion.div className="about-text" variants={containerVariants}>
            <motion.h3 variants={fadeUp}>
              {new Date().getFullYear() - 2020}+ Years Building Things That Work
            </motion.h3>
            <motion.p variants={fadeUp}>
              I build polished web apps and Roblox games, from first pixel to
              final deploy. Since 2022 I've focused heavily on Roblox
              development, pairing game design with full-stack engineering.
            </motion.p>

            <motion.div className="about-highlights" variants={fadeUp}>
              {["Web Development", "Roblox Development", "UI/UX Design"].map(
                (h) => (
                  <span key={h} className="about-highlight">
                    {h}
                  </span>
                )
              )}
            </motion.div>

            <motion.div className="stats-title-row" variants={fadeUp}>
              <span className="live-dot" />
              <span className="stats-title">Live stats</span>
            </motion.div>

            <motion.div
              className="stats"
              ref={ref}
              variants={containerVariants}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className="stat-box animate"
                  variants={fadeUp}
                  whileHover={{ y: -6, borderColor: "rgba(255,77,90,.35)" }}
                >
                  <div className="stat-icon">{s.icon}</div>
                  <h4>{s.value}</h4>
                  <p>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* GitHub activity heatmap */}
            <motion.div variants={fadeUp} style={{ marginTop: 32 }}>
              <GitHubHeatmap />
            </motion.div>
          </motion.div>

          <motion.div className="wrapper-3d" variants={fadeUp}>
            <About3D />
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
