import React from 'react';

interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  noPadding = false,
  style
}) => {
  // Use 'ease-smooth' (defined in index.html tailwind config) and longer duration for Apple-like feel
  // Theme colors 75ms so theme shift is fast and in sync; transform/shadow 300ms for hover
  const baseStyles = "rounded-2xl overflow-hidden transition-[color_75ms,background-color_75ms,border-color_75ms,transform_0.5s_cubic-bezier(0.2,0.8,0.2,1),box-shadow_0.5s_cubic-bezier(0.2,0.8,0.2,1)] ease-smooth group relative backface-hidden transform-gpu";

  const themeStyles = `
    bg-white/60 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.05)] text-slate-900
    dark:bg-executive-card/60 dark:backdrop-blur-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:text-gray-100 dark:border-white/10
    
    /* Hover State: Fluid lift and soft shadow bloom */
    hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(59,130,246,0.1)] 
    dark:hover:border-white/20 dark:hover:bg-executive-card/80
  `;

  const paddingStyles = noPadding ? "" : "p-6";

  return (
    <div className={`${baseStyles} ${themeStyles} ${paddingStyles} ${className}`} style={style}>
      {/* Static ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
};