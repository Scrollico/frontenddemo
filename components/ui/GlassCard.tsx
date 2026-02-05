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
  const baseStyles = "rounded-2xl overflow-hidden transition-[color_75ms,background-color_75ms,border-color_75ms,transform_0.3s_ease,box-shadow_0.3s_ease] ease-smooth group relative backface-hidden transform-gpu";
  
  const themeStyles = `
    bg-white/60 border border-white/40 shadow-sm text-slate-900
    dark:bg-[#1c1c1e]/60 dark:backdrop-blur-xl dark:shadow-xl dark:shadow-black/10 dark:text-gray-100 dark:border-white/10
    
    /* Hover State: Subtle lift and shadow bloom */
    hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 
    dark:hover:border-white/20 dark:hover:bg-[#1c1c1e]/80
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