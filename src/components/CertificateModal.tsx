import React, { useRef } from 'react';
import { X, Award, Download, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { UserConfig } from '../types';
import { sound } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserConfig;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, config }) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playSelect();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-mono tracking-widest uppercase">Official Certificate</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Plaque */}
        <div
          ref={certRef}
          className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-stone-900 to-slate-950 border-4 border-double border-amber-500/60 shadow-2xl text-center space-y-4"
        >
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400/90">
              Certificate of Distinction
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
              Certified Dangerously Interesting Human
            </h2>
          </div>

          <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
            This solemn document certifies that the subject named below has undergone the rigorous Birthday Experiment and is officially declared irreplaceable.
          </p>

          <div className="py-2">
            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 font-serif">
              {config.nickname}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Curiosity: Unlimited · Sense of Humor: Legendary
            </div>
          </div>

          <div className="pt-4 border-t border-amber-500/30 flex items-center justify-between text-[11px] font-mono text-stone-400">
            <div>DATE: Today (Best Day Ever)</div>
            <div>VERIFIED BY: {config.senderName} ❤️</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-500 font-mono">
            Screenshot or print to preserve for history.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
