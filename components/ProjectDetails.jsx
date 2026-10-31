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
  FaDownload,
  FaPlayCircle,
  FaExclamationCircle,
  FaStar,
  FaCodeBranch,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { projects } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";
import { useGitHubData } from "@/hooks/useGitHubData";
import { useRobloxGameStats } from "@/hooks/useRobloxStats";
import { FloatingCluster } from "./FloatingCluster";
import { useUrlState } from "@/hooks/useUrlState";
import { formatNumber } from "@/lib/format";
import { MarkLine, MarkSolid } from "./brand/Mark";
import ProjectSignature, { isStudioProject } from "./brand/ProjectSignature";

/* ─── helpers ───────────────────────────────────────── */
function findPrev(project) {
  return projects[projects.indexOf(project) - 1]?.id;
}
function findNext(project) {
  return projects[projects.indexOf(project) + 1]?.id;
}

// Achievement titles that map 1:1 onto a live Roblox game-stats field.
// "Active Players" is deliberately excluded — it tracks peak concurrent
// users, which the live API can't report (only current concurrent).
const LIVE_ACHIEVEMENT_FIELDS = {
  "Total Visits": "visits",
  Favorites: "favorites",
  "User Rating": "likeRatio",
  "User Satisfaction": "likeRatio",
};

function formatLiveMetric(field, value) {
  return field === "likeRatio" ? `${value}%` : `${formatNumber(value)}+`;
}

