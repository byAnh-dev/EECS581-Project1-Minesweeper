
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
