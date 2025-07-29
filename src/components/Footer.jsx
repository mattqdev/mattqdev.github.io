// src/components/Footer.jsx
import React from 'react';
import { FaDiscord, FaEnvelope, FaTwitter } from 'react-icons/fa';
import Contact from './Contact';
import robloxIcon from '../assets/icons/roblox.svg';

const Footer = () => {
  return (
    <>
      <Contact />
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">Matt<span>Q</span></div>
            <p>Developer & Designer creating engaging digital experiences</p>
            
            <div className="footer-socials">
              <a href="https://discord.gg/ETgCMSps4c" target="_blank" rel="noopener noreferrer">
                <FaDiscord />
              </a>
              <a href="mailto:mattqdevv@gmail.com">
                <FaEnvelope />
              </a>
              <a href="https://x.com/mattqdev" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://www.roblox.com/users/2992118050" target="_blank" rel="noopener noreferrer">
                <img draggable="false" src={robloxIcon} alt="Roblox Icon" style={{width:20}}/>
              </a>
            </div>
          </div>
          
          <div className="copyright">
            &copy; 2025 MattQ. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;