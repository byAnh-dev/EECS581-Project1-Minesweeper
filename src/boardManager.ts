
import { BOARD_SIZE, type Board, type Cell } from "./types.ts";

/** Creates a fresh covered board before mines are placed and counts calculated. */
export function createBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, (): Cell => ({
      hasMine: false,
      visibility: "covered",
      adjacentMines: 0,
    })),
  );
}

export function isValidPosition({ row, column }: Position): boolean { //Helper to validate input position
  return Number.isInteger(row) && Number.isInteger(column)
    && row >= 0 && row < BOARD_SIZE
    && column >= 0 && column < BOARD_SIZE;
}

export function getCell(board: Board, position: Position): Cell { //helper to choose a cell
  if (!isValidPosition(position)) {
    throw new RangeError("Cell coordinates must be integers from 0 through 9.");
  }
  const cell = board[position.row]?.[position.column];
  if (cell === undefined) {
    throw new RangeError("The board has no cell at the requested position.");
  }
  return cell;
}

export function updateCell(board: Board, position: Position, changes: Partial<Cell>): Board { //Function to update the cell
  const cell = getCell(board, position);
  return board.map((row, rowIndex) =>
    rowIndex === position.row
      ? row.map((existingCell, columnIndex) =>
          columnIndex === position.column ? { ...cell, ...changes } : existingCell,
        )
      : row,
  );
}

export function getNeighbors(position: Position): Position[] {//Function to get access to all the neighbors
  if (!isValidPosition(position)) {
    throw new RangeError("Cell coordinates must be integers from 0 through 9.");
  }
  const neighbors: Position[] = [];
  for (let row = position.row - 1; row <= position.row + 1; row++) {
    for (let column = position.column - 1; column <= position.column + 1; column++) {
      if (row === position.row && column === position.column) continue;
      const neighbor = { row, column };
      if (isValidPosition(neighbor)) neighbors.push(neighbor);
    }
  }
  return neighbors;
}

