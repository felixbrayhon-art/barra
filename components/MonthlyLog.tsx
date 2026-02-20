import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState } from '../types';

interface MonthlyLogProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const MonthlyLog: React.FC<MonthlyLogProps> = ({ state, setState }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const monthName = viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    const monthPrefix = viewDate.toISOString().substring(0, 7);
    const monthEntries = state.entries.filter(e => e.date.startsWith(monthPrefix));

    const stats = [
        { label: 'Total', value: monthEntries.length },
        { label: 'Tarefas', value: monthEntries.filter(e => e.type === 'task').length },
        { label: 'Concluídas', value: monthEntries.filter(e => e.type === 'completed').length },
        { label: 'Eventos', value: monthEntries.filter(e => e.type === 'event').length }
    ];

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
        <div className="h-full overflow-y-auto p-10 font-inter bg-zinc-50/10">
            <div className="flex items-center justify-between mb-12 border-b border-zinc-100 pb-8 max-w-7xl mx-auto">
                <div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight uppercase">REGISTRO MENSAL</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium italic">Visão de longo prazo e métricas.</p>
                </div>
                <div className="flex items-center gap-6 bg-white border border-zinc-100 rounded-lg px-4 py-2 shadow-sm">
                    <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-1 hover:text-indigo-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 px-2">{monthName}</span>
                    <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-1 hover:text-indigo-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12 max-w-7xl mx-auto">
                {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-8 border border-zinc-100 shadow-sm transition-all hover:border-zinc-300">
                        <p className="text-4xl font-black text-zinc-900 mb-1">{s.value}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                {/* Calendar */}
                <div className="flex-1 bg-white rounded-2xl p-10 shadow-sm border border-zinc-100 transition-all hover:border-zinc-200">
                    <div className="grid grid-cols-7 gap-2 mb-6">
                        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                            <div key={day} className="text-[10px] font-black text-zinc-300 text-center tracking-widest">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                        {calendarDays.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} className="aspect-square" />;
                            const day = new Date(date).getDate() + 1;
                            const isSelected = selectedDate === date;
                            const hasEntries = state.entries.some(e => e.date === date);

                            return (
                                <button
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all relative border font-bold ${isSelected
                                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg scale-105 z-10'
                                            : 'border-transparent text-zinc-600 hover:bg-zinc-50 hover:border-zinc-200'
                                        }`}
                                >
                                    <span className="text-sm">{day}</span>
                                    {hasEntries && !isSelected && <div className="absolute top-2 right-2 w-1 h-1 bg-indigo-500 rounded-full" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Day Details */}
                <div className="w-full lg:w-96">
                    <div className="bg-zinc-900 rounded-2xl p-8 shadow-2xl min-h-[400px] text-white">
                        <header className="mb-8 border-b border-zinc-800 pb-6">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Visão Diária</p>
                            <h3 className="text-xl font-bold">
                                {selectedDate ? new Date(selectedDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : 'Selecione um dia'}
                            </h3>
                        </header>

                        <div className="space-y-6">
                            {entriesForSelected.length > 0 ? entriesForSelected.map(entry => (
                                <div key={entry.id} className="flex gap-4 group">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${entry.type === 'completed' ? 'bg-indigo-400' : 'bg-zinc-700 group-hover:bg-zinc-500'
                                        }`} />
                                    <p className="text-sm font-medium text-zinc-300 leading-relaxed">{entry.text}</p>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                    <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <p className="text-xs font-bold uppercase tracking-widest">Nada registrado</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
