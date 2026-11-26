import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chess, Move, Square } from 'chess.js';
import {
  RotateCcw,
  Undo2,
  SkipForward,
  History,
} from 'lucide-react';
import { ChessPieceSvg, PieceColor, PieceType } from './ChessPieces';
import {
  computeCheatingAIMove,
  evaluatePosition,
  pickSarcasticMessage,
  preventHumanCheckmateIfNeeded,
  skipWhiteTurnSafely,
} from '../utils/chessAI';
import { sound } from '../utils/audio';

interface ChessGameProps {
  onNext: () => void;
}

interface HistorySnapshot {
  fen: string;
  lastMove: { from: Square; to: Square } | null;
  moveLog: MoveEntry[];
}

interface MoveEntry {
  turnNumber: number;
  whiteSan: string;
  blackSan?: string;
}

interface PendingPromotion {
  from: Square;
  to: Square;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

export const ChessGame: React.FC<ChessGameProps> = ({ onNext }) => {
  const initialFen = useMemo(() => new Chess().fen(), []);
  const [fen, setFen] = useState<string>(initialFen);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [moveLog, setMoveLog] = useState<MoveEntry[]>([]);
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const [aiMessage, setAiMessage] = useState<string>(() =>
    pickSarcasticMessage('start', [])
  );
  const recentMessagesRef = useRef<string[]>([]);
  const aiTimerRef = useRef<number | null>(null);

  const game = useMemo(() => new Chess(fen), [fen]);
  const board = useMemo(() => game.board(), [game]);
  const isWhiteTurn = game.turn() === 'w';
  const inCheck = game.inCheck();
  const isCheckmate = game.isCheckmate();
  const isDraw =
    !isCheckmate &&
    (game.isDraw() ||
      game.isStalemate() ||
      game.isThreefoldRepetition() ||
      game.isInsufficientMaterial());
  const isGameOver = isCheckmate || isDraw;
  const humanLost = isCheckmate && game.turn() === 'w';
  const humanWon = isCheckmate && game.turn() === 'b';

  const pushMessage = useCallback((msg: string) => {
    recentMessagesRef.current = [...recentMessagesRef.current.slice(-6), msg];
    setAiMessage(msg);
  }, []);

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) {
        window.clearTimeout(aiTimerRef.current);
      }
    };
  }, []);

  const legalMovesForSelected = useMemo<Move[]>(() => {
    if (!selectedSquare || !isWhiteTurn || isThinking || isGameOver) return [];
    return game.moves({ square: selectedSquare, verbose: true });
  }, [selectedSquare, isWhiteTurn, isThinking, isGameOver, game]);

  const legalTargetMap = useMemo(() => {
    const map = new Map<Square, Move[]>();
    for (const m of legalMovesForSelected) {
      const existing = map.get(m.to) ?? [];
      existing.push(m);
      map.set(m.to, existing);
    }
    return map;
  }, [legalMovesForSelected]);

  const triggerAITurn = useCallback(
    (
      fenForAI: string,
      opts: {
        forcedPass?: boolean;
        currentLog: MoveEntry[];
      }
    ) => {
      setIsThinking(true);
      if (aiTimerRef.current) {
        window.clearTimeout(aiTimerRef.current);
      }

      const delay = opts.forcedPass ? 380 : 480;
      aiTimerRef.current = window.setTimeout(() => {
        const outcome = computeCheatingAIMove(fenForAI, opts.forcedPass);
        setIsThinking(false);

        if (!outcome) return;

        const nextGame = new Chess(outcome.nextFen);
        const updatedLog = [...opts.currentLog];
        if (opts.forcedPass) {
          updatedLog.push({
            turnNumber: updatedLog.length + 1,
            whiteSan: 'PASS',
            blackSan: outcome.san,
          });
        } else if (updatedLog.length > 0 && !updatedLog[updatedLog.length - 1].blackSan) {
          updatedLog[updatedLog.length - 1] = {
            ...updatedLog[updatedLog.length - 1],
            blackSan: outcome.san,
          };
        } else {
          updatedLog.push({
            turnNumber: updatedLog.length + 1,
            whiteSan: '...',
            blackSan: outcome.san,
          });
        }

        setFen(outcome.nextFen);
        setLastMove(outcome.lastMove);
        setMoveLog(updatedLog);
        setSelectedSquare(null);

        if (nextGame.isCheckmate() && nextGame.turn() === 'w') {
          sound.playErrorBuzzer();
          pushMessage(pickSarcasticMessage('human_loss', recentMessagesRef.current));
        } else if (nextGame.isDraw() || nextGame.isStalemate()) {
          sound.playWarning();
          pushMessage(pickSarcasticMessage('draw', recentMessagesRef.current));
        } else if (opts.forcedPass) {
          sound.playMatchDrop();
          pushMessage(pickSarcasticMessage('pass', recentMessagesRef.current));
        } else if (outcome.putWhiteInCheck) {
          sound.playWarning();
          pushMessage(pickSarcasticMessage('check', recentMessagesRef.current));
        } else if (outcome.capturedByAI) {
          sound.playMatchDrop();
          pushMessage(pickSarcasticMessage('capture_or_blunder', recentMessagesRef.current));
        } else if (outcome.evalAfter <= -220) {
          sound.playMatchDrop();
          pushMessage(pickSarcasticMessage('winning', recentMessagesRef.current));
        } else {
          sound.playMatchDrop();
          pushMessage(pickSarcasticMessage('normal', recentMessagesRef.current));
        }
      }, delay);
    },
    [pushMessage]
  );

  const executeWhiteMove = useCallback(
    (from: Square, to: Square, promotion?: PieceType) => {
      if (!isWhiteTurn || isThinking || isGameOver) return;

      const probe = new Chess(fen);
      let played: Move;
      try {
        played = probe.move({ from, to, promotion });
      } catch {
        return;
      }

      const snapshot: HistorySnapshot = {
        fen,
        lastMove,
        moveLog,
      };
      setHistoryStack((prev) => [...prev, snapshot]);

      const safeFenForAI = preventHumanCheckmateIfNeeded(probe.fen());
      const afterWhite = new Chess(safeFenForAI);

      const nextLog: MoveEntry[] = [
        ...moveLog,
        {
          turnNumber: moveLog.length + 1,
          whiteSan: played.san,
        },
      ];

      setFen(safeFenForAI);
      setLastMove({ from, to });
      setMoveLog(nextLog);
      setSelectedSquare(null);
      setPendingPromotion(null);
      sound.playMatchPickup();

      if (afterWhite.isGameOver()) {
        if (afterWhite.isDraw() || afterWhite.isStalemate()) {
          sound.playWarning();
          pushMessage(pickSarcasticMessage('draw', recentMessagesRef.current));
        }
        return;
      }

      evaluatePosition(afterWhite);
      triggerAITurn(safeFenForAI, {
        forcedPass: false,
        currentLog: nextLog,
      });
    },
    [fen, isWhiteTurn, isThinking, isGameOver, lastMove, moveLog, pushMessage, triggerAITurn]
  );

  const handleSquareClick = (sq: Square) => {
    if (!isWhiteTurn || isThinking || isGameOver || pendingPromotion) return;

    const targetMoves = legalTargetMap.get(sq);
    if (selectedSquare && targetMoves && targetMoves.length > 0) {
      const isPromo = targetMoves.some((m) => Boolean(m.promotion));
      if (isPromo) {
        setPendingPromotion({ from: selectedSquare, to: sq });
        return;
      }
      executeWhiteMove(selectedSquare, sq);
      return;
    }

    const piece = game.get(sq);
    if (piece && piece.color === 'w') {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
      } else {
        setSelectedSquare(sq);
        sound.playKeyClick();
      }
    } else {
      setSelectedSquare(null);
    }
  };

  const handlePieceDragStart = (sq: Square) => {
    if (!isWhiteTurn || isThinking || isGameOver || pendingPromotion) return;
    const piece = game.get(sq);
    if (piece && piece.color === 'w') {
      setSelectedSquare(sq);
    }
  };

  const handleSquareDrop = (sq: Square) => {
    if (!selectedSquare || !isWhiteTurn || isThinking || isGameOver || pendingPromotion) return;
    const targetMoves = legalTargetMap.get(sq);
    if (!targetMoves || targetMoves.length === 0) return;

    const isPromo = targetMoves.some((m) => Boolean(m.promotion));
    if (isPromo) {
      setPendingPromotion({ from: selectedSquare, to: sq });
      return;
    }
    executeWhiteMove(selectedSquare, sq);
  };

  const handlePassTurn = () => {
    if (!isWhiteTurn || isThinking || isGameOver || pendingPromotion) return;

    const passResult = skipWhiteTurnSafely(fen);
    if (!passResult.ok) {
      sound.playWarning();
      pushMessage("Your king is in check — you can't pass this turn! 😂");
      return;
    }

    const snapshot: HistorySnapshot = {
      fen,
      lastMove,
      moveLog,
    };
    setHistoryStack((prev) => [...prev, snapshot]);
    setSelectedSquare(null);
    setFen(passResult.fen);
    sound.playWhoosh();

    triggerAITurn(passResult.fen, {
      forcedPass: true,
      currentLog: moveLog,
    });
  };

  const handleUndo = () => {
    if (isThinking || historyStack.length === 0) return;
    if (aiTimerRef.current) {
      window.clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    const previous = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setFen(previous.fen);
    setLastMove(previous.lastMove);
    setMoveLog(previous.moveLog);
    setSelectedSquare(null);
    setPendingPromotion(null);
    sound.playSelect();
    pushMessage(pickSarcasticMessage('undo', recentMessagesRef.current));
  };

  const handleRestart = () => {
    if (aiTimerRef.current) {
      window.clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setIsThinking(false);
    setFen(initialFen);
    setSelectedSquare(null);
    setLastMove(null);
    setMoveLog([]);
    setHistoryStack([]);
    setPendingPromotion(null);
    sound.playSelect();
    pushMessage(pickSarcasticMessage('restart', recentMessagesRef.current));
  };

  const turnStatusLabel = isCheckmate
    ? humanLost
      ? 'Checkmate · You Lost'
      : 'Checkmate · White Wins'
    : isDraw
    ? 'Draw'
    : isThinking
    ? 'black(manel) thinking...'
    : inCheck
    ? 'Check! Your Turn'
    : 'Your Turn (White)';

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
            CHESS
          </h1>
          <span
            className={`text-xs font-mono font-semibold ${
              isCheckmate
                ? 'text-rose-400'
                : inCheck
                ? 'text-amber-400'
                : isThinking
                ? 'text-slate-300'
                : 'text-emerald-400'
            }`}
          >
            {turnStatusLabel}
          </span>
        </div>

        {/* Simple Sarcastic Judging Text Strip */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <p className="text-xs sm:text-sm text-amber-300 font-medium leading-snug">
            “{aiMessage}”
          </p>
        </div>

        {/* Centered 8x8 Chessboard */}
        <div className="relative w-full max-w-[440px] mx-auto aspect-square rounded-xl overflow-hidden border border-slate-800 shadow-xl select-none bg-slate-950">
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {RANKS.map((rank, rIdx) =>
              FILES.map((file, fIdx) => {
                const sq = `${file}${rank}` as Square;
                const isLight = (rIdx + fIdx) % 2 === 0;
                const piece = board[rIdx][fIdx];
                const isSelected = selectedSquare === sq;
                const isLastMoveSq =
                  lastMove?.from === sq || lastMove?.to === sq;
                const targetMoves = legalTargetMap.get(sq);
                const isLegalTarget = Boolean(targetMoves && targetMoves.length > 0);
                const isCheckedKing =
                  inCheck &&
                  piece &&
                  piece.type === 'k' &&
                  piece.color === game.turn();

                return (
                  <button
                    key={sq}
                    type="button"
                    onClick={() => handleSquareClick(sq)}
                    onDragOver={(e) => {
                      if (isLegalTarget) e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleSquareDrop(sq);
                    }}
                    aria-label={`Square ${sq}`}
                    className={`relative flex items-center justify-center transition-colors duration-150 focus:outline-none ${
                      isLight ? 'bg-[#D6DCE5]' : 'bg-[#465569]'
                    } ${
                      isWhiteTurn && (piece?.color === 'w' || isLegalTarget)
                        ? 'cursor-pointer'
                        : 'cursor-default'
                    }`}
                  >
                    {isLastMoveSq && !isSelected && (
                      <span className="absolute inset-0 bg-amber-400/25 pointer-events-none" />
                    )}
                    {isSelected && (
                      <span className="absolute inset-0 bg-amber-400/45 ring-2 ring-inset ring-amber-300 pointer-events-none" />
                    )}
                    {isCheckedKing && (
                      <span className="absolute inset-0 bg-rose-500/55 ring-2 ring-inset ring-rose-400 pointer-events-none" />
                    )}

                    {isLegalTarget && !piece && (
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 pointer-events-none z-10" />
                    )}
                    {isLegalTarget && piece && (
                      <span className="absolute inset-1 rounded-full border-[3px] border-amber-400/90 pointer-events-none z-10" />
                    )}

                    {piece && (
                      <div
                        draggable={
                          isWhiteTurn && !isThinking && !isGameOver && piece.color === 'w'
                        }
                        onDragStart={() => handlePieceDragStart(sq)}
                        className={`w-[82%] h-[82%] z-20 transition-transform duration-150 ${
                          isSelected ? 'scale-105' : ''
                        }`}
                      >
                        <ChessPieceSvg
                          type={piece.type as PieceType}
                          color={piece.color as PieceColor}
                        />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Pawn Promotion Picker */}
          {pendingPromotion && (
            <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3 text-center shadow-2xl">
                <p className="text-xs font-mono font-bold text-amber-300">
                  Promote Pawn
                </p>
                <div className="flex items-center gap-2">
                  {(['q', 'r', 'b', 'n'] as PieceType[]).map((promoType) => (
                    <button
                      key={promoType}
                      type="button"
                      onClick={() =>
                        executeWhiteMove(
                          pendingPromotion.from,
                          pendingPromotion.to,
                          promoType
                        )
                      }
                      className="w-12 h-12 p-2 rounded-xl bg-slate-800 hover:bg-amber-400/20 border border-slate-700 hover:border-amber-400 transition-colors cursor-pointer"
                    >
                      <ChessPieceSvg type={promoType} color="w" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* End-Game Banner */}
        {isGameOver && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/40 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <p className="text-sm font-black text-rose-400">
              {humanLost
                ? 'Expected way more from you. HAHAHAHA 😭'
                : humanWon
                ? 'Wait... how?!'
                : 'Draw Game'}
            </p>
          </div>
        )}

        {/* Simple Single-Row Controls: PASS, UNDO, RESTART */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handlePassTurn}
            disabled={!isWhiteTurn || isThinking || isGameOver}
            className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <SkipForward className="w-4 h-4 shrink-0" />
            <span>PASS</span>
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={isThinking || historyStack.length === 0}
            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-slate-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Undo2 className="w-4 h-4 shrink-0 text-slate-400" />
            <span>UNDO</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0 text-slate-400" />
            <span>RESTART</span>
          </button>
        </div>

        {/* Optional Compact Move History Toggle */}
        <div className="pt-1 flex items-center justify-between text-xs font-mono text-slate-400">
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            <History className="w-3.5 h-3.5" />
            <span>
              {showHistory ? 'Hide moves' : `Moves (${moveLog.length})`}
            </span>
          </button>
          <span className="text-slate-500">White (You) vs black(manel)</span>
        </div>

        {showHistory && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-32 overflow-y-auto font-mono text-xs tabular-nums space-y-1">
            {moveLog.length === 0 ? (
              <p className="text-slate-500 text-center py-1">No moves yet</p>
            ) : (
              moveLog.map((entry) => (
                <div key={entry.turnNumber} className="flex items-center gap-3">
                  <span className="text-slate-500 w-6">{entry.turnNumber}.</span>
                  <span className="text-slate-100 font-semibold w-16">{entry.whiteSan}</span>
                  <span className="text-amber-300 font-semibold">{entry.blackSan ?? '...'}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Centered NEXT → Button Directly Underneath the Chess Game */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            sound.playSelect();
            onNext();
          }}
          className="px-10 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap tracking-wide"
        >
          <span>NEXT →</span>
        </button>
      </div>
    </div>
  );
};
