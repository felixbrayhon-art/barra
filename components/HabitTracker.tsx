import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, Habit } from '../types';

interface HabitTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ state, setState }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const daysCount = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const monthPrefix = viewDate.toISOString().substring(0, 7); // YYYY-MM
    const currentDay = new Date().toISOString().split('T')[0];

    const toggleHabit = (habitId: string, date: string) => {
        setState({
            ...state,
            habits: state.habits.map(h => {
                if (h.id === habitId) {
                    const exists = h.completions.includes(date);
                    return {
                        ...h,
                        completions: exists
                            ? h.completions.filter(d => d !== date)
                            : [...h.completions, date]
                    };
                }
                return h;
            })
        });
    };

    const addHabit = () => {
        const name = prompt("Nome do novo hábito:");
        if (!name) return;
        const colors = ['#FFF9C4', '#FFE0B2', '#C8E6C9', '#B3E5FC', '#F8BBD0', '#D1C4E9']; // Pastel palette
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            name,
            color: colors[state.habits.length % colors.length],
            completions: []
        };
        setState({ ...state, habits: [...state.habits, newHabit] });
    };

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-black">Rastreador de Hábitos</h2>
                <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-black/5">
                    <button onClick={addHabit} className="bg-[#C8E6C9] text-[#2E7D32] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-sm border border-[#43A047]/20">
                        + Novo Hábito
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr>
                            <th className="text-left py-4 px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest w-48">Hábito</th>
                            {Array.from({ length: daysCount }, (_, i) => (
                                <th key={i} className={`py-4 text-center text-[10px] font-black uppercase tracking-tighter w-8 ${`${monthPrefix}-${String(i + 1).padStart(2, '0')}` === currentDay ? 'text-[#FB8C00]' : 'text-gray-300'
                                    }`}>
                                    {i + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {state.habits.map(habit => (
                            <tr key={habit.id} className="group hover:bg-gray-50/50">
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                                        <span className="text-sm font-bold text-gray-700">{habit.name}</span>
                                    </div>
                                </td>
                                {Array.from({ length: daysCount }, (_, i) => {
                                    const date = `${monthPrefix}-${String(i + 1).padStart(2, '0')}`;
                                    const completed = habit.completions.includes(date);
                                    return (
                                        <td key={i} className="py-2 text-center">
                                            <button
                                                onClick={() => toggleHabit(habit.id, date)}
                                                className={`w-6 h-6 rounded-lg transition-all border ${completed
                                                    ? 'shadow-lg scale-110'
                                                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                                                    }`}
                                                style={completed ? { backgroundColor: habit.color, borderColor: habit.color } : {}}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        {state.habits.length === 0 && (
                            <tr>
                                <td colSpan={daysCount + 1} className="py-20 text-center text-gray-400 italic text-sm">
                                    Adicione seu primeiro hábito para começar a rastrear.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
