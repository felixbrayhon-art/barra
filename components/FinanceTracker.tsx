import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, FinanceEntry } from '../types';

interface FinanceTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

const CATEGORIES = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Casa', 'Trabalho', 'Outro'];

export const FinanceTracker: React.FC<FinanceTrackerProps> = ({ state, setState }) => {
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('Outro');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDesc, setEditDesc] = useState('');
    const [editAmount, setEditAmount] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const addEntry = () => {
        if (!desc.trim() || !amount) return;
        const entry: FinanceEntry = {
            id: crypto.randomUUID(), date: today, description: desc.trim(),
            amount: parseFloat(amount), type, category
        };
        setState({ ...state, finances: [entry, ...state.finances] });
        setDesc(''); setAmount('');
    };

    const removeEntry = (id: string) => {
        setState({ ...state, finances: state.finances.filter(f => f.id !== id) });
    };

    const startEdit = (entry: FinanceEntry) => {
        setEditingId(entry.id);
        setEditDesc(entry.description);
        setEditAmount(String(entry.amount));
    };

    const saveEdit = (id: string) => {
        setState({
            ...state,
            finances: state.finances.map(f => f.id === id ? { ...f, description: editDesc, amount: parseFloat(editAmount) || f.amount } : f)
        });
        setEditingId(null);
    };

    const totalIncome = state.finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
    const totalExpense = state.finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#f0f2f5', padding: '48px 64px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Finanças</h1>
            <p style={{ fontSize: 13, color: '#8b92a5', marginBottom: 32, fontWeight: 500 }}>Controle de entradas e saídas</p>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
                <div style={{ padding: 24, background: '#1e2740', color: '#fff', borderRadius: 16 }}>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Saldo</div>
                    <div style={{ fontSize: 28, fontWeight: 900 }}>R$ {balance.toFixed(2)}</div>
                </div>
                <div style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e0e3ea' }}>
                    <div style={{ fontSize: 11, color: '#8b92a5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Entradas</div>
                    <div style={{ fontSize: 28, fontWeight: 900 }}>R$ {totalIncome.toFixed(2)}</div>
                </div>
                <div style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e0e3ea' }}>
                    <div style={{ fontSize: 11, color: '#8b92a5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Saídas</div>
                    <div style={{ fontSize: 28, fontWeight: 900 }}>R$ {totalExpense.toFixed(2)}</div>
                </div>
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, padding: '12px 16px', background: '#fff', borderRadius: 12, border: '1px solid #e0e3ea', flexWrap: 'wrap' }}>
                <select value={type} onChange={e => setType(e.target.value as any)}
                    style={{ background: '#1e2740', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter'" }}>
                    <option value="expense">− Saída</option>
                    <option value="income">+ Entrada</option>
                </select>
                <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição..."
                    style={{ flex: 1, minWidth: 150, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: "'Inter'" }} />
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="R$ 0.00" type="number" step="0.01"
                    style={{ width: 100, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 700, fontFamily: "'Inter'", textAlign: 'right' }} />
                <select value={category} onChange={e => setCategory(e.target.value)}
                    style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: "'Inter'" }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={addEntry} style={{ padding: '8px 20px', background: '#1e2740', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+</button>
            </div>

            {/* Entries List */}
            {state.finances.length === 0 && <p style={{ color: '#b5bcc9', fontSize: 13, fontStyle: 'italic' }}>Nenhum lançamento ainda.</p>}
            {state.finances.map(entry => (
                <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #edf0f4' }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: entry.type === 'income' ? '#000' : '#ccc', flexShrink: 0
                    }} />
                    {editingId === entry.id ? (
                        <>
                            <input value={editDesc} onChange={e => setEditDesc(e.target.value)}
                                style={{ flex: 1, background: '#fff', border: '1px solid #e0e3ea', borderRadius: 6, padding: '4px 8px', fontSize: 13, outline: 'none', fontFamily: "'Inter'" }} />
                            <input value={editAmount} onChange={e => setEditAmount(e.target.value)} type="number"
                                style={{ width: 80, background: '#fff', border: '1px solid #e0e3ea', borderRadius: 6, padding: '4px 8px', fontSize: 13, outline: 'none', fontFamily: "'Inter'", textAlign: 'right' }} />
                            <button onClick={() => saveEdit(entry.id)} style={{ background: '#1e2740', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✓</button>
                        </>
                    ) : (
                        <>
                            <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }} onClick={() => startEdit(entry)} >{entry.description}</span>
                            <span style={{ fontSize: 11, color: '#8b92a5', marginRight: 8 }}>{entry.category}</span>
                            <span style={{ fontSize: 14, fontWeight: 800, minWidth: 80, textAlign: 'right' }}>
                                {entry.type === 'expense' ? '−' : '+'} R$ {entry.amount.toFixed(2)}
                            </span>
                            <button onClick={() => removeEntry(entry.id)} style={{ background: 'none', border: 'none', color: '#c5cad5', cursor: 'pointer', fontSize: 14 }}
                                onMouseOver={e => (e.currentTarget.style.color = '#000')} onMouseOut={e => (e.currentTarget.style.color = '#ddd')}>✕</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};
