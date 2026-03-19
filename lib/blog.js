// lib/blog.js
// Server-only — uses Node fs. Never import this in a client component.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Returns all post slugs (filenames without .md)
 */
export function getAllSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Returns frontmatter + reading time for all posts, sorted newest first.
 * Frontmatter fields:
 *   title        string   required
 *   description  string   required  (used for SEO meta description)
 *   date         string   required  (ISO 8601, e.g. "2026-03-15")
 *   tags         string[] optional
 *   cover        string   optional  (filename in /public/blog/covers/)
 */
export function getAllPosts() {
  return getAllSlugs()
    .map((slug) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8")
      );
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        cover: data.cover ?? null,
        readingTime: readingTime(content).text,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Returns full post data including raw markdown content.
 */
export function getPostBySlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    cover: data.cover ?? null,
    readingTime: readingTime(content).text,
    content,
  };
}
