// src/components/Header.jsx
import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({
  sections,
  activeSection,
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection,
}) => {
  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="container header-container">
        <Link
          to="/"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("hero");
          }}
        >
          Matt<span>Q</span>
        </Link>

        {/* Desktop nav */}
        <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {sections.map((section) => (
            <li key={section.id}>
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
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
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
};

export default Header;
