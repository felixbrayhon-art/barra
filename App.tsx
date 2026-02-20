import * as React from 'react';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { BulletJournal } from './components/BulletJournal';
import { WeeklyLog } from './components/WeeklyLog';
import { MonthlyLog } from './components/MonthlyLog';
import { HabitTracker } from './components/HabitTracker';
import { CollectionsView } from './components/CollectionsView';
import { MoodTracker } from './components/MoodTracker';
import { FinanceTracker } from './components/FinanceTracker';
import { GratitudeJournal } from './components/GratitudeJournal';
import { FutureLog } from './components/FutureLog';

import { Source, AppTab, Folder, SavedItem, UserProfile, SyllabusTopic, StudySession, MockExam, ExamDate, WeeklyTask, BulletJournalState } from './types';

function App() {
    const [loading, setLoading] = useState(false);

    // -- USER PROFILE --
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        try { return JSON.parse(localStorage.getItem('barra_user_profile') || 'null'); } catch (e) { return null; }
    });

    // -- EXISTING DATA --
    const [sources, setSources] = useState<Source[]>(() => {
        try { return JSON.parse(localStorage.getItem('barra_sources') || '[]'); } catch (e) { return []; }
    });
    const [folders, setFolders] = useState<Folder[]>(() => {
        try { return JSON.parse(localStorage.getItem('barra_folders') || '[]'); } catch (e) { return []; }
    });
    const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
        try { return JSON.parse(localStorage.getItem('barra_saved_items') || '[]'); } catch (e) { return []; }
    });

    // -- NEW DATA STATES --
    const [topics, setTopics] = useState<SyllabusTopic[]>(() => {
        try { return JSON.parse(localStorage.getItem('barra_syllabus') || '[]'); } catch (e) { return []; }
    });
    const [sessions, setSessions] = useState<StudySession[]>(() => {
        try { return JSON.parse(localStorage.getItem('barra_sessions') || '[]'); } catch (e) { return []; }
    });
    const [mockExams, setMockExams] = useState<MockExam[]>(() => {
        try { return JSON.parse(localStorage.getItem('barra_mocks') || '[]'); } catch (e) { return []; }
    });
    const [examDates, setExamDates] = useState<ExamDate[]>(() => {
        try { return JSON.parse(localStorage.getItem('barra_exams') || '[]'); } catch (e) { return []; }
    });
    const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(() => {
        try { return JSON.parse(localStorage.getItem('barra_tasks') || '[]'); } catch (e) { return []; }
    });
    const [bujoState, setBujoState] = useState<BulletJournalState>(() => {
        const defaultState = { entries: [], collections: [], habits: [], moods: [], finances: [], gratitude: [] };
        try {
            const saved = localStorage.getItem('barra_bujo');
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...defaultState, ...parsed };
            }
            return defaultState;
        } catch (e) {
            return defaultState;
        }
    });

    const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DIARIO); // Default to Diario
    const [loadedContent, setLoadedContent] = useState<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    // Persistence
    useEffect(() => { localStorage.setItem('barra_sources', JSON.stringify(sources)); }, [sources]);
    useEffect(() => { localStorage.setItem('barra_folders', JSON.stringify(folders)); }, [folders]);
    useEffect(() => { localStorage.setItem('barra_saved_items', JSON.stringify(savedItems)); }, [savedItems]);
    useEffect(() => { if (userProfile) localStorage.setItem('barra_user_profile', JSON.stringify(userProfile)); }, [userProfile]);

    // New Persistence
    useEffect(() => { localStorage.setItem('barra_syllabus', JSON.stringify(topics)); }, [topics]);
    useEffect(() => { localStorage.setItem('barra_sessions', JSON.stringify(sessions)); }, [sessions]);
    useEffect(() => { localStorage.setItem('barra_mocks', JSON.stringify(mockExams)); }, [mockExams]);
    useEffect(() => { localStorage.setItem('barra_exams', JSON.stringify(examDates)); }, [examDates]);
    useEffect(() => { localStorage.setItem('barra_tasks', JSON.stringify(weeklyTasks)); }, [weeklyTasks]);
    useEffect(() => { localStorage.setItem('barra_bujo', JSON.stringify(bujoState)); }, [bujoState]);

    // Handlers
    const handleProfileCreate = (profile: UserProfile) => {
        setUserProfile(profile);
    };

    const handleAddSource = (source: Source) => {
        setSources((prev) => [source, ...prev]);
    };

    const handleRemoveSource = (id: string) => {
        setSources((prev) => prev.filter((s) => s.id !== id));
    };

    const handleCreateFolder = (name: string): string => {
        const newFolder: Folder = { id: crypto.randomUUID(), name, createdAt: Date.now() };
        setFolders(prev => [...prev, newFolder]);
        return newFolder.id;
    };

    const handleSaveItem = (item: Omit<SavedItem, 'id' | 'createdAt'>) => {
        const newItem: SavedItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
        setSavedItems(prev => [newItem, ...prev]);
        // If it's an EBOOK or standard save, we notify user.
        if (item.type !== 'EBOOK') {
            alert("Salvo com sucesso!");
        }
    };

    const handleLoadItem = (item: SavedItem) => {
        setLoadedContent(item.data);
        if (item.type === 'EBOOK') {
            setActiveTab(AppTab.DIARIO); // Fallback to Diario for legacy saves
        } else {
            setActiveTab(item.type as AppTab);
        }
    };

    const handleDeleteItem = (id: string) => {
        if (confirm("Excluir este item?")) {
            setSavedItems(prev => prev.filter(i => i.id !== id));
        }
    };

    const handleDeleteFolder = (id: string) => {
        if (confirm("Excluir pasta e todos os itens dentro?")) {
            setFolders(prev => prev.filter(f => f.id !== id));
            setSavedItems(prev => prev.filter(i => i.folderId !== id));
        }
    };

    const handleSessionComplete = (duration: number) => {
        setSessions([...sessions, { id: crypto.randomUUID(), date: Date.now(), durationSeconds: duration }]);
    };

    const handleResetApp = () => {
        if (confirm("Tem certeza? Isso apagará todos os seus dados e perfil.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const getTabClass = (tab: AppTab) => `
    relative px-4 py-2 text-xs font-black rounded-[1rem] transition-all duration-300 flex items-center space-x-2 whitespace-nowrap
    ${activeTab === tab
            ? 'bg-[#FFF9C4] text-[#FB8C00] shadow-xl shadow-yellow-100/50 scale-105 border border-[#FBC02D]/30'
            : 'text-gray-400 hover:text-black hover:bg-black/5'}
  `;

    if (loading) return <SplashScreen />;
    if (!userProfile) return <Onboarding onComplete={handleProfileCreate} />;

    return (
        <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-poppins animate-in fade-in duration-700">
            <Sidebar
                userProfile={userProfile}
                sources={sources}
                folders={folders}
                savedItems={savedItems}
                onAddSource={handleAddSource}
                onRemoveSource={handleRemoveSource}
                onResetApp={handleResetApp}
                onCreateFolder={handleCreateFolder}
                onLoadItem={handleLoadItem}
                onDeleteItem={handleDeleteItem}
                onDeleteFolder={handleDeleteFolder}
            />

            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Scrollable Horizontal Tabs */}
                <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                    <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-[2rem] shadow-xl pointer-events-auto inline-flex border border-black/5 overflow-x-auto max-w-full no-scrollbar gap-1">
                        {/* BULLET JOURNAL NAVIGATION */}
                        <button onClick={() => setActiveTab(AppTab.DIARIO)} className={getTabClass(AppTab.DIARIO)}>
                            <span>📓 Diário</span>
                        </button>
                        <button onClick={() => setActiveTab(AppTab.SEMANAL)} className={getTabClass(AppTab.SEMANAL)}>
                            <span>📅 Semanal</span>
                        </button>
                        <button onClick={() => setActiveTab(AppTab.MENSAL)} className={getTabClass(AppTab.MENSAL)}>
                            <span>📅 Mensal</span>
                        </button>
                        <button onClick={() => setActiveTab(AppTab.FUTURO)} className={getTabClass(AppTab.FUTURO)}>
                            <span>📅 Futuro</span>
                        </button>
                        <button onClick={() => setActiveTab(AppTab.COLECOES)} className={getTabClass(AppTab.COLECOES)}>
                            <span>📁 Coleções</span>
                        </button>

                        <div className="w-px h-6 bg-black/10 mx-1"></div>

                        <button onClick={() => setActiveTab(AppTab.HABITOS)} className={getTabClass(AppTab.HABITOS)}>
                            <span>🎯 Hábitos</span>
                        </button>
                        <button onClick={() => setActiveTab(AppTab.HUMOR)} className={getTabClass(AppTab.HUMOR)}>
                            <span>😊 Humor</span>
                        </button>
                        <button onClick={() => setActiveTab(AppTab.FINANCAS)} className={getTabClass(AppTab.FINANCAS)}>
                            <span>💰 Finanças</span>
                        </button>
                        <button onClick={() => setActiveTab(AppTab.GRATIDAO)} className={getTabClass(AppTab.GRATIDAO)}>
                            <span>🤍 Gratidão</span>
                        </button>

                        <div className="w-px h-6 bg-black/10 mx-1"></div>

                        <button onClick={() => { setActiveTab(AppTab.CHAT); setLoadedContent(null); }} className={getTabClass(AppTab.CHAT)}>
                            <span>💬 Assistente</span>
                        </button>
                    </div>
                </div>

                <main className="flex-1 relative overflow-hidden bg-[#FAFBFC] pt-24">
                    <div className={`w-full bg-white rounded-tl-[3.5rem] h-full overflow-hidden border-t border-l border-black/5 shadow-2xl`}>
                        {activeTab === AppTab.CHAT && <ChatArea sources={sources} userName={userProfile.name} />}
                        {activeTab === AppTab.DIARIO && <BulletJournal state={bujoState} setState={setBujoState} />}
                        {activeTab === AppTab.SEMANAL && <WeeklyLog state={bujoState} setState={setBujoState} />}
                        {activeTab === AppTab.MENSAL && <MonthlyLog state={bujoState} setState={setBujoState} />}
                        {activeTab === AppTab.FUTURO && <FutureLog state={bujoState} setState={setBujoState} />}
                        {activeTab === AppTab.COLECOES && <CollectionsView state={bujoState} setState={setBujoState} />}
                        {activeTab === AppTab.HABITOS && <HabitTracker state={bujoState} setState={setBujoState} />}
                        {activeTab === AppTab.HUMOR && <MoodTracker state={bujoState} setState={setBujoState} />}
                        {activeTab === AppTab.FINANCAS && <FinanceTracker state={bujoState} setState={setBujoState} />}
                        {activeTab === AppTab.GRATIDAO && <GratitudeJournal state={bujoState} setState={setBujoState} />}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
