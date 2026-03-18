// src/components/Footer.jsx
import React from "react";
import { FaDiscord, FaEnvelope, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import robloxIcon from "../assets/icons/roblox.svg";

const links = [
  { href: "mailto:mattqdevv@gmail.com", icon: <FaEnvelope />, label: "Email" },
  { href: "https://x.com/mattqdev", icon: <FaXTwitter />, label: "Twitter" },
  { href: "https://github.com/mattqdev", icon: <FaGithub />, label: "GitHub" },
  {
    href: "https://discord.gg/ETgCMSps4c",
    icon: <FaDiscord />,
    label: "Discord",
  },
];

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            Matt<span>Q</span>
          </div>
          <p className="footer-tagline">Developer · Designer · Game Maker</p>

          <div className="footer-socials">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={l.label}
              >
                {l.icon}
              </a>
            ))}
            <a
              href="https://www.roblox.com/users/2992118050"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Roblox"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
              }}
            >
              <img
                src={robloxIcon}
                alt="Roblox"
                style={{ width: "44%" }}
                className="red-filter"
              />
            </a>
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} MattQ (@mattqdev) · made with{" "}
          <span>❤️</span> by MattQ
        </div>
      </div>
    </footer>
  );
};

export default Footer;
