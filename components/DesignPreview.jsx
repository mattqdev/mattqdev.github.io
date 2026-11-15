"use client";
// components/DesignPreview.jsx
// Homepage teaser for /design: one cover per design project, each a link
// straight to its group on the design page.
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { DESIGN_GROUPS } from "@/data/design";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function DesignPreview() {
  const count = DESIGN_GROUPS.reduce((n, g) => n + g.images.length, 0);
  return (
    <section id="design" className="section">
      <motion.div
        className="container"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ staggerChildren: 0.08 }}
      >
        <div className="section-head">
          <div className="section-head-main">
            <span className="label">03 · Visual portfolio</span>
            <motion.h2 className="h-display" variants={fadeUp}>
              Design<span className="dot-red">.</span>
            </motion.h2>
          </div>
          <p className="section-lede">
            Brand identities, launch kits, campaigns and game GFX:{" "}
            {DESIGN_GROUPS.length} projects, {count} graphics.
          </p>
        </div>

        <motion.ul className="design-preview" variants={fadeUp}>
          {DESIGN_GROUPS.map((g) => (
            <li key={g.id}>
              <Link href={`/design#${g.id}`} className="design-preview-tile">
                <img
                  src={`/design/${g.cover}.webp`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="design-preview-caption">
                  <span>{g.title}</span>
                  <span className="mono">{g.kind}</span>
                </span>
              </Link>
            </li>
          ))}
        </motion.ul>

        <motion.div className="projects-more" variants={fadeUp}>
          <Link href="/design" className="btn btn-outline">
            Open the design portfolio <FaArrowRight aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
