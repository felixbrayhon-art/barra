import * as React from 'react';
import { BulletJournalState, BulletType } from '../types';

interface WeeklyLogProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const WeeklyLog: React.FC<WeeklyLogProps> = ({ state, setState }) => {
    const getWeekDates = () => {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + 1; // Monday
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(curr.setDate(first + i));
            return d.toISOString().split('T')[0];
        });
    };

    const weekDates = getWeekDates();
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    const getEntriesForDate = (date: string) => state.entries.filter(e => e.date === date);

    const toggleStatus = (id: string, currentType: BulletType) => {
        const nextStatus: Record<BulletType, BulletType> = {
            'task': 'completed',
            'completed': 'migrated',
            'migrated': 'cancelled',
            'cancelled': 'task',
            'note': 'note',
            'event': 'event'
        };

        setState({
            ...state,
            entries: state.entries.map(e => e.id === id ? { ...e, type: nextStatus[currentType] || 'task' } : e),
        });
    };

    return (
        <div className="h-full bg-zinc-50/10 overflow-y-auto p-10 font-inter">
            <div className="flex items-end justify-between mb-12 border-b border-zinc-100 pb-8 max-w-7xl mx-auto">
                <div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">REGISTRO SEMANAL</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium italic">Visão panorâmica da sua semana.</p>
                </div>
                <div className="text-[11px] font-bold bg-zinc-900 text-white px-5 py-2 rounded-lg uppercase tracking-widest shadow-sm">
                    Planilha de Bordo
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-5 max-w-7xl mx-auto">
                {weekDates.map((date, idx) => (
                    <div key={date} className="bg-white rounded-xl p-6 border border-zinc-100 flex flex-col min-h-[550px] transition-all hover:border-zinc-300 shadow-sm hover:shadow-md">
                        <div className="mb-6 border-b border-zinc-50 pb-4">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{days[idx]}</h3>
                            <p className="text-2xl font-black text-zinc-900">{new Date(date).getDate() + 1}</p>
                        </div>

                        <div className="flex-1 space-y-4 no-scrollbar overflow-y-auto">
                            {getEntriesForDate(date).map(entry => (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-3 group cursor-pointer"
                                    onClick={() => ['task', 'completed', 'migrated', 'cancelled'].includes(entry.type) && toggleStatus(entry.id, entry.type)}
                                >
                                    <div className={`mt-1 flex-shrink-0 transition-colors ${entry.type === 'completed' ? 'text-indigo-500' : 'text-zinc-200 group-hover:text-zinc-400'
                                        }`}>
                                        {entry.type === 'completed' ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                        )}
                                    </div>
                                    <span className={`text-xs leading-relaxed font-semibold transition-all ${['completed', 'cancelled'].includes(entry.type) ? 'text-zinc-300 line-through' : 'text-zinc-600'}`}>
                                        {entry.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
