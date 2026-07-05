import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { settings } = usePortfolio();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="portfolio-footer" className="bg-[#050B14]/40 border-t border-white/10 py-12 relative z-10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-display font-bold text-white tracking-tight text-lg">
              {settings?.name || "Mustafa Mohammed"}
            </span>
            <span className="font-mono text-xs text-white/60 tracking-wider mt-1 font-semibold">
              {settings?.title || "Principal Full-Stack Architect"}
            </span>
          </div>

          <div className="flex items-center space-x-5 text-white/40">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors" title="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors" title="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors" title="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
          
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50 font-mono">
            &copy; {currentYear} {settings?.name || "Mustafa Mohammed"}. All rights reserved.
          </p>
          <p className="text-xs text-white/40 font-mono flex items-center gap-1">
            Built with React & Tailwind <Heart className="w-3 h-3 text-[#38BDF8] fill-[#38BDF8]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
