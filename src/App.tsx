/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Background } from './components/Background';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { CustomCursor } from './components/CustomCursor';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { SkillsServices } from './pages/SkillsServices';
import { Projects } from './pages/Projects';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// Inner component to handle conditional layout
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomeRoute = location.pathname === '/';
  
  // High-performance Framer Motion scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative min-h-screen flex flex-col text-white bg-transparent font-sans selection:bg-white/20 selection:text-[#38BDF8]">
      {/* Premium Custom Mouse Cursor */}
      <CustomCursor />

      {/* Top Scroll Progress Bar */}
      {!isAdminRoute && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0084FF] via-[#38BDF8] to-cyan-300 origin-left z-[100]" 
          style={{ scaleX }} 
        />
      )}

      {/* Dynamic Ambient Background */}
      <Background />

      {/* Conditional Navbar (Hiding on Admin Workspaces to keep layouts pristine) */}
      {!isAdminRoute && <Navbar />}

      {/* Main Content Areas with smooth page offsets */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<SkillsServices />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Conditional Footer (Hiding on Admin Workspaces and Home page) */}
      {!isAdminRoute && !isHomeRoute && <Footer />}

      {/* Floating Resume Interactive Document Overlay */}
      <ResumeModal />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <Router>
        <AppContent />
      </Router>
    </PortfolioProvider>
  );
}
