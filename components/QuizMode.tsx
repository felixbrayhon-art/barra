import React, { useState, useEffect } from 'react';
import { Source, QuizQuestion, Folder, SavedItem, AppTab } from '../types';
import { generateQuiz } from '../services/geminiService';
import { SaveModal } from './SaveModal';

interface QuizModeProps {
  sources: Source[];
  initialData?: any;
  folders?: Folder[];
  onCreateFolder?: (name: string) => string;
  onSaveItem?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ 
    sources, initialData, folders = [], onCreateFolder, onSaveItem 
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
        setQuestions(initialData);
        setCurrentIndex(0);
        setScore(0);
        setQuizFinished(false);
        setSelectedOption(null);
        setShowResult(false);
    } else {
        setQuestions([]);
    }
  }, [initialData]);

  const handleGenerate = async () => {
    if (sources.length === 0) return;
    setIsLoading(true);
    try {
      const generatedQuiz = await generateQuiz(sources);
      setQuestions(generatedQuiz);
      setCurrentIndex(0);
      setScore(0);
      setQuizFinished(false);
      setSelectedOption(null);
      setShowResult(false);
    } catch (e) {
      alert("Erro ao gerar quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; // Prevent changing answer
    setSelectedOption(option);
    setShowResult(true);
    
    if (option === questions[currentIndex].correctAnswer) {
        setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowResult(false);
    } else {
        setQuizFinished(true);
    }
  };

  const handleSaveConfirm = (title: string, folderId: string) => {
      if (onSaveItem) {
          onSaveItem({
              title,
              folderId,
              type: AppTab.QUIZ,
              data: questions
          });
      }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-[#0F1115] overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full text-center space-y-8">
            <h2 className="text-5xl font-black text-white tracking-tight">Quiz Time<span className="text-[#60A5FA]">.</span></h2>
            <p className="text-gray-400 font-medium text-lg">
                Teste seu conhecimento sobre "{sources[0]?.title || 'a matéria'}".
            </p>
            <div className="p-10 bg-[#1C1F26] rounded-[3rem] border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
                <svg className="w-20 h-20 text-[#60A5FA]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 5H17C17 3.34 15.66 2 14 2H10C8.34 2 7 3.34 7 5H5C3.9 5 3 5.9 3 7V8C3 10.55 4.92 12.63 7.39 12.94C8.09 14.83 9.91 16.19 12 16.19C14.09 16.19 15.91 14.83 16.61 12.94C19.08 12.63 21 10.55 21 8V7C21 5.9 20.1 5 19 5ZM5 8V7H7V8C7 9.1 6.1 10 5 10V8ZM19 10C17.9 10 17 9.1 17 8V7H19V8V10Z" />
                    <path d="M10 18H14V20H10V18Z" />
                    <path d="M6 22H18V20H6V22Z" />
                </svg>
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading || sources.length === 0}
                className="w-full py-6 bg-[#60A5FA] text-white rounded-[2rem] font-black text-xl hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_30px_rgba(96,165,250,0.3)] flex items-center justify-center space-x-3"
            >
                {isLoading ? (
                     <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <span>INICIAR PROVA</span>
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

  if (quizFinished) {
      const percentage = Math.round((score / questions.length) * 100);
      let message = "Continue estudando!";
      if (percentage >= 80) message = "Você é um gênio!";
      else if (percentage >= 50) message = "Mandou bem!";

      return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-[#0F1115] overflow-y-auto custom-scrollbar">
            <div className="max-w-md w-full bg-[#1C1F26] rounded-[3rem] shadow-2xl p-10 text-center border border-white/5">
                <div className="flex justify-center mb-6">
                    {percentage >= 50 ? (
                        <svg className="w-24 h-24 text-[#60A5FA]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                    ) : (
                        <svg className="w-24 h-24 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM12 17L7 12H10V8H14V12H17L12 17Z" /></svg>
                    )}
                </div>
                <h2 className="text-4xl font-black text-white mb-2">Finalizado!</h2>
                <p className="text-gray-400 font-medium mb-10">{message}</p>
                
                <div className="bg-[#0F1115] rounded-[2rem] p-8 mb-10 border border-white/5">
                    <span className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Sua Pontuação</span>
                    <span className="text-6xl font-black text-[#60A5FA]">{score}<span className="text-2xl text-gray-600">/{questions.length}</span></span>
                </div>

                <div className="space-y-3">
                    {onSaveItem && (
                         <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-4 bg-[#60A5FA] text-white rounded-[1.5rem] font-black hover:bg-blue-600 transition-all shadow-lg"
                        >
                            SALVAR RESULTADO
                        </button>
                    )}
                    <button 
                        onClick={() => setQuestions([])}
                        className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black hover:bg-gray-200 transition-all shadow-lg"
                    >
                        NOVO QUIZ
                    </button>
                </div>
            </div>
            <SaveModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                folders={folders}
                onCreateFolder={onCreateFolder || (() => "")}
                onSave={handleSaveConfirm}
            />
        </div>
      )
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col h-full bg-[#0F1115] overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32">
      <div className="max-w-3xl mx-auto w-full">
        <SaveModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                folders={folders}
                onCreateFolder={onCreateFolder || (() => "")}
                onSave={handleSaveConfirm}
        />

        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-3">
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest bg-[#1C1F26] px-3 py-1 rounded-full">Questão</span>
                <span className="text-3xl font-black text-white">{currentIndex + 1}<span className="text-gray-600 text-xl">/{questions.length}</span></span>
            </div>
            <div className="flex items-center gap-2">
                {onSaveItem && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 bg-[#1C1F26] text-white rounded-full border border-white/10 hover:text-[#60A5FA]"
                        title="Salvar Quiz"
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    </button>
                )}
                <div className="text-xs font-black text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                    SCORE: {score}
                </div>
            </div>
        </div>

        <div className="flex-1">
            <h3 className="text-3xl font-bold text-white mb-10 leading-snug">{currentQ.question}</h3>
            
            <div className="space-y-4">
                {currentQ.options.map((option, idx) => {
                    let buttonClass = "bg-[#1C1F26] border border-white/5 text-gray-300 hover:border-white/20 hover:bg-[#252932]";
                    if (selectedOption) {
                        if (option === currentQ.correctAnswer) {
                            buttonClass = "bg-green-500 text-black border-green-500 shadow-lg shadow-green-900/20";
                        } else if (option === selectedOption) {
                            buttonClass = "bg-red-500 text-white border-red-500 shadow-lg shadow-red-900/20";
                        } else {
                            buttonClass = "bg-[#1C1F26] text-gray-600 border-transparent opacity-50";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            disabled={!!selectedOption}
                            className={`w-full text-left p-6 rounded-[1.5rem] font-bold transition-all duration-200 text-lg ${buttonClass}`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>

            {/* Explanation Section */}
            {selectedOption && (
                <div className="mt-8 bg-[#1C1F26] border border-white/10 rounded-[1.5rem] p-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 mb-3">
                         <div className={`w-2 h-2 rounded-full ${selectedOption === currentQ.correctAnswer ? 'bg-green-500' : 'bg-red-500'}`}></div>
                         <h4 className="text-sm font-black text-white uppercase tracking-wider">Explicação</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        {currentQ.explanation || "Sem explicação disponível."}
                    </p>
                </div>
            )}
        </div>

        <div className="h-24 flex items-center justify-end mt-6">
            {showResult && (
                <button 
                    onClick={handleNext}
                    className="px-10 py-4 bg-white text-black rounded-full font-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform flex items-center space-x-3"
                >
                    <span>{currentIndex === questions.length - 1 ? 'RESULTADO' : 'PRÓXIMA'}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};