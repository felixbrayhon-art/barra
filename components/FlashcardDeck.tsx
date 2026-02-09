import React, { useState, useEffect } from 'react';
import { Source, Flashcard, Folder, SavedItem, AppTab } from '../types';
import { generateFlashcards } from '../services/geminiService';
import { SaveModal } from './SaveModal';

interface FlashcardDeckProps {
  sources: Source[];
  initialData?: any;
  folders?: Folder[];
  onCreateFolder?: (name: string) => string;
  onSaveItem?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ 
    sources, initialData, folders = [], onCreateFolder, onSaveItem 
}) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
        setCards(initialData);
        setCurrentIndex(0);
        setIsFlipped(false);
    } else {
        setCards([]);
    }
  }, [initialData]);

  const handleGenerate = async () => {
    if (sources.length === 0) return;
    setIsLoading(true);
    try {
      const generatedCards = await generateFlashcards(sources);
      setCards(generatedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (e) {
      alert("Erro ao gerar flashcards.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSaveConfirm = (title: string, folderId: string) => {
      if (onSaveItem) {
          onSaveItem({
              title,
              folderId,
              type: AppTab.FLASHCARDS,
              data: cards
          });
      }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 bg-[#0F1115]">
        <div className="max-w-md w-full text-center space-y-8">
            <h2 className="text-5xl font-black text-white tracking-tight">Flashcards<span className="text-[#E6FF57]">.</span></h2>
            <p className="text-gray-400 font-medium text-lg">
                Memorização ativa para o tópico "{sources[0]?.title || 'atual'}".
            </p>
            <div className="p-10 bg-[#1C1F26] rounded-[3rem] border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
                <svg className="w-20 h-20 text-[#E6FF57]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading || sources.length === 0}
                className="w-full py-6 bg-[#E6FF57] text-black rounded-[2rem] font-black text-xl hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_30px_rgba(230,255,87,0.2)] flex items-center justify-center space-x-3"
            >
                {isLoading ? (
                     <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <span>GERAR CARDS</span>
                )}
            </button>
             {sources.length === 0 && (
                 <div className="text-red-400 font-bold text-sm flex items-center justify-center space-x-2">
                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/></svg>
                     <span>Crie um tópico primeiro</span>
                 </div>
             )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-full p-6 md:p-12 bg-[#0F1115]">
      <SaveModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            folders={folders}
            onCreateFolder={onCreateFolder || (() => "")}
            onSave={handleSaveConfirm}
      />
      
      <div className="w-full max-w-2xl flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black text-white">Deck</h2>
        <div className="flex gap-2">
            {onSaveItem && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#1C1F26] p-2 rounded-full border border-white/10 text-white hover:text-[#E6FF57]"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                </button>
            )}
            <div className="bg-[#1C1F26] px-5 py-2 rounded-full border border-white/10 text-sm font-bold text-white shadow-sm">
                {currentIndex + 1} <span className="text-gray-500">/</span> {cards.length}
            </div>
        </div>
      </div>

      <div className="w-full max-w-2xl h-[450px] perspective-1000 relative mb-12 group cursor-pointer" onClick={handleFlip}>
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-[#1C1F26] border border-white/5 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center hover:border-white/20 transition-colors">
                <span className="text-xs font-black text-[#E6FF57] uppercase tracking-[0.2em] mb-8 bg-[#E6FF57]/10 px-4 py-2 rounded-full">Pergunta</span>
                <p className="text-3xl font-bold text-white leading-snug">{cards[currentIndex].front}</p>
                <span className="absolute bottom-10 text-xs font-bold text-gray-600 uppercase tracking-widest">Toque para revelar</span>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#E6FF57] text-black rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center">
                <span className="text-xs font-black text-black/50 uppercase tracking-[0.2em] mb-8 border border-black/10 px-4 py-2 rounded-full">Resposta</span>
                <p className="text-2xl font-bold text-black leading-relaxed">{cards[currentIndex].back}</p>
            </div>
        </div>
      </div>

      <div className="flex items-center space-x-6 pb-10">
        <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="w-16 h-16 bg-[#1C1F26] border border-white/10 rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white disabled:opacity-30 disabled:hover:bg-[#1C1F26] disabled:hover:text-white transition-all"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button 
            onClick={() => { setCards([]); setIsFlipped(false); setCurrentIndex(0); }}
            className="px-8 py-4 text-sm font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
        >
            Reiniciar
        </button>

        <button 
            onClick={handleNext} 
            disabled={currentIndex === cards.length - 1}
            className="w-16 h-16 bg-[#E6FF57] text-black rounded-full flex items-center justify-center hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-[0_0_20px_rgba(230,255,87,0.3)]"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};