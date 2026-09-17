import { createBoardWithMines } from "./boardManager.ts";
import { uncoverSingleCell } from "./revealCell.ts";
import {
  MIN_MINES, MAX_MINES,
  type ActionResult, type GameState, type Position, type RandomSource,
} from "./types.ts";

/** Game Logic contract; `uncover` is implemented, `toggleFlag` remains to be wired. */
export interface GameLogic {
  startGame(mineCount: number, random?: RandomSource): ActionResult;
  uncover(state: GameState, position: Position, random: RandomSource): ActionResult;
  toggleFlag(state: GameState, position: Position): ActionResult;
}

/** Validate configuration before creating a new game; errors leave the caller's state intact. */
export function startGame(
  mineCount: number,
  random: RandomSource = Math.random,
): ActionResult {
  if (!Number.isInteger(mineCount) || mineCount < MIN_MINES || mineCount > MAX_MINES) {
    return {
      ok: false,
      code: "INVALID_MINE_COUNT",
      message: `Enter an integer mine count from ${MIN_MINES} through ${MAX_MINES}.`,
    };
  }

  return {
    ok: true,
    changed: true,
    state: {
      board: createBoardWithMines(mineCount, random),
      mineCount,
      flagsPlaced: 0,
      revealedSafeCount: 0,
      firstRevealDone: false,
      status: "playing",
    },
  };
}

/**
 * Player command: open one cell.
 *
 * Thin delegator so `gameLogic.ts` stays the single import surface the UI and the input
 * handler talk to, while the reveal rules live in their own module.
 */
export function uncover(
  state: GameState,
  position: Position,
  random: RandomSource = Math.random,
): ActionResult {
  return uncoverSingleCell(state, position, random);
}
