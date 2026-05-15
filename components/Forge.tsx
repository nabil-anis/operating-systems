
import React, { useState } from 'react';
import { brainstormIdeas } from '../services/geminiService';

const Forge: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<string>('');
  const [isForging, setIsForging] = useState(false);

  const handleForge = async () => {
    if (!topic.trim() || isForging) return;
    setIsForging(true);
    const result = await brainstormIdeas(topic);
    setIdeas(result);
    setIsForging(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="glass p-10 rounded-[3rem] text-center relative overflow-hidden bg-gradient-to-b from-blue-900/20 to-transparent border border-blue-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-3xl font-outfit font-bold mb-4">Could this work for your industry?</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-10">
          Enter your industry below to see how a similar automation architecture could be deployed for your business.
        </p>

        <div className="max-w-xl mx-auto flex gap-4 mb-8">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., HVAC, Real Estate, E-Commerce..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 ring-blue-500/20 transition-all placeholder:text-gray-600"
          />
          <button 
            onClick={handleForge}
            disabled={isForging || !topic.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 rounded-2xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isForging ? (
              <i className="fas fa-spinner animate-spin"></i>
            ) : (
              'Generate'
            )}
          </button>
        </div>

        {ideas && (
          <div className="text-left bg-black/40 p-6 rounded-2xl border border-white/10 max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom-2">
            <h4 className="text-blue-400 font-bold mb-2 text-sm uppercase">AI Generated Strategy</h4>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300">
              {ideas.split('\n').map((line, idx) => (
                <p key={idx} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-500">
            Ready to build? <a href="mailto:contact@nosh.ai" className="text-white underline decoration-blue-500 underline-offset-4">Book a technical consultation</a>.
        </p>
      </div>
    </div>
  );
};

export default Forge;
