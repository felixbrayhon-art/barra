import * as React from 'react';
import { BulletJournalState } from '../types';

interface HabitTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ state, setState }) => {
    const habits = [
        { id: 'water', name: 'Beber Água' },
        { id: 'meditation', name: 'Meditação' },
        { id: 'exercise', name: 'Exercício' },
        { id: 'reading', name: 'Leitura' },
        { id: 'coding', name: 'Codar' },
    ];

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const toggleHabit = (habitId: string, day: number) => {
        const habitKey = `h-${habitId}-${day}`;
        const newCompleted = { ...state.habitsCompleted };
        if (newCompleted[habitKey]) {
            delete newCompleted[habitKey];
        } else {
            newCompleted[habitKey] = true;
        }
        setState({ ...state, habitsCompleted: newCompleted });
    };

    return (
        <div className="h-full overflow-y-auto p-10 font-inter bg-zinc-50/10">
            <div className="flex items-end justify-between mb-12 border-b border-zinc-100 pb-8 max-w-7xl mx-auto">
                <div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight uppercase">HABIT TRACKER</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium italic">Consistência é a chave para o progresso.</p>
                </div>
                <div className="text-[11px] font-black bg-indigo-600 text-white px-5 py-2 rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-100">
                    Foco & Disciplina
                </div>
            </div>

            <div className="max-w-7xl mx-auto bg-white rounded-2xl p-10 shadow-sm border border-zinc-100 overflow-x-auto no-scrollbar">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-[180px_repeat(31,1fr)] gap-1 mb-6">
                        <div />
                        {days.map(d => (
                            <div key={d} className="text-[9px] font-black text-zinc-300 text-center">{d}</div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {habits.map(habit => (
                            <div key={habit.id} className="grid grid-cols-[180px_repeat(31,1fr)] gap-1 items-center group">
                                <div className="text-xs font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors uppercase tracking-wider">{habit.name}</div>
                                {days.map(d => {
                                    const isCompleted = state.habitsCompleted[`h-${habit.id}-${d}`];
                                    return (
                                        <button
                                            key={d}
                                            onClick={() => toggleHabit(habit.id, d)}
                                            className={`aspect-square rounded-[4px] transition-all border ${isCompleted
                                                    ? 'bg-zinc-900 border-zinc-900 shadow-sm scale-105'
                                                    : 'bg-zinc-50 border-zinc-100 hover:border-zinc-300'
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 max-w-7xl mx-auto flex gap-6">
                <div className="flex-1 bg-zinc-900 rounded-xl p-6 text-white text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Taxa de Sucesso</p>
                    <p className="text-3xl font-black">78%</p>
                </div>
                <div className="flex-1 bg-white border border-zinc-100 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Maior Sequência</p>
                    <p className="text-3xl font-black text-zinc-900">12 dias</p>
                </div>
            </div>
        </div>
    );
};
