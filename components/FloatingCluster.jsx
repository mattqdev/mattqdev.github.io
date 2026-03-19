import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShare } from "react-icons/fa";
import { ProgressRing } from "./ProgressRing";
import { FaLink, FaCheck } from "react-icons/fa";

/* ── Share panel ─────────────── */
export function SharePanel({ project }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* fallback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        SHARE THIS PROJECT
      </p>
      <div className="pd-share-url">
        <FaLink style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <span
          style={{
            flex: 1,
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
          className={`pd-copy-btn ${copied ? "copied" : ""}`}
          onClick={copy}
        >
          {copied ? (
            <>
              <FaCheck /> Copied!
            </>
          ) : (
            <>
              <FaLink /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function FloatingCluster({ project }) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    /* ── Floating action cluster ── */
    <div className="pd-fab-cluster" aria-label="Page actions">
      {/* Share */}
      <div style={{ position: "relative" }}>
        <button
          className="pd-fab"
          onClick={() => setShareOpen((o) => !o)}
          aria-label="Share project"
          aria-expanded={shareOpen}
        >
          <FaShare />
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
