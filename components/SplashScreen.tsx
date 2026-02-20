import * as React from 'react';
import { useEffect } from 'react';

export const SplashScreen: React.FC = () => {
  useEffect(() => { console.log("SplashScreen.tsx: Component mounted"); }, []);
  return (
    <div className="fixed inset-0 bg-[#0F1115] flex flex-col items-center justify-center z-50 overflow-hidden font-poppins">

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-[#E6FF57] rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Pixel Art Boat Logo (Large) */}
        <div className="relative w-48 h-48 mb-8 animate-[bounce_3s_infinite_ease-in-out]">
          {/* Clouds/Wind */}
          <div className="absolute top-4 right-0 w-8 h-2 bg-white/10 rounded-full animate-[pulse_3s_infinite]"></div>
          <div className="absolute top-10 left-0 w-12 h-2 bg-white/5 rounded-full animate-[pulse_4s_infinite]"></div>

          <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" shapeRendering="crispEdges">
            {/* Mast */}
            <rect x="11" y="2" width="2" height="13" fill="#D4A373" />

            {/* Flag (Red with motion) */}
            <rect x="13" y="2" width="5" height="3" fill="#EF4444" />

            {/* Main Sail */}
            <rect x="13" y="6" width="7" height="8" fill="#FFFFFF" />
            <rect x="13" y="6" width="2" height="8" fill="#F3F4F6" /> {/* Shading */}

            {/* Front Sail */}
            <rect x="4" y="8" width="7" height="6" fill="#E5E7EB" />
            <rect x="10" y="8" width="1" height="6" fill="#D1D5DB" /> {/* Shading */}

            {/* Hull details */}
            <rect x="2" y="15" width="20" height="2" fill="#8B4513" />
            <rect x="3" y="17" width="18" height="2" fill="#A0522D" />
            <rect x="5" y="19" width="14" height="2" fill="#5D2E0E" />

            {/* Water line */}
            <rect x="0" y="21" width="24" height="3" fill="#3B82F6" opacity="0.2" />
          </svg>
        </div>

        {/* Loading Text */}
        <div className="space-y-2 text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Barra<span className="text-[#E6FF57]">.</span>
          </h1>
          <div className="flex items-center justify-center space-x-1 mt-4">
            <span className="w-2 h-2 bg-[#E6FF57] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-[#E6FF57] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-[#E6FF57] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">Navegando no conhecimento</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-[#E6FF57]/10 font-black text-6xl tracking-widest opacity-20 select-none pointer-events-none blur-sm">
        DEEP DIVE
      </div>
    </div>
  );
};