import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../utils/audio';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { MEME_STICKERS } from '../data/experimentData';

export interface ScrambleWord {
  id: number;
  word: string;
  scrambled: string;
}

export const SCRAMBLE_WORDS: ScrambleWord[] = [
  { id: 1, word: 'GUILTY', scrambled: 'TYUGIL' },
  { id: 2, word: 'TROUBLE', scrambled: 'BLEUORT' },
  { id: 3, word: 'SUSPECT', scrambled: 'PESTCUS' },
  { id: 4, word: 'VILLAIN', scrambled: 'LILVANI' },
  { id: 5, word: 'WANTED', scrambled: 'TDAWEN' },
];

interface WordScrambleProps {
  onComplete: () => void;
}

export const WordScramble: React.FC<WordScrambleProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentItem = SCRAMBLE_WORDS[currentIndex];

  useEffect(() => {
    if (!isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isFinished]);

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isFinished) return;

    const normalizedInput = userInput.trim().toUpperCase();
    const targetWord = currentItem.word.toUpperCase();

    if (normalizedInput === targetWord) {
      setStatus('success');
      sound.playSelect();

      // Advance after a brief moment so player sees "Okayyy, not bad!"
      setTimeout(() => {
        if (currentIndex + 1 < SCRAMBLE_WORDS.length) {
          setCurrentIndex((prev) => prev + 1);
          setUserInput('');
          setStatus('idle');
        } else {
          setIsFinished(true);
          sound.playFanfare();
        }
      }, 700);
    } else {
      setStatus('error');
      sound.playErrorBuzzer();
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  };

  // Final screen after solving all five words
  if (isFinished) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center gap-3">
          <img
            src={MEME_STICKERS.kid_smug}
            alt="Smug reaction"
            className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400/50 shadow-md bg-black"
          />
        </div>

        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
          <p className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide font-mono">
            "khlas your punishment is over"
          </p>
        </div>

        <button
          onClick={() => {
            sound.playSelect();
            onComplete();
          }}
          className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
      {/* Header & Progress */}
      <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white font-bold tracking-wider">WORD SCRAMBLE</span>
        </div>
        <span className="text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
          WORD {currentIndex + 1} OF {SCRAMBLE_WORDS.length}
        </span>
      </div>

      {/* Scrambled Word Display */}
      <div className="text-center py-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
        <div className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">
          Unscramble this word:
        </div>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap py-2">
          {currentItem.scrambled.split('').map((letter, idx) => (
            <span
              key={idx}
              className="w-10 h-12 sm:w-12 sm:h-14 rounded-lg bg-slate-900 border-2 border-amber-400/60 text-amber-300 text-xl sm:text-2xl font-black font-mono flex items-center justify-center shadow-md select-none transform transition-transform hover:-translate-y-0.5"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Input & Form */}
      <form onSubmit={handleCheck} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder="Type your answer here..."
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              className={`w-full py-3.5 px-4 text-center text-lg sm:text-xl font-bold font-mono tracking-widest uppercase rounded-xl bg-slate-950 border-2 transition-all outline-none ${
                status === 'success'
                  ? 'border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                  : status === 'error'
                  ? 'border-rose-500 text-rose-300 ring-2 ring-rose-500/30 animate-shake'
                  : 'border-slate-700 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
              }`}
            />
          </div>

          {/* Feedback messages */}
          <div className="min-h-[26px] flex items-center justify-center text-center">
            {status === 'success' && (
              <p className="text-xs sm:text-sm font-bold text-emerald-400 font-mono flex items-center justify-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Okayyy, not bad!</span>
              </p>
            )}
            {status === 'error' && (
              <p className="text-xs sm:text-sm font-bold text-rose-400 font-mono flex items-center justify-center gap-1.5 animate-in fade-in">
                <XCircle className="w-4 h-4" />
                <span>Nope. Try again, genius. 🙄</span>
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!userInput.trim()}
          className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>CHECK</span>
        </button>
      </form>
    </div>
  );
};
