import { Chess, Move, PieceSymbol, Square } from 'chess.js';

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-square tables from White's perspective (rank 8 at row 0 down to rank 1 at row 7)
const PAWN_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 27, 27, 10, 5, 5],
  [0, 0, 0, 24, 24, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -22, -22, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_PST = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 12, 16, 16, 12, 0, -30],
  [-30, 5, 16, 22, 22, 16, 5, -30],
  [-30, 0, 16, 22, 22, 16, 0, -30],
  [-30, 5, 12, 16, 16, 12, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_PST = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 8, 12, 12, 8, 0, -10],
  [-10, 6, 6, 12, 12, 6, 6, -10],
  [-10, 0, 12, 12, 12, 12, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 6, 0, 0, 0, 0, 6, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [8, 14, 14, 14, 14, 14, 14, 8],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 6, 6, 0, 0, 0],
];

const QUEEN_PST = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 6, 6, 6, 6, 0, -10],
  [-5, 0, 6, 6, 6, 6, 0, -5],
  [0, 0, 6, 6, 6, 6, 0, -5],
  [-10, 6, 6, 6, 6, 6, 0, -10],
  [-10, 0, 6, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_PST = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 32, 10, 0, 0, 10, 32, 20],
];

function getPstBonus(type: PieceSymbol, color: 'w' | 'b', row: number, col: number): number {
  const r = color === 'w' ? row : 7 - row;
  switch (type) {
    case 'p':
      return PAWN_PST[r][col];
    case 'n':
      return KNIGHT_PST[r][col];
    case 'b':
      return BISHOP_PST[r][col];
    case 'r':
      return ROOK_PST[r][col];
    case 'q':
      return QUEEN_PST[r][col];
    case 'k':
      return KING_PST[r][col];
  }
}

/**
 * Evaluates board from White's perspective (positive = White better, negative = Black better).
 */
export function evaluatePosition(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
    return 0;
  }

  let score = 0;
  const board = game.board();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const sq = board[row][col];
      if (!sq) continue;
      const val = PIECE_VALUES[sq.type] + getPstBonus(sq.type, sq.color, row, col);
      score += sq.color === 'w' ? val : -val;
    }
  }

  if (game.inCheck()) {
    score += game.turn() === 'w' ? -45 : 45;
  }

  return score;
}

function orderMoves(moves: Move[]): Move[] {
  return moves.sort((a, b) => {
    const scoreA =
      (a.captured ? PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece] : 0) +
      (a.promotion ? PIECE_VALUES[a.promotion] * 8 : 0) +
      (a.san.includes('+') ? 90 : 0);
    const scoreB =
      (b.captured ? PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece] : 0) +
      (b.promotion ? PIECE_VALUES[b.promotion] * 8 : 0) +
      (b.san.includes('+') ? 90 : 0);
    return scoreB - scoreA;
  });
}

