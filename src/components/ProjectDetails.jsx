import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import { projects } from "../data/projects";
import Gallery from "./Gallery";
import { motion } from "framer-motion";

/* ─── helpers ─────────────────────────────────────── */
function findPrev(project) {
  const index = projects.indexOf(project);
  return index > 0 ? projects[index - 1].id : null;
}
function findNext(project) {
  const index = projects.indexOf(project);
  return index < projects.length - 1 ? projects[index + 1].id : null;
}

const context = require.context(
  "../assets/media/projects",
  true,
  /\.(png|jpe?g|svg|webp|mov|mp4)$/
);

/* ─── GitHub hook ──────────────────────────────────── */
function useGitHubData(githubUrl) {
  const [repo, setRepo] = useState(null);
  const [langs, setLangs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!githubUrl) return;
    const match = githubUrl.match(/github\.com\/([^/]+\/[^/?#]+)/);
    if (!match) return;
    const slug = match[1];

    setLoading(true);
    setError(false);

    Promise.all([
      fetch(`https://api.github.com/repos/${slug}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`https://api.github.com/repos/${slug}/languages`).then((r) =>
        r.ok ? r.json() : null
      ),
    ])
      .then(([repoData, langData]) => {
        setRepo(repoData);
        setLangs(langData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [githubUrl]);

  return { repo, langs, loading, error };
}

/* ─── Language bar ─────────────────────────────────── */
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

/* ─── GitHub info panel ─────────────────────────────── */
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
          </div>
          {langs && <LanguageBar langs={langs} />}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
          >
            <FaGithub /> View on GitHub
          </a>
        </>
      )}
    </div>
  );
}

/* ─── Main component ───────────────────────────────── */
const ProjectDetails = () => {
  const { projectId } = useParams();
  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState("overview");

  if (!project) {
    return (
      <div className="section" style={{ paddingTop: 160 }}>
        <div className="container">
          <h2>Project not found</h2>
          <Link to="/" className="btn" style={{ marginTop: 20 }}>
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // --- LOGICA MEDIA OTTIMIZZATA ---
  // 1. Carichiamo i file locali dalla cartella assets
  const localMedia = context
    .keys()
    .filter((k) => k.startsWith(`./${project.id}/`))
    .map(context);

  // 2. Filtriamo immagini e video locali (sono stringhe URL)
  const localImages = localMedia.filter((s) =>
    /\.(png|jpe?g|svg|webp)$/i.test(s)
  );
  const localVideos = localMedia.filter((s) => /\.(mov|mp4|webm)$/i.test(s));

  // 3. Uniamo con i media definiti manualmente nell'oggetto project (possono essere oggetti {src, alt})
  // La Gallery gestirà automaticamente sia le stringhe che gli oggetti.
  const allImages = [...localImages, ...(project.images || [])];
  const allVideos = [...localVideos, ...(project.videos || [])];

  // Identifica URL GitHub per il pannello laterale
  const githubLink = project.links?.find(
    (l) => l.type === "github" && l.url?.includes("github.com")
  );
  const githubUrl = githubLink?.url || project.githubUrl;

  const tabs = [
    { id: "overview", label: "Overview" },
    {
      id: "gallery",
      label: `Gallery (${allImages.length + allVideos.length})`,
    },
    { id: "tech", label: "Technologies" },
    { id: "achievements", label: "Achievements" },
  ];

  return (
    <section className="project-detail section">
      <div className="container">
        <Link to="/#projects" className="back-btn">
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
            </div>
          </div>

          <div className="detail-hero-right">
            {githubUrl ? (
              <GitHubInfoCard githubUrl={githubUrl} />
            ) : project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                style={{
                  borderRadius: "var(--radius)",
                  maxHeight: 300,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            ) : null}
          </div>
        </div>

        <div className="project-navigation">
          {findPrev(project) && (
            <Link to={`/project/${findPrev(project)}`} className="nav-btn prev">
              <FaArrowLeft /> Previous
            </Link>
          )}
          {findNext(project) && (
            <Link to={`/project/${findNext(project)}`} className="nav-btn next">
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
          transition={{ duration: 0.35 }}
          className="project-content"
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
            <Gallery images={allImages} videos={allVideos} />
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
};

export default ProjectDetails;
