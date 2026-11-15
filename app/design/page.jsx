// app/design/page.jsx — Server Component
// Visual portfolio: brand, campaign and game graphics. Data in data/design.js.
import { DESIGN_GROUPS } from "@/data/design";

export const metadata = {
  title: "Design — MattQ",
  description:
    "Brand identities, packaging, social campaigns and game graphics designed by MattQ.",
  openGraph: {
    title: "Design — MattQ",
    description:
      "Brand identities, packaging, social campaigns and game graphics.",
    url: "https://mattqdev.github.io/design",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design — MattQ",
    description: "Brand identities, campaigns and game graphics.",
  },
};

export default function DesignPage() {
  return (
    <>
      <div className="projects-page-hero">
        <div className="container projects-page-hero-inner">
          <span className="label">Visual portfolio</span>
          <h1 className="projects-page-title">
            Design<span className="dot-red">.</span>
          </h1>
          <p className="projects-page-sub">
            Brand identity · Packaging · Social campaigns · Game GFX
          </p>
        </div>
      </div>

      {/* Sticky index: jump straight to any project instead of scrolling */}
      <nav className="design-index" aria-label="Design projects">
        <ul className="container">
          {DESIGN_GROUPS.map((group) => (
            <li key={group.id}>
              <a href={`#${group.id}`}>
                {group.title}
                <span className="mono">{group.images.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {DESIGN_GROUPS.map((group, i) => (
        <section
          key={group.id}
          id={group.id}
          className="section design-group"
          aria-labelledby={`${group.id}-title`}
        >
          <div className="container">
            <header className="design-group-head">
              <span className="label">
                {String(i + 1).padStart(2, "0")} · {group.kind}
              </span>
              <h2 id={`${group.id}-title`} className="design-group-title">
                {group.title}
                <span className="dot-red">.</span>
              </h2>
              <p className="design-group-text">{group.text}</p>
              <span className="label">{group.year}</span>
            </header>

            <ul className="design-grid">
              {group.images.map((im) => (
                <li key={im.src}>
                  <a href={im.src} target="_blank" rel="noopener">
                    <img
                      src={im.src}
                      alt={im.alt}
                      width={im.w}
                      height={im.h}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}
