/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { Background } from './components/Background';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';

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

  return (
    <div className="relative min-h-screen flex flex-col text-white bg-[#050B14] font-sans selection:bg-white/20 selection:text-[#38BDF8]">
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

      {/* Conditional Footer (Hiding on Admin Workspaces) */}
      {!isAdminRoute && <Footer />}

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
