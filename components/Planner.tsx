
import React, { useState, useEffect } from 'react';
import { WeeklyTask, ExamDate, StudySession } from '../types';
import { generateWeeklyPlan } from '../services/geminiService';

interface PlannerProps {
  tasks: WeeklyTask[];
  setTasks: (tasks: WeeklyTask[]) => void;
  exams: ExamDate[];
  setExams: (exams: ExamDate[]) => void;
  onSessionComplete: (duration: number) => void; // Seconds
  syllabusTopics: any[];
}

export const Planner: React.FC<PlannerProps> = ({ 
    tasks, setTasks, exams, setExams, onSessionComplete, syllabusTopics 
}) => {
  // Stopwatch
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0); // seconds
  const [sessionType, setSessionType] = useState('Teoria');

  // Plan Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [availability, setAvailability] = useState('2 horas por dia à noite');

  // Exam Form
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => {
    if (isActive) {
        // Stop
        setIsActive(false);
        if (time > 60) { // Only save if > 1 min
            if(confirm(`Salvar sessão de ${Math.floor(time/60)} minutos?`)) {
                onSessionComplete(time);
                setTime(0);
            }
        } else {
            setTime(0); // Discard
        }
    } else {
        setIsActive(true);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGeneratePlan = async () => {
      if (syllabusTopics.length === 0) {
          alert("Adicione tópicos no Edital primeiro!");
          return;
      }
      setIsGenerating(true);
      try {
          const newPlan = await generateWeeklyPlan(syllabusTopics, availability);
          setTasks(newPlan);
      } catch (e) {
          alert("Erro ao gerar plano.");
      } finally {
          setIsGenerating(false);
      }
  };

  const toggleTask = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t));
  };

  const addExam = () => {
      if (!examName || !examDate) return;
      setExams([...exams, { id: crypto.randomUUID(), title: examName, date: examDate }]);
      setExamName('');
      setExamDate('');
  };

  const deleteExam = (id: string) => {
      setExams(exams.filter(e => e.id !== id));
  };

  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  return (
    <div className="flex flex-col h-full bg-[#0F1115] overflow-y-auto p-6 md:p-10 pb-32">
        <h2 className="text-3xl font-black text-white mb-8">Planejador<span className="text-[#E6FF57]">.</span></h2>

        {/* STOPWATCH SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#1C1F26] border border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <div className={`absolute inset-0 bg-[#E6FF57] opacity-5 transition-opacity duration-1000 ${isActive ? 'animate-pulse' : 'hidden'}`}></div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 z-10">Cronômetro Líquido</h3>
                
                <div className="text-6xl font-black text-white font-mono mb-6 z-10 tabular-nums tracking-tight">
                    {formatTime(time)}
                </div>

                <div className="flex gap-3 z-10 w-full">
                     <button 
                        onClick={toggleTimer}
                        className={`flex-1 py-4 rounded-xl font-black text-lg transition-all ${isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#E6FF57] text-black hover:scale-[1.02]'}`}
                    >
                        {isActive ? 'PARAR & SALVAR' : 'INICIAR ESTUDO'}
                    </button>
                </div>
                <div className="flex gap-2 mt-4 z-10">
                    {['Teoria', 'Questões', 'Revisão'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setSessionType(type)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${sessionType === type ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* EXAM TRACKER */}
            <div className="bg-[#1C1F26] border border-white/5 rounded-[2rem] p-8">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Próximas Provas</h3>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        className="flex-1 bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        placeholder="Nome da prova..."
                        value={examName}
                        onChange={e => setExamName(e.target.value)}
                    />
                    <input 
                        type="date"
                        className="bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        value={examDate}
                        onChange={e => setExamDate(e.target.value)}
                    />
                    <button onClick={addExam} className="bg-[#E6FF57] text-black p-2 rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                    {exams.map(exam => {
                        const daysLeft = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        return (
                            <div key={exam.id} className="flex items-center justify-between bg-[#0F1115] p-3 rounded-xl border border-white/5">
                                <div>
                                    <p className="font-bold text-white text-sm">{exam.title}</p>
                                    <p className="text-xs text-gray-500">{new Date(exam.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-black px-2 py-1 rounded-md ${daysLeft < 7 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {daysLeft} dias
                                    </span>
                                    <button onClick={() => deleteExam(exam.id)} className="text-gray-600 hover:text-red-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {exams.length === 0 && <p className="text-center text-gray-600 text-xs py-4">Nenhuma prova marcada.</p>}
                </div>
            </div>
        </div>

        {/* WEEKLY PLANNER */}
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white">Quadro Semanal Automático</h3>
                <div className="flex gap-2 w-full md:w-auto">
                    <input 
                        className="flex-1 md:w-64 bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                        placeholder="Tempo livre (ex: 3h/dia manhã)"
                        value={availability}
                        onChange={e => setAvailability(e.target.value)}
                    />
                    <button 
                        onClick={handleGeneratePlan}
                        disabled={isGenerating}
                        className="bg-[#E6FF57] text-black px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        {isGenerating ? 'Gerando...' : 'Gerar Cronograma'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {days.map(day => {
                    const dayTasks = tasks.filter(t => t.day === day);
                    return (
                        <div key={day} className="bg-[#1C1F26] border border-white/5 rounded-2xl p-4 min-h-[150px]">
                            <h4 className="font-black text-[#E6FF57] uppercase text-xs mb-3 tracking-wider">{day}</h4>
                            <div className="space-y-2">
                                {dayTasks.map(task => (
                                    <div 
                                        key={task.id} 
                                        onClick={() => toggleTask(task.id)}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${task.completed ? 'bg-green-900/10 border-green-500/20 opacity-50' : 'bg-[#0F1115] border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                                            {task.completed && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className={`text-xs font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{task.task}</span>
                                    </div>
                                ))}
                                {dayTasks.length === 0 && <p className="text-[10px] text-gray-700 italic">Sem tarefas</p>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
};
