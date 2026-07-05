import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Layers, 
  Database, 
  Terminal, 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  Settings, 
  CheckCircle2, 
  Zap,
  MessagesSquare,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory } from '../types';

export const SkillsServices: React.FC = () => {
  const { skills, services, loading } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');

  const categories: { label: string; value: SkillCategory | 'all'; icon: any }[] = [
    { label: "All Skills", value: 'all', icon: Sparkles },
    { label: "Languages", value: 'languages', icon: Code2 },
    { label: "Frontend", value: 'frontend', icon: Layers },
    { label: "Backend", value: 'backend', icon: Terminal },
    { label: "Databases", value: 'databases', icon: Database },
    { label: "AI", value: 'ai', icon: Cpu },
    { label: "Cloud", value: 'cloud', icon: Cloud },
    { label: "Security", value: 'cybersecurity', icon: ShieldCheck },
    { label: "Tools", value: 'tools', icon: Settings }
  ];

  // Professional Advantages list
  const advantages = [
    {
      title: "High-Quality Clean Code",
      description: "Developing highly readable, testable, modular, and strictly type-safe TypeScript codebases designed for easy collaboration.",
      icon: Code2,
      badge: "Clean Architecture"
    },
    {
      title: "Scalable Architecture",
      description: "Architecting cloud-native distributed backends and serverless engines prepared for concurrent high-throughput scale.",
      icon: Layers,
      badge: "Distributed Systems"
    },
    {
      title: "Professional Communication",
      description: "Maintaining structured development documentation, active sync meetings, and reliable operational summaries.",
      icon: MessagesSquare,
      badge: "High-Velocity Handoff"
    },
    {
      title: "Modern Standards",
      description: "Adhering to strict OWASP security matrices, fluid motion guidelines, responsive screens, and semantic access controls.",
      icon: CheckCircle2,
      badge: "W3C & OWASP Compliant"
    },
    {
      title: "Fast Implementation",
      description: "Leveraging robust boilerplates, automated pipeline scripts, and modern development standards to deploy within strict schedules.",
      icon: Zap,
      badge: "High Velocity"
    }
  ];

  const filteredSkills = skills.filter(
    s => activeCategory === 'all' || s.category === activeCategory
  );

  // Split top skills for circular rendering
  const topCircularSkills = skills.filter(s => s.level >= 94).slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  if (loading && skills.length === 0) {
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
      className="pt-28 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-24 sm:gap-32 relative z-10 text-white"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants} className="text-left flex flex-col gap-3 border-b border-white/10 pb-8">
        <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">CAPABILITIES</span>
        <h1 className="text-4xl font-display font-bold tracking-tight text-white">Skills, Services & Advantages</h1>
        <p className="text-white/70 text-lg max-w-2xl mt-1 leading-relaxed font-sans">
          My comprehensive technical stack, visual engineering services, and professional operational values.
        </p>
      </motion.div>

      {/* PRIMARY CIRCULAR SKILL METRICS */}
      <section id="circular-metrics" className="flex flex-col gap-10">
        <motion.div variants={itemVariants} className="text-left">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">EMINENT MASTERY</span>
          <h2 className="text-2xl font-display font-bold tracking-tight text-white mt-1">Primary Core Stack</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topCircularSkills.map((skill, idx) => {
            const radius = 45;
            const strokeWidth = 5;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (skill.level / 100) * circumference;

            return (
              <motion.div
                key={skill.id || idx}
                variants={itemVariants}
                className="p-8 glass-panel rounded-2xl flex flex-col items-center justify-center gap-6 transition-all duration-500 hover:border-white/25 hover:scale-[1.02] group border border-white/10"
              >
                {/* SVG Circle */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth={strokeWidth}
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      fill="none"
                      stroke="url(#circularGlowGradient)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="circularGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0084FF" />
                        <stop offset="100%" stopColor="#38BDF8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute font-mono text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    {skill.level}%
                  </span>
                </div>

                <div className="text-center flex flex-col gap-1">
                  <span className="font-display font-bold text-white tracking-tight">{skill.name}</span>
                  <span className="text-[10px] font-mono uppercase text-white/50 tracking-wider font-bold">
                    {skill.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SKILLS PROGRESS AREA */}
      <section id="skills-progress" className="flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-6 text-left">
          <div>
            <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">STACK INVENTORY</span>
            <h2 className="text-2xl font-display font-bold tracking-tight text-white mt-1">Full Technical Arsenal</h2>
          </div>

          {/* Navigation Category Rail - Dark glass theme */}
          <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 p-1 rounded-2xl max-w-full overflow-x-auto backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-300 flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  activeCategory === cat.value
                    ? 'bg-white text-[#050B14]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Linear progress cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {filteredSkills.map((skill, idx) => (
            <motion.div
              key={skill.id || idx}
              variants={itemVariants}
              className="p-5 glass-panel rounded-xl flex flex-col gap-3 transition-all duration-300 hover:border-white/20 border border-white/10"
            >
              <div className="flex justify-between items-center text-sm font-sans">
                <span className="font-bold text-white tracking-tight">{skill.name}</span>
                <span className="font-mono text-xs text-[#38BDF8] font-bold">{skill.level}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0084FF] to-[#38BDF8] rounded-full"
                />
              </div>

              <div className="flex justify-between items-center mt-1 text-white/40">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                  Category: {skill.category}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                  {skill.level >= 90 ? "Expert" : skill.level >= 80 ? "Advanced" : "Competent"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES LIST */}
      <section id="services-grid-list" className="flex flex-col gap-12">
        <motion.div variants={itemVariants} className="text-left border-b border-white/10 pb-6">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">SOLUTIONS PORTFOLIO</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mt-1">Professional Development Services</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {services.map((service, idx) => (
            <motion.div
              key={service.id || idx}
              variants={itemVariants}
              className="p-6 glass-panel hover:border-white/25 rounded-2xl transition-all duration-500 flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(0,132,255,0.15)] hover:scale-[1.01] group border border-white/10"
            >
              <div>
                <span className="font-mono text-xs text-white/40 font-bold tracking-widest uppercase block mb-3">
                  Service {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-display font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-white/70 text-xs mt-3 leading-relaxed font-sans">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase text-white/50 tracking-widest block mb-1 font-bold">Scope Features</span>
                {service.features.map((feat, fIdx) => (
                  <span key={fIdx} className="text-[10px] text-white/70 font-sans flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROFESSIONAL ADVANTAGES */}
      <section id="advantages-bento" className="flex flex-col gap-10">
        <motion.div variants={itemVariants} className="text-left border-b border-white/10 pb-6">
          <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">CORE INTEGRITY</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mt-1">Professional Advantages</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            const colSpan = idx === 0 ? "md:col-span-3" : idx === 1 ? "md:col-span-2" : idx === 2 ? "md:col-span-2" : idx === 3 ? "md:col-span-3" : "md:col-span-5";

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`p-8 glass-panel rounded-2xl flex flex-col justify-between transition-all duration-500 hover:border-white/25 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,132,255,0.15)] border border-white/10 ${colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-[#38BDF8] font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest">
                      {adv.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white mt-6">
                    {adv.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-3 leading-relaxed max-w-xl font-sans">
                    {adv.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/45 font-bold">
                  <span>Guaranteed Standards</span>
                  <span>100% compliant</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};
