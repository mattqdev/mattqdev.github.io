// scripts/sitemap-generator.js
// Reads the already-expanded routes.js and writes:
//   public/sitemap.xml  — copied into out/ by next build automatically
//   public/robots.txt   — same
//
// IMPORTANT: Run routes-generator.js FIRST, then this, then next build.
// The `npm run generate` script handles the correct order.
//
// Why public/ only (not out/):
//   next build with output:'export' copies everything from public/ into out/.
//   Writing to out/ here would be overwritten anyway, and out/ doesn't exist
//   until after the build completes.

import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import xmlFormat from "xml-formatter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ROUTES_FILE = join(ROOT, "routes.js");
const PUBLIC_DIR = join(ROOT, "public");
const hostname = "https://mattqdev.github.io";
const sitemapName = "sitemap";

// Ensure public/ exists (it always should, but just in case)
if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

function write(filename, content) {
  const dest = join(PUBLIC_DIR, filename);
  writeFileSync(dest, content, "utf-8");
  console.log("   → " + dest);
}

async function generateSitemap() {
  console.log("\n🗺️  Sitemap generator starting...\n");

  // ── 1. Load routes ──────────────────────────────────────────────────
  let routes = [];
  try {
    const url = pathToFileURL(ROUTES_FILE).href + "?t=" + Date.now();
    const mod = await import(url);
    routes = mod.routes ?? [];
  } catch (e) {
    console.error(
      "❌ Could not load routes.js — run `npm run generate:routes` first."
    );
    console.error(e.message);
    process.exit(1);
  }

  // ── 2. Separate for logging ─────────────────────────────────────────
  // Classify routes — be explicit to avoid double-counting
  const isRoot = (r) => r.path === "/";
  const isBlogIndex = (r) => r.path === "/blog";
  const isBlogPost = (r) => r.path.startsWith("/blog/");
  const isProjectList = (r) => r.path === "/projects";
  const isProjectPage = (r) =>
    r.path.startsWith("/projects/") || r.path.startsWith("/project/");
  const isOther = (r) =>
    !isRoot(r) &&
    !isBlogIndex(r) &&
    !isBlogPost(r) &&
    !isProjectList(r) &&
    !isProjectPage(r);

  const rootRoute = routes.filter(isRoot);
  const blogIndexRoute = routes.filter(isBlogIndex);
  const blogPosts = routes.filter(isBlogPost);
  const projectList = routes.filter(isProjectList);
  const projectPages = routes.filter(isProjectPage);
  const otherRoutes = routes.filter(isOther);

  console.log("✅ Loaded " + routes.length + " routes");
  console.log(
    "   /: 1" +
      "  |  /blog: " +
      (blogIndexRoute.length + blogPosts.length) +
      "  |  /projects: " +
      (projectList.length + projectPages.length) +
      "  |  other: " +
      otherRoutes.length +
      "\n"
  );

  // Deduplicate by path before writing (belt-and-suspenders)
  const seen = new Set();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // ── 3. Build sitemap XML ────────────────────────────────────────────
  const stream = new SitemapStream({ hostname });

  // Priority order: homepage → /projects → /blog → blog posts → project pages → other
  const ordered = [
    ...rootRoute,
    ...projectList,
    ...blogIndexRoute,
    ...blogPosts,
    ...projectPages,
    ...otherRoutes,
  ];

  ordered.forEach((r) => {
    if (seen.has(r.path)) return; // skip duplicates
    seen.add(r.path);
    stream.write({
      url: r.path,
      changefreq: r.changefreq ?? "monthly",
      priority: r.priority ?? 0.7,
      lastmod: today, // YYYY-MM-DD format — required by Google
    });
  });

  stream.end();

  const rawXml = (await streamToPromise(stream)).toString();
  const formatted = xmlFormat(rawXml, {
    indentation: "  ",
    collapseContent: true,
  });

  // ── 4. Write sitemap.xml → public/ ──────────────────────────────────
  console.log("✅ Writing " + sitemapName + ".xml:");
  write(sitemapName + ".xml", formatted);

  // ── 5. Write robots.txt → public/ ───────────────────────────────────
  // robots.txt with explicit Sitemap: line is required for Google Search
  // Console to fetch the sitemap on github.io domains. Without this,
  // GSC shows "Couldn't fetch" even when the XML is valid and accessible.
  const robotsTxt = [
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /_next/",
    "Disallow: /api/",
    "",
    "Sitemap: " + hostname + "/" + sitemapName + ".xml",
  ].join("\n");

  console.log("\n✅ Writing robots.txt:");
  write("robots.txt", robotsTxt);

  console.log("\n🎉 Done — " + routes.length + " URLs in sitemap.");
  console.log("\n📋 Next steps for Google indexing:");
  console.log("   1. Run `npm run build` to copy public/ into out/");
  console.log("   2. Deploy with `npm run deploy`");
  console.log(
    "   3. Verify sitemap is live: " + hostname + "/" + sitemapName + ".xml"
  );
  console.log(
    "   4. In Google Search Console → Sitemaps → submit: sitemap.xml"
  );
  console.log(
    "   5. If GSC shows 'Couldn't fetch', wait 12-24h then resubmit."
  );
  console.log(
    "      The robots.txt Sitemap: line forces Googlebot to discover it.\n"
  );
}

generateSitemap().catch((e) => {
  console.error("❌ Sitemap generation failed:", e);
  process.exit(1);
});
