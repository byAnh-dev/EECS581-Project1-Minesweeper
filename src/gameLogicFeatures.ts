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

export function makeFirstCellSafe(
  board: Board,
  position: Position,
): Board {
  const firstCell = getCell(board, position);

  if (!firstCell.hasMine) {
    return board;
  }

  let newMinePosition: Position | undefined;

  for (let row = 0; row < BOARD_SIZE && newMinePosition === undefined; row++) {
    for (let column = 0; column < BOARD_SIZE; column++) {
      const candidate = getCell(board, { row, column });

      if (
        !candidate.hasMine &&
        candidate.visibility === "covered" &&
        (row !== position.row || column !== position.column)
      ) {
        newMinePosition = { row, column };
        break;
      }
    }
  }

  if (newMinePosition === undefined) {
    return board;
  }

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