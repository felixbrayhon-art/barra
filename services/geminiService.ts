
import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";
import { Source, ChatMessage, Flashcard, QuizQuestion, SyllabusTopic, WeeklyTask } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a comprehensive study guide based on a topic name.
 */
export const generateTopicContent = async (topic: string): Promise<string> => {
  const prompt = `
    Você é um professor especialista criando um material didático completo sobre: "${topic}".
    
    Crie um resumo estruturado e abrangente sobre este assunto.
    O conteúdo deve ser suficiente para um aluno estudar para uma prova.
    
    Estruture com:
    1. Introdução e Definição
    2. Conceitos Principais
    3. Detalhes Importantes, Datas ou Fórmulas (se aplicável)
    4. Conclusão / Resumo Final
    
    Escreva em Português do Brasil, de forma didática e clara. Não use emojis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar o conteúdo para este tema.";
  } catch (error) {
    console.error("Error generating topic content:", error);
    throw error;
  }
};

/**
 * Generates a chat response acting as a tutor.
 */
export const generateChatResponse = async (
  query: string,
  sources: Source[],
  history: ChatMessage[]
): Promise<string> => {
  // Combine sources into a context block
  const context = sources.map(s => `--- TEMA DE ESTUDO: ${s.title} ---\n${s.content}\n`).join("\n");

  const systemInstruction = `
    Você é o Barra Estudo, um tutor particular de IA divertido e extremamente didático.
    O aluno está estudando os seguintes temas:
    ${context}

    Sua missão:
    1. Ensinar o aluno sobre a dúvida dele.
    2. Usar o contexto fornecido como base, mas EXPANDIR com seu próprio conhecimento para dar uma aula completa.
    3. Se o aluno pedir um resumo, faça um resumo incrível.
    4. Se o aluno pedir para explicar como se ele tivesse 5 anos, faça isso.
    5. Use listas e negrito para facilitar a leitura. Não use emojis.
    
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

/**
 * Generates a structured summary of all sources.
 */
export const generateSummary = async (sources: Source[]): Promise<string> => {
    if (sources.length === 0) throw new Error("Sem temas definidos.");

    const context = sources.map(s => `TEMA: ${s.title}\nCONTEÚDO:\n${s.content}`).join("\n\n");

    const prompt = `
        Atue como um especialista acadêmico. Seu objetivo é criar um RESUMO EXECUTIVO e INTELIGENTE de todo o material abaixo.
        
        O aluno precisa revisar essa matéria rapidamente.
        
        Estrutura Obrigatória (use Markdown):
        # Resumo Geral
        [Uma introdução de 2-3 parágrafos sintetizando os temas]

        ## Pontos Chave
        - [Lista com bullets dos conceitos mais cruciais]
        - [Foque em definições e relações de causa/efeito]

        ## Mapa Mental em Texto
        [Crie uma estrutura hierárquica usando bullets aninhados para conectar os conceitos]

        ## Conclusão Prática
        [O que é essencial levar dessa aula]

        MATERIAL:
        ${context}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Não foi possível gerar o resumo.";
    } catch (error) {
        console.error("Summary generation error:", error);
        throw error;
    }
};

/**
 * Generates Flashcards from sources
 */
export const generateFlashcards = async (sources: Source[]): Promise<Flashcard[]> => {
    if (sources.length === 0) throw new Error("Sem temas definidos.");

    const context = sources.map(s => s.content).join("\n\n").substring(0, 50000);

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Com base no material de estudo abaixo, crie 8 flashcards didáticos para revisão ativa. Foque no que é mais provável de cair em uma prova. Idioma: Português do Brasil.\n\nMATERIAL:\n${context}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        front: { type: Type.STRING, description: "O conceito, termo ou pergunta" },
                        back: { type: Type.STRING, description: "A explicação, definição ou resposta" }
                    },
                    required: ["front", "back"]
                }
            }
        }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    try {
        return JSON.parse(jsonText) as Flashcard[];
    } catch (e) {
        console.error("Failed to parse flashcards JSON", e);
        return [];
    }
};

/**
 * Generates a Quiz from sources
 */
export const generateQuiz = async (sources: Source[]): Promise<QuizQuestion[]> => {
    if (sources.length === 0) throw new Error("Sem temas definidos.");

    const context = sources.map(s => s.content).join("\n\n").substring(0, 50000);

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Atue como um professor elaborando uma prova. Crie 5 questões de múltipla escolha baseadas no assunto estudado. Nível: Médio/Difícil. Idioma: Português do Brasil.\n\nASSUNTO:\n${context}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "4 opções de resposta"
                        },
                        correctAnswer: { 
                            type: Type.STRING, 
                            description: "A resposta correta exata, idêntica a uma das opções" 
                        },
                        explanation: {
                            type: Type.STRING,
                            description: "Uma explicação didática de por que a resposta está correta e por que as outras estão erradas."
                        }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                }
            }
        }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    try {
        return JSON.parse(jsonText) as QuizQuestion[];
    } catch (e) {
        console.error("Failed to parse quiz JSON", e);
        return [];
    }
};

/**
 * Generates a podcast/class script and converts to audio.
 */
export const generateAudioOverview = async (sources: Source[]): Promise<string> => {
  if (sources.length === 0) {
    throw new Error("Nenhum tema para a aula.");
  }

  const context = sources.map(s => `--- TEMA: ${s.title} ---\n${s.content}\n`).join("\n");

  const scriptPrompt = `
    Crie o roteiro de uma "Aula em Podcast" sobre os temas abaixo.
    Apresentadores: Professor Alex (especialista, calmo) e Jamie (aluno curioso, faz perguntas boas).
    Objetivo: Ensinar a matéria de forma profunda mas engajante.
    
    Estrutura:
    - Introdução ao tema.
    - Explicação dos conceitos principais.
    - Exemplos práticos.
    - Resumo final.

    Mantenha o roteiro entre 300-400 palavras.
    IDIOMA: PORTUGUÊS DO BRASIL.
    
    Formate estritamente como:
    Alex: [Fala]
    Jamie: [Fala]
    ...

    CONTEÚDO DA AULA:
    ${context}
  `;

  const scriptResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: scriptPrompt,
  });

  const script = scriptResponse.text;
  if (!script) throw new Error("Falha ao gerar o roteiro da aula.");

  const audioResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: script }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: 'Alex',
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } 
            },
            {
              speaker: 'Jamie',
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
            }
          ]
        }
      }
    },
  });

  const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  
  if (!base64Audio) {
    throw new Error("Falha ao gerar áudio da aula.");
  }

  return base64Audio;
};

// Helper to decode audio
export const decodeAudioData = async (
  base64String: string,
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const pcmData = new Int16Array(bytes.buffer);
  const numChannels = 1; 
  const sampleRate = 24000; 
  
  const frameCount = pcmData.length / numChannels;
  
  const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);
  
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = pcmData[i * numChannels + channel] / 32768.0;
    }
  }

  return buffer;
};

// --- NEW SERVICES ---

export const verticalizeSyllabus = async (rawText: string): Promise<SyllabusTopic[]> => {
    const prompt = `
      Você é um especialista em concursos e organização de estudos.
      Analise o texto do edital/ementa abaixo e quebre-o em uma lista lógica e verticalizada de tópicos para estudo.
      
      Agrupe por categoria (ex: Direito Constitucional, Matemática, etc).
      
      Retorne APENAS um JSON array.
      
      EDITAL BRUTO:
      ${rawText}
    `;

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
                        name: { type: Type.STRING, description: "Nome do tópico específico" },
                        category: { type: Type.STRING, description: "Disciplina ou Categoria macro" }
                    },
                    required: ["name", "category"]
                }
            }
        }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    try {
        const data = JSON.parse(jsonText);
        // Add default fields
        return data.map((item: any) => ({
            id: crypto.randomUUID(),
            name: item.name,
            category: item.category,
            masteryLevel: 0,
            studied: false,
            lastRevision: null
        }));
    } catch (e) {
        console.error("Failed to parse syllabus", e);
        return [];
    }
};

export const generateWeeklyPlan = async (topics: SyllabusTopic[], availableTime: string): Promise<WeeklyTask[]> => {
    const topicList = topics.filter(t => !t.studied).map(t => t.name).slice(0, 20).join(", "); // Limit to next 20 topics
    
    const prompt = `
      Crie um quadro de estudos semanal baseado nestes tópicos: ${topicList}.
      Tempo disponível descrito pelo aluno: "${availableTime}".
      
      Inclua tarefas de estudo teórico e revisões. Distribua de Segunda a Domingo. Não use emojis.
      
      Retorne APENAS JSON.
    `;

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
                        day: { type: Type.STRING, enum: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] },
                        task: { type: Type.STRING, description: "Descrição curta da tarefa (ex: Estudar Crase)" }
                    },
                    required: ["day", "task"]
                }
            }
        }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    try {
        const data = JSON.parse(jsonText);
        return data.map((item: any) => ({
            id: crypto.randomUUID(),
            day: item.day,
            task: item.task,
            completed: false
        }));
    } catch(e) {
        return [];
    }
};

export const generateEbookContent = async (topicName: string): Promise<string> => {
    const prompt = `
      Escreva um E-BOOK completo e aprofundado sobre: "${topicName}".
      
      Estrutura do E-book (Markdown):
      # Título do E-book
      ## Introdução
      ## Capítulos (Desenvolva o tema profundamente com exemplos, jurisprudência se for direito, fórmulas se for exatas)
      ## Questões Comentadas (3 questões)
      ## Resumo Estratégico
      
      O tom deve ser profissional, denso e focado em alta performance para provas.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });

    return response.text || "Erro ao gerar e-book.";
};
