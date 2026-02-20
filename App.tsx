import * as React from 'react';
import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { BulletJournal } from './components/BulletJournal';
import { WeeklyLog } from './components/WeeklyLog';
import { MonthlyLog } from './components/MonthlyLog';
import { FutureLog } from './components/FutureLog';
import { CollectionsView } from './components/CollectionsView';
import { HabitTracker } from './components/HabitTracker';
import { MoodTracker } from './components/MoodTracker';
import { FinanceTracker } from './components/FinanceTracker';
import { GratitudeJournal } from './components/GratitudeJournal';
import { ChatArea } from './components/ChatArea';

import { Source, Folder, SavedItem, UserProfile, BulletJournalState } from './types';

type PageKey = 'inicio' | 'futuro' | 'mensal' | 'semanal' | 'diario' | 'colecoes' | 'habitos' | 'humor' | 'financas' | 'gratidao' | 'chat';

const safeJSONParse = (key: string, defaultValue: any) => {
    try {
        const saved = localStorage.getItem(key);
        if (!saved || saved === 'null') return defaultValue;
        return JSON.parse(saved) || defaultValue;
    } catch (e) { return defaultValue; }
};

const NAV_ITEMS: { key: PageKey; icon: string; label: string }[] = [
    { key: 'inicio', icon: '⌂', label: 'Início' },
    { key: 'futuro', icon: '☐', label: 'Registro Futuro' },
    { key: 'mensal', icon: '▦', label: 'Visão Mensal' },
    { key: 'semanal', icon: '▤', label: 'Registro Semanal' },
    { key: 'diario', icon: '☰', label: 'Registro Diário' },
    { key: 'colecoes', icon: '≡', label: 'Coleções' },
    { key: 'habitos', icon: '↗', label: 'Hábitos' },
    { key: 'humor', icon: '☺', label: 'Humor' },
    { key: 'financas', icon: '$', label: 'Finanças' },
    { key: 'gratidao', icon: '♡', label: 'Gratidão' },
];

function App() {
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState<PageKey>('inicio');

    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        try {
            const saved = localStorage.getItem('barra_user_profile');
            if (!saved || saved === 'null') return null;
            const parsed = JSON.parse(saved);
            if (!parsed || !parsed.name) return null;
            return parsed;
        } catch { return null; }
    });

    const [sources, setSources] = useState<Source[]>(() => safeJSONParse('barra_sources', []));
    const [folders, setFolders] = useState<Folder[]>(() => safeJSONParse('barra_folders', []));
    const [savedItems, setSavedItems] = useState<SavedItem[]>(() => safeJSONParse('barra_saved_items', []));
    const [bujoState, setBujoState] = useState<BulletJournalState>(() => {
        const def = { entries: [], collections: [], habits: [], moods: [], finances: [], gratitude: [] };
        return { ...def, ...safeJSONParse('barra_bujo', def) };
    });

    useEffect(() => { const t = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(t); }, []);

    // Persistence
    useEffect(() => { localStorage.setItem('barra_sources', JSON.stringify(sources)); }, [sources]);
    useEffect(() => { localStorage.setItem('barra_folders', JSON.stringify(folders)); }, [folders]);
    useEffect(() => { localStorage.setItem('barra_saved_items', JSON.stringify(savedItems)); }, [savedItems]);
    useEffect(() => { if (userProfile) localStorage.setItem('barra_user_profile', JSON.stringify(userProfile)); }, [userProfile]);
    useEffect(() => { localStorage.setItem('barra_bujo', JSON.stringify(bujoState)); }, [bujoState]);

    const handleResetApp = () => {
        if (confirm("Tem certeza? Isso apagará todos os seus dados.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    if (loading) return <SplashScreen />;
    if (!userProfile) return <Onboarding onComplete={p => setUserProfile(p)} />;

    const renderPage = () => {
        switch (activePage) {
            case 'inicio': return <Dashboard state={bujoState} userName={userProfile.name} />;
            case 'diario': return <BulletJournal state={bujoState} setState={setBujoState} />;
            case 'semanal': return <WeeklyLog state={bujoState} setState={setBujoState} />;
            case 'mensal': return <MonthlyLog state={bujoState} setState={setBujoState} />;
            case 'futuro': return <FutureLog state={bujoState} setState={setBujoState} />;
            case 'colecoes': return <CollectionsView state={bujoState} setState={setBujoState} />;
            case 'habitos': return <HabitTracker state={bujoState} setState={setBujoState} />;
            case 'humor': return <MoodTracker state={bujoState} setState={setBujoState} />;
            case 'financas': return <FinanceTracker state={bujoState} setState={setBujoState} />;
            case 'gratidao': return <GratitudeJournal state={bujoState} setState={setBujoState} />;
            case 'chat': return <ChatArea sources={sources} userName={userProfile.name} />;
            default: return <Dashboard state={bujoState} userName={userProfile.name} />;
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#fff', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <div style={{
                width: 260, background: '#fff', display: 'flex', flexDirection: 'column',
                borderRight: '1px solid #eee', flexShrink: 0
            }}>
                {/* Logo */}
                <div style={{ padding: '32px 24px 24px' }}>
                    <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1, color: '#000', margin: 0 }}>
                        MEU BULLET
                    </h1>
                    <p style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>{userProfile.name}</p>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = activePage === item.key;
                        return (
                            <button key={item.key} onClick={() => setActivePage(item.key)}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '12px 16px', borderRadius: 12, border: 'none',
                                    background: isActive ? '#111' : 'transparent',
                                    color: isActive ? '#fff' : '#555',
                                    cursor: 'pointer', fontSize: 14, fontWeight: isActive ? 700 : 500,
                                    marginBottom: 2, textAlign: 'left',
                                    transition: 'all 0.15s ease', fontFamily: "'Inter', sans-serif"
                                }}
                                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = '#fafafa'; }}
                                onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span style={{ fontSize: 18, width: 24, textAlign: 'center', opacity: isActive ? 1 : 0.5 }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: '16px 12px', borderTop: '1px solid #f0f0f0' }}>
                    <button onClick={() => setActivePage('chat')}
                        style={{
                            width: '100%', padding: '10px 16px', borderRadius: 10,
                            background: activePage === 'chat' ? '#000' : '#fafafa',
                            color: activePage === 'chat' ? '#fff' : '#888',
                            border: activePage === 'chat' ? 'none' : '1px solid #eee',
                            fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 8,
                            fontFamily: "'Inter', sans-serif"
                        }}>
                        💬 Assistente
                    </button>
                    <button onClick={handleResetApp}
                        style={{
                            width: '100%', padding: '8px', background: 'transparent', color: '#ccc',
                            border: 'none', fontSize: 11, cursor: 'pointer', fontWeight: 600,
                            fontFamily: "'Inter', sans-serif"
                        }}>
                        Redefinir App
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ flex: 1, overflow: 'hidden', background: '#fff' }}>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
