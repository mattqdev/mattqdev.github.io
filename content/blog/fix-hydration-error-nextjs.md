---
title: "How to Fix 'Hydration Failed' Errors in Next.js"
description: "Text content does not match server-rendered HTML? Here are the 5 usual suspects behind Next.js hydration errors and the quick fix for each."
date: "2026-08-30"
tags: ["Next.js", "React", "Debugging", "SSR"]
cover: null
---

You load your Next.js page and the console screams:

```
Hydration failed because the server rendered HTML didn't match the client.
```

> **Quick answer:** The HTML generated on the server differs from what React renders in the browser on the first pass. Find whatever produces different output on each side, and move it into `useEffect` or mark it as intentionally different.

---

## What is hydration?

The server sends ready-made HTML. In the browser, React "hydrates" it: it renders your components again and attaches event handlers to the existing HTML. If the two don't match, React can't trust the page and complains.

---

## Suspect 1: Browser-only values during render

```jsx
// ❌ `window` and `localStorage` don't exist on the server
function Theme() {
  const theme = localStorage.getItem("theme") ?? "light";
  return <p>Theme: {theme}</p>;
}
```

**Fix:** read them after mount.

```jsx
function Theme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") ?? "light");
  }, []);

  return <p>Theme: {theme}</p>;
}
```

The first render matches the server; the update happens right after.

---

## Suspect 2: Dates, randomness and locale

```jsx
// ❌ The server and the browser have different times/timezones
<p>{new Date().toLocaleTimeString()}</p>
<p>{Math.random()}</p>
```

**Fix:** same trick — compute in `useEffect`. For a timestamp that is expected to differ, you can silence it on that single element:

```jsx
<time suppressHydrationWarning>{new Date().toLocaleString()}</time>
```

Use it sparingly. It only works one level deep.

---

## Suspect 3: Invalid HTML nesting

Browsers auto-correct broken HTML, so the DOM ends up different from what React expected.

```jsx
// ❌ <div> inside <p>, <p> inside <p>, <a> inside <a>
<p>
  <div>Hello</div>
</p>
```

**Fix:** use valid nesting. Swap the outer `<p>` for a `<div>`.

---

## Suspect 4: A component that can't render on the server

Some libraries (charts, maps, editors) touch `window` at import time. Load them client-side only:

```jsx
"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });
```

Note that in recent Next.js versions, `ssr: false` must be used inside a **Client Component**.

---

## Suspect 5: Browser extensions

Extensions like translators, password managers and dark-mode tools inject attributes into your HTML before React loads. Test in an **incognito window** with extensions disabled. If the error disappears, it's not your code.

---

## Debugging tip

Recent Next.js versions print a diff showing exactly which element differs. Read the `+ Client` / `- Server` lines — they usually point straight at the culprit.

---

## Checklist

- ✅ No `window`, `document` or `localStorage` during render
- ✅ No `Date.now()` or `Math.random()` in initial output
- ✅ Valid HTML nesting
- ✅ Client-only libraries loaded with `dynamic(..., { ssr: false })`
- ✅ Tested in incognito
