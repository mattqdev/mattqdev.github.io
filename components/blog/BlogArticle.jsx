"use client";
// components/blog/BlogArticle.jsx
// Client shell — handles all interactive UI.
// The actual MDX rendering is delegated to ArticleRenderer (server component).
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaGithub,
  FaLink,
  FaCheck,
  FaCalendarAlt,
  FaClock,
  FaListUl,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ArticleRenderer from "./ArticleRenderer";
import { FloatingCluster } from "../FloatingCluster";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Reading progress bar ─────────────────────────── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="reading-progress"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  );
}

/* ── Table of Contents ────────────────────────────── */
function TableOfContents({ headings, activeId }) {
  if (!headings.length) return null;
  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="sidebar-card-label" style={{ marginBottom: 12 }}>
        <FaListUl style={{ display: "inline", marginRight: 6 }} />
        On this page
      </div>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className={`toc-item toc-level-${h.level}`}>
            <a
              href={`#${h.id}`}
              className={`toc-link ${activeId === h.id ? "toc-link--active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(h.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Extract headings from markdown source ────────── */
function extractHeadings(content) {
  const lines = content.split("\n");
  const headings = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,3})\s+(.+)$/);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[*_`]/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ level, text, id });
    }
  }
  return headings;
}

/* ── Copy link button ─────────────────────────────── */
function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="article-share-btn" aria-label="Copy link" onClick={copy}>
      {copied ? <FaCheck style={{ color: "var(--teal)" }} /> : <FaLink />}
    </button>
  );
}

/* ── Main export ──────────────────────────────────── */
export default function BlogArticle({ post }) {
  const { title, description, date, tags, cover, readingTime, content, slug } =
    post;
  const shareUrl = `https://mattqdev.github.io/blog/${slug}`;
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState("");
  const contentRef = useRef(null);

  // Intersection observer to track active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );
    const els = contentRef.current?.querySelectorAll("h1,h2,h3") ?? [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ReadingProgress />

      <div className="article-page">
        {/* ── Hero ── */}
        <div
          className={`article-hero ${cover ? "article-hero--has-cover" : ""}`}
        >
          {cover && (
            <div className="article-cover">
              <img src={`/blog/covers/${cover}`} alt={title} />
              <div className="article-cover-overlay" />
            </div>
          )}

          <div className="container article-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <Link href="/blog" className="article-back">
                <FaArrowLeft /> All Articles
              </Link>

              <div className="article-meta-row">
                <span className="article-meta-item">
                  <FaCalendarAlt /> {formatDate(date)}
                </span>
                <span className="article-meta-sep">·</span>
                <span className="article-meta-item">
                  <FaClock /> {readingTime}
                </span>
              </div>

              <h1 className="article-title">{title}</h1>
              <p className="article-lead">{description}</p>

              <div className="article-tags">
                {tags.map((t) => (
                  <span key={t} className="blog-tag-chip">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Body: content + sidebar ── */}
        <div className="container article-layout">
          <motion.main
            ref={contentRef}
            className="article-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
          >
            {/* ArticleRenderer is a server component imported here — Next.js handles it */}
            <ArticleRenderer content={content} />

            {/* Share */}
            <div className="article-share">
              <span className="article-share-label">Share</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="article-share-btn"
                aria-label="Share on Twitter"
              >
                <FaXTwitter />
              </a>
              <CopyLinkButton url={shareUrl} />
            </div>
          </motion.main>

          {/* Sidebar */}
          <aside className="article-sidebar">
            {/* TOC */}
            <div className="sidebar-card">
              <TableOfContents headings={headings} activeId={activeId} />
            </div>

            {/* Author */}
            <div className="sidebar-card">
              <div className="sidebar-author-avatar">
                <img src="/icons/avatar.png" alt="MattQ" />
              </div>
              <div className="sidebar-author-name">MattQ</div>
              <div className="sidebar-author-bio">
                Developer & designer — Roblox games, web tools, OSS.
              </div>
              <div className="sidebar-author-links">
                <a
                  href="https://github.com/mattqdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-social"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://x.com/mattqdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-social"
                >
                  <FaXTwitter />
                </a>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="sidebar-card">
                <div className="sidebar-card-label">Tags</div>
                <div className="sidebar-tags">
                  {tags.map((t) => (
                    <span key={t} className="blog-tag-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio CTA */}
            <div className="sidebar-card sidebar-cta">
              <div className="sidebar-cta-emoji">🚀</div>
              <div className="sidebar-card-label">Portfolio</div>
              <p className="sidebar-cta-text">
                3M+ game visits, 6K+ plugin downloads, and open‑source tools
                used by developers worldwide.
              </p>
              <Link href="/" className="sidebar-cta-btn">
                See my work <FaArrowRight />
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Bottom CTA ── */}
        <section className="container" style={{ paddingBottom: 80 }}>
          <motion.div
            className="blog-cta"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="blog-cta-inner">
              <span className="blog-cta-label">Enjoyed this article?</span>
              <h2 className="blog-cta-title">Check out what I've built</h2>
              <p className="blog-cta-text">
                From Roblox games with millions of visits to open-source
                developer tools — see everything on my portfolio.
              </p>
              <Link href="/" className="blog-cta-btn">
                View Portfolio <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </section>

        <FloatingCluster />
      </div>
    </>
  );
}
