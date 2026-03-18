"use client";
// components/SiteShell.jsx
// Owns scroll/active-section state previously in App.js.
// Marked 'use client' because it uses useEffect + window.
import { useState, useEffect } from "react";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

// Import SparklesPreview only if it's a client component — if it uses
// browser APIs it already needs 'use client'; no change required there.
import SparklesPreview from "./Particles";

const SECTIONS = [
  { id: "hero", name: "Home" },
  { id: "about", name: "About" },
  { id: "projects", name: "Projects" },
  { id: "skills", name: "Skills" },
  { id: "contact", name: "Contact" },
];

export default function SiteShell() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const pos = window.scrollY + 220;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveSection(sec.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile nav on outside click
  useEffect(() => {
    const close = (e) => {
      if (
        mobileMenuOpen &&
        !e.target.closest(".mobile-menu") &&
        !e.target.closest(".nav-links")
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [mobileMenuOpen]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <Header
        sections={SECTIONS}
        activeSection={activeSection}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      <main>
        <Hero scrollToSection={scrollToSection} />
        <SparklesPreview />
        <About />
        <SparklesPreview />
        <Projects />
        <SparklesPreview />
        <Skills />
        <Contact />
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
}
