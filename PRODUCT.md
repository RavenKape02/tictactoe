# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) with React 19, TypeScript, Tailwind CSS v4 and shadcn/ui, plus React Three Fiber and drei for the 3D board. The stack is set by the coding test ("React + Next.js", deployed on Vercel). The 3D layer was the user's request.

## Users

Reviewers at Semprove (via the CAPM coding test) who open the public Vercel URL and play two or three rounds on desktop or phone to check a job applicant's React and Next.js skills. Secondary: anyone who opens the GitHub repo or the applicant's portfolio.

## Product Purpose

A two-player Tic-Tac-Toe game that passes the test's three checks at a glance: players alternate on a 3x3 board, the game shows the winner or a draw, and a New Game button starts over. Success means a reviewer confirms all three within seconds and remembers this entry among other candidates'.

## Positioning

A physical tabletop game rendered in real 3D that you play directly on the board, rather than a flat grid of buttons.

## Operating Context

Played in a desktop or mobile browser on the public Vercel production URL, usually for a few minutes during a review. The reviewer also submits screenshots and possibly a demo video taken from it.

## Capabilities and Constraints

- Two players on one device, alternating X and O.
- Shows whose turn it is, the winner with the winning line, or a draw.
- New Game resets the board and keeps the scores.
- The scoreboard counts X wins, O wins and draws, saved in the browser across reloads. A separate, smaller Reset scores control clears it.
- Must work without WebGL (plain board fallback) and with reduced motion.
- Must be a public production URL, not a Vercel preview URL.

## Brand Commitments

Applicant: Raven Caduyac. A small credit line links to https://github.com/RavenKape02 and https://ravencaduyac.engineer.

## Evidence on Hand

None beyond the game itself. Do not invent player names, stats or testimonials.

## Product Principles

- The three pass checks are never ambiguous.
- The board is the interface, played directly.
- Personality lives in the materials and motion, never at the cost of clarity.
- Fast to load and fair on a phone.

## Accessibility & Inclusion

Keyboard play and screen-reader announcements of turns and results. Respect prefers-reduced-motion.
