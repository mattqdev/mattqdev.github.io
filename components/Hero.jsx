"use client";
// components/Hero.jsx
// Tier A: ink ground, serif display (roman), mono metadata.
// The only Signal in view is the header cursor.
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { MarkLine } from "./brand/Mark";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay },
});

const socials = [
  {
    label: "Email",
    value: "mattqdevv@gmail.com",
    href: "mailto:mattqdevv@gmail.com",
  },
  { label: "GitHub", value: "mattqdev", href: "https://github.com/mattqdev" },
  { label: "X", value: "@mattqdev", href: "https://x.com/mattqdev" },
  {
    label: "Roblox",
    value: "MattQ",
    href: "https://www.roblox.com/users/2992118050",
  },
  { label: "Discord", value: "server", href: "https://discord.gg/PWkZyqQ7st" },
];

export default function Hero({ scrollToSection }) {
  return (
    <section id="hero" className="hero">
      <div className="container hero-grid">
        <div className="hero-text">
          <motion.div className="hero-meta label" {...fadeUp(0.05)}>
            <span>Software developer &amp; designer</span>
            <span className="hero-status">
              <span className="hero-status-key" aria-hidden="true" />
              Available for projects
            </span>
          </motion.div>

          <motion.h1 className="hero-title" {...fadeUp(0.12)}>
            Hi, I&rsquo;m MattQ<span className="dot-red">.</span>
          </motion.h1>

          <motion.p className="hero-lede" {...fadeUp(0.22)}>
            I love programming and designing UI/UX, specializing in web
            development, Roblox game development and cross-platform design.
          </motion.p>

          <motion.div className="hero-btns" {...fadeUp(0.32)}>
            <button
              type="button"
              className="btn"
              onClick={() => scrollToSection("projects")}
            >
              View projects <FaArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => scrollToSection("contact")}
            >
              Contact me
            </button>
          </motion.div>

          <motion.ul className="hero-socials" {...fadeUp(0.42)}>
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    s.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <span className="hero-social-label">{s.label}</span>
                  <span className="hero-social-value">{s.value}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.figure
          className="hero-figure"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
        >
          <div className="hero-figure-frame">
            <img
              src="/icons/avatar.png"
              alt="MattQ's Roblox avatar"
              width={720}
              height={720}
              fetchPriority="high"
            />
          </div>
          <figcaption className="label">
            <MarkLine className="hero-figure-mark" weight={22} />
            <span>Fig. 01 · Avatar</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
