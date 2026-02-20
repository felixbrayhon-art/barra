
import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, BulletEntry, BulletType } from '../types';

interface WeeklyLogProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const WeeklyLog: React.FC<WeeklyLogProps> = ({ state, setState }) => {
    // Helper to get current week dates
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

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-black">Registro Semanal</h2>
                <div className="bg-[#FFF9C4] text-[#FB8C00] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#FBC02D]/30 shadow-sm">
                    Esta Semana
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDates.map((date, idx) => (
                    <div key={date} className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 flex flex-col min-h-[500px] hover:shadow-md transition-shadow">
                        <div className="mb-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{days[idx]}</h3>
                            <p className="text-2xl font-black text-black">{new Date(date).getDate() + 1}</p>
                        </div>

                        <div className="flex-1 space-y-4">
                            {getEntriesForDate(date).map(entry => (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-2 group cursor-pointer"
                                    onClick={() => ['task', 'completed', 'migrated', 'cancelled'].includes(entry.type) && toggleStatus(entry.id, entry.type)}
                                >
                                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${entry.type === 'completed' ? 'bg-[#C8E6C9]' :
                                        entry.type === 'cancelled' ? 'bg-[#FFE0B2]' :
                                            entry.type === 'migrated' ? 'bg-[#FFF9C4]' : 'bg-gray-200'
                                        }`} />
                                    <span className={`text-[13px] leading-tight font-medium ${['completed', 'cancelled'].includes(entry.type) ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
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
