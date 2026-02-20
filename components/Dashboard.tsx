import * as React from 'react';
import { BulletJournalState } from '../types';

interface DashboardProps {
    state: BulletJournalState;
    userName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, userName }) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = state.entries.filter(e => e.date === today);
    const completedToday = todayEntries.filter(e => e.type === 'completed').length;
    const pendingToday = todayEntries.filter(e => e.type === 'task').length;
    const totalEntries = state.entries.length;
    const totalHabits = state.habits.length;
    const totalFinances = state.finances.length;
    const todayMood = state.moods.find(m => m.date === today);
    const todayGratitude = state.gratitude.find(g => g.date === today);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Bom dia';
        if (h < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const stats = [
        { label: 'Tarefas hoje', value: todayEntries.length, sub: `${completedToday} concluídas` },
        { label: 'Pendentes', value: pendingToday, sub: 'para fazer' },
        { label: 'Total registros', value: totalEntries, sub: 'no diário' },
        { label: 'Hábitos', value: totalHabits, sub: 'rastreados' },
        { label: 'Finanças', value: totalFinances, sub: 'lançamentos' },
        { label: 'Coleções', value: state.collections.length, sub: 'criadas' },
    ];

    return (
        <div style={{
            height: '100%', overflow: 'auto', background: '#fff', padding: '48px 64px',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{ marginBottom: 48 }}>
                <p style={{ fontSize: 14, color: '#999', fontWeight: 500, marginBottom: 4 }}>{greeting()},</p>
                <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, color: '#000', margin: 0 }}>
                    {userName}
                </h1>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{
                        padding: '24px', borderRadius: 16,
                        background: i === 0 ? '#000' : '#fafafa',
                        color: i === 0 ? '#fff' : '#000',
                        border: i === 0 ? 'none' : '1px solid #eee'
                    }}>
                        <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>{s.value}</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: i === 0 ? '#888' : '#aaa', marginTop: 2 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Today's Quick View */}
            <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: '#000' }}>Hoje</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Mood */}
                    <div style={{ padding: 20, background: '#fafafa', borderRadius: 12, border: '1px solid #eee' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Humor</p>
                        <p style={{ fontSize: 20 }}>{todayMood ? { happy: '😊', neutral: '😐', sad: '😔', productive: '💪', tired: '😴' }[todayMood.mood] : '—'}</p>
                    </div>
                    {/* Gratitude */}
                    <div style={{ padding: 20, background: '#fafafa', borderRadius: 12, border: '1px solid #eee' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Gratidão</p>
                        <p style={{ fontSize: 13, color: todayGratitude ? '#000' : '#ccc', fontStyle: todayGratitude ? 'normal' : 'italic' }}>
                            {todayGratitude ? todayGratitude.text : 'Nada registrado ainda'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent entries */}
            <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: '#000' }}>Últimas entradas</h2>
                {state.entries.slice(-5).reverse().map(entry => (
                    <div key={entry.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                        borderBottom: '1px solid #f5f5f5', fontSize: 13
                    }}>
                        <span style={{ fontFamily: 'monospace', color: '#aaa' }}>
                            {entry.type === 'task' ? '•' : entry.type === 'completed' ? '✕' : '○'}
                        </span>
                        <span style={{ flex: 1, color: entry.type === 'completed' ? '#aaa' : '#000', textDecoration: entry.type === 'completed' ? 'line-through' : 'none' }}>
                            {entry.text}
                        </span>
                        <span style={{ fontSize: 11, color: '#ccc' }}>{entry.date}</span>
                    </div>
                ))}
                {state.entries.length === 0 && (
                    <p style={{ color: '#ccc', fontSize: 13, fontStyle: 'italic' }}>Nenhuma entrada ainda. Comece pelo Diário!</p>
                )}
            </div>
        </div>
    );
};
