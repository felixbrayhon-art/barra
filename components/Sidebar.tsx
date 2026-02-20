
import React, { useState } from 'react';
import { Source, Folder, SavedItem, AppTab, UserProfile } from '../types';
import { generateProjectContent } from '../services/geminiService';

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
            const content = await generateProjectContent(topicInput);

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
            alert("Erro ao criar projeto. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const getIconForType = (type: AppTab | 'EBOOK') => {
        switch (type) {
            case AppTab.DIARIO: return <span>📓</span>;
            case AppTab.COLECOES: return <span>📁</span>;
            case AppTab.HABITOS: return <span>🎯</span>;
            default: return <span>📁</span>;
        }
    }

    return (
        <div className="w-80 bg-white border-r border-black/5 flex flex-col h-full flex-shrink-0 z-30">
            <div className="p-8 pb-4">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-[#FFF9C4] rounded-xl flex items-center justify-center shadow-md relative overflow-hidden group border border-[#FBC02D]/20">
                        <div className="absolute inset-0 bg-[#FB8C00] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FB8C00]" fill="currentColor">
                            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-black">
                        Bullet da <span className="text-[#FB8C00]">Raíssa</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3 pl-1 mt-3">
                    <div className="w-8 h-8 rounded-full bg-[#C8E6C9] text-[#43A047] flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={userProfile.avatar} />
                        </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">{userProfile.name}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-8 custom-scrollbar">
                <div>
                    <div className="flex items-center justify-between mt-2 mb-4">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projetos & Contextos</h2>
                        <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded-full border border-black/5">{sources.length}</span>
                    </div>

                    <div className="space-y-3">
                        {sources.map((source) => (
                            <div key={source.id} className="group relative bg-white hover:bg-gray-50 border border-black/5 rounded-[1.5rem] p-4 transition-all duration-200 cursor-default shadow-sm hover:shadow-md">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-500">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z" /></svg>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{source.title}</p>
                                            <p className="text-[10px] font-medium text-gray-400 truncate uppercase tracking-tighter">Planejador</p>
                                        </div>
                                    </div>
                                    <button onClick={() => onRemoveSource(source.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isAdding && (
                        <div className="bg-[#FFF9C4] shadow-xl shadow-yellow-200/50 rounded-[2rem] p-5 animate-in fade-in slide-in-from-bottom-4 mt-3 border border-[#FBC02D]/20">
                            <input
                                className="w-full text-lg font-bold bg-transparent border-b-2 border-black/5 pb-2 mb-4 focus:outline-none focus:border-[#FB8C00]/30 placeholder:text-[#FB8C00]/30 text-black px-1"
                                placeholder="Ex: Trabalho, Viagem..."
                                value={topicInput}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateTopic()}
                                onChange={(e) => setTopicInput(e.target.value)}
                                disabled={isLoading}
                            />

                            <div className="flex justify-end space-x-2">
                                <button onClick={() => setIsAdding(false)} disabled={isLoading} className="text-xs font-bold text-[#FB8C00]/70 hover:text-[#FB8C00] px-3 py-2 transition-colors">Cancelar</button>
                                <button onClick={handleCreateTopic} disabled={!topicInput || isLoading} className="text-xs font-bold bg-[#FB8C00] text-white px-5 py-2.5 rounded-full hover:scale-105 disabled:opacity-50 transition-all shadow-lg">
                                    {isLoading ? '...' : 'Criar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between mt-2 mb-4">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Arquivo</h2>
                    </div>
                    <div className="space-y-2">
                        {folders.map(folder => (
                            <div key={folder.id} className="bg-white border border-black/5 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                                <span className="text-sm font-bold text-gray-700">{folder.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-black/5 bg-gray-50 space-y-3">
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding}
                    className="group w-full flex items-center justify-center space-x-3 py-4 px-4 bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#2E7D32] rounded-[1.5rem] transition-all duration-300 font-black text-xs uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] shadow-sm border border-[#43A047]/10"
                >
                    <div className="bg-white text-[#43A047] p-1.5 rounded-full shadow-sm"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" /></svg></div>
                    <span>Novo Projeto</span>
                </button>
            </div>
        </div>
    );
};