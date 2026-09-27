// components/Header.jsx
"use client";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Owns its own scroll + mobile-menu state so it works on every route
// (homepage, /blog, /projects) without the layout wiring it up.
export default function Header({ activeSection, sections, scrollToSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className={isScrolled ? "scrolled" : ""}>
      <div className="container header-container">
        <Link href="/" className="logo">
          Matt<span>Q</span>
        </Link>

        <nav aria-label="Main">
          <ul
            id="main-nav"
            className={`nav-links ${mobileMenuOpen ? "active" : ""}`}
          >
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  {section.href ? (
                    // Route link (like /blog)
                    <Link
                      href={section.href}
                      className={isActive ? "active" : ""}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {section.name}
                    </Link>
                  ) : (
                    // Section on the homepage
                    <Link
                      href={`/#${section.id}`}
                      className={isActive ? "active" : ""}
                      aria-current={isActive ? "true" : undefined}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        if (
                          scrollToSection &&
                          window.location.pathname === "/"
                        ) {
                          e.preventDefault();
                          scrollToSection(section.id);
                        }
                      }}
                    >
                      {section.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="mobile-menu"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-nav"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                aria-hidden="true"
              >
                <FaTimes />
              </motion.span>
            ) : (
              <motion.span
                key="bars"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                aria-hidden="true"
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
