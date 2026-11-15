"use client";
// components/Projects.jsx
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaThLarge,
  FaStream,
  FaArrowRight,
} from "react-icons/fa";
import { FaStar, FaCodeFork } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useGitHubData } from "@/hooks/useGitHubData";
import CategoryFilter from "./CategoryFilter";
import { useUrlState } from "@/hooks/useUrlState";
import { formatNumber } from "@/lib/format";
import ProjectsTimeline from "./ProjectsTimeline";
import { MarkLine, MarkSolid } from "./brand/Mark";
import ProjectSignature, { isStudioProject } from "./brand/ProjectSignature";

/* ── Animation variants ─────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

/* ── Thumbnail path resolver ──────────────────────────
   Handles: null, absolute URL, /public path, or bare filename */
function getThumbnailPath(project) {
  const { thumbnail, id } = project;
  if (!thumbnail) return null;
  if (thumbnail.startsWith("http") || thumbnail.startsWith("/"))
    return thumbnail;
  return `/media/projects/${id}/${thumbnail}`;
}

/* ── GitHub stats strip ───────────────────────────── */
function GitHubStrip({ githubUrl }) {
  const { repo, loading } = useGitHubData(githubUrl);
  if (!githubUrl) return null;
  if (loading)
    return (
      <div className="project-github-stats">
        <div className="github-loading" role="status">
          <div className="github-loading-dot" />
          <div className="github-loading-dot" />
          <div className="github-loading-dot" />
          <span>Loading…</span>
        </div>
      </div>
    );
  if (!repo) return null;
  return (
    <div className="project-github-stats">
      <div className="github-stat">
        <FaStar aria-hidden="true" />
        <span>{formatNumber(repo.stargazers_count)}</span>
        <span className="sr-only">stars</span>
      </div>
      <div className="github-stat">
        <FaCodeFork aria-hidden="true" />
        <span>{formatNumber(repo.forks_count)}</span>
        <span className="sr-only">forks</span>
      </div>
      {repo.language && (
        <div className="github-stat">
          <span className="github-lang-key" aria-hidden="true" />
          <span>{repo.language}</span>
        </div>
      )}
    </div>
  );
}

/* ── Main component ───────────────────────────────── */
// `limit` caps the grid on the homepage; /projects renders everything.
export default function Projects({ limit }) {
  // Filter + view live in the URL (?category=…&view=…) so they can be shared
  const [filterParam, setFilter] = useUrlState("category", "all");
  const [viewParam, setView] = useUrlState("view", "grid");
  const view = viewParam === "timeline" ? "timeline" : "grid";

  const categoryOptions = [
    { value: "all", label: "All", count: projects.length },
    ...Array.from(
      new Set(projects.flatMap((p) => p.tags.map((t) => t.name.toLowerCase())))
    ).map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: projects.filter((p) =>
        p.tags.some((t) => t.name.toLowerCase() === cat)
      ).length,
    })),
  ];

  // Ignore unknown ?category= values instead of rendering an empty grid
  const filter = categoryOptions.some((o) => o.value === filterParam)
    ? filterParam
    : "all";

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) =>
          p.tags.some((t) => t.name.toLowerCase() === filter)
        );

  const shownProjects = limit
    ? filteredProjects.slice(0, limit)
    : filteredProjects;

  return (
    <section id="projects" className="section section--alt">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: "some" }}
      >
        <div className="section-head">
          <div className="section-head-main">
            <span className="label">02 · Work</span>
            <motion.h2 className="h-display" variants={fadeUp}>
              My projects<span className="dot-red">.</span>
            </motion.h2>
          </div>
          <p className="section-lede">
            A collection of games, tools, and websites I&rsquo;ve shipped.
          </p>
        </div>

        {/* Category filter + view switcher */}
        <motion.div className="projects-filters" variants={fadeUp}>
          <CategoryFilter
            options={categoryOptions}
            value={filter}
            onChange={setFilter}
            label="Category"
          />

          <div className="view-toggle" role="group" aria-label="Project view">
            <button
              type="button"
              className={`view-toggle-btn ${view === "grid" ? "active" : ""}`}
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
            >
              <FaThLarge aria-hidden="true" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${view === "timeline" ? "active" : ""}`}
              onClick={() => setView("timeline")}
              aria-pressed={view === "timeline"}
            >
              <FaStream aria-hidden="true" />
              <span>Timeline</span>
            </button>
          </div>
        </motion.div>

        {view === "timeline" ? (
          <ProjectsTimeline projects={filteredProjects} />
        ) : (
          /* Project grid — AnimatePresence handles enter/exit on filter change */
          <motion.div className="projects-grid" layout>
            <AnimatePresence mode="popLayout">
              {shownProjects.map((project) => {
                const githubLink = project.links?.find(
                  (l) => l.type === "github" && l.url?.includes("github.com")
                );
                const githubUrl = githubLink?.url || project.githubUrl;
                const thumbSrc = getThumbnailPath(project);
                const studio = isStudioProject(project);

                return (
                  <motion.article
                    key={project.id}
                    className="project-card"
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                  >
                    <div
                      className={`project-media ${studio ? "is-studio" : "is-person"}${project.thumbnailFit === "contain" ? " is-contain" : ""}`}
                    >
                      {thumbSrc ? (
                        <Image
                          src={thumbSrc}
                          alt=""
                          fill
                          unoptimized
                          style={{ objectFit: project.thumbnailFit || "cover" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : studio ? (
                        <MarkSolid className="project-media-mark" />
                      ) : (
                        <MarkLine className="project-media-mark" weight={12} />
                      )}
                    </div>

                    <div className="project-content">
                      <div className="project-meta mono">
                        <span>{project.startDate}</span>
                        {project.endDate === "Present" && (
                          <span className="project-live">Active</span>
                        )}
                      </div>

                      <h3 className="project-title">
                        <Link
                          href={`/projects/${project.id}`}
                          className="project-link"
                        >
                          {project.title}
                        </Link>
                      </h3>

                      <p className="project-description">
                        {project.shortDescription}
                      </p>

                      {githubUrl && project.isOpenSource && (
                        <GitHubStrip githubUrl={githubUrl} />
                      )}

                      <ul className="project-tags" aria-label="Tags">
                        {project.tags.map((tag) => (
                          <li key={tag.name} className="project-tag">
                            {tag.name}
                          </li>
                        ))}
                      </ul>

                      <div className="project-footer">
                        <ProjectSignature project={project} />
                        <div className="project-actions">
                          {githubUrl && (
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="icon-btn"
                              aria-label={`${project.title} on GitHub`}
                            >
                              <FaGithub aria-hidden="true" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="icon-btn"
                              aria-label={`${project.title} live demo`}
                            >
                              <FaExternalLinkAlt aria-hidden="true" />
                            </a>
                          )}
                          <span className="project-go" aria-hidden="true">
                            <FaArrowRight />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {view === "grid" && shownProjects.length < filteredProjects.length && (
          <div className="projects-more">
            <Link href="/projects" className="btn btn-outline">
              View all {projects.length} projects{" "}
              <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
}
