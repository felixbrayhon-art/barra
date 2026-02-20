
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Source, ChatMessage, Flashcard, QuizQuestion, SyllabusTopic, WeeklyTask } from "../types";

// Initialize Gemini Client
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
const ai = new GoogleGenAI({ apiKey });

// --- PLANNING SERVICES ---

export const generateProjectContent = async (project: string): Promise<string> => {
  const prompt = `
    Você é um estrategista de produtividade especialista em Bullet Journal e GTD. 
    Crie uma estrutura organizacional para o projeto/contexto: "${project}".
    
    Estruture com:
    1. Objetivos Claros e Visão de Sucesso
    2. Lista de Próximas Ações (Next Actions)
    3. Referências e Ideias
    4. Possíveis Obstáculos
    
    Português do Brasil, sem emojis, tom profissional e direto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Erro ao organizar projeto.";
  } catch (error) {
    console.error("Project generation error:", error);
    throw error;
  }
};

export const generateChatResponse = async (
  query: string,
  sources: Source[],
  history: ChatMessage[]
): Promise<string> => {
  // Combine projects into a context block
  const context = sources.map(s => `--- PROJETO/CONTEXTO: ${s.title} ---\n${s.content}\n`).join("\n");

  const systemInstruction = `
    Você é o assistente do Bullet da Raíssa, um assistente de organização pessoal e produtividade de elite criado especialmente para a Raíssa.
    Seu foco é ajudar a Raíssa a planejar sua vida, organizar tarefas e vencer a procrastinação.
    Contexto atual de projetos:
    ${context}

    Sua missão:
    1. Ajudar o usuário a organizar o caos e transformar ideias em ações.
    2. Usar o contexto dos projetos para dar conselhos específicos de planejamento.
    3. Se o usuário estiver sobrecarregado, ajude-o a priorizar usando a Matriz de Eisenhower ou o método Bullet Journal.
    4. Seja motivador, mas direto ao ponto. Use listas e negrito. Não use emojis.
    
    RESPONDA SEMPRE EM PORTUGUÊS (BRASIL).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      }
    });

    return response.text || "Não consegui gerar uma resposta agora.";
  } catch (error) {
    console.error("Chat generation error:", error);
    throw error;
  }
};

export const generateSummary = async (sources: Source[]): Promise<string> => {
  if (sources.length === 0) throw new Error("Sem projetos definidos.");
  const context = sources.map(s => `PROJETO: ${s.title}\nCONTEÚDO:\n${s.content}`).join("\n\n");
  const prompt = `Crie um resumo executivo dos planos de ação abaixo:\n\n${context}`;
  const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return response.text || "Erro ao gerar resumo.";
};

export const generateWeeklyPlan = async (topics: SyllabusTopic[], availableTime: string): Promise<WeeklyTask[]> => {
  const topicList = topics.map(t => t.name).join(", ");
  const prompt = `Crie um cronograma de ações para esta semana baseado em: ${topicList}. Tempo: ${availableTime}. Retorne JSON array [{day, task}].`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            task: { type: Type.STRING }
          },
          required: ["day", "task"]
        }
      }
    }
  });
  const data = JSON.parse(response.text || "[]");
  return data.map((item: any) => ({
    id: crypto.randomUUID(),
    day: item.day,
    task: item.task,
    completed: false
  }));
};

// ... stub other functions if needed or keep existing for compatibility ...
export const generateFlashcards = async () => [];
export const generateQuiz = async () => [];
export const generateAudioOverview = async () => "";
export const decodeAudioData = async () => ({} as any);
export const verticalizeSyllabus = async () => [];
export const generateEbookContent = async () => "";
