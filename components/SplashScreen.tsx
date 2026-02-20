import * as React from 'react';
import { useEffect } from 'react';

export const SplashScreen: React.FC = () => {
  useEffect(() => { console.log("SplashScreen.tsx: Component mounted"); }, []);
  return (
    <div className="fixed inset-0 bg-[#F7F9FC] flex flex-col items-center justify-center z-50 overflow-hidden font-poppins">

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFF9C4] rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8F5E9] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Sun Icon (Logo) */}
        <div className="relative w-32 h-32 mb-8 animate-[bounce_4s_infinite_ease-in-out]">
          <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xl">
            <circle cx="12" cy="12" r="5" fill="#FFB74D" />
            <g stroke="#FFB74D" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
          </svg>
        </div>

        {/* Loading Text */}
        <div className="space-y-4 text-center">
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter">
            Bullet da <span className="text-[#FFB74D]">RA</span>
          </h1>

          <div className="flex items-center justify-center space-x-2 mt-6">
            <span className="w-3 h-3 bg-[#FFB74D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-3 h-3 bg-[#81C784] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
            <span className="w-3 h-3 bg-[#FFF176] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em] mt-4">Organizando sua jornada</p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 text-gray-200 font-black text-4xl tracking-widest opacity-30 select-none pointer-events-none uppercase">
        Productivity
      </div>
    </div>
  );
};