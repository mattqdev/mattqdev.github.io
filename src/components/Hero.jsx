// src/components/Hero.jsx
import React from 'react';
import { FaDiscord, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import robloxIcon from '../assets/icons/roblox.svg';
import avatarIcon from '../assets/icons/avatar.png';

const Hero = ({ scrollToSection }) => {
  return (
    <section id="hero" className="hero section">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>Hi, I'm <span>MattQ</span><br />Software Developer & Designer</h1>
          <p>
            I love programming and designing UI/UX. 
            Specializing in Web Development, Roblox game development and UI/UX design across various platforms.
          </p>
          
          <div className="hero-btns">
            <button 
              className="btn" 
              onClick={() => scrollToSection('projects')}
            >
              View Projects
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => scrollToSection('contact')}
            >
              Contact Me
            </button>
          </div>
          
          <div className="social-icons">
            <a href="https://discord.gg/ETgCMSps4c" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaDiscord />
            </a>
            <a href="mailto:mattqdevv@gmail.com" className="social-icon">
              <FaEnvelope />
            </a>
            <a href="https://x.com/mattqdev" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaXTwitter />
            </a>
            <a href="https://www.roblox.com/users/2992118050" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img draggable="false" src={robloxIcon} alt="Roblox Icon" style={{width:"40%"}}/>
            </a>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="hero-img-container">
            <div className="placeholder-avatar">
              <img draggable="false" src={avatarIcon} alt="Roblox MattQ's Avatar" style={{width:"100%", objectFit: "cover", borderRadius: "50%"}}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;