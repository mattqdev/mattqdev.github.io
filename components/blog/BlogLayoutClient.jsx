"use client";
// components/blog/BlogLayoutClient.jsx
// Shared Header + Footer for blog routes. Header owns its own scroll and
// mobile-menu state.
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SECTIONS } from "@/components/SiteShell";

export default function BlogLayoutClient({ children }) {
  return (
    <>
      <Header activeSection="blog" sections={SECTIONS} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
