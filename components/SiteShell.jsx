"use client";
// components/SiteShell.jsx
import { useState, useEffect } from "react";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import SparklesPreview from "./Particles";

// Sections with scroll anchors use no `href` — Header will use the
// scroll-anchor path. Blog uses `href` so Header renders a <Link>.
const SECTIONS = [
  { id: "hero", name: "Home" },
  { id: "about", name: "About" },
  { id: "projects", name: "Projects" },
  { id: "skills", name: "Skills" },
  { id: "contact", name: "Contact" },
  { id: "blog", name: "Blog", href: "/blog" },
];

export default function SiteShell() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const pos = window.scrollY + 220;
      // Only track scroll-anchor sections (no href)
      for (const sec of SECTIONS.filter((s) => !s.href)) {
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
