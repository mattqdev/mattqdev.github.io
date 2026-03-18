// components/Footer.jsx
// No 'use client' needed — no hooks or browser APIs
import { FaDiscord, FaEnvelope, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const links = [
  { href: "mailto:mattqdevv@gmail.com", icon: <FaEnvelope />, label: "Email" },
  {
    href: "https://x.com/mattqdev",
    target: "_blank",
    icon: <FaXTwitter />,
    label: "Twitter",
  },
  {
    href: "https://github.com/mattqdev",
    target: "_blank",
    icon: <FaGithub />,
    label: "GitHub",
  },
  {
    href: "https://discord.gg/ETgCMSps4c",
    target: "_blank",
    icon: <FaDiscord />,
    label: "Discord",
  },
];

export default function Footer() {
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
                target={l.target}
                rel={l.target ? "noopener noreferrer" : undefined}
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
                src="/icons/roblox.svg"
                alt="Roblox"
                style={{ width: "44%" }}
                className="red-filter"
              />
            </a>
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} MattQ · Built with Next.js
        </div>
      </div>
    </footer>
  );
}
