"use client";
// hooks/useGitHubData.js
//
// Static-export compatible version (output: 'export' in next.config.js).
// API Routes can't run in a static build, so we call GitHub directly from
// the browser using a NEXT_PUBLIC_ prefixed token.
//
// Security trade-off:
//   The token IS visible in the browser/source. This is acceptable because:
//   - It only has read access to public repos (data anyone can see anyway)
//   - You can scope it to specific repos for extra caution
//   - The main benefit is still gained: 5,000 req/hr instead of 60 req/hr
//
// Add to your .env:
//   NEXT_PUBLIC_GITHUB_TOKEN=github_pat_your_token_here
//
// If the variable is missing the hook falls back to unauthenticated requests
// (same behaviour as before, 60 req/hr limit).

import { useState, useEffect } from "react";

const GITHUB_API = "https://api.github.com";

// In-memory cache shared across all hook instances in the same browser session.
// Prevents duplicate network requests when multiple project cards are visible.
const cache = {};

function githubFetch(url) {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  return fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export function useGitHubData(githubUrl) {
  const [repo, setRepo] = useState(null);
  const [langs, setLangs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!githubUrl) return;

    const match = githubUrl.match(/github\.com\/([^/]+\/[^/?#]+)/);
    if (!match) return;
    const slug = match[1].replace(/\.git$/, "");

    if (cache[slug] !== undefined) {
      setRepo(cache[slug].repo);
      setLangs(cache[slug].langs);
      return;
    }

    setLoading(true);
    setError(false);

    Promise.all([
      githubFetch(`${GITHUB_API}/repos/${slug}`).then((r) =>
        r.ok ? r.json() : null
      ),
      githubFetch(`${GITHUB_API}/repos/${slug}/languages`).then((r) =>
        r.ok ? r.json() : null
      ),
    ])
      .then(([repoData, langData]) => {
        cache[slug] = { repo: repoData, langs: langData };
        setRepo(repoData);
        setLangs(langData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [githubUrl]);

  return { repo, langs, loading, error };
}
