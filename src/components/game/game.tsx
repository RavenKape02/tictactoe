"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import type { Cell, Outcome } from "@/lib/game";
import { cn } from "@/lib/utils";
import { PLAYER_NAME } from "./palette";
import { PieceIcon } from "./piece-icon";
import { ScorePad } from "./score-pad";
import { useGame } from "./use-game";
import { beechDataUrl } from "./wood-texture";

const Scene = dynamic(() => import("./scene"), { ssr: false });

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

let webglSupport: boolean | undefined;
function detectWebGL() {
  if (webglSupport === undefined) {
    try {
      const c = document.createElement("canvas");
      webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

/** null on the server, then whether this browser can draw the 3D board. */
function useWebGL() {
  return useSyncExternalStore<boolean | null>(
    () => () => {},
    detectWebGL,
    () => null,
  );
}

function describe(board: readonly Cell[], lastMove: number | null, round: number, outcome: Outcome) {
  if (lastMove === null) return round > 0 ? `New game. ${PLAYER_NAME.X} X to play.` : "";
  const mark = board[lastMove];
  const placed = mark
    ? `${PLAYER_NAME[mark]} ${mark} placed on row ${Math.floor(lastMove / 3) + 1}, column ${(lastMove % 3) + 1}.`
    : "";
  const result =
    outcome.kind === "win"
      ? ` ${PLAYER_NAME[outcome.winner]} ${outcome.winner} wins.`
      : outcome.kind === "draw"
        ? " It's a draw."
        : ` ${PLAYER_NAME[outcome.next]} ${outcome.next} to play.`;
  return placed + result;
}

const cellLabel = (i: number, cell: Cell) =>
  `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}, ${cell ? `${PLAYER_NAME[cell]} ${cell}` : "empty"}`;

function Status({ outcome }: { outcome: Outcome }) {
  if (outcome.kind === "win") {
    const name = PLAYER_NAME[outcome.winner];
    return (
      <>
        <PieceIcon player={outcome.winner} className="size-[0.8em] shrink-0" />
        <span>
          {name} {outcome.winner} wins
        </span>
      </>
    );
  }
  if (outcome.kind === "draw") return <span>It&apos;s a draw</span>;
  return (
    <>
      <PieceIcon player={outcome.next} className="size-[0.8em] shrink-0" />
      <span>
        {PLAYER_NAME[outcome.next]} {outcome.next} to play
      </span>
    </>
  );
}

export function Game() {
  const { board, score, round, outcome, lastMove, playAt, newGame, resetScores } = useGame();
  const [preview, setPreview] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const webgl = useWebGL();
  const flat = webgl === false;
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const newGameRef = useRef<HTMLButtonElement>(null);
  const playing = outcome.kind === "playing";

  // Announced to screen readers through the live region below.
  const announcement = describe(board, lastMove, round, outcome);

  // Once a round ends, hand keyboard focus to New Game.
  useEffect(() => {
    if (!playing && cellRefs.current.some((b) => b === document.activeElement)) newGameRef.current?.focus();
  }, [playing]);

  const startNewGame = () => {
    newGame();
    setPreview(null);
  };

  const onCellKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
    const step = moves[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const row = Math.floor(i / 3);
    let next = i + step;
    if (Math.abs(step) === 1 && Math.floor(next / 3) !== row) next = i; // stay on the row
    if (next < 0 || next > 8) next = i;
    cellRefs.current[next]?.focus();
  };

  return (
    <main className="relative h-dvh min-h-[560px] w-full overflow-hidden bg-(--walnut) text-(--chalk)">
      {!flat && (
        <div className="absolute inset-0">
          <Scene
            board={board}
            outcome={outcome}
            round={round}
            preview={preview}
            focused={focused}
            reducedMotion={reducedMotion}
            onPreview={setPreview}
            onPlay={playAt}
          />
        </div>
      )}

      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-between gap-4 p-5 sm:p-8 lg:flex-row lg:p-12">
        <div className="flex flex-col justify-between">
          <header>
            <h1 className="sr-only">Tic-Tac-Toe</h1>
            <p className="flex items-center gap-[0.3em] text-[clamp(2rem,4.2vw+0.8rem,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance">
              <Status outcome={outcome} />
            </p>
            <p className="mt-2 text-sm text-(--chalk-dim) sm:text-base">
              {playing ? "Pick a square on the board." : "Press New Game for another round."}
            </p>
          </header>

          <footer className="pointer-events-auto hidden text-sm text-(--chalk-dim) lg:block">
            <Credit />
          </footer>
        </div>

        {/* Board buttons: the real controls. Visually hidden over the 3D board, shown as a flat board without WebGL. */}
        <div
          role="group"
          aria-label="Board"
          className={cn(
            "pointer-events-auto grid grid-cols-3",
            flat
              ? "flat-board mx-auto aspect-square w-full max-w-[340px] grid-rows-3 gap-2 rounded-xl bg-(--beech) p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)]"
              : "sr-only-focusable",
          )}
        >
          {board.map((cell, i) => (
            <button
              key={i}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              type="button"
              aria-label={cellLabel(i, cell)}
              aria-disabled={!playing || cell !== null}
              onClick={() => playing && cell === null && playAt(i)}
              onFocus={() => {
                setFocused(i);
                setPreview(playing && cell === null ? i : null);
              }}
              onBlur={() => {
                setFocused(null);
                setPreview(null);
              }}
              onKeyDown={(e) => onCellKey(e, i)}
              className={cn(
                flat &&
                  "grid size-full min-h-0 place-items-center rounded-md bg-(--beech-deep)/40 outline-offset-2 hover:bg-(--beech-deep)/60 aria-disabled:cursor-default",
              )}
            >
              {flat && cell && <PieceIcon player={cell} className="size-3/5" />}
            </button>
          ))}
        </div>

        <aside className="pointer-events-auto flex w-full flex-col gap-4 self-end sm:max-w-[360px] lg:self-center">
          <ScorePad score={score} onReset={resetScores} />
          <button
            ref={(el) => {
              newGameRef.current = el;
              // Cut from the same beech as the board.
              if (el) el.style.backgroundImage = `url(${beechDataUrl()})`;
            }}
            type="button"
            onClick={startNewGame}
            className="wood-block h-14 w-full rounded-xl text-lg font-bold tracking-tight text-(--groove)"
          >
            New Game
          </button>
          <p className="text-xs text-(--chalk-dim) lg:hidden">
            <Credit />
          </p>
        </aside>
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {announcement}
      </p>
    </main>
  );
}

function Credit() {
  return (
    <>
      Made by Raven Caduyac ·{" "}
      <a className="underline underline-offset-4 hover:text-(--chalk)" href="https://github.com/RavenKape02">
        GitHub
      </a>{" "}
      ·{" "}
      <a className="underline underline-offset-4 hover:text-(--chalk)" href="https://ravencaduyac.engineer">
        Portfolio
      </a>
    </>
  );
}
