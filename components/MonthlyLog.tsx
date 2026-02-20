import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState } from '../types';

interface MonthlyLogProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const MonthlyLog: React.FC<MonthlyLogProps> = ({ state, setState }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDay = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDay(currentYear, currentMonth);
    const today = new Date().toISOString().split('T')[0];

    const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

    const getDateStr = (day: number) => `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const getEntriesForDay = (day: number) => {
        const dateStr = getDateStr(day);
        return state.entries.filter(e => e.date === dateStr && !e.collectionId?.startsWith('future-'));
    };

    // Monthly stats
    const monthEntries = state.entries.filter(e => e.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`));
    const completed = monthEntries.filter(e => e.type === 'completed').length;
    const total = monthEntries.length;

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#fff', padding: '48px 64px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, color: '#000', marginBottom: 8 }}>Visão Mensal</h1>

            {/* Month Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <button onClick={prevMonth} style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 700 }}>←</button>
                <h2 style={{ fontSize: 20, fontWeight: 800, minWidth: 200, textAlign: 'center' }}>{MONTHS[currentMonth]} {currentYear}</h2>
                <button onClick={nextMonth} style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 700 }}>→</button>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <div style={{ padding: '16px 24px', background: '#000', color: '#fff', borderRadius: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{total}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>registros</div>
                </div>
                <div style={{ padding: '16px 24px', background: '#fafafa', borderRadius: 12, border: '1px solid #eee' }}>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{completed}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>concluídos</div>
                </div>
                <div style={{ padding: '16px 24px', background: '#fafafa', borderRadius: 12, border: '1px solid #eee' }}>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{total > 0 ? Math.round((completed / total) * 100) : 0}%</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>produtividade</div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {WEEKDAYS.map(d => (
                    <div key={d} style={{ padding: 8, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase' }}>{d}</div>
                ))}
                {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateStr = getDateStr(day);
                    const isToday = dateStr === today;
                    const entries = getEntriesForDay(day);
                    const hasEntries = entries.length > 0;

                    return (
                        <div key={day} style={{
                            padding: 8, minHeight: 64, borderRadius: 8,
                            background: isToday ? '#000' : hasEntries ? '#fafafa' : '#fff',
                            color: isToday ? '#fff' : '#000',
                            border: isToday ? 'none' : '1px solid #f0f0f0',
                            cursor: 'default'
                        }}>
                            <div style={{ fontSize: 13, fontWeight: isToday ? 900 : 600, marginBottom: 4 }}>{day}</div>
                            {entries.slice(0, 2).map(e => (
                                <div key={e.id} style={{ fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isToday ? '#aaa' : '#888' }}>
                                    {e.text}
                                </div>
                            ))}
                            {entries.length > 2 && <div style={{ fontSize: 9, color: isToday ? '#666' : '#ccc' }}>+{entries.length - 2}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
