// app/projects/page.jsx — Server Component
// Dedicated /projects page for Google indexing.
// Reuses the existing Projects client component — zero extra code.
import Projects from "@/components/Projects";

export const metadata = {
  title: "Projects — MattQ",
  description:
    "Roblox games with 3M+ visits, Roblox Studio plugins with 6K+ downloads, web apps, Arduino builds, and open-source tools by MattQ.",
  openGraph: {
    title: "Projects — MattQ | Roblox Developer & Web Dev",
    description:
      "Browse all projects: Roblox games, Studio plugins, web tools, and hardware builds.",
    url: "https://mattqdev.github.io/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — MattQ",
    description: "Roblox games, plugins, web apps, and open-source tools.",
  },
};

export default function ProjectsPage() {
  return (
    <>
      {/* Standalone hero for the /projects route */}
      <div className="projects-page-hero">
        <div className="container">
          <div className="projects-page-hero-inner">
            <div className="section-label">Portfolio</div>
            <h1 className="projects-page-title">
              All <em>Projects</em>
            </h1>
            <p className="projects-page-sub">
              Roblox games · Studio plugins · Web apps · Hardware builds ·
              Open-source tools
            </p>
          </div>
        </div>
      </div>

      {/* Reuse the existing Projects component — it renders the grid + filters */}
      <Projects />
    </>
  );
}
