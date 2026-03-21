// components/blog/RelatedPosts.jsx
// Server Component — receives all posts and current post,
// finds up to 3 related ones by shared tag count, renders them.
import Link from "next/link";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function scoreRelatedness(post, current) {
  // Count shared tags
  const sharedTags = post.tags.filter((t) => current.tags.includes(t)).length;
  // Recency bonus: posts within 90 days get +0.5
  const age = current.date
    ? (new Date(current.date) - new Date(post.date)) / 86_400_000
    : 0;
  const recencyBonus = Math.abs(age) < 90 ? 0.5 : 0;
  return sharedTags + recencyBonus;
}

export default function RelatedPosts({ currentPost, allPosts }) {
  const related = allPosts
    .filter((p) => p.slug !== currentPost.slug)
    .map((p) => ({ ...p, _score: scoreRelatedness(p, currentPost) }))
    .filter((p) => p._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="related-posts">
      <div className="related-posts-header">
        <span className="related-posts-label">Continue reading</span>
        <h2 className="related-posts-title">Related Articles</h2>
      </div>

      <div className="related-posts-grid">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="related-card"
          >
            {post.cover ? (
              <div className="related-card-cover">
                <img
                  src={`/blog/covers/${post.cover}`}
                  alt={post.title}
                  width={400}
                  height={220}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div className="related-card-cover related-card-cover--empty">
                <div className="related-card-pattern" aria-hidden="true" />
              </div>
            )}

            <div className="related-card-body">
              <div className="related-card-tags">
                {post.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className={`blog-tag-chip ${currentPost.tags.includes(t) ? "blog-tag-chip--shared" : ""}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="related-card-title">{post.title}</h3>
              <p className="related-card-desc">{post.description}</p>
              <div className="related-card-meta">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
