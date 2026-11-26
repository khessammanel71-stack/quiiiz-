import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, ArrowRight, HelpCircle, XCircle } from 'lucide-react';
import { sound } from '../utils/audio';
import { ASSET_IMAGES } from '../data/experimentData';

interface TerminalIntroProps {
  nickname: string;
  onStart: () => void;
}

export const TerminalIntro: React.FC<TerminalIntroProps> = ({ nickname, onStart }) => {
  const [step, setStep] = useState(0);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showRefusalModal, setShowRefusalModal] = useState(false);
  const [refusalAttempts, setRefusalAttempts] = useState(0);
  const [refusalButtonPos, setRefusalButtonPos] = useState({ x: 0, y: 0 });

  const terminalLines = [
    `🤖 Initializing birthday experiment protocol...`,
    `Loading neural intelligence assessment...`,
    `Scanning local frequency for human lifeforms...`,
    `Human subject detected: [ ${nickname} ]`,
    `Unfortunately, we cannot guarantee the quality or sanity of the human. 💀`,
    `Status: You have been randomly selected for an essential cosmic experiment.`,
    `Don't panic. Probably.`,
    `Are you ready?`,
  ];

  useEffect(() => {
    if (step < terminalLines.length) {
      const timer = setTimeout(() => {
        sound.playKeyClick();
        setStep((prev) => prev + 1);
      }, step === 0 ? 500 : 750);
      return () => clearTimeout(timer);
    }
  }, [step, terminalLines.length]);

  const handleRefusalHover = () => {
    sound.playWhoosh();
    setRefusalAttempts((prev) => prev + 1);
    // Random evasion offset
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 140;
    setRefusalButtonPos({ x: randomX, y: randomY });
  };

  const handleRefusalClick = () => {
    sound.playWarning();
    setShowRefusalModal(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Terminal Window Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              experiment_session_v42.exe
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">SUBJECT: {nickname}</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-8 space-y-3 font-mono text-xs md:text-sm">
          {terminalLines.slice(0, step).map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed transition-opacity duration-300 ${
                idx === 3
                  ? 'text-amber-300 font-bold text-sm md:text-base'
                  : idx === 4
                  ? 'text-rose-400 italic'
                  : idx === terminalLines.length - 1
                  ? 'text-emerald-400 font-bold text-base mt-4'
                  : 'text-slate-300'
              }`}
            >
              <span className="text-slate-600 select-none mr-2">{'>'}</span>
              {line}
            </div>
          ))}

          {step < terminalLines.length && (
            <div className="flex items-center gap-1 text-amber-400 animate-pulse font-mono text-xs">
              <span>typing</span>
              <span className="inline-block w-2 h-4 bg-amber-400 ml-1" />
            </div>
          )}

          {/* Suspicious Cat Reaction Card */}
          {step >= 5 && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 p-4 rounded-xl border">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 shadow-lg">
                <img
                  src={ASSET_IMAGES.cat}
                  alt="Suspicious cat with round intellectual glasses judging you"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Visual Telemetry
                </div>
                <p className="text-slate-200 text-xs sm:text-sm font-sans font-medium">
                  "Why are you here? Oh, right. Irresistible curiosity." 🧐
                </p>
                <p className="text-slate-500 text-[11px] font-sans">
                  The cat with glasses is monitoring your eye movements. Try not to overthink.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {step >= terminalLines.length && (
          <div className="p-6 bg-slate-950/80 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              {/* Primary: LET'S GO */}
              <button
                onClick={() => {
                  sound.playSelect();
                  onStart();
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>LET'S GO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary: I HAVE QUESTIONS */}
              <button
                onClick={() => {
                  sound.playWarning();
                  setShowQuestionModal(true);
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>I HAVE QUESTIONS</span>
              </button>

              {/* Evasive button: I don't want to participate */}
              <div
                style={{
                  transform: `translate(${refusalButtonPos.x}px, ${refusalButtonPos.y}px)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative inline-block"
              >
                <button
                  onMouseEnter={handleRefusalHover}
                  onClick={handleRefusalClick}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-mono text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>I refuse to participate 💀</span>
                </button>
              </div>
            </div>

            {refusalAttempts > 0 && (
              <p className="text-center text-[11px] font-mono text-rose-400/90 animate-pulse">
                ⚠️ Attempted evasions: {refusalAttempts}. The button will not let you escape.
              </p>
            )}
          </div>
        )}
      </div>

      {/* "I HAVE QUESTIONS" Comedic Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">ACCESS DENIED: Role Confusion</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Dear <strong className="text-amber-300">{nickname}</strong>,
              <br />
              You are the <span className="text-rose-400 font-mono">SUBJECT</span> of this experiment, not the investigator.
              <br />
              <br />
              The questions will be asked by <strong>US</strong>. You just sit there, look handsome, and click the buttons.
            </p>
            <button
              onClick={() => {
                sound.playSelect();
                setShowQuestionModal(false);
                onStart();
              }}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Understood. Take me to the questions 😔
            </button>
          </div>
        </div>
      )}

      {/* "I REFUSE" Comedic Modal */}
      {showRefusalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-rose-900/50 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="text-4xl">😭💀</div>
            <h3 className="text-base font-bold text-white">Bro really thought he had a choice</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The AI has registered your act of defiance.
              <br />
              This betrayal will be permanently recorded in your official personality assessment report.
            </p>
            <button
              onClick={() => {
                sound.playSelect();
                setShowRefusalModal(false);
                onStart();
              }}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              FINE, I'LL PARTICIPATE 😔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
