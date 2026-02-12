import React, { useState, useEffect } from 'react';
import { ChevronRight, LayoutDashboard, Radar, AudioLines, Activity, Feather, CheckCircle2, Lightbulb, Mic, ArrowRight, BrainCircuit, Globe, Sparkles } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { AnimatedIcon } from './ui/AnimatedIcon';
import { LiquidGlassButton } from './ui/LiquidGlassButton';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const nextStep = () => {
    // Reduced steps: 0 -> 1 -> Finish. Removed the "System Optimized" (Launch) screen.
    if (step < 1) {
      setStep(step + 1);
    } else {
      setIsExiting(true);
      setTimeout(onComplete, 800); // Allow exit animation
    }
  };

  return (
    <div className={`fixed inset-0 bg-executive flex items-center justify-center z-50 transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Overlay - Executive Gradient */}
      <div className="absolute inset-0 bg-[#0F172A]" />

      {/* Premium Background Ambience - Executive Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[200px] animate-pulse-soft mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[200px] animate-pulse-soft mix-blend-screen" style={{ animationDelay: '2s' }} />

      <div className={`relative w-full max-w-7xl px-8 transition-all duration-1000 ease-smooth ${isExiting ? 'scale-95 opacity-0 -translate-y-8' : 'scale-100 opacity-100'}`}>
        {/* Main Content Area */}
        <div className="min-h-[600px] flex flex-col justify-center items-center text-center relative z-10 py-12">

          {/* Step 0: Welcome - Executive Style */}
          {step === 0 && (
            <div className="animate-fade-in flex flex-col items-center gap-16 max-w-4xl">
              <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-3xl animate-float group relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-125 group-hover:scale-150 transition-transform duration-1000"></div>
                {/* Liquid Sheen */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <LayoutDashboard className="w-16 h-16 text-white relative z-10 opacity-90" strokeWidth={0.5} />
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white font-display">
                  AI Business <span className="text-blue-500">Suite</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                  The <span className="text-white font-medium">ultimate intelligence layer</span> for the modern executive. <br />
                  Data velocity, redefined by Agentic AI.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2 opacity-40">
                  <div className="w-8 h-[1px] bg-blue-500/50" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-400">Powered by Scrolli</span>
                  <div className="w-8 h-[1px] bg-blue-500/50" />
                </div>
              </div>

              <div className="mt-8">
                <LiquidGlassButton
                  onClick={nextStep}
                  icon={ArrowRight}
                  className="scale-110"
                >
                  Initialize Experience
                </LiquidGlassButton>
              </div>
            </div>
          )}

          {/* Step 1: Core Pillars - Expanded Radial Layout */}
          {step === 1 && (
            <div className="animate-fade-in w-full flex flex-col items-center">
              <div className="mb-20 text-center">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Intelligence Ecosystem</h2>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  <p className="text-gray-500 font-bold text-xs tracking-[0.3em] uppercase">Neural Mapping Active</p>
                </div>
              </div>

              {/* Central Hub with Expanded Spokes */}
              <div className="relative w-full h-[450px] flex items-center justify-center">
                {/* Central Brain Icon - Premium Liquid Version */}
                <div className="relative z-30 w-32 h-32 rounded-full bg-white/5 border border-white/20 backdrop-blur-3xl flex items-center justify-center animate-icon-breathe shadow-[0_0_80px_rgba(59,130,246,0.25)] group">
                  <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full animate-pulse"></div>
                  <BrainCircuit className="w-12 h-12 text-blue-400 opacity-90 relative z-10" strokeWidth={0.5} />

                  {/* Orbiting particles */}
                  <div className="absolute inset-0 -m-6 border border-white/10 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-0 -m-12 border border-white/5 rounded-full animate-spin-slow-reverse"></div>
                </div>

                {/* Floating Node 1: Market Radar - Top Left */}
                <div className="absolute -top-5 md:left-[20%] -translate-x-1/2 group">
                  <GlassCard className="p-6 w-72 bg-white/[0.03] hover:bg-white/[0.08] hover:border-blue-500/40 animate-float border-white/10 transition-all duration-500 rounded-xl" style={{ animationDelay: '0s' }}>
                    <div className="flex items-center gap-5 mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
                        <Globe className="w-6 h-6 text-blue-300" strokeWidth={1} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-wide">Market Intelligence</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-light text-left">
                      Real-time sector heatmaps grounded in Nasdaq and Bloomberg data pipelines.
                    </p>
                  </GlassCard>
                </div>

                {/* Floating Node 2: Risk Engine - Bottom Right */}
                <div className="absolute -bottom-5 md:right-[20%] translate-x-1/2 group">
                  <GlassCard className="p-6 w-72 bg-white/[0.03] hover:bg-white/[0.08] hover:border-purple-500/40 animate-float border-white/10 transition-all duration-500 rounded-xl" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-5 mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/10">
                        <Activity className="w-6 h-6 text-purple-300" strokeWidth={1} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-wide">Predictive Engine</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-light text-left">
                      Neural forecasting models identifying anomalies before they impact the bottom line.
                    </p>
                  </GlassCard>
                </div>

                {/* Floating Node 3: Content Studio - Top Right */}
                <div className="absolute -top-5 md:right-[20%] translate-x-1/2 group">
                  <GlassCard className="p-6 w-72 bg-white/[0.03] hover:bg-white/[0.08] hover:border-emerald-500/40 animate-float border-white/10 transition-all duration-500 rounded-xl" style={{ animationDelay: '2s' }}>
                    <div className="flex items-center gap-5 mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                        <Feather className="w-6 h-6 text-emerald-300" strokeWidth={1} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-wide">Content Studio</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-light text-left">
                      Automated high-fidelity thought leadership and strategic executive memos.
                    </p>
                  </GlassCard>
                </div>

                {/* Floating Node 4: Agentic Search - Bottom Left */}
                <div className="absolute -bottom-5 md:left-[20%] -translate-x-1/2 group">
                  <GlassCard className="p-6 w-72 bg-white/[0.03] hover:bg-white/[0.08] hover:border-amber-500/40 animate-float border-white/10 transition-all duration-500 rounded-xl" style={{ animationDelay: '1.5s' }}>
                    <div className="flex items-center gap-5 mb-4">
                      <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
                        <Sparkles className="w-6 h-6 text-amber-300" strokeWidth={1} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-wide">Agentic Retrieval</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-light text-left">
                      Dynamic RAG search across verified global sources for maximum situational awareness.
                    </p>
                  </GlassCard>
                </div>
              </div>

              <div className="mt-24">
                <LiquidGlassButton
                  onClick={nextStep}
                  icon={ArrowRight}
                  className="scale-125 shadow-xl shadow-blue-500/10"
                >
                  Enter Command Center
                </LiquidGlassButton>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;