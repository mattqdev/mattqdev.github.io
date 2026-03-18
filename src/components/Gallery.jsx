import React, { useState, useCallback, useMemo } from "react";
import { FaPlay, FaArrowLeft, FaArrowRight, FaExpand } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Gallery = ({ images = [], videos = [] }) => {
  console.log("Gallery props:", { images, videos });
  const media = useMemo(() => {
    const formattedImages = images.map((img) => {
      if (typeof img === "string") {
        return { type: "image", src: img, alt: "Gallery Image" };
      }
      return {
        type: "image",
        src: img.src,
        alt: img.alt || "Gallery Image",
      };
    });

    const formattedVideos = videos.map((v) => {
      const src = typeof v === "string" ? v : v.src;
      return { type: "video", src, alt: "Video content" };
    });

    return [...formattedImages, ...formattedVideos];
  }, [images, videos]);

  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = media.length;

  const next = useCallback(
    () => setCurrent((p) => (p === total - 1 ? 0 : p + 1)),
    [total]
  );
  const prev = useCallback(
    () => setCurrent((p) => (p === 0 ? total - 1 : p - 1)),
    [total]
  );

  if (total === 0)
    return (
      <p
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: ".85rem",
        }}
      >
        No media to display.
      </p>
    );

  const currentItem = media[current];

  return (
    <div className="project-gallery">
      {/* Main carousel */}
      <div className="gallery-main">
        <button className="gallery-nav" onClick={prev} aria-label="Previous">
          <FaArrowLeft />
        </button>

        <div
          className="gallery-media-container"
          style={{ position: "relative" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {currentItem.type === "image" ? (
                <img
                  src={currentItem.src}
                  alt={currentItem.alt}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 480,
                    objectFit: "contain",
                    cursor: "zoom-in",
                  }}
                  onClick={() => setLightbox(true)}
                />
              ) : (
                <video
                  src={currentItem.src}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ maxWidth: "100%", maxHeight: 480 }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {currentItem.type === "image" && (
            <button
              onClick={() => setLightbox(true)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,.6)",
                border: "1px solid rgba(255,255,255,.15)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: ".8rem",
              }}
              aria-label="Fullscreen"
            >
              <FaExpand />
            </button>
          )}
        </div>

        <button className="gallery-nav" onClick={next} aria-label="Next">
          <FaArrowRight />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="gallery-thumbnails">
        {media.map((item, i) => (
          <div
            key={i}
            className={`thumbnail ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
          >
            {item.type === "image" ? (
              <img src={item.src} alt={item.alt} />
            ) : (
              <div className="video-thumb">
                <video src={item.src} muted playsInline />
                <FaPlay className="play-icon" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="gallery-counter">
        {current + 1} / {total}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && currentItem.type === "image" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.92)",
              backdropFilter: "blur(8px)",
              zIndex: 9000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "zoom-out",
            }}
          >
            <img
              src={currentItem.src}
              alt={currentItem.alt}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
