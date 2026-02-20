
import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState } from '../types';

interface GratitudeJournalProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ state, setState }) => {
    const [text, setText] = useState('');
    const currentDay = new Date().toISOString().split('T')[0];

    const addGratitude = () => {
        if (!text) return;
        setState({
            ...state,
            gratitude: [{ date: currentDay, text }, ...state.gratitude]
        });
        setText('');
    };

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10">
            <h2 className="text-3xl font-black text-black mb-2">Pelo que você é grata hoje?</h2>
            <p className="text-gray-400 text-sm mb-10 font-medium">Cultive a positividade registrando pequenos momentos de alegria.</p>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 mb-10 max-w-3xl">
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Hoje eu sou grata por..."
                    className="w-full h-32 p-6 rounded-[2rem] bg-gray-50 border-none text-lg font-medium focus:ring-4 focus:ring-black/5 transition-all outline-none resize-none mb-6"
                />
                <button
                    onClick={addGratitude}
                    className="bg-black text-[#E6FF57] px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                    Salvar Momento ✨
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.gratitude.map((g, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">
                            {new Date(g.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-lg font-medium text-gray-700 leading-relaxed">"{g.text}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
