"use client";
// components/Header.jsx
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  sections,
  activeSection,
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection,
}) {
  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="container header-container">
        <Link href="/" className="logo">
          Matt<span>Q</span>
        </Link>

        <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {sections.map((section) => {
            // If the section has an explicit href (e.g. blog nav), use Next.js Link.
            // Otherwise fall back to scroll-anchor behaviour.
            const isHref = Boolean(section.href);

            return (
              <li key={section.id}>
                {isHref ? (
                  <Link
                    href={section.href}
                    className={activeSection === section.id ? "active" : ""}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {section.name}
                  </Link>
                ) : (
                  <a
                    href={`#${section.id}`}
                    className={activeSection === section.id ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(section.id);
                    }}
                  >
                    {section.name}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <button
          className="mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes />
              </motion.span>
            ) : (
              <motion.span
                key="bars"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaBars />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
