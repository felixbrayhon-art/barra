import * as React from 'react';
import { BulletJournalState } from '../types';

interface FinanceTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

export const FinanceTracker: React.FC<FinanceTrackerProps> = ({ state, setState }) => {
    const [amount, setAmount] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [type, setType] = React.useState<'income' | 'expense'>('expense');

    const addTransaction = () => {
        if (!amount || !desc) return;
        const newTx = {
            id: crypto.randomUUID(),
            amount: parseFloat(amount),
            description: desc,
            type,
            date: new Date().toISOString()
        };
        setState({ ...state, transactions: [newTx, ...state.transactions] });
        setAmount('');
        setDesc('');
    };

    const balance = state.transactions.reduce((acc, tx) =>
        tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0
    );

    return (
        <div className="h-full overflow-y-auto p-10 font-inter bg-zinc-50/10">
            <div className="flex items-end justify-between mb-12 border-b border-zinc-100 pb-8 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight uppercase">FINANÇAS</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium italic">Gestão consciente do seu capital.</p>
                </div>
                <div className="text-[11px] font-black bg-zinc-900 text-white px-5 py-2 rounded-lg uppercase tracking-widest shadow-sm">
                    Fluxo de Caixa
                </div>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white border border-zinc-100 rounded-2xl p-8 shadow-sm col-span-2">
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">Nova Transação</h3>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-zinc-300"
                        >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                        </select>
                        <input
                            placeholder="Valor"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-zinc-300"
                        />
                    </div>
                    <input
                        placeholder="Descrição"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-medium mb-6 focus:outline-none focus:border-zinc-300"
                    />
                    <button
                        onClick={addTransaction}
                        className="w-full bg-zinc-900 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-zinc-200"
                    >
                        Registrar Transação
                    </button>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-8 text-white flex flex-col justify-between shadow-2xl">
                    <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Saldo Atual</p>
                        <p className="text-4xl font-black tracking-tight">R$ {balance.toFixed(2)}</p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-zinc-800">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Resumo</p>
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-zinc-400">Receitas</span>
                            <span className="text-indigo-400">+ R$ {state.transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-100">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Descrição</th>
                            <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {state.transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-zinc-50/50 transition-colors">
                                <td className="px-8 py-4 text-sm font-semibold text-zinc-700">{tx.description}</td>
                                <td className={`px-8 py-4 text-right text-sm font-bold ${tx.type === 'income' ? 'text-indigo-600' : 'text-zinc-900'}`}>
                                    {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