/* ─── sub-components ─────────────────────────────────── */
// Languages are ranked by share and shaded on a neutral ramp instead of
// GitHub's rainbow, so the page keeps a single accent.
function LanguageBar({ langs }) {
  if (!langs || Object.keys(langs).length === 0) return null;
  const total = Object.values(langs).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  return (
    <div className="pd-langs">
      <div className="pd-lang-bar" aria-hidden="true">
        {sorted.map(([lang, bytes], i) => (
          <span
            key={lang}
            className={`pd-lang-seg pd-lang-${i}`}
            title={`${lang} ${((bytes / total) * 100).toFixed(1)}%`}
            style={{ flex: bytes / total }}
          />
        ))}
      </div>
      <ul className="pd-lang-list">
        {sorted.map(([lang, bytes], i) => (
          <li key={lang}>
            <span className={`pd-lang-key pd-lang-${i}`} aria-hidden="true" />
            <span>{lang}</span>
            <span className="mono">{((bytes / total) * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
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
          value: formatNumber(repo.stargazers_count),
          label: "Stars",
        },
        {
          icon: <FaCodeBranch />,
          value: formatNumber(repo.forks_count),
          label: "Forks",
        },
        {
          icon: <FaEye />,
          value: formatNumber(repo.watchers_count),
          label: "Watchers",
        },
        {
          icon: <FaExclamationCircle />,
          value: formatNumber(repo.open_issues_count),
          label: "Issues",
        },
      ]
    : [];

  return (
    <div className="pd-github-card">
      <div className="pd-github-card-header">
        <FaGithub aria-hidden="true" />
        <span>Repository</span>
        {repo?.private === false && (
          <span className="pd-badge pd-badge-teal">Public</span>
        )}
      </div>

      {loading && (
        <div className="pd-github-loading" role="status">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="pd-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
          <span className="pd-muted">Fetching repo…</span>
        </div>
      )}

      {error && (
        <p className="pd-muted">
          Couldn't load repo stats right now.{" "}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="article-a"
          >
            View the repository on GitHub
          </a>
          .
        </p>
      )}

      {repo && !loading && (
        <>
          {repo.description && (
            <p className="pd-repo-desc">{repo.description}</p>
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
            <div className="pd-topics">
              {repo.topics.map((t) => (
                <span key={t} className="pd-topic">
                  {t}
                </span>
              ))}
            </div>
          )}
          {repo.license && (
            <p className="pd-license mono">{repo.license.spdx_id} license</p>
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

/* ── Gallery lightbox ──────────── */
function Gallery({ images = [], videos = [], projectTitle }) {
  const media = [
    ...images.map((src) => ({ type: "image", src })),
    ...videos.map((src) => ({ type: "video", src })),
  ];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);

  const go = useCallback(
    (dir) => {
      setActive((i) => (i + dir + media.length) % media.length);
    },
    [media.length]
  );

  const openLightbox = (e) => {
    openerRef.current = e.currentTarget;
    setLightbox(true);
  };

  useEffect(() => {
    if (!lightbox) return;
    const opener = openerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handler = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setLightbox(false);
      // Keep Tab inside the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          "button, video[controls]"
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [lightbox, go]);

  if (media.length === 0)
    return (
      <p className="pd-empty">
        No media available yet. Check the project links above.
      </p>
    );
  const cur = media[active];
  const mediaLabel = (i) =>
    `${projectTitle} — ${media[i].type === "video" ? "video" : "screenshot"} ${i + 1} of ${media.length}`;

  return (
    <>
      {/* Main viewer */}
      <div className="pd-gallery-main">
        <div className="pd-gallery-media">
          {cur.type === "image" ? (
            <button
              type="button"
              className="pd-gallery-open"
              onClick={openLightbox}
              aria-label={`Open ${mediaLabel(active)} fullscreen`}
            >
              <img
                src={cur.src}
                alt={mediaLabel(active)}
                width={1280}
                height={720}
              />
            </button>
          ) : (
            <video
              src={cur.src}
              controls
              preload="metadata"
              aria-label={mediaLabel(active)}
            />
          )}
        </div>
        <button
          type="button"
          className="pd-gallery-expand"
          onClick={openLightbox}
          aria-label="Open fullscreen"
        >
          <FaExpand aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pd-gallery-nav pd-gallery-prev"
          onClick={() => go(-1)}
          aria-label="Previous media"
        >
          <FaChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pd-gallery-nav pd-gallery-next"
          onClick={() => go(1)}
          aria-label="Next media"
        >
          <FaChevronRight aria-hidden="true" />
        </button>
        <div className="pd-gallery-counter" aria-live="polite">
          {active + 1} / {media.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="pd-thumbs">
        {media.map((m, i) => (
          <button
            type="button"
            key={m.src}
            className={`pd-thumb ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Show ${mediaLabel(i)}`}
            aria-current={i === active ? "true" : undefined}
          >
            {m.type === "image" ? (
              <img
                src={m.src}
                alt=""
                width={72}
                height={52}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <video
                  src={m.src}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  tabIndex={-1}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <FaPlayCircle aria-hidden="true" className="pd-thumb-play" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            ref={dialogRef}
            className="pd-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${projectTitle} gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              ref={closeRef}
              type="button"
              className="pd-lightbox-close"
              onClick={() => setLightbox(false)}
              aria-label="Close gallery"
            >
              <FaTimes aria-hidden="true" />
            </button>
            <button
              type="button"
              className="pd-lightbox-nav pd-lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous media"
            >
              <FaChevronLeft aria-hidden="true" />
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
                <img
                  src={cur.src}
                  alt={mediaLabel(active)}
                  width={1920}
                  height={1080}
                />
              ) : (
                <video
                  src={cur.src}
                  controls
                  preload="metadata"
                  aria-label={mediaLabel(active)}
                />
              )}
            </motion.div>
            <button
              type="button"
              className="pd-lightbox-nav pd-lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next media"
            >
              <FaChevronRight aria-hidden="true" />
            </button>
            <div className="pd-lightbox-counter" aria-live="polite">
              {active + 1} / {media.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Bookmark button with Anti-Spam Webhook ─────────── */
function BookmarkBtn({ projectId, projectTitle }) {
  const [saved, setSaved] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
  const COOLDOWN_TIME = 60 * 1000; // 1 minute in milliseconds

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(
        localStorage.getItem("pd-bookmarks") || "[]"
      );
      setSaved(bookmarks.includes(projectId));
    } catch {}
  }, [projectId]);

  const sendDiscordNotification = async () => {
    if (!DISCORD_WEBHOOK_URL) return;

    // --- Persistent Cooldown Check ---
    const lastSentKey = `webhook-sent-${projectId}`;
    const lastSent = localStorage.getItem(lastSentKey);
    const now = Date.now();

    if (lastSent && now - parseInt(lastSent) < COOLDOWN_TIME) {
      console.log("Webhook is on cooldown for this project.");
      return;
    }

    // Only the project is reported — no device/browser details about the visitor
    const embed = {
      title: "❤️ Project Liked!",
      description: `A user liked **${projectTitle}**`,
      color: 0x00ffcc,
      fields: [{ name: "Project ID", value: projectId, inline: true }],
      footer: { text: window.location.href },
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (res.ok) {
        localStorage.setItem(lastSentKey, now.toString());
      }
    } catch (error) {
      console.error("Webhook failed:", error);
    }
  };

  const toggle = async () => {
    if (isCooldown) return; // Prevent rapid-fire clicks

    try {
      const bookmarks = JSON.parse(
        localStorage.getItem("pd-bookmarks") || "[]"
      );
      const isCurrentlySaved = bookmarks.includes(projectId);

      let next;
      if (isCurrentlySaved) {
        next = bookmarks.filter((id) => id !== projectId);
      } else {
        next = [...bookmarks, projectId];

        // Trigger Cooldown state
        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), 3000); // 3s UI lock

        // Attempt to send webhook
        await sendDiscordNotification();
      }

      localStorage.setItem("pd-bookmarks", JSON.stringify(next));
      setSaved(!isCurrentlySaved);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.button
      className={`btn btn-outline pd-bookmark-btn ${saved ? "active" : ""} ${isCooldown ? "loading" : ""}`}
      onClick={toggle}
      disabled={isCooldown}
      style={{
        cursor: isCooldown ? "not-allowed" : "pointer",
        opacity: isCooldown ? 0.7 : 1,
      }}
      whileTap={{ scale: isCooldown ? 1 : 0.88 }}
      aria-pressed={saved}
      aria-label={saved ? "Unlike project" : "Like project"}
    >
      <motion.span
        animate={{ scale: saved && !isCooldown ? [1, 1.35, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {saved ? (
          <FaHeart aria-hidden="true" />
        ) : (
          <FaRegHeart aria-hidden="true" />
        )}
      </motion.span>
      {isCooldown ? "Processing…" : saved ? "Liked" : "Like"}
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
  const robloxLink = project?.links?.find(
    (l) =>
      (l.type === "play" || l.type === "live") &&
      l.url?.includes("roblox.com/games/")
  );
  const { stats: robloxStats } = useRobloxGameStats(robloxLink?.url);
  // Active tab lives in the URL (?tab=gallery) so each tab can be linked to
  const [tabParam, setActiveTab] = useUrlState("tab", "overview");
  const tabLineRef = useRef(null);
  const tabsRef = useRef({});
  const mainRef = useRef(null);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "gallery", label: `Gallery (${images.length + videos.length})` },
    { id: "tech", label: "Technologies" },
    { id: "achievements", label: "Achievements" },
  ];
  const activeTab = tabs.some((t) => t.id === tabParam) ? tabParam : "overview";

  // Arrow/Home/End keys move between tabs (WAI-ARIA tabs pattern)
  const onTabKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === activeTab);
    let next = null;
    if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
    if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === "Home") next = tabs[0];
    if (e.key === "End") next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    setActiveTab(next.id);
    tabsRef.current[next.id]?.focus();
  };

  // Tab indicator line — re-measured when the tab bar resizes
  useEffect(() => {
    const el = tabsRef.current[activeTab];
    const line = tabLineRef.current;
    if (!el || !line) return;
    const place = () => {
      line.style.left = `${el.offsetLeft}px`;
      line.style.width = `${el.offsetWidth}px`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [activeTab]);

  if (!project) {
    return (
      <div className="section pd-notfound">
        <div className="container">
          <span className="label">404</span>
          <h1 className="h-display">Project not found.</h1>
          <Link href="/" className="btn">
            <FaArrowLeft aria-hidden="true" /> Back to Home
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
      {/* ── Hero · tier follows who signs the project ── */}
      <section
        className={`pd-hero ${isStudioProject(project) ? "pd-hero--studio" : "pd-hero--person"}`}
      >
        {isStudioProject(project) ? (
          <MarkSolid className="pd-hero-watermark" />
        ) : (
          <MarkLine className="pd-hero-watermark" weight={6} />
        )}
        <div className="container">
          <Link href="/#projects" className="back-btn">
            <FaArrowLeft aria-hidden="true" /> Back to Projects
          </Link>

          <div className="pd-hero-grid">
            <motion.div
              className="pd-hero-main"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="pd-meta-row label">
                <span>
                  {project.startDate} — {project.endDate || "Present"}
                </span>
                {project.isOpenSource && <span>Open source</span>}
              </div>

              {/* --fit = longest word, so the headline scales to keep
                  single words like GOALMAGEDDON on one line */}
              <h1
                className="pd-hero-title"
                style={{
                  "--fit": Math.max(
                    ...project.title.split(/\s+/).map((w) => w.length)
                  ),
                }}
              >
                {project.title}
              </h1>

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
                    className={`btn ${i === 0 ? "" : "btn-outline"}`}
                  >
                    {link.type === "github" ? (
                      <FaGithub aria-hidden="true" />
                    ) : link.type === "download" ? (
                      <FaDownload aria-hidden="true" />
                    ) : link.type === "play" ? (
                      <FaPlayCircle aria-hidden="true" />
                    ) : (
                      <FaExternalLinkAlt aria-hidden="true" />
                    )}
                    {link.label}
                  </a>
                ))}
                <BookmarkBtn
                  projectId={projectId}
                  projectTitle={project.title}
                />
              </div>

              <ul className="pd-tags" aria-label="Tags">
                {project.tags.map((tag) => (
                  <li key={tag.name} className="pd-tag">
                    {tag.icon}
                    {tag.name}
                  </li>
                ))}
              </ul>

              <div className="pd-credit">
                <ProjectSignature project={project} />
              </div>
            </motion.div>

            <motion.div
              className="pd-hero-side"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {githubUrl ? (
                <GitHubCard githubUrl={githubUrl} />
              ) : thumbnailSrc ? (
                <img
                  className="pd-hero-thumb"
                  src={thumbnailSrc}
                  alt={project.title}
                  width={1280}
                  height={720}
                  fetchPriority="high"
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
                type="button"
                id={`tab-${t.id}`}
                ref={(el) => (tabsRef.current[t.id] = el)}
                role="tab"
                aria-selected={activeTab === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={activeTab === t.id ? 0 : -1}
                className={`pd-tab-btn ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
                onKeyDown={onTabKeyDown}
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
              tabIndex={0}
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
                        <span className="pd-feature-n mono" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="pd-feature-text">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div>
                  <h2 className="pd-section-title">Project Gallery</h2>
                  <Gallery
                    images={images}
                    videos={videos}
                    projectTitle={project.title}
                  />
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
                        <div className="pd-tech-icon" aria-hidden="true">
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
                    {project.achievements.map((a, i) => {
                      // A live value of 0 means the game is banned/delisted
                      // (Roblox's API zeroes those out) rather than a real
                      // stat, so treat it as unavailable and keep the
                      // static fallback instead of overwriting real history.
                      const liveField = LIVE_ACHIEVEMENT_FIELDS[a.title];
                      const liveValue =
                        liveField && robloxStats?.[liveField] > 0
                          ? robloxStats[liveField]
                          : null;
                      const displayMetric =
                        liveValue != null
                          ? formatLiveMetric(liveField, liveValue)
                          : a.metric;

                      return (
                        <motion.div
                          key={i}
                          className="pd-achievement"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <div className="pd-achievement-icon">{a.icon}</div>
                          <div>
                            <div className="pd-achievement-title">
                              {a.title}
                            </div>
                            <div className="pd-achievement-desc">
                              {a.description}
                            </div>
                            {displayMetric && (
                              <div className="pd-achievement-metric">
                                {displayMetric}
                                {liveValue != null && (
                                  <span className="pd-live-badge">Live</span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Project nav ── */}
        <div className="pd-nav">
          {findPrev(project) ? (
            <Link
              href={`/projects/${findPrev(project)}`}
              className="pd-nav-btn"
            >
              <FaArrowLeft aria-hidden="true" /> Previous
            </Link>
          ) : (
            <span />
          )}
          {findNext(project) && (
            <Link
              href={`/projects/${findNext(project)}`}
              className="pd-nav-btn"
            >
              Next <FaArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      <FloatingCluster project={project} />
    </>
  );
}
