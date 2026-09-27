"use client";
// components/ScrollToTop.jsx
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { scrollBehavior } from "@/lib/motion";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: scrollBehavior(),
    });
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FaArrowUp aria-hidden="true" />
    </button>
  );
};

export default ScrollToTop;
