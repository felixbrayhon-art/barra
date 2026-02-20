
import React, { useState } from 'react';
import { BulletJournalState, BulletEntry } from '../types';

interface MonthlyLogProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const MonthlyLog: React.FC<MonthlyLogProps> = ({ state, setState }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const monthName = viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    // Statistics
    const monthPrefix = viewDate.toISOString().substring(0, 7); // YYYY-MM
    const monthEntries = state.entries.filter(e => e.date.startsWith(monthPrefix));

    const stats = {
        total: monthEntries.length,
        tasks: monthEntries.filter(e => e.type === 'task').length,
        completed: monthEntries.filter(e => e.type === 'completed').length,
        events: monthEntries.filter(e => e.type === 'event').length
    };

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

    const calendarDays = Array.from({ length: 42 }, (_, i) => {
        const day = i - firstDay + 1;
        if (day > 0 && day <= daysInMonth) {
            return new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toISOString().split('T')[0];
        }
        return null;
    });

    const entriesForSelected = selectedDate ? state.entries.filter(e => e.date === selectedDate) : [];

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-black">Registro Mensal</h2>
                <div className="flex items-center gap-4">
                    <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2.5} /></svg>
                    </button>
                    <span className="text-sm font-bold uppercase tracking-widest">{monthName}</span>
                    <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={2.5} /></svg>
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total },
                    { label: 'Tarefas', value: stats.tasks },
                    { label: 'Concluídas', value: stats.completed },
                    { label: 'Eventos', value: stats.events },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm text-center">
                        <p className="text-3xl font-black text-black mb-1">{s.value}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Calendar */}
                <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                            <div key={day} className="text-[10px] font-black text-gray-400 text-center">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} className="aspect-square" />;
                            const day = new Date(date).getDate();
                            const isSelected = selectedDate === date;
                            const hasEntries = state.entries.some(e => e.date === date);

                            return (
                                <button
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative ${isSelected ? 'bg-black text-white' : 'hover:bg-black/5 text-gray-700'
                                        }`}
                                >
                                    <span className="text-sm font-bold">{day}</span>
                                    {hasEntries && !isSelected && <div className="absolute bottom-2 w-1 h-1 bg-blue-500 rounded-full" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Day View */}
                <div className="w-full md:w-80 space-y-4">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 min-h-[400px]">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                            {selectedDate ? new Date(selectedDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : 'Selecione um dia'}
                        </h3>

                        <div className="space-y-4">
                            {entriesForSelected.length > 0 ? entriesForSelected.map(entry => (
                                <div key={entry.id} className="flex gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${entry.type === 'completed' ? 'bg-green-400' : 'bg-gray-300'
                                        }`} />
                                    <p className="text-sm font-medium text-gray-700 leading-snug">{entry.text}</p>
                                </div>
                            )) : (
                                <p className="text-xs text-center text-gray-400 mt-10 italic">Nenhum registro para este dia</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
