import React, { useState } from 'react';
import { 
  FaCode, FaGamepad, FaPaintBrush, FaLaptopCode, FaTools
} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJsSquare, faReact, faHtml5, faGithub, faPhp } from "@fortawesome/free-brands-svg-icons";
import { motion } from 'framer-motion';

const Skills = () => {

  // Categorie di competenze con icone e colori
  const skillCategories = [
  { title: "Web Development", icon: <FaCode className="category-icon" />, color: "#44ff51", skills: ["HTML/CSS", "JavaScript", "React", "Tailwind.css", "Node.js"] },
  { title: "Game Development", icon: <FaGamepad className="category-icon" />, color: "#ff6b6b", skills: ["Roblox Studio", "Luau", "Game Design", "GFX"] },
  { title: "Design", icon: <FaPaintBrush className="category-icon" />, color: "#00d9c0", skills: ["UI/UX Design", "Graphic Design", "Prototyping", "GFX"] },
  { title: "Programming", icon: <FaCode className="category-icon" />, color: "#6e44ff", skills: ["Python", "C++ (Arduino)", "React-Native", "PHP", "Swift"] },
  { title: "Tools & Platforms", icon: <FaTools className="category-icon" />, color: "#ffb74d", skills: ["VS Code", "Roblox Studio", "Creator Hub (Roblox)", "Photopea", "Figma"] }
];


  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-title">
          <h2>My Skills</h2>
        </div>
        <motion.div 
          className="skills-visualization"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>My Expertise Areas</h3>
          
          <div className="skills-grid">
            {skillCategories.map((category, index) => (
              <motion.div 
                key={index}
                className="skill-category"
                style={{ 
                  borderColor: hoveredCategory === index ? category.color : '#363636ff',
                  boxShadow: hoveredCategory === index ? `0 10px 30px ${category.color}30` : '0 5px 15px rgba(0, 0, 0, 0.05)'
                }}
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredCategory(index)}
                onHoverEnd={() => setHoveredCategory(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="category-header">
                  <div 
                    className="category-icon-wrapper"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <h4 style={{ color: category.color }}>{category.title}</h4>
                </div>
                
                <div className="skills-container">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span 
                      key={skillIndex}
                      className="skill-tag"
                      style={{ 
                        backgroundColor: hoveredCategory === index ? `${category.color}15` : '#212121ff',
                        borderColor: hoveredCategory === index ? category.color : '#414141ff',
                        color: hoveredCategory === index ? category.color : '#555'
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.1 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="progress-section">
            <h4>Skill Proficiency</h4>
            <div className="progress-bars">
              {[
                { name: "Roblox Development", level: 95, color: "#6e44ff" },
                { name: "Web Frontend", level: 90, color: "#ff6b6b" },
                { name: "Graphic Design", level: 80, color: "#00d9c0" },
                { name: "Programming", level: 75, color: "#4d79ff" },
                { name: "Mobile Development", level: 65, color: "#ffb74d" },
                { name: "Web Backend", level: 60, color: "#ff6b6b" },
              ].map((skill, index) => (
                <motion.div 
                  key={index}
                  className="progress-bar-container"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ duration: 0.8, delay: 1 + (index * 0.1) }}
                >
                  <div className="progress-info">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="progress-background">
                    <motion.div 
                      className="progress-fill"
                      style={{ backgroundColor: skill.color, boxShadow: skill.color + " 0px 0px 5px" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.2, delay: 1.2 + (index * 0.1), ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
