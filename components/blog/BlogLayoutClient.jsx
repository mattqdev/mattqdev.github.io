"use client";
// components/blog/BlogLayoutClient.jsx
// Owns the scroll/activeSection state that Header needs.
// Mirrors SiteShell but for blog routes — no section-scroll logic,
// just header scroll detection and mobile menu.
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SECTIONS = [
  { id: "hero", name: "Home", href: "/#hero" },
  { id: "about", name: "About", href: "/#about" },
  { id: "projects", name: "Projects", href: "/#projects" },
  { id: "skills", name: "Skills", href: "/#skills" },
  { id: "contact", name: "Contact", href: "/#contact" },
  { id: "blog", name: "Blog", href: "/blog" },
];

export default function BlogLayoutClient({ children }) {
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
    <>
      <Header
        sections={SECTIONS}
        activeSection="blog"
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
      />
      {children}
      <Footer />
    </>
  );
}
