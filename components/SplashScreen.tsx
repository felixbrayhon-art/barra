import * as React from 'react';
import { useEffect } from 'react';

export const SplashScreen: React.FC = () => {
  useEffect(() => { console.log("SplashScreen.tsx: Component mounted"); }, []);
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 overflow-hidden font-inter">
      <div className="relative z-10 flex flex-col items-center animate-in fade-in duration-1000">
        {/* Minimalist Logo */}
        <div className="relative mb-6">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">
            MEU <span className="text-zinc-200">BULLET</span>
          </h1>
          <div className="absolute -right-4 -top-1 w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center space-x-1.5 mt-2">
          <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce"></div>
        </div>

        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-8">Minimalist Productivity</p>
      </div>
    </div>
  );
};