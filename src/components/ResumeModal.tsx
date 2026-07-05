import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, Mail, Phone, MapPin, Globe, ExternalLink, Award } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ResumeModal: React.FC = () => {
  const { settings, resumeModalOpen, closeResumeModal, skills } = usePortfolio();
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!resumeModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMock = () => {
    // Generate a beautiful plain text representation or trigger print save
    const name = settings?.name || "Mustafa Mohammed";
    const title = settings?.title || "Information Technology Specialist & Developer";
    const email = settings?.email || "moqobaty323@gmail.com";
    const phone = settings?.phone || "+967 772-459-066";
    const location = settings?.location || "Yemen, Sana'a, Al-Zubairi Street";
    
    const resumeText = `
=========================================
${name.toUpperCase()} - RESUME
${title.toUpperCase()}
=========================================

CONTACT INFORMATION:
--------------------
Email: ${email}
Phone: ${phone}
Location: ${location}
GitHub: https://github.com
LinkedIn: https://linkedin.com/in/mustafa-mohammed-78871433b

CAREER PROFILE:
---------------
${settings?.bio || "Information Technology specialist with hands-on experience in developing software applications and websites, designing databases, and solving complex problems through clean and efficient code."}

CAREER GOALS:
-------------
${settings?.careerGoals || "Eager to leverage my technical expertise, contribute to innovative IT projects, and build a successful career in the technology industry."}

EXPERIENCE:
-----------
* Software Developer & IT Specialist | Independent & Academic Projects (2025 - Present)
  - Developed "CarHistory", a comprehensive Django/React vehicle specification and history platform with VIN-based tracking.
  - Engineered "AI Image Analyzer", a Flask-based image analysis system using OpenCV computer vision algorithms.
  - Formulated normalized database schemas, optimized SQL queries, and integrated external Rest APIs.
  - Designed and configured robust Linux development environments, ensuring security best-practices.

EDUCATION:
----------
* Bachelor's Degree in Information Technology
  - University of Modern Sciences, Sana'a, Yemen (2022 - 2026)
  - Coursework: Software Development, Database Systems, Web Development, Computer Networks, Information Security, Data Structures.

LANGUAGES:
----------
- Arabic: Native Proficiency
- English: Basic Proficiency
=========================================
    `;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const name = settings?.name || "Mustafa Mohammed";
  const title = settings?.title || "Information Technology Specialist & Developer";

  return (
    <AnimatePresence>
      <div id="resume-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        
        {/* Print Styles injection */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-resume, #printable-resume * {
              visibility: visible;
            }
            #printable-resume {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              color: #000 !important;
              background: #fff !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />

        {/* Modal Window */}
        <motion.div
          id="resume-modal-window"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[90vh] overflow-hidden no-print"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#1A1A1A]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-mono text-gray-400 ml-2 tracking-wider uppercase">Interactive Document</span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-1 text-xs font-mono"
                title="Print Resume"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownloadMock}
                className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-1 text-xs font-mono"
                title="Download Resume as TXT File"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>

              {/* Close Button */}
              <button
                onClick={closeResumeModal}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Resume Body View (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0F0F0F]">
            
            {/* The Actual Resume Sheet */}
            <div
              ref={printAreaRef}
              id="printable-resume"
              className="w-full max-w-3xl mx-auto bg-white text-gray-900 p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-8 text-left"
            >
              
              {/* Resume Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-gray-900 pb-6 gap-4">
                <div className="flex flex-col">
                  <h1 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 tracking-tight">{name}</h1>
                  <p className="text-sm font-mono tracking-widest text-blue-600 uppercase mt-1 font-bold">{title}</p>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-gray-600 font-mono">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {settings?.email || "alexander.wright@tech-architect.dev"}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {settings?.phone || "+1 (415) 555-0198"}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {settings?.location || "San Francisco, CA"}</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-400" /> tech-architect.dev</span>
                </div>
              </div>

              {/* Resume Professional Summary */}
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-sans font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 tracking-wider">Professional Profile</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {settings?.bio || "Results-driven Senior Full Stack Engineer & Cloud Architect with 8+ years of success leading modular application deployments and building resilient distributed systems. Accomplished in leveraging modern technologies to minimize operating overhead, enhance load performance, and optimize development velocities."}
                </p>
              </div>

              {/* Experience and Education Two-column / Stack layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left side: Skills & Education */}
                <div className="md:col-span-1 flex flex-col gap-6">
                  
                  {/* Education Section */}
                  <div className="flex flex-col gap-3">
                    <h2 className="text-base font-sans font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 tracking-wider">Education</h2>
                    <div className="flex flex-col gap-3.5">
                      <div className="text-xs">
                        <span className="font-bold text-gray-800">B.S. in Information Technology</span>
                        <p className="text-gray-600">University of Modern Sciences</p>
                        <p className="text-gray-500">Sana'a, Yemen</p>
                        <p className="text-[10px] text-blue-600 font-semibold uppercase mt-0.5">2022 - 2026</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="flex flex-col gap-3">
                    <h2 className="text-base font-sans font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 tracking-wider">Core Mastery</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {skills && skills.length > 0 ? (
                        skills.slice(0, 15).map(skill => (
                          <span key={skill.id} className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-mono rounded font-medium">
                            {skill.name}
                          </span>
                        ))
                      ) : (
                        ["Python", "JavaScript", "SQL", "Django", "React", "Flask", "PostgreSQL", "Git"].map(tech => (
                          <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-mono rounded font-medium">
                            {tech}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-col gap-3">
                    <h2 className="text-base font-sans font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 tracking-wider">Languages</h2>
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex items-start gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>Arabic (Native Proficiency)</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>English (Basic Proficiency)</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right side: Experience Timeline */}
                <div className="md:col-span-2 flex flex-col gap-6">
                  <h2 className="text-base font-sans font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 tracking-wider">Experience</h2>
                  
                  <div className="flex flex-col gap-5">
                    
                    {/* Job 1 */}
                    <div className="flex flex-col text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-gray-800">Software Developer & IT Specialist</span>
                        <span className="font-mono text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">2025 - PRESENT</span>
                      </div>
                      <span className="text-gray-500 font-medium">Independent & Academic Projects | Sana'a, Yemen</span>
                      <ul className="list-disc list-outside pl-4 mt-2 text-gray-600 space-y-1">
                        <li>Developed "CarHistory" platform tracking VIN history with Django REST Framework, React.js, and PostgreSQL.</li>
                        <li>Built "AI Image Analyzer" utilizing computer vision models (OpenCV) inside a Flask backend.</li>
                        <li>Designed normalized database structures in PostgreSQL, MySQL, and SQLite, optimizing complex query execution.</li>
                        <li>Configured secure local development servers, implementing foundational OWASP security standards.</li>
                      </ul>
                    </div>

                    {/* Academic Coursework */}
                    <div className="flex flex-col text-xs border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-gray-800">Core Academic Coursework Highlights</span>
                        <span className="font-mono text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">2022 - 2026</span>
                      </div>
                      <span className="text-gray-500 font-medium">University of Modern Sciences | Sana'a, Yemen</span>
                      <ul className="list-disc list-outside pl-4 mt-2 text-gray-600 space-y-1">
                        <li><strong>Software Development & Web Design:</strong> Mastered languages (Python, C#, JavaScript, Java, SQL) and modern web architectures.</li>
                        <li><strong>Database Systems & Security:</strong> Designed relational data models and studied access controls and storage optimization.</li>
                        <li><strong>Computer Networks & InfoSec:</strong> Explored secure networking configurations, encryption keys, and cybersecurity paradigms.</li>
                      </ul>
                    </div>

                  </div>
                </div>

              </div>

              {/* Career Goals Block */}
              <div className="flex flex-col gap-2 border-t border-gray-200 pt-5 text-xs text-gray-600">
                <span className="font-bold text-gray-800 uppercase tracking-wide">Professional Focus</span>
                <p className="italic leading-relaxed">{settings?.careerGoals}</p>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
