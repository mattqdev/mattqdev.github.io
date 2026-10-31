"use client";
// components/blog/BlogIndex.jsx
import { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaSearch, FaRss } from "react-icons/fa";
import { MarkLine } from "../brand/Mark";
import CategoryFilter from "../CategoryFilter";
import { useUrlState } from "@/hooks/useUrlState";
import { formatDate } from "@/lib/format";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

// Build filter options (all unique tags + counts) from posts
function buildTagOptions(posts) {
  const tagCounts = new Map();
  for (const p of posts) {
    for (const t of p.tags) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
  }
  return [
    { value: "all", label: "All", count: posts.length },
    ...Array.from(tagCounts.entries()).map(([tag, count]) => ({
      value: tag,
      label: tag,
      count,
    })),
  ];
}

export default function BlogIndex({ posts }) {
  // Search + tag live in the URL (?q=…&tag=…) so filtered views can be shared
  const [query, setQuery] = useUrlState("q", "");
  const [tagParam, setActiveTag] = useUrlState("tag", "all");

  const tagOptions = useMemo(() => buildTagOptions(posts), [posts]);
  const activeTag = tagOptions.some((o) => o.value === tagParam)
    ? tagParam
    : "all";

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
      {/* ── Masthead ── */}
      <section className="blog-hero">
        <div className="container">
          <motion.div
            className="blog-hero-inner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="blog-hero-top label">
              <span>MattQ · Writing</span>
              <span>{posts.length} articles</span>
              <a href="/blog/rss.xml" className="blog-rss">
                <FaRss aria-hidden="true" /> RSS
              </a>
            </div>
            <h1 className="blog-hero-title">
              Thoughts on code &amp; craft<span className="dot-red">.</span>
            </h1>
            <p className="blog-hero-sub">
              Deep dives on Roblox dev, web tooling, game design, and building
              things that actually ship.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container blog-body">
        {/* ── Search + filter bar ── */}
        <div className="blog-controls">
          <div className="blog-search">
            <FaSearch className="blog-search-icon" aria-hidden="true" />
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <input
              id="blog-search"
              type="search"
              name="q"
              autoComplete="off"
              spellCheck={false}
              placeholder="Search articles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="blog-search-input"
            />
          </div>
          <CategoryFilter
            options={tagOptions}
            value={activeTag}
            onChange={setActiveTag}
            label="Tag"
          />
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length === 1 ? "1 article" : `${filtered.length} articles`}
        </p>

        {filtered.length === 0 ? (
          <div className="blog-empty">
            <p>No articles match your search.</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setQuery("");
                setActiveTag("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* ── Featured post (first in filtered list) ── */}
            {featured && (
              <motion.article
                className="blog-featured"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
              >
                <Link
                  href={`/blog/${featured.slug}`}
                  className="blog-featured-link"
                >
                  <div className="blog-featured-cover">
                    {featured.cover ? (
                      <img
                        src={`/blog/covers/${featured.cover}`}
                        alt=""
                        width={1200}
                        height={630}
                      />
                    ) : (
                      <MarkLine className="blog-cover-mark" weight={12} />
                    )}
                  </div>
                  <div className="blog-featured-body">
                    <div className="blog-meta label">
                      <span className="blog-featured-badge">Featured</span>
                      <time dateTime={featured.date}>
                        {formatDate(featured.date)}
                      </time>
                      <span>{featured.readingTime}</span>
                    </div>
                    <h2 className="blog-featured-title">{featured.title}</h2>
                    <p className="blog-featured-desc">{featured.description}</p>
                    <div className="blog-featured-footer">
                      <ul className="blog-post-tags" aria-label="Tags">
                        {featured.tags.map((t) => (
                          <li key={t} className="blog-tag-chip">
                            {t}
                          </li>
                        ))}
                      </ul>
                      <span className="blog-read-link">
                        Read article <FaArrowRight aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* ── Index of the rest ── */}
            {rest.length > 0 && (
              <motion.ol
                className="blog-list"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence mode="popLayout">
                  {rest.map((post, i) => (
                    <motion.li
                      key={post.slug}
                      className="blog-row"
                      variants={fadeUp}
                      layout
                      exit={{ opacity: 0 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="blog-row-link"
                      >
                        <span className="blog-row-n mono" aria-hidden="true">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <span className="blog-row-date mono">
                          <time dateTime={post.date}>
                            {formatDate(post.date, "short")}
                          </time>
                        </span>
                        <span className="blog-row-main">
                          <span className="blog-row-title">{post.title}</span>
                          <span className="blog-row-desc">
                            {post.description}
                          </span>
                          <span className="blog-post-tags">
                            {post.tags.slice(0, 3).map((t) => (
                              <span key={t} className="blog-tag-chip">
                                {t}
                              </span>
                            ))}
                          </span>
                        </span>
                        <span className="blog-row-time mono">
                          {post.readingTime}
                        </span>
                        <FaArrowRight
                          className="blog-row-go"
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ol>
            )}
          </>
        )}

        {/* ── Portfolio CTA ── */}
        <section className="blog-cta">
          <div className="blog-cta-inner">
            <span className="label">About the author</span>
            <h2 className="blog-cta-title">Want to see what I build?</h2>
            <p className="blog-cta-text">
              I&rsquo;m MattQ. I make Roblox games, web tools, and open-source
              experiments. Check out my portfolio to see projects with 3M+
              visits, thousands of downloads, and more.
            </p>
            <Link href="/" className="btn">
              View portfolio <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
          <MarkLine className="blog-cta-mark" weight={12} />
        </section>
      </div>
    </div>
  );
}
