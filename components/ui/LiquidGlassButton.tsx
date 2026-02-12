import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
    children,
    icon: Icon,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = "group relative px-10 py-4 rounded-full font-bold text-sm transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-3 overflow-hidden backdrop-blur-3xl border border-white/10 active:scale-[0.97]";

    const variants = {
        primary: "bg-white/10 text-white hover:bg-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(59,130,246,0.3)] hover:border-white/30",
        secondary: "bg-black/40 text-white hover:bg-black/60 border-white/10 hover:border-white/20",
        ghost: "bg-transparent text-white/70 hover:text-white border-transparent hover:border-white/10",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {/* Organic Liquid Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[35deg] blur-md" />

            {/* Pulsing Ambient Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] animate-pulse-soft" />

            {/* Hover Expansion Effect */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-90 group-hover:scale-100 rounded-full blur-xl" />

            <span className="relative z-10 flex items-center gap-3 tracking-wider font-semibold">
                {children}
                {Icon && <Icon className="w-4 h-4 group-hover:translate-x-1.5 group-active:translate-x-0.5 transition-transform duration-500 ease-out" strokeWidth={1.5} />}
            </span>

            {/* Refined Border Highlight */}
            <div className="absolute inset-0 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-[1.02] group-hover:scale-100" />
        </button>
    );
};
