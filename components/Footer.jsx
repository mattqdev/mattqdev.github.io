// components/Footer.jsx
// No 'use client' needed — no hooks or browser APIs.
// Charcoal plate: the line mark, link columns, and the Studio credit line.
import Link from "next/link";
import { MarkLine, StudioTile } from "./brand/Mark";

const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/blog/rss.xml", label: "RSS feed" },
];

const elsewhere = [
  { href: "https://github.com/mattqdev", label: "GitHub" },
  { href: "https://x.com/mattqdev", label: "X / Twitter" },
  { href: "https://www.roblox.com/users/2992118050", label: "Roblox" },
  { href: "https://discord.gg/PWkZyqQ7st", label: "Discord" },
  { href: "mailto:mattqdevv@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-sign">
            <MarkLine className="footer-mark" weight={22} />
            <p className="footer-claim">Developer · Designer · Game Maker</p>
          </div>

          <nav className="footer-cols" aria-label="Footer">
            <div>
              <span className="label">Site</span>
              <ul>
                {siteLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="label">Elsewhere</span>
              <ul>
                {elsewhere.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        l.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer-endorse">
          <StudioTile className="footer-tile" />
          <span className="footer-endorse-name">MattQ Studios</span>
        </div>

        <div className="copyright label">
          <span>© {new Date().getFullYear()} MattQ</span>
          {/* Plain <a>: /v1 is a separate Pages site (repo mattqdev/v1), not a route here */}
          <a href="/v1/">Previous version</a>
          <a
            href="https://github.com/mattqdev/mattqdev.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
