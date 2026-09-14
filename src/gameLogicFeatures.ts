import {
  BOARD_SIZE,
  type AdjacentMines,
  type Board,
  type GameState,
  type Position,
  type RandomSource,
  type ActionResult,
} from "./types.ts";

import {
  createBoardWithMines,
  getCell,
  getNeighbors,
  isValidPosition,
} from "./boardManager.ts";

export function calculateAdjacentMines(board: Board): Board {
  return board.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      const position = { row: rowIndex, column: columnIndex };

      const adjacentMines = getNeighbors(position)
        .filter((neighbor) => getCell(board, neighbor).hasMine)
        .length as AdjacentMines;

      return {
        ...cell,
        adjacentMines,
      };
    }),
  );
}

/**
 * Guarantee that the cell the player opens first is not a mine.
 *
 * If the cursor sits on a mine, the mine is moved to another covered, mine-free cell so
 * the mine count never changes. The destination is drawn from the injected random source
 * instead of the first free cell in scan order: a fixed destination would make the
 * opening move predictable to an observant player, and injecting the source keeps the
 * choice reproducible for tests.
 */
export function makeFirstCellSafe(
  board: Board,
  position: Position,
  random: RandomSource = Math.random,
): Board {
  const firstCell = getCell(board, position);

  if (!firstCell.hasMine) {
    return board;
  }

  const candidates: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let column = 0; column < BOARD_SIZE; column++) {
      const candidate = getCell(board, { row, column });

      if (
        !candidate.hasMine &&
        candidate.visibility === "covered" &&
        (row !== position.row || column !== position.column)
      ) {
        candidates.push({ row, column });
      }
    }
  }

  // A board with nowhere to move the mine is left untouched rather than corrupted.
  if (candidates.length === 0) {
    return board;
  }

  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
    throw new RangeError("The random source must return a number in [0, 1).");
  }

  const newMinePosition = candidates[Math.floor(sample * candidates.length)]!;

  const updatedBoard = board.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      if (
        rowIndex === position.row &&
        columnIndex === position.column
      ) {
        return {
          ...cell,
          hasMine: false,
        };
      }

      if (
        rowIndex === newMinePosition!.row &&
        columnIndex === newMinePosition!.column
      ) {
        return {
          ...cell,
          hasMine: true,
        };
      }

      return cell;
    }),
  );

  return calculateAdjacentMines(updatedBoard);
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

export function createFeatureBoard(
  mineCount: number,
  random: RandomSource = Math.random,
): Board {
  return calculateAdjacentMines(
    createBoardWithMines(mineCount, random),
  );
}