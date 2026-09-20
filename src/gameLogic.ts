import { createBoardWithMines, getCell, isValidPosition, makeFirstCellSafe } from "./boardManager.ts";
import { loseGame } from "./mineExposure.ts";
import { revealSafeArea } from "./safeAreaReveal.ts";
import { withWinStatus } from "./winDetection.ts";
import {
  MIN_MINES, MAX_MINES,
  type ActionResult, type Board, type GameState, type Position, type RandomSource,
} from "./types.ts";

/** Public player commands, shared by the input handler and other callers. */
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

/** Rejection payload shared by every command that receives out-of-board coordinates. */
function invalidPosition(): ActionResult {
  return {
    ok: false,
    code: "INVALID_POSITION",
    message: "Cell coordinates must be integers from 0 through 9.",
  };
}

/**State return for a safe action like click on a revealed cell */
function unchanged(state: GameState): ActionResult {
  return { ok: true, changed: false, state };
}

/**
 * Player command: open a cell, and whatever it cascades into.
 *
 * Order of the guards matters. We reject bad coordinates first (cheap, unambiguous),
 * then refuse to touch a finished game, then honour the player's own flags. Only after
 * all three do we spend randomness on first-click safety.
 *
 * The amount of board that opens is not decided here: once the click is proven legal and
 * mine-free, `rtevealSafeArea` takes over so that opening an empty cell cascades and
 * opening a numbered cell opens only itself. A legal click then has exactly three
 * possible outcomes: `loseGame` (the cell was a mine), `withWinSatus` (it was the last
 * safe cell), or an ordinary reveal that leaves the game running.
 */
export function uncover(
  state: GameState,
  position: Position,
  random: RandomSource = Math.random,
): ActionResult {
  //1.1 Check if action is valid
  if (!isValidPosition(position)) return invalidPosition();

  //1.2 Check if game state is changable
  if (state.status !== "playing") return unchanged(state);
  const cell = getCell(state.board, position);
  if (cell.visibility !== "covered") return unchanged(state);

  // 2. Protect first click
  const board = state.firstRevealDone
    ? state.board
    : makeFirstCellSafe(state.board, position, random);

  // 3. If not first click, check if the click pass through or not
  if (getCell(board, position).hasMine) { //If user click on a mine
    return {
      ok: true,
      changed: true,
      state: loseGame({ ...state, board, firstRevealDone: true }),
    };
  }
  //If click on safe cell
  const { board: revealedBoard, revealedCount } = revealSafeArea(board, position);

  // Win detection runs last
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

export function toggleFlag(
  state: GameState,
  position: Position,
): ActionResult {
  if (!isValidPosition(position)) {
    return {
      ok: false,
      code: "INVALID_POSITION",
      message: "Cell coordinates must be integers from 0 through 9.",
    };
  }

  if (state.status !== "playing") {
    return {
      ok: true,
      changed: false,
      state,
    };
  }

  const cell = getCell(state.board, position);

  if (cell.visibility === "revealed") {
    return {
      ok: true,
      changed: false,
      state,
    };
  }

  if (cell.visibility === "flagged") {
    const board: Board = state.board.map((row, rowIndex) =>
      row.map((existingCell, columnIndex) =>
        rowIndex === position.row && columnIndex === position.column
          ? { ...existingCell, visibility: "covered" as const }
          : existingCell,
      ),
    );

    return {
      ok: true,
      changed: true,
      state: {
        ...state,
        board,
        flagsPlaced: state.flagsPlaced - 1,
      },
    };
  }

  if (state.flagsPlaced >= state.mineCount) {
    return {
      ok: true,
      changed: false,
      state,
    };
  }

  const board: Board = state.board.map((row, rowIndex) =>
    row.map((existingCell, columnIndex) =>
      rowIndex === position.row && columnIndex === position.column
        ? { ...existingCell, visibility: "flagged" as const }
        : existingCell,
    ),
  );

  return {
    ok: true,
    changed: true,
    state: {
      ...state,
      board,
      flagsPlaced: state.flagsPlaced + 1,
    },
  };
}
