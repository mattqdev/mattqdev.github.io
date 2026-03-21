"use client";
// components/Header.jsx
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero", name: "Home", href: "/#hero" },
  { id: "about", name: "About", href: "/#about" },
  { id: "projects", name: "Projects", href: "/projects" },
  { id: "skills", name: "Skills", href: "/#skills" },
  { id: "contact", name: "Contact", href: "/#contact" },
  { id: "blog", name: "Blog", href: "/blog" },
];

export default function Header({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (
        mobileMenuOpen &&
        !e.target.closest(".mobile-menu") &&
        !e.target.closest(".nav-links")
      )
        setMobileMenuOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [mobileMenuOpen]);

  // On blog pages the nav links are plain hrefs, not scroll anchors.
  // scrollToSection is a no-op for anchor links; Header handles href links directly.
  const scrollToSection = () => {};
  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="container header-container">
        <Link href="/" className="logo">
          Matt<span>Q</span>
        </Link>

        <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {SECTIONS.map((section) => {
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
