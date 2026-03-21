// scripts/rss-generator.js
// Generates public/blog/rss.xml at build time.
// Required for `output: 'export'` (GitHub Pages) because Route Handlers
// that return non-HTML responses aren't supported in static export.
// Run before `next build`, or as part of `npm run generate`.
//
// Usage: node scripts/rss-generator.js

import {
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "content", "blog");
const OUT_DIR = join(ROOT, "public", "blog");
const OUT_FILE = join(OUT_DIR, "rss.xml");

const SITE = "https://mattqdev.github.io";
const AUTHOR = "MattQ";
const EMAIL = "mattqdevv@gmail.com";

/* ── Minimal frontmatter parser (no gray-matter — avoids ESM/CJS issues) ── */
function parseFrontmatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, content: src };
  const data = {};
  for (const line of match[1].split("\n")) {
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let val = line
      .slice(sep + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    // Parse tags array:  tags: ["Roblox", "Web Dev"]
    if (val.startsWith("[")) {
      try {
        val = JSON.parse(val.replace(/'/g, '"'));
      } catch {
        val = [];
      }
    }
    data[key] = val;
  }
  return { data, content: src.slice(match[0].length).trim() };
}

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Rough word count → reading time
function readingTime(content) {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function loadPosts() {
  if (!existsSync(BLOG_DIR)) {
    console.warn("⚠️  content/blog/ not found — RSS will be empty");
    return [];
  }
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const src = readFileSync(join(BLOG_DIR, filename), "utf-8");
      const { data, content } = parseFrontmatter(src);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        readingTime: readingTime(content),
      };
    })
    .filter((p) => p.date) // skip undated drafts
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildRss(posts) {
  const items = posts
    .map((post) => {
      const url = `${SITE}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const cats = post.tags
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join("\n");

      return [
        "  <item>",
        `    <title>${escapeXml(post.title)}</title>`,
        `    <link>${url}</link>`,
        `    <guid isPermaLink="true">${url}</guid>`,
        `    <description>${escapeXml(post.description)}</description>`,
        `    <pubDate>${pubDate}</pubDate>`,
        `    <author>${EMAIL} (${AUTHOR})</author>`,
        cats,
        `    <itunes:duration>${post.readingTime} min read</itunes:duration>`,
        "  </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"',
    '  xmlns:atom="http://www.w3.org/2005/Atom"',
    '  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">',
    "  <channel>",
    `    <title>${AUTHOR} — Blog</title>`,
    `    <link>${SITE}/blog</link>`,
    `    <description>Articles on Roblox dev, web tooling, game design, and building things that actually ship.</description>`,
    "    <language>en-us</language>",
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml"/>`,
    "    <image>",
    `      <url>${SITE}/icons/avatar.png</url>`,
    `      <title>${AUTHOR} — Blog</title>`,
    `      <link>${SITE}/blog</link>`,
    "    </image>",
    "",
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}

function run() {
  console.log("\n📡 RSS generator starting…\n");
  const posts = loadPosts();
  console.log(`✅ Found ${posts.length} post(s)`);
  posts.forEach((p) => console.log(`   · ${p.slug} (${p.date})`));

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const xml = buildRss(posts);
  writeFileSync(OUT_FILE, xml, "utf-8");
  console.log(`\n✅ Written → ${OUT_FILE}`);
  console.log(`   URL: ${SITE}/blog/rss.xml\n`);
}

run();
