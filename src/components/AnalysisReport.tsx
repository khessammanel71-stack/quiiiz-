import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { UserConfig } from '../types';
import { ASSET_IMAGES } from '../data/experimentData';
import { FileText, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AnalysisReportProps {
  config: UserConfig;
  onProceedToBirthday: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ config, onProceedToBirthday }) => {
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [showDisagreementModal, setShowDisagreementModal] = useState(false);

  const loadingSteps = [
    'EXPERIMENT COMPLETE.',
    'Analyzing your answers against 4 billion human baselines...',
    'Calculating philosophical overthinking index...',
    'Consulting the scientific department...',
    'Scientific department unavailable. (Staff is currently reading a book).',
    'Synthesizing final subject dossier...',
  ];

  useEffect(() => {
    if (analyzingStep < loadingSteps.length) {
      const timer = setTimeout(() => {
        sound.playKeyClick();
        setAnalyzingStep((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [analyzingStep, loadingSteps.length]);

  const handleDisagree = () => {
    sound.playWarning();
    setShowDisagreementModal(true);
  };

  const isDoneLoading = analyzingStep >= loadingSteps.length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!isDoneLoading ? (
        /* Loading & Analyzing Terminal */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-amber-400/40 p-1">
            <img
              src={ASSET_IMAGES.space}
              alt="Calculating personality"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full animate-spin-slow"
            />
          </div>

          <div className="space-y-2 font-mono text-xs sm:text-sm">
            {loadingSteps.slice(0, analyzingStep).map((step, idx) => (
              <div
                key={idx}
                className={`leading-relaxed ${
                  idx === 4 ? 'text-amber-400 italic' : idx === 0 ? 'text-emerald-400 font-bold' : 'text-slate-300'
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          <div className="w-48 h-1.5 bg-slate-800 mx-auto rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${(analyzingStep / loadingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        /* The Official Dossier Report */
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in duration-500">
          {/* Dossier Header */}
          <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">CONFIDENTIAL DOSSIER #B-DAY-42</h2>
                <p className="text-[11px] font-mono text-slate-400">Department of Questionable Diagnostics</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              VERDICT FINAL
            </span>
          </div>

          {/* Dossier Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="border border-slate-800 rounded-xl bg-slate-950/60 p-5 divide-y divide-slate-800/80 font-mono text-xs sm:text-sm">
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">SUBJECT DESIGNATION:</span>
                <span className="text-amber-300 font-bold text-sm sm:text-base">{config.nickname}</span>
              </div>
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">INTELLIGENCE LEVEL:</span>
                <span className="text-emerald-400 font-medium">Dangerously high (Still under investigation)</span>
              </div>
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">CURIOSITY RATING:</span>
                <span className="text-amber-400 font-medium">Astronomical (Cannot ignore mysterious links)</span>
              </div>
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">ABILITY TO OVERTHINK:</span>
                <span className="text-rose-400 font-bold">Potentially Unlimited (Infinite loop detected)</span>
              </div>
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">SENSE OF HUMOR:</span>
                <span className="text-indigo-300 font-medium">Distinctive / Results highly entertaining</span>
              </div>
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">PROBABILITY OF QUESTIONING THIS:</span>
                <span className="text-amber-400 font-bold">99.98%</span>
              </div>
            </div>

            {/* Final Diagnosis Box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Official Diagnosis
              </div>
              <p className="text-base sm:text-lg font-bold text-white">
                An interesting human. Slightly suspicious. Exceptionally memorable.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleDisagree}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                I DISAGREE WITH THE RESULTS
              </button>

              <button
                onClick={() => {
                  sound.playFanfare();
                  onProceedToBirthday();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-amber-400/20"
              >
                <span>Proceed to Final Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disagreement Comedic Modal */}
      {showDisagreementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertOctagon className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Objection Logged</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <strong>Of course you disagree.</strong> We specifically predicted a 99.98% chance that you would click this exact button.
              <br />
              <br />
              By disagreeing with the report, you have scientifically validated the report. You cannot defeat statistics, {config.nickname}. 😂
            </p>
            <button
              onClick={() => {
                sound.playSelect();
                setShowDisagreementModal(false);
              }}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Okay, you got me. Continue 🤝
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
