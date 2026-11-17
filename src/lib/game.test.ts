import { describe, expect, it } from "vitest";
import { addResult, emptyBoard, emptyScore, getOutcome, play, parseScore, type Board } from "./game";

const playAll = (moves: number[]): Board => moves.reduce<Board>((b, m) => play(b, m), emptyBoard());

describe("turns", () => {
  it("X opens and players alternate", () => {
    let b: Board = emptyBoard();
    expect(getOutcome(b)).toEqual({ kind: "playing", next: "X" });
    b = play(b, 4);
    expect(b[4]).toBe("X");
    expect(getOutcome(b)).toEqual({ kind: "playing", next: "O" });
    b = play(b, 0);
    expect(b[0]).toBe("O");
  });

  it("ignores moves on taken squares and out-of-range indexes", () => {
    const b = play(emptyBoard(), 4);
    expect(play(b, 4)).toBe(b);
    expect(play(b, -1)).toBe(b);
    expect(play(b, 9)).toBe(b);
  });
});

describe("outcomes", () => {
  it("detects a row win for X with its line", () => {
    const b = playAll([0, 3, 1, 4, 2]);
    expect(getOutcome(b)).toEqual({ kind: "win", winner: "X", line: [0, 1, 2] });
  });

  it("detects a diagonal win for O", () => {
    const b = playAll([0, 2, 1, 4, 8, 6]);
    expect(getOutcome(b)).toMatchObject({ kind: "win", winner: "O", line: [2, 4, 6] });
  });

  it("detects a draw on a full board with no line", () => {
    // X O X / X O O / O X X
    const b = playAll([0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(getOutcome(b)).toEqual({ kind: "draw" });
  });

  it("prefers a win over a draw when the last move completes a line", () => {
    // X fills the board and wins on the final square
    const b = playAll([0, 1, 2, 4, 3, 5, 7, 8, 6]);
    expect(getOutcome(b)).toMatchObject({ kind: "win", winner: "X" });
  });

  it("blocks further moves once the game is won", () => {
    const won = playAll([0, 3, 1, 4, 2]);
    expect(play(won, 8)).toBe(won);
  });
});

describe("score", () => {
  it("adds wins and draws", () => {
    let s = emptyScore();
    s = addResult(s, { kind: "win", winner: "O", line: [0, 1, 2] });
    s = addResult(s, { kind: "draw" });
    s = addResult(s, { kind: "playing", next: "X" });
    expect(s).toEqual({ X: 0, O: 1, draws: 1 });
  });

  it("parses stored scores defensively", () => {
    expect(parseScore(null)).toEqual(emptyScore());
    expect(parseScore("not json")).toEqual(emptyScore());
    expect(parseScore('{"X":2,"O":-1,"draws":1.5}')).toEqual({ X: 2, O: 0, draws: 0 });
  });
});
