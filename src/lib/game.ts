export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = readonly Cell[];

export type Outcome =
  | { kind: "playing"; next: Player }
  | { kind: "win"; winner: Player; line: readonly [number, number, number] }
  | { kind: "draw" };

export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const emptyBoard = (): Cell[] => Array<Cell>(9).fill(null);

/** X always opens; after that the player with fewer marks moves. */
export function nextPlayer(board: Board): Player {
  const xs = board.filter((c) => c === "X").length;
  const os = board.filter((c) => c === "O").length;
  return xs <= os ? "X" : "O";
}

export function getOutcome(board: Board): Outcome {
  for (const line of LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { kind: "win", winner: mark, line };
    }
  }
  if (board.every((c) => c !== null)) return { kind: "draw" };
  return { kind: "playing", next: nextPlayer(board) };
}

/** Returns a new board with the move applied, or the same board if the move is illegal. */
export function play(board: Board, index: number): Board {
  if (index < 0 || index > 8 || board[index] !== null) return board;
  const outcome = getOutcome(board);
  if (outcome.kind !== "playing") return board;
  const nextBoard = board.slice();
  nextBoard[index] = outcome.next;
  return nextBoard;
}

export type Score = { X: number; O: number; draws: number };
export const emptyScore = (): Score => ({ X: 0, O: 0, draws: 0 });

export function addResult(score: Score, outcome: Outcome): Score {
  if (outcome.kind === "win") return { ...score, [outcome.winner]: score[outcome.winner] + 1 };
  if (outcome.kind === "draw") return { ...score, draws: score.draws + 1 };
  return score;
}

/** Parses a stored score defensively; anything malformed becomes a clean slate. */
export function parseScore(raw: string | null): Score {
  if (!raw) return emptyScore();
  try {
    const v = JSON.parse(raw) as Partial<Score>;
    const n = (x: unknown) => (Number.isInteger(x) && (x as number) >= 0 ? (x as number) : 0);
    return { X: n(v.X), O: n(v.O), draws: n(v.draws) };
  } catch {
    return emptyScore();
  }
}
