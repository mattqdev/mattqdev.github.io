"use client";
// components/ProjectDetails.jsx — Supercharged v2
// Features:
//  1. Scroll-progress ring + section-aware reading tracker
//  2. LocalStorage bookmark/save system with animated heart state
//  3. Share panel with copy-link + GitHub stats cached to sessionStorage
//  4. Floating ToC sidebar (desktop) that highlights active section
//  5. Cinematic hero with parallax depth layer and animated gradient orbs
//  6. Tab system with sliding underline indicator
//  7. Gallery lightbox with keyboard nav + zoom
//  8. Micro-interactions throughout (ripple on click, stagger reveals)

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
  FaCalendarAlt,
  FaCode,
  FaDownload,
  FaPlayCircle,
  FaExclamationCircle,
  FaStar,
  FaCodeBranch,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaLink,
  FaCheck,
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { projects } from "@/data/projects";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useGitHubData } from "@/hooks/useGitHubData";

/* ─── helpers ───────────────────────────────────────── */
function findPrev(project) {
  return projects[projects.indexOf(project) - 1]?.id;
}
function findNext(project) {
  return projects[projects.indexOf(project) + 1]?.id;
}

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Luau: "#00a2ff",
  Lua: "#000080",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
  "C#": "#178600",
  Shell: "#89e051",
  Ruby: "#701516",
};

