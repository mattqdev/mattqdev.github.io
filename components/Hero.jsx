"use client";
// components/Hero.jsx
import { FaDiscord, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
// Images in Next.js: put avatar.png and roblox.svg in /public/icons/
// and reference them as string paths — no import needed (or use next/image).
import { AuroraBackground } from "./AuroraBackground";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut", delay },
});

export default function Hero({ scrollToSection }) {
  return (
    <section id="hero" className="hero section">
      <AuroraBackground />
      <div className="container hero-content">
        <div className="hero-text">
          <motion.div className="hero-eyebrow" {...fadeUp(0.1)}>
            Available for projects
          </motion.div>

          <motion.h1 className="border-dotted" {...fadeUp(0.2)}>
            Hi, I'm <span className="name">MattQ</span>
            <span className="role">Software Developer & Designer</span>
          </motion.h1>

          <motion.p {...fadeUp(0.35)}>
            I love programming and designing UI/UX — specializing in Web
            Development, Roblox game development, and cross-platform design.
          </motion.p>

          <motion.div className="hero-btns" {...fadeUp(0.45)}>
            <button className="btn" onClick={() => scrollToSection("projects")}>
              View Projects
            </button>
            <button
              className="btn btn-outline"
              onClick={() => scrollToSection("contact")}
            >
              Contact Me
            </button>
          </motion.div>

          <motion.div className="social-icons" {...fadeUp(0.55)}>
            <a
              href="mailto:mattqdevv@gmail.com"
              className="social-icon"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://x.com/mattqdev"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Twitter"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.roblox.com/users/2992118050"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Roblox"
            >
              {/* Put roblox.svg in /public/icons/roblox.svg */}
              <img
                src="/icons/roblox.svg"
                alt="Roblox"
                style={{ width: "42%" }}
              />
            </a>
            <a
              href="https://discord.gg/ETgCMSps4c"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Discord"
            >
              <FaDiscord />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.9,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.2,
          }}
        >
          <div className="hero-img-container">
            <div className="placeholder-avatar">
              {/* Put avatar.png in /public/icons/avatar.png */}
              <img
                src="/icons/avatar.png"
                title="MattQ's Roblox Avatar"
                alt="MattQ's Avatar"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
