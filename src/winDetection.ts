import type { Board, GameState } from "./types.ts";

/**
 * How many cells the player has to uncover to win: the whole board minus the mines.
 *
 * The board's own dimensions are used instead of `BOARD_SIZE` so a resize of the board
 * cannot silently desynchronise the win condition from the grid the player sees.
 */
export function countSafeCells(board: Board, mineCount: number): number {
  const cellCount = board.reduce((total, row) => total + row.length, 0);
  return cellCount - mineCount;
}

/**
 * True once every safe cell is uncovered.
 *
 * Flags deliberately play no part: a player who has opened every safe cell has won even
 * if they never placed a single flag, and a player who flags every mine but leaves safe
 * cells covered has not.
 *
 * Gated on `status === "playing"` so a finished game is never re-evaluated, and so the
 * loss branch of the reveal path (which sets `"lost"` before this is consulted) always
 * wins the tie.
 */
export function hasWon(state: GameState): boolean {
  return (
    state.status === "playing" &&
    state.revealedSafeCount >= countSafeCells(state.board, state.mineCount)
  );
}

/** Applies the win transition, returning the very same state object when not yet won. */
export function withWinStatus(state: GameState): GameState {
  return hasWon(state) ? { ...state, status: "won" } : state;
}
