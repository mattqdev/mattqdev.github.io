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
import { scrollBehavior } from "@/lib/motion";

export const SECTIONS = [
  { id: "hero", name: "Home" },
  { id: "about", name: "About" },
  { id: "projects", name: "Projects", href: "/projects" },
  { id: "skills", name: "Skills" },
  { id: "contact", name: "Contact" },
  { id: "blog", name: "Blog", href: "/blog" },
];

export default function SiteShell() {
  const [activeSection, setActiveSection] = useState("hero");

  // Track the section crossing the upper-middle of the viewport. Each
  // section component renders its own <section id="…">.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    for (const sec of SECTIONS.filter((s) => !s.href)) {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Offset for the fixed header comes from `scroll-padding-top` on <html>
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <>
      <Header
        activeSection={activeSection}
        sections={SECTIONS}
        scrollToSection={scrollToSection}
      />
      <main id="main">
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
