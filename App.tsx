import * as React from 'react';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { BulletJournal } from './components/BulletJournal';
import { WeeklyLog } from './components/WeeklyLog';

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

import { Source, AppTab, Folder, SavedItem, UserProfile, BulletJournalState } from './types';

type SimpleTab = 'DIARIO' | 'SEMANAL' | 'CHAT';

function App() {
    const [loading, setLoading] = useState(true);

    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        try {
            const saved = localStorage.getItem('barra_user_profile');
            if (!saved || saved === 'null') return null;
            const parsed = JSON.parse(saved);
            if (!parsed || !parsed.name) return null;
            return parsed;
        } catch (e) {
            return null;
        }
    });

    const [sources, setSources] = useState<Source[]>(() => safeJSONParse('barra_sources', []));
    const [folders, setFolders] = useState<Folder[]>(() => safeJSONParse('barra_folders', []));
    const [savedItems, setSavedItems] = useState<SavedItem[]>(() => safeJSONParse('barra_saved_items', []));
    const [bujoState, setBujoState] = useState<BulletJournalState>(() => {
        const defaultState = { entries: [], collections: [], habits: [], moods: [], finances: [], gratitude: [] };
        const saved = safeJSONParse('barra_bujo', defaultState);
        return { ...defaultState, ...saved };
    });

    const [activeTab, setActiveTab] = useState<SimpleTab>('DIARIO');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Persistence
    useEffect(() => { localStorage.setItem('barra_sources', JSON.stringify(sources)); }, [sources]);
    useEffect(() => { localStorage.setItem('barra_folders', JSON.stringify(folders)); }, [folders]);
    useEffect(() => { localStorage.setItem('barra_saved_items', JSON.stringify(savedItems)); }, [savedItems]);
    useEffect(() => { if (userProfile) localStorage.setItem('barra_user_profile', JSON.stringify(userProfile)); }, [userProfile]);
    useEffect(() => { localStorage.setItem('barra_bujo', JSON.stringify(bujoState)); }, [bujoState]);

    const handleProfileCreate = (profile: UserProfile) => setUserProfile(profile);

    const handleAddSource = (source: Source) => setSources(prev => [source, ...prev]);
    const handleRemoveSource = (id: string) => setSources(prev => prev.filter(s => s.id !== id));

    const handleCreateFolder = (name: string): string => {
        const newFolder: Folder = { id: crypto.randomUUID(), name, createdAt: Date.now() };
        setFolders(prev => [...prev, newFolder]);
        return newFolder.id;
    };

    const handleSaveItem = (item: Omit<SavedItem, 'id' | 'createdAt'>) => {
        const newItem: SavedItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
        setSavedItems(prev => [newItem, ...prev]);
    };

    const handleLoadItem = (item: SavedItem) => { };
    const handleDeleteItem = (id: string) => {
        if (confirm("Excluir este item?")) setSavedItems(prev => prev.filter(i => i.id !== id));
    };
    const handleDeleteFolder = (id: string) => {
        if (confirm("Excluir pasta?")) {
            setFolders(prev => prev.filter(f => f.id !== id));
            setSavedItems(prev => prev.filter(i => i.folderId !== id));
        }
    };

    const handleResetApp = () => {
        if (confirm("Tem certeza? Isso apagará todos os seus dados.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    if (loading) return <SplashScreen />;
    if (!userProfile) return <Onboarding onComplete={handleProfileCreate} />;

    const tabs: { key: SimpleTab; label: string }[] = [
        { key: 'DIARIO', label: '• Diário' },
        { key: 'SEMANAL', label: '▪ Semanal' },
        { key: 'CHAT', label: '◦ Assistente' },
    ];

    return (
        <div style={{
            display: 'flex', height: '100vh', background: '#fff', overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
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

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Tab Bar */}
                <div style={{
                    display: 'flex', gap: 4, padding: '16px 48px',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '8px 20px', borderRadius: 8, border: 'none',
                                background: activeTab === tab.key ? '#000' : 'transparent',
                                color: activeTab === tab.key ? '#fff' : '#aaa',
                                fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <main style={{ flex: 1, overflow: 'hidden', background: '#fff' }}>
                    {activeTab === 'DIARIO' && <BulletJournal state={bujoState} setState={setBujoState} />}
                    {activeTab === 'SEMANAL' && <WeeklyLog state={bujoState} setState={setBujoState} />}
                    {activeTab === 'CHAT' && <ChatArea sources={sources} userName={userProfile.name} />}
                </main>
            </div>
        </div>
    );
}

export default App;
