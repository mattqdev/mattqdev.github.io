// src/components/Header.jsx
import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = ({ 
  sections, 
  activeSection, 
  scrolled, 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  scrollToSection 
}) => {
  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container header-container">
        <Link to={"/"} className="logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
          Matt<span>Q</span>
        </Link>
        
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={activeSection === section.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section.id);
                }}
              >
                {section.name}
              </a>
            </li>
          ))}
        </ul>
        
        <div 
          className="mobile-menu" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </header>
  );
};

export default Header;