---
title: "Why Does useEffect Run Twice in React? (And How to Fix It)"
description: "Your effect fires twice in development and you think React is broken. It isn't — here's what Strict Mode is doing and how to write effects that survive it."
date: "2026-08-27"
tags: ["React", "Hooks", "Debugging", "JavaScript"]
cover: null
---

You add a `console.log` inside `useEffect`, refresh, and see it printed **twice**. Your API call fires twice. Your analytics event fires twice.

> **Quick answer:** In development, React **Strict Mode** intentionally mounts, unmounts and remounts every component once to check that your effects clean up properly. It does **not** happen in production.

---

## Is it a bug?

No. It's a stress test. React is asking: _"If this component gets unmounted and mounted again, does your effect still behave?"_ In future React features (like preserving state while hidden), that will genuinely happen.

Check your `main.jsx` or Next.js config:

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

Build for production and the double run disappears.

---

## Don't "fix" it by removing Strict Mode

That hides the symptom. The real question is: **why does running twice cause a problem?** Usually because the effect is missing a cleanup.

---

## The real fix: write a cleanup

### Subscriptions and listeners

```jsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener("resize", onResize);

  return () => window.removeEventListener("resize", onResize);
}, []);
```

Without the cleanup, the second run adds a duplicate listener.

### Timers

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

### Fetching data

Cancel the first request, so only the last one counts:

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/user", { signal: controller.signal })
    .then((res) => res.json())
    .then(setUser)
    .catch((err) => {
      if (err.name !== "AbortError") console.error(err);
    });

  return () => controller.abort();
}, []);
```

---

## What about things that must run only once?

Things like "send a purchase event" shouldn't live in an effect at all. Put them where the action actually happens:

```jsx
// ❌ Fires on mount (and twice in dev)
useEffect(() => {
  trackPurchase();
}, []);

// ✅ Fires when the user actually clicks
<button
  onClick={() => {
    buy();
    trackPurchase();
  }}
>
  Buy
</button>;
```

Effects are for **synchronizing with something external**, not for running one-time logic.

---

## Avoid the `useRef` hack

You'll find advice like this:

```jsx
const ran = useRef(false);
useEffect(() => {
  if (ran.current) return;
  ran.current = true;
  doThing();
}, []);
```

It silences the warning but keeps the underlying bug (no cleanup) and can break when React remounts intentionally. Prefer a proper cleanup.

---

## Checklist

- ✅ Double effects only in **dev** + Strict Mode? Then it's expected.
- ✅ Every listener, timer and subscription has a cleanup function.
- ✅ Fetches use `AbortController` (or a library like TanStack Query).
- ✅ User actions are handled in event handlers, not effects.
