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

export default function SiteShell() {
  const [activeSection, setActiveSection] = useState("hero");

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
      <Header activeSection={activeSection} />
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
