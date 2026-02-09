
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
  CHAT = 'CHAT',
  SUMMARY = 'SUMMARY',
  AUDIO = 'AUDIO',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
  // New Tabs
  PLANNER = 'PLANNER',
  SYLLABUS = 'SYLLABUS',
  DASHBOARD = 'DASHBOARD'
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
