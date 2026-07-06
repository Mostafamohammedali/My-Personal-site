import React, { useEffect, useRef } from 'react';

interface Fiber {
  startX: number;
  amplitude: number;
  frequency: number;
  phase: number;
  phaseSpeed: number;
  curvature: number; // general sweeping curve factor
  thickness: number;
  color: string;
  glowColor: string;
  particles: {
    y: number;
    speed: number;
    size: number;
    alpha: number;
  }[];
}

interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  color: string;
}

export const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays for crisp rendering
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Initialize Fiber Optic Strands to match the beautiful video
    const fibers: Fiber[] = [];
    const isMobile = window.innerWidth < 768;
    const fiberCount = isMobile ? 12 : 22; // Half the count for massive performance gain

    // Helper to generate a random blue shade matching the video
    const getRandomBlue = (opacity: number) => {
      const shades = [
        `rgba(0, 132, 255, ${opacity})`,  // Electric Blue
        `rgba(56, 189, 248, ${opacity})`, // Cyan / Soft Blue
        `rgba(2, 60, 240, ${opacity})`,   // Deep Royal Blue
        `rgba(14, 165, 233, ${opacity})`  // Sky Blue
      ];
      return shades[Math.floor(Math.random() * shades.length)];
    };

    for (let i = 0; i < fiberCount; i++) {
      // Position start points mostly in a sweeping curve from bottom-left towards center-right
      const startX = (i / fiberCount) * window.innerWidth * 1.2 - (window.innerWidth * 0.1);
      
      const particlesList = [];
      const particleCount = isMobile ? 1 : (Math.random() > 0.5 ? 2 : 1); // Fewer glowing light pulses per fiber
      for (let p = 0; p < particleCount; p++) {
        particlesList.push({
          y: Math.random() * window.innerHeight,
          speed: Math.random() * 1.0 + 0.5,
          size: Math.random() * 2.0 + 1.0,
          alpha: Math.random() * 0.5 + 0.5
        });
      }

      fibers.push({
        startX,
        amplitude: Math.random() * 35 + 15,
        frequency: Math.random() * 0.0025 + 0.0015,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.012 + 0.004,
        curvature: (Math.random() * 150 + 60) * (Math.random() > 0.5 ? 1 : -1), // Curved sweeping paths
        thickness: Math.random() * 1.2 + 0.5,
        color: getRandomBlue(Math.random() * 0.12 + 0.08),
        glowColor: getRandomBlue(1),
        particles: particlesList
      });
    }

    // Ambient floating light bokeh circles
    const ambientParticles: AmbientParticle[] = [];
    const ambientCount = isMobile ? 10 : 20; // Lower count for better performance
    for (let i = 0; i < ambientCount; i++) {
      ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1.5,
        speedY: -(Math.random() * 0.3 + 0.1), // drift upwards
        speedX: (Math.random() - 0.5) * 0.1,
        alpha: Math.random() * 0.3 + 0.1,
        color: getRandomBlue(1)
      });
    }

    let animationFrameId: number;

    const render = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear with absolute pure black & dark royal gradient to match the cinematic video
      const bgGradient = ctx.createRadialGradient(width * 0.6, height * 0.7, 0, width * 0.5, height * 0.5, width * 0.9);
      bgGradient.addColorStop(0, '#021026'); // Deep dark blue spotlight
      bgGradient.addColorStop(0.5, '#010611'); // Darkest indigo
      bgGradient.addColorStop(1, '#000205'); // Absolute deep black corners
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse coordinates smoothly
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Render interactive mouse glow
      if (mouse.x > -500 && mouse.y > -500) {
        const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
        cursorGlow.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
        cursorGlow.addColorStop(0.5, 'rgba(0, 132, 255, 0.02)');
        cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cursorGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 1. Draw Ambient Floating Bokeh Circles
      ambientParticles.forEach((ap) => {
        ap.y += ap.speedY;
        ap.x += ap.speedX;

        // Reset if floats off the top
        if (ap.y < -10) {
          ap.y = height + 10;
          ap.x = Math.random() * width;
        }
        if (ap.x < -10) ap.x = width + 10;
        if (ap.x > width + 10) ap.x = -10;

        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size, 0, Math.PI * 2);
        ctx.fillStyle = ap.color;
        ctx.globalAlpha = ap.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 2. Draw Waving Fiber Optic Strands
      fibers.forEach((f) => {
        f.phase += f.phaseSpeed; // animate waves

        ctx.beginPath();
        ctx.lineWidth = f.thickness;
        ctx.strokeStyle = f.color;

        // Draw curved lines by plotting points vertically
        // Increased step to 45 for over 3x faster point rendering
        const step = 45;
        let first = true;

        for (let y = height + 10; y >= -10; y -= step) {
          // Curvature + Sine wave offset
          const progress = (height - y) / height; // 0 at bottom, 1 at top
          
          // Wave distortion
          let xOffset = Math.sin(y * f.frequency + f.phase) * f.amplitude;
          
          // Sweeping natural curve path
          xOffset += Math.sin(progress * Math.PI) * f.curvature;

          // Add a tiny bit of magnetic mouse attraction to the fibers (highly optimized)
          if (mouse.x > -500 && mouse.y > -500) {
            const currentX = f.startX + xOffset;
            const dx = mouse.x - currentX;
            const dy = mouse.y - y;
            const distSq = dx * dx + dy * dy;
            // Only compute square root if within influence circle
            if (distSq < 40000) { // 200px * 200px
              const dist = Math.sqrt(distSq);
              const force = ((200 - dist) / 200) * 20; // pull up to 20px
              xOffset += (dx / dist) * force;
            }
          }

          const drawX = f.startX + xOffset;

          if (first) {
            ctx.moveTo(drawX, y);
            first = false;
          } else {
            ctx.lineTo(drawX, y);
          }
        }
        ctx.stroke();

        // 3. Draw Fiber Optic Signal Pulses (Glowing Tips/Lights traveling along the strands)
        f.particles.forEach((p) => {
          p.y -= p.speed; // move upward

          // Reset when reaching top
          if (p.y < -10) {
            p.y = height + 10;
            p.speed = Math.random() * 1.0 + 0.5;
          }

          // Compute exact X coordinate on the waving line at the current Y
          const progress = (height - p.y) / height;
          let pXOffset = Math.sin(p.y * f.frequency + f.phase) * f.amplitude;
          pXOffset += Math.sin(progress * Math.PI) * f.curvature;

          // Mouse influence at particle coordinate (highly optimized)
          if (mouse.x > -500 && mouse.y > -500) {
            const currentX = f.startX + pXOffset;
            const dx = mouse.x - currentX;
            const dy = mouse.y - p.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 40000) { // 200px * 200px
              const dist = Math.sqrt(distSq);
              const force = ((200 - dist) / 200) * 20;
              pXOffset += (dx / dist) * force;
            }
          }

          const particleX = f.startX + pXOffset;

          // Fast high-performance glow effect using concentric circles instead of expensive shadowBlur
          ctx.save();
          
          // 1. Extreme glow outer ring
          ctx.beginPath();
          ctx.arc(particleX, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = f.glowColor;
          ctx.globalAlpha = p.alpha * 0.12;
          ctx.fill();

          // 2. Medium glow ring
          ctx.beginPath();
          ctx.arc(particleX, p.y, p.size * 2.0, 0, Math.PI * 2);
          ctx.fillStyle = f.glowColor;
          ctx.globalAlpha = p.alpha * 0.35;
          ctx.fill();

          // 3. Bright white core
          ctx.beginPath();
          ctx.arc(particleX, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          ctx.restore();
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      id="interactive-background" 
      ref={containerRef} 
      className="fixed inset-0 -z-50 w-full h-full overflow-hidden select-none bg-[#010611]"
    >
      {/* Background Interactive Fiber Optics Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* Cinematic Overlays to blend with the portfolio perfectly */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#010611] via-transparent to-[#010611]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none" />
    </div>
  );
};
