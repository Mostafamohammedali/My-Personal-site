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
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const locationCoords = { lat: "37.7749° N", lng: "122.4194° W" }; // San Francisco

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white overflow-x-hidden font-sans">
      {/* Dynamic background grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-20 -z-10" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pt-32 pb-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16 relative z-10"
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="text-left flex flex-col gap-3 border-b border-white/10 pb-8">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-[0.25em] font-extrabold">
              [ DIRECT CHANNELS & OPERATIONS ]
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            Let's Connect
          </h1>
          <p className="text-white/60 text-base max-w-2xl mt-1 leading-relaxed">
            Inquire about consulting, contracting, architectural reviews, or full-time staffing.
          </p>
        </motion.div>

        {/* TWO-COLUMN CONTACT PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
          
          {/* Left Column: Form with React Hook Form validation */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <div className="p-8 glass-panel rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-300 relative overflow-hidden card-shine">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-6">Send A Message</h2>
              
              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3.5"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-sm font-sans text-emerald-100">
                    <span className="font-bold">Message sent successfully!</span>
                    <p className="mt-1 text-white/50 leading-relaxed text-xs">Thank you for your message. I will review it and reply as soon as possible.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  
                  {/* Full name */}
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="font-mono text-white/40 uppercase tracking-widest font-extrabold">Full Name *</label>
                    <input
                      type="text"
                      {...register("fullName", { required: "Full name is required" })}
                      className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-xs font-bold"
                      placeholder="Enter your name"
                    />
                    {errors.fullName && (
                      <span className="text-[9px] font-mono text-red-400 mt-1">{errors.fullName.message}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="font-mono text-white/40 uppercase tracking-widest font-extrabold">Email Address *</label>
                    <input
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-xs font-bold"
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <span className="text-[9px] font-mono text-red-400 mt-1">{errors.email.message}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="font-mono text-white/40 uppercase tracking-widest font-extrabold">Phone Number</label>
                    <input
                      type="text"
                      {...register("phone")}
                      className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-xs font-bold"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="font-mono text-white/40 uppercase tracking-widest font-extrabold">Subject *</label>
                    <input
                      type="text"
                      {...register("subject", { required: "Subject is required" })}
                      className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-xs font-bold"
                      placeholder="Enter subject"
                    />
                    {errors.subject && (
                      <span className="text-[9px] font-mono text-red-400 mt-1">{errors.subject.message}</span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="font-mono text-white/40 uppercase tracking-widest font-extrabold">Message *</label>
                    <textarea
                      rows={5}
                      {...register("message", { required: "Message is required" })}
                      className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/20 transition-all duration-300 text-xs resize-none font-bold"
                      placeholder="Describe your inquiry..."
                    />
                    {errors.message && (
                      <span className="text-[9px] font-mono text-red-400 mt-1">{errors.message.message}</span>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="w-full py-4 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-55 shadow-md shadow-blue-500/10 hover:scale-[1.01] cursor-pointer mt-2"
                  >
                    {isSubmittingForm ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
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
            <div className="p-8 glass-panel rounded-2xl flex flex-col gap-6 border border-white/5 hover:border-white/15 transition-all duration-300 relative card-shine">
              <h3 className="text-xl font-display font-bold text-white tracking-tight">Direct Channels</h3>
              
              <div className="flex flex-col gap-4 font-sans text-sm">
                
                {/* Phone */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-white/40 tracking-widest font-extrabold">Voice channel</p>
                    <p className="text-white font-bold mt-0.5">{settings?.phone || "+1 (415) 555-0198"}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5 border-t border-white/5 pt-4">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-white/40 tracking-widest font-extrabold">Electronic Mail</p>
                    <p className="text-white font-bold mt-0.5">{settings?.email || "alexander.wright@tech-architect.dev"}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-3.5 border-t border-white/5 pt-4">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-white/40 tracking-widest font-extrabold">HQ Operations</p>
                    <p className="text-white font-bold mt-0.5">{settings?.location || "San Francisco, CA"}</p>
                  </div>
                </div>

              </div>

              {/* Social channels */}
              <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase text-white/40 tracking-widest font-extrabold">Public networks</span>
                <div className="flex space-x-2.5 text-white/60">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-[#38BDF8] hover:border-[#38BDF8]/50 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-[#38BDF8] hover:border-[#38BDF8]/50 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-[#38BDF8] hover:border-[#38BDF8]/50 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
