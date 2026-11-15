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

// Mirrors the skills section of the resume (Atelier, boards/resume).
const skillCategories = [
  {
    title: "Languages",
    skills: [
      "JavaScript",
      "TypeScript",
      "Luau",
      "Python",
      "C/C++ (Arduino, ESP32)",
      "HTML/CSS",
      "Liquid",
    ],
  },
  {
    title: "Web Development",
    skills: [
      "React",
      "Next.js",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "p5.js",
      "Phaser",
      "React Native (basics)",
      "Shopify",
      "SEO/GEO",
      "i18n",
    ],
  },
  {
    title: "Backend & Infra",
    skills: ["Supabase", "REST APIs", "Vercel", "GitHub Actions", "npm"],
  },
  {
    title: "Game Development",
    skills: [
      "Roblox Studio",
      "DataStores",
      "Networking",
      "Anti-exploit",
      "NPC AI",
      "Game Design",
      "Live Ops",
      "Monetisation",
    ],
  },
  {
    title: "AI",
    skills: [
      "Claude Code",
      "Skills, plugins & MCP",
      "Agent workflows",
      "Business automation",
      "Image & video generation",
    ],
  },
  {
    title: "Design",
    skills: [
      "UI/UX Design",
      "Brand Identity",
      "Campaign Design",
      "GFX",
      "Prototyping",
      "Figma",
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      "Git",
      "VS Code",
      "Creator Hub",
      "Photoshop",
      "Photopea",
      "Trello",
      "Discord",
    ],
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
            <span className="label">04 · Expertise</span>
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
