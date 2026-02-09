
import React, { useState } from 'react';
import { StudySession, MockExam, SyllabusTopic } from '../types';

interface DashboardProps {
  sessions: StudySession[];
  mockExams: MockExam[];
  setMockExams: (exams: MockExam[]) => void;
  topics: SyllabusTopic[];
}

export const Dashboard: React.FC<DashboardProps> = ({ sessions, mockExams, setMockExams, topics }) => {
  const [newMock, setNewMock] = useState({ title: '', score: 0, total: 100 });

  const totalHours = sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 3600;
  const studiedTopicsCount = topics.filter(t => t.studied).length;
  const progressPercent = topics.length > 0 ? Math.round((studiedTopicsCount / topics.length) * 100) : 0;
  
  // Calculate revisions needed (simple logic: studied but mastery < 50)
  const revisionsNeeded = topics.filter(t => t.studied && t.masteryLevel < 50).length;

  const handleAddMock = () => {
      if(!newMock.title) return;
      const exam: MockExam = {
          id: crypto.randomUUID(),
          title: newMock.title,
          score: newMock.score,
          totalQuestions: newMock.total,
          date: Date.now()
      };
      setMockExams([...mockExams, exam]);
      setNewMock({ title: '', score: 0, total: 100 });
  };

  const deleteMock = (id: string) => {
      setMockExams(mockExams.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1115] overflow-y-auto p-6 md:p-10 pb-32">
         <h2 className="text-3xl font-black text-white mb-8">Performance<span className="text-[#E6FF57]">.</span></h2>

         {/* STATS CARDS */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
             <div className="bg-[#1C1F26] p-5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Horas Líquidas</p>
                 <p className="text-3xl font-black text-white">{totalHours.toFixed(1)}<span className="text-sm text-gray-500 ml-1">h</span></p>
             </div>
             <div className="bg-[#1C1F26] p-5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Edital Concluído</p>
                 <p className="text-3xl font-black text-[#E6FF57]">{progressPercent}%</p>
             </div>
             <div className="bg-[#1C1F26] p-5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tópicos Vencidos</p>
                 <p className="text-3xl font-black text-white">{studiedTopicsCount}<span className="text-sm text-gray-500 ml-1">/{topics.length}</span></p>
             </div>
             <div className="bg-[#1C1F26] p-5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Revisões Pendentes</p>
                 <p className="text-3xl font-black text-red-400">{revisionsNeeded}</p>
             </div>
         </div>

         {/* MOCK EXAMS */}
         <div className="bg-[#1C1F26] border border-white/5 rounded-[2rem] p-8 mb-8">
             <h3 className="text-xl font-bold text-white mb-6">Histórico de Simulados</h3>
             
             <div className="flex flex-col md:flex-row gap-4 mb-6 bg-[#0F1115] p-4 rounded-xl border border-white/5">
                 <input 
                    className="flex-1 bg-transparent border-b border-white/20 text-white pb-2 outline-none focus:border-[#E6FF57]"
                    placeholder="Nome do Simulado..."
                    value={newMock.title}
                    onChange={e => setNewMock({...newMock, title: e.target.value})}
                 />
                 <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500">Acertos:</span>
                     <input 
                        type="number"
                        className="w-16 bg-transparent border-b border-white/20 text-white pb-2 outline-none text-center"
                        value={newMock.score}
                        onChange={e => setNewMock({...newMock, score: parseInt(e.target.value) || 0})}
                     />
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500">Total:</span>
                     <input 
                        type="number"
                        className="w-16 bg-transparent border-b border-white/20 text-white pb-2 outline-none text-center"
                        value={newMock.total}
                        onChange={e => setNewMock({...newMock, total: parseInt(e.target.value) || 0})}
                     />
                 </div>
                 <button 
                    onClick={handleAddMock}
                    className="bg-[#E6FF57] text-black px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform"
                 >
                     Adicionar
                 </button>
             </div>

             <div className="space-y-3">
                 {mockExams.map(mock => {
                     const percent = Math.round((mock.score / mock.totalQuestions) * 100);
                     let color = "text-red-400";
                     if(percent >= 80) color = "text-green-400";
                     else if (percent >= 60) color = "text-yellow-400";

                     return (
                         <div key={mock.id} className="flex items-center justify-between p-4 bg-[#0F1115] rounded-xl border border-white/5">
                             <div>
                                 <p className="font-bold text-white">{mock.title}</p>
                                 <p className="text-xs text-gray-500">{new Date(mock.date).toLocaleDateString()}</p>
                             </div>
                             <div className="flex items-center gap-4">
                                 <div className="text-right">
                                     <span className={`text-xl font-black ${color}`}>{percent}%</span>
                                     <p className="text-[10px] text-gray-500">{mock.score}/{mock.totalQuestions}</p>
                                 </div>
                                 <button onClick={() => deleteMock(mock.id)} className="text-gray-600 hover:text-red-400">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                 </button>
                             </div>
                         </div>
                     )
                 })}
                 {mockExams.length === 0 && <p className="text-center text-gray-600 py-4">Nenhum simulado registrado.</p>}
             </div>
         </div>
    </div>
  );
};
