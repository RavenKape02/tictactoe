---
name: Tic-Tac-Toe
description: Two-player Tic-Tac-Toe as a lacquered wooden toy on a walnut desk, played by touching the 3D board itself.
colors:
  cobalt: "#2347c4"
  vermilion: "#e0461f"
  canary: "#f6d64a"
  ink: "#1b2f86"
  rule: "#6f93d6"
  margin: "#d9452f"
  walnut: "#4a2c1a"
  walnut-grain: "#24130a"
  beech: "#e2b77c"
  beech-deep: "#b98546"
  beech-grain: "#9c6a38"
  groove: "#3f2412"
  groove-floor: "#5e3b1f"
  chalk: "#fbf1e1"
  chalk-dim: "#e6cfae"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw + 0.8rem, 4.25rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: "1.75rem"
    letterSpacing: "-0.025em"
  numeral:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: "1.75rem"
    fontFeature: "tnum"
  score-label:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  body-sm:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25rem"
  caption:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1rem"
rounded:
  sheet: "3px"
  sm: "0.375rem"
  md: "0.5rem"
  xl: "0.875rem"
spacing:
  gutter-sm: "1.25rem"
  gutter-md: "2rem"
  gutter-lg: "3rem"
  stack: "1rem"
  rule: "2.5rem"
  cell-gap: "0.5rem"
components:
  status-line:
    textColor: "{colors.chalk}"
    typography: "{typography.display}"
  status-hint:
    textColor: "{colors.chalk-dim}"
    typography: "{typography.body}"
  button-new-game:
    backgroundColor: "{colors.beech}"
    textColor: "{colors.groove}"
    typography: "{typography.title}"
    rounded: "{rounded.xl}"
    height: "3.5rem"
    width: "100%"
  button-reset-scores:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
  score-pad:
    backgroundColor: "{colors.canary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "0.75rem 1rem 0.75rem 2.5rem"
    width: "100%"
  score-pad-wide:
    backgroundColor: "{colors.canary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "0.75rem 1.25rem 1rem 3rem"
    width: "360px"
  score-pad-heading:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    height: "2.5rem"
  score-pad-row:
    textColor: "{colors.ink}"
    typography: "{typography.score-label}"
    height: "2.5rem"
  score-count:
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
  board-fallback:
    backgroundColor: "{colors.beech}"
    rounded: "{rounded.xl}"
    padding: "0.75rem"
    width: "340px"
  board-fallback-cell:
    backgroundColor: "rgb(185 133 70 / 0.4)"
    rounded: "{rounded.md}"
  board-fallback-cell-hover:
    backgroundColor: "rgb(185 133 70 / 0.6)"
    rounded: "{rounded.md}"
  credit-line:
    textColor: "{colors.chalk-dim}"
    typography: "{typography.body-sm}"
  credit-line-hover:
    textColor: "{colors.chalk}"
---

# Design System: Tic-Tac-Toe

## Overview

**Creative North Star: "The Toy on the Desk"**

The whole page is one physical scene: a sanded beech Tic-Tac-Toe board with carved dark grooves, lying on a walnut desk in warm daylight, with chunky lacquered pieces in toy primaries. The board is the interface. Players touch a square on the 3D board, a translucent ghost of their piece previews the move, and the piece falls, bounces and settles under simulated gravity. Everything else on the page is another object on the same desk: a sheet torn from a canary legal pad that keeps score in ballpoint tally marks, and a beech block cut from the same wood as the board that says New Game.

Density is low and the hierarchy is blunt. One very large status line in chalk white tells you whose move it is, who won, or that it is a draw, with a small drawing of the piece in front of it. A quiet hint sits under it. Nothing else competes. Personality comes from materials (grain, lacquer, paper, ink) and from motion that only happens because a player did something. The world rejects the category default of a flat 3x3 grid of buttons in a centred card; the flat grid exists only as the no-WebGL fallback, and even there it is cut from beech.

