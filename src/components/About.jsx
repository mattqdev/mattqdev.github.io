// src/components/About.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FaChartLine, FaUsers, FaUser } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import About3D from './About3D';


const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [animatedStats, setAnimatedStats] = useState({ visits: 0, members: 0, followers: 0 });

  // Animazione delle statistiche
  useEffect(() => {
    if (isInView) {
      const animateValue = (start, end, duration, property) => {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const value = Math.floor(progress * (end - start) + start);
          
          setAnimatedStats(prev => ({ ...prev, [property]: value }));
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      };
      
      animateValue(0, 3400000, 2000, 'visits');
      animateValue(0, 88000, 2000, 'members');
      animateValue(0, 15200, 2000, 'followers');
    }
  }, [isInView]);

  // Effetto hover per le card delle competenze

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Me
          </motion.h2>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Developer & Designer with {new Date().getFullYear() - 2020}+ Years Experience
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              I'm a passionate developer who creates innovative web applications and immersive Roblox games. 
              With expertise in both programming and visual design, I craft unique experiences for every project.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              My journey began with web development fundamentals and has expanded to multiple programming languages 
              and design disciplines. Since 2022, I've been developing Roblox games, combining my love for gaming 
              with full-stack programming to create engaging experiences.
            </motion.p>

            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="stats-title"
            >
              My Roblox Achievements (last update: Jun 2025):
            </motion.h4>
            
            <div className="stats" ref={ref}>
              <motion.div 
                className="stat-box"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="stat-icon">
                  <FaChartLine />
                </div>
                <h4>{animatedStats.visits.toLocaleString()}+</h4>
                <p>Game Visits</p>
              </motion.div>
              
              <motion.div 
                className="stat-box"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <h4>{animatedStats.members.toLocaleString()}+</h4>
                <p>Group Members</p>
              </motion.div>
              
              <motion.div 
                className="stat-box"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="stat-icon">
                  <FaUser />
                </div>
                <h4>{animatedStats.followers.toLocaleString()}</h4>
                <p>Followers</p>
              </motion.div>
            </div>
          </div>
          <div className="wrapper-3d">
            <About3D />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;