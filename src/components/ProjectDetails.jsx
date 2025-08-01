// src/components/ProjectDetails.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaGithub,
  FaCalendarAlt,
  FaCode,
  FaDownload,
  FaPlayCircle
} from 'react-icons/fa';
import { projects } from '../data/projects';
import Gallery from './Gallery';

function findPrevious(project) {
  return projects[projects.indexOf(project) - 1]?.id;
}

function findNext(project) {
  return projects[projects.indexOf(project) + 1]?.id;
}

// include .png, .jpg, .svg and .mov files
const context = require.context(
  "../assets/media/projects",
  true,
  /\.(png|jpe?g|svg|mov)$/
);

const ProjectDetails = () => {
  const { projectId } = useParams();
  const project = projects.find(p => p.id === projectId);
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) {
    return (
      <div className="project-not-found section">
        <div className="container">
          <h2>Project not found</h2>
          <Link to="/" className="btn">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // load all media in the project's folder
  const media = context
    .keys()
    .filter(key => key.startsWith(`./${project.id}/`))
    .map(context);

  // separate images and .mov videos
  const images = media.filter(src => /\.(png|jpe?g|svg)$/i.test(src));
  const videos = media.filter(src => /\.mov$/i.test(src));

  return (
    <section className="project-detail section">
      <div className="container">

        <Link to="/#projects" className="back-btn">
          <FaArrowLeft /> Back to Projects
        </Link>

        <div className="project-header">
          <div className="project-meta">
            <h1>{project.title}</h1>

            <div className="project-dates">
              <FaCalendarAlt />
              <span>
                {project.startDate} - {project.endDate || 'Present'}
              </span>
            </div>

            <div className="project-links">
              {project.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  {link.type === 'github' ? <FaGithub />
                    : link.type === 'download' ? <FaDownload />
                    : link.type === 'play' ? <FaPlayCircle />
                    : <FaExternalLinkAlt />}
                  {link.label}
                </a>
              ))}
            </div>

            <div className="project-tags">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="project-tag"
                  style={{ backgroundColor: tag.color }}
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

          <div className="project-image-main">
            {project.thumbnail && (
              <img
                src={project.thumbnail}
                alt={project.title}
                style={{ maxHeight: 300, width: 'auto' }}
              />
            )}
          </div>
        </div>

        <div className="project-navigation">
          {findPrevious(project) && (
            <Link
              to={`/project/${findPrevious(project)}`}
              className="nav-btn prev"
            >
              Previous Project
            </Link>
          )}
          {findNext(project) && (
            <Link
              to={`/project/${findNext(project)}`}
              className="nav-btn next"
            >
              Next Project
            </Link>
          )}
        </div>

        <div className="project-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery ({images.length + videos.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech')}
          >
            Technologies
          </button>
          <button
            className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
        </div>

        <div className="project-content">
          {activeTab === 'overview' && (
            <div className="project-overview">
              <h3>About this Project</h3>
              <p>{project.description}</p>

              <div className="project-features">
                <h4>Key Features</h4>
                <ul>
                  {project.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <Gallery images={images} videos={videos} />
          )}

          {activeTab === 'tech' && (
            <div className="project-technologies">
              <h3>Technologies Used</h3>
              <div className="tech-grid">
                {project.technologies.map((tech, idx) => (
                  <div className="tech-card" key={idx}>
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

          {activeTab === 'achievements' && (
            <div className="project-achievements">
              <h3>Project Achievements</h3>
              <div className="achievements-grid">
                {project.achievements.map((ach, idx) => (
                  <div className="achievement-card" key={idx}>
                    <div className="achievement-icon">
                      {ach.icon}
                    </div>
                    <div>
                      <h4>{ach.title}</h4>
                      <p>{ach.description}</p>
                      {ach.metric && (
                        <div className="achievement-metric">
                          {ach.metric}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
