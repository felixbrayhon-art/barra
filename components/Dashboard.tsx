import * as React from 'react';
import { BulletJournalState } from '../types';

interface DashboardProps {
    state: BulletJournalState;
    userName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, userName }) => {
    const today = new Date().toISOString().split('T')[0];
    const todayMood = state.moods.find(m => m.date === today);
    const todayGratitude = state.gratitude.find(g => g.date === today);
    const todayEntries = state.entries.filter(e => e.date === today);

    const stats = [
        { label: 'Hábitos Ativos', value: state.habits.length },
        { label: 'Coleções', value: state.collections.length },
        { label: 'Finanças (Saldo)', value: `R$ ${(state.finances.reduce((acc, curr) => acc + (curr.type === 'income' ? curr.amount : -curr.amount), 0)).toFixed(2)}` },
        { label: 'Entradas de Hoje', value: todayEntries.length }
    ];

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#fff', padding: '48px 64px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Olá, {userName}</h1>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 40, fontWeight: 500 }}>Sua visão geral do Bullet Journal</p>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ padding: 24, background: '#fafafa', borderRadius: 20, border: '1px solid #eee' }}>
                        <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 900 }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                {/* Today's Overview */}
                <div style={{ padding: 32, background: '#000', borderRadius: 24, color: '#fff' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Hoje</h2>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Humor</div>
                        {todayMood ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 32 }}>{todayMood.mood === 'happy' ? '😊' : todayMood.mood === 'productive' ? '💪' : todayMood.mood === 'neutral' ? '😐' : todayMood.mood === 'tired' ? '😴' : '😔'}</span>
                                <span style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>{todayMood.mood}</span>
                            </div>
                        ) : (
                            <p style={{ fontSize: 13, color: '#555', fontStyle: 'italic' }}>Humor não registrado</p>
                        )}
                    </div>

                    <div>
                        <div style={{ fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Gratidão</div>
                        {todayGratitude ? (
                            <p style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>"{todayGratitude.text}"</p>
                        ) : (
                            <p style={{ fontSize: 13, color: '#555', fontStyle: 'italic' }}>Nada registrado ainda</p>
                        )}
                    </div>
                </div>

                {/* Recent Entries */}
                <div style={{ padding: 32, background: '#fff', borderRadius: 24, border: '1px solid #eee' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Entradas Recentes</h2>
                    {todayEntries.length === 0 ? (
                        <p style={{ fontSize: 13, color: '#ccc', fontStyle: 'italic' }}>Nenhuma tarefa ou nota hoje</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {todayEntries.slice(0, 5).map(e => (
                                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.type === 'task' ? '#000' : e.type === 'event' ? 'transparent' : '#ccc', border: e.type === 'event' ? '1px solid #000' : 'none' }} />
                                    <span style={{ fontSize: 14, fontWeight: 500, textDecoration: e.status === 'completed' ? 'line-through' : 'none', color: e.status === 'completed' ? '#ccc' : '#000' }}>{e.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
