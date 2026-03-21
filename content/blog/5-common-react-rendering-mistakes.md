---
title: "Why Your React App is Slow: 5 Common Re-rendering Traps"
description: "Your components are re-rendering way more than they need to. Here's exactly why — and how useMemo, useCallback, and smarter Context usage will make your app feel instant."
date: "2026-03-14"
tags: ["React", "Performance", "JavaScript", "Web Dev", "Optimization"]
cover: null
---

You add an input field. You type. The whole page feels like it's hiccupping. You open DevTools, look at the Profiler, and see a wave of re-renders cascading across 40 components — because the user pressed a single key.

This isn't a React problem. It's a pattern problem.

React's rendering model is simple: when state changes, components re-render. What trips people up is _how far that wave travels_. Here are the five traps I see most often, and how to escape them.

---

## Trap 1: Inline Object and Array Literals in JSX

This is the most common, and the most invisible.

```jsx
// Every render creates a brand new object reference
<MyComponent config={{ theme: "dark", size: "lg" }} />
```

Even if `theme` and `size` haven't changed, React sees a _new object_ on every render and tells `MyComponent` to re-render. JavaScript compares objects by reference, not by value.

**Fix:** Move static objects and arrays outside the component, or memoize them.

```jsx
// Defined once — stable reference
const CONFIG = { theme: "dark", size: "lg" };

function ParentComponent() {
  return <MyComponent config={CONFIG} />;
}
```

If it _needs_ to be dynamic, that's where `useMemo` enters.

---

## Trap 2: Missing `useMemo` on Expensive Derivations

```jsx
function ProductList({ products, filter }) {
  // Runs on EVERY render, even if products and filter haven't changed
  const filtered = products.filter((p) => p.category === filter);

  return filtered.map((p) => <ProductCard key={p.id} product={p} />);
}
```

If the parent re-renders for any reason (a sidebar toggle, a modal open), `filtered` recalculates across thousands of products.

**Before:**

```jsx
const filtered = products.filter((p) => p.category === filter);
```

**After:**

```jsx
const filtered = useMemo(
  () => products.filter((p) => p.category === filter),
  [products, filter]
);
```

Now `filtered` only recalculates when `products` or `filter` actually changes. Everything else is cached.

<Callout type="tip">
  Don't reach for `useMemo` everywhere — it has its own cost. Use it when the computation is genuinely expensive (sorting, filtering large arrays, complex math) or when the result is passed to a memoized child.
</Callout>

---

## Trap 3: Missing `useCallback` on Event Handlers

Inline functions are recreated on every render. When you pass them as props to child components, those children see a new function reference and re-render — even if the function's logic hasn't changed.

**Before:**

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // New function reference on every render
  const handleClick = () => setCount((c) => c + 1);

  return <ExpensiveChild onAction={handleClick} />;
}
```

**After:**

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // Stable reference — ExpensiveChild won't re-render unnecessarily
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // no dependencies — uses functional updater

  return <ExpensiveChild onAction={handleClick} />;
}
```

Pair this with `React.memo` on `ExpensiveChild` and you've broken the re-render chain:

```jsx
const ExpensiveChild = React.memo(function ExpensiveChild({ onAction }) {
  console.log("rendered"); // only when onAction reference changes
  return <button onClick={onAction}>Do something</button>;
});
```

---

## Trap 4: One Massive Context That Holds Everything

This is the architectural trap. It starts innocently:

```jsx
const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [cart, setCart] = useState([]);

  return (
    <AppContext.Provider value={{ user, theme, notifications, cart, setCart, ... }}>
      <Router />
    </AppContext.Provider>
  );
}
```

Now every component that calls `useContext(AppContext)` re-renders whenever _any_ piece of that state changes — including when a notification arrives, even if the component only cares about the cart.

**Fix: Split your context by update frequency.**

```jsx
// Stable — changes rarely
const UserContext = createContext();
const ThemeContext = createContext();

// Dynamic — changes frequently
const CartContext = createContext();
const NotificationContext = createContext();
```

Components that only subscribe to `ThemeContext` are completely isolated from cart updates. This is the single highest-leverage architectural fix for Context-heavy apps.

For complex global state, consider reaching for [Zustand](https://github.com/pmndrs/zustand) — a lightweight store that only re-renders subscribers of the specific slices they use.

---

## Trap 5: Rendering Lists Without Stable Keys

```jsx
// Bad — index as key
{
  items.map((item, index) => <Card key={index} item={item} />);
}
```

When the list order changes (sorting, prepending), React uses the key to match old and new elements. Using the index means React thinks item 0 is still item 0 — it updates the DOM instead of re-using it, blowing away local state inside `Card` (scroll position, expanded state, input values).

**Fix:** Always use a stable, unique identifier.

```jsx
{
  items.map((item) => <Card key={item.id} item={item} />);
}
```

If your data doesn't have an `id`, generate one at the API layer or with a library like `nanoid` when the item is created — not inside the render function.

---

## The Profiler Is Your Best Friend

Before optimizing, **measure**. Open React DevTools → Profiler, hit Record, interact with the slow part, stop recording. You'll see exactly which components rendered, how long each took, and what triggered them.

The tab you want is "Why did this render?" — it tells you if it was a prop change, a state change, or a context update.

Optimize what the Profiler tells you is slow. Don't guess.

---

## Summary

| Trap                         | Fix                                      |
| ---------------------------- | ---------------------------------------- |
| Inline object/array literals | Move outside component or use `useMemo`  |
| Expensive derivations        | `useMemo` with correct dependencies      |
| Unstable event handlers      | `useCallback` + `React.memo` on children |
| Monolithic Context           | Split by update frequency                |
| Index-based list keys        | Use stable entity IDs                    |

React is fast by default. It only gets slow when you accidentally teach it to do more work than it needs to. Once you internalize these five patterns, you stop writing slow code at the source — rather than fixing it later.

---

I write about React architecture and performance on this blog. Find all my projects and open-source work at [my portfolio](/).
