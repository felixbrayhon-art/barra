
import { Source, ChatMessage, Flashcard, QuizQuestion, SyllabusTopic, WeeklyTask } from "../types";

// --- LOCAL MOCK SERVICES (No API Key Required) ---

export const generateProjectContent = async (project: string): Promise<string> => {
  return `### Guia de Planejamento: ${project}\n\n1. **Objetivo**: Definir metas claras para ${project}.\n2. **Ações**: Quebrar em pequenas tarefas diárias.\n3. **Notas**: Use o Bullet Journal para rastrear o progresso.\n\n*Nota: O assistente está operando em modo offline.*`;
};

export const generateChatResponse = async (
  query: string,
  sources: Source[],
  history: ChatMessage[]
): Promise<string> => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("oi") || lowerQuery.includes("olá") || lowerQuery.includes("bom dia")) {
    return "Olá! Sou seu assistente de produtividade local. Como posso ajudar você a organizar seu Bullet Journal hoje?";
  }

  if (lowerQuery.includes("ajuda") || lowerQuery.includes("como usar")) {
    return "Você pode usar as abas acima para planejar seu dia, semana e mês. O Bullet Journal (📓 Diário) é o coração do app!";
  }

  return "Entendi! Como estamos no modo offline (sem chave de API), minhas respostas são limitadas, mas você pode continuar usando todas as ferramentas de planejamento normalmente.";
};

export const generateSummary = async (sources: Source[]): Promise<string> => {
  return "Resumo offline: Você tem " + sources.length + " projetos ativos no momento.";
};

export const generateWeeklyPlan = async (topics: SyllabusTopic[], availableTime: string): Promise<WeeklyTask[]> => {
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  return days.map(day => ({
    id: crypto.randomUUID(),
    day,
    task: "Tarefa planejada para " + day,
    completed: false
  }));
};

export const generateFlashcards = async () => [];
export const generateQuiz = async () => [];
export const generateAudioOverview = async () => "";
export const decodeAudioData = async () => ({} as any);
export const verticalizeSyllabus = async () => [];
export const generateEbookContent = async () => "";
