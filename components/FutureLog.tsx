import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState } from '../types';

interface FutureLogProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const FutureLog: React.FC<FutureLogProps> = ({ state, setState }) => {
    const [inputText, setInputText] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const currentYear = new Date().getFullYear();

    const addFutureEntry = () => {
        if (!inputText.trim()) return;
        const monthStr = `${currentYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
        const newEntry = {
            id: crypto.randomUUID(),
            type: 'event' as const,
            text: inputText.trim(),
            date: `${monthStr}-01`,
            collectionId: `future-${monthStr}`
        };
        setState({ ...state, entries: [...state.entries, newEntry] });
        setInputText('');
    };

    const removeEntry = (id: string) => {
        setState({ ...state, entries: state.entries.filter(e => e.id !== id) });
    };

    const getEntriesForMonth = (monthIndex: number) => {
        const monthStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}`;
        return state.entries.filter(e => e.date.startsWith(monthStr) && e.collectionId?.startsWith('future-'));
    };

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#fff', padding: '48px 64px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, color: '#000', marginBottom: 8 }}>Registro Futuro</h1>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 40, fontWeight: 500 }}>Planejamento de longo prazo — {currentYear}</p>

            {/* Input */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 40, padding: '12px 16px', background: '#fafafa', borderRadius: 12, border: '1px solid #e5e5e5' }}>
                <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
                    style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter'" }}>
                    {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFutureEntry()}
                    placeholder="Evento ou meta futura..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: "'Inter'" }} />
                <button onClick={addFutureEntry} style={{ padding: '8px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+</button>
            </div>

            {/* Months Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {MONTHS.map((month, i) => {
                    const entries = getEntriesForMonth(i);
                    const isCurrent = i === new Date().getMonth();
                    return (
                        <div key={i} style={{
                            padding: 20, borderRadius: 16, minHeight: 140,
                            background: isCurrent ? '#000' : '#fafafa',
                            color: isCurrent ? '#fff' : '#000',
                            border: isCurrent ? 'none' : '1px solid #eee'
                        }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{month}</h3>
                            {entries.length === 0 && <p style={{ fontSize: 11, color: isCurrent ? '#666' : '#ccc', fontStyle: 'italic' }}>—</p>}
                            {entries.map(entry => (
                                <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, flex: 1 }}>○ {entry.text}</span>
                                    <button onClick={() => removeEntry(entry.id)}
                                        style={{ background: 'none', border: 'none', color: isCurrent ? '#555' : '#ddd', cursor: 'pointer', fontSize: 12 }}>✕</button>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
