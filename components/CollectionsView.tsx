
import React, { useState } from 'react';
import { BulletJournalState, Collection } from '../types';

interface CollectionsViewProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ state, setState }) => {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

    const addCollection = () => {
        const name = prompt("Nome da nova coleção:");
        if (!name) return;
        const icons = ['📚', '💡', '🏠', '💼', '✈️', '🎨', '🧩', '🍜'];
        const newCol: Collection = {
            id: crypto.randomUUID(),
            name,
            icon: icons[state.collections.length % icons.length]
        };
        setState({ ...state, collections: [...state.collections, newCol] });
    };

    const selectedCollection = state.collections.find(c => c.id === selectedCollectionId);
    const entries = state.entries.filter(e => e.collectionId === selectedCollectionId);

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-black">Coleções</h2>
                <button
                    onClick={addCollection}
                    className="bg-black text-[#E6FF57] px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                    + Nova Coleção
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Collections List */}
                <div className="w-full md:w-80 grid gap-4 auto-rows-max">
                    {state.collections.map(col => (
                        <button
                            key={col.id}
                            onClick={() => setSelectedCollectionId(col.id)}
                            className={`group p-6 rounded-[2rem] border transition-all text-left flex items-center justify-between ${selectedCollectionId === col.id
                                    ? 'bg-black text-[#E6FF57] border-black shadow-2xl'
                                    : 'bg-white text-gray-700 border-black/5 hover:border-black/20 shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{col.icon || '📁'}</span>
                                <div>
                                    <p className="font-black text-sm">{col.name}</p>
                                    <p className={`text-[10px] uppercase font-bold tracking-widest ${selectedCollectionId === col.id ? 'text-[#E6FF57]/50' : 'text-gray-400'}`}>
                                        {state.entries.filter(e => e.collectionId === col.id).length} itens
                                    </p>
                                </div>
                            </div>
                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}

                    {state.collections.length === 0 && (
                        <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Nenhuma coleção</p>
                        </div>
                    )}
                </div>

                {/* Collection Content */}
                <div className="flex-1 min-h-[600px] bg-white rounded-[2.5rem] p-10 border border-black/5 shadow-sm">
                    {selectedCollection ? (
                        <div>
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-black/5">
                                <span className="text-4xl">{selectedCollection.icon || '📁'}</span>
                                <h3 className="text-2xl font-black text-black">{selectedCollection.name}</h3>
                            </div>

                            <div className="space-y-6">
                                {entries.length > 0 ? entries.map(entry => (
                                    <div key={entry.id} className="flex gap-4 group">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                        <p className="text-lg font-medium text-gray-800 leading-snug">{entry.text}</p>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center opacity-20">
                                        <p className="text-sm font-black uppercase tracking-widest text-[#D4A373]">Sem itens nesta coleção ainda</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-30">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth={1} /></svg>
                            <p className="text-sm font-black uppercase tracking-widest">Selecione uma coleção para ver os itens</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
