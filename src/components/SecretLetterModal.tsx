import React, { useState } from 'react';
import { X, Heart, Sparkles, Feather } from 'lucide-react';
import { sound } from '../utils/audio';

interface SecretLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
  senderName: string;
  message: string;
}

export const SecretLetterModal: React.FC<SecretLetterModalProps> = ({
  isOpen,
  onClose,
  nickname,
  senderName,
  message,
}) => {
  const [heartCount, setHeartCount] = useState(0);

  if (!isOpen) return null;

  const handleHeartClick = () => {
    sound.playSelect();
    setHeartCount((c) => c + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-stone-100 font-serif">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wax Seal Header */}
        <div className="flex flex-col items-center text-center space-y-2 pb-5 border-b border-stone-800">
          <div className="w-12 h-12 rounded-full bg-rose-900/60 border-2 border-rose-600/80 flex items-center justify-center shadow-lg shadow-rose-950/50">
            <Heart className="w-6 h-6 text-rose-300 fill-rose-300/40" />
          </div>
          <div className="font-sans">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400/90">
              Personal & Confidential
            </span>
            <h3 className="text-xl font-bold text-amber-200 mt-0.5">
              A Sincere Note for {nickname}
            </h3>
          </div>
        </div>

        {/* The Letter Body */}
        <div className="py-6 space-y-4 text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
          {message}
        </div>

        {/* Signature */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between font-sans text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-serif italic text-base">
            <Feather className="w-4 h-4 text-amber-400" />
            <span>— With genuine affection, {senderName}</span>
          </div>

          <button
            onClick={handleHeartClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
          >
            <Heart className={`w-3.5 h-3.5 fill-rose-400 text-rose-400 ${heartCount > 0 ? 'animate-bounce' : ''}`} />
            <span>{heartCount > 0 ? `Sent ${heartCount} ❤️` : 'Send a Smile'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
