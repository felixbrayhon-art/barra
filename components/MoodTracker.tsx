import * as React from 'react';
import { BulletJournalState, MoodEntry } from '../types';

interface MoodTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

const MOODS: { key: MoodEntry['mood']; emoji: string; label: string }[] = [
    { key: 'happy', emoji: '😊', label: 'Feliz' },
    { key: 'productive', emoji: '💪', label: 'Produtivo' },
    { key: 'neutral', emoji: '😐', label: 'Neutro' },
    { key: 'tired', emoji: '😴', label: 'Cansado' },
    { key: 'sad', emoji: '😔', label: 'Triste' },
];

export const MoodTracker: React.FC<MoodTrackerProps> = ({ state, setState }) => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const setMood = (date: string, mood: MoodEntry['mood']) => {
        const existing = state.moods.filter(m => m.date !== date);
        setState({ ...state, moods: [...existing, { date, mood }] });
    };

    const removeMood = (date: string) => {
        setState({ ...state, moods: state.moods.filter(m => m.date !== date) });
    };

    const getMoodForDate = (date: string) => state.moods.find(m => m.date === date);
    const todayMood = getMoodForDate(today);

    // Stats
    const monthMoods = state.moods.filter(m => m.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`));

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#f0f2f5', padding: '48px 64px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Humor</h1>
            <p style={{ fontSize: 13, color: '#8b92a5', marginBottom: 40, fontWeight: 500 }}>Como você está se sentindo?</p>

            {/* Today's Mood */}
            <div style={{ marginBottom: 48, padding: 32, background: '#1e2740', borderRadius: 20, color: '#fff' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Hoje</p>
                <div style={{ display: 'flex', gap: 12 }}>
                    {MOODS.map(m => (
                        <button key={m.key} onClick={() => setMood(today, m.key)}
                            style={{
                                padding: '16px 20px', borderRadius: 16, border: 'none', cursor: 'pointer',
                                background: todayMood?.mood === m.key ? '#fff' : '#222',
                                color: todayMood?.mood === m.key ? '#000' : '#888',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                transition: 'all 0.2s ease', minWidth: 80
                            }}>
                            <span style={{ fontSize: 28 }}>{m.emoji}</span>
                            <span style={{ fontSize: 11, fontWeight: 700 }}>{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Month Calendar */}
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{MONTHS[currentMonth]}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const mood = getMoodForDate(dateStr);
                    const isToday = dateStr === today;

                    return (
                        <div key={day} style={{
                            padding: 12, borderRadius: 12, textAlign: 'center',
                            background: isToday ? '#000' : '#fafafa',
                            color: isToday ? '#fff' : '#000',
                            border: isToday ? 'none' : '1px solid #eee',
                            cursor: 'pointer', minHeight: 64
                        }}
                            onClick={() => !mood && setMood(dateStr, 'neutral')}
                        >
                            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{day}</div>
                            {mood ? (
                                <div style={{ position: 'relative' }}>
                                    <span style={{ fontSize: 20 }}>{MOODS.find(m => m.key === mood.mood)?.emoji}</span>
                                    <button onClick={e => { e.stopPropagation(); removeMood(dateStr); }}
                                        style={{ position: 'absolute', top: -8, right: -4, background: 'none', border: 'none', fontSize: 10, color: isToday ? '#666' : '#ccc', cursor: 'pointer' }}>✕</button>
                                </div>
                            ) : (
                                <div style={{ fontSize: 10, color: isToday ? '#666' : '#ddd' }}>—</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Stats */}
            {monthMoods.length > 0 && (
                <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
                    {MOODS.map(m => {
                        const count = monthMoods.filter(mood => mood.mood === m.key).length;
                        return count > 0 ? (
                            <div key={m.key} style={{ padding: '12px 16px', background: '#fff', borderRadius: 10, border: '1px solid #e0e3ea', textAlign: 'center' }}>
                                <span style={{ fontSize: 20 }}>{m.emoji}</span>
                                <div style={{ fontSize: 16, fontWeight: 900, marginTop: 4 }}>{count}</div>
                            </div>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
};
