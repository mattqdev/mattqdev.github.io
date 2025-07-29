import React, { useState } from 'react';
import { 
  FaCode, FaGamepad, FaPaintBrush, FaLaptopCode, 
  FaServer, FaAsterisk, FaExclamationTriangle, FaExclamation,
  FaMobileAlt
} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJsSquare, faReact, faHtml5, faGithub, faPhp } from "@fortawesome/free-brands-svg-icons";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Skills', icon: <FaAsterisk /> },
    { id: 'programming', name: 'Languages', icon: <FaCode /> },
    { id: 'game', name: 'Game Dev', icon: <FaGamepad /> },
    { id: 'design', name: 'Design', icon: <FaPaintBrush /> },
    { id: 'web', name: 'Web', icon: <FaLaptopCode /> },
    { id: 'mobile', name: 'Mobile', icon: <FaMobileAlt /> },
    { id: 'devops', name: 'DevOps', icon: <FaServer /> },
  ];
  
  let skills = [
    { name: "Luau (Roblox)", level: 95, categories: ['programming','game'], icon: <FaGamepad />, color: "#4da9ffff" },
    { name: "JavaScript", level: 83, categories: ['programming','web'], icon: <FontAwesomeIcon icon={faJsSquare} />, color: "#ebbb0dff" },
    { name: "Python", level: 65, categories: ['programming'], icon: <FaCode />, color: "#3572A5" },
    { name: "C++ (Arduino)", level: 75, categories: ['programming'], icon: <FaCode />, color: "#51ad3fff" },
    { name: "Roblox Studio", level: 98, categories: ['game'], icon: <FaGamepad />, color: "#ff4d5a" },
    { name: "UI/UX Design", level: 92, categories: ['design','game'], icon: <FaPaintBrush />, color: "#6a0dad" },
    { name: "Graphic Design", level: 81, categories: ['design','game'], icon: <FaPaintBrush />, color: "#ff6b6b" },
    { name: "React", level: 85, categories: ['web'], icon: <FontAwesomeIcon icon={faReact} />, color: "#23c7f4ff", isActive: true },
    { name: "React-Native", level: 60, categories: ['mobile'], icon: <FontAwesomeIcon icon={faReact} />, color: "#007596ff", isNew: true },
    { name: "Node.js", level: 55, categories: ['web'], icon: <FaLaptopCode />, color: "#68a063" },
    { name: "HTML/CSS", level: 95, categories: ['web'], icon: <FontAwesomeIcon icon={faHtml5} />, color: "#e34c26" },
    { name: "Github", level: 60, categories: ['devops'], icon: <FontAwesomeIcon icon={faGithub} />, color: "#949494ff" },
    { name: "PHP", level: 45, categories: ['programming', 'web'], icon: <FontAwesomeIcon icon={faPhp} />, color: "#7435a5ff" },
  ];

  skills = skills.sort((a, b) => b.level - a.level);

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(skill => skill.categories.includes(activeCategory));

  return (
    <section id="skills" className="section" style={{ background: '#0a0a10' }}>
      <div className="container">
        <div className="section-title">
          <h2>My Skills</h2>
          <p>Filter by category to explore my skills</p>
        </div>
        
        <div className="skills-categories">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`skill-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        
        <div className="skills-grid">
          {filteredSkills.map((skill, i) => (
            <div className="skill-card" key={i}>
              {(skill.isNew || skill.isActive) && (
                <span className={`skill-badge ${skill.isNew ? 'new' : 'active'}`}>
                  {skill.isNew ? <FaExclamation /> : <FaExclamationTriangle />} {skill.isNew ? 'New' : 'WIP'}
                </span>
              )}
              <div className="skill-header">
                <div className="skill-icon" style={{ backgroundColor: skill.color, boxShadow: `0 0px 4px ${skill.color}` }}>
                  {skill.icon}
                </div>
                <h3>{skill.name}</h3>
              </div>
              
              <div className="skill-bar-container">
                <div 
                  className="skill-bar" 
                  style={{ width: `${skill.level}%`, backgroundColor: skill.color, boxShadow: `${skill.color} 3px 0 15px 0px` }}
                >
                  <span className="skill-level">{skill.level}%</span>
                </div>
              </div>
              
              <div className="skill-description">
                <div className="skill-tags">
                  {skill.categories.map((catId, idx) => (
                    <span   
                      key={idx} 
                      className="skill-tag"
                      style={{ backgroundColor: categories.find(c => c.id === catId)?.color || '#4d79ff' }}
                    > {categories.find(c => c.id === catId)?.icon}
                      {categories.find(c => c.id === catId)?.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
