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
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
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
    <div className="relative min-h-screen w-full bg-transparent text-white overflow-x-hidden font-sans">
      {/* Dynamic background grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-20 -z-10" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pt-32 pb-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-24 relative z-10"
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="text-left flex flex-col gap-3 border-b border-white/10 pb-8">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-[0.25em] font-extrabold">
              [ TECHNICAL ARSENAL ]
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            Skills, Services & Advantages
          </h1>
          <p className="text-white/60 text-base max-w-2xl mt-1 leading-relaxed">
            My comprehensive technical stack, visual engineering services, and professional operational values.
          </p>
        </motion.div>

        {/* PRIMARY CIRCULAR SKILL METRICS */}
        <section id="circular-metrics" className="flex flex-col gap-10">
          <motion.div variants={itemVariants} className="text-left">
            <div className="flex items-center space-x-2.5">
              <span className="w-1 h-1 rounded-full bg-[#38BDF8]" />
              <span className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-bold">EMINENT MASTERY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white mt-1">Primary Core Stack</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {topCircularSkills.map((skill, idx) => {
              const radius = 45;
              const strokeWidth = 5;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (skill.level / 100) * circumference;

              return (
                <motion.div
                  key={skill.id || idx}
                  variants={itemVariants}
                  className="p-8 glass-panel rounded-2xl flex flex-col items-center justify-center gap-6 transition-all duration-500 hover:border-white/20 hover:scale-[1.02] group border border-white/5 relative card-shine"
                >
                  <div className="absolute top-3 left-4 text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold">
                    CORE {idx + 1}
                  </div>

                  {/* SVG Circle */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full rotate-[-90deg]">
                      <circle
                        cx="56"
                        cy="56"
                        r={radius}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.03)"
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
                    <span className="absolute font-mono text-xl font-extrabold text-white group-hover:text-[#38BDF8] transition-colors">
                      {skill.level}%
                    </span>
                  </div>

                  <div className="text-center flex flex-col gap-1.5">
                    <span className="font-display font-bold text-white tracking-tight">{skill.name}</span>
                    <span className="text-[9px] font-mono uppercase text-white/40 tracking-widest font-extrabold">
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
              <div className="flex items-center space-x-2.5">
                <span className="w-1 h-1 rounded-full bg-[#38BDF8]" />
                <span className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-bold">STACK INVENTORY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white mt-1">Full Technical Arsenal</h2>
            </div>

            {/* Navigation Category Rail */}
            <div className="flex flex-wrap gap-1.5 bg-white/[0.03] border border-white/10 p-1 rounded-full max-w-full overflow-x-auto backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold font-mono transition-all duration-300 flex items-center space-x-1.5 shrink-0 cursor-pointer border ${
                    activeCategory === cat.value
                      ? 'bg-white/10 border-[#38BDF8]/30 text-white shadow-sm'
                      : 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5'
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
                className="p-6 glass-panel rounded-xl flex flex-col gap-3 transition-all duration-300 hover:border-white/15 border border-white/5 card-shine"
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
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                    Category: {skill.category}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-[#38BDF8]/60">
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
            <div className="flex items-center space-x-2.5">
              <span className="w-1 h-1 rounded-full bg-[#38BDF8]" />
              <span className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-bold">SOLUTIONS PORTFOLIO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white mt-1">Professional Development Services</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {services.map((service, idx) => (
              <motion.div
                key={service.id || idx}
                variants={itemVariants}
                className="p-6 md:p-7 glass-panel hover:border-white/20 rounded-2xl transition-all duration-500 flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(56,189,248,0.06)] hover:scale-[1.01] group border border-white/5 card-shine"
              >
                <div>
                  <span className="font-mono text-[9px] text-white/30 font-bold tracking-widest uppercase block mb-3">
                    Service {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-3 leading-relaxed font-sans font-medium">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex flex-col gap-2.5">
                  <span className="text-[9px] font-mono uppercase text-white/40 tracking-widest block mb-1 font-bold">Scope Features</span>
                  {service.features.map((feat, fIdx) => (
                    <span key={fIdx} className="text-[10px] text-white/70 font-sans flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      <span className="font-medium">{feat}</span>
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
            <div className="flex items-center space-x-2.5">
              <span className="w-1 h-1 rounded-full bg-[#38BDF8]" />
              <span className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-bold">CORE INTEGRITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white mt-1">Professional Advantages</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              const colSpan = idx === 0 ? "md:col-span-3" : idx === 1 ? "md:col-span-2" : idx === 2 ? "md:col-span-2" : idx === 3 ? "md:col-span-3" : "md:col-span-5";

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`p-8 glass-panel rounded-2xl flex flex-col justify-between transition-all duration-500 hover:border-white/20 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(56,189,248,0.06)] border border-white/5 card-shine ${colSpan}`}
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
                    <p className="text-white/60 text-xs mt-3 leading-relaxed max-w-xl font-sans font-medium">
                      {adv.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-white/40 font-bold">
                    <span>Guaranteed Standards</span>
                    <span>100% compliant</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </motion.div>
    </div>
  );
};
