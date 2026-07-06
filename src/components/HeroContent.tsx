import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, FileText } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroContentProps {
  subtitleText?: string;
  headlineText?: string;
  headlineHighlightText?: string;
  descriptionText?: string;
  onWatchDemo?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  subtitleText = "ENGINEERING",
  headlineText = "THE FUTURE",
  headlineHighlightText = "OF DIGITAL",
  descriptionText = "From modern web platforms to enterprise software and AI automation, we build scalable digital products designed for performance and long-term growth.",
  onWatchDemo
}) => {
  const { openResumeModal } = usePortfolio();

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 mt-12 md:mt-16 lg:mt-20">
      
      {/* Subtitle - Entrance Animation: Y 20px -> 0, Opacity 0 -> 1, Duration 0.6s, easeOut */}
      <motion.span
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-[11px] md:text-sm font-sans font-medium uppercase tracking-[0.25em] text-[#38BDF8] mb-4 md:mb-6 block"
      >
        {subtitleText}
      </motion.span>

      {/* Main Headline (H1) - Entrance Animation: Y 30px -> 0, Opacity 0 -> 1, Duration 0.8s, easeOut, Delay 0.1s */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] font-display font-bold leading-[1.1] tracking-tight text-white select-none"
      >
        {headlineText} <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0084FF] via-[#38BDF8] to-white font-extrabold">
          {headlineHighlightText}
        </span>
      </motion.h1>

      {/* Description Paragraph - Entrance Animation: Y 20px -> 0, Opacity 0 -> 1, Duration 0.8s, easeOut, Delay 0.2s */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="text-white/80 text-base md:text-[1.125rem] font-sans font-normal leading-[1.625] max-w-2xl mt-6 md:mt-8"
      >
        {descriptionText}
      </motion.p>

      {/* Buttons (CTAs) - Entrance Animation: Y 20px -> 0, Opacity 0 -> 1, Duration 0.8s, easeOut, Delay 0.3s */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-5"
      >
        {/* "View Our Work" Button */}
        <Link
          to="/projects"
          className="group relative flex items-center space-x-4 text-white text-[13px] font-sans font-bold uppercase tracking-wider pl-6 pr-2 py-2 rounded-full border border-white/20 bg-transparent hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
        >
          <span>View Our Work</span>
          {/* Circular icon wrapper */}
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-transparent group-hover:bg-white transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-white group-hover:text-[#050B14] transition-colors duration-300" />
          </div>
        </Link>

        {/* "View CV" Button */}
        <button
          onClick={openResumeModal}
          className="group relative flex items-center space-x-4 text-white text-[13px] font-sans font-bold uppercase tracking-wider pl-6 pr-2 py-2 rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/5 hover:bg-[#38BDF8]/10 backdrop-blur-sm transition-all duration-300 cursor-pointer"
        >
          <span>عرض السيرة الذاتية (CV)</span>
          {/* Circular icon wrapper */}
          <div className="w-8 h-8 rounded-full border border-[#38BDF8]/30 flex items-center justify-center bg-transparent group-hover:bg-[#38BDF8] transition-all duration-300">
            <FileText className="w-4 h-4 text-[#38BDF8] group-hover:text-[#050B14] transition-colors duration-300" />
          </div>
        </button>
      </motion.div>

    </div>
  );
};
