import { pageMeta } from "@/lib/seo";
// app/projects/page.jsx — Server Component
// Dedicated /projects page for Google indexing.
// Reuses the existing Projects client component — zero extra code.
import Projects from "@/components/Projects";

export const metadata = pageMeta({
  title: "Projects — MattQ",
  description:
    "Roblox games with 5M+ visits, Roblox Studio plugins with 8,100+ installs, web apps, Arduino builds, and open-source tools by MattQ.",
  path: "/projects",
  image: "projects",
});

export default function ProjectsPage() {
  return (
    <>
      {/* Standalone hero for the /projects route */}
      <div className="projects-page-hero">
        <div className="container projects-page-hero-inner">
          <span className="label">Portfolio</span>
          <h1 className="projects-page-title">
            All projects<span className="dot-red">.</span>
          </h1>
          <p className="projects-page-sub">
            Roblox games · Studio plugins · Web apps · Hardware builds ·
            Open-source tools
          </p>
        </div>
      </div>

      {/* Reuse the existing Projects component — it renders the grid + filters */}
      <Projects />
    </>
  );
}
