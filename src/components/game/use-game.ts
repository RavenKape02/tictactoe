"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  addResult,
  emptyBoard,
  emptyScore,
  getOutcome,
  parseScore,
  play,
  type Board,
  type Score,
} from "@/lib/game";

const STORAGE_KEY = "tictactoe:score:v1";

type State = { board: Board; score: Score; round: number; lastMove: number | null };

type Action =
  | { type: "play"; index: number }
  | { type: "newGame" }
  | { type: "resetScores" }
  | { type: "loadScore"; score: Score };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "play": {
      const board = play(state.board, action.index);
      if (board === state.board) return state;
      return { ...state, board, lastMove: action.index, score: addResult(state.score, getOutcome(board)) };
    }
    case "newGame":
      return { ...state, board: emptyBoard(), round: state.round + 1, lastMove: null };
    case "resetScores":
      return { ...state, score: emptyScore() };
    case "loadScore":
      return { ...state, score: action.score };
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    board: emptyBoard(),
    score: emptyScore(),
    round: 0,
    lastMove: null,
  }));
  const loaded = useRef(false);

  // Scores live in localStorage; read after mount so server and client render the same markup.
  // Declared before the loader on purpose: effects run in order, so on mount this sees
  // loaded=false and skips, instead of overwriting the stored score with the empty default.
  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.score));
    } catch {
      /* storage blocked or full: the score still works for this tab */
    }
  }, [state.score]);

  useEffect(() => {
    try {
      dispatch({ type: "loadScore", score: parseScore(window.localStorage.getItem(STORAGE_KEY)) });
    } catch {
      /* storage blocked: keep an in-memory score */
    }
    loaded.current = true;
  }, []);

  const outcome = useMemo(() => getOutcome(state.board), [state.board]);

  return {
    ...state,
    outcome,
    playAt: useCallback((index: number) => dispatch({ type: "play", index }), []),
    newGame: useCallback(() => dispatch({ type: "newGame" }), []),
    resetScores: useCallback(() => dispatch({ type: "resetScores" }), []),
  };
}
