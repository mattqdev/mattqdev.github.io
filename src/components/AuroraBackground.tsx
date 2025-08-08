import React from 'react';
import './styles/Aurora.css';

export const AuroraBackground = () => {

  function toggleDarkMode() {
      document.body.classList.toggle('dark');
  }

  return (
    <div className="aurora-container">
      <div className="aurora-effect">
        <div className="aurora-bg radial-mask"></div>
      </div>
    </div>
  );
};
