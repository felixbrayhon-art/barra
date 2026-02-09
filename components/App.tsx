
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { AudioPlayer } from './components/AudioPlayer';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizMode } from './components/QuizMode';
import { SplashScreen } from './components/SplashScreen';
import { SummaryView } from './components/SummaryView';
import { Onboarding } from './components/Onboarding';
import { Planner } from './components/Planner';
import { SyllabusManager } from './components/SyllabusManager';
import { Dashboard } from './components/Dashboard';

import { Source, AppTab, Folder, SavedItem, UserProfile, SyllabusTopic, StudySession, MockExam, ExamDate, WeeklyTask } from './types';

function App() {
  const [loading, setLoading] = useState(true);
  
  // -- USER PROFILE --
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
      try { return JSON.parse(localStorage.getItem('barra_user_profile') || 'null'); } catch (e) { return null; }
  });

  // -- EXISTING DATA --
  const [sources, setSources] = useState<Source[]>(() => {
    try { return JSON.parse(localStorage.getItem('barra_sources') || '[]'); } catch (e) { return []; }
  });
  const [folders, setFolders] = useState<Folder[]>(() => {
    try { return JSON.parse(localStorage.getItem('barra_folders') || '[]'); } catch (e) { return []; }
  });
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('barra_saved_items') || '[]'); } catch (e) { return []; }
  });

  // -- NEW DATA STATES --
  const [topics, setTopics] = useState<SyllabusTopic[]>(() => {
      try { return JSON.parse(localStorage.getItem('barra_syllabus') || '[]'); } catch (e) { return []; }
  });
  const [sessions, setSessions] = useState<StudySession[]>(() => {
      try { return JSON.parse(localStorage.getItem('barra_sessions') || '[]'); } catch (e) { return []; }
  });
  const [mockExams, setMockExams] = useState<MockExam[]>(() => {
      try { return JSON.parse(localStorage.getItem('barra_mocks') || '[]'); } catch (e) { return []; }
  });
  const [examDates, setExamDates] = useState<ExamDate[]>(() => {
      try { return JSON.parse(localStorage.getItem('barra_exams') || '[]'); } catch (e) { return []; }
  });
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(() => {
      try { return JSON.parse(localStorage.getItem('barra_tasks') || '[]'); } catch (e) { return []; }
  });

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.PLANNER); // Default to Planner now
  const [loadedContent, setLoadedContent] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Persistence
  useEffect(() => { localStorage.setItem('barra_sources', JSON.stringify(sources)); }, [sources]);
  useEffect(() => { localStorage.setItem('barra_folders', JSON.stringify(folders)); }, [folders]);
  useEffect(() => { localStorage.setItem('barra_saved_items', JSON.stringify(savedItems)); }, [savedItems]);
  useEffect(() => { if(userProfile) localStorage.setItem('barra_user_profile', JSON.stringify(userProfile)); }, [userProfile]);
  
  // New Persistence
  useEffect(() => { localStorage.setItem('barra_syllabus', JSON.stringify(topics)); }, [topics]);
  useEffect(() => { localStorage.setItem('barra_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('barra_mocks', JSON.stringify(mockExams)); }, [mockExams]);
  useEffect(() => { localStorage.setItem('barra_exams', JSON.stringify(examDates)); }, [examDates]);
  useEffect(() => { localStorage.setItem('barra_tasks', JSON.stringify(weeklyTasks)); }, [weeklyTasks]);

  // Handlers
  const handleProfileCreate = (profile: UserProfile) => {
      setUserProfile(profile);
  };

  const handleAddSource = (source: Source) => {
    setSources((prev) => [source, ...prev]);
  };

  const handleRemoveSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreateFolder = (name: string): string => {
      const newFolder: Folder = { id: crypto.randomUUID(), name, createdAt: Date.now() };
      setFolders(prev => [...prev, newFolder]);
      return newFolder.id;
  };

  const handleSaveItem = (item: Omit<SavedItem, 'id' | 'createdAt'>) => {
      const newItem: SavedItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
      setSavedItems(prev => [newItem, ...prev]);
      // If it's an EBOOK or standard save, we notify user.
      if (item.type !== 'EBOOK') { 
        alert("Salvo com sucesso!");
      }
  };

  const handleLoadItem = (item: SavedItem) => {
      setLoadedContent(item.data);
      if (item.type === 'EBOOK') {
          setActiveTab(AppTab.SUMMARY); // Load E-books into Summary view
      } else {
          setActiveTab(item.type as AppTab);
      }
  };

  const handleDeleteItem = (id: string) => {
      if(confirm("Excluir este item?")) {
          setSavedItems(prev => prev.filter(i => i.id !== id));
      }
  };

  const handleDeleteFolder = (id: string) => {
      if(confirm("Excluir pasta e todos os itens dentro?")) {
          setFolders(prev => prev.filter(f => f.id !== id));
          setSavedItems(prev => prev.filter(i => i.folderId !== id));
      }
  };

  const handleSessionComplete = (duration: number) => {
      setSessions([...sessions, { id: crypto.randomUUID(), date: Date.now(), durationSeconds: duration }]);
  };

  const handleResetApp = () => {
    if (confirm("Tem certeza? Isso apagará todos os seus dados e perfil.")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  const getTabClass = (tab: AppTab) => `
    relative px-4 py-2 text-xs font-bold rounded-[1rem] transition-all duration-300 flex items-center space-x-2 whitespace-nowrap
    ${activeTab === tab 
      ? 'bg-[#E6FF57] text-black shadow-lg shadow-yellow-400/20' 
      : 'text-gray-400 hover:text-white hover:bg-white/5'}
  `;

  if (loading) return <SplashScreen />;
  if (!userProfile) return <Onboarding onComplete={handleProfileCreate} />;

  return (
    <div className="flex h-screen bg-[#0F1115] overflow-hidden font-poppins animate-in fade-in duration-700">
      <Sidebar 
        userProfile={userProfile}
        sources={sources} 
        folders={folders}
        savedItems={savedItems}
        onAddSource={handleAddSource} 
        onRemoveSource={handleRemoveSource}
        onResetApp={handleResetApp}
        onCreateFolder={handleCreateFolder}
        onLoadItem={handleLoadItem}
        onDeleteItem={handleDeleteItem}
        onDeleteFolder={handleDeleteFolder}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Scrollable Horizontal Tabs */}
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
            <div className="bg-[#1C1F26] p-1.5 rounded-[2rem] shadow-2xl pointer-events-auto inline-flex border border-white/5 overflow-x-auto max-w-full no-scrollbar gap-1">
                {/* MANAGEMENT TABS */}
                <button onClick={() => setActiveTab(AppTab.PLANNER)} className={getTabClass(AppTab.PLANNER)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>PLANEJAR</span>
                </button>
                <button onClick={() => setActiveTab(AppTab.SYLLABUS)} className={getTabClass(AppTab.SYLLABUS)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>EDITAL</span>
                </button>
                 <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className={getTabClass(AppTab.DASHBOARD)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>METAS</span>
                </button>
                
                <div className="w-px h-6 bg-white/10 mx-1"></div>

                {/* STUDY TABS */}
                <button onClick={() => { setActiveTab(AppTab.CHAT); setLoadedContent(null); }} className={getTabClass(AppTab.CHAT)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span>Chat</span>
                </button>
                <button onClick={() => setActiveTab(AppTab.SUMMARY)} className={getTabClass(AppTab.SUMMARY)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    <span>Resumo</span>
                </button>
                <button onClick={() => setActiveTab(AppTab.FLASHCARDS)} className={getTabClass(AppTab.FLASHCARDS)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <span>Flash</span>
                </button>
                <button onClick={() => setActiveTab(AppTab.QUIZ)} className={getTabClass(AppTab.QUIZ)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Quiz</span>
                </button>
                <button onClick={() => setActiveTab(AppTab.AUDIO)} className={getTabClass(AppTab.AUDIO)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    <span>Audio</span>
                </button>
            </div>
        </div>

        <main className="flex-1 relative overflow-hidden bg-[#0F1115] pt-24">
            <div className={`w-full bg-[#0F1115] rounded-tl-[3rem] h-full overflow-hidden`}>
                {activeTab === AppTab.CHAT && <ChatArea sources={sources} userName={userProfile.name} />}
                
                {activeTab === AppTab.SUMMARY && (
                    <SummaryView 
                        sources={sources} 
                        initialData={loadedContent} 
                        folders={folders}
                        onCreateFolder={handleCreateFolder}
                        onSaveItem={handleSaveItem}
                    />
                )}
                
                {activeTab === AppTab.FLASHCARDS && (
                    <FlashcardDeck 
                        sources={sources} 
                        initialData={loadedContent}
                        folders={folders}
                        onCreateFolder={handleCreateFolder}
                        onSaveItem={handleSaveItem}
                    />
                )}
                
                {activeTab === AppTab.QUIZ && (
                    <QuizMode 
                        sources={sources} 
                        initialData={loadedContent}
                        folders={folders}
                        onCreateFolder={handleCreateFolder}
                        onSaveItem={handleSaveItem}
                    />
                )}
                
                {activeTab === AppTab.AUDIO && <AudioPlayer sources={sources} />}

                {/* NEW VIEWS */}
                {activeTab === AppTab.PLANNER && (
                    <Planner 
                        tasks={weeklyTasks} 
                        setTasks={setWeeklyTasks}
                        exams={examDates}
                        setExams={setExamDates}
                        onSessionComplete={handleSessionComplete}
                        syllabusTopics={topics}
                    />
                )}

                {activeTab === AppTab.SYLLABUS && (
                    <SyllabusManager 
                        topics={topics}
                        setTopics={setTopics}
                        onAddSource={handleAddSource}
                        onSaveItem={handleSaveItem}
                    />
                )}

                {activeTab === AppTab.DASHBOARD && (
                    <Dashboard 
                        sessions={sessions}
                        mockExams={mockExams}
                        setMockExams={setMockExams}
                        topics={topics}
                    />
                )}
            </div>
        </main>
      </div>
    </div>
  );
}

export default App;
