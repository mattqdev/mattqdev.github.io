"use client";
// components/Contact.jsx
import { useState } from "react";
import { FaDiscord, FaEnvelope, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const socials = [
  {
    icon: <FaEnvelope />,
    label: "Email",
    value: "mattqdevv@gmail.com",
    href: "mailto:mattqdevv@gmail.com",
  },
  {
    icon: <FaDiscord />,
    label: "Discord",
    value: "@mattqdev",
    href: "https://discord.gg/ETgCMSps4c",
  },
  {
    icon: <FaTwitter />,
    label: "Twitter / X",
    value: "@mattqdev",
    href: "https://x.com/mattqdev",
  },
  {
    // Roblox icon served from public/icons/roblox.svg — no import needed
    roblox: true,
    label: "Roblox",
    value: "MattQ Profile",
    href: "https://www.roblox.com/users/2992118050",
  },
];

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    const data = new FormData(form);

    try {
      // Replace with your own endpoint (Formspree, Basin, a Next.js API route, etc.)
      // Example using a Next.js API route at /api/contact:
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-footer">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="section-title">
          <div className="section-label">Get in touch</div>
          <motion.h2 variants={fadeUp}>
            Contact <em>Me</em>
          </motion.h2>
          <p>
            Whether it's a project idea, bug report, or just a hello — I'm all
            ears.
          </p>
        </div>

        <div className="contact-container">
          {/* Left: social links */}
          <motion.div className="contact-info" variants={containerVariants}>
            {socials.map((s, i) => (
              <motion.div key={i} className="contact-item" variants={fadeUp}>
                <div className="contact-icon">
                  {s.roblox ? (
                    <img
                      src="/icons/roblox.svg"
                      alt="Roblox"
                      draggable="false"
                      className="contact-icon-svg red-filter"
                    />
                  ) : (
                    s.icon
                  )}
                </div>
                <div className="contact-details">
                  <h3>{s.label}</h3>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {s.value}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: form */}
          <motion.div className="contact-form" variants={fadeUp}>
            {status === "success" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  padding: "60px 20px",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem" }}>🎉</div>
                <h3 style={{ fontFamily: "var(--font-display)" }}>
                  Message Sent!
                </h3>
                <p
                  style={{ color: "var(--text-secondary)", fontSize: ".9rem" }}
                >
                  Thanks for reaching out. I'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name (optional)"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email (optional)"
                  />
                </div>
                <div className="form-group">
                  <input type="text" name="subject" placeholder="Subject" />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your message — suggestions, bug reports, collabs…"
                    required
                  />
                </div>
                {status === "error" && (
                  <p
                    style={{
                      color: "var(--primary)",
                      fontSize: ".85rem",
                      marginBottom: 12,
                    }}
                  >
                    Something went wrong. Try emailing me directly.
                  </p>
                )}
                <button
                  type="submit"
                  className="btn"
                  disabled={status === "sending"}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
