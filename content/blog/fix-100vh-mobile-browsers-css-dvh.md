---
title: "Why Does 100vh Break on Mobile? Use dvh Instead"
description: "Your full-screen hero is cut off by the mobile browser's address bar. Here's why 100vh misbehaves and the one-line CSS fix."
date: "2026-09-24"
tags: ["CSS", "Mobile", "Web Dev", "Responsive Design"]
cover: null
---

Your hero section looks perfect on desktop. On your phone, the button at the bottom is hidden behind the browser's toolbar, and you have to scroll to reach it.

> **Quick answer:** On mobile, `100vh` is the height of the viewport with the browser bars **hidden**. When they're visible, the page is taller than the screen. Use `100dvh` instead.

---

## What's happening

Mobile browsers show and hide the address bar as you scroll. `100vh` was defined as the **largest** possible viewport — the one with the bars collapsed. So on first load, when the bars are visible, your `100vh` element overflows the screen.

```css
/* ❌ Taller than the visible screen on mobile */
.hero {
  height: 100vh;
}
```

---

## The fix: new viewport units

CSS now has three variants:

| Unit  | Meaning                                                     |
| ----- | ----------------------------------------------------------- |
| `svh` | **Small** viewport — bars visible (the smallest area)       |
| `lvh` | **Large** viewport — bars hidden (same as old `vh`)         |
| `dvh` | **Dynamic** viewport — updates as the bars appear/disappear |

For a full-screen section, `dvh` is usually what you want:

```css
.hero {
  height: 100dvh;
}
```

---

## Add a fallback for old browsers

Browsers ignore declarations they don't understand, so stack them:

```css
.hero {
  height: 100vh; /* old browsers */
  height: 100dvh; /* modern browsers override it */
}
```

`dvh`, `svh` and `lvh` are supported in all major browsers today, so the fallback is just cheap insurance.

---

## Which unit should I use?

- **Hero / landing section** → `min-height: 100svh` — always fits on the first screen with no overflow.
- **Full-screen app layout, modal, or menu** → `100dvh` — follows the bar as it moves.
- **Something that shouldn't ever resize** → `100lvh`.

Prefer `min-height` over `height` for content sections, so long content can still grow instead of being clipped:

```css
.hero {
  min-height: 100svh;
  display: grid;
  place-items: center;
}
```

---

## A caveat with dvh

Because `dvh` changes while the user scrolls, it can cause a small layout shift or re-render on the element. For heavy animated sections, `svh` gives a more stable result.

---

## Checklist

- ✅ Replaced `100vh` with `100dvh` (or `svh` for heroes)
- ✅ Added a `100vh` fallback line above it
- ✅ Used `min-height` for sections with variable content
- ✅ Tested on a real phone, not only in DevTools
