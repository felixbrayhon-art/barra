import React, { useState, useRef, useEffect } from 'react';
import { Source } from '../types';
import { generateAudioOverview, decodeAudioData } from '../services/geminiService';

interface AudioPlayerProps {
  sources: Source[];
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ sources }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Initialize AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000 // Match Gemini TTS
    });
    return () => {
      audioContextRef.current?.close();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleGenerate = async () => {
    if (sources.length === 0) return;
    setIsLoading(true);
    setAudioBuffer(null);
    setCurrentTime(0);
    pausedAtRef.current = 0;

    try {
      const base64Audio = await generateAudioOverview(sources);
      if (audioContextRef.current) {
        const buffer = await decodeAudioData(base64Audio, audioContextRef.current);
        setAudioBuffer(buffer);
      }
    } catch (error) {
      console.error("Failed to generate audio:", error);
      alert("Falha ao gerar a aula.");
    } finally {
      setIsLoading(false);
    }
  };

  const play = () => {
    if (!audioContextRef.current || !audioBuffer) return;

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    sourceNodeRef.current = audioContextRef.current.createBufferSource();
    sourceNodeRef.current.buffer = audioBuffer;
    sourceNodeRef.current.connect(audioContextRef.current.destination);
    
    // Start from where we left off
    startTimeRef.current = audioContextRef.current.currentTime - pausedAtRef.current;
    sourceNodeRef.current.start(0, pausedAtRef.current);
    setIsPlaying(true);

    sourceNodeRef.current.onended = () => {
        // Only reset if it naturally ended (not stopped by user pause)
        if (Math.abs(audioContextRef.current!.currentTime - startTimeRef.current - audioBuffer.duration) < 0.1) {
            setIsPlaying(false);
            pausedAtRef.current = 0;
            setCurrentTime(0);
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const updateTime = () => {
        if (!audioContextRef.current) return;
        const now = audioContextRef.current.currentTime;
        const current = now - startTimeRef.current;
        setCurrentTime(Math.min(current, audioBuffer.duration));
        
        if (isPlaying || (sourceNodeRef.current && current < audioBuffer.duration)) {
             animationFrameRef.current = requestAnimationFrame(updateTime);
        }
    };
    updateTime();
  };

  const pause = () => {
    if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
    }
    if (audioContextRef.current) {
        pausedAtRef.current = audioContextRef.current.currentTime - startTimeRef.current;
    }
    setIsPlaying(false);
    cancelAnimationFrame(animationFrameRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 bg-[#0F1115]">
      <div className="max-w-lg w-full text-center space-y-8">
        
        <div className="space-y-3">
            <h2 className="text-5xl font-black text-white tracking-tight">Podcast<span className="text-[#E6FF57]">.</span></h2>
            <p className="text-gray-400 font-medium text-lg">
                Ouça sua aula personalizada sobre "{sources[0]?.title || '...'}"
            </p>
        </div>

        {/* Player Card */}
        <div className="relative w-full aspect-video bg-[#1C1F26] rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden flex items-center justify-center group">
             {/* Vibrant Background */}
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ${isPlaying ? 'opacity-20' : 'opacity-10'}`}></div>
            
            {/* Waveform Bars */}
            <div className="flex items-center justify-center space-x-3 h-32 z-10">
                {[...Array(6)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-4 bg-[#E6FF57] rounded-full transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(230,255,87,0.4)] ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-4 opacity-30'}`}
                        style={{ 
                            height: isPlaying ? `${Math.random() * 80 + 30}px` : '16px',
                            animationDelay: `${i * 0.1}s`
                        }} 
                    />
                ))}
            </div>

            {/* Play/Pause Button Overlay */}
            {audioBuffer && !isLoading && (
                 <div className="absolute bottom-6 right-6 z-20">
                     <button 
                        onClick={isPlaying ? pause : play}
                        className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                     >
                         {isPlaying ? (
                             <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                         ) : (
                             <svg className="w-8 h-8 ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                         )}
                     </button>
                 </div>
            )}
        </div>

        {/* Controls */}
        <div className="space-y-6 bg-[#1C1F26] p-8 rounded-[2rem] shadow-sm border border-white/5">
             {audioBuffer ? (
                 <div className="w-full space-y-3">
                     <div className="flex justify-between text-xs font-black text-gray-500 tracking-wider uppercase">
                         <span>{formatTime(currentTime)}</span>
                         <span>{formatTime(audioBuffer.duration)}</span>
                     </div>
                     <div className="w-full bg-[#0F1115] rounded-full h-4 overflow-hidden cursor-pointer border border-white/5">
                         <div 
                            className="bg-[#E6FF57] h-full rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(230,255,87,0.5)]" 
                            style={{ width: `${(currentTime / audioBuffer.duration) * 100}%` }}
                         />
                     </div>
                 </div>
             ) : (
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || sources.length === 0}
                    className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-3"
                >
                    {isLoading ? (
                         <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <span>GERAR AULA EM ÁUDIO</span>
                    )}
                </button>
             )}

             {sources.length === 0 && (
                 <div className="text-red-400 font-bold text-sm flex items-center justify-center space-x-2">
                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/></svg>
                     <span>Selecione um tópico</span>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};