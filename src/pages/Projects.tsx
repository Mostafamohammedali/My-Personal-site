import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Github, 
  X, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const { projects, loading } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  // Derive unique categories from projects
  const categories = useMemo(() => {
    const list = new Set(projects.map(p => p.category));
    return ['all', ...Array.from(list)];
  }, [projects]);

  // Filter projects based on search query and category
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [projects, searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B14]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0084FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pt-28 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16 relative z-10 text-white"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants} className="text-left flex flex-col gap-3 border-b border-white/10 pb-8">
        <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">SHOWCASE</span>
        <h1 className="text-4xl font-display font-bold tracking-tight text-white">Engineering Deployments</h1>
        <p className="text-white/70 text-lg max-w-2xl mt-1 leading-relaxed font-sans">
          Explore complete production applications featuring detailed challenges solved, modular architectures, and source files.
        </p>
      </motion.div>

      {/* SEARCH AND FILTERS */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/10 pb-6 text-left"
      >
        {/* Search input with dark glass theme */}
        <div className="relative w-full md:w-80 font-sans">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/45" />
          <input
            type="text"
            placeholder="Search projects, technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 font-bold"
          />
        </div>

        {/* Category tags with dark glass theme */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 uppercase cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-[#050B14] font-extrabold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* PROJECTS GRID */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              variants={itemVariants}
              onClick={() => setActiveProjectModal(project)}
              className="group glass-panel hover:border-white/25 hover:shadow-[0_12px_40px_rgba(0,132,255,0.15)] rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 cursor-pointer text-left hover:scale-[1.01] border border-white/10"
            >
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden bg-[#050B14]">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02122c] via-transparent to-transparent opacity-90" />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-[#38BDF8] font-black tracking-wider uppercase shadow-sm">
                  {project.category}
                </span>
              </div>

              {/* Content Summary */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-[#38BDF8] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-3 font-sans">
                    {project.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10">
                  {/* Technologies tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 bg-white/5 text-[10px] text-white/80 font-mono rounded-md border border-white/10 font-semibold">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 bg-white/5 text-[10px] text-white/40 font-mono rounded-md border border-white/10 font-bold">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Inspect Specs</span>
                    <span className="text-[#38BDF8] font-bold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-20 bg-white/5 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4">
          <p className="text-white/60 font-sans text-sm font-semibold">No deployments found matching your search parameters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-white text-[#050B14] text-xs font-mono hover:bg-white/90 rounded-lg transition-colors cursor-pointer font-bold shadow-sm"
          >
            Reset Filters
          </button>
        </motion.div>
      )}

      {/* PROJECT DETAILS SLIDE-IN MODAL */}
      <AnimatePresence>
        {activeProjectModal && (
          <div id="project-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-4xl bg-[#050B14] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header Controls */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-extrabold">Deployment Specifications</span>
                <button
                  onClick={() => setActiveProjectModal(null)}
                  className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto text-left">
                
                {/* Hero Cover Image */}
                <div className="relative aspect-[21/9] bg-[#050B14] overflow-hidden">
                  <img
                    src={activeProjectModal.image}
                    alt={activeProjectModal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent" />
                </div>

                <div className="p-6 md:p-10 flex flex-col gap-8">
                  {/* Title & Category & Links */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-white/10">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#38BDF8]">
                        {activeProjectModal.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight leading-none">
                        {activeProjectModal.title}
                      </h2>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <a
                        href={activeProjectModal.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-xs text-white/95 hover:text-white transition-colors flex items-center gap-1.5 font-mono font-bold"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                      <a
                        href={activeProjectModal.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 rounded-xl text-xs text-[#050B14] transition-all duration-300 flex items-center gap-1.5 font-mono font-bold shadow-md shadow-blue-500/15"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    </div>
                  </div>

                  {/* Two Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Column Left (2/3): Description, Features, Challenges */}
                    <div className="md:col-span-2 flex flex-col gap-6 font-sans">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest font-black">Project Overview</h4>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line font-medium">
                          {activeProjectModal.description}
                        </p>
                      </div>

                      {/* Features */}
                      {activeProjectModal.features && activeProjectModal.features.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                          <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest font-black">Key Features Implemented</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {activeProjectModal.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-start gap-2.5 text-xs text-white/70 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Challenges */}
                      {activeProjectModal.challenges && (
                        <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                          <h4 className="text-xs font-mono text-amber-400 uppercase tracking-widest font-black">Challenges Solved</h4>
                          <p className="text-amber-200 text-xs leading-relaxed italic bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl font-medium">
                            "{activeProjectModal.challenges}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Column Right (1/3): Metadata, Technologies */}
                    <div className="md:col-span-1 flex flex-col gap-6">
                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4 text-xs font-sans">
                        <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest pb-2 border-b border-white/10 font-black">
                          Tech Specifications
                        </h4>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {activeProjectModal.technologies.map((tech, tIdx) => (
                            <span key={tIdx} className="px-2 py-1 bg-[#050B14] border border-white/10 text-[10px] text-white font-mono rounded font-bold">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 font-mono text-[10px] text-white/40 font-bold">
                          <div className="flex justify-between">
                            <span>Status</span>
                            <span className="text-emerald-400 font-extrabold">Production</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Licensing</span>
                            <span className="text-white/80">Apache-2.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Integrity</span>
                            <span className="text-[#38BDF8] font-extrabold">Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
