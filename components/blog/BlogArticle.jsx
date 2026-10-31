"use client";
// components/blog/BlogArticle.jsx
// Client shell — handles all interactive UI.
// The rendered MDX arrives as `children` from the server page
// (ArticleRenderer is an async Server Component and can't be imported here).
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GithubSlugger from "github-slugger";
import {
  FaArrowLeft,
  FaArrowRight,
  FaGithub,
  FaLink,
  FaCheck,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FloatingCluster } from "../FloatingCluster";
import { formatDate } from "@/lib/format";
import { scrollBehavior } from "@/lib/motion";
import { MarkLine } from "../brand/Mark";

/* ── Table of Contents ────────────────────────────── */
function TableOfContents({ headings, activeId }) {
  if (!headings.length) return null;
  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="label sidebar-card-label">On this page</div>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className={`toc-item toc-level-${h.level}`}>
            <a
              href={`#${h.id}`}
              className={`toc-link ${activeId === h.id ? "toc-link--active" : ""}`}
              aria-current={activeId === h.id ? "location" : undefined}
              onClick={(e) => {
                const el = document.getElementById(h.id);
                if (!el) return;
                e.preventDefault();
                el.scrollIntoView({
                  behavior: scrollBehavior(),
                  block: "start",
                });
                history.replaceState(history.state, "", `#${h.id}`);
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
// Ids must match rehype-slug in ArticleRenderer: same slugger, fed every
// heading (h1–h6) in document order so duplicate counters line up.
function extractHeadings(content) {
  const slugger = new GithubSlugger();
  const headings = [];
  let inFence = false;
  for (const line of content.split("\n")) {
    // Skip fenced code blocks — "# comment" lines there aren't headings
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [label](url) → label
      .replace(/[*_`]/g, "");
    const id = slugger.slug(text);
    if (level <= 3) headings.push({ level, text, id });
  }
  return headings;
}

/* ── Copy link button ─────────────────────────────── */
function CopyLinkButton({ url }) {
  // "idle" | "copied" | "failed"
  const [copyState, setCopyState] = useState("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };
  return (
    <>
      <button
        type="button"
        className="icon-btn"
        aria-label="Copy link to this article"
        onClick={copy}
      >
        {copyState === "copied" ? (
          <FaCheck aria-hidden="true" />
        ) : (
          <FaLink aria-hidden="true" />
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copyState === "copied"
          ? "Link copied to clipboard"
          : copyState === "failed"
            ? "Couldn't copy the link. Copy it from the address bar."
            : ""}
      </span>
    </>
  );
}

/* ── Main export ──────────────────────────────────── */
export default function BlogArticle({ post, children }) {
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
      <article className="article-page">
        {/* ── Hero ── */}
        <header className="article-hero">
          <div className="container article-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <Link href="/blog" className="article-back label">
                <FaArrowLeft aria-hidden="true" /> All Articles
              </Link>

              <div className="article-meta-row label">
                <time dateTime={date}>{formatDate(date)}</time>
                <span>{readingTime}</span>
              </div>

              <h1 className="article-title">{title}</h1>
              <p className="article-lead">{description}</p>

              <ul className="article-tags" aria-label="Tags">
                {tags.map((t) => (
                  <li key={t} className="blog-tag-chip">
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          {cover && (
            <div className="container">
              <div className="article-cover">
                <img
                  src={`/blog/covers/${cover}`}
                  alt=""
                  width={1200}
                  height={630}
                  fetchPriority="high"
                />
              </div>
            </div>
          )}
        </header>

        {/* ── Body: content + sidebar ── */}
        <div className="container article-layout">
          <div ref={contentRef} className="article-content">
            {children}

            <div className="article-share">
              <span className="label">Share</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label="Share on X (Twitter)"
              >
                <FaXTwitter aria-hidden="true" />
              </a>
              <CopyLinkButton url={shareUrl} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar">
            {headings.length > 0 && (
              <div className="sidebar-block">
                <TableOfContents headings={headings} activeId={activeId} />
              </div>
            )}

            <div className="sidebar-block sidebar-author">
              <div className="sidebar-author-avatar" aria-hidden="true">
                <MarkLine weight={22} />
              </div>
              <div>
                <div className="sidebar-author-name">MattQ</div>
                <div className="sidebar-author-handle mono">@mattqdev</div>
              </div>
              <p className="sidebar-author-bio">
                Developer &amp; designer: Roblox games, web tools, OSS.
              </p>
              <div className="sidebar-author-links">
                <a
                  href="https://github.com/mattqdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                  aria-label="MattQ on GitHub"
                >
                  <FaGithub aria-hidden="true" />
                </a>
                <a
                  href="https://x.com/mattqdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                  aria-label="MattQ on X (Twitter)"
                >
                  <FaXTwitter aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="sidebar-block sidebar-cta">
              <span className="label">Portfolio</span>
              <p className="sidebar-cta-text">
                3M+ game visits, 6K+ plugin downloads, and open-source tools
                used by developers worldwide.
              </p>
              <Link href="/" className="btn btn-block">
                See my work <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Bottom CTA ── */}
        <section className="container article-bottom">
          <div className="blog-cta">
            <div className="blog-cta-inner">
              <span className="label">Enjoyed this article?</span>
              <h2 className="blog-cta-title">
                Check out what I&rsquo;ve built.
              </h2>
              <p className="blog-cta-text">
                From Roblox games with millions of visits to open-source
                developer tools, see everything on my portfolio.
              </p>
              <Link href="/" className="btn">
                View portfolio <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
            <MarkLine className="blog-cta-mark" weight={12} />
          </div>
        </section>

        <FloatingCluster />
      </article>
    </>
  );
}
