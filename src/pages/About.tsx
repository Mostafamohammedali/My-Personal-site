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
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pt-28 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-16 sm:gap-24 relative z-10 text-white"
    >
      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="text-left flex flex-col gap-3 border-b border-white/10 pb-8">
        <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">BIOGRAPHY</span>
        <h1 className="text-4xl font-display font-bold tracking-tight text-white">About Me</h1>
        <p className="text-white/70 text-lg max-w-2xl leading-relaxed mt-2 font-sans">
          Discover my background, education history, and professional development path.
        </p>
      </motion.div>

      {/* TWO-COLUMN PROFILE & BIO CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Who I Am & Fast Stats */}
        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-6">
          <div className="p-8 glass-panel rounded-2xl flex flex-col gap-6 border border-white/10">
            <h3 className="text-lg font-display font-bold text-white">Quick Identity</h3>
            
            <div className="flex flex-col gap-4 font-sans text-sm">
              <div className="flex items-center space-x-3 text-white/80">
                <Compass className="w-5 h-5 text-[#38BDF8] shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase text-white/50 tracking-wider font-bold">Title</p>
                  <p className="text-white font-semibold">{settings?.title || "Principal Architect"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-white/80 border-t border-white/10 pt-3.5">
                <Flag className="w-5 h-5 text-[#38BDF8] shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase text-white/50 tracking-wider font-bold">Country</p>
                  <p className="text-white font-semibold">{country}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-white/80 border-t border-white/10 pt-3.5">
                <MapPin className="w-5 h-5 text-[#38BDF8] shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase text-white/50 tracking-wider font-bold">Location</p>
                  <p className="text-white font-semibold">{location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-white/80 border-t border-white/10 pt-3.5">
                <Target className="w-5 h-5 text-[#38BDF8] shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase text-white/50 tracking-wider font-bold">Specialties</p>
                  <p className="text-white font-semibold">Node, Cloud, React, Postgres</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 glass-panel rounded-2xl flex flex-col gap-4 border border-white/10">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#38BDF8]" />
              <span>Certifications</span>
            </h3>
            <ul className="text-left text-sm text-white/80 font-sans space-y-3">
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
          <div className="p-8 md:p-10 glass-panel rounded-2xl flex flex-col gap-6 border border-white/10">
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">Who I Am & Biography</h2>
            <p className="text-white/80 text-base leading-relaxed whitespace-pre-line font-sans">
              {bio}
            </p>
          </div>

          <div className="p-8 md:p-10 glass-panel rounded-2xl flex flex-col gap-4 text-left border border-white/10">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#38BDF8]" />
              <span>Career Goals & Professional Core</span>
            </h3>
            <p className="text-white/80 text-sm leading-relaxed italic font-sans bg-white/5 p-4 rounded-xl border border-white/10">
              "{careerGoals}"
            </p>
          </div>
        </motion.div>

      </div>

      {/* INTERACTIVE TIMELINE SECTION */}
      <section id="timeline-section" className="flex flex-col gap-10">
        <motion.div variants={itemVariants} className="text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">CHRONOLOGY</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mt-1">Timeline Progression</h2>
          </div>

          {/* Interactive Filters */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-full text-xs font-mono backdrop-blur-md">
            {(['all', 'career', 'education'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimelineFilter(filter)}
                className={`px-4 py-2 rounded-full font-bold transition-all duration-300 uppercase cursor-pointer ${
                  timelineFilter === filter
                    ? 'bg-white text-[#050B14] shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline Line Graphic with white/10 */}
        <div className="relative border-l-2 border-white/10 ml-4 md:ml-40 flex flex-col gap-10 py-4 text-left">
          
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Bullet Node */}
              <div className="absolute -left-3.5 top-1 w-6 h-6 rounded-full bg-[#050B14] border-2 border-white/10 group-hover:border-[#38BDF8] flex items-center justify-center transition-colors duration-300 shadow-sm">
                {event.type === 'career' ? (
                  <Briefcase className="w-3 h-3 text-[#38BDF8]" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-[#38BDF8]" />
                )}
              </div>

              {/* Float Year Indicator Left on Desktop */}
              <div className="hidden md:block absolute -left-40 top-1.5 w-32 text-right font-mono text-xs font-bold text-white/40 uppercase tracking-widest">
                {event.year}
              </div>

              {/* Event Card */}
              <div className="p-6 md:p-8 glass-panel rounded-2xl group-hover:border-white/25 hover:shadow-[0_8px_30px_rgba(0,132,255,0.12)] transition-all duration-300 border border-white/10">
                <span className="block md:hidden font-mono text-[10px] text-[#38BDF8] font-bold uppercase tracking-wider mb-2">
                  {event.year}
                </span>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white tracking-tight">{event.title}</h3>
                    <p className="font-mono text-xs text-white/50 mt-1 font-semibold">{event.subtitle}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase mt-1 sm:mt-0 ${
                    event.type === 'career'
                      ? 'bg-white/5 text-[#38BDF8] border border-white/10'
                      : 'bg-white/5 text-emerald-400 border border-white/10'
                  }`}>
                    {event.type}
                  </span>
                </div>

                <p className="text-white/70 text-sm mt-4 leading-relaxed font-sans">{event.description}</p>
                
                {event.bullets && event.bullets.length > 0 && (
                  <ul className="list-disc list-outside pl-4 mt-4 text-xs text-white/50 space-y-1.5 font-sans">
                    {event.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
