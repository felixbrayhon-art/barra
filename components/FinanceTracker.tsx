
import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, FinanceEntry } from '../types';

interface FinanceTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const FinanceTracker: React.FC<FinanceTrackerProps> = ({ state, setState }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('Geral');

    const addEntry = () => {
        if (!description || !amount) return;
        const newEntry: FinanceEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            description,
            amount: parseFloat(amount),
            type,
            category
        };
        setState({ ...state, finances: [newEntry, ...state.finances] });
        setDescription('');
        setAmount('');
    };

    const totals = state.finances.reduce((acc, curr) => {
        if (curr.type === 'income') acc.income += curr.amount;
        else acc.expense += curr.amount;
        return acc;
    }, { income: 0, expense: 0 });

    const balance = totals.income - totals.expense;

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10">
            <h2 className="text-3xl font-black text-black mb-8">Controle Financeiro</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Entradas</p>
                    <p className="text-3xl font-black text-green-500">R$ {totals.income.toFixed(2)}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Saídas</p>
                    <p className="text-3xl font-black text-red-500">R$ {totals.expense.toFixed(2)}</p>
                </div>
                <div className="bg-black p-8 rounded-[2.5rem] shadow-xl">
                    <p className="text-[10px] font-black text-[#E6FF57]/50 uppercase tracking-widest mb-2">Saldo</p>
                    <p className="text-3xl font-black text-[#E6FF57]">R$ {balance.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-80 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Nova Transação</h3>
                        <div className="space-y-4">
                            <input
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Descrição"
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="Valor"
                                    className="flex-1 px-5 py-3 rounded-xl bg-gray-50 border-none text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                />
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value as 'income' | 'expense')}
                                    className="px-4 py-3 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase transition-all outline-none"
                                >
                                    <option value="expense">📉 Saída</option>
                                    <option value="income">📈 Entrada</option>
                                </select>
                            </div>
                            <button
                                onClick={addEntry}
                                className="w-full bg-black text-[#E6FF57] py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                                <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</th>
                                <th className="text-right py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {state.finances.map(f => (
                                <tr key={f.id} className="group">
                                    <td className="py-4 text-xs font-bold text-gray-400">{new Date(f.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="py-4 text-sm font-bold text-gray-700">{f.description}</td>
                                    <td className={`py-4 text-right text-sm font-black ${f.type === 'income' ? 'text-green-500' : 'text-gray-900'}`}>
                                        {f.type === 'income' ? '+' : '-'} R$ {f.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
