import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, Habit } from '../types';

interface HabitTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ state, setState }) => {
    const [newHabit, setNewHabit] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];
    const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const addHabit = () => {
        if (!newHabit.trim()) return;
        const habit: Habit = { id: crypto.randomUUID(), name: newHabit.trim(), color: '#000', completions: [] };
        setState({ ...state, habits: [...state.habits, habit] });
        setNewHabit('');
    };

    const removeHabit = (id: string) => {
        setState({ ...state, habits: state.habits.filter(h => h.id !== id) });
    };

    const editHabit = (id: string, newName: string) => {
        setState({ ...state, habits: state.habits.map(h => h.id === id ? { ...h, name: newName } : h) });
    };

    const toggleDay = (habitId: string, day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setState({
            ...state,
            habits: state.habits.map(h => {
                if (h.id !== habitId) return h;
                const has = h.completions.includes(dateStr);
                return { ...h, completions: has ? h.completions.filter(d => d !== dateStr) : [...h.completions, dateStr] };
            })
        });
    };

    const getStreak = (habit: Habit) => {
        let streak = 0;
        const d = new Date();
        while (true) {
            const dateStr = d.toISOString().split('T')[0];
            if (habit.completions.includes(dateStr)) { streak++; d.setDate(d.getDate() - 1); }
            else break;
        }
        return streak;
    };

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#fff', padding: '48px 48px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Hábitos</h1>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 24, fontWeight: 500 }}>{MONTHS[currentMonth]} {currentYear}</p>

            {/* Month Nav */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }}
                    style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }}>←</button>
                <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }}
                    style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }}>→</button>
            </div>

            {/* Add Habit */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                <input value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()}
                    placeholder="Novo hábito..." style={{ flex: 1, padding: '10px 14px', background: '#fafafa', border: '1px solid #eee', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Inter'" }} />
                <button onClick={addHabit} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+</button>
            </div>

            {/* Habit Grid */}
            {state.habits.length === 0 && <p style={{ color: '#ccc', fontSize: 13, fontStyle: 'italic' }}>Adicione seu primeiro hábito acima.</p>}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#aaa', width: 160, position: 'sticky', left: 0, background: '#fff' }}>Hábito</th>
                            {Array.from({ length: daysInMonth }, (_, i) => (
                                <th key={i} style={{ padding: 4, fontSize: 10, fontWeight: 600, color: '#ccc', textAlign: 'center', minWidth: 28 }}>{i + 1}</th>
                            ))}
                            <th style={{ padding: '8px', fontSize: 11, fontWeight: 700, color: '#aaa', textAlign: 'center' }}>🔥</th>
                            <th style={{ width: 28 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.habits.map(habit => (
                            <tr key={habit.id}>
                                <td style={{ padding: '6px 12px', position: 'sticky', left: 0, background: '#fff' }}>
                                    <input value={habit.name} onChange={e => editHabit(habit.id, e.target.value)}
                                        style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'Inter'", width: '100%' }} />
                                </td>
                                {Array.from({ length: daysInMonth }, (_, i) => {
                                    const day = i + 1;
                                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const done = habit.completions.includes(dateStr);
                                    const isToday = dateStr === today;
                                    return (
                                        <td key={i} style={{ padding: 2, textAlign: 'center' }}>
                                            <button onClick={() => toggleDay(habit.id, day)}
                                                style={{
                                                    width: 24, height: 24, borderRadius: 6, border: isToday ? '2px solid #000' : '1px solid #e5e5e5',
                                                    background: done ? '#000' : '#fff', cursor: 'pointer', transition: 'all 0.15s'
                                                }} />
                                        </td>
                                    );
                                })}
                                <td style={{ textAlign: 'center', fontSize: 13, fontWeight: 800 }}>{getStreak(habit)}</td>
                                <td>
                                    <button onClick={() => removeHabit(habit.id)} style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', fontSize: 12 }}>✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
