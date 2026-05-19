---
title: "React Server Components vs. Client Components: A Practical Decision Framework"
description: "Not everything needs 'use client'. Here's how to actually decide where the server/client boundary goes in your Next.js App Router app — with real patterns, tradeoffs, and a decision tree you can use today."
date: "2026-05-19"
tags: ["React", "Next.js", "Web Dev", "Frontend", "Performance", "App Router"]
cover: null
---

The React team spent years building Server Components. Next.js made them the default in the App Router. And then every tutorial you found either avoided explaining them properly, or made them sound so complicated that you just started adding `"use client"` to everything to make the errors stop.

This is that explanation done right.

By the end of this article, you'll have a concrete decision process — not a list of rules to memorize, but a mental model that makes the right choice obvious in any situation.

---

## The One Sentence That Changes Everything

React Server Components **render on the server and send HTML to the client. They never ship their component code to the browser.**

That's it. That's the whole model. Everything else — the rules, the constraints, the patterns — follows from that sentence.

A Server Component is executed in a Node.js environment (or edge runtime). It can `await` a database query directly. It can read environment variables. It can access the filesystem. And when it's done, it sends the rendered output — just HTML and some React metadata — to the client. The JavaScript that made up that component is never in the browser's bundle.

A Client Component runs in the browser. It can use `useState`, `useEffect`, event handlers, browser APIs. It's the React you've been writing for years. You opt in with `"use client"` at the top of the file.

The practical implication: **every kilobyte of a Client Component is JavaScript that must be downloaded, parsed, and executed by the browser. Every Server Component costs zero bytes in the client bundle.**

---

## The Decision Framework

Before adding `"use client"`, ask these questions in order. Stop at the first "yes."

### 1. Does this component use interactivity?

Event handlers (`onClick`, `onChange`, `onSubmit`), `useState`, `useReducer`, `useRef`, drag-and-drop, keyboard listeners — any of these means Client Component.

```tsx
// ✅ Client Component — has state and event handler
"use client";

import { useState } from "react";

export function SearchBar() {
    const [query, setQuery] = useState("");

    return (
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
        />
    );
}
```

### 2. Does this component use browser-only APIs?

`window`, `document`, `localStorage`, `navigator`, `IntersectionObserver`, `ResizeObserver` — Client Component.

```tsx
// ✅ Client Component — uses browser API
"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setProgress((scrolled / total) * 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return <div style={{ width: `${progress}%` }} className="progress-bar" />;
}
```

### 3. Does this component depend on third-party libraries that use the above?

If you're using a charting library that calls `window.devicePixelRatio`, an animation library that attaches DOM listeners, or a rich text editor that requires the browser's selection API — Client Component, even if your wrapper itself doesn't look like it needs to be.

### 4. None of the above?

**Server Component.** Don't add `"use client"`.

```tsx
// ✅ Server Component — fetches data, renders static structure
// No "use client" needed

import { db } from "@/lib/database";

export async function UserProfile({ userId }: { userId: string }) {
    // This runs on the server. The database query never touches the client.
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) return <div>User not found</div>;

    return (
        <div className="profile">
            <h1>{user.name}</h1>
            <p>{user.bio}</p>
            <span>{user.location}</span>
        </div>
    );
}
```

---

## The Pattern That Trips People Up: The Leaf Rule

The most common mistake is making an entire page or layout a Client Component because one small interactive piece needs it. This voids the performance benefit entirely.

**The correct pattern: push Client Components to the leaves of your component tree.**

```tsx
// ❌ WRONG: The whole page becomes a Client Component
"use client";

import { useState } from "react";
import { db } from "@/lib/database"; // ← This won't even work in a Client Component

export default function BlogPost({ postId }: { postId: string }) {
    const [likes, setLikes] = useState(0);

    // You can't await here in a Client Component
    const post = await db.post.findUnique({ where: { id: postId } });

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <button onClick={() => setLikes(l => l + 1)}>
                👍 {likes}
            </button>
        </article>
    );
}
```

```tsx
// ✅ CORRECT: Data fetching stays on the server, only the button is a Client Component

// app/blog/[id]/page.tsx — Server Component
import { db } from "@/lib/database";
import { LikeButton } from "@/components/LikeButton";

export default async function BlogPost({ params }: { params: { id: string } }) {
    const post = await db.post.findUnique({ where: { id: params.id } });
    if (!post) notFound();

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            {/* Only this leaf is a Client Component */}
            <LikeButton initialCount={post.likes} postId={post.id} />
        </article>
    );
}

// components/LikeButton.tsx — Client Component
"use client";

import { useState } from "react";

export function LikeButton({ initialCount, postId }: { initialCount: number; postId: string }) {
    const [likes, setLikes] = useState(initialCount);

    const handleLike = async () => {
        setLikes(l => l + 1);
        await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    };

    return (
        <button onClick={handleLike}>👍 {likes}</button>
    );
}
```

