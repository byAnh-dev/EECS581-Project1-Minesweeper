import type { Board, GameState } from "./types.ts";

/**
 * Make the whole minefield visible.
 *
 * Every mine is revealed, including ones the player had correctly flagged: the point of
 * the game-over board is to show the player exactly where the mines were, and a flag is
 * only a guess. Counters (`mineCount`, `flagsPlaced`, `revealedSafeCount`) are left
 * alone on purpose — `flagsPlaced` is the tally of flags the player placed during the
 * game, not a live count of flag markers, so it stays meaningful history.
 */
export function exposeAllMines(board: Board): Board {
  return board.map((row) =>
    row.map((cell) =>
      cell.hasMine && cell.visibility !== "revealed"
        ? { ...cell, visibility: "revealed" as const }
        : cell,
    ),
  );
}

/**
 * End-of-game transition for a loss: the run is over and the board is handed over as a
 * full picture of where the mines were.
 *
 * This is the deliberate opposite of the win transition, which changes only `status` and
 * reveals nothing extra: a win already shows every safe cell, so the mines are the only
 * thing left to show on a loss.
 */
export function loseGame(state: GameState): GameState {
  return {
    ...state,
    board: exposeAllMines(state.board),
    status: "lost",
  };
}
