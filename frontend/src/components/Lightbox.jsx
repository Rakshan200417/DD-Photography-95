import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const Lightbox = ({ images, currentIndex, isOpen, onClose, onPrev, onNext }) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) onNext();
    if (touchStart - touchEnd < -75) onPrev();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="lightbox-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(43, 31, 23, 0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 11000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={onClose}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer',
            zIndex: 11001,
          }}
        >
          <FaTimes />
        </button>

        <button 
          className="lightbox-nav prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: 'absolute',
            left: '30px',
            background: 'rgba(212, 197, 176, 0.2)',
            border: 'none',
            color: 'white',
            padding: '15px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaChevronLeft />
        </button>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="lightbox-content"
          style={{
            maxWidth: '90%',
            maxHeight: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={images[currentIndex]} 
            alt={`Gallery ${currentIndex}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              boxShadow: '0 20px 50px rgba(43, 31, 23, 0.5)',
              borderRadius: '8px',
            }}
          />
          <div style={{ color: 'var(--text-secondary)', marginTop: '20px', letterSpacing: '2px' }}>
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>

        <button 
          className="lightbox-nav next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: 'absolute',
            right: '30px',
            background: 'rgba(212, 197, 176, 0.2)',
            border: 'none',
            color: 'white',
            padding: '15px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaChevronRight />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
