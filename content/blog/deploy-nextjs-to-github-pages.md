---
title: "How to Deploy a Next.js Site to GitHub Pages for Free"
description: "Yes, Next.js works on GitHub Pages. Set up a static export and a GitHub Actions workflow in about 5 minutes."
date: "2026-09-02"
tags: ["Next.js", "GitHub Pages", "Deployment", "DevOps"]
cover: null
---

You built a site with Next.js and want to host it for free. Vercel is great, but maybe you'd rather keep everything on GitHub. Can you?

> **Quick answer:** Yes. Export your app as static files with `output: "export"` and publish the `out/` folder with GitHub Actions. This very portfolio works exactly like this.

---

## Step 1: Enable static export

In `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
```

- `output: "export"` makes `next build` generate plain HTML/CSS/JS in `out/`.
- `unoptimized: true` is needed because there's no image optimization server on GitHub Pages.

---

## Step 2: Check what you're using

A static site has no server, so a few features won't work:

- ❌ API routes / Route Handlers with dynamic behavior
- ❌ Middleware
- ❌ Incremental Static Regeneration
- ✅ Server Components (they run at **build time**)
- ✅ Dynamic routes, **if** you provide `generateStaticParams()`

```jsx
export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}
```

If any dynamic page is missing from `generateStaticParams`, the build will fail — which is a good thing.

---

## Step 3: Repo name and `basePath`

- Repo named `username.github.io` → the site lives at the root. **No config needed.**
- Any other repo (e.g. `my-project`) → the site lives at `/my-project`, so add:

```js
const nextConfig = {
  output: "export",
  basePath: "/my-project",
  images: { unoptimized: true },
};
```

---

## Step 4: Add the GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## Step 5: Turn on Pages

In your repo: **Settings → Pages → Source → GitHub Actions**. Push to `main` and watch the **Actions** tab. A minute later your site is live.

---

## Troubleshooting

| Problem                         | Likely cause                            |
| ------------------------------- | --------------------------------------- |
| CSS/JS return 404               | Missing `basePath` on a project repo    |
| Images are broken               | Forgot `images: { unoptimized: true }`  |
| Build fails on a dynamic route  | Missing `generateStaticParams()`        |
| Peer dependency errors in CI    | Use `npm ci --legacy-peer-deps`         |
| Refreshing a sub-page gives 404 | Add `trailingSlash: true` in the config |
