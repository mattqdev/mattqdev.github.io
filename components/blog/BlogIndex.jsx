"use client";
// components/blog/BlogIndex.jsx
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Pull all unique tags from posts
function allTags(posts) {
  return ["all", ...new Set(posts.flatMap((p) => p.tags))];
}

export default function BlogIndex({ posts }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const tags = useMemo(() => allTags(posts), [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (activeTag !== "all")
      result = result.filter((p) => p.tags.includes(activeTag));
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeTag, query]);

  // Featured = most recent post
  const [featured, ...rest] = filtered;

  return (
    <div className="blog-page">
      {/* ── Hero banner ── */}
      <section className="blog-hero">
        <div className="container">
          <motion.div
            className="blog-hero-inner"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="blog-hero-label">
              <span className="blog-label-dot" />
              MattQ · Writing
            </div>
            <h1 className="blog-hero-title">
              Thoughts on
              <br />
              <em>Code & Craft</em>
            </h1>
            <p className="blog-hero-sub">
              Deep dives on Roblox dev, web tooling, game design, and building
              things that actually ship.
            </p>
          </motion.div>
        </div>
        <div className="blog-hero-grid" aria-hidden="true">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="blog-grid-cell" />
          ))}
        </div>
      </section>

      <div className="container blog-body">
        {/* ── Search + filter bar ── */}
        <motion.div
          className="blog-controls"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <div className="blog-search">
            <FaSearch className="blog-search-icon" />
            <input
              type="text"
              placeholder="Search articles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="blog-search-input"
            />
          </div>
          <div className="blog-tags">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`blog-tag-btn ${activeTag === tag ? "active" : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <div className="blog-empty">
            <span>No articles found.</span>
          </div>
        ) : (
          <>
            {/* ── Featured post (first in filtered list) ── */}
            {featured && (
              <motion.div
                className="blog-featured"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
              >
                <Link
                  href={`/blog/${featured.slug}`}
                  className="blog-featured-link"
                >
                  {featured.cover && (
                    <div className="blog-featured-cover">
                      <img
                        src={`/blog/covers/${featured.cover}`}
                        alt={featured.title}
                      />
                    </div>
                  )}
                  <div className="blog-featured-body">
                    <div className="blog-featured-meta">
                      <span className="blog-featured-badge">Featured</span>
                      <span className="blog-meta-item">
                        <FaCalendarAlt /> {formatDate(featured.date)}
                      </span>
                      <span className="blog-meta-item">
                        <FaClock /> {featured.readingTime}
                      </span>
                    </div>
                    <h2 className="blog-featured-title">{featured.title}</h2>
                    <p className="blog-featured-desc">{featured.description}</p>
                    <div className="blog-featured-footer">
                      <div className="blog-post-tags">
                        {featured.tags.map((t) => (
                          <span key={t} className="blog-tag-chip">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="blog-read-link">
                        Read article <FaArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* ── Post grid ── */}
            {rest.length > 0 && (
              <motion.div
                className="blog-grid"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence mode="popLayout">
                  {rest.map((post) => (
                    <motion.article
                      key={post.slug}
                      className="blog-card"
                      variants={fadeUp}
                      layout
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="blog-card-link"
                      >
                        {post.cover ? (
                          <div className="blog-card-cover">
                            <img
                              src={`/blog/covers/${post.cover}`}
                              alt={post.title}
                            />
                          </div>
                        ) : (
                          <div className="blog-card-cover blog-card-cover--empty">
                            <div
                              className="blog-card-cover-pattern"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <div className="blog-card-body">
                          <div className="blog-card-meta">
                            <span className="blog-meta-item">
                              <FaCalendarAlt /> {formatDate(post.date)}
                            </span>
                            <span className="blog-meta-item">
                              <FaClock /> {post.readingTime}
                            </span>
                          </div>
                          <h3 className="blog-card-title">{post.title}</h3>
                          <p className="blog-card-desc">{post.description}</p>
                          <div className="blog-card-footer">
                            <div className="blog-post-tags">
                              {post.tags.slice(0, 3).map((t) => (
                                <span key={t} className="blog-tag-chip">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <span className="blog-read-more">
                              Read <FaArrowRight />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}

        {/* ── Portfolio CTA ── */}
        <motion.section
          className="blog-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="blog-cta-inner">
            <span className="blog-cta-label">About the author</span>
            <h2 className="blog-cta-title">Want to see what I build?</h2>
            <p className="blog-cta-text">
              I'm MattQ — I make Roblox games, web tools, and open-source
              experiments. Check out my portfolio to see projects with 3M+
              visits, thousands of downloads, and more.
            </p>
            <Link href="/" className="blog-cta-btn">
              View Portfolio <FaArrowRight />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
