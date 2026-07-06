import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Award, Compass, Flag, MapPin, Target } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  type: 'education' | 'career';
}

export const About: React.FC = () => {
  const { settings, loading } = usePortfolio();
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'career' | 'education'>('all');

  const timelineEvents: TimelineEvent[] = [
    {
      year: "2022 - PRESENT",
      title: "Principal Full-Stack Architect",
      subtitle: "Enterprise Solutions Lab",
      description: "Managing cloud migration schedules and engineering fast real-time hardware telemetry monitors deployed to scale containerized apps across Kubernetes nodes safely.",
      bullets: [
        "Reduced legacy system computation loads by 30%",
        "Mentored and guided 8 cross-functional team members",
        "Built responsive real-time WebSockets stream panels"
      ],
      type: "career"
    },
    {
      year: "2019 - 2022",
      title: "Senior Developer & Tech Lead",
      subtitle: "Apex Technologies",
      description: "Designed multi-state data graphs and responsive widgets in React using Apollo client-side caching.",
      bullets: [
        "Improved initial load benchmarks by 35%",
        "Designed flexible security models restricting JWT scopes"
      ],
      type: "career"
    },
    {
      year: "2016 - 2019",
      title: "Full Stack Software Engineer",
      subtitle: "Synergy Platforms",
      description: "Validated transaction schemas in Node.js backends and accelerated PostgreSQL query metrics.",
      bullets: [
        "Optimized indexes reducing lookup latencies by 40%"
      ],
      type: "career"
    },
    {
      year: "2014 - 2016",
      title: "Master of Science in Computer Science",
      subtitle: "Stanford University",
      description: "Distributed architectures, API design security, and Intelligent Node interactions.",
      bullets: [
        "Published thesis on intelligent data packet routing algorithms",
        "GPA: 3.92/4.0"
      ],
      type: "education"
    },
    {
      year: "2010 - 2014",
      title: "Bachelor of Science in Software Engineering",
      subtitle: "University of California, Berkeley",
      description: "Excelled in Software Methodologies, Relational Algebra systems, and low-level computer structures.",
      bullets: [
        "Graduated with Honors",
        "Member of Computer Science Undergraduate Association"
      ],
      type: "education"
    }
  ];

  const filteredEvents = timelineEvents.filter(
    e => timelineFilter === 'all' || e.type === timelineFilter
  );

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

  if (loading && !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B14]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0084FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  const bio = settings?.bio || "With over 8 years of professional experience, I partner with companies to deploy fast applications...";
  const location = settings?.location || "San Francisco, CA";
  const country = settings?.country || "United States";
  const careerGoals = settings?.careerGoals || "My goal is to construct high-performance distributed systems...";

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white overflow-x-hidden font-sans">
      {/* Delicate background grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-20 -z-10" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pt-32 pb-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-24 relative z-10"
      >
        {/* HEADER SECTION */}
        <motion.div variants={itemVariants} className="text-left flex flex-col gap-3 border-b border-white/10 pb-8">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-[0.25em] font-extrabold">
              [ PROFILE BIOGRAPHY ]
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            About Me
          </h1>
          <p className="text-white/60 text-base max-w-2xl mt-1 leading-relaxed">
            Discover my background, education history, and professional development path as an IT specialist.
          </p>
        </motion.div>

        {/* TWO-COLUMN PROFILE & BIO CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Who I Am & Fast Stats */}
          <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-6">
            <div className="p-8 glass-panel rounded-2xl flex flex-col gap-6 border border-white/5 hover:border-white/15 transition-all duration-300 relative overflow-hidden card-shine">
              <h3 className="text-lg font-display font-bold text-white">Quick Identity</h3>
              
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex items-center space-x-3.5 text-white/80">
                  <Compass className="w-5 h-5 text-[#38BDF8] shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider font-bold">Title</p>
                    <p className="text-white font-semibold mt-0.5">{settings?.title || "Principal Architect"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 text-white/80 border-t border-white/5 pt-3.5">
                  <Flag className="w-5 h-5 text-[#38BDF8] shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider font-bold">Country</p>
                    <p className="text-white font-semibold mt-0.5">{country}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 text-white/80 border-t border-white/5 pt-3.5">
                  <MapPin className="w-5 h-5 text-[#38BDF8] shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider font-bold">Location</p>
                    <p className="text-white font-semibold mt-0.5">{location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 text-white/80 border-t border-white/5 pt-3.5">
                  <Target className="w-5 h-5 text-[#38BDF8] shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider font-bold">Specialties</p>
                    <p className="text-white font-semibold mt-0.5">Node, Cloud, React, Postgres</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 glass-panel rounded-2xl flex flex-col gap-4 border border-white/5 hover:border-white/15 transition-all duration-300">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2.5">
                <Award className="w-5 h-5 text-[#38BDF8]" />
                <span>Certifications</span>
              </h3>
              <ul className="text-left text-sm text-white/70 space-y-3 mt-1 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0 mt-2" />
                  <span>Google Professional Cloud Architect</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0 mt-2" />
                  <span>AWS Solutions Architect (Professional)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0 mt-2" />
                  <span>Certified Kubernetes Administrator (CKA)</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Column: Bio & Long Goals */}
          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-6 text-left">
            <div className="p-8 md:p-10 glass-panel rounded-2xl flex flex-col gap-6 border border-white/5 hover:border-white/15 transition-all duration-300 card-shine">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Who I Am & Biography</h2>
              <p className="text-white/70 text-base leading-relaxed whitespace-pre-line font-normal">
                {bio}
              </p>
            </div>

            <div className="p-8 md:p-10 glass-panel rounded-2xl flex flex-col gap-4 text-left border border-white/5 hover:border-white/15 transition-all duration-300">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2.5">
                <Target className="w-5 h-5 text-[#38BDF8]" />
                <span>Career Goals & Professional Core</span>
              </h3>
              <p className="text-white/80 text-sm leading-relaxed italic bg-white/[0.02] p-5 rounded-xl border border-white/5 font-medium">
                "{careerGoals}"
              </p>
            </div>
          </motion.div>

        </div>

        {/* INTERACTIVE TIMELINE SECTION */}
        <section id="timeline-section" className="flex flex-col gap-12 relative">
          <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#38BDF8]/5 blur-[100px] pointer-events-none -z-10" />

          <motion.div variants={itemVariants} className="text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-[0.25em] font-extrabold">
                  [ CHRONOLOGY ]
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white mt-1">Timeline Progression</h2>
            </div>

            {/* Interactive Filters */}
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-full text-xs font-mono backdrop-blur-md">
              {(['all', 'career', 'education'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimelineFilter(filter)}
                  className={`px-4 py-2 rounded-full font-bold transition-all duration-300 uppercase cursor-pointer border ${
                    timelineFilter === filter
                      ? 'bg-white/10 border-[#38BDF8]/30 text-white shadow-md'
                      : 'bg-transparent border-transparent text-white/60 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Timeline Line Graphic with white/10 */}
          <div className="relative border-l border-white/10 ml-4 md:ml-40 flex flex-col gap-10 py-4 text-left">
            
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Bullet Node */}
                <div className="absolute -left-3 top-1 w-[22px] h-[22px] rounded-full bg-[#050B14] border-2 border-white/15 group-hover:border-[#38BDF8] flex items-center justify-center transition-colors duration-300 shadow-sm z-10">
                  {event.type === 'career' ? (
                    <Briefcase className="w-2.5 h-2.5 text-[#38BDF8]" />
                  ) : (
                    <GraduationCap className="w-3 h-3 text-[#38BDF8]" />
                  )}
                </div>

                {/* Float Year Indicator Left on Desktop */}
                <div className="hidden md:block absolute -left-40 top-1.5 w-32 text-right font-mono text-[11px] font-bold text-white/30 uppercase tracking-widest group-hover:text-[#38BDF8] transition-colors duration-300">
                  {event.year}
                </div>

                {/* Event Card */}
                <div className="p-6 md:p-8 glass-panel rounded-2xl group-hover:border-white/15 hover:shadow-[0_8px_30px_rgba(56,189,248,0.05)] transition-all duration-300 border border-white/5 card-shine">
                  <span className="block md:hidden font-mono text-[10px] text-[#38BDF8] font-bold uppercase tracking-wider mb-2">
                    {event.year}
                  </span>

                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <div>
                      <h3 className="text-lg font-display font-bold text-white tracking-tight">{event.title}</h3>
                      <p className="font-mono text-[11px] text-[#38BDF8] mt-1 font-semibold">{event.subtitle}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase mt-1 sm:mt-0 ${
                      event.type === 'career'
                        ? 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {event.type}
                    </span>
                  </div>

                  <p className="text-white/60 text-sm mt-4 leading-relaxed font-sans">{event.description}</p>
                  
                  {event.bullets && event.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 mt-4 text-xs text-white/40 space-y-1.5 font-sans font-medium">
                      {event.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="hover:text-white/60 transition-colors">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
};
