import { Source, ChatMessage, SyllabusTopic, WeeklyTask } from "../types";

// Local mock services — no API key required

export const generateProjectContent = async (project: string): Promise<string> => {
    return `### ${project}\n\n1. **Objetivo**: Definir metas claras.\n2. **Ações**: Quebrar em pequenas tarefas diárias.\n3. **Notas**: Use o Bullet Journal para acompanhar.`;
};

export const generateChatResponse = async (
    query: string,
    sources: Source[],
    history: ChatMessage[]
): Promise<string> => {
    const lower = query.toLowerCase();
    if (lower.includes("oi") || lower.includes("olá")) {
        return "Olá! Como posso ajudar com sua organização hoje?";
    }
    return "Entendi. Estamos no modo offline, mas você pode usar todas as ferramentas de planejamento normalmente.";
};

export const generateSummary = async (sources: Source[]): Promise<string> => {
    return "Resumo: Você tem " + sources.length + " projetos ativos.";
};

export const generateWeeklyPlan = async (topics: SyllabusTopic[], availableTime: string): Promise<WeeklyTask[]> => {
    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    return days.map(day => ({
        id: crypto.randomUUID(),
        day,
        task: "Tarefa para " + day,
        completed: false
    }));
};

export const generateFlashcards = async () => [];
export const generateQuiz = async () => [];
export const generateAudioOverview = async () => "";
export const decodeAudioData = async () => ({} as any);
export const verticalizeSyllabus = async () => [];
export const generateEbookContent = async () => "";
