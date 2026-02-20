import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, MoodEntry } from '../types';

interface MoodTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ state, setState }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const moods: { type: MoodEntry['mood'], emoji: string, color: string, label: string }[] = [
        { type: 'happy', emoji: '😊', color: '#FFF9C4', label: 'Feliz' },
        { type: 'neutral', emoji: '😐', color: '#F5F5F5', label: 'Neutro' },
        { type: 'sad', emoji: '😔', color: '#FFE0B2', label: 'Triste' },
        { type: 'productive', emoji: '🚀', color: '#C8E6C9', label: 'Foco' },
        { type: 'tired', emoji: '🥱', color: '#F8BBD0', label: 'Cansada' }
    ];

    const currentDay = new Date().toISOString().split('T')[0];
    const monthPrefix = viewDate.toISOString().substring(0, 7);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const daysCount = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());

    const setMood = (mood: MoodEntry['mood']) => {
        const date = currentDay;
        const existing = state.moods.findIndex(m => m.date === date);
        let newMoods = [...state.moods];

        if (existing >= 0) {
            newMoods[existing].mood = mood;
        } else {
            newMoods.push({ date, mood });
        }

        setState({ ...state, moods: newMoods });
    };

    const getMoodForDate = (date: string) => state.moods.find(m => m.date === date);

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10">
            <h2 className="text-3xl font-black text-black mb-10">Como você está hoje?</h2>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 mb-10">
                <div className="grid grid-cols-5 gap-6 max-w-2xl mx-auto">
                    {moods.map(m => (
                        <button
                            key={m.type}
                            onClick={() => setMood(m.type)}
                            className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] transition-all hover:scale-110 ${getMoodForDate(currentDay)?.mood === m.type
                                ? 'bg-black text-white shadow-2xl'
                                : 'bg-gray-50 text-gray-400 hover:bg-black/5'
                                }`}
                        >
                            <span className="text-4xl">{m.emoji}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-black/5">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 text-center italic">Mapa do Humor - Este Mês</h3>
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                    {Array.from({ length: daysCount }, (_, i) => {
                        const date = `${monthPrefix}-${String(i + 1).padStart(2, '0')}`;
                        const entry = getMoodForDate(date);
                        const moodInfo = entry ? moods.find(m => m.type === entry.mood) : null;

                        return (
                            <div
                                key={date}
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all border border-black/5 bg-gray-50 group relative"
                                style={moodInfo ? { backgroundColor: moodInfo.color + '30', borderColor: moodInfo.color + '60' } : {}}
                            >
                                {moodInfo ? moodInfo.emoji : <span className="text-[10px] font-bold text-gray-200">{i + 1}</span>}

                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 font-black">
                                    {new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
