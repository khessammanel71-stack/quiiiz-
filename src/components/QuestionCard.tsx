import React, { useState } from 'react';
import { QuizQuestion, QuestionOption } from '../types';
import { ASSET_IMAGES } from '../data/experimentData';
import { sound } from '../utils/audio';
import { ArrowRight, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  nickname: string;
  onNext: (selectedOption: QuestionOption) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  nickname,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(null);

  const handleSelect = (opt: QuestionOption) => {
    setSelectedOption(opt);
    const effect = opt.reaction.audioEffect;
    if (effect === 'warning') sound.playWarning();
    else if (effect === 'error') sound.playErrorBuzzer();
    else if (effect === 'whoosh') sound.playWhoosh();
    else sound.playSelect();
  };

  const getReactionImage = (type?: string, customUrl?: string) => {
    if (customUrl) return customUrl;
    if (type === 'sideEye') return ASSET_IMAGES.sideEye;
    switch (type) {
      case 'cat':
        return ASSET_IMAGES.cat;
      case 'space':
        return ASSET_IMAGES.space;
      case 'robot':
        return ASSET_IMAGES.robot;
      case 'cake':
        return ASSET_IMAGES.cake;
      default:
        return ASSET_IMAGES.cat;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress & Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>PHASE 1: QUESTIONNAIRE</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <span>Question {questionIndex + 1}</span>
          <span className="text-slate-600">/</span>
          <span>{totalQuestions}</span>
        </div>
      </div>

      {/* Main Question Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
            {question.prompt}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2 font-mono">
            {question.subtitle}
          </p>
        </div>

        {/* Options List */}
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption?.id === option.id;
            const letters = ['A', 'B', 'C', 'D'];
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className={`group text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-400/5'
                    : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  {letters[idx] || '•'}
                </span>
                <div className="flex-1">
                  <div className="text-sm md:text-base font-semibold leading-snug">
                    {option.text}
                  </div>
                  {option.tagline && (
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {option.tagline}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Reaction Card */}
        {selectedOption && (
          <div className="p-5 bg-slate-950 border border-amber-500/30 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-4">
              {selectedOption.reaction.imageType && (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-slate-700 shadow-md">
                  <img
                    src={getReactionImage(selectedOption.reaction.imageType)}
                    alt={selectedOption.reaction.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                </div>
              )}
              <div className="space-y-1.5 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>{selectedOption.reaction.badge}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-1.5">
                  <span>{selectedOption.reaction.emoji}</span>
                  <span>{selectedOption.reaction.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {selectedOption.reaction.description}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => {
                  sound.playSelect();
                  onNext(selectedOption);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{questionIndex + 1 === totalQuestions ? 'Complete Questionnaire' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
