import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, LayoutDashboard } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { settings, user } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills & Services', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const displayName = settings?.name || "Mustafa Mohammed";
  // Format logo: e.g. "MUSTAFA" or "MOHAMMED"
  const logoMain = displayName.split(' ')[0].toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent border-b border-white/10 backdrop-blur-md">
      {/* Navigation Layout - Padding varies from px-6 (mobile) to px-24 (desktop) */}
      <div className="w-full max-w-7xl mx-auto h-20 flex items-center justify-between px-6 md:px-12 lg:px-24">
        
        {/* Logo Block: Flex column arrangement */}
        <Link to="/" onClick={closeMobileMenu} className="flex flex-col text-left group">
          <span className="text-lg md:text-xl font-display font-semibold tracking-wide text-white leading-tight">
            {logoMain}
          </span>
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/70 leading-none mt-0.5">
            DESIGN STUDIO
          </span>
        </Link>

        {/* Desktop Navigation Links: Hidden on mobile. Displayed on desktop (lg:flex) with space-x-10 */}
        <nav className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[13px] font-sans font-medium uppercase tracking-wider transition-all duration-300 relative py-1 ${
                  active 
                    ? 'text-white' 
                    : 'text-white/80 hover:text-white/60'
                }`}
              >
                <span>{link.name}</span>
                {active && (
                  <span className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Area (Desktop) */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Admin Dashboard if logged in */}
          {user && (
            <Link
              to="/admin"
              className="p-2.5 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors"
              title="Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          )}

          {/* CTA Button ("Let's Create"): Flex container with items-center & space-x-3 */}
          <Link
            to="/contact"
            className="group flex items-center space-x-3 text-white text-[13px] font-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border border-white/20 bg-transparent hover:bg-white/5 transition-all duration-300"
          >
            <span>Let's Create</span>
            {/* Circular icon wrapper (w-8 h-8), fully rounded, border-white/30 */}
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-transparent group-hover:bg-white transition-all duration-300 group-hover:scale-105">
              <Plus className="w-4 h-4 text-white group-hover:text-[#050B14] transition-colors duration-300" />
            </div>
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center space-x-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Overlay: Hamburger/Close icon toggling a full-width dropdown menu overlay just beneath the navbar */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 w-full bg-[#050B14]/95 border-b border-white/15 backdrop-blur-xl py-6 px-6 z-40 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-xl text-[13px] font-medium uppercase tracking-wider transition-colors ${
                    active 
                      ? 'text-white bg-white/10 font-bold' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/15 flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="w-full py-3.5 rounded-xl bg-white text-[#050B14] text-[13px] font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-2"
            >
              <span>Let's Create</span>
              <Plus className="w-4 h-4 text-[#050B14]" />
            </Link>

            {user && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="w-full py-3.5 rounded-xl border border-white/20 text-white text-[13px] font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
