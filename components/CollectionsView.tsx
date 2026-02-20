import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, Collection, BulletEntry } from '../types';

interface CollectionsViewProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ state, setState }) => {
    const [newName, setNewName] = useState('');
    const [activeCollection, setActiveCollection] = useState<string | null>(null);
    const [newItemText, setNewItemText] = useState('');

    const addCollection = () => {
        if (!newName.trim()) return;
        const col: Collection = { id: crypto.randomUUID(), name: newName.trim() };
        setState({ ...state, collections: [...state.collections, col] });
        setNewName('');
    };

    const removeCollection = (id: string) => {
        setState({
            ...state,
            collections: state.collections.filter(c => c.id !== id),
            entries: state.entries.filter(e => e.collectionId !== id)
        });
        if (activeCollection === id) setActiveCollection(null);
    };

    const addItem = () => {
        if (!newItemText.trim() || !activeCollection) return;
        const entry: BulletEntry = {
            id: crypto.randomUUID(), type: 'note', text: newItemText.trim(),
            date: new Date().toISOString().split('T')[0], collectionId: activeCollection
        };
        setState({ ...state, entries: [...state.entries, entry] });
        setNewItemText('');
    };

    const removeItem = (id: string) => {
        setState({ ...state, entries: state.entries.filter(e => e.id !== id) });
    };

    const editItem = (id: string, newText: string) => {
        setState({ ...state, entries: state.entries.map(e => e.id === id ? { ...e, text: newText } : e) });
    };

    const collectionEntries = activeCollection ? state.entries.filter(e => e.collectionId === activeCollection) : [];
    const activeCol = state.collections.find(c => c.id === activeCollection);

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#fff', padding: '48px 64px', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Coleções</h1>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 32, fontWeight: 500 }}>Organize listas e ideias por tema</p>

            <div style={{ display: 'flex', gap: 32, height: 'calc(100% - 120px)' }}>
                {/* Left: Collection List */}
                <div style={{ width: 240, flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCollection()}
                            placeholder="Nova coleção..." style={{ flex: 1, padding: '10px 12px', background: '#fafafa', border: '1px solid #eee', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Inter'" }} />
                        <button onClick={addCollection} style={{ padding: '10px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+</button>
                    </div>
                    {state.collections.map(col => (
                        <div key={col.id} onClick={() => setActiveCollection(col.id)}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 14px', borderRadius: 10, marginBottom: 4, cursor: 'pointer',
                                background: activeCollection === col.id ? '#000' : '#fafafa',
                                color: activeCollection === col.id ? '#fff' : '#000',
                                border: activeCollection === col.id ? 'none' : '1px solid #eee'
                            }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{col.name}</span>
                            <button onClick={e => { e.stopPropagation(); removeCollection(col.id); }}
                                style={{ background: 'none', border: 'none', color: activeCollection === col.id ? '#666' : '#ddd', cursor: 'pointer', fontSize: 12 }}>✕</button>
                        </div>
                    ))}
                    {state.collections.length === 0 && <p style={{ fontSize: 12, color: '#ccc', fontStyle: 'italic', padding: 8 }}>Crie sua primeira coleção</p>}
                </div>

                {/* Right: Collection Items */}
                <div style={{ flex: 1 }}>
                    {activeCol ? (
                        <>
                            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>{activeCol.name}</h2>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                                <input value={newItemText} onChange={e => setNewItemText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()}
                                    placeholder="Adicionar item..." style={{ flex: 1, padding: '10px 14px', background: '#fafafa', border: '1px solid #eee', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: "'Inter'" }} />
                                <button onClick={addItem} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>+</button>
                            </div>
                            {collectionEntries.map(entry => (
                                <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                                    <span style={{ fontFamily: 'monospace', color: '#ccc' }}>—</span>
                                    <input value={entry.text} onChange={e => editItem(entry.id, e.target.value)}
                                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: "'Inter'" }} />
                                    <button onClick={() => removeItem(entry.id)}
                                        style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', fontSize: 14 }}
                                        onMouseOver={e => (e.currentTarget.style.color = '#000')} onMouseOut={e => (e.currentTarget.style.color = '#ddd')}>✕</button>
                                </div>
                            ))}
                            {collectionEntries.length === 0 && <p style={{ color: '#ccc', fontSize: 13, fontStyle: 'italic' }}>Coleção vazia. Adicione itens acima.</p>}
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ddd', fontSize: 14 }}>
                            Selecione uma coleção ou crie uma nova
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
