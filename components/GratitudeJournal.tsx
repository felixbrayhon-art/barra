import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState } from '../types';

interface GratitudeJournalProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ state, setState }) => {
    const today = new Date().toISOString().split('T')[0];
    const [inputText, setInputText] = useState('');
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const todayEntry = state.gratitude.find(g => g.date === today);

    const addGratitude = () => {
        if (!inputText.trim()) return;
        const existing = state.gratitude.filter(g => g.date !== today);
        setState({ ...state, gratitude: [...existing, { date: today, text: inputText.trim() }] });
        setInputText('');
    };

    const removeGratitude = (date: string) => {
        setState({ ...state, gratitude: state.gratitude.filter(g => g.date !== date) });
    };

    const startEdit = (date: string, text: string) => {
        setEditingDate(date);
        setEditText(text);
    };

    const saveEdit = () => {
        if (!editingDate) return;
        setState({
            ...state,
            gratitude: state.gratitude.map(g => g.date === editingDate ? { ...g, text: editText } : g)
        });
        setEditingDate(null);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const sorted = [...state.gratitude].sort((a, b) => b.date.localeCompare(a.date));

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#f0f2f5', padding: '48px 64px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Gratidão</h1>
            <p style={{ fontSize: 13, color: '#8b92a5', marginBottom: 40, fontWeight: 500 }}>Pelo que você é grato(a) hoje?</p>

            {/* Today's Input */}
            <div style={{
                padding: 32, background: '#1e2740', borderRadius: 20, color: '#fff', marginBottom: 48
            }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    {todayEntry ? '✓ Registrado hoje' : 'Escreva algo hoje'}
                </p>
                {todayEntry ? (
                    <div>
                        <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6 }}>{todayEntry.text}</p>
                        <button onClick={() => removeGratitude(today)}
                            style={{ marginTop: 16, background: '#222', color: '#888', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                            Editar
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <textarea value={inputText} onChange={e => setInputText(e.target.value)}
                            placeholder="Sou grato(a) por..." rows={3}
                            style={{
                                flex: 1, background: '#1e2740', color: '#fff', border: '1px solid #3b5bdb', borderRadius: 12,
                                padding: '12px 16px', fontSize: 14, outline: 'none', resize: 'none', fontFamily: "'Inter'"
                            }} />
                        <button onClick={addGratitude}
                            style={{ padding: '12px 24px', background: '#f0f2f5', color: '#1e2740', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', alignSelf: 'flex-end' }}>
                            Salvar
                        </button>
                    </div>
                )}
            </div>

            {/* History */}
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Histórico</h2>
            {sorted.length === 0 && <p style={{ color: '#b5bcc9', fontSize: 13, fontStyle: 'italic' }}>Nenhum registro de gratidão ainda.</p>}
            {sorted.map(entry => (
                <div key={entry.date} style={{ padding: '16px 0', borderBottom: '1px solid #edf0f4' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 11, color: '#8b92a5', fontWeight: 700, textTransform: 'uppercase' }}>{formatDate(entry.date)}</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => startEdit(entry.date, entry.text)}
                                style={{ background: 'none', border: 'none', color: '#c5cad5', cursor: 'pointer', fontSize: 11 }}
                                onMouseOver={e => (e.currentTarget.style.color = '#000')} onMouseOut={e => (e.currentTarget.style.color = '#ddd')}>editar</button>
                            <button onClick={() => removeGratitude(entry.date)}
                                style={{ background: 'none', border: 'none', color: '#c5cad5', cursor: 'pointer', fontSize: 12 }}
                                onMouseOver={e => (e.currentTarget.style.color = '#000')} onMouseOut={e => (e.currentTarget.style.color = '#ddd')}>✕</button>
                        </div>
                    </div>
                    {editingDate === entry.date ? (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <input value={editText} onChange={e => setEditText(e.target.value)}
                                style={{ flex: 1, padding: '8px 12px', background: '#fff', border: '1px solid #e0e3ea', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Inter'" }} />
                            <button onClick={saveEdit}
                                style={{ background: '#1e2740', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✓</button>
                        </div>
                    ) : (
                        <p style={{ fontSize: 14, fontWeight: 500, marginTop: 6, lineHeight: 1.5, color: '#333' }}>{entry.text}</p>
                    )}
                </div>
            ))}
        </div>
    );
};
