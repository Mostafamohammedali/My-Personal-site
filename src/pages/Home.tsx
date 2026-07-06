import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight,
  Code2, 
  Layers, 
  Database, 
  Terminal, 
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

// Elegant Counter Component with standard easing for high-end feel
const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const duration = 1.6; // elegant 1.6 second progress
    const totalFrames = 60 * duration;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Beautiful ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeProgress * end);
      
      setCount(currentCount);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
};

export const Home: React.FC = () => {
  const { settings, projects, services, loading } = usePortfolio();
  const [showDemo, setShowDemo] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number>(0);
  const isTransitioning = useRef<boolean>(false);

  // 3D Carousel states and configuration
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [screenSize, setScreenSize] = useState({
    radius: 320,
    depth: 100,
    cardWidth: 340,
    cardHeight: 330,
  });

  // Projects 3D Carousel states and configuration
  const [projectCarouselIndex, setProjectCarouselIndex] = useState(0);
  const [isProjectCarouselHovered, setIsProjectCarouselHovered] = useState(false);
  const projectCarouselSwipeStart = useRef<number | null>(null);
  const [projectScreenSize, setProjectScreenSize] = useState({
    radius: 320,
    depth: 100,
    cardWidth: 350,
    cardHeight: 380,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      
      // Services sizing
      if (w < 640) {
        setScreenSize({ radius: 105, depth: 40, cardWidth: 240, cardHeight: 290 });
      } else if (w < 1024) {
        setScreenSize({ radius: 210, depth: 75, cardWidth: 290, cardHeight: 310 });
      } else {
        setScreenSize({ radius: 320, depth: 100, cardWidth: 340, cardHeight: 330 });
      }

      // Projects sizing
      if (w < 640) {
        setProjectScreenSize({ radius: 105, depth: 40, cardWidth: 250, cardHeight: 345 });
      } else if (w < 1024) {
        setProjectScreenSize({ radius: 210, depth: 75, cardWidth: 300, cardHeight: 365 });
      } else {
        setProjectScreenSize({ radius: 320, depth: 100, cardWidth: 350, cardHeight: 385 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = ['hero', 'services', 'projects', 'tech'];

  // Limit featured services and projects
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  if (featuredProjects.length === 0 && projects.length > 0) {
    featuredProjects.push(...projects.slice(0, 3));
  }
  const featuredServices = services.slice(0, 4);

  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const carouselSwipeStart = useRef<number | null>(null);

  // Auto-rotate the 3D carousel unless hovered
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredServices.length);
    }, 4500); // smooth slow rotation every 4.5 seconds
    return () => clearInterval(interval);
  }, [isCarouselHovered, featuredServices.length]);

  // Auto-rotate the Projects 3D carousel unless hovered
  useEffect(() => {
    if (isProjectCarouselHovered) return;
    const interval = setInterval(() => {
      setProjectCarouselIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 4500); // smooth slow rotation every 4.5 seconds
    return () => clearInterval(interval);
  }, [isProjectCarouselHovered, featuredProjects.length]);

  // Keyboard, Wheel, and swipe slide transitions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning.current) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 40) return; // ignore minor trackpad drift

      if (delta > 0) {
        if (activeSection < sections.length - 1) {
          setScrollDirection('down');
          setActiveSection((prev) => prev + 1);
          isTransitioning.current = true;
          setTimeout(() => { isTransitioning.current = false; }, 500); // Fast 500ms transition time
        }
      } else {
        if (activeSection > 0) {
          setScrollDirection('up');
          setActiveSection((prev) => prev - 1);
          isTransitioning.current = true;
          setTimeout(() => { isTransitioning.current = false; }, 500);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning.current) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (activeSection < sections.length - 1) {
          setScrollDirection('down');
          setActiveSection((prev) => prev + 1);
          isTransitioning.current = true;
          setTimeout(() => { isTransitioning.current = false; }, 500);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (activeSection > 0) {
          setScrollDirection('up');
          setActiveSection((prev) => prev - 1);
          isTransitioning.current = true;
          setTimeout(() => { isTransitioning.current = false; }, 500);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection, sections.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isTransitioning.current) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      if (activeSection < sections.length - 1) {
        setScrollDirection('down');
        setActiveSection((prev) => prev + 1);
        isTransitioning.current = true;
        setTimeout(() => { isTransitioning.current = false; }, 500);
      }
    } else {
      if (activeSection > 0) {
        setScrollDirection('up');
        setActiveSection((prev) => prev - 1);
        isTransitioning.current = true;
        setTimeout(() => { isTransitioning.current = false; }, 500);
      }
    }
  };

  const handleDotClick = (index: number) => {
    if (index === activeSection || isTransitioning.current) return;
    setScrollDirection(index > activeSection ? 'down' : 'up');
    setActiveSection(index);
    isTransitioning.current = true;
    setTimeout(() => { isTransitioning.current = false; }, 500);
  };

  // 3D Perspective Spring Motion Animation Variants for main slides
  const motionSetting = {
    type: "spring",
    stiffness: 140,
    damping: 18,
    mass: 0.8,
  };

  const popVariants = {
    initial: (direction: 'down' | 'up') => ({
      opacity: 0,
      scale: direction === 'down' ? 0.65 : 1.35,
      rotateX: direction === 'down' ? 24 : -24,
      y: direction === 'down' ? 120 : -120,
      filter: "blur(14px)",
    }),
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      filter: "blur(0px)",
      transition: motionSetting,
    },
    exit: (direction: 'down' | 'up') => ({
      opacity: 0,
      scale: direction === 'down' ? 1.35 : 0.65,
      rotateX: direction === 'down' ? -24 : 24,
      y: direction === 'down' ? -120 : 120,
      filter: "blur(14px)",
      transition: { ...motionSetting, damping: 28 },
    }),
  };

  // 1. Stats unique animation: Exquisite 3D Directional slide & scale-up to prevent robotic symmetry
  const statsItemVariantsLeft = {
    hidden: { opacity: 0, x: -60, y: 15, scale: 0.9, rotateY: 18 },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0, 
      scale: 1,
      rotateY: 0,
      transition: { type: "spring", stiffness: 180, damping: 20 } 
    }
  };

  const statsItemVariantsCenter = {
    hidden: { opacity: 0, y: 35, scale: 0.85, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 220, damping: 18, delay: 0.1 } 
    }
  };

  const statsItemVariantsRight = {
    hidden: { opacity: 0, x: 60, y: 15, scale: 0.9, rotateY: -18 },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0, 
      scale: 1,
      rotateY: 0,
      transition: { type: "spring", stiffness: 180, damping: 20, delay: 0.2 } 
    }
  };

  // 2. Services unique animations: Gorgeous Cross-Grid Corner slide-in expansion
  const servicesContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const servicesHeaderVariants = {
    hidden: { opacity: 0, y: -20, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const getServiceCardVariant = (index: number) => {
    // Each service has a completely custom direction to converge inwards
    const config = [
      { x: -45, y: -30, rotate: -2 }, // Top Left
      { x: 45, y: -30, rotate: 2 },  // Top Right
      { x: -45, y: 30, rotate: -1 },  // Bottom Left
      { x: 45, y: 30, rotate: 1 },   // Bottom Right
    ];
    const item = config[index % config.length];
    return {
      hidden: { opacity: 0, x: item.x, y: item.y, rotate: item.rotate, scale: 0.94 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 180, damping: 20 }
      }
    };
  };

  const servicesCtaVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, delay: 0.2, ease: "easeOut" }
    }
  };

  // 3. Projects unique animations: Layered cinematic tilt fold-up
  const projectsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const projectsHeaderVariants = {
    hidden: { opacity: 0, y: -18, filter: "blur(3px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const getProjectCardVariant = (index: number) => {
    if (index === 0) {
      return {
        hidden: { opacity: 0, x: -40, y: 25, rotate: -3, scale: 0.95 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 190, damping: 22 }
        }
      };
    } else if (index === 1) {
      return {
        hidden: { opacity: 0, y: 35, scale: 0.93, filter: "brightness(0.5)" },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "brightness(1)",
          transition: { type: "spring", stiffness: 210, damping: 20, delay: 0.08 }
        }
      };
    } else {
      return {
        hidden: { opacity: 0, x: 40, y: 25, rotate: 3, scale: 0.95 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 190, damping: 22, delay: 0.16 }
        }
      };
    }
  };

  // 4. Tech Stack unique animations: Converging magnetic bubble cloud
  const techContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const techHeaderVariants = {
    hidden: { opacity: 0, scale: 0.97, filter: "blur(3px)", y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const getTechItemVariant = (index: number) => {
    // Beautiful cluster drift-in based on position
    const directions = [
      { x: -35, y: -25, rotate: -8 },
      { x: 0, y: -40, rotate: 3 },
      { x: 35, y: -25, rotate: 8 },
      { x: -40, y: 0, rotate: -4 },
      { x: 40, y: 0, rotate: 4 },
      { x: -35, y: 25, rotate: -6 },
      { x: 0, y: 40, rotate: -2 },
      { x: 35, y: 25, rotate: 6 },
    ];
    const dir = directions[index % directions.length];
    return {
      hidden: { 
        opacity: 0, 
        scale: 0.8, 
        x: dir.x, 
        y: dir.y, 
        rotate: dir.rotate,
        filter: "blur(4px)" 
      },
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
        filter: "blur(0px)",
        transition: { 
          type: "spring", 
          stiffness: 220, 
          damping: 18,
          delay: (index % 4) * 0.04 // elegant cascade delay
        }
      }
    };
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

  const renderHero = () => (
    <div className="w-full max-h-full overflow-y-auto py-10 flex flex-col justify-center items-center">
      <Hero onWatchDemo={() => setShowDemo(true)} />
    </div>
  );

  const renderStats = () => (
    <div className="w-full max-h-full overflow-y-auto py-12 flex flex-col justify-center items-center">
      <div className="absolute -inset-10 bg-radial-spotlight opacity-30 pointer-events-none -z-10" />
      <div className="max-w-5xl mx-auto w-full px-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Card 1: Experience (Left side swing) */}
          <motion.div
            variants={statsItemVariantsLeft}
            className="p-8 glass-panel rounded-2xl flex flex-col gap-2.5 text-center transition-all duration-500 hover:scale-[1.03] border border-white/5 hover:border-[#38BDF8]/30 card-shine group relative hover:shadow-[0_15px_35px_rgba(56,189,248,0.12)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#050B14] border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest">
              tenure
            </div>
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 tracking-tight">
              <AnimatedCounter value={settings?.yearsOfExperience || 8} suffix="+" />
            </span>
            <span className="text-[10px] font-mono uppercase text-white/50 tracking-widest font-bold group-hover:text-[#38BDF8] transition-colors">
              Years of Experience
            </span>
          </motion.div>

          {/* Card 2: Deployments (Center scale-up) */}
          <motion.div
            variants={statsItemVariantsCenter}
            className="p-8 glass-panel rounded-2xl flex flex-col gap-2.5 text-center transition-all duration-500 hover:scale-[1.03] border border-white/5 hover:border-[#38BDF8]/35 card-shine group relative hover:shadow-[0_15px_35px_rgba(56,189,248,0.15)] z-10"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#050B14] border border-[#38BDF8]/30 rounded-full text-[9px] font-mono text-[#38BDF8] uppercase tracking-widest font-bold">
              deployments
            </div>
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0084FF] via-[#38BDF8] to-cyan-200 tracking-tight">
              <AnimatedCounter value={settings?.completedProjects || 42} suffix="+" />
            </span>
            <span className="text-[10px] font-mono uppercase text-white/50 tracking-widest font-bold group-hover:text-[#38BDF8] transition-colors">
              Projects Completed
            </span>
          </motion.div>

          {/* Card 3: Technologies (Right side swing) */}
          <motion.div
            variants={statsItemVariantsRight}
            className="p-8 glass-panel rounded-2xl flex flex-col gap-2.5 text-center transition-all duration-500 hover:scale-[1.03] border border-white/5 hover:border-[#38BDF8]/30 card-shine group relative hover:shadow-[0_15px_35px_rgba(56,189,248,0.12)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#050B14] border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest">
              ecosystem
            </div>
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 tracking-tight">
              <AnimatedCounter value={settings?.masteredTechs || 15} suffix="+" />
            </span>
            <span className="text-[10px] font-mono uppercase text-white/50 tracking-widest font-bold group-hover:text-[#38BDF8] transition-colors">
              Technologies Mastered
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  const getRelativeIndex = (idx: number, current: number, total: number) => {
    let diff = idx - current;
    while (diff > total / 2) diff -= total;
    while (diff <= -total / 2) diff += total;
    return diff;
  };

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredServices.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredServices.length) % featuredServices.length);
  };

  // Touch & Mouse swiping handlers

  const handleCarouselSwipeStart = (clientX: number) => {
    carouselSwipeStart.current = clientX;
  };

  const handleCarouselSwipeEnd = (clientX: number) => {
    if (carouselSwipeStart.current === null) return;
    const diffX = carouselSwipeStart.current - clientX;
    if (Math.abs(diffX) > 40) { // threshold for swipe
      if (diffX > 0) {
        nextCarousel();
      } else {
        prevCarousel();
      }
    }
    carouselSwipeStart.current = null;
  };

  const renderServices = () => {
    const total = featuredServices.length;

    return (
      <div 
        className="w-full max-h-full overflow-y-auto py-12 flex flex-col justify-center items-center select-none"
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => {
          setIsCarouselHovered(false);
          carouselSwipeStart.current = null;
        }}
        onTouchStart={(e) => handleCarouselSwipeStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleCarouselSwipeEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleCarouselSwipeStart(e.clientX)}
        onMouseUp={(e) => handleCarouselSwipeEnd(e.clientX)}
      >
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#0084FF]/5 blur-[120px] pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col gap-8 md:gap-12">
          
          {/* Section Header */}
          <motion.div variants={servicesHeaderVariants} className="text-left max-w-3xl flex flex-col gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-[0.25em] font-extrabold">
                [ 01 // CAPABILITIES ]
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
              What We Partner with You to Build
            </h2>
            <p className="text-white/60 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl">
              High-integrity digital systems and interactive frameworks engineered to streamline your operations and deliver gorgeous user interfaces.
            </p>
          </motion.div>

          {/* 3D Rotating Cylinder Carousel Area */}
          <div className="relative w-full flex items-center justify-center py-6" style={{ height: `${screenSize.cardHeight + 50}px` }}>
            
            {/* 3D Scene Wrapper with high perspective depth */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            >
              {featuredServices.map((service, idx) => {
                const relIndex = getRelativeIndex(idx, carouselIndex, total);
                const isActiveCard = relIndex === 0;
                
                // Math for 3D Ring layout
                const angle = relIndex * ((2 * Math.PI) / total);
                const x = Math.sin(angle) * screenSize.radius;
                const z = Math.cos(angle) * screenSize.depth;
                
                // Normalize Z: 0 is back, 1 is front
                const normalizedZ = (z + screenSize.depth) / (2 * screenSize.depth);
                
                // Depth effects mapping
                const scale = 0.7 + normalizedZ * 0.35; // Front scales to 1.05, back is 0.7
                const opacity = 0.25 + normalizedZ * 0.75; // Front is 1.0 opacity, back is 0.25
                const rotateY = -relIndex * (360 / total) * 0.32; // Beautiful 3D inward curve rotation
                const zIndex = Math.round(normalizedZ * 30); // Correct layer ordering
                const blurAmount = isActiveCard ? 0 : (1 - normalizedZ) * 5; // Soft depth-of-field blurring

                return (
                  <motion.div
                    key={service.id || idx}
                    animate={{
                      x: x,
                      z: z,
                      scale: scale,
                      rotateY: rotateY,
                      opacity: opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 90, // Butter-smooth organic motion
                      damping: 18,
                      mass: 0.9
                    }}
                    style={{
                      position: "absolute",
                      width: `${screenSize.cardWidth}px`,
                      height: `${screenSize.cardHeight}px`,
                      zIndex: zIndex,
                      transformStyle: "preserve-3d",
                      filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : "none",
                    }}
                    className="cursor-pointer"
                    onClick={(e) => {
                      if (!isActiveCard) {
                        e.stopPropagation();
                        setCarouselIndex(idx);
                      }
                    }}
                  >
                    <div 
                      className={`w-full h-full p-6 sm:p-7 glass-panel rounded-2xl text-left flex flex-col justify-between group relative border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#38BDF8]/40 shadow-2xl ${
                        isActiveCard ? 'hover:shadow-[0_15px_45px_rgba(56,189,248,0.12)] ring-1 ring-white/10' : 'pointer-events-none'
                      }`}
                    >
                      {/* Ambient background glow inside cards */}
                      <div className="absolute -inset-10 bg-[#38BDF8]/[0.01] group-hover:bg-[#38BDF8]/[0.03] transition-colors duration-500 rounded-2xl" />

                      {/* Top content */}
                      <div className="relative z-10">
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-[#050B14] group-hover:scale-105 transition-all duration-500 shadow-[0_0_15px_rgba(56,189,248,0)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                          {idx === 0 ? <Code2 className="w-5.5 h-5.5" /> : idx === 1 ? <Layers className="w-5.5 h-5.5" /> : idx === 2 ? <Database className="w-5.5 h-5.5" /> : <Terminal className="w-5.5 h-5.5" />}
                        </div>
                        <h3 className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-[#38BDF8] mt-5 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm leading-relaxed mt-2.5 font-sans line-clamp-4">
                          {service.description}
                        </p>
                      </div>

                      {/* Features lists at card bottoms */}
                      <div className="mt-4 flex flex-wrap gap-1.5 relative z-10">
                        {service.features.slice(0, 3).map((feat, fIdx) => (
                          <span key={fIdx} className="px-2.5 py-0.5 bg-white/[0.03] text-[9px] text-white/70 font-mono rounded-md border border-white/5 font-semibold">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

            </div>

            {/* Left Control Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevCarousel();
              }}
              aria-label="Previous Service"
              className="absolute left-2 md:left-6 z-40 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 flex items-center justify-center backdrop-blur-md transition-all duration-300 pointer-events-auto active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Control Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextCarousel();
              }}
              aria-label="Next Service"
              className="absolute right-2 md:right-6 z-40 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 flex items-center justify-center backdrop-blur-md transition-all duration-300 pointer-events-auto active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Interactive Pagination Dots & Bottom Action CTA Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            
            {/* Elegant Dots Pagination */}
            <div className="flex items-center space-x-2">
              {featuredServices.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`relative h-2 rounded-full transition-all duration-500 ${
                    carouselIndex === idx ? 'w-8 bg-[#38BDF8]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <motion.div variants={servicesCtaVariants}>
              <Link
                to="/skills"
                className="group px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#38BDF8]/30 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm cursor-pointer"
              >
                <span>Explore Services & Skills</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const total = featuredProjects.length;

    const nextProject = () => {
      setProjectCarouselIndex((prev) => (prev + 1) % total);
    };

    const prevProject = () => {
      setProjectCarouselIndex((prev) => (prev - 1 + total) % total);
    };

    const handleProjectSwipeStart = (clientX: number) => {
      projectCarouselSwipeStart.current = clientX;
    };

    const handleProjectSwipeEnd = (clientX: number) => {
      if (projectCarouselSwipeStart.current === null) return;
      const diffX = projectCarouselSwipeStart.current - clientX;
      if (Math.abs(diffX) > 40) { // threshold for swipe
        if (diffX > 0) {
          nextProject();
        } else {
          prevProject();
        }
      }
      projectCarouselSwipeStart.current = null;
    };

    return (
      <div 
        className="w-full max-h-full overflow-y-auto py-12 flex flex-col justify-center items-center select-none"
        onMouseEnter={() => setIsProjectCarouselHovered(true)}
        onMouseLeave={() => {
          setIsProjectCarouselHovered(false);
          projectCarouselSwipeStart.current = null;
        }}
        onTouchStart={(e) => handleProjectSwipeStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleProjectSwipeEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleProjectSwipeStart(e.clientX)}
        onMouseUp={(e) => handleProjectSwipeEnd(e.clientX)}
      >
        <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-[#38BDF8]/5 blur-[120px] pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col gap-8 md:gap-12">
          
          {/* Section Header */}
          <motion.div variants={projectsHeaderVariants} className="text-left flex flex-col gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-[0.25em] font-extrabold">
                [ 02 // SELECTED DEPLOYMENTS ]
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
              Featured Engineering Projects
            </h2>
            <p className="text-white/60 text-xs sm:text-sm font-sans max-w-2xl">
              Select production systems demonstrating secure databases, fine visual feedback, and absolute layout precision.
            </p>
          </motion.div>

          {/* 3D Rotating Cylinder Carousel Area */}
          <div className="relative w-full flex items-center justify-center py-6" style={{ height: `${projectScreenSize.cardHeight + 50}px` }}>
            
            {/* 3D Scene Wrapper */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            >
              {featuredProjects.map((project, idx) => {
                const relIndex = getRelativeIndex(idx, projectCarouselIndex, total);
                const isActiveCard = relIndex === 0;

                // Math for 3D Ring layout
                const angle = relIndex * ((2 * Math.PI) / total);
                const x = Math.sin(angle) * projectScreenSize.radius;
                const z = Math.cos(angle) * projectScreenSize.depth;

                // Normalize Z: 0 is back, 1 is front
                const normalizedZ = (z + projectScreenSize.depth) / (2 * projectScreenSize.depth);

                // Depth effects mapping
                const scale = 0.7 + normalizedZ * 0.35;
                const opacity = 0.25 + normalizedZ * 0.75;
                const rotateY = -relIndex * (360 / total) * 0.32;
                const zIndex = Math.round(normalizedZ * 30);
                const blurAmount = isActiveCard ? 0 : (1 - normalizedZ) * 5;

                return (
                  <motion.div
                    key={project.id || idx}
                    animate={{
                      x: x,
                      z: z,
                      scale: scale,
                      rotateY: rotateY,
                      opacity: opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 18,
                      mass: 0.9
                    }}
                    style={{
                      position: "absolute",
                      width: `${projectScreenSize.cardWidth}px`,
                      height: `${projectScreenSize.cardHeight}px`,
                      zIndex: zIndex,
                      transformStyle: "preserve-3d",
                      filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : "none",
                    }}
                    className="cursor-pointer"
                    onClick={(e) => {
                      if (!isActiveCard) {
                        e.stopPropagation();
                        setProjectCarouselIndex(idx);
                      }
                    }}
                  >
                    <div 
                      className={`w-full h-full glass-panel rounded-2xl overflow-hidden flex flex-col hover:border-[#38BDF8]/30 transition-all duration-500 border border-white/5 relative ${
                        isActiveCard ? 'hover:shadow-[0_20px_50px_rgba(56,189,248,0.12)] ring-1 ring-white/10' : 'pointer-events-none'
                      }`}
                    >
                      {/* Image section */}
                      <div className="relative aspect-video overflow-hidden bg-[#050B14]">
                        <img
                          src={project.image}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent opacity-90" />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[8px] font-mono text-[#38BDF8] tracking-widest uppercase font-extrabold shadow-sm">
                          {project.category}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col justify-between flex-1 text-left">
                        <div>
                          <h3 className="text-sm md:text-base font-display font-bold text-white transition-colors duration-300">
                            {project.title}
                          </h3>
                          <p className="text-white/50 text-[11px] mt-2 line-clamp-3 leading-relaxed font-sans font-medium">
                            {project.description}
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, tIdx) => (
                              <span key={tIdx} className="px-1.5 py-0.5 bg-white/[0.03] text-[8px] text-white/60 font-mono rounded border border-white/5 font-semibold">
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">verified status</span>
                            {isActiveCard && (
                              <Link
                                to="/projects"
                                className="text-xs text-[#38BDF8] font-bold hover:text-white flex items-center space-x-1 group/btn pointer-events-auto"
                              >
                                <span>Specifications</span>
                                <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Left Control Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevProject();
              }}
              aria-label="Previous Project"
              className="absolute left-2 md:left-6 z-40 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 flex items-center justify-center backdrop-blur-md transition-all duration-300 pointer-events-auto active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Control Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextProject();
              }}
              aria-label="Next Project"
              className="absolute right-2 md:right-6 z-40 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 flex items-center justify-center backdrop-blur-md transition-all duration-300 pointer-events-auto active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Pagination Controls & Bottom Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            
            {/* Elegant Dots Pagination */}
            <div className="flex items-center space-x-2">
              {featuredProjects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setProjectCarouselIndex(idx)}
                  className={`relative h-2 rounded-full transition-all duration-500 ${
                    projectCarouselIndex === idx ? 'w-8 bg-[#38BDF8]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to project slide ${idx + 1}`}
                />
              ))}
            </div>

            <motion.div variants={servicesCtaVariants}>
              <Link
                to="/projects"
                className="group px-5 py-2.5 rounded-full bg-white text-[#050B14] hover:bg-zinc-100 font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-white/5 cursor-pointer"
              >
                <span>Browse All Projects</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    );
  };

  const renderTech = () => (
    <div className="w-full h-full flex flex-col justify-between py-12 px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={techContainerVariants}
        className="max-w-6xl mx-auto w-full flex-grow flex flex-col justify-center gap-6 md:gap-10"
      >
        <motion.div variants={techHeaderVariants} className="text-left flex flex-col gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-[0.25em] font-extrabold">
              [ 03 // TECH STACK ]
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            Core Competencies & Tooling
          </h2>
          <p className="text-white/60 text-xs sm:text-sm font-sans max-w-2xl">
            Engineering web platforms and high-throughput servers utilizing robust software structures.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
            <motion.div
              key={idx}
              variants={getTechItemVariant(idx)}
              className="p-3 md:p-4 glass-panel border border-white/5 hover:border-[#38BDF8]/40 rounded-xl flex items-center space-x-3 transition-all duration-300 hover:scale-[1.03] hover:bg-white/[0.02] card-shine hover:shadow-[0_10px_25px_rgba(56,189,248,0.06)]"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[#38BDF8] text-xs font-bold shrink-0">
                {tech.icon}
              </div>
              <span className="font-sans text-xs font-bold text-white/80">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="w-full border-t border-white/10 pt-6 mt-6 max-w-6xl mx-auto">
        <Footer />
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full h-screen overflow-hidden relative text-white font-sans bg-transparent"
      style={{ perspective: "1500px" }}
    >
      {/* Subtle global grid layout overlay on home */}
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-20 z-0" />

      {/* Vertical Futuristic Dot Navigation */}
      <div className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-5 z-40 bg-black/35 backdrop-blur-md px-3 py-6 rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {sections.map((sec, idx) => {
          const isCurrent = activeSection === idx;
          const sectionLabel = 
            idx === 0 ? "الرئيسية" : 
            idx === 1 ? "الخدمات" : 
            idx === 2 ? "المشاريع" : "التقنيات & الفوتر";

          return (
            <button
              key={sec}
              onClick={() => handleDotClick(idx)}
              className="group relative flex items-center justify-center cursor-pointer w-6 h-6"
              title={sectionLabel}
            >
              <span className="absolute right-10 px-3 py-1.5 rounded-lg bg-[#050B14]/95 border border-white/10 text-[11px] font-sans text-white/90 font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                {sectionLabel}
              </span>
              <span className={`absolute w-5 h-5 rounded-full border transition-all duration-500 ${isCurrent ? 'border-[#38BDF8] scale-100 opacity-100' : 'border-transparent scale-50 opacity-0 group-hover:opacity-40 group-hover:scale-75 group-hover:border-white/30'}`} />
              <span className={`w-2 h-2 rounded-full transition-all duration-500 relative z-10 ${isCurrent ? 'bg-[#38BDF8] scale-110 shadow-[0_0_8px_#38BDF8]' : 'bg-white/30 group-hover:bg-white/60'}`} />
            </button>
          );
        })}
      </div>

      {/* Cinematic Perspective Viewport Layer */}
      <div className="w-full h-full relative z-10 flex items-center justify-center overflow-hidden">
        <AnimatePresence custom={scrollDirection} mode="wait">
          <motion.div
            key={activeSection}
            custom={scrollDirection}
            variants={popVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full absolute inset-0 flex items-center justify-center"
          >
            {activeSection === 0 && renderHero()}
            {activeSection === 1 && renderServices()}
            {activeSection === 2 && renderProjects()}
            {activeSection === 3 && renderTech()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
