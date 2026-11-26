import React, { useState } from 'react';
import { X, BookOpen, AlertTriangle, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ForbiddenBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
}

export const ForbiddenBookModal: React.FC<ForbiddenBookModalProps> = ({ isOpen, onClose, nickname }) => {
  const [page, setPage] = useState(1);

  if (!isOpen) return null;

  const handleNextPage = () => {
    sound.playBookFlip();
    setPage((p) => Math.min(3, p + 1));
  };

  const handlePrevPage = () => {
    sound.playBookFlip();
    setPage((p) => Math.max(1, p - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-600/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-stone-100 font-serif">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2 text-amber-400 font-sans">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-mono tracking-widest uppercase">The Forbidden Tome</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Content Pages */}
        <div className="py-6 space-y-4 min-h-[220px]">
          {page === 1 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Rule Violation Detected
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-amber-200">
                Chapter 1: The Disobedience of {nickname}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-stone-300">
                Congratulations. The button said <strong className="text-rose-400 font-sans">"DO NOT OPEN. SERIOUSLY."</strong> in bold letters, and you clicked it within 0.8 seconds.
              </p>
              <p className="text-xs sm:text-sm text-stone-400 italic">
                You have demonstrated exactly zero respect for safety warnings. Which honestly is why you are fun to have around.
              </p>
            </div>
          )}

          {page === 2 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Classified Observations
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-amber-200">
                Chapter 2: The Philosophy of Overthinking
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-stone-300">
                Why read one book when you can buy seven, stack them on your desk like an altar to intellectual guilt, and then browse YouTube essays on epistemology instead?
              </p>
              <p className="text-xs sm:text-sm text-amber-400/90 font-mono">
                Status: The universe approves of your chaotic literary habits.
              </p>
            </div>
          )}

          {page === 3 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                The Final Prophecy
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-amber-200">
                Chapter 3: The Birthday Blessing
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-stone-300">
                May this new year bring you books that you actually finish, coffee that hits just right, deep late-night conversations, and people who appreciate your peculiar brilliance.
              </p>
              <p className="text-xs sm:text-sm text-stone-400">
                Now close this book before it self-destructs. 💥
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800 font-sans text-xs">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
          >
            Previous Page
          </button>
          <span className="text-stone-400 font-mono">
            Page {page} of 3
          </span>
          {page < 3 ? (
            <button
              onClick={handleNextPage}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors cursor-pointer"
            >
              Turn Page →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors cursor-pointer"
            >
              Close Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
