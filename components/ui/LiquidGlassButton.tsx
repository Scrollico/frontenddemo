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
    const baseStyles = "group relative px-10 py-4 rounded-full font-bold text-sm transition-all duration-700 ease-out flex items-center gap-3 overflow-hidden backdrop-blur-xl border border-white/20";

    const variants = {
        primary: "bg-white/10 text-white hover:bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]",
        secondary: "bg-black/20 text-white hover:bg-black/30 border-white/10",
        ghost: "bg-transparent text-white/70 hover:text-white border-transparent hover:border-white/10",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {/* Liquid Ripple/Highlight Effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />

            {/* Subtle Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />

            <span className="relative z-10 flex items-center gap-3 capitalize group-active:scale-95 transition-transform duration-200">
                {children}
                {Icon && <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={2.5} />}
            </span>

            {/* Border Highlight */}
            <div className="absolute inset-0 rounded-full border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-[1.02]" />
        </button>
    );
};
