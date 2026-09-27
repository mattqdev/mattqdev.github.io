"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShare } from "react-icons/fa";
import { ProgressRing } from "./ProgressRing";
import { FaLink, FaCheck } from "react-icons/fa";

/* ── Share panel ─────────────── */
export function SharePanel({ project }) {
  // "idle" | "copied" | "failed"
  const [copyState, setCopyState] = useState("idle");
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };

  return (
    <div className="pd-share-panel">
      <p
        style={{
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          marginBottom: 10,
          fontFamily: "var(--font-mono)",
        }}
      >
        {project ? "SHARE THIS PROJECT" : "SHARE THIS PAGE"}
      </p>
      <div className="pd-share-url">
        <FaLink
          aria-hidden="true"
          style={{ color: "var(--text-muted)", flexShrink: 0 }}
        />
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
          }}
        >
          {url}
        </span>
        <button
          type="button"
          className={`pd-copy-btn ${copyState === "copied" ? "copied" : ""}`}
          onClick={copy}
        >
          {copyState === "copied" ? (
            <>
              <FaCheck aria-hidden="true" /> Copied!
            </>
          ) : copyState === "failed" ? (
            <>Copy failed — select the link</>
          ) : (
            <>
              <FaLink aria-hidden="true" /> Copy
            </>
          )}
        </button>
        <span className="sr-only" aria-live="polite">
          {copyState === "copied"
            ? "Link copied to clipboard"
            : copyState === "failed"
              ? "Couldn't copy the link. Select it and copy manually."
              : ""}
        </span>
      </div>
    </div>
  );
}

export function FloatingCluster({ project }) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    /* ── Floating action cluster ── */
    <div className="pd-fab-cluster" role="group" aria-label="Page actions">
      {/* Share */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          className="pd-fab"
          onClick={() => setShareOpen((o) => !o)}
          aria-label={project ? "Share project" : "Share page"}
          aria-expanded={shareOpen}
        >
          <FaShare aria-hidden="true" />
        </button>
        <AnimatePresence>
          {shareOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 6 }}
              transition={{ duration: 0.18 }}
            >
              <SharePanel project={project} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress ring scroll-to-top */}
      <ProgressRing />
    </div>
  );
}
