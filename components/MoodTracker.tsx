import * as React from 'react';
import { BulletJournalState } from '../types';

interface MoodTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ state, setState }) => {
    const moods = [
        { emoji: '🤩', label: 'Radiante', color: 'bg-indigo-500', value: 5 },
        { emoji: '😊', label: 'Bem', color: 'bg-zinc-900', value: 4 },
        { emoji: '😐', label: 'Neutro', color: 'bg-zinc-400', value: 3 },
        { emoji: '😔', label: 'Baixo', color: 'bg-zinc-200', value: 2 },
        { emoji: '😫', label: 'Exausto', color: 'bg-zinc-100', value: 1 },
    ];

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const setMood = (day: number, value: number) => {
        const newMoods = { ...state.moodData, [day.toString()]: value };
        setState({ ...state, moodData: newMoods });
    };

    return (
        <div className="h-full overflow-y-auto p-10 font-inter bg-zinc-50/10">
            <div className="flex items-end justify-between mb-12 border-b border-zinc-100 pb-8 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight uppercase">MOOD TRACKER</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium italic">Monitore sua energia mental.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-10 shadow-sm border border-zinc-100">
                <div className="grid grid-cols-7 gap-4">
                    {days.map(day => (
                        <div key={day} className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-zinc-300 mb-2">{day}</span>
                            <div className="relative group">
                                <button
                                    className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center text-lg ${state.moodData[day.toString()]
                                            ? moods.find(m => m.value === state.moodData[day.toString()])?.color + ' text-white border-transparent shadow-md'
                                            : 'bg-zinc-50 border-zinc-100 hover:border-zinc-300'
                                        }`}
                                >
                                    {state.moodData[day.toString()]
                                        ? moods.find(m => m.value === state.moodData[day.toString()])?.emoji
                                        : ''}
                                </button>

                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-zinc-200 rounded-lg p-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none group-hover:pointer-events-auto flex gap-1">
                                    {moods.map(m => (
                                        <button
                                            key={m.value}
                                            onClick={() => setMood(day, m.value)}
                                            className="w-8 h-8 rounded-md hover:bg-zinc-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all"
                                        >
                                            {m.emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto p-8 bg-zinc-900 rounded-2xl text-white flex items-center justify-between">
                <div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Média do Mês</h4>
                    <p className="text-2xl font-bold">Estabilidade em alta ✨</p>
                </div>
                <div className="flex -space-x-2">
                    {moods.slice(0, 3).map(m => (
                        <div key={m.label} className={`w-8 h-8 rounded-full border-2 border-zinc-900 ${m.color} flex items-center justify-center text-xs`}>{m.emoji}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};
