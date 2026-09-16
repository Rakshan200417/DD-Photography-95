import { useState, useCallback, useRef } from 'react';

const useTilt = (options = {}) => {
  const {
    maxRotation = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 1000,
    easing = 'cubic-bezier(.03,.98,.52,.99)',
  } = options;

  const [style, setStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transformStyle: 'preserve-3d',
    transition: `all ${speed}ms ${easing}`,
  });

  const elementRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const left = rect.left;
    const top = rect.top;

    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const tiltX = (maxRotation / 2 - y * maxRotation).toFixed(2);
    const tiltY = (x * maxRotation - maxRotation / 2).toFixed(2);

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transformStyle: 'preserve-3d',
      transition: 'none', // Disable transition during mouse move for responsiveness
    });

    // Handle gloss effect
    const shineX = x * 100;
    const shineY = y * 100;
    elementRef.current.style.setProperty('--shine-x', `${shineX}%`);
    elementRef.current.style.setProperty('--shine-y', `${shineY}%`);
  }, [maxRotation, perspective, scale]);

  const onMouseLeave = useCallback(() => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transformStyle: 'preserve-3d',
      transition: `all ${speed}ms ${easing}`,
    });
  }, [perspective, speed, easing]);

  return {
    tiltProps: {
      ref: elementRef,
      onMouseMove,
      onMouseLeave,
      style,
    },
  };
};

export default useTilt;
