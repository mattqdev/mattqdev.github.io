"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "framer-motion";

// Loaded on demand — the Spline runtime is heavy and the scene sits below the fold
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

// Spline injects its "Built with Spline" badge asynchronously as a plain
// <a> element once the scene finishes loading, so it can't be targeted
// with a static CSS selector — a MutationObserver catches it whenever it
// shows up and hides it.
function hideWatermark(root) {
  const badge = root.querySelector('a[href*="spline.design"]');
  if (!badge) return false;
  badge.style.display = "none";
  return true;
}

export default function About3D() {
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef, { once: true, margin: "200px" });
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (inView && !reduceMotion) setMounted(true);
  }, [inView, reduceMotion]);

  useEffect(() => {
    const root = wrapperRef.current;
    if (!mounted || !root || hideWatermark(root)) return;

    const observer = new MutationObserver(() => hideWatermark(root));
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [mounted]);

  // Decorative animated scene: hidden from assistive tech, skipped
  // entirely when the user prefers reduced motion.
  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", minHeight: "inherit" }}
    >
      {mounted && (
        <Spline scene="https://prod.spline.design/ZtZrgOLXeLIWgEFb/scene.splinecode" />
      )}
    </div>
  );
}
