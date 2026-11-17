import type { Score } from "@/lib/game";
import { PieceIcon } from "./piece-icon";

const MAX_TALLY = 20;

/** Ballpoint tally marks: groups of four uprights struck through by a fifth. */
function Tally({ count }: { count: number }) {
  const shown = Math.min(count, MAX_TALLY);
  const groups = Math.ceil(shown / 5);
  const width = Math.max(groups * 34 - 6, 0);
  if (shown === 0) return <svg width={0} height={24} aria-hidden />;
  return (
    <svg width={width} height={24} viewBox={`0 0 ${width} 24`} aria-hidden className="overflow-visible">
      {Array.from({ length: groups }, (_, g) => {
        const inGroup = Math.min(5, shown - g * 5);
        const ox = g * 34;
        return (
          <g key={g} stroke="var(--ink)" strokeWidth={2.25} strokeLinecap="round" fill="none">
            {Array.from({ length: Math.min(inGroup, 4) }, (_, i) => {
              // Every stroke leans like a quick ballpoint mark; the wobble is deterministic per mark.
              const j = ((g * 5 + i) * 7919) % 5;
              const top = ox + 4.5 + i * 6 + j * 0.25;
              return <path key={i} d={`M${top} ${3 + (j % 2)} Q${top - 0.6} 12 ${top - 2.2 - j * 0.2} ${21 - (j % 3)}`} />;
            })}
            {inGroup === 5 && <path d={`M${ox - 2} 17 L${ox + 25} 6`} />}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * One entry on the pad. Wider screens: label, tally and number on one ruled line.
 * Phones: the three entries sit side by side, each using two ruled lines (label and
 * number, then the tally) so the board above stays clear.
 */
function Row({ label, icon, count }: { label: string; icon?: React.ReactNode; count: number }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 sm:grid-cols-[6.25rem_1fr_auto] sm:gap-x-3">
      <dt className="flex h-10 items-center gap-1.5 font-semibold sm:gap-2">
        {icon}
        {label}
      </dt>
      <dd className="contents">
        <span className="order-3 col-span-2 flex h-10 min-w-0 items-center overflow-hidden sm:order-none sm:col-span-1 sm:justify-end">
          <Tally count={count} />
        </span>
        <span className="flex h-10 items-center justify-end text-xl font-bold tabular-nums">{count}</span>
      </dd>
    </div>
  );
}

export function ScorePad({ score, onReset }: { score: Score; onReset: () => void }) {
  const empty = score.X + score.O + score.draws === 0;
  return (
    <section
      aria-labelledby="score-heading"
      className="legal-pad relative w-full rotate-[-1.5deg] rounded-[3px] pb-3 pl-10 pr-4 pt-3 sm:pb-4 sm:pl-12 sm:pr-5"
    >
      <div className="flex h-10 items-center justify-between">
        <h2 id="score-heading" className="text-lg font-bold tracking-tight">
          Score
        </h2>
        <button
          type="button"
          onClick={onReset}
          disabled={empty}
          className="rounded-sm text-sm font-medium underline decoration-1 underline-offset-4 hover:decoration-2 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
        >
          Reset scores
        </button>
      </div>
      <dl className="grid grid-cols-3 gap-x-4 text-[0.95rem] sm:block">
        <Row label="Blue" icon={<PieceIcon player="X" className="size-4" />} count={score.X} />
        <Row label="Red" icon={<PieceIcon player="O" className="size-4" />} count={score.O} />
        <Row label="Draws" count={score.draws} />
      </dl>
    </section>
  );
}
