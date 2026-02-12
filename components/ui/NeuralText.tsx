import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, ExternalLink } from 'lucide-react';

interface NeuralTextProps {
    text: string;
    entityType?: 'company' | 'sector' | 'trend';
    metrics?: {
        value: string;
        change: string;
        isPositive: boolean;
    };
    snippet?: string;
}

export const NeuralText: React.FC<NeuralTextProps> = ({ text, entityType = 'trend', metrics, snippet }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            className="relative inline-block group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="cursor-help border-b border-blue-400/30 hover:border-blue-400 transition-colors duration-300 decoration-blue-500/50 decoration-2 underline-offset-4 font-medium text-gray-900 dark:text-white">
                {text}
            </span>

            {/* Hover Card - Neural Pulse */}
            {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-2xl shadow-blue-500/20 overflow-hidden relative">
                        {/* Background Pulse Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-pulse" />

                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                                {entityType} Analysis
                            </span>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ animationDelay: '0.2s' }} />
                            </div>
                        </div>

                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{text}</h4>

                        {metrics && (
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{metrics.value}</span>
                                <div className={`flex items-center text-[10px] font-bold ${metrics.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {metrics.isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                    {metrics.change}
                                </div>
                            </div>
                        )}

                        {/* Sentiment Meter */}
                        <div className="mb-4 space-y-1">
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                <span>Sentiment Index</span>
                                <span className="text-emerald-500">Bullish</span>
                            </div>
                            <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden flex">
                                <div className="h-full bg-rose-500" style={{ width: '20%' }} />
                                <div className="h-full bg-emerald-500" style={{ width: '80%' }} />
                            </div>
                        </div>

                        {/* Sector Comparison */}
                        <div className="mb-4 space-y-1">
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                <span>Rel. Sector Strength</span>
                                <span>+12.4%</span>
                            </div>
                            <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
                            </div>
                        </div>

                        {snippet && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4 italic border-l border-blue-500/30 pl-2">
                                "{snippet}"
                            </p>
                        )}

                        <button className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-[10px] font-bold text-blue-500 transition-all flex items-center justify-center gap-2 group/btn">
                            Deep Dive Research <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/80 dark:border-t-slate-900/90" />
                </div>
            )}
        </span>
    );
};
