import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  depth: number;
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

    // Initialize premium floating nodes/particles
    const particles: Particle[] = [];
    const particleCount = 45;
    const colors = [
      'rgba(0, 132, 255, 0.15)',   // Electric Blue
      'rgba(56, 189, 248, 0.15)',  // Soft Cyan
      'rgba(147, 51, 234, 0.12)'   // Deep Purple
    ];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random() * 3 + 1;
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: (Math.random() * 1.5 + 0.5) * (depth * 0.45),
        speedX: (Math.random() - 0.5) * (0.2 / depth),
        speedY: (Math.random() - 0.5) * (0.2 / depth),
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        depth
      });
    }

    let animationFrameId: number;

    const render = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Render interactive cursor glow on the canvas
      if (mouse.x > -500 && mouse.y > -500) {
        const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
        cursorGlow.addColorStop(0, 'rgba(0, 132, 255, 0.04)');
        cursorGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.015)');
        cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cursorGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw premium interactive particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interactive mouse push
        if (mouse.x > -500 && mouse.y > -500) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 180) {
            const force = (180 - dist) / 180 * 0.12;
            p.x -= (dx / dist) * force * p.depth;
            p.y -= (dy / dist) * force * p.depth;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Subtle networking interconnections
      ctx.strokeStyle = 'rgba(0, 132, 255, 0.01)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            const alpha = (90 - dist) / 90 * 0.15;
            ctx.strokeStyle = `rgba(0, 132, 255, ${alpha * 0.08})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

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
    <div id="interactive-background" ref={containerRef} className="fixed inset-0 -z-50 w-full h-full overflow-hidden select-none bg-[#050B14]">
      {/* Layer 1: Background Video */}
      <video
        src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_cloud_animation_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* Layer 2: Video Dimming Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Layer 3: Foreground Overlay Image */}
      <div 
        className="absolute bottom-0 left-0 right-0 w-full h-[80vh] bg-cover bg-bottom pointer-events-none opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `url('https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_foreground_bg.png')`
        }}
      />

      {/* Layer 4: Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-[#02122c] via-[#02122c]/80 to-transparent pointer-events-none" />

      {/* Layer 5: Top Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #02122cff 0%, #02122cfa 10%, #02122c80 25%, transparent 50%)'
        }}
      />

      {/* Layer 6: UI Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
    </div>
  );
};
