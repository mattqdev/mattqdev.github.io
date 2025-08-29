// src/components/Skills.jsx
import React, { useState } from 'react';
import { FaCode, FaGamepad, FaPaintBrush, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Variants riutilizzabili
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Skills = () => {
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
      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="section-title">
          <motion.h2 variants={fadeUp}>My Skills</motion.h2>
        </div>

        <motion.div className="skills-visualization" variants={containerVariants}>
          <motion.h3 variants={fadeUp}>My Expertise Areas</motion.h3>
          
          <motion.div className="skills-grid" variants={containerVariants}>
            {skillCategories.map((category, index) => (
              <motion.div 
                key={index}
                className="skill-category"
                style={{ 
                  borderColor: hoveredCategory === index ? category.color : '#363636ff',
                  boxShadow: hoveredCategory === index ? `0 10px 30px ${category.color}30` : '0 5px 15px rgba(0, 0, 0, 0.05)'
                }}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                onHoverStart={() => setHoveredCategory(index)}
                onHoverEnd={() => setHoveredCategory(null)}
                transition={{ duration: 0.3 }}
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
                        color: hoveredCategory === index ? category.color : '#aaa'
                      }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.15 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div className="progress-section" variants={containerVariants}>
            <motion.h4 variants={fadeUp}>Skill Proficiency</motion.h4>
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
                  variants={fadeUp}
                >
                  <div className="progress-info">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="progress-background">
                    <motion.div 
                      className="progress-fill"
                      style={{ 
                        backgroundColor: skill.color, 
                        boxShadow: `${skill.color} 0px 0px 10px` 
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ 
                        width: `${skill.level}%`,
                        transition: { 
                          duration: 1.2, 
                          delay: 0.1 + index * 0.15, 
                          ease: "easeOut" 
                        }
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Skills;
