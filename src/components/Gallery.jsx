// src/components/Gallery.jsx
import React, { useState } from 'react';

const Gallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <div className="project-gallery">
      <div className="gallery-main">
        <button className="gallery-nav prev" onClick={prevImage}>
          &lt;
        </button>
        
        <div className="gallery-image-container">
          <img 
            src={images[currentIndex]} 
            alt={`Project screenshot ${currentIndex + 1}`}
          />
        </div>
        
        <button className="gallery-nav next" onClick={nextImage}>
          &gt;
        </button>
      </div>
      
      <div className="gallery-thumbnails">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>
      
      <div className="gallery-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default Gallery;