"use client";
// components/Contact.jsx
import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaDiscord, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
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
    value: "MattQ Studios",
    href: "https://discord.gg/PWkZyqQ7st",
  },
  {
    icon: <FaXTwitter />,
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
  const successRef = useRef(null);

  // Move focus to the confirmation so keyboard/screen-reader users know it worked
  useEffect(() => {
    if (status.succeeded) successRef.current?.focus();
  }, [status.succeeded]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check if the URL actually exists before trying to fetch
    const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      console.error("Webhook URL is missing!");
      setStatus({
        submitting: false,
        succeeded: false,
        error:
          "The contact form isn't available right now. Please email mattqdevv@gmail.com instead.",
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
        error:
          "Couldn't send your message. Check your connection and try again, or email mattqdevv@gmail.com.",
      });
    }
  };

  return (
    <section id="contact" className="section section--contact">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="section-head">
          <div className="section-head-main">
            <span className="label">05 · Get in touch</span>
            <motion.h2 className="h-display" variants={fadeUp}>
              Contact me<span className="dot-red">.</span>
            </motion.h2>
          </div>
          <p className="section-lede">
            Whether it&rsquo;s a project idea, bug report, or just a hello,
            I&rsquo;m all ears.
          </p>
        </div>

        <div className="contact-grid">
          <motion.ul className="contact-channels" variants={containerVariants}>
            {socials.map((s) => (
              <motion.li key={s.label} variants={fadeUp}>
                <a
                  href={s.href}
                  className="contact-channel"
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    s.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <span className="contact-icon" aria-hidden="true">
                    {s.roblox ? (
                      <img
                        src="/icons/roblox.svg"
                        alt=""
                        width={18}
                        height={18}
                        draggable="false"
                        className="contact-icon-svg"
                      />
                    ) : (
                      s.icon
                    )}
                  </span>
                  <span className="contact-label mono">{s.label}</span>
                  <span className="contact-value">{s.value}</span>
                  <FaArrowRight className="contact-go" aria-hidden="true" />
                </a>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="contact-form" variants={fadeUp}>
            {status.succeeded ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                className="contact-success"
              >
                <span className="label">Message sent</span>
                <p className="contact-success-title">
                  Thanks for reaching out.
                </p>
                <p>I&rsquo;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">
                      Name <span>optional</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name…"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      spellCheck={false}
                      placeholder="you@example.com…"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    autoComplete="off"
                    placeholder="e.g. Collab on a Roblox game…"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    autoComplete="off"
                    placeholder="Suggestions, bug reports, collabs…"
                    required
                  />
                </div>
                {status.error && (
                  <p role="alert" className="form-error">
                    {status.error}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn btn-block"
                  disabled={status.submitting}
                >
                  {status.submitting ? "Sending…" : "Send message"}
                  {!status.submitting && <FaArrowRight aria-hidden="true" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
