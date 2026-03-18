// src/components/Skills.jsx
import React, { useState } from "react";
import { FaCode, FaGamepad, FaPaintBrush, FaTools } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const skillCategories = [
  {
    title: "Web Development",
    icon: <FaCode />,
    color: "#44ff51",
    skills: ["HTML/CSS", "JavaScript", "React", "Tailwind CSS", "Node.js"],
  },
  {
    title: "Game Development",
    icon: <FaGamepad />,
    color: "#ff6b6b",
    skills: ["Roblox Studio", "Luau", "Game Design", "GFX"],
  },
  {
    title: "Design",
    icon: <FaPaintBrush />,
    color: "#00d9c0",
    skills: ["UI/UX Design", "Graphic Design", "Prototyping", "Figma"],
  },
  {
    title: "Programming",
    icon: <FaCode />,
    color: "#6e44ff",
    skills: ["Python", "C++ (Arduino)", "React Native", "PHP", "Swift"],
  },
  {
    title: "Tools & Platforms",
    icon: <FaTools />,
    color: "#ffb74d",
    skills: ["VS Code", "Roblox Studio", "Creator Hub", "Figma", "Photopea"],
  },
];

const proficiency = [
  { name: "Roblox Development", level: 95, color: "#6e44ff" },
  { name: "Web Frontend", level: 90, color: "#ff6b6b" },
  { name: "Graphic Design", level: 80, color: "#00d9c0" },
  { name: "Programming", level: 75, color: "#4d79ff" },
  { name: "Mobile Dev", level: 65, color: "#ffb74d" },
  { name: "Web Backend", level: 60, color: "#ff6b6b" },
];

const Skills = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="skills" className="section">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="section-title">
          <div className="section-label">Expertise</div>
          <motion.h2 variants={fadeUp}>
            My <em>Skills</em>
          </motion.h2>
          <p>What I bring to every project.</p>
        </div>

        <motion.div
          className="skills-visualization"
          variants={containerVariants}
        >
          <motion.h3
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-.02em",
            }}
          >
            Expertise Areas
          </motion.h3>

          <motion.div className="skills-grid" variants={containerVariants}>
            {skillCategories.map((cat, i) => (
              <motion.div
                key={i}
                className="skill-category"
                style={{
                  borderColor: hovered === i ? cat.color : undefined,
                  boxShadow:
                    hovered === i ? `0 8px 28px ${cat.color}22` : undefined,
                }}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
              >
                <div className="category-header">
                  <div
                    className="category-icon-wrapper"
                    style={{
                      backgroundColor: `${cat.color}18`,
                      color: cat.color,
                    }}
                  >
                    {cat.icon}
                  </div>
                  <h4 style={{ color: cat.color }}>{cat.title}</h4>
                </div>
                <div className="skills-container">
                  {cat.skills.map((s, j) => (
                    <motion.span
                      key={j}
                      className="skill-tag"
                      style={{
                        backgroundColor:
                          hovered === i
                            ? `${cat.color}12`
                            : "rgba(255,255,255,.04)",
                        borderColor:
                          hovered === i
                            ? `${cat.color}60`
                            : "rgba(255,255,255,.08)",
                        color:
                          hovered === i ? cat.color : "var(--text-secondary)",
                      }}
                      whileHover={{ scale: 1.06 }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress bars */}
          <motion.div className="progress-section" variants={containerVariants}>
            <motion.h4 variants={fadeUp}>Skill Proficiency</motion.h4>
            <div className="progress-bars">
              {proficiency.map((skill, i) => (
                <motion.div
                  key={i}
                  className="progress-bar-container"
                  variants={fadeUp}
                >
                  <div className="progress-info">
                    <span>{skill.name}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: ".75rem",
                      }}
                    >
                      {skill.level}%
                    </span>
                  </div>
                  <div className="progress-background">
                    <motion.div
                      className="progress-fill"
                      style={{
                        backgroundColor: skill.color,
                        boxShadow: `0 0 10px ${skill.color}60`,
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{
                        duration: 1.2,
                        delay: 0.1 + i * 0.12,
                        ease: "easeOut",
                      }}
                      viewport={{ once: true }}
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
