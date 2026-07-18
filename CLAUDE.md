# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MattQ's personal portfolio + blog. Next.js 16 (App Router, React 19) exported as a **fully static site** (`output: "export"`) and hosted on GitHub Pages at `https://mattqdev.github.io`. There is no runtime server — everything is prerendered at build time into `out/`.

## Commands

```bash
npm run dev            # local dev server (next dev)
npm run build          # npm run generate + next build → static output in out/
npm run generate       # regenerate RSS, routes.js, and sitemap (see below)
npm run format         # prettier --write .
npm run format:check   # prettier --check .
npm run deploy         # triggers the GitHub Actions release workflow (gh workflow run release.yml)
```

There is no test suite, linter (beyond Prettier), or typecheck script. TypeScript runs in `strict: false`, `noEmit` mode — types are advisory only.

## Static-export constraints (read before adding features)

Because of `output: "export"`, several Next.js features are unavailable and there are established workarounds:

- **No API/Route Handlers, no server runtime.** Anything dynamic must be generated at build time or fetched from the browser.
- **GitHub data** (`hooks/useGitHubData.js`) is fetched client-side directly from the GitHub API using `NEXT_PUBLIC_GITHUB_TOKEN`. The token is intentionally public — it is read-only on public repos, and only exists to raise the rate limit from 60 to 5,000 req/hr. Missing token silently falls back to unauthenticated requests.
- **Contact form** posts to a Discord webhook via `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` (client-side).
- **RSS feed** (`/blog/rss.xml`) cannot be a Route Handler — it is pre-generated to `public/blog/rss.xml` by `scripts/rss-generator.js`.
- **Images** use `unoptimized: true` (no Image Optimization server).
- Dynamic routes (`app/blog/[slug]`, `app/projects/[projectId]`) rely on `generateStaticParams()` to enumerate every page at build time.

## Architecture

### Server vs. Client components
The split is deliberate and load-bearing — respect the `'use client'` boundaries:
- `app/page.tsx` and other page files are **Server Components** that read data (blog files, project data) at build time.
- `lib/blog.js` uses Node `fs` and is **server-only** — never import it into a client component.
- `components/blog/ArticleRenderer.jsx` is a **Server Component** using `next-mdx-remote/rsc` to render markdown. Interactivity for an article lives in the separate client component `BlogArticle.jsx`.
- `components/SiteShell.jsx` (`'use client'`) is the interactive shell for the homepage — it composes Hero/About/Skills/Projects/Contact/Footer and owns scroll/section state. The homepage server component just renders `<SiteShell/>`.

### Content sources
- **Blog posts** are Markdown files in `content/blog/*.md` with gray-matter frontmatter (`title`, `description`, `date` [ISO 8601], `tags`, `cover`). `lib/blog.js` is the single access layer: `getAllSlugs`, `getAllPosts` (sorted newest-first, adds reading time), `getPostBySlug`. Add a post by dropping a `.md` file here — no code change needed, but regenerate routes/RSS/sitemap (see below).
- **Projects** are defined in `data/projects.js` (a JS array, ~16 entries) using tag constants from `data/tags.js`. Project detail pages read from this array.

### Build-time generation (order matters)
`npm run generate` runs three scripts in sequence and is invoked automatically by `npm run build`:
1. `generate:rss` → `scripts/rss-generator.js` → writes `public/blog/rss.xml` from `content/blog`.
2. `generate:routes` → `scripts/routes-generator.js` → produces `routes.js` (checked-in, header says AUTO-GENERATED — do not hand-edit).
3. `generate:sitemap` → `scripts/sitemap-generator.js` → reads `routes.js` and writes `public/sitemap.xml` + `public/robots.txt`.

Generated artifacts write to `public/` (not `out/`), because `next build` copies all of `public/` into `out/` during export. Note: `scripts/routes-generator.js` and `scripts/sitemap-generator.js` are currently near-duplicate sitemap generators — if you touch route/sitemap generation, check both.

### Deployment
Deployment is GitHub Actions only (`.github/workflows/release.yml`, manual `workflow_dispatch`). The workflow runs `semantic-release` (Conventional Commits drive versioning/tags), then `npm run build`, then uploads `out/` as the Pages artifact. `npm run deploy` just triggers this workflow. Do not deploy from local. Note `npm install --legacy-peer-deps` is used in CI (React 19 peer-dep conflicts).

## Conventions

- **Commit messages** must follow Conventional Commits (`feat:`, `fix:`, `style:`, etc.) — semantic-release parses them to decide releases.
- Import alias `@/*` maps to the repo root (e.g. `@/lib/blog`, `@/components/...`).
- New components are mostly `.jsx`; app-shell/config files that started typed remain `.tsx`. Styling is plain CSS (`app/globals.css`, `app/Blog.css`, `components/styles/*.css`) — Tailwind is listed but the config only scans `./src` (which doesn't exist), so it is effectively unused. Prefer the existing CSS approach.
- `ME.md` is an identity/bio card for the site owner (context, not code).
