"use client";
// components/Projects.jsx
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";
import {
  FaGamepad,
  FaLaptop,
  FaPalette,
  FaCube,
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaCodeBranch,
} from "react-icons/fa";
import { FaStar, FaCodeFork, FaGear, FaHardDrive } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useGitHubData } from "@/hooks/useGitHubData";

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
        <div className="github-loading">
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
        <FaStar />
        <span>{repo.stargazers_count?.toLocaleString() ?? 0}</span>
      </div>
      <div className="github-stat">
        <FaCodeFork />
        <span>{repo.forks_count?.toLocaleString() ?? 0}</span>
      </div>
      {repo.language && (
        <div className="github-stat">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          <span>{repo.language}</span>
        </div>
      )}
    </div>
  );
}

/* ── Fallback icon picker ─────────────────────────── */
function getProjectIcon(tags) {
  if (tags.some((t) => t.name === "Game Design"))
    return <FaGamepad className="project-main-icon" />;
  if (tags.some((t) => t.name === "Plugin"))
    return <FaGear className="project-main-icon" />;
  if (tags.some((t) => t.name === "Arduino"))
    return <FaHardDrive className="project-main-icon" />;
  if (tags.some((t) => t.name === "Website"))
    return <FaLaptop className="project-main-icon" />;
  return <FaCube className="project-main-icon" />;
}

/* ── Main component ───────────────────────────────── */
export default function Projects() {
  const [filter, setFilter] = useState("all");

  const allCategories = [
    "all",
    ...new Set(
      projects.flatMap((p) => p.tags.map((t) => t.name.toLowerCase()))
    ),
  ];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) =>
          p.tags.some((t) => t.name.toLowerCase() === filter)
        );

  return (
    <section
      id="projects"
      className="section"
      style={{ background: "var(--bg-deep)" }}
    >
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="section-title">
          <div className="section-label">Work</div>
          <motion.h2 variants={fadeUp}>
            My <em>Projects</em>
          </motion.h2>
          <p>A collection of games, tools, and websites I've shipped.</p>
        </div>

        {/* Filter buttons */}
        <motion.div className="projects-filters" variants={containerVariants}>
          {allCategories.map((cat) => (
            <motion.button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Project grid — AnimatePresence handles enter/exit on filter change */}
        <motion.div className="projects-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const githubLink = project.links?.find(
                (l) => l.type === "github" && l.url?.includes("github.com")
              );
              const githubUrl = githubLink?.url || project.githubUrl;
              const thumbSrc = getThumbnailPath(project);

              return (
                <motion.div
                  key={project.id}
                  className="project-card"
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  whileHover={{ y: -6 }}
                >
                  {/* Banner */}
                  <div
                    className="project-img-placeholder"
                    style={{
                      background: `linear-gradient(135deg, ${project.tags[0].color}30, ${project.tags[1]?.color || project.tags[0].color}18)`,
                    }}
                  >
                    {thumbSrc ? (
                      /* next/image with unoptimized (already set in next.config.js) */
                      <Image
                        src={thumbSrc}
                        alt={project.title}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      getProjectIcon(project.tags)
                    )}

                    <div className="project-overlay">
                      <div className="overlay-content">
                        <h3>{project.title}</h3>
                        <div className="overlay-buttons">
                          <Link
                            href={`/projects/${project.id}`}
                            className="btn-view"
                          >
                            View Details
                          </Link>
                          {githubUrl && (
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-icon"
                              aria-label="GitHub"
                            >
                              <FaGithub />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-icon"
                              aria-label="Live demo"
                            >
                              <FaExternalLinkAlt />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="project-content">
                    <div className="project-header">
                      <h3>{project.title}</h3>
                      <div className="project-meta">
                        <div className="project-date">
                          <FaCalendarAlt className="meta-icon" />
                          <span>{project.startDate}</span>
                        </div>
                        {project.isOpenSource && (
                          <div className="open-source-tag">
                            <FaCodeBranch className="meta-icon" />
                            <span>OSS</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="project-description">
                      {project.shortDescription}
                    </p>

                    {githubUrl && project.isOpenSource && (
                      <GitHubStrip githubUrl={githubUrl} />
                    )}

                    <div className="project-divider">
                      <div
                        className="project-divider-line"
                        style={{ width: "14%" }}
                      />
                      <span className="project-divider-text">tags</span>
                      <div
                        className="project-divider-line"
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div className="project-tags">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="project-tag"
                          style={{
                            backgroundColor: tag.color,
                            boxShadow: `0 0 10px ${tag.color}55`,
                          }}
                        >
                          {tag.icon} {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
