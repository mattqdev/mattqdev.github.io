---
title: "How to Avoid GitHub API Rate Limits on a Static Website"
description: "Showing your repos or stats on a portfolio? The GitHub API blocks you after 60 requests per hour. Here are 3 ways to stay under the limit."
date: "2026-09-05"
tags: ["GitHub API", "JavaScript", "Performance", "Web Dev"]
cover: null
---

You add a "My projects" section that fetches your repos from the GitHub API. It works. Then, after a few reloads:

```
403 — API rate limit exceeded
```

> **Quick answer:** Unauthenticated requests are limited to **60 per hour per IP**. Fetch at build time if you can, cache in the browser if you can't, and use a token as a last resort.

---

## The limits

| Type         | Limit                       |
| ------------ | --------------------------- |
| No token     | 60 requests / hour (per IP) |
| With a token | 5,000 requests / hour       |

If a visitor's office or school shares one IP, 60 disappears fast.

---

## Option 1: Fetch at build time (best)

If your data doesn't need to be live to the second, don't fetch it in the browser at all. In a Next.js Server Component the request runs **once, during the build**:

```jsx
// app/page.jsx (Server Component)
async function getRepos() {
  const res = await fetch(
    "https://api.github.com/users/mattqdev/repos?sort=updated"
  );
  return res.json();
}

export default async function Page() {
  const repos = await getRepos();
  return <ProjectList repos={repos} />;
}
```

Visitors receive plain HTML. **Zero** API calls from them, no limits, and it's faster.

The downside: data updates only when you rebuild. A scheduled GitHub Action can rebuild daily if you want it fresher.

---

## Option 2: Cache in the browser

If you need client-side fetching, don't refetch on every visit. Store the result with a timestamp:

```js
const TTL = 60 * 60 * 1000; // 1 hour

async function getRepos() {
  try {
    const cached = JSON.parse(localStorage.getItem("repos"));
    if (cached && Date.now() - cached.time < TTL) return cached.data;
  } catch {}

  const res = await fetch("https://api.github.com/users/mattqdev/repos");
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
  const data = await res.json();

  localStorage.setItem("repos", JSON.stringify({ time: Date.now(), data }));
  return data;
}
```

Now each visitor makes at most one request per hour, no matter how many pages they open.

---

## Option 3: Use a token — carefully

A token raises the limit to 5,000/hour. On a static site there's no server to hide it, so anything you put in `NEXT_PUBLIC_*` is **visible to everyone**.

That's acceptable only if the token is harmless:

- Use a **fine-grained token** with access to **public repositories only, read-only**, and no other permissions.
- Never use a classic token with `repo` scope.
- Assume it will be found, and be ready to rotate it.

Add a graceful fallback so the site still works if the token is missing or revoked:

```js
const headers = token ? { Authorization: `Bearer ${token}` } : {};
const res = await fetch(url, { headers });
```

---

## Always handle failure

Whatever you choose, show something useful when the request fails.

```js
if (res.status === 403) {
  // rate limited — show cached or placeholder data
}
```

A portfolio that shows an empty box is worse than one that shows slightly old data.

---

## Which one should I pick?

- **Data changes rarely?** → Build time.
- **Needs to be fresher?** → Build time + scheduled rebuild.
- **Truly client-side?** → Browser cache, plus an optional low-privilege token.
