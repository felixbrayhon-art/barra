
import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, BulletEntry, BulletType } from '../types';
import './BulletJournal.css';

interface BulletJournalProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const BulletJournal: React.FC<BulletJournalProps> = ({ state, setState }) => {
    const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);
    const [inputText, setInputText] = useState('');
    const [selectedType, setSelectedType] = useState<BulletType>('task');
    const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

    const addEntry = () => {
        if (!inputText.trim()) return;

        const newEntry: BulletEntry = {
            id: crypto.randomUUID(),
            type: selectedType,
            text: inputText,
            date: activeDate,
            collectionId: activeCollectionId || undefined,
        };

        setState({
            ...state,
            entries: [...state.entries, newEntry],
        });
        setInputText('');
    };

    const toggleStatus = (id: string, currentType: BulletType) => {
        let nextType: BulletType = currentType;
        if (currentType === 'task') nextType = 'completed';
        else if (currentType === 'completed') nextType = 'migrated';
        else if (currentType === 'migrated') nextType = 'cancelled';
        else if (currentType === 'cancelled') nextType = 'task';

        setState({
            ...state,
            entries: state.entries.map(e => e.id === id ? { ...e, type: nextType } : e),
        });
    };

    const filteredEntries = state.entries.filter(e =>
        activeCollectionId
            ? e.collectionId === activeCollectionId
            : (e.date === activeDate && !e.collectionId)
    );

    const addCollection = () => {
        const name = prompt("Nome da nova coleção:");
        if (!name) return;
        const newCol = { id: crypto.randomUUID(), name };
        setState({ ...state, collections: [...state.collections, newCol] });
    };

    const getBulletIcon = (type: BulletType) => {
        switch (type) {
            case 'task': return <div className="bullet-task" />;
            case 'note': return <div className="bullet-note" />;
            case 'event': return <div className="bullet-event" />;
            case 'completed': return (
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            );
            case 'migrated': return (
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            );
            case 'cancelled': return (
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
            default: return <div className="bullet-dot" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#FAFBFC] overflow-y-auto p-6 md:p-10 pb-32">
            <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-8">

                {/* Sidebar Collections */}
                <div className="w-full md:w-48 flex-shrink-0 pt-6 md:pt-20">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Coleções</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveCollectionId(null)}
                            className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${!activeCollectionId ? 'bg-[#FFF9C4] text-[#FB8C00] shadow-sm border border-[#FBC02D]/30' : 'text-gray-400 hover:text-black'}`}
                        >
                            📅 Diário
                        </button>
                        {state.collections.map(col => (
                            <button
                                key={col.id}
                                onClick={() => setActiveCollectionId(col.id)}
                                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCollectionId === col.id ? 'bg-black text-[#E6FF57]' : 'text-gray-400 hover:text-black'} group flex justify-between items-center`}
                            >
                                <span className="truncate">{col.name}</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm("Excluir coleção?")) {
                                            setState({
                                                ...state,
                                                collections: state.collections.filter(c => c.id !== col.id),
                                                entries: state.entries.filter(en => en.collectionId !== col.id)
                                            });
                                            if (activeCollectionId === col.id) setActiveCollectionId(null);
                                        }
                                    }}
                                    className="p-1 opacity-0 group-hover:opacity-100 text-red-400 hover:scale-110"
                                >
                                    ×
                                </span>
                            </button>
                        ))}
                        <button
                            onClick={addCollection}
                            className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-gray-400 border border-dashed border-gray-800 mt-4"
                        >
                            + Nova Coleção
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <h2 className="text-3xl font-black text-black mb-8">Bullet da <span className="text-blue-600">Raíssa</span></h2>

                    <div className="bujo-paper rounded-[2.5rem] min-h-[700px] shadow-2xl p-8 md:p-12 flex flex-col relative overflow-hidden text-gray-800 border-8 border-[#f0ede6]">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 z-10">
                            <div className="flex flex-col">
                                {activeCollectionId ? (
                                    <h3 className="text-2xl font-black text-gray-900 px-2">{state.collections.find(c => c.id === activeCollectionId)?.name}</h3>
                                ) : (
                                    <input
                                        type="date"
                                        value={activeDate}
                                        onChange={(e) => setActiveDate(e.target.value)}
                                        className="bg-transparent text-2xl font-black border-none focus:outline-none text-gray-900 cursor-pointer hover:bg-black/5 rounded-lg px-2"
                                    />
                                )}
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">
                                    {activeCollectionId ? 'Collection' : 'Daily Log'}
                                </span>
                            </div>

                            <div className="flex gap-1 md:gap-2 bg-black/5 p-1 rounded-[2rem]">
                                {(['task', 'note', 'event'] as BulletType[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-3 md:px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === type ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="mb-12 z-10">
                            <div className="flex items-center gap-4 group">
                                <div className="w-8 flex justify-center">
                                    {getBulletIcon(selectedType)}
                                </div>
                                <input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addEntry()}
                                    placeholder="Escreva algo..."
                                    className="flex-1 bg-transparent border-none text-xl font-medium focus:outline-none placeholder:text-gray-300"
                                />
                            </div>
                            <div className="h-0.5 bg-gray-100 mt-2 w-full"></div>
                        </div>

                        {/* Entries */}
                        <div className="flex-1 space-y-4 z-10">
                            {filteredEntries.map(entry => (
                                <div
                                    key={entry.id}
                                    className="bujo-entry group"
                                    onClick={() => ['task', 'completed', 'migrated', 'cancelled'].includes(entry.type) && toggleStatus(entry.id, entry.type)}
                                >
                                    <div className="w-8 flex justify-center flex-shrink-0">
                                        {getBulletIcon(entry.type)}
                                    </div>
                                    <span className={`text-lg transition-all ${['completed', 'cancelled'].includes(entry.type) ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                        {entry.text}
                                    </span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setState({ ...state, entries: state.entries.filter(i => i.id !== entry.id) });
                                        }}
                                        className="ml-auto opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}

                            {filteredEntries.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <p className="text-sm font-bold uppercase tracking-widest">Nada planejado ainda</p>
                                </div>
                            )}
                        </div>

                        {/* Grid Paper Texture Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
