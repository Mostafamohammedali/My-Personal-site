import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Position of the lead dot
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for the trailing ring to create a luxurious lagging inertia effect
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const followerX = useSpring(cursorX, springConfig);
  const followerY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable custom cursor on mobile/touch devices for responsive best practices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Detect interactive elements (links, buttons, inputs, cards) to activate magnetic scaling
      const isInteractive = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('input') || 
        target.closest('textarea') || 
        target.closest('.interactive-hover') ||
        target.style.cursor === 'pointer';
      
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Leading Dot (Ultra-responsive, instant tracking) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#38BDF8] rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* 2. Trailing Follower Ring (Smooth inertia spring lag) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-screen border"
        style={{
          x: followerX,
          y: followerY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 48 : 24,
          height: isHovered ? 48 : 24,
          borderColor: isHovered ? '#38BDF8' : 'rgba(56, 189, 248, 0.4)',
          backgroundColor: isHovered ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0, 0, 0, 0)',
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 28
        }}
      />
    </>
  );
};
