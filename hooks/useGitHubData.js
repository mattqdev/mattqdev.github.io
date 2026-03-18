// hooks/useGitHubData.js
"use client";
import { useState, useEffect } from "react";

// Simple in-memory cache shared across hook instances in the same session
const cache = {};

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

    // Return from cache immediately if we already fetched this repo
    if (cache[slug] !== undefined) {
      setRepo(cache[slug].repo);
      setLangs(cache[slug].langs);
      return;
    }

    setLoading(true);
    setError(false);

    Promise.all([
      fetch(`https://api.github.com/repos/${slug}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`https://api.github.com/repos/${slug}/languages`).then((r) =>
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
