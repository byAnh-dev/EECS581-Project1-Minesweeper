
import {
  BOARD_SIZE, MIN_MINES, MAX_MINES,
  type AdjacentMines, type Board, type Cell, type Position, type RandomSource,
} from "./types.ts";

export function createBoard(): Board { //Initiate 100 cells with no mine and are covered
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

/** Create a covered board with distinct mines and counts for all eight neighbors. */
export function createBoardWithMines(
  mineCount: number,
  random: RandomSource = Math.random,
): Board {
  //1. Validate mine count
  if (!Number.isInteger(mineCount) || mineCount < MIN_MINES || mineCount > MAX_MINES) {
    throw new RangeError(`Mine count must be an integer from ${MIN_MINES} through ${MAX_MINES}.`);
  }
  //2. Choose position to put mines
  const available = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => index);
  const mines = new Set<number>();
  for (let placed = 0; placed < mineCount; placed++) { //Get random number from [0,1) and multiply with 100 (max cell range) to get a random cell
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new RangeError("The random source must return a number in [0, 1).");
    }
    const index = Math.floor(sample * available.length);
    const selected = available.splice(index, 1)[0]!;
    mines.add(selected);
  }
  //3. Initate the board
  const board = createBoard().map((row, rowIndex) =>
    row.map((cell, columnIndex) => ({
      ...cell,
      hasMine: mines.has(rowIndex * BOARD_SIZE + columnIndex), //compute the number of the cell and check if there is mine or not (mine.has() return True/False)
    })),
  );

  return board.map((row, rowIndex) =>
    row.map((cell, columnIndex) => ({
      ...cell,
      adjacentMines: getNeighbors({ row: rowIndex, column: columnIndex })
        .filter((position) => getCell(board, position).hasMine).length as AdjacentMines,
    })),
  );
}
