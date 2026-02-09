import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Source } from '../types';
import { generateChatResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatAreaProps {
  sources: Source[];
  userName?: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ sources, userName = "Estudante" }) => {
  // Initialize messages from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
        const saved = localStorage.getItem('barra_chat_history');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch(e) {
        // ignore error
    }
    return [{
      id: 'welcome',
      role: 'model',
      text: `Olá, ${userName}! Sou o Barra. \n\nAdicione um tema na barra lateral e vamos estudar. Eu salvo nossas conversas automaticamente.`,
      timestamp: Date.now(),
    }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem('barra_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleClearChat = () => {
      if(confirm("Apagar histórico da conversa?")) {
        const resetMsg: ChatMessage[] = [{
            id: 'welcome',
            role: 'model',
            text: `Chat limpo! O que vamos estudar agora, ${userName}?`,
            timestamp: Date.now(),
          }];
        setMessages(resetMsg);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (sources.length === 0) {
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'model',
            text: 'Crie um tópico na esquerda primeiro!',
            timestamp: Date.now()
        }]);
        return;
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateChatResponse(userMsg.text, sources, messages);
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: "Erro de conexão. Tente novamente.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1115] relative">
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-[2rem] p-6 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#E6FF57] text-black rounded-tr-sm font-medium shadow-[0_4px_20px_rgba(230,255,87,0.1)]'
                  : 'bg-[#1C1F26] border border-white/5 text-gray-100 rounded-tl-sm shadow-md'
              }`}
            >
              <div className="prose prose-invert max-w-none prose-p:my-2 prose-headings:font-bold prose-headings:text-inherit prose-strong:text-inherit prose-a:text-inherit">
                {msg.role === 'model' ? (
                  <ReactMarkdown 
                    components={{
                        p: ({node, ...props}) => <p className="leading-relaxed text-[15px]" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1 marker:text-[#E6FF57]" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1 marker:font-bold marker:text-[#E6FF57]" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-[#E6FF57]" {...props} />
                    }}
                  >
                      {msg.text}
                  </ReactMarkdown>
                ) : (
                  <p className="text-[16px] font-bold tracking-tight">{msg.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start w-full">
                <div className="bg-[#1C1F26] border border-white/5 rounded-[2rem] rounded-tl-sm p-6 shadow-sm flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-6 left-0 right-0 px-6 md:px-12 flex justify-center items-end gap-2 pointer-events-none">
        {/* Reset Chat Button - only visible if there are messages */}
        {messages.length > 1 && (
             <button 
                onClick={handleClearChat}
                className="pointer-events-auto p-4 mb-1 bg-[#1C1F26] text-gray-400 hover:text-red-400 rounded-full shadow-lg border border-white/10 transition-colors"
                title="Limpar Conversa"
             >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-4xl relative group pointer-events-auto">
          <input
            type="text"
            className="w-full bg-[#1C1F26] border border-white/10 text-white font-medium placeholder:text-gray-500 rounded-full py-5 pl-8 pr-16 focus:outline-none focus:border-[#E6FF57]/50 focus:ring-1 focus:ring-[#E6FF57]/50 transition-all shadow-2xl text-lg"
            placeholder="Pergunte qualquer coisa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#E6FF57] text-black rounded-full hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-yellow-400/20"
          >
            {isLoading ? (
                 <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};