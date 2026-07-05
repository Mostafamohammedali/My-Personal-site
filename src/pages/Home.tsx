import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowUpRight,
  Code2, 
  Layers, 
  Database, 
  Terminal, 
  Sparkles,
  ChevronRight,
  Video,
  X
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Hero } from '../components/Hero';

export const Home: React.FC = () => {
  const { settings, projects, services, loading } = usePortfolio();
  const [showDemo, setShowDemo] = useState(false);

  // Limit featured services and projects
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  if (featuredProjects.length === 0 && projects.length > 0) {
    featuredProjects.push(...projects.slice(0, 3));
  }

  const featuredServices = services.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  if (loading && !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B14]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#0084FF] border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-white/60 uppercase tracking-widest">Initializing Core Architecture...</span>
        </div>
      </div>
    );
  }

  const name = settings?.name || "Mustafa Mohammed";
  const title = settings?.title || "Principal Full-Stack Architect";

  return (
    <div className="w-full relative bg-transparent overflow-x-hidden text-white">
      {/* 1. HERO VIEWPORT LAYER */}
      <Hero onWatchDemo={() => setShowDemo(true)} />

      {/* 2. PAGE CONTENT SECTIONS OVER DARK CANVASES */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pb-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-28 sm:gap-36"
      >
        {/* STATISTICS SECTION */}
        <section id="statistics-section" className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          <motion.div
            variants={itemVariants}
            className="p-8 glass-panel rounded-2xl flex flex-col gap-2 text-center transition-all duration-300 hover:scale-[1.02] border border-white/10"
          >
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
              {settings?.yearsOfExperience || 8}+
            </span>
            <span className="text-xs font-mono uppercase text-white/60 tracking-widest font-bold">Years of Experience</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-8 glass-panel rounded-2xl flex flex-col gap-2 text-center transition-all duration-300 hover:scale-[1.02] border border-white/10"
          >
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
              {settings?.completedProjects || 42}+
            </span>
            <span className="text-xs font-mono uppercase text-white/60 tracking-widest font-bold">Projects Completed</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-8 glass-panel rounded-2xl flex flex-col gap-2 text-center transition-all duration-300 hover:scale-[1.02] border border-white/10"
          >
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
              {settings?.masteredTechs || 15}+
            </span>
            <span className="text-xs font-mono uppercase text-white/60 tracking-widest font-bold">Technologies Mastered</span>
          </motion.div>
        </section>

        {/* FEATURED SERVICES SECTION */}
        <section id="featured-services" className="flex flex-col gap-12 relative z-10">
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">SERVICES</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white">What We Partner with You to Build</h2>
            <p className="text-white/70 text-base font-sans leading-relaxed">
              High-integrity digital solutions engineered to streamline operations and deliver pristine interface animations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredServices.map((service, idx) => (
              <motion.div
                key={service.id || idx}
                variants={itemVariants}
                className="p-8 glass-panel hover:border-white/25 hover:shadow-[0_12px_40px_rgba(0,132,255,0.15)] rounded-2xl transition-all duration-500 text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] group-hover:bg-white group-hover:text-[#050B14] transition-all duration-300">
                    {idx === 0 ? <Code2 className="w-6 h-6" /> : idx === 1 ? <Layers className="w-6 h-6" /> : idx === 2 ? <Database className="w-6 h-6" /> : <Terminal className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mt-6">{service.title}</h3>
                  <p className="text-white/75 text-sm leading-relaxed mt-3 font-sans">{service.description}</p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {service.features.slice(0, 3).map((feat, fIdx) => (
                    <span key={fIdx} className="px-2.5 py-1 bg-white/5 text-[10px] text-white/80 font-mono rounded-md border border-white/10 font-semibold">
                      {feat}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="flex justify-center mt-4">
            <Link
              to="/skills"
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-sm transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
            >
              <span>Explore All Services & Skills</span>
              <ArrowUpRight className="w-4 h-4 text-[#38BDF8]" />
            </Link>
          </motion.div>
        </section>

        {/* FEATURED PROJECTS SECTION */}
        <section id="featured-projects" className="flex flex-col gap-12 relative z-10">
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">PROJECTS SHOWCASE</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white">Featured Engineering Deployments</h2>
            <p className="text-white/75 text-base font-sans">
              Select production systems demonstrating absolute performance, security, and gorgeous design polish.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.id || idx}
                variants={itemVariants}
                className="group glass-panel rounded-2xl overflow-hidden flex flex-col h-full hover:border-white/25 hover:shadow-[0_12px_40px_rgba(0,132,255,0.15)] transition-all duration-500 hover:scale-[1.01]"
              >
                {/* Image overlay with modern aesthetic */}
                <div className="relative aspect-video overflow-hidden bg-[#050B14]">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02122c] via-transparent to-transparent opacity-90" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-[#38BDF8] tracking-wider uppercase font-extrabold shadow-sm">
                    {project.category}
                  </span>
                </div>

                {/* Content text in dark contrast */}
                <div className="p-6 flex flex-col justify-between flex-1 text-left">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white group-hover:text-[#38BDF8] transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-white/70 text-xs mt-3 line-clamp-3 leading-relaxed font-sans">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6">
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.slice(0, 4).map((tech, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-white/5 text-[10px] text-white/80 font-mono rounded-md border border-white/10 font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold">Production-grade</span>
                      <Link
                        to="/projects"
                        className="text-xs text-[#38BDF8] font-bold hover:text-white flex items-center space-x-1"
                      >
                        <span>Explore specs</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="flex justify-center mt-4">
            <Link
              to="/projects"
              className="px-6 py-3.5 rounded-full bg-white text-[#050B14] hover:bg-white/90 font-bold text-sm transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <span>Browse All Deployments</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>

        {/* TECHNOLOGY STACK CORES */}
        <section id="technology-stack" className="flex flex-col gap-12 relative z-10">
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">STACK CORE</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mt-2">Core Competencies & Tooling</h2>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "TypeScript", icon: "TS" },
              { name: "React 19 / Vite", icon: "RC" },
              { name: "Next.js", icon: "NX" },
              { name: "Node.js / Express", icon: "ND" },
              { name: "GCP / AWS Cloud", icon: "CL" },
              { name: "Docker / Container", icon: "DK" },
              { name: "GraphQL APIs", icon: "GQ" },
              { name: "PostgreSQL / SQL", icon: "PG" },
              { name: "NoSQL / MongoDB", icon: "DB" },
              { name: "Redis Caching", icon: "RD" },
              { name: "Gemini API Orchestrator", icon: "AI" },
              { name: "CI/CD Actions", icon: "CD" }
            ].map((tech, idx) => (
              <div
                key={idx}
                className="p-5 glass-panel border border-white/10 hover:border-[#38BDF8]/30 rounded-xl flex items-center space-x-4 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[#38BDF8] text-xs font-bold">
                  {tech.icon}
                </div>
                <span className="font-sans text-xs font-bold text-white/90">{tech.name}</span>
              </div>
            ))}
          </motion.div>
        </section>
      </motion.div>

      {/* DEMO VIDEO MODAL OVERLAY */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-3xl aspect-video bg-[#050B14] rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_robo_video.mp4"
              autoPlay
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};
