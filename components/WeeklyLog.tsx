import * as React from 'react';
import { BulletJournalState, WeeklyTask } from '../types';

interface WeeklyLogProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export const WeeklyLog: React.FC<WeeklyLogProps> = ({ state, setState }) => {
    const getWeekDates = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        return DAYS.map((name, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + diff + i);
            return { name, date: d.toISOString().split('T')[0], dayNum: d.getDate() };
        });
    };

    const weekDates = getWeekDates();
    const today = new Date().toISOString().split('T')[0];

    return (
        <div style={{
            height: '100%', overflow: 'auto', background: '#fff', padding: '48px 48px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, color: '#000', margin: 0, marginBottom: 8 }}>
                Semanal
            </h1>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 40, fontWeight: 500 }}>
                Visão da semana atual
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
                {weekDates.map(day => {
                    const isToday = day.date === today;
                    const dayEntries = state.entries.filter(e => e.date === day.date);

                    return (
                        <div key={day.date} style={{
                            background: isToday ? '#000' : '#fafafa',
                            color: isToday ? '#fff' : '#000',
                            borderRadius: 16, padding: 20, minHeight: 200,
                            border: isToday ? 'none' : '1px solid #eee',
                            display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ marginBottom: 16 }}>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: 1, color: isToday ? '#999' : '#aaa'
                                }}>
                                    {day.name}
                                </span>
                                <div style={{ fontSize: 24, fontWeight: 900, marginTop: 2 }}>
                                    {day.dayNum}
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                {dayEntries.length === 0 && (
                                    <p style={{ fontSize: 11, color: isToday ? '#666' : '#ccc', fontStyle: 'italic' }}>—</p>
                                )}
                                {dayEntries.map(entry => (
                                    <div key={entry.id} style={{
                                        fontSize: 12, fontWeight: 500, marginBottom: 6,
                                        textDecoration: entry.type === 'completed' ? 'line-through' : 'none',
                                        opacity: entry.type === 'completed' ? 0.5 : 1,
                                        display: 'flex', alignItems: 'flex-start', gap: 6
                                    }}>
                                        <span style={{ fontFamily: 'monospace', flexShrink: 0 }}>
                                            {entry.type === 'task' ? '•' : entry.type === 'completed' ? '✕' : '○'}
                                        </span>
                                        <span>{entry.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
