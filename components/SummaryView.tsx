import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Source, Folder, SavedItem, AppTab } from '../types';
import { generateSummary } from '../services/geminiService';
import { SaveModal } from './SaveModal';

interface SummaryViewProps {
  sources: Source[];
  initialData?: any; // To load saved summary
  folders?: Folder[];
  onCreateFolder?: (name: string) => string;
  onSaveItem?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ 
    sources, initialData, folders = [], onCreateFolder, onSaveItem 
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
      if (initialData && typeof initialData === 'string') {
          setSummary(initialData);
      } else {
          setSummary('');
      }
  }, [initialData]);

  const handleGenerate = async () => {
    if (sources.length === 0) return;
    setIsLoading(true);
    try {
      const result = await generateSummary(sources);
      setSummary(result);
    } catch (e) {
      alert("Erro ao gerar resumo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(summary);
      alert("Copiado para a área de transferência!");
  };

  const handleSaveConfirm = (title: string, folderId: string) => {
      if (onSaveItem) {
          onSaveItem({
              title,
              folderId,
              type: AppTab.SUMMARY,
              data: summary
          });
      }
  };

  if (!summary && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 bg-[#0F1115]">
        <div className="max-w-md w-full text-center space-y-8">
            <h2 className="text-5xl font-black text-white tracking-tight">Resumo<span className="text-orange-400">.</span></h2>
            <p className="text-gray-400 font-medium text-lg">
                Sintetize o conteúdo de "{sources[0]?.title || 'seus tópicos'}" em segundos.
            </p>
            <div className="p-10 bg-[#1C1F26] rounded-[3rem] border border-white/5 flex items-center justify-center mb-8 shadow-2xl group">
                <svg className="w-20 h-20 text-orange-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
                </svg>
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading || sources.length === 0}
                className="w-full py-6 bg-orange-400 text-black rounded-[2rem] font-black text-xl hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_30px_rgba(251,146,60,0.3)] flex items-center justify-center space-x-3"
            >
                {isLoading ? (
                     <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <span>GERAR RESUMO INTELIGENTE</span>
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
    <div className="flex flex-col h-full bg-[#0F1115] relative p-6 md:p-12">
        <SaveModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            folders={folders}
            onCreateFolder={onCreateFolder || (() => "")}
            onSave={handleSaveConfirm}
        />

        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <span className="bg-orange-400 text-black px-3 py-1 rounded-md text-sm">IA</span>
                Resumo
            </h2>
            <div className="flex gap-2">
                <button 
                    onClick={() => setSummary('')}
                    className="p-3 bg-[#1C1F26] text-white rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/10"
                    title="Apagar e Voltar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                
                {onSaveItem && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="p-3 bg-[#1C1F26] text-white rounded-full hover:bg-[#E6FF57] hover:text-black transition-all border border-white/10"
                        title="Salvar na Biblioteca"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    </button>
                )}

                <button 
                    onClick={handleCopy}
                    className="p-3 bg-[#1C1F26] text-white rounded-full hover:bg-orange-400 hover:text-black transition-all border border-white/10"
                    title="Copiar Texto"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                </button>
            </div>
        </div>

        {isLoading ? (
             <div className="flex-1 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 animate-pulse">Sintetizando informações...</p>
                 </div>
             </div>
        ) : (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-[#1C1F26] border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl prose prose-invert max-w-none">
                     <ReactMarkdown 
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-3xl font-black text-white border-b border-white/10 pb-4 mb-6" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-orange-400 mt-8 mb-4 flex items-center gap-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-6 space-y-2 text-gray-300" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1 marker:text-orange-400" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-white bg-white/5 px-1 rounded" {...props} />,
                            p: ({node, ...props}) => <p className="leading-relaxed text-gray-300 mb-4" {...props} />
                        }}
                    >
                        {summary}
                    </ReactMarkdown>
                </div>
            </div>
        )}
    </div>
  );
};