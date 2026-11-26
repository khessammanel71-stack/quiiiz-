import React, { useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface BirthdayCandleCakeProps {
  onCelebrate?: () => void;
}

const CANDLE_DELAYS = ['0s', '0.22s', '0.45s', '0.14s', '0.36s'];

const TIER_1_TEXT =
  'عيد ميلاد سعيد · Joyeux anniversaire · Happy Birthday · お誕生日おめでとう · 생일 축하해요 · 生日快乐 · تولدت مبارک · Amulli ameggaz · Feliz cumpleaños';

const TIER_2_TEXT =
  'Buon compleanno · Alles Gute zum Geburtstag · Feliz aniversário · İyi ki doğdun · Χρόνια πολλά · С днём рождения · Gefeliciteerd · Wszystkiego najlepszego · Selamat ulang tahun · जन्मदिन मुबारक हो · Boldog születésnapot · La mulți ani';

const TIER_3_TEXT =
  'Grattis på födelsedagen · Tillykke med fødselsdagen · Gratulerer med dagen · Hyvää syntymäpäivää · Všechno nejlepší · З днем народження · Честит рожден ден · Chúc mừng sinh nhật · สุขสันต์วันเกิด · Maligayang kaarawan · Heri ya siku ya kuzaliwa · Hauʻoli lā hānau · Sretan rođendan · Zorionak zure urtebetetzean · Lá breithe sona duit · Penblwydd hapus · Til hamingju með afmælið';

export const BirthdayCandleCake: React.FC<BirthdayCandleCakeProps> = ({ onCelebrate }) => {
  const [litCandles, setLitCandles] = useState<boolean[]>([true, true, true, true, true]);
  const anyLit = litCandles.some(Boolean);

  const toggleCandle = (index: number) => {
    sound.playKeyClick();
    setLitCandles((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      if (next.every((lit) => !lit)) {
        onCelebrate?.();
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (anyLit) {
      setLitCandles([false, false, false, false, false]);
      onCelebrate?.();
    } else {
      sound.playSelect();
      setLitCandles([true, true, true, true, true]);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#07070c] border border-amber-500/20 px-3 pt-6 pb-5 sm:px-6 sm:pt-7 sm:pb-6 shadow-[0_0_40px_rgba(245,158,11,0.08)]">
      {/* Warm candle aura */}
      <div
        className={`pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-56 h-32 rounded-full blur-3xl transition-opacity duration-500 ${
          anyLit ? 'bg-amber-500/20 opacity-100' : 'opacity-0'
        }`}
      />

      {/* Cake Silhouette Assembly */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 5 Animated Moving Candles centered over Top Tier */}
        <div className="w-[185px] sm:w-[215px] flex items-end justify-between px-3">
          {CANDLE_DELAYS.map((delay, idx) => {
            const isLit = litCandles[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleCandle(idx)}
                title={isLit ? 'Tap to blow candle' : 'Tap to relight candle'}
                className="group flex flex-col items-center cursor-pointer focus:outline-none"
              >
                {/* Flickering Flame */}
                <div className="relative w-5 h-7 flex items-end justify-center">
                  {isLit ? (
                    <>
                      <span
                        className="absolute bottom-0.5 w-6 h-6 rounded-full bg-amber-500/45 blur-md animate-candle-aura"
                        style={{ animationDelay: delay }}
                      />
                      <span
                        className="relative block w-3 h-[18px] rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 shadow-[0_0_12px_rgba(251,191,36,0.95)] animate-candle-flicker"
                        style={{
                          animationDelay: delay,
                          borderRadius: '50% 50% 50% 50% / 68% 68% 32% 32%',
                        }}
                      >
                        <span
                          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-white/95 rounded-full"
                          style={{ borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%' }}
                        />
                      </span>
                    </>
                  ) : (
                    <span className="w-1 h-3.5 mb-0.5 rounded-full bg-slate-400/30 blur-[1px]" />
                  )}
                </div>

                {/* Wick */}
                <span className="w-[1.5px] h-1 bg-slate-400/80" />

                {/* Candle Stick */}
                <span className="w-2 h-8 sm:h-9 rounded-t-[2px] bg-gradient-to-b from-rose-200 via-amber-200 to-amber-500/85 border-x border-t border-amber-100/40 shadow-sm group-hover:brightness-110 transition-all" />
              </button>
            );
          })}
        </div>

        {/* TIER 1 (Top Narrow Rectangular Cake Layer) */}
        <div className="relative w-[195px] sm:w-[225px] rounded-t-lg border-x border-t-[3px] border-t-amber-200/90 border-x-amber-500/25 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.03] px-2.5 pt-3 pb-2 shadow-inner overflow-hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 200 10"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-0 left-0 w-full h-2 text-amber-200/55"
          >
            <path
              fill="currentColor"
              d="M0,0 L200,0 L200,3 C192,3 190,9 183,9 C176,9 175,3 166,3 C158,3 156,8 148,8 C140,8 139,3 130,3 C122,3 120,9 112,9 C104,9 102,3 94,3 C86,3 84,8 76,8 C68,8 66,3 58,3 C50,3 48,9 40,9 C32,9 30,3 22,3 C14,3 12,8 5,8 C2,8 0,4 0,3 Z"
            />
          </svg>
          <p className="relative z-10 text-[8.5px] sm:text-[9.5px] leading-[1.35] font-semibold text-amber-100/95 text-justify [text-align-last:center] tracking-tight">
            {TIER_1_TEXT}
          </p>
        </div>

        {/* TIER 2 (Middle Wider Rectangular Cake Layer) */}
        <div className="relative w-[275px] sm:w-[320px] rounded-t-lg border-x border-t-[3px] border-t-rose-300/90 border-x-rose-400/25 bg-gradient-to-b from-rose-500/[0.11] to-rose-500/[0.03] px-3 pt-3 pb-2 shadow-inner overflow-hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 280 10"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-0 left-0 w-full h-2 text-rose-300/50"
          >
            <path
              fill="currentColor"
              d="M0,0 L280,0 L280,3 C270,3 268,9 258,9 C248,9 246,3 236,3 C226,3 224,8 214,8 C204,8 202,3 192,3 C182,3 180,9 170,9 C160,9 158,3 148,3 C138,3 136,8 126,8 C116,8 114,3 104,3 C94,3 92,9 82,9 C72,9 70,3 60,3 C50,3 48,8 38,8 C28,8 26,3 16,3 C8,3 5,8 0,4 Z"
            />
          </svg>
          <p className="relative z-10 text-[8.5px] sm:text-[9.5px] leading-[1.35] font-semibold text-rose-100/95 text-justify [text-align-last:center] tracking-tight">
            {TIER_2_TEXT}
          </p>
        </div>

        {/* TIER 3 (Bottom Wide Rectangular Cake Layer) */}
        <div className="relative w-full max-w-[355px] sm:max-w-[420px] rounded-t-lg border-x border-t-[3px] border-t-amber-300/90 border-x-amber-500/25 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.04] px-3.5 pt-3 pb-2.5 shadow-inner overflow-hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 360 10"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-0 left-0 w-full h-2 text-amber-300/50"
          >
            <path
              fill="currentColor"
              d="M0,0 L360,0 L360,3 C348,3 345,9 334,9 C322,9 320,3 308,3 C296,3 294,8 282,8 C270,8 268,3 256,3 C244,3 242,9 230,9 C218,9 216,3 204,3 C192,3 190,8 178,8 C166,8 164,3 152,3 C140,3 138,9 126,9 C114,9 112,3 100,3 C88,3 86,8 74,8 C62,8 60,3 48,3 C36,3 34,9 22,9 C12,9 8,3 0,3 Z"
            />
          </svg>
          <p className="relative z-10 text-[8.5px] sm:text-[9.5px] leading-[1.38] font-semibold text-slate-100/95 text-justify [text-align-last:center] tracking-tight">
            {TIER_3_TEXT}
          </p>
        </div>

        {/* Cake Plate & Stand Pedestal */}
        <div className="w-full max-w-[385px] sm:max-w-[450px] flex flex-col items-center">
          <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-slate-700 via-amber-200/80 to-slate-700 shadow-lg shadow-black/60 border-t border-white/25" />
          <div className="w-16 h-2.5 bg-gradient-to-b from-slate-600 to-slate-800 border-x border-slate-500/30" />
          <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-slate-800 via-slate-500/80 to-slate-800" />
        </div>
      </div>

      {/* Subtle Wish Action */}
      <div className="relative z-10 pt-4 flex justify-center">
        <button
          type="button"
          onClick={handleToggleAll}
          className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          {anyLit ? (
            <>
              <Sparkles className="w-3 h-3" />
              <span>Make a Wish &amp; Blow Candles</span>
            </>
          ) : (
            <>
              <Flame className="w-3 h-3" />
              <span>Relight Candles</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
