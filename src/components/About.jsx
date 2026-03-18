// src/components/About.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaChartLine, FaUsers, FaUser } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import About3D from "./About3D";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function useCounter(end, duration, trigger) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      // Ease out
      setValue(Math.floor(pct * pct * (3 - 2 * pct) * end));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, end, duration]);
  return value;
}

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const visits = useCounter(3400000, 2200, isInView);
  const members = useCounter(88000, 2000, isInView);
  const followers = useCounter(15200, 1800, isInView);

  const stats = [
    {
      icon: <FaChartLine />,
      value: visits.toLocaleString() + "+",
      label: "Game Visits",
    },
    {
      icon: <FaUsers />,
      value: members.toLocaleString() + "+",
      label: "Group Members",
    },
    { icon: <FaUser />, value: followers.toLocaleString(), label: "Followers" },
  ];

  return (
    <section id="about" className="section">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="section-title">
          <div className="section-label">Background</div>
          <motion.h2 variants={fadeUp}>
            About <em>Me</em>
          </motion.h2>
          <p>Developer & designer with a love for craft across platforms.</p>
        </div>

        <div className="about-content">
          <motion.div className="about-text" variants={containerVariants}>
            <motion.h3 variants={fadeUp}>
              {new Date().getFullYear() - 2020}+ Years developing stuff that
              works (mostly)
            </motion.h3>

            <motion.p variants={fadeUp}>
              I'm a passionate developer who creates innovative web applications
              and immersive Roblox games. With expertise spanning programming
              and visual design, I craft polished experiences from first pixel
              to final deploy.
            </motion.p>

            <motion.p variants={fadeUp}>
              My journey started with web fundamentals and grew into multiple
              languages, platforms, and disciplines. Since 2022 I've been deep
              in Roblox development — combining game design intuition with
              full-stack thinking to build experiences players keep coming back
              to.
            </motion.p>

            <motion.p
              variants={fadeUp}
              style={{
                color: "var(--text-muted)",
                fontSize: ".78rem",
                fontFamily: "var(--font-mono)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 0,
              }}
            >
              Roblox Stats · last update: Jun 2025
            </motion.p>

            <motion.div
              className="stats"
              ref={ref}
              variants={containerVariants}
              style={{ marginTop: 12 }}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className="stat-box animate"
                  variants={fadeUp}
                  whileHover={{ y: -6, borderColor: "rgba(255,77,90,.35)" }}
                >
                  <div className="stat-icon">{s.icon}</div>
                  <h4>{s.value}</h4>
                  <p>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="wrapper-3d" variants={fadeUp}>
            <About3D />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
