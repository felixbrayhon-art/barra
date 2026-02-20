import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, BulletEntry, BulletType } from '../types';

interface BulletJournalProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

const BULLET_ICONS: Record<BulletType, string> = {
    task: '•', note: '—', event: '○',
    completed: '✕', migrated: '→', cancelled: '—'
};

export const BulletJournal: React.FC<BulletJournalProps> = ({ state, setState }) => {
    const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);
    const [inputText, setInputText] = useState('');
    const [inputType, setInputType] = useState<BulletType>('task');

    const todayEntries = state.entries.filter(e => e.date === activeDate);

    const addEntry = () => {
        if (!inputText.trim()) return;
        const newEntry: BulletEntry = {
            id: crypto.randomUUID(),
            type: inputType,
            text: inputText.trim(),
            date: activeDate,
        };
        setState({ ...state, entries: [...state.entries, newEntry] });
        setInputText('');
    };

    const cycleType = (id: string) => {
        const cycle: BulletType[] = ['task', 'completed', 'migrated', 'cancelled'];
        setState({
            ...state,
            entries: state.entries.map(e => {
                if (e.id !== id) return e;
                const idx = cycle.indexOf(e.type);
                return { ...e, type: cycle[(idx + 1) % cycle.length] };
            })
        });
    };

    const removeEntry = (id: string) => {
        setState({ ...state, entries: state.entries.filter(e => e.id !== id) });
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <div style={{
            height: '100%', overflow: 'auto', background: '#fff', padding: '48px 64px',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{ marginBottom: 48 }}>
                <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, color: '#000', margin: 0 }}>
                    Diário
                </h1>
                <p style={{ fontSize: 13, color: '#999', marginTop: 4, fontWeight: 500 }}>
                    {formatDate(activeDate)}
                </p>
            </div>

            {/* Date Navigation */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                {[-2, -1, 0, 1, 2].map(offset => {
                    const d = new Date();
                    d.setDate(d.getDate() + offset);
                    const dateStr = d.toISOString().split('T')[0];
                    const isActive = dateStr === activeDate;
                    return (
                        <button
                            key={offset}
                            onClick={() => setActiveDate(dateStr)}
                            style={{
                                width: 48, height: 56, borderRadius: 12,
                                border: isActive ? '2px solid #000' : '1px solid #e5e5e5',
                                background: isActive ? '#000' : '#fff',
                                color: isActive ? '#fff' : '#000',
                                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: 2,
                                fontFamily: "'Inter', sans-serif"
                            }}
                        >
                            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', opacity: 0.5 }}>
                                {d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}
                            </span>
                            <span style={{ fontSize: 16, fontWeight: 800 }}>{d.getDate()}</span>
                        </button>
                    );
                })}
            </div>

            {/* Input */}
            <div style={{
                display: 'flex', gap: 8, marginBottom: 40, padding: '12px 16px',
                background: '#fafafa', borderRadius: 12, border: '1px solid #e5e5e5'
            }}>
                <select
                    value={inputType}
                    onChange={e => setInputType(e.target.value as BulletType)}
                    style={{
                        background: '#000', color: '#fff', border: 'none', borderRadius: 8,
                        padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    <option value="task">• Tarefa</option>
                    <option value="note">— Nota</option>
                    <option value="event">○ Evento</option>
                </select>
                <input
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addEntry()}
                    placeholder="Escreva aqui..."
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        fontSize: 14, color: '#000', fontFamily: "'Inter', sans-serif"
                    }}
                />
                <button
                    onClick={addEntry}
                    style={{
                        padding: '8px 20px', background: '#000', color: '#fff', border: 'none',
                        borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer'
                    }}
                >
                    +
                </button>
            </div>

            {/* Entries */}
            <div>
                {todayEntries.length === 0 && (
                    <p style={{ color: '#ccc', fontSize: 14, textAlign: 'center', padding: 40 }}>
                        Nenhuma entrada para este dia.
                    </p>
                )}
                {todayEntries.map((entry, i) => (
                    <div
                        key={entry.id}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 16,
                            padding: '14px 0',
                            borderBottom: '1px solid #f0f0f0',
                            animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
                            opacity: entry.type === 'cancelled' ? 0.3 : 1,
                        }}
                    >
                        <button
                            onClick={() => cycleType(entry.id)}
                            style={{
                                width: 28, height: 28, borderRadius: 8,
                                border: entry.type === 'completed' ? '2px solid #000' : '1px solid #ddd',
                                background: entry.type === 'completed' ? '#000' : '#fff',
                                color: entry.type === 'completed' ? '#fff' : '#000',
                                cursor: 'pointer', fontSize: 14, fontWeight: 900,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'monospace', flexShrink: 0
                            }}
                        >
                            {BULLET_ICONS[entry.type]}
                        </button>
                        <span style={{
                            flex: 1, fontSize: 14, fontWeight: 500,
                            textDecoration: entry.type === 'completed' ? 'line-through' : 'none',
                            color: entry.type === 'completed' ? '#aaa' : '#000'
                        }}>
                            {entry.text}
                        </span>
                        <button
                            onClick={() => removeEntry(entry.id)}
                            style={{
                                background: 'none', border: 'none', color: '#ddd',
                                cursor: 'pointer', fontSize: 16, padding: '0 4px'
                            }}
                            onMouseOver={e => (e.currentTarget.style.color = '#000')}
                            onMouseOut={e => (e.currentTarget.style.color = '#ddd')}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Stats */}
            {todayEntries.length > 0 && (
                <div style={{
                    marginTop: 32, padding: '16px 20px', background: '#fafafa',
                    borderRadius: 12, display: 'flex', gap: 24
                }}>
                    <div style={{ fontSize: 12, color: '#999' }}>
                        <strong style={{ color: '#000', fontSize: 18, display: 'block' }}>
                            {todayEntries.filter(e => e.type === 'completed').length}
                        </strong> concluídas
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                        <strong style={{ color: '#000', fontSize: 18, display: 'block' }}>
                            {todayEntries.filter(e => e.type === 'task').length}
                        </strong> pendentes
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                        <strong style={{ color: '#000', fontSize: 18, display: 'block' }}>
                            {todayEntries.length}
                        </strong> total
                    </div>
                </div>
            )}
        </div>
    );
};
