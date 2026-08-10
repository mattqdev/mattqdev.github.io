"use client";
import { useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";

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

  useEffect(() => {
    const root = wrapperRef.current;
    if (!root || hideWatermark(root)) return;

    const observer = new MutationObserver(() => hideWatermark(root));
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <Spline scene="https://prod.spline.design/ZtZrgOLXeLIWgEFb/scene.splinecode" />
    </div>
  );
}
