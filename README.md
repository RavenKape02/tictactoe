# Tic-Tac-Toe

Two-player Tic-Tac-Toe on a wooden 3D board, built for the CAPM / Semprove React + Next.js coding test.

**Live:** https://raven-tictactoe.vercel.app

## What it does

- **Turns:** Blue X and Red O take turns on a 3×3 board. You play by clicking or tapping the 3D board itself, and a translucent ghost piece previews your move.
- **Results:** the status line shows whose turn it is, then the winner or a draw. When someone wins, the winning three hop and a strike line draws through them.
- **New Game:** clears the board and keeps the scores.
- **Scoreboard:** a legal-pad scoreboard counts Blue wins, Red wins and draws, using tally marks. Scores stay after a page reload, and **Reset scores** clears them.
- **Accessibility:**
  - You can play with the keyboard: Tab onto the board, use the arrow keys to move, and press Enter to place a piece.
  - Screen readers announce every move and the result.
  - The pieces stop animating when the system asks for reduced motion.
  - If a browser can't run WebGL, a flat board is shown instead.

## Stack

- Next.js 16 (App Router), React 19 and TypeScript
- Tailwind CSS v4 and shadcn/ui
- React Three Fiber, drei and three.js for the board. The wood grain is generated in code, so there are no image files to load.
- Vitest for the game rules

## Code tour

| File | What's in it |
| --- | --- |
| `src/lib/game.ts` | The game rules as pure functions: turns, win and draw detection, score parsing |
| `src/lib/game.test.ts` | Tests for those rules |
| `src/components/game/use-game.ts` | Game state (a reducer) and score storage |
| `src/components/game/game.tsx` | The page: status line, keyboard and screen-reader controls, the flat fallback board |
| `src/components/game/scene.tsx` | The 3D desk, board, pieces, animations and camera framing |
| `src/components/game/score-pad.tsx` | The legal-pad scoreboard and its tally marks |

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # rule tests
npm run build    # production build
```

Made by [Raven Caduyac](https://ravencaduyac.engineer) · [GitHub](https://github.com/RavenKape02)
