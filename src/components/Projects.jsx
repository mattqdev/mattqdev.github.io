// src/components/Projects.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { FaGamepad, FaLaptop, FaPalette, FaCube, FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaCodeBranch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaGear, FaHardDrive } from 'react-icons/fa6';


const Projects = () => {
  const [filter, setFilter] = useState('all');
  
  const getProjectIcon = (tags) => {
    if (tags.some(tag => tag.name === "Game Design")) return <FaGamepad className="project-main-icon" />;
    if (tags.some(tag => tag.name === "Plugin")) return <FaGear className="project-main-icon" />;
    if (tags.some(tag => tag.name === "Arduino")) return <FaHardDrive className="project-main-icon" />;
    if (tags.some(tag => tag.name === "Graphics")) return <FaPalette className="project-main-icon" />;
    if (tags.some(tag => tag.name === "Website")) return <FaLaptop className="project-main-icon" />;
    return <FaCube className="project-main-icon" />;
  };
  
  // Filtra i progetti in base alla categoria selezionata
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => 
        project.tags.some(tag => tag.name.toLowerCase() === filter)
      );
  
  const allCategories = ['all', ...new Set(projects.flatMap(project => 
    project.tags.map(tag => tag.name.toLowerCase())
  ))];
  
  return (
    <section id="projects" className="section" style={{ background: '#0a0a10' }}>
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Projects
          </motion.h2>
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore my work across different domains and technologies
          </motion.p> */}
        </div>
        
        {/* Filtri per categoria */}
        <motion.div 
          className="projects-filters"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {allCategories.map(category => (
            <motion.button 
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>
        
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <motion.div 
              className="project-card"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div 
                className="project-img-placeholder"
                style={{background: `linear-gradient(45deg, ${project.tags[0].color}, ${project.tags[1]?.color || project.tags[0].color})` }}
              >
                <img src={project.thumbnail || undefined} alt={project.thumbnail && project.title} style={{position: "absolute", width: "100%"}} />
                {getProjectIcon(project.tags)}
                <div className="project-overlay">
                  <div className="overlay-content">
                    <h3>{project.title}</h3>
                    <div className="overlay-buttons">
                      <Link 
                        to={`/project/${project.id}`}
                        className="btn btn-view"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        View Details
                      </Link>
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-icon"
                          aria-label="GitHub repository"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-icon"
                          aria-label="Live preview"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="project-content">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  
                  <div className="project-meta">
                    <div className="project-date">
                      <FaCalendarAlt className="meta-icon" />
                      <span>{project.startDate} - {project.endDate || 'Present'}</span>
                    </div>
                    
                    {project.isOpenSource && (
                      <div className="open-source-tag">
                        <FaCodeBranch className="meta-icon" />
                        <span>Open Source</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="project-description">{project.shortDescription}</p>
                
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <motion.span 
                      key={i} 
                      className="project-tag"
                      style={{ 
                        backgroundColor: tag.color,
                        boxShadow: `0 0px 12px ${tag.color}`
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tag.icon} {tag.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;