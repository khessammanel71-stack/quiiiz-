import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, RefreshCw, MessageSquare } from 'lucide-react';
import { PRESET_AI_QUESTIONS } from '../data/experimentData';
import { sound } from '../utils/audio';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
}

export const AskAIModal: React.FC<AskAIModalProps> = ({ isOpen, onClose, nickname }) => {
  const [selectedPreset, setSelectedPreset] = useState<(typeof PRESET_AI_QUESTIONS)[0] | null>(PRESET_AI_QUESTIONS[0]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (item: (typeof PRESET_AI_QUESTIONS)[0]) => {
    sound.playSelect();
    setSelectedPreset(item);
    setCustomAnswer(null);
  };

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    sound.playKeyClick();
    setIsTyping(true);
    setSelectedPreset(null);

    setTimeout(() => {
      sound.playSelect();
      setIsTyping(false);
      const responses = [
        `Analysis of your question: Highly philosophical. Conclusion: You are overthinking this, ${nickname}. Stop calculating the probability and enjoy your birthday cake!`,
        `Neural scan indicates: A question worthy of Socrates. Socrates was also slightly unhinged, so you're in great company.`,
        `The quantum birthday matrix computed your answer: Yes, absolutely, 100%, without a doubt. Unless it's about waking up early tomorrow, in which case: No.`,
        `Our high-dimensional algorithm returned: 404 Wisdom Not Found. However, high levels of charm and intellect were detected in the prompt author.`,
      ];
      const randomAns = responses[Math.floor(Math.random() * responses.length)];
      setCustomAnswer(randomAns);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">The Birthday AI Oracle</h3>
              <p className="text-xs text-slate-400">Trained on philosophy, sarcasm, and your peculiar habits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Questions Chips */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 block mb-2">
            Ask Prepared Burning Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_AI_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left flex items-center gap-1.5 ${
                  selectedPreset?.q === item.q
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Display Answer Box */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 min-h-[110px] space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI RESPONSE ENGINE:</span>
          </div>

          {isTyping ? (
            <div className="flex items-center gap-2 text-amber-400 py-3 font-mono text-xs animate-pulse">
              <span>Querying the multiverse...</span>
            </div>
          ) : selectedPreset ? (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="text-xs font-semibold text-slate-400">Q: "{selectedPreset.q}"</div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {selectedPreset.a}
              </p>
            </div>
          ) : customAnswer ? (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="text-xs font-semibold text-slate-400">Q: "{customQuestion}"</div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {customAnswer}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">
              Select a question above or type your own below...
            </p>
          )}
        </div>

        {/* Custom Question Form */}
        <form onSubmit={handleAskCustom} className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Or type your own question:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g. Why do you roast me so much?"
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!customQuestion.trim() || isTyping}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close Oracle
          </button>
        </div>
      </div>
    </div>
  );
};
