// scripts/routes-generator.js
// Scans the Next.js app/ directory and auto-generates routes.js at the project root.
//
// Handles JSX data files: instead of importing data/projects.js (which contains
// JSX icon components Node can't parse), it reads the file as text and extracts
// `id` values with a regex. No transpiler needed.
//
// Blog posts: reads content/blog/*.md and extracts slugs from filenames.

import {
  readdirSync,
  statSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(__dirname, "..", "app");
const OUTPUT_FILE = join(__dirname, "..", "routes.js");

// ── Extractors ────────────────────────────────────────────────────────────────

function extractProjectIds() {
  const file = join(__dirname, "..", "data", "projects.js");
  if (!existsSync(file)) {
    console.warn("⚠️  data/projects.js not found — skipping project routes");
    return [];
  }
  const src = readFileSync(file, "utf-8");
  const ids = [...src.matchAll(/\bid\s*:\s*["']([^"']+)["']/g)].map(
    (m) => m[1]
  );
  if (ids.length === 0) {
    console.warn("⚠️  No project ids found in data/projects.js");
  }
  return ids;
}

function extractBlogSlugs() {
  const dir = join(__dirname, "..", "content", "blog");
  if (!existsSync(dir)) {
    console.warn("⚠️  content/blog/ not found — skipping blog article routes");
    return [];
  }
  const slugs = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
  if (slugs.length === 0) {
    console.warn("⚠️  No .md files found in content/blog/");
  }
  return slugs;
}

// Blog post priority/changefreq: reads the `date:` frontmatter field.
//   post < 30 days  → weekly  + priority 0.9
//   post < 180 days → monthly + priority 0.8
//   older           → yearly  + priority 0.6
function blogPostMeta(slug) {
  const file = join(__dirname, "..", "content", "blog", slug + ".md");
  let changefreq = "monthly";
  let priority = 0.8;
  try {
    const src = readFileSync(file, "utf-8");
    const match = src.match(/^date\s*:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
    if (match) {
      const age = (Date.now() - new Date(match[1]).getTime()) / 86_400_000;
      if (age < 30) {
        changefreq = "weekly";
        priority = 0.9;
      } else if (age < 180) {
        changefreq = "monthly";
        priority = 0.8;
      } else {
        changefreq = "yearly";
        priority = 0.6;
      }
    }
  } catch {
    /* file unreadable — use defaults */
  }
  return { changefreq, priority };
}

// ── Dynamic segment expanders ─────────────────────────────────────────────────
const DYNAMIC_EXPANDERS = {
  "[projectId]": () =>
    extractProjectIds().map((id) => ({
      value: id,
      meta: { changefreq: "monthly", priority: 0.7 },
    })),

  "[slug]": () =>
    extractBlogSlugs().map((slug) => ({
      value: slug,
      meta: blogPostMeta(slug),
    })),
};

// ── Route helpers ─────────────────────────────────────────────────────────────

function routeMeta(urlPath) {
  if (urlPath === "/") return { changefreq: "weekly", priority: 1.0 };
  const segments = urlPath.split("/").filter(Boolean);
  const depth = segments.length;
  const last = segments[depth - 1];
  if (depth === 1) {
    const highPriority = new Set(["projects", "work", "portfolio", "blog"]);
    return {
      changefreq: highPriority.has(last) ? "weekly" : "monthly",
      priority: highPriority.has(last) ? 0.9 : 0.8,
    };
  }
  return {
    changefreq: "monthly",
    priority: Math.max(0.4, 0.7 - (depth - 2) * 0.1),
  };
}

const isDynamic = (s) => s.startsWith("[") && s.endsWith("]");
const isRouteGroup = (s) => s.startsWith("(") && s.endsWith(")");

function scanDir(dir, segments = []) {
  const routes = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return routes;
  }
  if (entries.some((e) => e.match(/^page\.(jsx?|tsx?)$/))) {
    routes.push(segments);
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    if (entry === "api" || entry.startsWith("_")) continue;
    routes.push(...scanDir(full, [...segments, entry]));
  }
  return routes;
}

function expandSegments(allSegments) {
  const routes = [];
  for (const segments of allSegments) {
    const visible = segments.filter((s) => !isRouteGroup(s));
    const dynamicIdx = visible.findIndex(isDynamic);

    if (dynamicIdx === -1) {
      const path = "/" + visible.join("/") || "/";
      routes.push({ path, ...routeMeta(path) });
      continue;
    }

    const dynamicSegment = visible[dynamicIdx];
    const expander = DYNAMIC_EXPANDERS[dynamicSegment];

    if (!expander) {
      console.warn(`⚠️  No expander for "${dynamicSegment}" — route skipped`);
      continue;
    }

    for (const { value, meta = {} } of expander()) {
      const expanded = [...visible];
      expanded[dynamicIdx] = value;
      const path = "/" + expanded.join("/");
      routes.push({ path, ...routeMeta(path), ...meta });
    }
  }
  return routes;
}

function generateRoutesFile() {
  console.log("\n📂 Scanning " + APP_DIR + " …\n");

  const rawSegments = scanDir(APP_DIR);
  const routes = expandSegments(rawSegments);

  const routeMap = new Map();
  routes.forEach((r) => routeMap.set(r.path, r));
  const final = Array.from(routeMap.values()).sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.path.localeCompare(b.path);
  });

  const content = [
    "// routes.js — AUTO-GENERATED by scripts/routes-generator.js",
    "// Do not edit manually. Run: npm run generate:routes",
    "",
    "export const routes = " + JSON.stringify(final, null, 2) + ";",
    "",
  ].join("\n");

  writeFileSync(OUTPUT_FILE, content, "utf-8");

  const projects = final.filter((r) => r.path.startsWith("/project/"));
  const blog = final.filter((r) => r.path.startsWith("/blog/"));
  const other = final.filter(
    (r) => !r.path.startsWith("/project/") && !r.path.startsWith("/blog/")
  );

  console.log("✅ routes.js — " + final.length + " routes total\n");
  console.log("   Static  (" + other.length + "):");
  other.forEach((r) => console.log("     + " + r.path));
  console.log("\n   /project/ (" + projects.length + "):");
  projects.forEach((r) => console.log("     + " + r.path));
  console.log("\n   /blog/ (" + blog.length + "):");
  blog.forEach((r) => console.log("     + " + r.path));
  console.log();
}

generateRoutesFile();
