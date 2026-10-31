"use client";
// components/Skills.jsx
// Laid out like a spec sheet: one ruled row per discipline, no colour coding.
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const skillCategories = [
  {
    title: "Web Development",
    skills: ["HTML/CSS", "JavaScript", "React", "Tailwind CSS", "Node.js"],
  },
  {
    title: "Game Development",
    skills: ["Roblox Studio", "Luau", "Game Design", "GFX"],
  },
  {
    title: "Design",
    skills: ["UI/UX Design", "Graphic Design", "Prototyping", "Figma"],
  },
  {
    title: "Programming",
    skills: ["Python", "C++ (Arduino)", "React Native", "PHP", "Swift"],
  },
  {
    title: "Tools & Platforms",
    skills: ["VS Code", "Roblox Studio", "Creator Hub", "Figma", "Photopea"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="section-head">
          <div className="section-head-main">
            <span className="label">03 · Expertise</span>
            <motion.h2 className="h-display" variants={fadeUp}>
              My skills<span className="dot-red">.</span>
            </motion.h2>
          </div>
          <p className="section-lede">What I bring to every project.</p>
        </div>

        <motion.ol className="skills-list" variants={containerVariants}>
          {skillCategories.map((cat, i) => (
            <motion.li key={cat.title} className="skill-row" variants={fadeUp}>
              <span className="skill-index mono" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="skill-title">{cat.title}</h3>
              <ul className="skill-tags" aria-label={`${cat.title} skills`}>
                {cat.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    </section>
  );
}
