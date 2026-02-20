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
import { ProfileEditor } from './components/ProfileEditor';
import { ChatArea } from './components/ChatArea';

import { Source, Folder, SavedItem, UserProfile, BulletJournalState } from './types';

type PageKey = 'inicio' | 'futuro' | 'mensal' | 'semanal' | 'diario' | 'colecoes' | 'habitos' | 'humor' | 'financas' | 'gratidao' | 'chat' | 'perfil';

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
            case 'perfil': return <ProfileEditor profile={userProfile} onSave={p => { setUserProfile(p); localStorage.setItem('barra_user_profile', JSON.stringify(p)); }} />;
            default: return <Dashboard state={bujoState} userName={userProfile.name} />;
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#fff', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <div style={{
                width: 280,
                background: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                color: '#fff'
            }}>
                {/* Logo & Header */}
                <div style={{ padding: '40px 32px 32px 32px' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, color: '#fff', margin: 0 }}>
                        Bullet Journal
                    </h1>
                    <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>
                        Organize sua vida
                    </p>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '0 16px', overflowY: 'auto' }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = activePage === item.key;
                        return (
                            <button
                                key={item.key}
                                onClick={() => setActivePage(item.key)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    padding: '12px 16px',
                                    borderRadius: 12,
                                    border: 'none',
                                    background: isActive ? '#1e293b' : 'transparent',
                                    color: isActive ? '#fff' : '#94a3b8',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 500,
                                    marginBottom: 4,
                                    textAlign: 'left',
                                    transition: 'all 0.2s ease',
                                    fontFamily: "'Inter', sans-serif"
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.color = '#fff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#94a3b8';
                                    }
                                }}
                            >
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 8,
                                    background: isActive ? '#0f172a' : 'rgba(255, 255, 255, 0.05)',
                                    fontSize: 18
                                }}>
                                    {/* Using simple icons for now, can be replaced by Lucide if needed */}
                                    {item.key === 'inicio' ? '🏠' :
                                        item.key === 'futuro' ? '📅' :
                                            item.key === 'mensal' ? '🗓️' :
                                                item.key === 'semanal' ? '🗒️' :
                                                    item.key === 'diario' ? '📓' :
                                                        item.key === 'colecoes' ? '📑' :
                                                            item.key === 'habitos' ? '📈' :
                                                                item.key === 'humor' ? '😊' :
                                                                    item.key === 'financas' ? '💰' :
                                                                        '❤️'}
                                </div>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer User Info */}
                <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <button
                        onClick={() => setActivePage('perfil')}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: 'none',
                            borderRadius: 12,
                            cursor: 'pointer',
                            color: '#fff',
                            transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 700
                        }}>
                            {userProfile.avatar || userProfile.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{userProfile.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>Ver perfil</div>
                        </div>
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
