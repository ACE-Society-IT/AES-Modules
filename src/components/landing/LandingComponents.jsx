import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* =========================================================================
   EASY UI ANIMATED BUTTONS (EASY UI / MAGIC UI INSPIRED)
   - Continuous Orbiting Border Beam (Conic Gradient)
   - Magnetic Hover & Spring Physics
   - High-Contrast Theme Awareness (Deep Wine Obsidian & Soft Rose White)
   ========================================================================= */

export function EasyBeamButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  icon: Icon
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-[1.5px] rounded-full overflow-hidden group cursor-pointer focus:outline-none select-none ${className}`}
    >
      {/* Easy UI Orbiting Border Beam */}
      <span
        className="absolute inset-[-200%] animate-[spin_3.2s_linear_infinite] pointer-events-none"
        style={{
          background:
            variant === 'primary'
              ? 'conic-gradient(from 0deg, transparent 0deg 240deg, rgba(241, 202, 126, 0.4) 280deg, #D4A853 325deg, #F1CA7E 360deg)'
              : 'conic-gradient(from 0deg, transparent 0deg 240deg, rgba(136, 27, 48, 0.25) 280deg, var(--border-active) 330deg, var(--chart-stroke) 360deg)'
        }}
      />

      {/* Button Capsule Body */}
      <span
        className={`relative z-10 flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-rounded font-bold text-sm sm:text-base tracking-wide transition-all duration-300 ${
          variant === 'primary'
            ? 'bg-[var(--btn-primary-bg)] text-white group-hover:bg-[#6B1527] shadow-lg group-hover:shadow-[0_0_28px_rgba(217,30,68,0.5)]'
            : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-soft)] group-hover:border-[var(--border-active)] group-hover:shadow-[0_0_22px_rgba(136,27,48,0.25)]'
        }`}
      >
        {Icon && (
          <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0" />
        )}
        <span>{children}</span>
      </span>
    </motion.button>
  );
}

// Easy UI Shimmering Button
export function ShimmerButton({ children, onClick, className = '', variant = 'primary' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      style={{ boxShadow: 'var(--btn-primary-shadow)' }}
      className={`easy-shimmer-btn group cursor-pointer ${className}`}
    >
      <span
        className={`easy-shimmer-inner px-8 py-3.5 sm:py-4 text-sm sm:text-base font-rounded font-bold transition-colors ${
          variant === 'primary'
            ? 'bg-[var(--btn-primary-bg)] hover:bg-[#6B1527] text-[#FFFFFF]'
            : 'bg-[var(--bg-card)] hover:bg-[var(--row-hover)] text-[var(--text-main)] border border-[var(--border-soft)]'
        }`}
      >
        {children}
      </span>
    </motion.button>
  );
}

// Easy UI Border Beam Card Overlay
export function EasyBorderBeam({
  className = '',
  duration = 6,
  colorFrom = '#881B30',
  colorTo = '#F1CA7E'
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}>
      <div
        className="absolute inset-[-150%] animate-[spin_var(--duration)_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          '--duration': `${duration}s`,
          background: `conic-gradient(from 0deg, transparent 0deg 260deg, ${colorFrom} 310deg, ${colorTo} 360deg)`
        }}
      />
      <div className="absolute inset-[1px] rounded-[inherit] bg-[var(--bg-card)] -z-0" />
    </div>
  );
}

// EasyUI Cursor Spotlight Card with Spring Lazy-Load Animation on Scroll
export function EasySpotlightCard({
  children,
  className = '',
  delay = 0,
  spotlightColor = 'rgba(217, 30, 68, 0.18)'
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 24,
        delay
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* EasyUI Cursor Tracking Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10 rounded-[inherit]"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </motion.div>
  );
}

// EasyUI Scroll Reveal Wrapper (Lazy Load Animation on scroll)
export function EasyScrollReveal({
  children,
  className = '',
  delay = 0,
  y = 30,
  scale = 0.98
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 24,
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 3D Perspective Tilt Card with Physics
export function Tilt3DCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 7;
    const rotY = ((x - centerX) / centerX) * 7;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.16
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative surface-box rounded-[28px] border border-[var(--border-card)] p-6 transition-shadow duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(217, 30, 68, 0.2) 0%, transparent 60%)`,
          opacity: glarePos.opacity
        }}
      />
      <div style={{ transform: 'translateZ(16px)' }}>{children}</div>
    </motion.div>
  );
}
