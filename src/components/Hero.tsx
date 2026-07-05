import React from 'react';
import { motion } from 'motion/react';
import { HeroContent } from './HeroContent';

interface HeroProps {
  onWatchDemo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onWatchDemo }) => {
  return (
    <div id="adeora-hero-container" className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-transparent select-none">
      {/* UI Content Wrapper - Layered relative z-10 for perfect placement */}
      <div className="relative z-10 w-full flex-grow flex flex-col items-center justify-center pt-24 pb-12">
        <HeroContent onWatchDemo={onWatchDemo} />
      </div>
    </div>
  );
};
