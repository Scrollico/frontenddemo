import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isShake, setIsShake] = useState(false);

  const CORRECT_PASSWORD = 'kronos';

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password.toLowerCase() === CORRECT_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1115] relative overflow-hidden font-sans">
      {/* Subtle background — no colored blobs */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F1115] via-[#13171d] to-[#0F1115]" />

      <div className={`relative z-10 w-full max-w-md px-6 ${isShake ? 'animate-shake' : ''}`}>
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-xl flex flex-col items-center">

          {/* Icon — simple, no gradient box */}
          <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.04]">
            <ShieldCheck className="w-7 h-7 text-white/90" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-semibold text-white tracking-tight">AI Business Suite</h1>
          <p className="text-white/50 text-sm mt-1 tracking-wide">Restricted access</p>

          <form onSubmit={handleSubmit} className="w-full mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock
                  className={`w-5 h-5 transition-colors duration-200 ${error ? 'text-red-400/90' : 'text-white/40'}`}
                  strokeWidth={1.5}
                />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Access code"
                className={`w-full bg-white/[0.06] border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  error
                    ? 'border-red-400/40 focus:border-red-400/60 focus:ring-red-400/10'
                    : 'border-white/10 focus:border-white/20 focus:ring-white/10'
                }`}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!password}
              className="w-full bg-white text-[#0F1115] font-medium py-3.5 rounded-xl text-sm hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:opacity-90"
            >
              <span>Unlock</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </form>

          <p className="mt-6 text-[11px] text-white/40 tracking-wide">
            Authorized personnel only · v1.2.0
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};
