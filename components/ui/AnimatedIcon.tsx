import React from 'react';

interface AnimatedIconProps {
  icon: React.ElementType;
  className?: string;
  isActive?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ icon: Icon, className = "", isActive = false }) => {
  return (
    <div
      className={`
        relative flex items-center justify-center w-5 h-5 flex-shrink-0
        transition-transform duration-300 ease-out
        ${isActive ? 'scale-105 animate-icon-breathe group-hover:scale-110 group-hover:[animation:none]' : 'scale-100 group-hover:scale-110'}
        ${className}
      `}
    >
      {/* Glow behind icon on hover/active */}
      <div
        className={`
          absolute inset-0 rounded-full blur-md transition-opacity duration-300
          bg-current opacity-0 group-hover:opacity-15
          ${isActive ? 'opacity-25' : ''}
        `}
      />
      <Icon
        strokeWidth={isActive ? 2 : 1.25}
        className="relative z-10 w-5 h-5 transition-all duration-300"
      />
    </div>
  );
};