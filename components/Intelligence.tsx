
import React, { useState, useRef, useEffect } from 'react';
import { generateInnovationStream } from '../services/geminiService';
import { Message } from '../types';

const Intelligence: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm the Cogniview assistant. I can explain how we automate recruitment screening using AI. What would you like to know?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiMsg: Message = { role: 'assistant', content: '', timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);

    try {
      let fullContent = '';
      const stream = generateInnovationStream(input);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          const updated = { ...last, content: fullContent };
          return [...prev.slice(0, -1), updated];
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[600px] flex flex-col glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
      
      {/* Abstract Background for Chat */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse z-10 relative" />
             <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute top-0 left-0 opacity-75" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Cogniview Assistant</h2>
            <p className="text-[10px] text-gray-400">Online • Latency: 45ms</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-[#1a1a1a] border border-white/10 text-gray-200 shadow-lg'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content || (isLoading && i === messages.length - 1 ? 'Thinking...' : '')}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md z-10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 pr-14 focus:outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-gray-600"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all text-gray-400 hover:text-white"
          >
            {isLoading ? <i className="fas fa-circle-notch animate-spin text-xs"></i> : <i className="fas fa-paper-plane text-xs"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
