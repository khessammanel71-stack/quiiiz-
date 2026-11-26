import React, { useState, useEffect, useRef } from 'react';
import { UserConfig } from '../types';
import { ASSET_IMAGES } from '../data/experimentData';
import { sound } from '../utils/audio';
import { fireConfettiBurst } from '../utils/confetti';
import { BookOpen, Bot, Heart, Award, RotateCcw, Sparkles } from 'lucide-react';
import { ForbiddenBookModal } from './ForbiddenBookModal';
import { AskAIModal } from './AskAIModal';
import { SecretLetterModal } from './SecretLetterModal';
import { CertificateModal } from './CertificateModal';

interface BirthdayRevealProps {
  config: UserConfig;
  onRestart: () => void;
}

export const BirthdayReveal: React.FC<BirthdayRevealProps> = ({ config, onRestart }) => {
  const [phase, setPhase] = useState<'anticipation' | 'explosion' | 'complete'>('anticipation');
  const [activeModal, setActiveModal] = useState<'book' | 'ai' | 'letter' | 'cert' | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Stage 1: dramatic silence & typing
    const t1 = setTimeout(() => {
      sound.playSelect();
      setPhase('explosion');
      sound.playFanfare();
      if (canvasRef.current) {
        fireConfettiBurst(canvasRef.current, 5000);
      }
    }, 2800);

    const t2 = setTimeout(() => {
      setPhase('complete');
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const triggerConfettiAgain = () => {
    sound.playFanfare();
    if (canvasRef.current) {
      fireConfettiBurst(canvasRef.current, 3500);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto space-y-8">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-40 w-full h-full"
      />

      {phase === 'anticipation' ? (
        /* The Dramatic Tease */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-10 md:p-14 shadow-2xl text-center space-y-5 animate-pulse">
          <div className="text-xs font-mono text-amber-400/80 uppercase tracking-widest">
            System Recalibration
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-white leading-relaxed">
            Wait a second...
            <br />
            <span className="text-amber-400">We forgot something.</span>
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mx-auto">
            Today is not an ordinary day in the cosmic calendar.
          </p>
        </div>
      ) : (
        /* The Grand Birthday Surprise */
        <div className="bg-slate-900/95 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-500 space-y-6">
          {/* Hero Cake Image & Ambient Banner */}
          <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-slate-950">
            <img
              src={ASSET_IMAGES.cake}
              alt="Birthday celebration cake with glowing candles"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            {/* Overlay badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                OFFICIAL REVELATION
              </span>
            </div>

            <div className="absolute bottom-4 left-6 right-6">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                🎂 HAPPY BIRTHDAY, {config.nickname.toUpperCase()}!
              </h1>
            </div>
          </div>

          {/* Heartwarming Roast & Affection Message */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-5 sm:p-7 space-y-4 text-center">
              <p className="text-base sm:text-lg font-medium text-amber-100 leading-relaxed max-w-2xl mx-auto">
                After extensive research, several questionable calculations, and absolutely no scientific evidence, we have reached one immutable conclusion:
              </p>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30 max-w-xl mx-auto">
                <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
                  "The world became a little more interesting the day you were born."
                </p>
                <p className="text-xs text-slate-400 mt-1 italic">
                  Unfortunately, science cannot explain why. 😭😂
                </p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-rose-300">
                Happy birthday, you wonderfully complicated human. ❤️
              </p>
            </div>

            {/* The Three Special Extras */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center justify-between">
                <span>✨ Three Special Interactive Extras:</span>
                <span className="text-[11px] text-slate-500 font-normal">Click to unlock each one</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. The Forbidden Book */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playBookFlip();
                    setActiveModal('book');
                  }}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/40 text-left transition-all hover:scale-[1.02] cursor-pointer space-y-2 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-rose-400 font-bold">DO NOT OPEN.</div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                      The Forbidden Book
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      A mysterious volume strictly off-limits to curious humans.
                    </p>
                  </div>
                </button>

                {/* 2. Ask the Birthday AI */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveModal('ai');
                  }}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/40 text-left transition-all hover:scale-[1.02] cursor-pointer space-y-2 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 group-hover:bg-sky-400 group-hover:text-slate-950 transition-colors">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-sky-400 font-bold">NEURAL ORACLE</div>
                    <div className="text-sm font-bold text-white group-hover:text-sky-200 transition-colors">
                      Ask Birthday AI
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Get prewritten roasts or ask your own burning life questions.
                    </p>
                  </div>
                </button>

                {/* 3. The Secret Message */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveModal('letter');
                  }}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/20 text-left transition-all hover:scale-[1.02] cursor-pointer space-y-2 group relative overflow-hidden"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                    <Heart className="w-5 h-5 fill-rose-500/30 group-hover:fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-rose-400 font-bold">CONFIDENTIAL</div>
                    <div className="text-sm font-bold text-white group-hover:text-rose-200 transition-colors">
                      Secret Message
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Something I actually wanted to tell you for your birthday...
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveModal('cert');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>View Official Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={triggerConfettiAgain}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>More Confetti! 🎉</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onRestart();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Experiment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ForbiddenBookModal
        isOpen={activeModal === 'book'}
        onClose={() => setActiveModal(null)}
        nickname={config.nickname}
      />
      <AskAIModal
        isOpen={activeModal === 'ai'}
        onClose={() => setActiveModal(null)}
        nickname={config.nickname}
      />
      <SecretLetterModal
        isOpen={activeModal === 'letter'}
        onClose={() => setActiveModal(null)}
        nickname={config.nickname}
        senderName={config.senderName}
        message={config.personalMessage}
      />
      <CertificateModal
        isOpen={activeModal === 'cert'}
        onClose={() => setActiveModal(null)}
        config={config}
      />
    </div>
  );
};
