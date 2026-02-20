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

const safeJSONParse = (key: string, defaultValue: any) => {
    try {
        const saved = localStorage.getItem(key);
        if (!saved || saved === 'null') return defaultValue;
        return JSON.parse(saved) || defaultValue;
    } catch (e) {
        console.error(`Error parsing ${key}:`, e);
        return defaultValue;
    }
};

import { Source, AppTab, Folder, SavedItem, UserProfile, SyllabusTopic, StudySession, MockExam, ExamDate, WeeklyTask, BulletJournalState } from './types';

function App() {
    console.log("App.tsx: Rendering App component");
    const [loading, setLoading] = useState(true);

    // -- USER PROFILE --
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        try {
            const saved = localStorage.getItem('barra_user_profile');
            if (!saved || saved === 'null') return null;
            const parsed = JSON.parse(saved);
            if (!parsed || !parsed.name) return null; // Ensure name exists
            return parsed;
        } catch (e) {
            console.error("App.tsx: Error loading user profile:", e);
            return null;
        }
    });

    // -- EXISTING DATA --
    const [sources, setSources] = useState<Source[]>(() => safeJSONParse('barra_sources', []));
    const [folders, setFolders] = useState<Folder[]>(() => safeJSONParse('barra_folders', []));
    const [savedItems, setSavedItems] = useState<SavedItem[]>(() => safeJSONParse('barra_saved_items', []));

    // -- NEW DATA STATES --
    const [topics, setTopics] = useState<SyllabusTopic[]>(() => safeJSONParse('barra_syllabus', []));
    const [sessions, setSessions] = useState<StudySession[]>(() => safeJSONParse('barra_sessions', []));
    const [mockExams, setMockExams] = useState<MockExam[]>(() => safeJSONParse('barra_mocks', []));
    const [examDates, setExamDates] = useState<ExamDate[]>(() => safeJSONParse('barra_exams', []));
    const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(() => safeJSONParse('barra_tasks', []));
    const [bujoState, setBujoState] = useState<BulletJournalState>(() => {
        const defaultState = { entries: [], collections: [], habits: [], moods: [], finances: [], gratitude: [] };
        const saved = safeJSONParse('barra_bujo', defaultState);
        return { ...defaultState, ...saved };
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

    console.log("App.tsx: State - loading:", loading, "userProfile:", !!userProfile, "activeTab:", activeTab);

    const getTabClass = (tab: AppTab) => `
    relative px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all duration-200 flex items-center whitespace-nowrap
    ${activeTab === tab
            ? 'bg-zinc-900 text-white shadow-md shadow-zinc-200'
            : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}
  `;

    if (loading) return <SplashScreen />;
    if (!userProfile) return <Onboarding onComplete={handleProfileCreate} />;

    return (
        <div className="flex h-screen bg-white overflow-hidden font-inter animate-in fade-in duration-500">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sources={sources}
                setSources={setSources}
                folders={folders}
                savedItems={savedItems}
                userProfile={userProfile}
            />

            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Minimalist Top Navigation */}
                <header className="h-20 border-b border-zinc-100 flex items-center px-10 justify-between bg-white z-20">
                    <div className="flex items-center space-x-1 no-scrollbar overflow-x-auto">
                        <button onClick={() => setActiveTab(AppTab.DIARIO)} className={getTabClass(AppTab.DIARIO)}>Diário</button>
                        <button onClick={() => setActiveTab(AppTab.SEMANAL)} className={getTabClass(AppTab.SEMANAL)}>Semana</button>
                        <button onClick={() => setActiveTab(AppTab.MENSAL)} className={getTabClass(AppTab.MENSAL)}>Mês</button>
                        <button onClick={() => setActiveTab(AppTab.FUTURO)} className={getTabClass(AppTab.FUTURO)}>Futuro</button>
                        <div className="w-px h-4 bg-zinc-200 mx-2"></div>
                        <button onClick={() => setActiveTab(AppTab.HABITOS)} className={getTabClass(AppTab.HABITOS)}>Hábitos</button>
                        <button onClick={() => setActiveTab(AppTab.HUMOR)} className={getTabClass(AppTab.HUMOR)}>Humor</button>
                        <button onClick={() => setActiveTab(AppTab.FINANCAS)} className={getTabClass(AppTab.FINANCAS)}>Finanças</button>
                        <div className="w-px h-4 bg-zinc-200 mx-2"></div>
                        <button onClick={() => setActiveTab(AppTab.CHAT)} className={getTabClass(AppTab.CHAT)}>Assistant</button>
                    </div>

                    <button onClick={handleResetApp} className="p-2 text-zinc-300 hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </header>

                <main className="flex-1 relative overflow-hidden bg-zinc-50/30">
                    {/* Main Content Area */}
                    <div className="h-full w-full overflow-hidden">
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
