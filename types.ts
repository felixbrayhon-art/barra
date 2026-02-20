
export interface Source {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'file';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
  timestamp: number;
}

export enum AppTab {
  INICIO = 'INICIO',
  DIARIO = 'DIARIO',
  SEMANAL = 'SEMANAL',
  MENSAL = 'MENSAL',
  FUTURO = 'FUTURO',
  COLECOES = 'COLECOES',
  HABITOS = 'HABITOS',
  HUMOR = 'HUMOR',
  FINANCAS = 'FINANCAS',
  GRATIDAO = 'GRATIDAO',
  CHAT = 'CHAT'
}

export interface AudioState {
  isLoading: boolean;
  isPlaying: boolean;
  audioBuffer: AudioBuffer | null;
  duration: number;
  currentTime: number;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string; // Campo novo para feedback
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface SavedItem {
  id: string;
  folderId: string;
  type: AppTab | 'EBOOK';
  title: string;
  data: any;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
}

// --- NOVOS TIPOS ---

export interface SyllabusTopic {
  id: string;
  name: string;
  category: string;
  masteryLevel: number; // 0 to 100
  studied: boolean;
  lastRevision: number | null;
}

export interface StudySession {
  id: string;
  date: number;
  durationSeconds: number; // Horas líquidas
  topicId?: string;
}

export interface MockExam {
  id: string;
  title: string;
  date: number;
  score: number;
  totalQuestions: number;
}

export interface ExamDate {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
}

export interface WeeklyTask {
  id: string;
  day: string; // "Segunda", "Terça"...
  task: string;
  completed: boolean;
}

// --- BULLET JOURNAL TYPES ---

export type BulletType = 'task' | 'note' | 'event' | 'completed' | 'migrated' | 'cancelled';

export interface BulletEntry {
  id: string;
  type: BulletType;
  text: string;
  date: string; // YYYY-MM-DD
  collectionId?: string;
}

export interface Collection {
  id: string;
  name: string;
  icon?: string;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  completions: string[]; // List of YYYY-MM-DD
}

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: 'happy' | 'neutral' | 'sad' | 'productive' | 'tired';
}

export interface FinanceEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface BulletJournalState {
  entries: BulletEntry[];
  collections: Collection[];
  habits: Habit[];
  moods: MoodEntry[];
  finances: FinanceEntry[];
  gratitude: { date: string; text: string }[];
}
