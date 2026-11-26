/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserConfig, QuestionOption } from './types';
import { loadUserConfig } from './utils/storage';
import { getQuizQuestions, ASSET_IMAGES, MEME_STICKERS } from './data/experimentData';
import { sound } from './utils/audio';
import { fireConfettiBurst } from './utils/confetti';
import { ChessGame } from './components/ChessGame';
import { BirthdayCandleCake } from './components/BirthdayCandleCake';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

type AppStage =
  | 'intro'
  | 'scramble'
  | 'post_scramble_1'
  | 'post_scramble_2'
  | 'questions'
  | 'report'
  | 'birthday'
  | 'message';

export default function App() {
  const [config] = useState<UserConfig>(() => loadUserConfig());
  const [appStage, setAppStage] = useState<AppStage>('intro');
  const [introPage, setIntroPage] = useState<number>(1);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(null);
  const [showDisagreeAlert, setShowDisagreeAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const questions = getQuizQuestions(config.nickname, config.senderName);

  // When birthday reveal stage triggers, fire confetti!
  useEffect(() => {
    if (appStage === 'birthday' && canvasRef.current) {
      sound.playFanfare();
      fireConfettiBurst(canvasRef.current, 5000);
    }
  }, [appStage]);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
    if (sound.enabled) sound.playSelect();
  };

  const handleSelectOption = (opt: QuestionOption) => {
    setSelectedOption(opt);
    if (opt.reaction.audioEffect === 'warning') sound.playWarning();
    else if (opt.reaction.audioEffect === 'error') sound.playErrorBuzzer();
    else if (opt.reaction.audioEffect === 'whoosh') sound.playWhoosh();
    else sound.playSelect();
  };

  const handleNextQuestion = () => {
    sound.playSelect();
    setSelectedOption(null);
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setAppStage('report');
    }
  };

  const getReactionImage = (type?: string, stickerUrl?: string) => {
    if (stickerUrl) return stickerUrl;
    if (type === 'sideEye') return ASSET_IMAGES.sideEye;
    if (type === 'cat') return ASSET_IMAGES.cat;
    if (type === 'space') return ASSET_IMAGES.space;
    if (type === 'robot') return ASSET_IMAGES.robot;
    if (type === 'cake') return ASSET_IMAGES.cake;
    return ASSET_IMAGES.cat;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Canvas for Confetti */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 w-full h-full"
      />

      {/* Clean, Simple Top Bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <button
          onClick={() => {
            sound.playSelect();
            setAppStage('intro');
            setIntroPage(1);
            setQuestionIndex(0);
            setSelectedOption(null);
          }}
          className="flex items-center gap-2 text-sm sm:text-base font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>For Nazim 🎮</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>
      </header>

      {/* Centered Main Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 w-full max-w-xl mx-auto">
        {/* STAGE 1: MULTI-PAGE INTRO */}
        {appStage === 'intro' && (
          <div className="w-full">
            {/* PAGE 1: THE RECOLLECTION */}
            {introPage === 1 && (
              <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
                <div className="flex justify-center">
                  <img
                    src={MEME_STICKERS.luther_vandross_smile}
                    alt="Hey meme"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-center border-2 border-amber-400/50 shadow-lg bg-black"
                  />
                </div>

                <div className="space-y-4 font-mono text-left bg-slate-950 p-6 rounded-xl border border-slate-800/80">
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider">
                    HELLOOOOO
                  </div>

                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    <span className="text-amber-400 font-extrabold text-xl">NAZIIIIIM.</span> Tu te rappelles d'un jour où t'as fait une blague sur moi ?
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-center my-3">
                    <p className="text-amber-300 italic text-lg sm:text-xl font-serif">
                      « Tu as de nouveaux jeux ? »
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playSelect();
                    setIntroPage(2);
                  }}
                  className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>... Wait, what ? 👀</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PAGE 2: THE JUDGMENTAL SIDE-EYE */}
            {introPage === 2 && (
              <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 text-center animate-in fade-in duration-300">
                <div className="overflow-hidden rounded-2xl border-2 border-amber-500/40 shadow-2xl bg-black">
                  <img
                    src={ASSET_IMAGES.sideEye}
                    alt="The most judgmental side-eye stare meme ever"
                    referrerPolicy="no-referrer"
                    className="w-full h-64 sm:h-72 object-cover object-center"
                  />
                </div>

                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                  <p className="text-lg font-bold text-slate-300 font-mono">
                    Well...
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-rose-400 tracking-wider">
                    I HAVE NOT FORGOTTEN.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playWarning();
                    setIntroPage(3);
                  }}
                  className="w-full py-3.5 px-6 bg-rose-500 hover:bg-rose-400 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Uh oh... 💀</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PAGE 3: THE REVENGE DECLARATION */}
            {introPage === 3 && (
              <div className="w-full bg-slate-900 border border-rose-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
                <div className="flex justify-center">
                  <img
                    src={MEME_STICKERS.shocked_woman_scarf}
                    alt="Revenge stare meme"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-center border-2 border-rose-500/50 shadow-lg bg-black"
                  />
                </div>

                <div className="p-6 bg-slate-950 rounded-xl border border-rose-900/40 space-y-4 text-left font-mono">
                  <p className="text-slate-300 text-base">
                    You thought you could get away with it?
                  </p>

                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 text-center">
                    <p className="text-2xl sm:text-3xl font-black text-rose-400 tracking-wider animate-pulse">
                      I'm here for REVENGEEEE. 😈
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playSelect();
                    setIntroPage(4);
                  }}
                  className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>What did you do?! 😂</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PAGE 4: THE ULTIMATE CHALLENGE */}
            {introPage === 4 && (
              <div className="w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
                <div className="flex justify-center">
                  <img
                    src={MEME_STICKERS.hol_up_let_him_cook}
                    alt="Let him cook meme"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-center border-2 border-amber-400/50 shadow-lg bg-black"
                  />
                </div>

                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-4 text-center font-mono">
                  <p className="text-emerald-400 font-bold text-base">
                    And guess what?
                  </p>

                  <p className="text-xl sm:text-2xl font-black text-amber-300 leading-snug">
                    Je t'ai créé un petit jeu pour t'embêter.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playSelect();
                    setAppStage('scramble');
                  }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black text-base sm:text-lg rounded-xl shadow-xl shadow-amber-400/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer tracking-wider flex items-center justify-center gap-2"
                >
                  <span>START NOOOOOOOW!!!! 🎮🔥</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 2: MINI GAME – CHESS DUEL */}
        {appStage === 'scramble' && (
          <ChessGame
            onNext={() => {
              setAppStage('post_scramble_1');
            }}
          />
        )}

        {/* STAGE 3: INTERMEDIATE PAGE 1 */}
        {appStage === 'post_scramble_1' && (
          <div className="w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="flex justify-center">
              <img
                src={MEME_STICKERS.car_wheeze_laugh}
                alt="Laughing meme"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-center border-2 border-amber-400/50 shadow-lg bg-black"
              />
            </div>

            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide font-mono">
                « booonnn , 7ebit nzid nheblk chwiya 😂 »
              </p>
            </div>

            <button
              onClick={() => {
                sound.playSelect();
                setAppStage('post_scramble_2');
              }}
              className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Wache kayen tani ?! 💀</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STAGE 4: INTERMEDIATE PAGE 2 */}
        {appStage === 'post_scramble_2' && (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="flex justify-center">
              <img
                src={MEME_STICKERS.henry_danger_side_eye}
                alt="Side-eye stare"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-center border-2 border-rose-500/50 shadow-lg bg-black"
              />
            </div>

            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xl sm:text-2xl font-black text-white tracking-wide font-mono">
                Now let's get to the real business...
              </p>
            </div>

            <button
              onClick={() => {
                sound.playSelect();
                setAppStage('questions');
                setQuestionIndex(0);
                setSelectedOption(null);
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-xl shadow-amber-400/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>I'm Ready (I think) 🎮🔥</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STAGE 5: THE QUESTIONS */}
        {appStage === 'questions' && (() => {
          const currentQ = questions[questionIndex];
          return (
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in fade-in duration-200">
              {/* Header info */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-amber-400 font-semibold tracking-wider">
                  QUESTION {questionIndex + 1} OF {questions.length}
                </span>
              </div>

              {/* Question Text with Meme Sticker */}
              <div className="flex items-start gap-3 sm:gap-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                {currentQ.stickerUrl && (
                  <div className="relative shrink-0">
                    <img
                      src={currentQ.stickerUrl}
                      alt="Question meme sticker"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover object-center border-2 border-amber-400/40 shadow-md bg-black"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs select-none">👀</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {currentQ.prompt}
                  </h2>
                  {currentQ.subtitle && (
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {currentQ.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Options with hilarious stickers */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption?.id === option.id;
                  const labels = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/40'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                        }`}
                      >
                        {labels[idx]}
                      </span>

                      {option.stickerUrl && (
                        <img
                          src={option.stickerUrl}
                          alt="Sticker"
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover object-center shrink-0 border shadow-sm transition-transform group-hover:scale-105 ${
                            isSelected ? 'border-amber-400 scale-105' : 'border-slate-700/80 bg-black'
                          }`}
                        />
                      )}

                      <span className="text-sm font-semibold flex-1 leading-snug">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Reaction appears when an option is clicked */}
              {selectedOption && (
                <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 border-amber-500/40 shadow-lg bg-black">
                      <img
                        src={getReactionImage(selectedOption.reaction.imageType, selectedOption.reaction.stickerUrl)}
                        alt="Reaction meme"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      {selectedOption.reaction.title && (
                        <div className="text-sm font-bold text-amber-300 font-mono">
                          {selectedOption.reaction.title}
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                        {selectedOption.reaction.description}
                      </p>
                    </div>
                  </div>

                  {/* Clear Next Button */}
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-400/20"
                  >
                    <span>{questionIndex + 1 === questions.length ? 'See Final Analysis Report' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* STAGE 6: THE REPORT */}
        {appStage === 'report' && (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-amber-400 font-bold">EXPERIMENT COMPLETE</span>
              <span className="text-[10px] font-mono text-rose-400 uppercase bg-rose-500/10 px-2 py-0.5 rounded">
                Official Report
              </span>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <img
                src={MEME_STICKERS.suit_guy_grin}
                alt="Analyzing meme"
                className="w-16 h-16 rounded-xl object-cover object-center border-2 border-amber-400/40 shadow bg-black shrink-0"
              />
              <div className="text-left">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  THE FINALLL CONCLUSION
                </h2>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs sm:text-sm bg-slate-950 p-4 rounded-xl border border-slate-800 divide-y divide-slate-800/80">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Intelligence level:</span>
                <span className="text-emerald-400 font-bold">Still under investigation 🧐</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Curiosity:</span>
                <span className="text-amber-400 font-bold">Dangerously high ⚡</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Ability to overthink:</span>
                <span className="text-rose-400 font-bold">Potentially unlimited 🧠</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Sense of humor:</span>
                <span className="text-indigo-300 font-bold">veryyyyyy highhh</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Probability of questioning this:</span>
                <span className="text-amber-400 font-bold">99.9%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <div className="text-[11px] font-mono text-amber-400 uppercase font-semibold">
                Final Diagnosis
              </div>
              <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                An interesting human. Slightly suspicious. 💀
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => {
                  sound.playWarning();
                  setShowDisagreeAlert(true);
                }}
                className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                I DISAGREE WITH THE RESULTS
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setAppStage('birthday');
                }}
                className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 7: BIRTHDAY REVEAL */}
        {appStage === 'birthday' && (
          <div className="w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-400">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-black">
              <img
                src={MEME_STICKERS.happy_dog}
                alt="Happy birthday meme celebration"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-4 right-4 text-center">
                <span className="text-xs font-mono uppercase bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full font-black shadow-md tracking-wider">
                  SURPRISE! 🎉
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                🎂 HAPPY BIRTHDAY NAZIIIM !!!
              </h2>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p className="text-amber-300 font-bold text-sm sm:text-base leading-relaxed">
                  Après ma 9rib met pour me rappeler de tous ces détails, cause as you know, j'ai une mémoire de poisson rouge 😂 Bref, une année de plus au compteur, hope you make the most of ittt ! Joyeuxxx anniversaireee !
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playSelect();
                setAppStage('message');
              }}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950 font-bold rounded-xl text-sm transition-all hover:scale-[1.02] cursor-pointer shadow-lg"
            >
              NEXT →
            </button>
          </div>
        )}

        {/* STAGE 8: THE PERSONAL MESSAGE REVEAL */}
        {appStage === 'message' && (
          <div className="w-full bg-slate-900 border border-rose-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
            <div className="flex items-center justify-center">
              <img
                src={MEME_STICKERS.barbie_crying}
                alt="Emotional meme sticker"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-center border-2 border-rose-500/40 shadow-lg bg-black"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                Don't laugh at this please 😂 I tried my best
              </h3>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-serif italic">
              {config.personalMessage}
            </div>

            <BirthdayCandleCake
              onCelebrate={() => {
                sound.playFanfare();
                if (canvasRef.current) fireConfettiBurst(canvasRef.current, 4500);
              }}
            />

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  sound.playFanfare();
                  if (canvasRef.current) fireConfettiBurst(canvasRef.current, 4000);
                }}
                className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>More Confetti! 🎉</span>
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setAppStage('intro');
                  setIntroPage(1);
                  setQuestionIndex(0);
                  setSelectedOption(null);
                }}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Alert: "I DISAGREE" */}
      {showDisagreeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="text-3xl">😂</div>
            <h3 className="text-base font-bold text-white">Of course you do.</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              i specifically predicted a 99.9% chance that you would disagree with this report.
              <br />
              <br />
              By clicking this button, you just proved the report was 100% accurate! 💀
            </p>
            <button
              onClick={() => {
                sound.playSelect();
                setShowDisagreeAlert(false);
              }}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
            >
              Okay fine, you got me 🤝
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
