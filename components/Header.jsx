// components/Header.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MarkLine } from "./brand/Mark";

// Owns its own scroll + mobile-menu state so it works on every route
// (homepage, /blog, /projects) without the layout wiring it up.
// Tier A lockup: line mark · rule · handle. The cursor is the page's one Signal.
export default function Header({ activeSection, sections, scrollToSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
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
    <header
      className={`site-header ${isScrolled ? "scrolled" : ""} ${mobileMenuOpen ? "menu-open" : ""}`}
    >
      <div className="container header-container">
        <Link href="/" className="logo" aria-label="Matt (@mattqdev), home">
          <MarkLine className="logo-mark" weight={22} />
          <span className="logo-rule" aria-hidden="true" />
          <span className="logo-handle" aria-hidden="true">
            @mattqdev<span className="cursor">_</span>
          </span>
        </Link>

        <nav aria-label="Main">
          <ul
            id="main-nav"
            className={`nav-links ${mobileMenuOpen ? "active" : ""}`}
          >
            {sections.map((section, i) => {
              const isActive = activeSection === section.id;
              const props = {
                className: `nav-link ${isActive ? "active" : ""}`,
                "aria-current": isActive
                  ? section.href
                    ? "page"
                    : "true"
                  : undefined,
              };
              const label = (
                <>
                  <span className="nav-index" aria-hidden="true">
                    {String(i).padStart(2, "0")}
                  </span>
                  {section.name}
                </>
              );
              return (
                <li key={section.id}>
                  {section.href ? (
                    <Link
                      href={section.href}
                      {...props}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ) : (
                    <Link
                      href={`/#${section.id}`}
                      {...props}
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
                      {label}
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
        >
          <span className="mobile-menu-text" aria-hidden="true">
            {mobileMenuOpen ? "Close" : "Menu"}
          </span>
          <span className="mobile-menu-icon" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
