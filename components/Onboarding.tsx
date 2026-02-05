import React, { useState, useEffect } from 'react';
import { ChevronRight, LayoutDashboard, Radar, AudioLines, Activity, Feather, CheckCircle2, Lightbulb, Mic, ArrowRight, BrainCircuit, Globe, Sparkles } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { AnimatedIcon } from './ui/AnimatedIcon';

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
    <div className={`fixed inset-0 bg-[#374151] flex items-center justify-center z-50 transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Overlay - Matches Dashboard Dark Mode */}
      <div className="absolute inset-0 bg-[#374151]" />
      
      {/* Premium Background Ambience - Subtle Monochrome Fog */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] animate-pulse-soft" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className={`relative w-full max-w-5xl px-6 transition-transform duration-700 ease-smooth ${isExiting ? 'scale-95 translate-y-4' : 'scale-100'}`}>
        {/* Card Background */}
        <GlassCard className="min-h-[600px] flex flex-col p-0 overflow-hidden shadow-2xl border border-white/10 backdrop-blur-3xl relative bg-black/20">
          
          {/* Content Area - Using justify-between to push button to bottom evenly */}
          <div className="flex-1 flex flex-col items-center justify-between p-8 md:p-16 text-center relative z-10 transition-all duration-500 ease-smooth">
            
            {/* Step 0: Welcome - Minimalist High-End */}
            {step === 0 && (
              <>
                  <div className="flex flex-col items-center gap-10 w-full animate-fade-in max-w-3xl mt-10">
                    <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-xl animate-float group">
                       <div className="relative">
                          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full group-hover:bg-white/30 transition-all duration-1000"></div>
                          <LayoutDashboard className="w-12 h-12 text-white relative z-10 opacity-90" strokeWidth={0.75} />
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 font-display">
                        AI Business Suite
                      </h1>
                      <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
                      <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                        Powered by <a href="https://business.scrolli.co" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-blue-300 transition-colors border-b border-white/30 hover:border-blue-300 relative group/link">Scrolli
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/link:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Visit Scrolli</span>
                        </a>. <br/>
                        The ultimate executive assistant for strategic decision-makers.
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={nextStep}
                    className="mt-8 group px-10 py-4 bg-white hover:bg-gray-200 text-black rounded-full font-bold text-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,250,0.15)] flex items-center gap-3 border border-transparent hover:scale-105 capitalize"
                  >
                    Initialize System
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
              </>
            )}

            {/* Step 1: Core Pillars - Monochrome Glassy Concept */}
            {step === 1 && (
              <>
                  <div className="flex flex-col items-center w-full animate-fade-in mt-4">
                    <div className="mb-12 text-center">
                       <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Core Intelligence Modules</h2>
                       <p className="text-gray-400 font-light text-sm tracking-wide uppercase">Calibrating your executive suite</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                       {/* Box 1: Market Intelligence */}
                       <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 cursor-default overflow-hidden">
                           <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-all duration-700"></div>
                           
                           {/* Icon Container - Glassy Monochrome */}
                           <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:bg-white/10 transition-colors shadow-lg backdrop-blur-sm">
                               <Globe className="w-6 h-6 opacity-80" strokeWidth={1} />
                           </div>
                           
                           <h3 className="text-lg font-bold text-white mb-3 tracking-wide">Market Watch</h3>
                           <p className="text-sm text-gray-300 leading-relaxed font-light">
                               Real-time global sector heatmaps and competitor tracking powered by live data streams.
                           </p>
                       </div>

                       {/* Box 2: Predictive Engine */}
                       <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 cursor-default overflow-hidden" style={{ transitionDelay: '100ms' }}>
                           <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-all duration-700"></div>
                           
                           <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:bg-white/10 transition-colors shadow-lg backdrop-blur-sm">
                               <BrainCircuit className="w-6 h-6 opacity-80" strokeWidth={1} />
                           </div>
                           
                           <h3 className="text-lg font-bold text-white mb-3 tracking-wide">Predictive AI</h3>
                           <p className="text-sm text-gray-300 leading-relaxed font-light">
                               Forecasting models that anticipate market shifts and identify "Black Swan" risks early.
                           </p>
                       </div>

                       {/* Box 3: Content Studio */}
                       <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 cursor-default overflow-hidden" style={{ transitionDelay: '200ms' }}>
                           <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-all duration-700"></div>
                           
                           <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:bg-white/10 transition-colors shadow-lg backdrop-blur-sm">
                               <Feather className="w-6 h-6 opacity-80" strokeWidth={1} />
                           </div>
                           
                           <h3 className="text-lg font-bold text-white mb-3 tracking-wide">Content Studio</h3>
                           <p className="text-sm text-gray-300 leading-relaxed font-light">
                               Automated generation of LinkedIn thought leadership, memos, and keynote decks.
                           </p>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col items-center">
                        <button 
                            onClick={nextStep} 
                            className="group relative px-12 py-5 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 bg-white text-black shadow-2xl hover:bg-gray-200 border border-white/20 capitalize"
                        >
                            <div className="relative flex items-center gap-3 font-bold text-sm z-10">
                                Enter Dashboard
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                            </div>
                        </button>
                  </div>
              </>
            )}
          </div>
          
          {/* Progress Indicator - Updated for 2 steps */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
             <div 
               className="h-full bg-white transition-all duration-1000 ease-smooth shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
               style={{ width: `${((step + 1) / 2) * 100}%` }}
             />
          </div>

        </GlassCard>
      </div>
    </div>
  );
};

export default Onboarding;