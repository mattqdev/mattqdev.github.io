// lib/motion.js
// Browser-only helpers for honoring prefers-reduced-motion outside framer-motion.

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function scrollBehavior() {
  return prefersReducedMotion() ? "auto" : "smooth";
}
