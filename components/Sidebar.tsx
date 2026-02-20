import * as React from 'react';
import { useState } from 'react';
import { Source, Folder, SavedItem, AppTab, UserProfile } from '../types';
import { generateProjectContent } from '../services/geminiService';

interface SidebarProps {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    sources: Source[];
    setSources: (sources: Source[]) => void;
    folders: Folder[];
    savedItems: SavedItem[];
    userProfile: UserProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    sources,
    setSources,
    userProfile
}) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;
        setIsCreating(true);
        try {
            const content = await generateProjectContent(newProjectName);
            const newProject: Source = {
                id: crypto.randomUUID(),
                title: newProjectName,
                content: content,
                type: 'text',
                createdAt: Date.now()
            };
            setSources([...sources, newProject]);
            setNewProjectName('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    const navItems = [
        { id: AppTab.DIARIO, label: 'Bullet Journal', icon: '📓' },
        { id: AppTab.SEMANAL, label: 'Weekly Log', icon: '📅' },
        { id: AppTab.MENSAL, label: 'Monthly Log', icon: '🗓️' },
        { id: AppTab.FUTURO, label: 'Future Log', icon: '🚀' },
        { id: AppTab.HABITOS, label: 'Habit Tracker', icon: '🎯' },
        { id: AppTab.HUMOR, label: 'Mood Tracker', icon: '✨' },
        { id: AppTab.FINANCAS, label: 'Finance', icon: '💰' },
        { id: AppTab.CHAT, label: 'Assistant', icon: '💬' },
    ];

    return (
        <div className="w-72 bg-white border-r border-zinc-200 flex flex-col h-full flex-shrink-0 z-30 font-inter">
            {/* Header Branding */}
            <div className="p-8 pb-6">
                <div className="flex flex-col space-y-1 mb-8">
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                        MEU <span className="text-indigo-600">BULLET</span>
                    </h1>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Minimalist Productivity</p>
                </div>

                {/* User Profile Mini */}
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">
                        {userProfile?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900 leading-none">{userProfile?.name || 'User'}</span>
                        <span className="text-[10px] text-zinc-500 mt-1">Free Plan</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 no-scrollbar">
                <nav className="space-y-1 mb-10">
                    <p className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Workspace</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                                    ? 'bg-zinc-900 text-white shadow-sm'
                                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                                }`}
                        >
                            <span className="opacity-80">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Projects Section */}
                <div className="space-y-1 mb-10">
                    <div className="px-4 flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Collections</p>
                        <button className="text-zinc-400 hover:text-indigo-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {sources.map((source) => (
                            <button
                                key={source.id}
                                className="w-full text-left px-4 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center space-x-2"
                            >
                                <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                                <span className="truncate">{source.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="New project..."
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
                    />
                    {isCreating && (
                        <div className="absolute right-3 top-2.5">
                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};