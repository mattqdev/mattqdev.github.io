// src/components/About.jsx
import React, { useEffect } from 'react';

const About = () => {
  // Animate stats on scroll
  useEffect(() => {
    const stats = document.querySelectorAll('.stat-box');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });
    
    stats.forEach(stat => observer.observe(stat));
    
    return () => stats.forEach(stat => observer.unobserve(stat));
  }, []);

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-title">
          <h2>About Me</h2>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <h3>Developer & Designer with {new Date().getFullYear() - 2020}+ Years Experience</h3>
            <p>
              I'm a very young and passionate developer who loves create web applications and Roblox games. With a background in both programming 
              and visual design, I love create a unique design for every project I work on.
            </p>
            <p>
              My journey began in web development with basic html, css and js. Since then, I've expanded 
              my skillset to include multiple programming languages and design disciplines.
              From 2022 I'm developing also Roblox games, where I can express my love for videogames and full-stack programming.
            </p>

            <h4>My Roblox Achivements (last upd: Jun 2025):</h4>
            <div className="stats">
              <div className="stat-box">
                <h4>3.4M+</h4>
                <p>Game Visits</p>
              </div>
              <div className="stat-box">
                <h4>88K+</h4>
                <p>Group Members</p>
              </div>
              <div className="stat-box">
                <h4>15.2K</h4>
                <p>Followers</p>
              </div>
            </div>
          </div>
          
          <div className="skills-visualization">
            <h3>My Expertise Areas</h3>
            <div className="radar-container">
              <div className="radar-chart">
                <div className="radar-grid radar-grid-1"></div>
                <div className="radar-grid radar-grid-2"></div>
                <div className="radar-grid radar-grid-3"></div>
                <div className="radar-grid radar-grid-4"></div>
                
                <div className="radar-axis" style={{ transform: 'rotate(0deg)' }}></div>
                <div className="radar-axis" style={{ transform: 'rotate(60deg)' }}></div>
                <div className="radar-axis" style={{ transform: 'rotate(120deg)' }}></div>
                <div className="radar-axis" style={{ transform: 'rotate(180deg)' }}></div>
                <div className="radar-axis" style={{ transform: 'rotate(240deg)' }}></div>
                <div className="radar-axis" style={{ transform: 'rotate(300deg)' }}></div>
                
                <div className="radar-label" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}>Lua</div>
                <div className="radar-label" style={{ top: '50%', right: '10%' }}>JavaScript</div>
                <div className="radar-label" style={{ bottom: '10%', left: '70%' }}>UI/UX</div>
                <div className="radar-label" style={{ bottom: '10%', left: '30%' }}>Python</div>
                <div className="radar-label" style={{ top: '50%', left: '10%' }}>C#</div>
                <div className="radar-label" style={{ top: '30%', left: '20%' }}>Game Design</div>
                
                <div className="radar-area"></div>
                
                <div className="radar-point" style={{ top: '20%', left: '50%' }}></div>
                <div className="radar-point" style={{ top: '35%', left: '70%' }}></div>
                <div className="radar-point" style={{ top: '65%', left: '65%' }}></div>
                <div className="radar-point" style={{ top: '70%', left: '50%' }}></div>
                <div className="radar-point" style={{ top: '65%', left: '35%' }}></div>
                <div className="radar-point" style={{ top: '35%', left: '30%' }}></div>
              </div>
            </div>
            
            <div className="radar-legend">
              <div className="legend-item">
                <div className="legend-color"></div>
                <span>Programming</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#4d79ff' }}></div>
                <span>Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;