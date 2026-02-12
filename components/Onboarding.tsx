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

      <div className={`relative w-full max-w-5xl px-8 transition-all duration-1000 ease-smooth ${isExiting ? 'scale-95 opacity-0 -translate-y-8' : 'scale-100 opacity-100'}`}>
        {/* Main Content Area */}
        <div className="min-h-[600px] flex flex-col justify-center items-center text-center relative z-10 py-12">

          {/* Step 0: Welcome - Executive Style */}
          {step === 0 && (
            <div className="animate-fade-in flex flex-col items-center gap-10 max-w-2xl">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-3xl animate-float group relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-125 group-hover:scale-150 transition-transform duration-1000"></div>
                {/* Liquid Sheen */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <LayoutDashboard className="w-12 h-12 text-white relative z-10 opacity-90" strokeWidth={0.5} />
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-display">
                  AI Business <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Suite</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                  The <span className="text-white font-medium">ultimate intelligence layer</span> for the modern executive. <br />
                  Data velocity, redefined by Agentic AI.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2 opacity-30">
                  <div className="w-8 h-[1px] bg-white/20" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white px-2">Powered by Scrolli</span>
                  <div className="w-8 h-[1px] bg-white/20" />
                </div>
              </div>

              <div className="mt-8">
                <LiquidGlassButton
                  onClick={nextStep}
                  icon={ArrowRight}
                  className="scale-105"
                >
                  Initialize Experience
                </LiquidGlassButton>
              </div>
            </div>
          )}

          {/* Step 1: Core Pillars - Expanded Radial Layout */}
          {step === 1 && (
            <div className="animate-fade-in w-full flex flex-col items-center">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Intelligence Ecosystem</h2>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <p className="text-gray-500 font-bold text-xs tracking-[0.3em] uppercase">Neural Mapping Active</p>
                </div>
              </div>

              {/* Central Hub with Expanded Spokes */}
              <div className="relative w-full min-h-[450px] md:h-[400px] mt-8 flex items-center justify-center">
                {/* Mobile Grid Layout (2-column) */}
                <div className="grid grid-cols-2 md:block gap-4 md:gap-0 h-full w-full relative z-20">
                  {/* Market Intelligence */}
                  <div className="relative md:absolute md:-top-5 md:left-[20%] md:-translate-x-1/2 group flex justify-center">
                    <GlassCard className="p-3 md:p-6 w-full md:w-72 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 md:animate-float border-white/10 transition-all duration-500 rounded-xl" style={{ animationDelay: '0s' }}>
                      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-5 mb-2 md:mb-4">
                        <div className="p-2 md:p-3 bg-white/5 rounded-xl border border-white/20 shadow-xl mb-2 md:mb-0">
                          <Globe className="w-4 h-4 md:w-6 md:h-6 text-white/70" strokeWidth={1} />
                        </div>
                        <h3 className="text-xs md:text-xl font-bold text-white tracking-tight md:tracking-wide text-center md:text-left">Market Intel</h3>
                      </div>
                      <p className="hidden md:block text-xs md:text-sm text-gray-400 leading-relaxed font-light text-left">
                        Real-time sector heatmaps grounded in Nasdaq data.
                      </p>
                    </GlassCard>
                  </div>

                  {/* Content Studio */}
                  <div className="relative md:absolute md:-top-5 md:right-[20%] md:translate-x-1/2 group flex justify-center">
                    <GlassCard className="p-3 md:p-6 w-full md:w-72 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 md:animate-float border-white/10 transition-all duration-500 rounded-xl" style={{ animationDelay: '2s' }}>
                      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-5 mb-2 md:mb-4">
                        <div className="p-2 md:p-3 bg-white/5 rounded-xl border border-white/20 shadow-xl mb-2 md:mb-0">
                          <Feather className="w-4 h-4 md:w-6 md:h-6 text-white/70" strokeWidth={1} />
                        </div>
                        <h3 className="text-xs md:text-xl font-bold text-white tracking-tight md:tracking-wide text-center md:text-left">Content Studio</h3>
                      </div>
                      <p className="hidden md:block text-xs md:text-sm text-gray-400 leading-relaxed font-light text-left">
                        Automated high-fidelity strategic executive memos.
                      </p>
                    </GlassCard>
                  </div>

                  {/* Predictive Engine */}
                  <div className="relative md:absolute md:-bottom-5 md:right-[20%] md:translate-x-1/2 group flex justify-center">
                    <GlassCard className="p-3 md:p-6 w-full md:w-72 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 md:animate-float border-white/10 transition-all duration-500 rounded-xl" style={{ animationDelay: '1s' }}>
                      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-5 mb-2 md:mb-4">
                        <div className="p-2 md:p-3 bg-white/5 rounded-xl border border-white/20 shadow-xl mb-2 md:mb-0">
                          <Activity className="w-4 h-4 md:w-6 md:h-6 text-white/70" strokeWidth={1} />
                        </div>
                        <h3 className="text-xs md:text-xl font-bold text-white tracking-tight md:tracking-wide text-center md:text-left">Predictive</h3>
                      </div>
                      <p className="hidden md:block text-xs md:text-sm text-gray-400 leading-relaxed font-light text-left">
                        Neural forecasting models identifying market anomalies.
                      </p>
                    </GlassCard>
                  </div>

                  {/* Agentic Retrieval */}
                  <div className="relative md:absolute md:-bottom-5 md:left-[20%] md:-translate-x-1/2 group flex justify-center">
                    <GlassCard className="p-3 md:p-6 w-full md:w-72 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 md:animate-float border-white/10 transition-all duration-500 rounded-xl" style={{ animationDelay: '1.5s' }}>
                      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-5 mb-2 md:mb-4">
                        <div className="p-2 md:p-3 bg-white/5 rounded-xl border border-white/20 shadow-xl mb-2 md:mb-0">
                          <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white/70" strokeWidth={1} />
                        </div>
                        <h3 className="text-xs md:text-xl font-bold text-white tracking-tight md:tracking-wide text-center md:text-left">Agentic</h3>
                      </div>
                      <p className="hidden md:block text-xs md:text-sm text-gray-400 leading-relaxed font-light text-left">
                        Dynamic RAG search across verified global sources.
                      </p>
                    </GlassCard>
                  </div>
                </div>

                {/* Central Brain Icon Overlay - Desktop Only */}
                <div className="absolute inset-0 z-30 pointer-events-none hidden md:flex items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full bg-white/5 border border-white/20 backdrop-blur-3xl flex items-center justify-center animate-icon-breathe shadow-[0_0_80px_rgba(255,255,255,0.15)] group pointer-events-auto">
                    <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full animate-pulse"></div>
                    <BrainCircuit className="w-12 h-12 text-white opacity-90 relative z-10" strokeWidth={0.5} />
                    <div className="absolute inset-0 -m-6 border border-white/10 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-0 -m-12 border border-white/5 rounded-full animate-spin-slow-reverse"></div>
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <LiquidGlassButton
                  onClick={nextStep}
                  icon={ArrowRight}
                  className="scale-110 shadow-xl shadow-blue-500/10"
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