The DOM layer and the 3D layer share one palette (`palette.ts` mirrored by the CSS custom properties), so an SVG piece in the status line and a lacquered piece on the board read as the same object.

**Key Characteristics:**
- Full-bleed 3D walnut desk; the beech board is framed into whatever space the overlay leaves free.
- Two player colours only: cobalt for Blue X, vermilion for Red O.
- One typeface, Bricolage Grotesque, carrying hierarchy through weight and size.
- Physical objects instead of cards: paper sheet, wood block, carved board.
- Motion is physics and is always caused by play: drop, damped settle, winning hop and spin, a painted strike.
- Reduced motion shows every end state instantly; nothing is lost but the travel.

## Colors

A warm wood-and-paper ground with two saturated toy primaries and one canary stationery yellow.

### Primary
- **Lacquer Cobalt** (#2347c4): Blue, player X. The X pieces, the X glyph in the status line and score rows, and the win strike when X wins. Never used for chrome, text or controls.

### Secondary
- **Lacquer Vermilion** (#e0461f): Red, player O. The O rings, the O glyph, and the win strike when O wins. Same exclusivity as cobalt.

### Tertiary
- **Legal-Pad Canary** (#f6d64a): the score sheet's paper, the text-selection background, and the global keyboard focus outline.
- **Ballpoint Ink** (#1b2f86): all text and tally strokes on the canary sheet.
- **Pad Rule Blue** (#6f93d6): the 1px horizontal rules on the sheet, one every 2.5rem.
- **Pad Margin Red** (#d9452f): the 1.5px vertical margin line on the sheet.

### Neutral
- **Walnut Desk** (#4a2c1a): the page ground (html background, `main`, browser theme colour) and the base of the procedural desk texture in 3D.
- **Walnut Grain** (#24130a): grain lines of the desk texture (scene only).
- **Beech** (#e2b77c): the board tiles and rim, the New Game block, and the flat fallback board.
- **Beech Deep** (#b98546): fallback board cells, laid over beech at 40% (60% on hover).
- **Beech Grain** (#9c6a38): grain lines and pores of the beech texture.
- **Groove** (#3f2412): New Game label, and the text colour on canary selection.
- **Groove Floor** (#5e3b1f): tint multiplied over the beech texture on the board's base slab, so the channels between tiles read as carved and dark (scene only).
- **Chalk** (#fbf1e1): the status line and every primary text on walnut; also the focus outline on the beech block.
- **Chalk Dim** (#e6cfae): secondary text on walnut (hint line, credit line).

### Named Rules
**The Two Primaries Rule.** Cobalt means Blue X and vermilion means Red O, everywhere and only. A control, a heading or a border never borrows a player colour.

**The One Palette Rule.** A colour that exists in both the scene and the DOM is the same hex in both. The SVG piece icons import the scene palette directly; the CSS custom properties repeat it by hand.

**The Chalk On Walnut Rule.** Text that floats on the desk is chalk (primary) or chalk dim (secondary). Text on the pad is ink. Text on wood is groove.

## Typography

**Display Font:** Bricolage Grotesque (with ui-sans-serif, system-ui, sans-serif), loaded through `next/font/google` as `--font-bricolage`, latin subset, `display: swap`.
**Body Font:** the same family.

**Character:** A chunky, slightly quirky grotesque that sits well beside toy pieces. At 800 weight and tight tracking the status line reads like a painted sign on the scene; at small sizes it stays plain and legible.

### Hierarchy
- **Display** (800, clamp(2rem, 4.2vw + 0.8rem, 4.25rem), 1.02): the status line only ("Blue X to play", "Red O wins", "It's a draw"), balanced wrapping, preceded by a piece icon at 0.8em with a 0.3em gap.
- **Title** (700, 1.125rem, -0.025em): the "Score" heading on the pad and the New Game label.
- **Numeral** (700, 1.25rem, tabular figures): the score counts, right-aligned.
- **Score label** (600, 0.95rem): "Blue", "Red", "Draws" on the pad, each with a 1rem piece icon.
- **Body** (400, 1rem; 0.875rem below 640px): the hint under the status line.
- **Label** (500, 0.875rem): the Reset scores text button, underlined.
- **Caption** (400, 0.75rem below 1024px, 0.875rem at 1024px and up): the credit line.

### Named Rules
**The One Family Rule.** Bricolage Grotesque is the only face. Hierarchy comes from weight (800 / 700 / 600 / 500 / 400) and size, not from a second family.

**The Tabular Count Rule.** Score numbers always use tabular figures so a count changing from 9 to 10 never shifts its neighbours.

## Layout

The 3D canvas fills the viewport (`100dvh`, minimum 560px). A DOM overlay sits above it with pointer events disabled except on real controls, inside a centred container of at most 1400px with a gutter of 1.25rem (phone), 2rem (from 640px) and 3rem (from 1024px).

- **Below 1024px:** a vertical column justified between top and bottom. The status line and hint sit at the top; the score pad, New Game block and credit line stack at the bottom with 1rem between them, right-aligned, full width on phones and at most 360px from 640px.
- **1024px and up:** a row. The left column holds the status line at the top and the credit line at the bottom; the pad and New Game block sit on the right, vertically centred, 360px wide.
- **The board fills the remaining space.** The camera does not centre on the viewport. On every resize it measures the area the overlay leaves free (top inset 124 / 170 / 190px, bottom inset 250 / 360 / 60px, right inset min(460px, 34% of width) on wide screens only), picks the distance that fits the board with a margin (never closer than 9 units), and shifts the projection so the board centres in that free area.
- **Score pad on phones:** below 640px the three score rows sit side by side in three columns and the tally marks are hidden; only the numerals show.
- **Rhythm on the pad:** every row is exactly 2.5rem tall so text sits on the printed rules.
- **No-WebGL fallback:** the board becomes a centred square grid, full width up to 340px, 0.75rem padding and 0.5rem between cells, in the same position the 3D board would occupy.

## Elevation & Depth

Depth is physical. In the scene it comes from real light and shadow; in the DOM, each object casts one soft, warm, long drop shadow with negative spread, as if lying on the desk under the same daylight. There are no grey shadows, no hover lifts and no layered card stacks.

**Scene lighting.**
- Hemisphere light: sky #fff4e0, ground #3b2414, intensity 0.9.
- Key light: directional, warm white #fff1dc, intensity 2.4, from upper left front (-4.5, 9, 4). Casts PCF ("percentage") shadows, 2048px map, frustum ±5, bias -0.0004, normal bias 0.02, radius 5.
- Contact shadows: under the board at y 0.002, colour #1a0c04, opacity 0.5, blur 2.5, reach 1.2, scale 9, 512px.
- Reflections: a 256px environment built from two rectangular light panels, a window key (#fff3e2, intensity 3, at (-3, 5, 3), 6 x 3) and a warm bounce (#ffd9a8, intensity 1.2, at (4, 3, -2), 4 x 2). Their only job is to put a highlight in the lacquer.
- Renderer: antialiased, device pixel ratio 1 to 2, camera field of view 32°, looking down at about 55° (height 0.82, depth 0.58 of the camera distance).

**Scene materials.**
- Desk: 40 x 40 plane, procedural walnut texture (grain spacing 9, waviness 3, seed 7, repeated 2 x 5), roughness 0.62.
- Board: 3.6-unit square; base slab with 0.1 corner radius, beech texture tinted with groove floor, roughness 0.85; nine raised tiles (pitch 1.08, 0.08 grooves, 0.06 deep, 0.012 corner radius) and four rim strips in beech, roughness 0.5.
- Pieces: physical material, roughness 0.32, clearcoat 1, clearcoat roughness 0.12. Winning pieces add an emissive glow of their own colour at 0.18.
- Wood grain is procedural and seeded, so it is identical on every load: a 512px canvas of wavy grain lines (alpha 0.08 to 0.30, width 0.6 to 2.8px) plus fine pores at alpha 0.06, sRGB, anisotropy 8. The beech block in the DOM uses the same grain painted at 256px.

### Shadow Vocabulary
- **Pad on desk** (`box-shadow: 0 1px 1px rgba(40, 20, 5, 0.25), 0 22px 40px -18px rgba(20, 8, 0, 0.75)`): the score sheet. A tight contact line plus a long soft drop.
- **Block at rest** (`box-shadow: inset 0 -5px 0 rgba(90, 50, 15, 0.28), inset 0 1px 0 rgba(255, 245, 225, 0.55), 0 14px 26px -10px rgba(15, 6, 0, 0.8)`): the New Game block. The insets are the sanded bevel (dark lower edge, light top edge); the outer shadow is its depth.
- **Block pressed** (`box-shadow: inset 0 -2px 0 rgba(90, 50, 15, 0.28), inset 0 1px 0 rgba(255, 245, 225, 0.55), 0 6px 14px -8px rgba(15, 6, 0, 0.8)`): the block pushed 3px into the desk.
- **Fallback board** (`box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.6)`): the flat beech board without WebGL.

### Named Rules
**The Objects Not Cards Rule.** Every raised DOM element is a named desk object (paper, wood block, board) with the material to match, never a generic panel.

**The Still At Rest Rule.** At rest, shadows and positions never change. Depth changes only in response to a press.

## Shapes

Toy edges: everything is softened, nothing is sharp, and nothing is pill-shaped. The legal-pad sheet is almost square-cornered (3px) with a 6px gummed strip along its top edge (2px top radius) and is turned -1.5° as if dropped on the desk. Wood takes a moderate round (0.875rem on the New Game block and fallback board, 0.5rem on fallback cells). In 3D, X pieces are two rounded bars (0.86 x 0.24 x 0.24, radius 0.08) crossed at 45°; O pieces are a fat torus (radius 0.3, tube 0.12). Each placed piece gets a small, deterministic yaw (up to about ±0.125 rad by cell) so a full board looks hand-placed rather than stamped. The flat piece icons keep the same proportions: an X of two round-capped strokes (5.5 on a 24 grid) and an O ring (radius 7.5, stroke 5).

## Components

### Buttons
Tactile and wooden: a control is a block you press, not a chip you hover.
- **New Game (primary):** a beech block cut from the board's wood (the procedural grain as a 256px background image over beech), groove label in the title style, full width of the aside, 3.5rem tall, 0.875rem corners, "Block at rest" shadow.
- **Hover:** brightness 1.05 only. No lift, no colour change.
- **Active:** moves down 3px and the shadow shortens to "Block pressed".
- **Transition:** transform and shadow 160ms on cubic-bezier(0.16, 1, 0.3, 1), filter 160ms ease-out. None under reduced motion.
- **Focus:** a 3px chalk outline 3px out (the canary global outline would vanish against beech).
- **Reset scores (tertiary):** a plain ink text button on the pad in the label style, 1px underline 4px below that thickens to 2px on hover. Disabled when every count is zero: 60% opacity, no underline, not-allowed cursor.

### Score Pad (signature)
A sheet torn from a canary legal pad and dropped on the desk.
- **Paper:** canary background, blue rules every 2.5rem (offset 0.75rem from the top), a red margin line 1.5px wide at 2.15rem from the left, a 6px gummed strip in #c9542f across the top, 3px corners, rotated -1.5°, "Pad on desk" shadow.
- **Content:** a "Score" heading and the Reset scores button on the first line; then Blue (X icon), Red (O icon) and Draws on one line each, in a three-part grid (6.25rem label column, flexible tally column, numeral).
- **Tallies:** drawn in ballpoint ink (stroke 2.25, round caps) as groups of four leaning uprights struck through by a fifth diagonal. Each stroke has a deterministic wobble so the marks look handwritten but never change between renders. Capped at 20 marks; the numeral keeps counting past that. Hidden below 640px.

### Status Line
The status line is the loudest thing on the page and states one fact. The display style in chalk, prefixed by the current or winning piece icon, with the hint underneath in chalk dim ("Pick a square on the board." while playing, "Press New Game for another round." after). A visually hidden `h1` names the game; a polite live region announces each move and result in words (for example "Blue X placed on row 2, column 2. Red O to play.").

### Board
The board itself is the main control.
- **3D board:** nine invisible hit planes over the tiles. Pointer over an empty square during play sets a pointer cursor and shows the ghost piece; clicking places the real one.
- **Keyboard layer:** nine real buttons hidden off-screen but focusable, labelled "Row r, column c, empty" or with the occupying piece. Arrow keys move between them without wrapping rows. Focus shows a chalk-white (#fffaf0, unlit) square outline drawn on the board around the cell, plus the ghost piece. When a round ends while a cell has focus, focus moves to New Game.
- **Ghost preview:** the next player's piece at 38% opacity, no shadow, no depth write, appearing at rest without a drop.
- **Flat fallback (no WebGL):** the same nine buttons shown as a beech grid with beech-deep cells and flat piece icons at 60% of the cell. No ghost preview, no motion.

### Navigation
The only navigation is the credit line required by PRODUCT.md: "Made by Raven Caduyac · GitHub · Portfolio", chalk dim, links underlined 4px below, chalk on hover. Bottom of the left column at 1024px and up, under the New Game block below that.

### Focus and Selection
The global keyboard focus outline is 3px solid canary, 3px offset; the beech block overrides it to chalk; the 3D board uses its own chalk square. Text selection is canary with groove text. Note: the canary outline also lands on Reset scores, which sits on canary paper, and on fallback cells over beech. This is an open gap in the build, not a pattern to copy.

### Motion
Motion grammar: a piece drops and settles, the winning three hop and spin, a stroke is painted through them. Nothing moves on its own.
- **Drop:** a new piece starts 2.4 units above the board with a 0.35 rad tilt and falls under gravity 22, bouncing with restitution 0.32 until its speed drops below 0.6; the tilt decays at a rate of 6 per second. The frame step is capped at 1/30s so a slow frame never tunnels a piece through the board.
- **Win hop and spin:** once settled, each winning piece rises in a 0.55-unit arc over 0.9s and finishes resting 0.12 above the board, spinning one full turn on an ease-out cubic, and takes on its emissive glow.
- **Win strike:** a 0.16-wide lacquered bar in the winner's colour grows from the first square to the third (0.35 longer than the line), starting about 0.19s after the win and finishing at 0.55s, ease-out cubic.
- **Camera lean:** with a pointer present the camera drifts toward it (up to 0.35 sideways, 0.2 in depth) with exponential smoothing at rate 2.5, like leaning over the table.
- **Reduced motion:** pieces appear at rest with no tilt; winning pieces lift straight to 0.12 with no arc or spin; the strike is drawn complete; the camera is fixed; the wood block has no transition.

## Do's and Don'ts

### Do:
- **Do** take every colour from the frontmatter; when a colour exists in both the scene and the DOM, use the same hex in both.
- **Do** keep cobalt for Blue X and vermilion for Red O and nothing else.
- **Do** make each raised element a desk object with its material: canary paper with rules (2.5rem) and a margin, beech blocks with the bevel shadow, carved wood.
- **Do** cast DOM shadows as warm, long, soft drops with negative spread (rgba of dark brown or near-black), as in the shadow vocabulary.
- **Do** set every text in Bricolage Grotesque; give counts tabular figures.
- **Do** tie every animation to a player action, simulate the drop rather than tweening it, and show the end state instantly under reduced motion.
- **Do** keep the board itself as the control, with real focusable buttons behind it and a spoken description of every move.

### Don't:
- **Don't** present the board as a flat 3x3 grid of buttons in a centred card; the flat grid is only the no-WebGL fallback.
- **Don't** use a player colour for controls, headings, borders or text.
- **Don't** add a second typeface.
- **Don't** use grey or cool shadows, or lift objects on hover.
- **Don't** add idle or ambient motion (floating pieces, looping glows, auto-rotating board).
