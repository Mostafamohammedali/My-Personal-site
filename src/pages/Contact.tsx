import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  Send, 
  Loader2, 
  CheckCircle,
  Network
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ContactFormInputs {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const Contact: React.FC = () => {
  const { settings, submitContactMessage } = usePortfolio();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormInputs>();

  const onSubmit = async (data: ContactFormInputs) => {
    setIsSubmittingForm(true);
    try {
      await submitContactMessage({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message
      });
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Form error:", err);
    } finally {
      setIsSubmittingForm(false);
    }
  };

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

  const locationCoords = { lat: "37.7749° N", lng: "122.4194° W" }; // San Francisco

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pt-28 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16 relative z-10 text-white"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants} className="text-left flex flex-col gap-3 border-b border-white/10 pb-8">
        <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-[0.2em] font-extrabold">INQUIRIES</span>
        <h1 className="text-4xl font-display font-bold tracking-tight text-white">Let's Connect</h1>
        <p className="text-white/70 text-lg max-w-2xl mt-1 leading-relaxed font-sans">
          Inquire about consulting, contracting, architectural reviews, or full-time staffing.
        </p>
      </motion.div>

      {/* TWO-COLUMN CONTACT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
        
        {/* Left Column: Form with React Hook Form validation */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="p-8 glass-panel rounded-2xl border border-white/10">
            <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-6">Send A Message</h2>
            
            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm font-sans text-emerald-100">
                  <span className="font-bold">Message sent successfully!</span>
                  <p className="mt-1 text-white/70">Thank you for your message. I will review it and reply as soon as possible.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Full name */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-mono text-white/50 uppercase tracking-wider font-bold">Full Name *</label>
                  <input
                    type="text"
                    {...register("fullName", { required: "Full name is required" })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-sm font-semibold"
                    placeholder="Enter your name"
                  />
                  {errors.fullName && (
                    <span className="text-[10px] font-mono text-red-400 mt-1">{errors.fullName.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-mono text-white/50 uppercase tracking-wider font-bold">Email Address *</label>
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-sm font-semibold"
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <span className="text-[10px] font-mono text-red-400 mt-1">{errors.email.message}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-mono text-white/50 uppercase tracking-wider font-bold">Phone Number</label>
                  <input
                    type="text"
                    {...register("phone")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-sm font-semibold"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-mono text-white/50 uppercase tracking-wider font-bold">Subject *</label>
                  <input
                    type="text"
                    {...register("subject", { required: "Subject is required" })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-sm font-semibold"
                    placeholder="Enter subject"
                  />
                  {errors.subject && (
                    <span className="text-[10px] font-mono text-red-400 mt-1">{errors.subject.message}</span>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-mono text-white/50 uppercase tracking-wider font-bold">Message *</label>
                  <textarea
                    rows={5}
                    {...register("message", { required: "Message is required" })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-sm resize-none font-semibold"
                    placeholder="Describe your inquiry..."
                  />
                  {errors.message && (
                    <span className="text-[10px] font-mono text-red-400 mt-1">{errors.message.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="w-full py-3.5 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-55 shadow-md shadow-blue-500/15 hover:scale-[1.01] cursor-pointer"
                >
                  {isSubmittingForm ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </div>
        </motion.div>

        {/* Right Column: Contact info & Stylish Vector Map Coordinates */}
        <motion.div variants={itemVariants} className="flex flex-col gap-8">
          
          {/* Card: Contact particulars */}
          <div className="p-8 glass-panel rounded-2xl flex flex-col gap-6 border border-white/10">
            <h3 className="text-xl font-display font-bold text-white tracking-tight">Direct Channels</h3>
            
            <div className="flex flex-col gap-4 font-sans text-sm">
              
              {/* Phone */}
              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider font-bold">Voice channel</p>
                  <p className="text-white font-bold mt-0.5">{settings?.phone || "+1 (415) 555-0198"}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3.5 border-t border-white/10 pt-4">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider font-bold">Electronic Mail</p>
                  <p className="text-white font-bold mt-0.5">{settings?.email || "alexander.wright@tech-architect.dev"}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3.5 border-t border-white/10 pt-4">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider font-bold">HQ Operations</p>
                  <p className="text-white font-bold mt-0.5">{settings?.location || "San Francisco, CA"}</p>
                </div>
              </div>

            </div>

            {/* Social channels */}
            <div className="border-t border-white/10 pt-6 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-white/40 tracking-widest font-bold">Public networks</span>
              <div className="flex space-x-3 text-white/60">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-[#38BDF8] hover:border-white/20 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-[#38BDF8] hover:border-white/20 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-[#38BDF8] hover:border-white/20 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map/Coordinate Display */}
          <div className="p-8 glass-panel rounded-2xl flex flex-col gap-4 text-left border border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-white tracking-tight flex items-center gap-2">
                <Network className="w-5 h-5 text-[#38BDF8]" />
                <span>Operational Vector Map</span>
              </h3>
              <div className="text-[9px] font-mono text-[#38BDF8] bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest font-bold animate-pulse">
                Active Node
              </div>
            </div>

            {/* SVG Visual Map representing San Francisco Node */}
            <div className="h-56 bg-[#030912] rounded-xl border border-white/10 overflow-hidden relative flex items-center justify-center p-4 shadow-inner">
              <svg viewBox="0 0 400 200" className="w-full h-full text-white/5">
                {/* Lat/Lng lines */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <line x1="200" y1="0" x2="200" y2="200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                
                {/* Background world network nodes layout */}
                <circle cx="100" cy="80" r="2.5" fill="rgba(255,255,255,0.1)" />
                <circle cx="150" cy="140" r="2" fill="rgba(255,255,255,0.07)" />
                <circle cx="280" cy="70" r="3" fill="rgba(255,255,255,0.12)" />
                <circle cx="340" cy="110" r="2" fill="rgba(255,255,255,0.07)" />
                <circle cx="70" cy="120" r="2.5" fill="rgba(255,255,255,0.1)" />

                {/* Grid Rings */}
                <circle cx="200" cy="100" r="75" fill="none" stroke="rgba(56,189,248, 0.05)" strokeWidth="1" />
                <circle cx="200" cy="100" r="45" fill="none" stroke="rgba(56,189,248, 0.08)" strokeWidth="1" />

                {/* Connections to Active Node */}
                <path d="M70 120 Q 135 110 200 100" stroke="rgba(56,189,248, 0.15)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                <path d="M100 80 Q 150 90 200 100" stroke="rgba(56,189,248, 0.15)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                <path d="M280 70 Q 240 85 200 100" stroke="rgba(56,189,248, 0.15)" strokeWidth="1" strokeDasharray="3 3" fill="none" />

                {/* Primary Anchor Node (San Francisco / HQ) */}
                <circle cx="200" cy="100" r="5" fill="#38BDF8" className="animate-pulse" />
                <circle cx="200" cy="100" r="15" fill="none" stroke="#38BDF8" strokeWidth="1" className="animate-ping" style={{ animationDuration: '3s' }} />
              </svg>

              {/* Coordinates overlay box */}
              <div className="absolute bottom-4 left-4 p-3 bg-[#050B14]/90 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-mono text-white/60 flex flex-col gap-1 shadow-sm">
                <span className="text-white font-bold">COORDS: STATION_SF</span>
                <span>LAT: {locationCoords.lat}</span>
                <span>LNG: {locationCoords.lng}</span>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </motion.div>
  );
};
