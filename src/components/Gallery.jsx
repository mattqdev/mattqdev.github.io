// src/components/Gallery.jsx
import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

const Gallery = ({ images = [], videos = [] }) => {
  // 1. Combina immagini e video in un array unico con tipo
  const media = [
    ...images.map(src => ({ type: 'image', src })),
    ...videos.map(src => ({ type: 'video', src })),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = media.length;

  const nextItem = () => {
    setCurrentIndex(prev => (prev === total - 1 ? 0 : prev + 1));
  };

  const prevItem = () => {
    setCurrentIndex(prev => (prev === 0 ? total - 1 : prev - 1));
  };

  if (total === 0) {
    return <p>Nessun media disponibile.</p>;
  }

  const { type, src } = media[currentIndex];

  return (
    <div className="project-gallery">
      {/* Carosello principale */}
      <div className="gallery-main">
        <button className="gallery-nav prev" onClick={prevItem}>&lt;</button>
        <div className="gallery-media-container">
          {type === 'image' ? (
            <img src={src} alt={`Media ${currentIndex + 1}`} />
          ) : (
            <video
              src={src}
              controls
              autoPlay
              loop
              muted
              playsInline
            >
              Il tuo browser non supporta il tag video.
            </video>
          )}
        </div>
        <button className="gallery-nav next" onClick={nextItem}>&gt;</button>
      </div>

      {/* Miniature */}
      <div className="gallery-thumbnails">
        {media.map((item, idx) => (
          <div
            key={idx}
            className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          >
            {item.type === 'image' ? (
              <img src={item.src} alt={`Thumbnail ${idx + 1}`} />
            ) : (
              <div className="video-thumb">
                <video src={item.src} muted loop playsInline />
                <FaPlay className="play-icon" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contatore */}
      <div className="gallery-counter">
        {currentIndex + 1} / {total}
      </div>
    </div>
  );
};

export default Gallery;
