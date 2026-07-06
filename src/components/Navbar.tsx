import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Plus, 
  LayoutDashboard, 
  FileText,
  Home,
  User,
  Cpu,
  FolderGit2,
  Mail
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { settings, user, openResumeModal } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: User },
    { name: 'Skills & Services', path: '/skills', icon: Cpu },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Contact', path: '/contact', icon: Mail },
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

  // Slow, elegant animation variants for desktop nav buttons
  const desktopContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // elegant slow stagger
        delayChildren: 0.2
      }
    }
  };

  const desktopItemVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 50, // Slower spring for high-end feel
        damping: 18,
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#050B14]/40 border-b border-white/[0.08] backdrop-blur-xl">
      {/* Navigation Layout - Padding varies from px-6 (mobile) to px-24 (desktop) */}
      <div className="w-full max-w-7xl mx-auto h-20 flex items-center justify-between px-6 md:px-12 lg:px-24">
        
        {/* Logo Block: Flex column arrangement */}
        <Link to="/" onClick={closeMobileMenu} className="flex flex-col text-left group">
          <span className="text-lg md:text-xl font-display font-semibold tracking-wide text-white leading-tight group-hover:text-[#38BDF8] transition-colors duration-300">
            {logoMain}
          </span>
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/50 leading-none mt-0.5 group-hover:text-white/70 transition-colors duration-300">
            Information Technology (IT)
          </span>
        </Link>

        {/* Desktop Navigation Links: Elegant Floating Glass Pill Dock */}
        <motion.nav 
          variants={desktopContainerVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex items-center bg-white/[0.02] border border-white/[0.08] p-1 rounded-full backdrop-blur-md shadow-inner"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <motion.div key={link.name} variants={desktopItemVariants}>
                <Link
                  to={link.path}
                  className={`text-[12px] font-sans font-semibold uppercase tracking-wider transition-all duration-300 relative px-4.5 py-1.5 rounded-full flex items-center space-x-1.5 ${
                    active 
                      ? 'text-white font-bold' 
                      : 'text-white/60 hover:text-white/90'
                  }`}
                >
                  {/* Active glass pill background slide indicator */}
                  {active && (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-white/[0.08] border border-white/[0.12] rounded-full shadow-[0_2px_10px_rgba(255,255,255,0.02)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 relative z-10 transition-colors ${active ? 'text-[#38BDF8]' : 'text-white/50'}`} />
                  <span className="relative z-10">{link.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Action Area (Desktop) */}
        <motion.div 
          variants={desktopContainerVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex items-center space-x-4"
        >
          {/* View CV Button */}
          <motion.div variants={desktopItemVariants}>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={openResumeModal}
              className="group flex items-center space-x-2.5 text-[#38BDF8] text-[12px] font-sans font-bold uppercase tracking-wider px-4.5 py-2 rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/4 hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.12)] transition-all duration-300 cursor-pointer"
            >
              <span>عرض الـ CV</span>
              <div className="w-7 h-7 rounded-full border border-[#38BDF8]/25 flex items-center justify-center bg-transparent group-hover:bg-[#38BDF8] transition-all duration-300">
                <FileText className="w-3.5 h-3.5 text-[#38BDF8] group-hover:text-[#050B14] transition-colors duration-300" />
              </div>
            </motion.button>
          </motion.div>

          {/* Admin Dashboard if logged in */}
          {user && (
            <motion.div variants={desktopItemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/admin"
                className="p-2 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25 transition-all flex items-center justify-center w-9 h-9"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile Actions with elegant tap interaction */}
        <div className="flex lg:hidden items-center space-x-4">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleMobileMenu}
            className="p-2 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center w-10 h-10"
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileMenuOpen ? "close" : "open"}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

      </div>

      {/* Mobile Menu Overlay: Hamburger/Close icon toggling with beautiful Framer Motion spring sliders */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="lg:hidden absolute top-20 left-0 right-0 w-full bg-[#050B14]/92 border-b border-white/10 backdrop-blur-2xl py-6 px-6 z-40 flex flex-col space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link, idx) => {
                const active = isActive(link.path);
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 45, // Slow elegant slide-in
                      damping: 15,
                      delay: idx * 0.12 
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`px-4.5 py-3 rounded-xl text-[13px] font-semibold uppercase tracking-wider flex items-center space-x-3 transition-all duration-300 ${
                        active 
                          ? 'text-white bg-white/[0.08] border border-white/[0.12] shadow-inner font-bold' 
                          : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#38BDF8]' : 'text-white/50'}`} />
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 45,
                damping: 15,
                delay: navLinks.length * 0.12 + 0.1
              }}
              className="pt-4 border-t border-white/10 flex flex-col gap-3"
            >
              {/* Mobile CV Button */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  openResumeModal();
                }}
                className="w-full py-3 rounded-xl border border-[#38BDF8]/35 bg-[#38BDF8]/8 hover:bg-[#38BDF8]/15 text-[#38BDF8] text-[13px] font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-2 cursor-pointer shadow-[0_4px_15px_rgba(56,189,248,0.05)] active:scale-[0.98] transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                <span>عرض السيرة الذاتية (CV)</span>
              </button>

              {/* Mobile Admin Link */}
              {user && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="w-full py-3 rounded-xl border border-white/15 bg-white/5 text-white text-[13px] font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-2 active:scale-[0.98] transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
