// src/components/Projects.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { 
  FaGamepad, FaLaptop, FaPalette, FaCube, FaGithub, FaExternalLinkAlt, 
  FaCalendarAlt, FaCodeBranch 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaGear, FaHardDrive } from 'react-icons/fa6';

// Variants riutilizzabili
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const scaleHover = {
  hover: { scale: 1.05, transition: { duration: 0.3 } }
};

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
      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="section-title">
          <motion.h2 variants={fadeUp}>My Projects</motion.h2>
        </div>
        
        {/* Filtri per categoria */}
        <motion.div className="projects-filters" variants={containerVariants}>
          {allCategories.map(category => (
            <motion.button 
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>
        
        <motion.div className="projects-grid" variants={containerVariants}>
          {filteredProjects.map((project, index) => (
            <motion.div 
              className="project-card"
              key={index}
              variants={fadeUp}
              whileHover={{ y: -8 }}
            >
              <motion.div 
                className="project-img-placeholder"
                style={{
                  background: `linear-gradient(45deg, ${project.tags[0].color}, ${project.tags[1]?.color || project.tags[0].color})`
                }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <img 
                  src={project.thumbnail || undefined} 
                  alt={project.thumbnail && project.title} 
                  style={{position: "absolute", width: "100%"}} 
                />
                {getProjectIcon(project.tags)}
                <motion.div 
                  className="project-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="overlay-content"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div className="project-content" variants={containerVariants}>
                <motion.div className="project-header" variants={fadeUp}>
                  <div className="project-infos">
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.shortDescription}</p>
                  </div>

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
                </motion.div>
                
                <motion.div className="project-divider" variants={fadeUp}>
                  <div className="project-divider-line" style={{width: "10%"}} />
                  <span className="project-divider-text">Tags</span>
                  <div className="project-divider-line" style={{width: "70%"}}/>
                </motion.div>

                <motion.div className="project-tags" variants={containerVariants}>
                  {project.tags.map((tag, i) => (
                    <motion.span 
                      key={i} 
                      className="project-tag"
                      style={{ 
                        backgroundColor: tag.color,
                        boxShadow: `0 0px 12px ${tag.color}`
                      }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tag.icon} {tag.name}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
