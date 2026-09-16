import React, { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isImageHover, setIsImageHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const onMouseMove = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    window.addEventListener('mousemove', onMouseMove);

    const handleHoverStart = (e) => {
      const target = e.target;
      if (target.closest('button, a, .btn, .nav-link')) {
        setIsHovering(true);
      }
      if (target.closest('img, .category-card, .package-card')) {
        setIsImageHover(true);
      }
    };

    const handleHoverEnd = () => {
      setIsHovering(false);
      setIsImageHover(false);
    };

    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [onMouseMove]);

  if (isMobile) return null;

  return (
    <>
      <style>{`
        body { cursor: none !important; }
        a, button, .btn { cursor: none !important; }
      `}</style>
      
      {/* Outer Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 40,
          height: 40,
          border: '1.5px solid var(--text-primary)',
          borderRadius: '50%',
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
        animate={{
          scale: isImageHover ? 2.5 : (isHovering ? 2 : 1),
          borderColor: isHovering || isImageHover ? 'var(--accent-color)' : 'var(--text-primary)',
          backgroundColor: isImageHover ? 'rgba(181, 98, 46, 0.1)' : 'transparent',
        }}
      >
        {isImageHover && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'var(--accent-color)',
              fontSize: '8px',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
          >
            VIEW
          </motion.span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 6,
          height: 6,
          backgroundColor: 'var(--accent-color)',
          borderRadius: '50%',
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 10001,
        }}
      />
    </>
  );
};

export default CustomCursor;
