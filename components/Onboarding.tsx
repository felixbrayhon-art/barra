import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

// Icon paths for avatars
const ICON_AVATARS = [
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", // User
    "M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM19 4a1 1 0 00-1-1h-1v1a1 1 0 002 0V4z", // ID Card / Professional
    "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", // Scientist
    "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", // Star
    "M13 10V3L4 14h7v7l9-11h-7z", // Bolt
    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M3.343 15.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" // Idea
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(ICON_AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({
        name: name.trim(),
        avatar: selectedAvatar // Now saving the SVG path data
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0F1115] flex flex-col items-center justify-center z-40 font-poppins animate-in fade-in duration-500">
      <div className="w-full max-w-md p-8">
        
        <div className="text-center mb-10">
            <div className="inline-block mb-6 relative">
                 <div className="absolute inset-0 bg-[#E6FF57] blur-2xl opacity-20 rounded-full"></div>
                 <svg viewBox="0 0 24 24" className="w-24 h-24 relative z-10" shapeRendering="crispEdges">
                    <rect x="11" y="3" width="2" height="12" fill="#D4A373" />
                    <rect x="13" y="3" width="4" height="3" fill="#EF4444" />
                    <rect x="13" y="7" width="6" height="6" fill="#FFFFFF" />
                    <rect x="5" y="8" width="6" height="5" fill="#E5E7EB" />
                    <rect x="3" y="15" width="18" height="2" fill="#8B4513" />
                    <rect x="4" y="17" width="16" height="2" fill="#A0522D" />
                    <rect x="6" y="19" width="12" height="1" fill="#5D2E0E" />
                 </svg>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Bem-vindo a Bordo</h1>
            <p className="text-gray-400">Configure seu perfil para começar a jornada.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-[#1C1F26] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
            
            <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Escolha seu Ícone</label>
                <div className="flex flex-wrap justify-center gap-3">
                    {ICON_AVATARS.map((path, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedAvatar(path)}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${selectedAvatar === path ? 'bg-[#E6FF57] text-black scale-110 shadow-lg shadow-yellow-400/20' : 'bg-[#0F1115] text-gray-500 hover:bg-white/10'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Como devemos te chamar?</label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome..."
                    className="w-full bg-[#0F1115] border-2 border-transparent focus:border-[#E6FF57] rounded-xl p-4 text-white font-bold text-lg outline-none transition-colors placeholder:text-gray-700"
                    autoFocus
                />
            </div>

            <button 
                type="submit"
                disabled={!name.trim()}
                className="w-full py-4 bg-[#E6FF57] text-black font-black text-lg rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/10"
            >
                INICIAR ESTUDOS
            </button>
        </form>

      </div>
    </div>
  );
};
