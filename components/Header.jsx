// components/Header.jsx
"use client";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  activeSection,
  sections,
  scrollToSection,
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  return (
    <header className={isScrolled ? "scrolled" : ""}>
      <div className="container header-container">
        <Link href="/" className="logo">
          Matt<span>Q</span>
        </Link>

        <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {sections.map((section) => (
            <li key={section.id}>
              {section.href ? (
                // If it's an external link (like /blog)
                <Link
                  href={section.href}
                  className={activeSection === section.id ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {section.name}
                </Link>
              ) : (
                // If it's an ID on the current page
                <Link
                  href={`/#${section.id}`}
                  className={activeSection === section.id ? "active" : ""}
                  onClick={(e) => {
                    if (window.location.pathname === "/") {
                      e.preventDefault();
                      scrollToSection(section.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  {section.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <button
          className="mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <FaTimes />
              </motion.span>
            ) : (
              <motion.span
                key="bars"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
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
