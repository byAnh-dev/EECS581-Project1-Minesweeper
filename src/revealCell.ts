import { getCell, isValidPosition } from "./boardManager.ts";
import { makeFirstCellSafe } from "./gameLogicFeatures.ts";
import { loseGame } from "./mineExposure.ts";
import { revealSafeArea } from "./safeAreaReveal.ts";
import { withWinStatus } from "./winDetection.ts";
import {
  type ActionResult,
  type GameState,
  type Position,
  type RandomSource,
} from "./types.ts";

/** Rejection payload shared by every command that receives out-of-board coordinates. */
function invalidPosition(): ActionResult {
  return {
    ok: false,
    code: "INVALID_POSITION",
    message: "Cell coordinates must be integers from 0 through 9.",
  };
}

/**
 * "Nothing happened, and that is fine."
 *
 * Distinct from an error: clicking a flag or an open cell is legal player input, it
 * simply has no effect. The caller can use `changed` to decide whether to re-render.
 */
function unchanged(state: GameState): ActionResult {
  return { ok: true, changed: false, state };
}

/**
 * Player command: open exactly one cell.
 *
 * Order of the guards matters. We reject bad coordinates first (cheap, unambiguous),
 * then refuse to touch a finished game, then honour the player's own flags. Only after
 * all three do we spend randomness on first-click safety.
 *
 * The amount of board that opens is not decided here: once the click is proven legal and
 * mine-free, `revealSafeArea` takes over so that opening an empty cell cascades and
 * opening a numbered cell opens only itself. A legal click then has exactly three
 * possible outcomes: `loseGame` (the cell was a mine), `withWinStatus` (it was the last
 * safe cell), or an ordinary reveal that leaves the game running.
 */
export function uncoverSingleCell(
  state: GameState,
  position: Position,
  random: RandomSource = Math.random,
): ActionResult {
  if (!isValidPosition(position)) return invalidPosition();

  // A won or lost board is frozen: opening or re-opening cells cannot alter it.
  if (state.status !== "playing") return unchanged(state);

  const cell = getCell(state.board, position);

  // A flag is the player protecting a cell from an accidental click, and an open cell
  // has nothing left to reveal. Both are legitimate clicks with no effect.
  if (cell.visibility !== "covered") return unchanged(state);

  // First click of a game must be survivable. `makeFirstCellSafe` only consumes the
  // random source when the cursor actually sits on a mine, so later reveals stay
  // deterministic for the same board and injected source.
  const board = state.firstRevealDone
    ? state.board
    : makeFirstCellSafe(state.board, position, random);

  if (getCell(board, position).hasMine) {
    // Loss: the run is over and the minefield is exposed so the player can see what
    // ended it. `loseGame` runs on the freshest board, which differs from `state.board`
    // only when the first-click safety move relocated a mine.
    return {
      ok: true,
      changed: true,
      state: loseGame({ ...state, board, firstRevealDone: true }),
    };
  }

  // Hand the safe cell to the cascade: it decides whether this click opens one cell or a
  // whole region, and reports how many cells were genuinely newly opened.
  const { board: revealedBoard, revealedCount } = revealSafeArea(board, position);

  // Win detection runs last. Because the mine branch above already returned, a reveal
  // that opens a mine can never be upgraded into a win here.
  return {
    ok: true,
    changed: true,
    state: withWinStatus({
      ...state,
      board: revealedBoard,
      revealedSafeCount: state.revealedSafeCount + revealedCount,
      firstRevealDone: true,
    }),
  };
}
