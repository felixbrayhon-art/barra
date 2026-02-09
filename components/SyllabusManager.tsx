
import React, { useState } from 'react';
import { SyllabusTopic, Source, AppTab } from '../types';
import { verticalizeSyllabus, generateTopicContent, generateEbookContent } from '../services/geminiService';

interface SyllabusManagerProps {
  topics: SyllabusTopic[];
  setTopics: (topics: SyllabusTopic[]) => void;
  onAddSource: (source: Source) => void;
  onSaveItem: (item: any) => void;
}

export const SyllabusManager: React.FC<SyllabusManagerProps> = ({ topics, setTopics, onAddSource, onSaveItem }) => {
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingTopicId, setLoadingTopicId] = useState<string | null>(null);

  const handleVerticalize = async () => {
      if (!rawText.trim()) return;
      setIsProcessing(true);
      try {
          const newTopics = await verticalizeSyllabus(rawText);
          setTopics([...topics, ...newTopics]);
          setRawText('');
      } catch (e) {
          alert("Erro ao processar edital.");
      } finally {
          setIsProcessing(false);
      }
  };

  const handleStudy = async (topic: SyllabusTopic) => {
      setLoadingTopicId(topic.id);
      try {
          // 1. Generate content for Active Study (Source)
          const content = await generateTopicContent(topic.name);
          const newSource: Source = {
              id: crypto.randomUUID(),
              title: topic.name,
              content: content,
              type: 'text',
              createdAt: Date.now()
          };
          onAddSource(newSource);
          alert(`Tópico "${topic.name}" adicionado à sua lista de estudos ativos!`);
          
          // Update last revision
          setTopics(topics.map(t => t.id === topic.id ? {...t, lastRevision: Date.now(), studied: true} : t));

      } catch (e) {
          alert("Erro ao gerar aula.");
      } finally {
          setLoadingTopicId(null);
      }
  };

  const handleGenerateEbook = async (topic: SyllabusTopic) => {
      if(!confirm(`Gerar E-book completo para "${topic.name}"? Isso pode levar alguns segundos.`)) return;
      setLoadingTopicId(topic.id);
      try {
          const ebookContent = await generateEbookContent(topic.name);
          onSaveItem({
              title: `E-BOOK: ${topic.name}`,
              type: 'EBOOK', // Using string literal as extended type
              data: ebookContent,
              folderId: '' // Root or let App handle default
          });
          alert("E-book gerado e salvo na sua Biblioteca!");
      } catch(e) {
          alert("Erro ao gerar e-book.");
      } finally {
          setLoadingTopicId(null);
      }
  };

  const updateMastery = (id: string, level: number) => {
      setTopics(topics.map(t => t.id === id ? {...t, masteryLevel: level} : t));
  };

  const deleteTopic = (id: string) => {
      if(confirm("Remover tópico?")) {
          setTopics(topics.filter(t => t.id !== id));
      }
  };

  // Group by Category
  const grouped = topics.reduce((acc, topic) => {
      (acc[topic.category] = acc[topic.category] || []).push(topic);
      return acc;
  }, {} as Record<string, SyllabusTopic[]>);

  return (
    <div className="flex flex-col h-full bg-[#0F1115] overflow-y-auto p-6 md:p-10 pb-32">
         <h2 className="text-3xl font-black text-white mb-2">Edital Verticalizado<span className="text-[#E6FF57]">.</span></h2>
         <p className="text-gray-400 mb-8">Cole seu edital para a IA organizar seus estudos.</p>

         {/* INPUT AREA */}
         <div className="bg-[#1C1F26] border border-white/5 rounded-[2rem] p-6 mb-8 shadow-lg">
             <textarea 
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#E6FF57] min-h-[100px]"
                placeholder="Cole aqui o conteúdo programático do edital..."
                value={rawText}
                onChange={e => setRawText(e.target.value)}
             />
             <div className="flex justify-end mt-4">
                 <button 
                    onClick={handleVerticalize}
                    disabled={isProcessing || !rawText.trim()}
                    className="bg-[#E6FF57] text-black px-6 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                 >
                    {isProcessing ? 'Processando...' : 'VERTICALIZAR COM IA'}
                    {!isProcessing && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
                 </button>
             </div>
         </div>

         {/* LIST */}
         <div className="space-y-6">
             {Object.keys(grouped).length === 0 && (
                 <div className="text-center py-10 opacity-50">
                     <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                     <p>Nenhum edital cadastrado.</p>
                 </div>
             )}

             {Object.entries(grouped).map(([category, items]) => (
                 <div key={category} className="bg-[#1C1F26] border border-white/5 rounded-[1.5rem] overflow-hidden">
                     <div className="bg-white/5 px-6 py-4 flex justify-between items-center">
                         <h3 className="font-bold text-white text-lg">{category}</h3>
                         <span className="text-xs font-mono text-gray-400">{items.filter(i => i.studied).length}/{items.length} Concluídos</span>
                     </div>
                     <div className="p-2">
                         {items.map(topic => (
                             <div key={topic.id} className="group flex flex-col md:flex-row md:items-center justify-between p-3 hover:bg-[#0F1115] rounded-xl transition-colors border border-transparent hover:border-white/5">
                                 <div className="flex-1 mb-2 md:mb-0">
                                     <div className="flex items-center gap-2">
                                         {topic.studied && <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                         <span className={`text-sm font-medium ${topic.studied ? 'text-gray-400' : 'text-gray-200'}`}>{topic.name}</span>
                                     </div>
                                 </div>

                                 <div className="flex items-center gap-3">
                                     {/* Mastery Slider */}
                                     <div className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded-lg">
                                         <span className="text-[10px] text-gray-500">DOMÍNIO</span>
                                         <input 
                                            type="range" min="0" max="100" step="10"
                                            value={topic.masteryLevel}
                                            onChange={(e) => updateMastery(topic.id, parseInt(e.target.value))}
                                            className="w-20 accent-[#E6FF57]"
                                         />
                                         <span className={`text-xs font-bold w-8 text-right ${topic.masteryLevel > 70 ? 'text-green-400' : 'text-gray-400'}`}>{topic.masteryLevel}%</span>
                                     </div>

                                     <button 
                                        onClick={() => handleStudy(topic)}
                                        disabled={!!loadingTopicId}
                                        className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                                        title="Estudar Agora (Cria Tópico Ativo)"
                                     >
                                         {loadingTopicId === topic.id ? '...' : 'ESTUDAR'}
                                     </button>

                                     <button 
                                        onClick={() => handleGenerateEbook(topic)}
                                        disabled={!!loadingTopicId}
                                        className="p-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-colors text-xs font-bold"
                                        title="Gerar E-Book na Biblioteca"
                                     >
                                         E-BOOK
                                     </button>

                                     <button onClick={() => deleteTopic(topic.id)} className="p-2 text-gray-600 hover:text-red-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             ))}
         </div>
    </div>
  );
};
