// scripts/sitemap-generator.js
// Reads the already-expanded routes.js and writes sitemap.xml + robots.txt.
// Run routes-generator.js first (or use `npm run generate`).
//
// All dynamic segments are already expanded in routes.js by the time this
// runs, so this script is intentionally simple — no data files needed here.

import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync, existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import xmlFormat from "xml-formatter";

const __dirname = dirname(fileURLToPath(import.meta.url));

const hostname = "https://mattqdev.github.io";
const sitemapName = "sitemap";
const ROUTES_FILE = join(__dirname, "..", "routes.js");
const TARGETS = ["./public", "./out"]; // write to both; skips missing dirs

function writeToTargets(filename, content) {
  for (const dir of TARGETS) {
    if (existsSync(dir)) {
      const dest = join(dir, filename);
      writeFileSync(dest, content, "utf-8");
      console.log(`   → ${dest}`);
    }
  }
}

async function generateSitemap() {
  console.log("\n🗺️  Sitemap generator starting…\n");

  // ── 1. Load routes ──────────────────────────────────────────────────
  let routes = [];
  try {
    const url = pathToFileURL(ROUTES_FILE).href + `?t=${Date.now()}`;
    const mod = await import(url);
    routes = mod.routes ?? [];
  } catch (e) {
    console.error(
      "❌ Could not load routes.js — run routes-generator.js first."
    );
    console.error(e.message);
    process.exit(1);
  }

  console.log(`✅ Loaded ${routes.length} routes\n`);
  routes.forEach((r) => console.log(`   ${r.path}`));

  // ── 2. Build sitemap XML ────────────────────────────────────────────
  const stream = new SitemapStream({ hostname });

  routes.forEach((r) => {
    stream.write({
      url: r.path,
      changefreq: r.changefreq ?? "monthly",
      priority: r.priority ?? 0.7,
      lastmod: new Date().toISOString().split("T")[0],
    });
  });

  stream.end();

  const rawXml = (await streamToPromise(stream)).toString();
  const formatted = xmlFormat(rawXml, {
    indentation: "  ",
    collapseContent: true,
  });

  // ── 3. Write sitemap.xml ────────────────────────────────────────────
  console.log(`\n✅ Writing ${sitemapName}.xml:`);
  writeToTargets(`${sitemapName}.xml`, formatted);

  // ── 4. Write robots.txt ─────────────────────────────────────────────
  const robotsTxt = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${hostname}/${sitemapName}.xml`,
  ].join("\n");

  console.log(`\n✅ Writing robots.txt:`);
  writeToTargets("robots.txt", robotsTxt);

  console.log(`\n🎉 Done — ${routes.length} URLs in sitemap.\n`);
}

generateSitemap().catch((e) => {
  console.error("❌ Sitemap generation failed:", e);
  process.exit(1);
});
