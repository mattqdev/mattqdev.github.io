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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);

      const pos = window.scrollY + 220;
      // Only track sections that exist on the current page (no external href)
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
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <Header
        activeSection={activeSection}
        sections={SECTIONS}
        scrollToSection={scrollToSection}
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main>
        <section id="hero">
          <Hero scrollToSection={scrollToSection} />
        </section>
        <SparklesPreview />
        <section id="about">
          <About />
        </section>
        <SparklesPreview />
        <section id="projects">
          <Projects />
        </section>
        <SparklesPreview />
        <section id="skills">
          <Skills />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