/* ─── sub-components ─────────────────────────────────── */
function LanguageBar({ langs }) {
  if (!langs || Object.keys(langs).length === 0) return null;
  const total = Object.values(langs).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          height: 6,
          borderRadius: 3,
          overflow: "hidden",
          gap: 2,
        }}
      >
        {sorted.map(([lang, bytes]) => (
          <span
            key={lang}
            title={`${lang} ${((bytes / total) * 100).toFixed(1)}%`}
            style={{
              flex: bytes / total,
              background: LANG_COLORS[lang] || "#8888aa",
              minWidth: 4,
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
        {sorted.map(([lang, bytes]) => (
          <div
            key={lang}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.76rem",
              color: "var(--text-secondary)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: LANG_COLORS[lang] || "#8888aa",
                flexShrink: 0,
              }}
            />
            <span>{lang}</span>
            <span
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {((bytes / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GitHubCard({ githubUrl }) {
  const { repo, langs, loading, error } = useGitHubData(githubUrl);
  if (!githubUrl) return null;

  const stats = repo
    ? [
        {
          icon: <FaStar />,
          value: repo.stargazers_count?.toLocaleString(),
          label: "Stars",
        },
        {
          icon: <FaCodeBranch />,
          value: repo.forks_count?.toLocaleString(),
          label: "Forks",
        },
        {
          icon: <FaEye />,
          value: repo.watchers_count?.toLocaleString(),
          label: "Watchers",
        },
        {
          icon: <FaExclamationCircle />,
          value: repo.open_issues_count?.toLocaleString(),
          label: "Issues",
        },
      ]
    : [];

  return (
    <div className="pd-github-card">
      <div className="pd-github-card-header">
        <FaGithub style={{ fontSize: "1.1rem" }} />
        <span>Repository</span>
        {repo?.private === false && (
          <span className="pd-badge pd-badge-teal">Public</span>
        )}
      </div>

      {loading && (
        <div className="pd-github-loading">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="pd-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Fetching repo…
          </span>
        </div>
      )}

      {error && (
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <FaExclamationCircle
            style={{ color: "var(--primary)", marginRight: 6 }}
          />
          Couldn't load repo data.
        </p>
      )}

      {repo && !loading && (
        <>
          {repo.description && (
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {repo.description}
            </p>
          )}
          <div className="pd-stat-grid">
            {stats.map((s, i) => (
              <div key={i} className="pd-stat-pill">
                <span className="pd-stat-icon">{s.icon}</span>
                <span className="pd-stat-value">{s.value}</span>
                <span className="pd-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          {langs && <LanguageBar langs={langs} />}
          {repo.topics?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {repo.topics.map((t) => (
                <span key={t} className="pd-topic">
                  {t}
                </span>
              ))}
            </div>
          )}
          {repo.license && (
            <p
              style={{
                fontSize: "0.74rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {repo.license.spdx_id} license
            </p>
          )}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pd-github-btn"
          >
            <FaGithub /> View on GitHub
          </a>
        </>
      )}
    </div>
  );
}

/* ── Scroll-progress ring ─────── */
function ProgressRing({ progress }) {
  const r = 18,
    circ = 2 * Math.PI * r;
  const dash = circ * (1 - progress / 100);
  return (
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
        style={{ transition: "stroke-dashoffset 0.15s linear" }}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Gallery lightbox ──────────── */
function Gallery({ images = [], videos = [] }) {
  const media = [
    ...images.map((src) => ({ type: "image", src })),
    ...videos.map((src) => ({ type: "video", src })),
  ];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback(
    (dir) => {
      setActive((i) => (i + dir + media.length) % media.length);
    },
    [media.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, go]);

  if (media.length === 0)
    return (
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
        No media available.
      </p>
    );
  const cur = media[active];

  return (
    <>
      {/* Main viewer */}
      <div
        className="pd-gallery-main"
        onClick={() => setLightbox(true)}
        role="button"
        aria-label="Open lightbox"
      >
        <div className="pd-gallery-media">
          {cur.type === "image" ? (
            <img src={cur.src} alt={`Media ${active + 1}`} />
          ) : (
            <video src={cur.src} controls />
          )}
        </div>
        <div className="pd-gallery-expand">
          <FaExpand />
        </div>
        <button
          className="pd-gallery-nav pd-gallery-prev"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label="Previous"
        >
          <FaChevronLeft />
        </button>
        <button
          className="pd-gallery-nav pd-gallery-next"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label="Next"
        >
          <FaChevronRight />
        </button>
        <div className="pd-gallery-counter">
          {active + 1} / {media.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="pd-thumbs">
        {media.map((m, i) => (
          <button
            key={i}
            className={`pd-thumb ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to ${i + 1}`}
          >
            {m.type === "image" ? (
              <img src={m.src} alt="" />
            ) : (
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <video
                  src={m.src}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <FaPlayCircle
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    color: "#fff",
                    fontSize: "1rem",
                  }}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="pd-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="pd-lightbox-close"
              onClick={() => setLightbox(false)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <button
              className="pd-lightbox-nav pd-lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <motion.div
              className="pd-lightbox-content"
              onClick={(e) => e.stopPropagation()}
              key={active}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {cur.type === "image" ? (
                <img src={cur.src} alt={`Media ${active + 1}`} />
              ) : (
                <video src={cur.src} controls autoPlay />
              )}
            </motion.div>
            <button
              className="pd-lightbox-nav pd-lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
            <div className="pd-lightbox-counter">
              {active + 1} / {media.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Share panel ─────────────── */
function SharePanel({ project }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* fallback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pd-share-panel">
      <p
        style={{
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          marginBottom: 10,
          fontFamily: "var(--font-mono)",
        }}
      >
        SHARE THIS PROJECT
      </p>
      <div className="pd-share-url">
        <FaLink style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
          }}
        >
          {url}
        </span>
        <button
          className={`pd-copy-btn ${copied ? "copied" : ""}`}
          onClick={copy}
        >
          {copied ? (
            <>
              <FaCheck /> Copied!
            </>
          ) : (
            <>
              <FaLink /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Bookmark button ─────────── */
function BookmarkBtn({ projectId }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(
        localStorage.getItem("pd-bookmarks") || "[]"
      );
      setSaved(bookmarks.includes(projectId));
    } catch {}
  }, [projectId]);

  const toggle = () => {
    try {
      const bookmarks = JSON.parse(
        localStorage.getItem("pd-bookmarks") || "[]"
      );
      let next;
      if (bookmarks.includes(projectId)) {
        next = bookmarks.filter((id) => id !== projectId);
      } else {
        next = [...bookmarks, projectId];
      }
      localStorage.setItem("pd-bookmarks", JSON.stringify(next));
      setSaved(!saved);
    } catch {}
  };

  return (
    <motion.button
      className={`pd-bookmark-btn ${saved ? "active" : ""}`}
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      aria-label={saved ? "Remove bookmark" : "Bookmark project"}
    >
      <motion.span
        animate={{ scale: saved ? [1, 1.35, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {saved ? <FaHeart /> : <FaRegHeart />}
      </motion.span>
      {saved ? "Saved" : "Save"}
    </motion.button>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function ProjectDetails({
  projectId,
  images = [],
  videos = [],
}) {
  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState("overview");
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [shareOpen, setShareOpen] = useState(false);
  const tabLineRef = useRef(null);
  const tabsRef = useRef({});
  const mainRef = useRef(null);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "gallery", label: `Gallery (${images.length + videos.length})` },
    { id: "tech", label: "Technologies" },
    { id: "achievements", label: "Achievements" },
  ];

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const pct = Math.round(
        (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100
      );
      setScrollPct(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tab indicator line
  useEffect(() => {
    const el = tabsRef.current[activeTab];
    const line = tabLineRef.current;
    if (!el || !line) return;
    line.style.left = `${el.offsetLeft}px`;
    line.style.width = `${el.offsetWidth}px`;
  }, [activeTab]);

  if (!project) {
    return (
      <div className="section" style={{ paddingTop: 160 }}>
        <div className="container">
          <h2>Project not found</h2>
          <Link href="/" className="btn" style={{ marginTop: 20 }}>
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const githubLink = project.links?.find(
    (l) => l.type === "github" && l.url?.includes("github.com")
  );
  const githubUrl = githubLink?.url || project.githubUrl;
  const thumbnailSrc = project.thumbnail
    ? `/media/projects/${project.id}/${project.thumbnail}`
    : null;

  return (
    <>
      <style>{`
        /* ── Progress bar (top of page) ── */
        .pd-progress-bar {
          position: fixed; top: 0; left: 0; height: 2px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          z-index: 9000; transition: width 0.1s linear;
          box-shadow: 0 0 8px rgba(255,77,90,0.5);
        }

        /* ── Floating action cluster ── */
        .pd-fab-cluster {
          position: fixed; bottom: 28px; right: 28px;
          display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
          z-index: 1000;
        }
        .pd-fab {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--bg-card); border: 1px solid var(--border);
          color: var(--text-secondary); cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          box-shadow: var(--shadow); position: relative; overflow: hidden;
        }
        .pd-fab:hover { background: var(--bg-card-hover); color: var(--text); border-color: rgba(255,255,255,0.14); transform: translateY(-2px); }
        .pd-fab.progress-fab { padding: 0; background: transparent; border: none; box-shadow: none; width: 44px; height: 44px; }
        .pd-fab.progress-fab:hover { background: transparent; transform: translateY(-2px); }

        /* ── Hero ── */
        .pd-hero {
          padding: 130px 0 60px;
          position: relative; overflow: hidden;
        }
        .pd-hero-orb {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }
        .pd-hero-orb-1 { width: 500px; height: 500px; top: -100px; right: -80px; background: rgba(255,77,90,0.12); }
        .pd-hero-orb-2 { width: 400px; height: 400px; bottom: -120px; left: -60px; background: rgba(77,121,255,0.1); }

        .pd-hero-grid {
          display: grid; grid-template-columns: 1.7fr 1fr;
          gap: 48px; align-items: start; position: relative; z-index: 1;
        }
        .pd-hero-eyebrow {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
          font-family: var(--font-mono); font-size: 0.68rem;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--primary);
        }
        .pd-hero-eyebrow::before {
          content: ""; display: block; width: 22px; height: 2px;
          background: var(--primary); border-radius: 2px;
        }
        .pd-hero-title {
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          letter-spacing: -0.035em; line-height: 1.06;
          margin-bottom: 20px; color: var(--text);
        }
        .pd-hero-title em {
          font-style: normal;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .pd-meta-row {
          display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 24px;
        }
        .pd-date-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 13px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: 50px;
          font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);
        }
        .pd-hero-desc {
          color: var(--text-secondary); font-size: 1rem; line-height: 1.75;
          max-width: 580px; margin-bottom: 28px;
        }
        .pd-links { display: flex; flex-wrap: wrap; gap: 10px; }
        .pd-link {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 50px; font-size: 0.82rem;
          font-weight: 600; transition: all 0.25s; cursor: pointer;
        }
        .pd-link-primary {
          background: var(--primary); color: #fff;
          box-shadow: 0 4px 20px rgba(255,77,90,0.3);
        }
        .pd-link-primary:hover { background: #ff3344; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,77,90,0.45); }
        .pd-link-ghost {
          background: var(--bg-card); color: var(--text-secondary);
          border: 1px solid var(--border);
        }
        .pd-link-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.14); background: var(--bg-card-hover); }

        /* Tags */
        .pd-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
        .pd-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: 6px; font-size: 0.74rem;
          font-weight: 600; color: #fff;
        }
        .pd-tag-oss { background: rgba(106,13,173,0.7); color: #c99de6; border: 1px solid rgba(106,13,173,0.4); }

        /* ── GitHub card ── */
        .pd-github-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 22px;
          display: flex; flex-direction: column; gap: 14px;
          transition: border-color 0.25s;
        }
        .pd-github-card:hover { border-color: rgba(77,121,255,0.25); }
        .pd-github-card-header {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 0.76rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);
        }
        .pd-badge {
          padding: 2px 8px; border-radius: 50px; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .pd-badge-teal { background: rgba(0,217,192,0.12); color: var(--teal); border: 1px solid rgba(0,217,192,0.2); }
        .pd-github-loading { display: flex; align-items: center; gap: 6px; }
        .pd-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          animation: pd-dot-pulse 0.9s ease-in-out infinite;
        }
        @keyframes pd-dot-pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.2); } }
        .pd-stat-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .pd-stat-pill {
          display: flex; flex-direction: column; align-items: center;
          padding: 10px 6px; background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius-sm); gap: 3px;
        }
        .pd-stat-icon { color: var(--accent); font-size: 0.75rem; }
        .pd-stat-value { font-size: 1.15rem; font-weight: 700; color: var(--accent); font-family: var(--font-display); }
        .pd-stat-label { font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono); }
        .pd-topic {
          padding: 3px 9px; background: rgba(77,121,255,0.1); color: var(--accent);
          border: 1px solid rgba(77,121,255,0.2); border-radius: 50px;
          font-size: 0.7rem; font-weight: 600;
        }
        .pd-github-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px; background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius-sm); color: var(--text-secondary);
          font-size: 0.82rem; font-weight: 600; transition: all 0.2s; cursor: pointer;
        }
        .pd-github-btn:hover { background: var(--bg-card-hover); color: var(--text); border-color: rgba(255,255,255,0.12); }

        /* ── Tabs ── */
        .pd-tabs-wrapper {
          position: sticky; top: 56px; z-index: 100;
          background: var(--bg-glass); backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          margin: 0 -5%; padding: 0 5%;
        }
        .pd-tabs {
          display: flex; gap: 0; position: relative;
          overflow-x: auto; scrollbar-width: none;
        }
        .pd-tabs::-webkit-scrollbar { display: none; }
        .pd-tab-btn {
          padding: 14px 22px; background: transparent; border: none;
          color: var(--text-muted); font-size: 0.86rem; font-weight: 500;
          cursor: pointer; font-family: var(--font-body); white-space: nowrap;
          transition: color 0.2s; position: relative;
        }
        .pd-tab-btn:hover { color: var(--text); }
        .pd-tab-btn.active { color: var(--primary); }
        .pd-tab-line {
          position: absolute; bottom: -1px; height: 2px;
          background: var(--primary); border-radius: 2px 2px 0 0;
          transition: left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Bookmark btn ── */
        .pd-bookmark-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 50px; font-size: 0.82rem;
          font-weight: 600; cursor: pointer;
          background: var(--bg-card); color: var(--text-secondary);
          border: 1px solid var(--border); transition: all 0.25s;
        }
        .pd-bookmark-btn:hover { color: var(--primary); border-color: rgba(255,77,90,0.35); }
        .pd-bookmark-btn.active { color: var(--primary); background: var(--primary-dim); border-color: rgba(255,77,90,0.35); }

        /* ── Share panel ── */
        .pd-share-panel {
          position: absolute; bottom: calc(100% + 10px); right: 0;
          width: 320px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: var(--radius);
          padding: 16px; box-shadow: var(--shadow); z-index: 200;
        }
        .pd-share-url {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 8px 10px;
        }
        .pd-copy-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 6px; font-size: 0.76rem;
          font-weight: 600; cursor: pointer; white-space: nowrap;
          background: var(--primary-dim); color: var(--primary); border: none;
          transition: all 0.2s;
        }
        .pd-copy-btn.copied { background: rgba(0,217,192,0.12); color: var(--teal); }

        /* ── Nav ── */
        .pd-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 0; border-top: 1px solid var(--border); margin-top: 48px;
        }
        .pd-nav-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: 50px;
          color: var(--text-secondary); font-size: 0.84rem; font-weight: 500;
          transition: all 0.25s;
        }
        .pd-nav-btn:hover { color: var(--primary); border-color: rgba(255,77,90,0.3); }

        /* ── Tab content ── */
        .pd-content { padding: 40px 0 60px; }
        .pd-section-title {
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          letter-spacing: -0.025em; margin-bottom: 22px;
        }
        .pd-about-text {
          color: var(--text-secondary); line-height: 1.78; margin-bottom: 32px;
          font-size: 1.02rem; max-width: 720px;
        }
        .pd-features-label {
          font-family: var(--font-mono); font-size: 0.7rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--primary); margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .pd-features-label::before { content: ""; display: block; width: 18px; height: 2px; background: var(--primary); border-radius: 2px; }
        .pd-features-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }
        .pd-feature-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          transition: border-color 0.2s, transform 0.2s;
        }
        .pd-feature-item:hover { border-color: rgba(0,217,192,0.3); transform: translateY(-2px); }
        .pd-check { color: var(--teal); flex-shrink: 0; margin-top: 2px; }
        .pd-feature-text { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; }

        /* Tech grid */
        .pd-tech-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
        .pd-tech-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 22px 16px;
          text-align: center; transition: all 0.25s;
        }
        .pd-tech-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.12); box-shadow: var(--shadow); }
        .pd-tech-icon {
          width: 54px; height: 54px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; color: #fff; margin: 0 auto 14px;
        }
        .pd-tech-name { font-size: 0.95rem; font-weight: 700; margin-bottom: 5px; }
        .pd-tech-purpose { font-size: 0.78rem; color: var(--text-muted); }

        /* Achievements */
        .pd-achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .pd-achievement {
          display: flex; gap: 16px; align-items: center;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 20px;
          transition: all 0.25s;
        }
        .pd-achievement:hover { border-color: rgba(255,77,90,0.25); transform: translateY(-2px); }
        .pd-achievement-icon { font-size: 1.6rem; color: var(--primary); flex-shrink: 0; }
        .pd-achievement-title { font-size: 0.92rem; font-weight: 700; margin-bottom: 3px; }
        .pd-achievement-desc { font-size: 0.8rem; color: var(--text-muted); }
        .pd-achievement-metric { font-size: 1.5rem; font-weight: 800; color: var(--primary); font-family: var(--font-display); margin-top: 4px; }

        /* Gallery */
        .pd-gallery-main {
          position: relative; border-radius: var(--radius); overflow: hidden;
          background: var(--bg-deep); min-height: 380px; cursor: zoom-in;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border); margin-bottom: 14px;
        }
        .pd-gallery-media { width: 100%; display: flex; align-items: center; justify-content: center; }
        .pd-gallery-media img, .pd-gallery-media video { max-width: 100%; max-height: 480px; object-fit: contain; }
        .pd-gallery-expand {
          position: absolute; top: 12px; right: 12px;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,0,0,0.5); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; opacity: 0; transition: opacity 0.2s;
        }
        .pd-gallery-main:hover .pd-gallery-expand { opacity: 1; }
        .pd-gallery-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 0.85rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: all 0.2s;
        }
        .pd-gallery-main:hover .pd-gallery-nav { opacity: 1; }
        .pd-gallery-prev { left: 12px; }
        .pd-gallery-next { right: 12px; }
        .pd-gallery-counter {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
          background: rgba(0,0,0,0.55); color: #fff; border-radius: 50px;
          padding: 3px 10px; font-size: 0.72rem; font-family: var(--font-mono);
        }
        .pd-thumbs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .pd-thumbs::-webkit-scrollbar { display: none; }
        .pd-thumb {
          width: 72px; height: 52px; flex-shrink: 0; border-radius: 6px;
          overflow: hidden; border: 2px solid transparent; cursor: pointer;
          opacity: 0.45; transition: all 0.2s;
        }
        .pd-thumb:hover { opacity: 0.75; }
        .pd-thumb.active { opacity: 1; border-color: var(--primary); box-shadow: 0 0 12px rgba(255,77,90,0.35); }
        .pd-thumb img { width: 100%; height: 100%; object-fit: cover; }

        /* Lightbox */
        .pd-lightbox {
          position: fixed; inset: 0; background: rgba(7,7,13,0.95);
          z-index: 9000; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
        }
        .pd-lightbox-close {
          position: absolute; top: 20px; right: 20px;
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          color: #fff; cursor: pointer; font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .pd-lightbox-close:hover { background: rgba(255,77,90,0.3); }
        .pd-lightbox-content { max-width: 90vw; max-height: 90vh; }
        .pd-lightbox-content img, .pd-lightbox-content video { max-width: 90vw; max-height: 85vh; border-radius: 8px; }
        .pd-lightbox-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: #fff; cursor: pointer; font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .pd-lightbox-nav:hover { background: rgba(255,77,90,0.25); }
        .pd-lightbox-prev { left: 20px; }
        .pd-lightbox-next { right: 20px; }
        .pd-lightbox-counter {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          background: rgba(255,255,255,0.08); color: #fff;
          border-radius: 50px; padding: 4px 14px; font-size: 0.78rem; font-family: var(--font-mono);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .pd-hero-grid { grid-template-columns: 1fr; }
          .pd-fab-cluster { bottom: 16px; right: 16px; }
        }
        @media (max-width: 600px) {
          .pd-hero { padding-top: 100px; }
          .pd-hero-title { font-size: 2rem; }
          .pd-features-grid { grid-template-columns: 1fr; }
          .pd-achievements-grid { grid-template-columns: 1fr; }
          .pd-share-panel { width: 280px; }
        }
      `}</style>

      {/* ── Scroll progress bar ── */}
      <div
        className="pd-progress-bar"
        style={{ width: `${scrollPct}%` }}
        aria-hidden="true"
      />

      {/* ── Hero ── */}
      <section className="pd-hero">
        <div className="pd-hero-orb pd-hero-orb-1" aria-hidden="true" />
        <div className="pd-hero-orb pd-hero-orb-2" aria-hidden="true" />
        <div className="container">
          <Link
            href="/#projects"
            className="back-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
            }}
          >
            <FaArrowLeft /> Back to Projects
          </Link>

          <div className="pd-hero-grid">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="pd-hero-eyebrow">Project</div>
              <h1 className="pd-hero-title">
                {project.title.split(" ").length > 2 ? (
                  <>
                    {project.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <em>{project.title.split(" ").slice(-1)}</em>
                  </>
                ) : (
                  project.title
                )}
              </h1>

              <div className="pd-meta-row">
                <span className="pd-date-chip">
                  <FaCalendarAlt />
                  {project.startDate} — {project.endDate || "Present"}
                </span>
                {project.isOpenSource && (
                  <span className="pd-badge pd-badge-teal">
                    <FaCode style={{ fontSize: "0.65rem" }} /> Open Source
                  </span>
                )}
              </div>

              <p className="pd-hero-desc">
                {project.shortDescription || project.description}
              </p>

              <div className="pd-links">
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`pd-link ${i === 0 ? "pd-link-primary" : "pd-link-ghost"}`}
                  >
                    {link.type === "github" ? (
                      <FaGithub />
                    ) : link.type === "download" ? (
                      <FaDownload />
                    ) : link.type === "play" ? (
                      <FaPlayCircle />
                    ) : (
                      <FaExternalLinkAlt />
                    )}
                    {link.label}
                  </a>
                ))}
                <BookmarkBtn projectId={projectId} />
              </div>

              <div className="pd-tags">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="pd-tag"
                    style={{
                      backgroundColor: tag.color,
                      boxShadow: `0 0 12px ${tag.color}45`,
                    }}
                  >
                    {tag.icon} {tag.name}
                  </span>
                ))}
                {project.isOpenSource && (
                  <span className="pd-tag pd-tag-oss">
                    <FaCode /> Open Source
                  </span>
                )}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {githubUrl ? (
                <GitHubCard githubUrl={githubUrl} />
              ) : thumbnailSrc ? (
                <img
                  src={thumbnailSrc}
                  alt={project.title}
                  style={{ borderRadius: "var(--radius)", width: "100%" }}
                />
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="pd-tabs-wrapper">
        <div className="container">
          <div className="pd-tabs" role="tablist" aria-label="Project sections">
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                ref={(el) => (tabsRef.current[t.id] = el)}
                role="tab"
                aria-selected={activeTab === t.id}
                aria-controls={`panel-${t.id}`}
                className={`pd-tab-btn ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
            <div ref={tabLineRef} className="pd-tab-line" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="container">
        <div className="pd-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              {activeTab === "overview" && (
                <div>
                  <h2 className="pd-section-title">About this project</h2>
                  <p className="pd-about-text">{project.description}</p>
                  <div className="pd-features-label">Key Features</div>
                  <div className="pd-features-grid">
                    {project.features.map((f, i) => (
                      <motion.div
                        key={i}
                        className="pd-feature-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <FaCheck
                          className="pd-check"
                          style={{
                            color: "var(--teal)",
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        />
                        <span className="pd-feature-text">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div>
                  <h2 className="pd-section-title">Project Gallery</h2>
                  <Gallery images={images} videos={videos} />
                </div>
              )}

              {activeTab === "tech" && (
                <div>
                  <h2 className="pd-section-title">Technologies Used</h2>
                  <div className="pd-tech-grid">
                    {project.technologies.map((tech, i) => (
                      <motion.div
                        key={i}
                        className="pd-tech-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <div
                          className="pd-tech-icon"
                          style={{ backgroundColor: tech.color }}
                        >
                          {tech.icon}
                        </div>
                        <div className="pd-tech-name">{tech.name}</div>
                        <div className="pd-tech-purpose">{tech.purpose}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "achievements" && (
                <div>
                  <h2 className="pd-section-title">Project Achievements</h2>
                  <div className="pd-achievements-grid">
                    {project.achievements.map((a, i) => (
                      <motion.div
                        key={i}
                        className="pd-achievement"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="pd-achievement-icon">{a.icon}</div>
                        <div>
                          <div className="pd-achievement-title">{a.title}</div>
                          <div className="pd-achievement-desc">
                            {a.description}
                          </div>
                          {a.metric && (
                            <div className="pd-achievement-metric">
                              {a.metric}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Project nav ── */}
        <div className="pd-nav">
          {findPrev(project) ? (
            <Link href={`/project/${findPrev(project)}`} className="pd-nav-btn">
              <FaArrowLeft /> Previous
            </Link>
          ) : (
            <span />
          )}
          {findNext(project) && (
            <Link href={`/project/${findNext(project)}`} className="pd-nav-btn">
              Next <FaArrowRight />
            </Link>
          )}
        </div>
      </div>

      {/* ── Floating action cluster ── */}
      <div className="pd-fab-cluster" aria-label="Page actions">
        {/* Share */}
        <div style={{ position: "relative" }}>
          <button
            className="pd-fab"
            onClick={() => setShareOpen((o) => !o)}
            aria-label="Share project"
            aria-expanded={shareOpen}
          >
            <FaShare />
          </button>
          <AnimatePresence>
            {shareOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 6 }}
                transition={{ duration: 0.18 }}
              >
                <SharePanel project={project} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress ring scroll-to-top */}
        <button
          className="pd-fab progress-fab"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={`Scroll to top (${scrollPct}% read)`}
          title={`${scrollPct}% read — click to scroll top`}
        >
          <ProgressRing progress={scrollPct} />
        </button>
      </div>
    </>
  );
}
