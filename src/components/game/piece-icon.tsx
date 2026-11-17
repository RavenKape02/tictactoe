import type { Player } from "@/lib/game";
import { PALETTE } from "./palette";

/** Flat drawing of a game piece, matching the 3D pieces' colours and proportions. */
export function PieceIcon({ player, className }: { player: Player; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {player === "X" ? (
        <g stroke={PALETTE.cobalt} strokeWidth={5.5} strokeLinecap="round">
          <path d="M5 5 L19 19" />
          <path d="M19 5 L5 19" />
        </g>
      ) : (
        <circle cx={12} cy={12} r={7.5} fill="none" stroke={PALETTE.vermilion} strokeWidth={5} />
      )}
    </svg>
  );
}
