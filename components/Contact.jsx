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
  const [status, setStatus] = useState({
    submitting: false,
    succeeded: false,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check if the URL actually exists before trying to fetch
    const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      console.error("Webhook URL is missing!");
      setStatus({
        submitting: false,
        succeeded: false,
        error: "Configuration error.",
      });
      return;
    }

    setStatus({ submitting: true, succeeded: false, error: null });

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const discordPayload = {
      username: "Portfolio Bot",
      // Adding 'content' ensures you get a notification on your device
      content: `🔔 **New portfolio message from ${data.name || "someone"}!**`,
      embeds: [
        {
          title: data.subject || "No Subject",
          color: 0x5865f2,
          fields: [
            { name: "👤 Name", value: data.name || "Anonymous", inline: true },
            {
              name: "📧 Email",
              value: data.email || "Not provided",
              inline: true,
            },
            { name: "💬 Message", value: `\`\`\`${data.message}\`\`\`` },
          ],
          footer: { text: "mattqdev.github.io" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload),
      });

      if (!response.ok) throw new Error("Server responded with error");

      setStatus({ submitting: false, succeeded: true, error: null });
      e.target.reset(); // Clear the form
    } catch (err) {
      setStatus({
        submitting: false,
        succeeded: false,
        error: "Could not send. Check your connection or try again later.",
      });
    }
  };

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
            {status.succeeded ? (
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
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your message — suggestions, bug reports, collabs…"
                    required
                  />
                </div>
                {status.error && (
                  <p
                    style={{
                      color: "var(--primary)",
                      fontSize: ".85rem",
                      marginBottom: 12,
                    }}
                  >
                    {status.error}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn"
                  disabled={status.submitting}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {status.submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
