import React, { useState } from 'react';
import { Source, Folder, SavedItem, AppTab, UserProfile } from '../types';
import { generateTopicContent } from '../services/geminiService';

interface SidebarProps {
  userProfile: UserProfile;
  sources: Source[];
  folders?: Folder[];
  savedItems?: SavedItem[];
  onAddSource: (source: Source) => void;
  onRemoveSource: (id: string) => void;
  onResetApp?: () => void;
  onCreateFolder?: (name: string) => string;
  onLoadItem?: (item: SavedItem) => void;
  onDeleteItem?: (id: string) => void;
  onDeleteFolder?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  userProfile,
  sources, folders = [], savedItems = [], 
  onAddSource, onRemoveSource, onResetApp,
  onCreateFolder, onLoadItem, onDeleteItem, onDeleteFolder
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);

  const handleCreateTopic = async () => {
    if (!topicInput.trim()) return;
    setIsLoading(true);

    try {
        const content = await generateTopicContent(topicInput);

        const newSource: Source = {
            id: crypto.randomUUID(),
            title: topicInput,
            content: content,
            type: 'text',
            createdAt: Date.now(),
        };
        
        onAddSource(newSource);
        setTopicInput('');
        setIsAdding(false);
    } catch (e) {
        alert("Erro ao criar aula. Tente novamente.");
    } finally {
        setIsLoading(false);
    }
  };

  const getIconForType = (type: AppTab | 'EBOOK') => {
      if (type === 'EBOOK') {
          return (
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          );
      }
      switch(type) {
          case AppTab.SUMMARY: return (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          );
          case AppTab.FLASHCARDS: return (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          );
          case AppTab.QUIZ: return (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          );
          default: return <div className="w-3 h-3 bg-gray-500 rounded-full" />
      }
  }

  return (
    <div className="w-80 bg-[#0F1115] border-r border-white/5 flex flex-col h-full flex-shrink-0 z-30">
      <div className="p-8 pb-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-[#1C1F26] rounded-xl flex items-center justify-center border border-white/5 shadow-lg relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
             {/* Pixel Art Boat Logo */}
             <svg viewBox="0 0 24 24" className="w-8 h-8" shapeRendering="crispEdges">
                <rect x="11" y="3" width="2" height="12" fill="#D4A373" />
                <rect x="13" y="3" width="4" height="3" fill="#EF4444" />
                <rect x="13" y="7" width="6" height="6" fill="#FFFFFF" />
                <rect x="5" y="8" width="6" height="5" fill="#E5E7EB" />
                <rect x="3" y="15" width="18" height="2" fill="#8B4513" />
                <rect x="4" y="17" width="16" height="2" fill="#A0522D" />
                <rect x="6" y="19" width="12" height="1" fill="#5D2E0E" />
             </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Barra<span className="text-[#E6FF57]">.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 pl-1 mt-3">
             {/* User Icon SVG Rendered from path data */}
            <div className="w-8 h-8 rounded-full bg-[#E6FF57] text-black flex items-center justify-center">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={userProfile.avatar} />
                 </svg>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">{userProfile.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 custom-scrollbar">
        
        {/* TOPICS SECTION */}
        <div>
            <div className="flex items-center justify-between mt-2 mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tópicos Ativos</h2>
                <span className="text-[10px] bg-[#1C1F26] text-gray-300 font-bold px-2 py-1 rounded-full border border-white/5">{sources.length}</span>
            </div>

            <div className="space-y-3">
            {sources.map((source) => (
                <div key={source.id} className="group relative bg-[#1C1F26] hover:bg-[#252932] border border-white/5 rounded-[1.5rem] p-4 transition-all duration-200 cursor-default shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#2D313A] text-gray-300">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z" /></svg>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{source.title}</p>
                        <p className="text-[10px] font-medium text-gray-500 truncate uppercase">IA Generated</p>
                    </div>
                    </div>
                    <button 
                    onClick={() => onRemoveSource(source.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all"
                    >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                </div>
            ))}
            
            {sources.length === 0 && !isAdding && (
                <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-[2rem] bg-[#1C1F26]/30">
                   <p className="text-xs text-gray-500 px-4">Adicione um tópico para começar a gerar conteúdo.</p>
                </div>
            )}
            </div>

            {isAdding && (
            <div className="bg-[#E6FF57] shadow-xl shadow-yellow-400/10 rounded-[2rem] p-5 animate-in fade-in slide-in-from-bottom-4 mt-3">
                <p className="text-[10px] font-black text-black/60 uppercase mb-2 tracking-wide">O que vamos aprender?</p>
                <input 
                className="w-full text-lg font-bold bg-transparent border-b-2 border-black/10 pb-2 mb-4 focus:outline-none focus:border-black/30 placeholder:text-black/30 text-black" 
                placeholder="Ex: Mitologia..."
                value={topicInput}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTopic()}
                onChange={(e) => setTopicInput(e.target.value)}
                disabled={isLoading}
                />
                
                <div className="flex justify-end space-x-2">
                <button onClick={() => setIsAdding(false)} disabled={isLoading} className="text-xs font-bold text-black/50 hover:text-black px-3 py-2">Cancelar</button>
                <button onClick={handleCreateTopic} disabled={!topicInput || isLoading} className="text-xs font-bold bg-black text-[#E6FF57] px-5 py-2.5 rounded-full hover:scale-105 disabled:opacity-50 transition-all shadow-lg flex items-center space-x-2">
                    {isLoading ? <span>...</span> : <span>Criar</span>}
                </button>
                </div>
            </div>
            )}
        </div>

        {/* LIBRARY SECTION */}
        <div>
            <div className="flex items-center justify-between mt-2 mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Biblioteca</h2>
            </div>
            
            <div className="space-y-2">
                {folders.map(folder => {
                    const itemsInFolder = savedItems.filter(i => i.folderId === folder.id);
                    const isOpen = openFolderId === folder.id;

                    return (
                        <div key={folder.id} className="bg-[#1C1F26] border border-white/5 rounded-2xl overflow-hidden">
                            <div 
                                onClick={() => setOpenFolderId(isOpen ? null : folder.id)}
                                className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className={`w-4 h-4 text-[#E6FF57] transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    <span className="text-sm font-bold text-gray-200">{folder.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-500 font-mono">{itemsInFolder.length}</span>
                                    {onDeleteFolder && (
                                        <button onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }} className="text-gray-600 hover:text-red-400 p-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {isOpen && (
                                <div className="bg-[#14161B] border-t border-white/5 p-2 space-y-1">
                                    {itemsInFolder.length === 0 && <p className="text-[10px] text-gray-600 text-center py-2">Pasta vazia</p>}
                                    {itemsInFolder.map(item => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => onLoadItem && onLoadItem(item)}
                                            className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-2 overflow-hidden">
                                                <div className="text-gray-500">{getIconForType(item.type)}</div>
                                                <span className="text-xs text-gray-300 truncate">{item.title}</span>
                                            </div>
                                            {onDeleteItem && (
                                                <button onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400">
                                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
                {folders.length === 0 && (
                    <p className="text-xs text-gray-600 italic text-center py-4">Nenhuma pasta criada.</p>
                )}
            </div>
        </div>

      </div>

      <div className="p-6 border-t border-white/5 bg-[#14161B] space-y-3">
        <button 
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            className="group w-full flex items-center justify-center space-x-3 py-4 px-4 bg-white hover:bg-gray-100 text-black rounded-[1.5rem] transition-all duration-200 font-black text-sm disabled:opacity-50 hover:scale-[1.02] shadow-lg"
        >
            <div className="bg-black text-white p-1 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span>NOVO TÓPICO</span>
        </button>

        {onResetApp && (
            <button 
                onClick={onResetApp}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#1C1F26] hover:bg-red-900/20 text-gray-500 hover:text-red-400 rounded-[1.5rem] transition-all duration-200 font-bold text-xs border border-white/5"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span>SAIR / RESETAR</span>
            </button>
        )}
      </div>
    </div>
  );
};