"use client";
// components/ProjectDetails.jsx
import { useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
  FaCalendarAlt,
  FaCode,
  FaDownload,
  FaPlayCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { projects } from "@/data/projects";
import Gallery from "./Gallery";
import { motion } from "framer-motion";
import { useGitHubData } from "@/hooks/useGitHubData";

function findPrev(project) {
  return projects[projects.indexOf(project) - 1]?.id;
}
function findNext(project) {
  return projects[projects.indexOf(project) + 1]?.id;
}

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Luau: "#00a2ff",
  Lua: "#000080",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
  "C#": "#178600",
  Shell: "#89e051",
  Ruby: "#701516",
};

function LanguageBar({ langs }) {
  if (!langs || Object.keys(langs).length === 0) return null;
  const total = Object.values(langs).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  return (
    <>
      <div className="github-lang-bar">
        {sorted.map(([lang, bytes]) => (
          <span
            key={lang}
            style={{
              flex: bytes / total,
              background: LANG_COLORS[lang] || "#8888aa",
              minWidth: 4,
            }}
            title={`${lang} ${((bytes / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="github-lang-list">
        {sorted.map(([lang, bytes]) => (
          <div key={lang} className="lang-item">
            <span
              className="lang-dot"
              style={{ background: LANG_COLORS[lang] || "#8888aa" }}
            />
            <span>{lang}</span>
            <span className="lang-pct">
              {((bytes / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function GitHubInfoCard({ githubUrl }) {
  const { repo, langs, loading, error } = useGitHubData(githubUrl);
  if (!githubUrl) return null;
  return (
    <div className="github-info-card">
      <h4>GitHub Repository</h4>
      {loading && (
        <div className="github-loading">
          <div className="github-loading-dot" />
          <div className="github-loading-dot" />
          <div className="github-loading-dot" />
          <span>Fetching repo data…</span>
        </div>
      )}
      {error && (
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: ".82rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FaExclamationCircle style={{ color: "var(--primary)" }} /> Couldn't
          load repo data.
        </div>
      )}
      {repo && !loading && (
        <>
          {repo.description && (
            <p className="github-description">{repo.description}</p>
          )}
          <div className="github-stats-grid">
            <div className="github-stat-item">
              <div className="value">
                {repo.stargazers_count?.toLocaleString()}
              </div>
              <div className="label">Stars</div>
            </div>
            <div className="github-stat-item">
              <div className="value">{repo.forks_count?.toLocaleString()}</div>
              <div className="label">Forks</div>
            </div>
            <div className="github-stat-item">
              <div className="value">
                {repo.open_issues_count?.toLocaleString()}
              </div>
              <div className="label">Issues</div>
            </div>
            <div className="github-stat-item">
              <div className="value">
                {repo.watchers_count?.toLocaleString()}
              </div>
              <div className="label">Watchers</div>
            </div>
          </div>
          {langs && <LanguageBar langs={langs} />}
          {repo.topics?.length > 0 && (
            <div className="github-topics">
              {repo.topics.map((t) => (
                <span key={t} className="github-topic">
                  {t}
                </span>
              ))}
            </div>
          )}
          {repo.license && (
            <div
              style={{
                fontSize: ".78rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              License: {repo.license.spdx_id}
            </div>
          )}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ marginTop: 4, justifyContent: "center" }}
          >
            <FaGithub /> View on GitHub
          </a>
        </>
      )}
    </div>
  );
}

export default function ProjectDetails({ projectId }) {
  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState("overview");

  if (!project) {
    return (
      <div className="section" style={{ paddingTop: 160 }}>
        <div className="container">
          <h2>Project not found</h2>
          <Link href="/" className="btn" style={{ marginTop: 20 }}>
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Media files live in public/media/projects/<id>/
  // Add a `media: ['file.png', 'demo.mov']` array to each project entry.
  const media = (project.media || []).map((filename) => ({
    type: /\.mov$/i.test(filename) ? "video" : "image",
    src: `/media/projects/${project.id}/${filename}`,
  }));
  const images = media.filter((m) => m.type === "image").map((m) => m.src);
  const videos = media.filter((m) => m.type === "video").map((m) => m.src);

  const githubLink = project.links?.find(
    (l) => l.type === "github" && l.url?.includes("github.com")
  );
  const githubUrl = githubLink?.url || project.githubUrl;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "gallery", label: `Gallery (${images.length + videos.length})` },
    { id: "tech", label: "Technologies" },
    { id: "achievements", label: "Achievements" },
  ];

  return (
    <section className="project-detail section">
      <div className="container">
        <Link href="/#projects" className="back-btn">
          <FaArrowLeft /> Back to Projects
        </Link>

        <div className="detail-hero">
          <div className="detail-hero-left">
            <div className="section-label">Project</div>
            <h1 className="detail-title">{project.title}</h1>
            <div className="project-dates">
              <FaCalendarAlt />
              <span>
                {project.startDate} — {project.endDate || "Present"}
              </span>
            </div>
            <div className="project-links">
              {project.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  {link.type === "github" ? (
                    <FaGithub />
                  ) : link.type === "download" ? (
                    <FaDownload />
                  ) : link.type === "play" ? (
                    <FaPlayCircle />
                  ) : (
                    <FaExternalLinkAlt />
                  )}
                  {link.label}
                </a>
              ))}
            </div>
            <div className="project-tags" style={{ marginTop: 8 }}>
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="project-tag"
                  style={{
                    backgroundColor: tag.color,
                    boxShadow: `0 0 10px ${tag.color}50`,
                  }}
                >
                  {tag.icon} {tag.name}
                </span>
              ))}
              {project.isOpenSource && (
                <span className="project-tag open-source">
                  <FaCode /> Open Source
                </span>
              )}
            </div>
          </div>

          <div>
            {githubUrl ? (
              <GitHubInfoCard githubUrl={githubUrl} />
            ) : project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                style={{ borderRadius: "var(--radius)", maxHeight: 300 }}
              />
            ) : null}
          </div>
        </div>

        <div className="project-navigation">
          {findPrev(project) && (
            <Link
              href={`/project/${findPrev(project)}`}
              className="nav-btn prev"
            >
              <FaArrowLeft /> Previous
            </Link>
          )}
          {findNext(project) && (
            <Link
              href={`/project/${findNext(project)}`}
              className="nav-btn next"
            >
              Next <FaArrowRight />
            </Link>
          )}
        </div>

        <div className="project-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ padding: 0 }}
        >
          {activeTab === "overview" && (
            <div className="project-overview">
              <h3>About this Project</h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: 32,
                }}
              >
                {project.description}
              </p>
              <div className="project-features">
                <h4>Key Features</h4>
                <ul>
                  {project.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeTab === "gallery" && (
            <Gallery images={images} videos={videos} />
          )}
          {activeTab === "tech" && (
            <div className="project-technologies">
              <h3>Technologies Used</h3>
              <div className="tech-grid">
                {project.technologies.map((tech, i) => (
                  <div className="tech-card" key={i}>
                    <div
                      className="tech-icon"
                      style={{ backgroundColor: tech.color }}
                    >
                      {tech.icon}
                    </div>
                    <h4>{tech.name}</h4>
                    <p>{tech.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "achievements" && (
            <div className="project-achievements">
              <h3>Project Achievements</h3>
              <div className="achievements-grid">
                {project.achievements.map((a, i) => (
                  <div className="achievement-card" key={i}>
                    <div className="achievement-icon">{a.icon}</div>
                    <div>
                      <h4>{a.title}</h4>
                      <p>{a.description}</p>
                      {a.metric && (
                        <div className="achievement-metric">{a.metric}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
