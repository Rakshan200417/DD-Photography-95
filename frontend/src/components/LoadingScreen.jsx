import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ isLoading }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000); // Ensure minimum 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--bg-color)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Shutter SVG Animation */}
          <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '30px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <clipPath id="shutter-clip">
                  <circle cx="50" cy="50" r="45" />
                </clipPath>
              </defs>
              <g clipPath="url(#shutter-clip)">
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.path
                    key={i}
                    d="M 50 50 L 100 50 L 100 0 Z"
                    fill="var(--accent-color)"
                    initial={{ rotate: angle, scale: 0 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      rotate: [angle, angle + 90, angle + 180]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ originX: "50px", originY: "50px" }}
                  />
                ))}
              </g>
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-color)" strokeWidth="2" />
            </svg>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              letterSpacing: '0.4em',
              margin: 0,
              textAlign: 'center',
            }}
          >
            DD PHOTOGRAPHY 95
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              height: '2px',
              backgroundColor: 'var(--accent-color)',
              marginTop: '15px'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