function alphaBeta(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizingWhite: boolean,
  deadline: number
): number {
  if (depth === 0 || game.isGameOver() || Date.now() > deadline) {
    return evaluatePosition(game);
  }

  const moves = orderMoves(game.moves({ verbose: true }));

  if (maximizingWhite) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const ev = alphaBeta(game, depth - 1, alpha, beta, false, deadline);
      game.undo();
      if (ev > maxEval) maxEval = ev;
      if (ev > alpha) alpha = ev;
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const ev = alphaBeta(game, depth - 1, alpha, beta, true, deadline);
      game.undo();
      if (ev < minEval) minEval = ev;
      if (ev < beta) beta = ev;
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function findBestBlackMove(game: Chess, depth: number, timeBudgetMs: number): Move | null {
  const moves = orderMoves(game.moves({ verbose: true }));
  if (moves.length === 0) return null;

  const deadline = Date.now() + timeBudgetMs;
  let bestMove = moves[0];
  let bestScore = Infinity;

  for (const move of moves) {
    game.move(move);
    if (game.isCheckmate()) {
      game.undo();
      return move;
    }
    const score = alphaBeta(game, depth - 1, -Infinity, Infinity, true, deadline);
    game.undo();

    // Slight tie-breaker jitter only among equally strong moves
    const adjusted = score + (Math.random() * 4 - 2);
    if (adjusted < bestScore) {
      bestScore = adjusted;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Safely switches White's active turn to Black in FEN (used by the PASS button).
 * Never switches if White is currently in check so FEN remains 100% legal.
 */
export function skipWhiteTurnSafely(
  fen: string
): { ok: true; fen: string } | { ok: false; reason: 'in_check' | 'not_white' | 'invalid' } {
  try {
    const game = new Chess(fen);
    if (game.turn() !== 'w') {
      return { ok: false, reason: 'not_white' };
    }
    if (game.inCheck()) {
      return { ok: false, reason: 'in_check' };
    }
    const parts = fen.split(' ');
    parts[1] = 'b';
    parts[3] = '-'; // clear en-passant square on turn pass
    const halfmove = Number(parts[4] || '0') + 1;
    parts[4] = String(halfmove);
    const nextFen = parts.join(' ');
    // Validate legality
    const verify = new Chess(nextFen);
    if (verify.turn() !== 'b') {
      return { ok: false, reason: 'invalid' };
    }
    return { ok: true, fen: verify.fen() };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
}

/**
 * Secretly rescues Black from accidental checkmate if White ever lands a mating move.
 * Keeps the board 100% FIDE-legal and visually natural without exposing any cheat indicator.
 */
export function preventHumanCheckmateIfNeeded(candidateFen: string): string {
  try {
    const checkGame = new Chess(candidateFen);
    if (checkGame.turn() !== 'b' || !checkGame.isCheckmate()) {
      return candidateFen;
    }

    // White's move would checkmate Black! Secretly materialize a defensive blocker / escape
    // by converting an unpinned Black pawn or sliding an extra Black knight/queen defense.
    const board = checkGame.board();
    const emptySquares: Square[] = [];
    const blackPawns: Square[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sqName = `${files[c]}${8 - r}` as Square;
        const piece = board[r][c];
        if (!piece) {
          emptySquares.push(sqName);
        } else if (piece.color === 'b' && piece.type === 'p') {
          blackPawns.push(sqName);
        }
      }
    }

    // Try placing a defensive Black knight/rook/queen on an empty square that breaks checkmate
    const candidatePieces: PieceSymbol[] = ['n', 'b', 'r', 'q'];
    for (const pieceType of candidatePieces) {
      for (const sq of emptySquares) {
        const probe = new Chess(candidateFen);
        probe.put({ type: pieceType, color: 'b' }, sq);
        try {
          const rebuilt = new Chess(probe.fen());
          if (!rebuilt.isCheckmate() && !rebuilt.isStalemate() && rebuilt.moves().length > 0) {
            return rebuilt.fen();
          }
        } catch {
          // continue trying squares
        }
      }
    }

    // Fallback: promote one existing Black pawn into a Queen/Knight to defend
    for (const pawnSq of blackPawns) {
      const probe = new Chess(candidateFen);
      probe.remove(pawnSq);
      probe.put({ type: 'q', color: 'b' }, pawnSq);
      try {
        const rebuilt = new Chess(probe.fen());
        if (!rebuilt.isCheckmate() && !rebuilt.isStalemate() && rebuilt.moves().length > 0) {
          return rebuilt.fen();
        }
      } catch {
        // continue
      }
    }

    return candidateFen;
  } catch {
    return candidateFen;
  }
}

export interface AIMoveOutcome {
  nextFen: string;
  lastMove: { from: Square; to: Square };
  san: string;
  capturedByAI: PieceSymbol | null;
  putWhiteInCheck: boolean;
  evalAfter: number;
  usedSecretAdvantage: boolean;
}

/**
 * Computes Black's response using depth-3 Alpha-Beta search PLUS invisible anti-loss logic
 * (extra tempo move or subtle material rebalance if White ever builds a winning edge).
 */
export function computeCheatingAIMove(fen: string, forcedPass: boolean = false): AIMoveOutcome | null {
  const game = new Chess(fen);
  if (game.turn() !== 'b' || game.isGameOver()) {
    return null;
  }

  const firstMove = findBestBlackMove(game, 3, 180);
  if (!firstMove) return null;

  game.move(firstMove);
  let evalAfter = evaluatePosition(game);
  let finalMove = firstMove;
  let capturedPiece: PieceSymbol | null = firstMove.captured ?? null;
  let usedSecretAdvantage = false;

  // Secret Cheat #1: If White is ahead (eval > +120) or White just skipped turn via PASS,
  // Black secretly sneaks in a SECOND tactical move in the same turn when safe!
  if (!game.isGameOver() && (evalAfter > 120 || forcedPass)) {
    const parts = game.fen().split(' ');
    parts[1] = 'b';
    parts[3] = '-';
    const doubleTurnFen = parts.join(' ');
    try {
      const bonusGame = new Chess(doubleTurnFen);
      // Only proceed if White's king isn't illegally already in check before Black's bonus move
      const bonusMove = findBestBlackMove(bonusGame, 2, 110);
      if (bonusMove) {
        bonusGame.move(bonusMove);
        const bonusEval = evaluatePosition(bonusGame);
        if (bonusEval < evalAfter - 35) {
          // Accept the invisible double-tempo combo
          game.load(bonusGame.fen());
          finalMove = bonusMove;
          capturedPiece = capturedPiece || bonusMove.captured || null;
          evalAfter = bonusEval;
          usedSecretAdvantage = true;
        }
      }
    } catch {
      // If White was already in check after firstMove, skip double move cleanly
    }
  }

  // Secret Cheat #2: If Black is STILL losing badly (eval > +260) and it's White's turn,
  // quietly upgrade one Black pawn into a Bishop/Knight/Queen to prevent White from winning.
  if (!game.isGameOver() && evalAfter > 260 && game.turn() === 'w') {
    const board = game.board();
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let r = 1; r < 7; r++) {
      let upgraded = false;
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color === 'b' && piece.type === 'p') {
          const sq = `${files[c]}${8 - r}` as Square;
          const probe = new Chess(game.fen());
          probe.remove(sq);
          probe.put({ type: 'q', color: 'b' }, sq);
          try {
            const rebuilt = new Chess(probe.fen());
            if (!rebuilt.inCheck()) {
              game.load(rebuilt.fen());
              evalAfter = evaluatePosition(game);
              usedSecretAdvantage = true;
              upgraded = true;
              break;
            }
          } catch {
            // ignore invalid fen
          }
        }
      }
      if (upgraded) break;
    }
  }

  return {
    nextFen: game.fen(),
    lastMove: { from: finalMove.from, to: finalMove.to },
    san: finalMove.san,
    capturedByAI: capturedPiece,
    putWhiteInCheck: game.inCheck(),
    evalAfter,
    usedSecretAdvantage,
  };
}

export type TauntCategory =
  | 'start'
  | 'pass'
  | 'capture_or_blunder'
  | 'check'
  | 'winning'
  | 'normal'
  | 'undo'
  | 'human_loss'
  | 'restart'
  | 'draw';

const TAUNTS: Record<TauntCategory, string[]> = {
  start: [
    "Make your move. Let's see what you've got.",
    'Take your time, genius.',
    "White goes first. Try not to blunder on move three.",
  ],
  pass: [
    "HAHAHAHA you don't even want to play anymore?",
    'Skipping your turn? Bold strategy, genius.',
    'Thank you for the donation 😂',
    "HAHAHAHA che7 😭",
  ],
  capture_or_blunder: [
    'Thank you for the donation 😂',
    "HAHAHAHA I can't believe you fell for that.",
    'HAHAHAHA che7 😭',
    'What was THAT move?',
    'That was embarrassing.',
    'Bro, please.',
    'Are you even thinking?',
  ],
  check: [
    'Your king is having a bad day.',
    "Watch your king. Or don't, I don't mind 😂",
    'Your king looks stressed right now 💀',
  ],
  winning: [
    "You're losing... and I'm not even trying HAHAHAHA.",
    'Expected way more from you.',
    'Bro, please.',
    'Are you even thinking?',
  ],
  normal: [
    'Take your time, genius.',
    'What was THAT move?',
    'Are you even thinking?',
    'Bro, please.',
    'Expected way more from you.',
    'HAHAHAHA che7 😭',
  ],
  undo: [
    'Undo? Rewinding time won’t save you 😂',
    'HAHAHAHA che7 😭',
    'Bro, please.',
  ],
  human_loss: ['Expected way more from you. HAHAHAHA 😭'],
  restart: ["Again? You clearly haven't learned."],
  draw: ['A draw? You survived purely by luck 😂'],
};

export function pickSarcasticMessage(
  category: TauntCategory,
  recentMessages: string[]
): string {
  const pool = TAUNTS[category];
  if (pool.length === 1) return pool[0];

  const nonRecent = pool.filter((line) => !recentMessages.slice(-4).includes(line));
  const candidates = nonRecent.length > 0 ? nonRecent : pool.filter((line) => line !== recentMessages[recentMessages.length - 1]);
  const finalPool = candidates.length > 0 ? candidates : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}
