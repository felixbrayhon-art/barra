import * as React from 'react';
import { BulletJournalState } from '../types';

interface GratitudeJournalProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ state, setState }) => {
    const [entry, setEntry] = React.useState('');

    const addGratitude = () => {
        if (!entry.trim()) return;
        const newEntry = {
            id: crypto.randomUUID(),
            text: entry,
            date: new Date().toISOString().split('T')[0]
        };
        setState({ ...state, gratitude: [newEntry, ...state.gratitude] });
        setEntry('');
    };

    return (
        <div className="h-full overflow-y-auto p-10 font-inter bg-zinc-50/10">
            <div className="flex items-end justify-between mb-12 border-b border-zinc-100 pb-8 max-w-2xl mx-auto">
                <div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight uppercase">GRATIDÃO</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium italic">Cultive uma mente positiva.</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-white border border-zinc-100 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 text-center">Pelo que você é grato hoje?</h3>
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        placeholder="Escreva algo inspirador..."
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-6 text-sm font-medium focus:outline-none focus:border-zinc-300 min-h-[120px] resize-none mb-6"
                    />
                    <button
                        onClick={addGratitude}
                        className="w-full bg-zinc-900 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg"
                    >
                        Salvar Reflexão
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                {state.gratitude.map(item => (
                    <div key={item.id} className="bg-white border border-zinc-100 rounded-xl p-8 shadow-sm transition-all hover:border-zinc-300 group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                                {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                            </p>
                        </div>
                        <p className="text-sm font-medium text-zinc-700 leading-relaxed italic">"{item.text}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
