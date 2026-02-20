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

    const addEntry = () => {
        if (!inputText.trim()) return;
        const newEntry: BulletEntry = {
            id: crypto.randomUUID(),
            type: selectedType,
            text: inputText,
            date: activeDate
        };
        setState({ ...state, entries: [newEntry, ...state.entries] });
        setInputText('');
    };

    const toggleStatus = (id: string) => {
        const newEntries = state.entries.map(entry => {
            if (entry.id === id) {
                const nextType: Record<BulletType, BulletType> = {
                    'task': 'completed',
                    'completed': 'migrated',
                    'migrated': 'cancelled',
                    'cancelled': 'note',
                    'note': 'event',
                    'event': 'task'
                };
                return { ...entry, type: nextType[entry.type] || 'task' };
            }
            return entry;
        });
        setState({ ...state, entries: newEntries });
    };

    const filteredEntries = state.entries.filter(e => e.date === activeDate);

    return (
        <div className="flex-1 bg-white flex flex-col h-full font-inter overflow-hidden">
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full px-8 py-12">

                {/* Header */}
                <div className="flex items-end justify-between mb-12 border-b border-zinc-100 pb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                            DIÁRIO <span className="text-zinc-400 font-medium">/ {new Date(activeDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</span>
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1 font-medium italic">Capture seus pensamentos e ações.</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={activeDate}
                            onChange={(e) => setActiveDate(e.target.value)}
                            className="text-xs font-bold bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Input Area */}
                <div className="mb-10 group">
                    <div className="flex items-center space-x-4 bg-zinc-50 border border-zinc-200 rounded-xl p-2 focus-within:border-zinc-400 focus-within:bg-white transition-all shadow-sm">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as BulletType)}
                            className="bg-zinc-100 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border-none focus:ring-0 cursor-pointer hover:bg-zinc-200 transition-colors"
                        >
                            <option value="task">Tarefa</option>
                            <option value="note">Nota</option>
                            <option value="event">Evento</option>
                        </select>
                        <input
                            type="text"
                            placeholder="O que está em sua mente?"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-400 font-medium"
                        />
                        <button
                            onClick={addEntry}
                            className="w-8 h-8 flex items-center justify-center bg-zinc-900 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>
                </div>

                {/* Bullet List */}
                <div className="flex-1 overflow-y-auto pr-4 no-scrollbar">
                    {filteredEntries.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-2xl">
                            <span className="text-3xl mb-2">✨</span>
                            <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Nada planejado ainda</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    onClick={() => toggleStatus(entry.id)}
                                    className="flex items-start group cursor-pointer hover:bg-zinc-50 p-3 rounded-lg transition-colors border-b border-zinc-50 last:border-0"
                                >
                                    <div className="mt-1.5 mr-4 flex-shrink-0">
                                        {entry.type === 'task' && <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full group-hover:bg-zinc-900" />}
                                        {entry.type === 'completed' && <div className="w-3 h-3 flex items-center justify-center bg-indigo-500 text-white rounded-sm"><svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg></div>}
                                        {entry.type === 'note' && <div className="w-2 h-0.5 bg-indigo-400 rounded-full" />}
                                        {entry.type === 'event' && <div className="w-2 h-2 border border-zinc-400 rounded-full" />}
                                        {entry.type === 'migrated' && <div className="w-3 h-3 text-indigo-500"><svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" /></svg></div>}
                                        {entry.type === 'cancelled' && <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full line-through" />}
                                    </div>
                                    <span className={`text-sm font-medium ${entry.type === 'completed' ? 'text-zinc-400 line-through decoration-zinc-300' : 'text-zinc-700'}`}>
                                        {entry.text}
                                    </span>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{entry.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Insight */}
                <div className="mt-8 p-6 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">💡</div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Dica de Produtividade</p>
                        <p className="text-xs text-indigo-900/60 font-medium">Use '.' para tarefas rápidas, '-' para notas e {'\u003E'} para migrar para amanhã.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
