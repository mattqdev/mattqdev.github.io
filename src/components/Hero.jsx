// src/components/Hero.jsx
import React from 'react';
import { FaDiscord, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import robloxIcon from '../assets/icons/roblox.svg';
import avatarIcon from '../assets/icons/avatar.png';
import {AuroraBackground} from './AuroraBackground.tsx'


const Hero = ({ scrollToSection }) => {
  return (
    <section id="hero" className="hero section anim">
      <AuroraBackground />
      <div className="container hero-content anim">
        <div className="hero-text" anim>
          <h1 className='border-dotted anim'>Hi, I'm <span>MattQ</span><br />Software Developer & Designer</h1>
          <p>
            I love programming and designing UI/UX. 
            Specializing in Web Development, Roblox game development and UI/UX design across various platforms.
          </p>
          
          <div className="hero-btns anim">
            <button 
              className="btn" 
              onClick={() => scrollToSection('projects')}
            >
              View Projects
            </button>
            <button 
              className="btn btn-outline anim" 
              onClick={() => scrollToSection('contact')}
            >
              Contact Me
            </button>
          </div>
          
          <div className="social-icons">
            <a href="mailto:mattqdevv@gmail.com" className="social-icon">
              <FaEnvelope />
            </a>
            <a href="https://x.com/mattqdev" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaXTwitter />
            </a>
            <a href="https://www.roblox.com/users/2992118050" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img draggable="false" src={robloxIcon} alt="Roblox Icon" style={{width:"40%"}}/>
            </a>
            <a href="https://discord.gg/ETgCMSps4c" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaDiscord />
            </a>
          </div>
        </div>
        
        <div className="hero-image anim">
          <div className="hero-img-container">
            <div className="placeholder-avatar">
              <img draggable="false" src={avatarIcon} title="MattQ's Roblox Avatar" alt="Roblox MattQ's Avatar" style={{width:"100%", objectFit: "cover", borderRadius: "50%"}}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;