In the correct version, the entire article — title, content, author info, metadata — is rendered server-side and costs zero client JavaScript. Only the 15-line LikeButton is shipped to the browser.

---

## Passing Data Across the Boundary

Server Components can pass data to Client Components as props. But the data must be **serializable** — no functions, no class instances, no Promises, no `Date` objects (use `.toISOString()` instead).

```tsx
// ✅ Serializable props — fine
<ClientComponent
    title={post.title}         // string
    count={post.views}         // number
    tags={post.tags}           // string[]
    publishedAt={post.createdAt.toISOString()} // ISO string, not Date
/>

// ❌ Non-serializable — will throw
<ClientComponent
    onSave={() => db.save()} // function defined in server scope
    instance={new MyClass()} // class instance
/>
```

---

## Context Providers: The Exception

Context (like `ThemeContext`, `AuthContext`) requires Client Components because `createContext` and `useContext` are client-side APIs. But the providers are typically wrappers — they don't fetch data themselves.

The right pattern: create a thin Client Component provider wrapper, and keep the data fetching outside it.

```tsx
// providers/ThemeProvider.tsx
"use client";

import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    return (
        <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === "light" ? "dark" : "light") }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};

// app/layout.tsx — Server Component that wraps with the Client Provider
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                {/* ThemeProvider is "use client", but RootLayout is still a Server Component */}
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
```

The key insight: **a Server Component can render a Client Component as a child without becoming a Client Component itself.** The `children` prop passed through the provider remains server-rendered. This is called the "server-in-client" composition pattern, and it's the trick that keeps most of your layout server-side even when you need context.

---

## Third-Party Libraries That Break the Boundary

If you're installing a library and getting an error like:

```
Error: useState can only be used in a Client Component
```

The library is trying to use browser APIs at the module level. Your options:

**Option 1: Wrap it in your own Client Component**

```tsx
// components/Chart.tsx
"use client";
import { LineChart } from "some-charting-library"; // uses window internally

export function MyLineChart({ data }: { data: number[] }) {
    return <LineChart data={data} />;
}
```

**Option 2: Dynamic import with `ssr: false`** (for heavy libraries you don't need on first render)

```tsx
// app/dashboard/page.tsx — Server Component
import dynamic from "next/dynamic";

const HeavyEditor = dynamic(() => import("@/components/RichTextEditor"), {
    ssr: false, // never render on server, load only when needed client-side
    loading: () => <div>Loading editor...</div>,
});

export default function DashboardPage() {
    return (
        <main>
            <h1>Dashboard</h1>
            <HeavyEditor /> {/* loads lazily, excluded from SSR bundle */}
        </main>
    );
}
```

`ssr: false` is powerful but expensive — it removes the component from the server render entirely and forces a client-side load. Use it for large libraries (map renderers, rich text editors, 3D viewers) that genuinely can't run on the server. Don't use it as a quick fix for boundary errors.

---

## The Decision Tree (Printable Version)

```
Does this component use useState, useReducer, useRef, or event handlers?
│
├─ YES → "use client"
│
└─ NO → Does it use browser APIs (window, document, localStorage)?
         │
         ├─ YES → "use client"
         │
         └─ NO → Does it import a library that uses browser APIs internally?
                  │
                  ├─ YES → Wrap that library in a small Client Component leaf
                  │
                  └─ NO → Server Component. Fetch data. No "use client".
```

---

## What This Looks Like at Scale

On a real Next.js App Router application, the component distribution roughly looks like this:

| Component Type | Examples | Ratio |
|---|---|---|
| Server Components | Pages, layouts, data-fetching containers, static UI | ~70% |
| Client Components | Interactive widgets, forms, accordions, carousels | ~25% |
| Boundary wrappers | Context providers, library wrappers | ~5% |

If you find that >50% of your components have `"use client"`, something is wrong. Either the app is highly interactive by nature (a real-time dashboard, a collaborative editor) — or the boundary is being placed too high in the tree.

---

## The Performance Payoff

The reason all of this matters: a typical React SPA ships 150–400kB of JavaScript before a user sees anything meaningful. With proper RSC usage, you can cut that number dramatically — sometimes by 60–80% — because entire sections of your UI are HTML by the time they reach the browser.

Smaller bundles mean:
- Faster Time to Interactive (TTI)
- Better Lighthouse scores (which affect SEO rankings)
- Significantly better performance on mid-range mobile devices
- Lower data usage for users on metered connections

This is the actual reason Server Components exist: not to be conceptually clever, but because shipping less JavaScript to users is one of the highest-impact performance improvements available to a frontend engineer.

---

For more React and UI patterns, I've written about [avoiding common React rendering mistakes](/blog/5-common-react-rendering-mistakes) and [designing dark mode interfaces that actually work](/blog/how-to-make-a-good-dark-mode-design). If you're building with Next.js and want to talk architecture, reach me at [mattqdev](/).
