"use client";
// components/blog/BlogLayoutClient.jsx
// Owns the scroll/activeSection state that Header needs.
// Mirrors SiteShell but for blog routes — no section-scroll logic,
// just header scroll detection and mobile menu.
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SECTIONS } from "@/components/SiteShell";

export default function BlogLayoutClient({ children }) {
  return (
    <>
      <Header activeSection="blog" sections={SECTIONS} />
      {children}
      <Footer />
    </>
  );
}
