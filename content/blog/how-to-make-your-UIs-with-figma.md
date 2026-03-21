---
title: "Figma to Code: The Workflow for Pixel-Perfect Implementation"
description: "The gap between a beautiful Figma design and a polished coded result isn't a talent gap — it's a workflow gap. Here's the exact process I use to close it."
date: "2026-03-21"
tags: ["Figma", "React", "Tailwind CSS", "Design Systems", "Web Dev"]
cover: null
---

You've seen it happen. A designer hands off a Figma file. The developer builds it. The result looks… close. Kind of close. But something is off. The spacing feels slightly wrong. The font weights don't match. The hover states are guessed. The shadows are approximate.

The design looked expensive. The implementation looks like a template.

This gap is real, and it's not about skill. It's about **workflow**. Specifically, the workflow that connects what exists in Figma to what gets written in code. Here's mine.

---

## Step 1: Before You Write a Single Line — Audit the Figma File

Most developers open Figma, eyeball the design, and start coding. This is where the drift begins.

Before touching an editor, spend 20 minutes in the Figma file doing this:

**Check if Variables are set up.** Figma Variables (introduced in 2023) let designers define tokens — colors, spacing, radii, typography — that map directly to design decisions. If the file uses Variables, you can extract a design token system directly. If it doesn't, that's fine — but you need to build one manually.

**Inventory the spacing system.** Look at the padding and gap values used throughout the file. Are they on an 8pt grid? 4pt? Is there a consistent scale? In Figma, select a few different components and check their Auto Layout gap and padding values. Note the pattern — this becomes your `spacing` scale in Tailwind.

**Identify the type scale.** Select every distinct text style used in the file. Document: font family, weight, size, line height, and letter spacing. Most designs use 5–8 distinct text styles. Those become your custom `fontSize` config.

**List every color.** Extract every fill and stroke color used. Designers often reuse a small palette (8–16 colors), even if they haven't formalized it into styles. Name them semantically: `brand`, `surface`, `text-primary`, `text-secondary`, `border`, `accent`.

Now you have the foundation of a design system — before writing a single component.

---

## Step 2: Translate Figma Variables to Tailwind Config

This is the most impactful step most developers skip.

If your designer used Figma Variables, export them (Figma → Plugins → "Variables to JSON" or similar) and map them to your `tailwind.config.js`. If not, build the mapping manually from your audit.

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      brand: {
        DEFAULT: "#0A66E4",
        light: "#3D87F5",
        dark: "#0850B5",
      },
      surface: {
        DEFAULT: "#FFFFFF",
        subtle: "#F7F8FA",
        elevated: "#FFFFFF",
      },
      text: {
        primary: "#0E1117",
        secondary: "#5A6070",
        disabled: "#9BA3AF",
      },
      border: "#E2E5EA",
      accent: "#F97316",
    },
    spacing: {
      // 8pt grid
      1: "0.25rem", // 4px
      2: "0.5rem", // 8px
      3: "0.75rem", // 12px
      4: "1rem", // 16px
      6: "1.5rem", // 24px
      8: "2rem", // 32px
      12: "3rem", // 48px
      16: "4rem", // 64px
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
      sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.005em" }],
      base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
      lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
      xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.015em" }],
      "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
      "3xl": ["2rem", { lineHeight: "2.5rem", letterSpacing: "-0.025em" }],
    },
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
};
```

Now when you type `text-brand`, `bg-surface-subtle`, or `shadow-md`, you're using _the actual design tokens_. Not approximations. Not guesses. The exact values from the design file.

This is the single most important thing you can do for implementation fidelity.

---

## Step 3: Export Assets Correctly

Most "cheap-looking" implementations have blurry or incorrectly-sized assets. Here's the right approach:

**Icons:** Never export icons as PNG. Export as SVG. SVGs are resolution-independent, stylable with CSS, and tiny. In React, use them as components (either inline or via `@svgr/webpack`):

```bash
# Add SVGR to your Next.js/CRA project
npm install @svgr/webpack
```

```jsx
import ArrowIcon from "@/assets/icons/arrow.svg";

<ArrowIcon className="w-4 h-4 text-brand" />;
```

**Photography / raster images:** Export at 2× (for retina) in WebP format. Use Next.js `<Image>` or the `srcset` attribute to serve appropriately-sized images. Never export at 1× and scale up with CSS.

**Illustrations:** Always SVG if they're flat/vector. If they're complex (gradients, effects), export as WebP at 2×.

**Figma export settings:** Right-click frame → Export → set suffix `@2x`, format `WebP`, scale `2x`. For SVGs, make sure "Include id attributes" is off unless you need them for animation.

---

## Step 4: Use Figma's Layout Grid as Your Code Grid

Figma's layout grid (the column guides designers use) tells you exactly what the page grid is: number of columns, gutter, and margin.

A common setup is 12-column, 24px gutter, 80px margin on desktop.

In code:

```jsx
<div className="grid grid-cols-12 gap-6 px-20 max-w-screen-xl mx-auto">
  <main className="col-span-8">...</main>
  <aside className="col-span-4">...</aside>
</div>
```

Don't improvise the layout grid. It's documented in Figma — use it verbatim.

---

## Step 5: Pixel-Perfect Debugging

Once you've built the component, this is how I check fidelity:

1. Open the Figma design at 100% zoom alongside the browser
2. Use **Figma's Dev Mode** (Inspect panel) to read exact values: spacing, font size, weight, line height, border radius, shadow
3. In the browser, open DevTools and use the **Computed** tab to verify the actual rendered values match

The most common discrepancies:

- **Line height:** Figma shows it as a pixel value; CSS uses it as a ratio or rem. Do the math.
- **Letter spacing:** Figma shows it in `%`; CSS uses `em`. Divide by 100.
- **Shadow:** Figma separates blur from spread; CSS combines them as `offset-x offset-y blur spread color`.

<Callout type="tip">
  Figma's "Compare" view in Dev Mode lets you overlay your implementation with the design using a slider. It's brutal and accurate — highly recommend using it at least once per component.
</Callout>

---

## The Mindset: Tokens All the Way Down

The reason most implementations drift from the design is that developers make micro-decisions at the point of coding: "close enough," "I'll use the nearest Tailwind value," "I don't have that color so I'll pick something similar."

Every one of those micro-decisions is a small betrayal of the design.

When your Tailwind config is a mirror of the Figma Variables — when `bg-surface-subtle` _is_ the color the designer chose, not an approximation — you stop making those decisions. You just use the token. The system enforces fidelity automatically.

That's the workflow shift: from approximating the design to _being_ the design system.

---

Find all my open-source tools, games, and projects at [my portfolio](/).
