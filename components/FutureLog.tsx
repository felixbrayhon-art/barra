
import * as React from 'react';
import { BulletJournalState } from '../types';

interface FutureLogProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const FutureLog: React.FC<FutureLogProps> = ({ state, setState }) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const currentYear = new Date().getFullYear();

    const getEntriesForMonth = (monthIdx: number) => {
        const monthPrefix = `${currentYear}-${String(monthIdx + 1).padStart(2, '0')}`;
        return state.entries.filter(e => e.date.startsWith(monthPrefix));
    };

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-black">Future Log {currentYear}</h2>
                <div className="bg-black text-[#E6FF57] px-6 py-2 rounded-full text-xs font-bold">
                    VISÃO ANUAL
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {months.map((month, idx) => (
                    <div key={month} className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm min-h-[400px] flex flex-col">
                        <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6 pb-2 border-b-2 border-[#E6FF57]">
                            {month}
                        </h3>

                        <div className="flex-1 space-y-4">
                            {getEntriesForMonth(idx).map(entry => (
                                <div key={entry.id} className="flex gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 mt-1 whitespace-nowrap">
                                        {new Date(entry.date).getDate() + 1}
                                    </span>
                                    <p className="text-xs font-medium text-gray-700 leading-tight">
                                        {entry.text}
                                    </p>
                                </div>
                            ))}
                            {getEntriesForMonth(idx).length === 0 && (
                                <p className="text-[10px] text-gray-300 italic py-10 text-center">Nenhum evento futuro</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
