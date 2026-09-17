import {
  getCell,
  getNeighbors,
  isValidPosition,
  updateCell,
} from "./boardManager.ts";
import type { Board, Position } from "./types.ts";

/** Outcome of a cascade: the updated board plus how many cells were newly opened. */
export interface SafeAreaReveal {
  readonly board: Board;
  readonly revealedCount: number;
}

/**
 * Open the whole safe region that the player's click belongs to.
 *
 * The cascade is a breadth-first walk from the origin. An empty cell (`adjacentMines: 0`)
 * has no information of its own, so it keeps the walk alive by pushing its neighbours;
 * a numbered cell is the boundary of the region, so it is opened but never expands
 * further. That single rule is what gives Minesweeper its "click one cell, half the
 * board opens" feel.
 *
 * `revealedCount` is returned instead of being recomputed by the caller because only the
 * walk knows which cells were genuinely covered beforehand.
 */
export function revealSafeArea(board: Board, origin: Position): SafeAreaReveal {
  if (!isValidPosition(origin)) {
    throw new RangeError("Cell coordinates must be integers from 0 through 9.");
  }

  const frontier: Position[] = [origin];
  // Cells are deduplicated on visit rather than on enqueue: a cell can be pushed by
  // several empty neighbours, and only the first arrival may open it.
  const visited = new Set<string>();
  let nextBoard = board;
  let revealedCount = 0;

  while (frontier.length > 0) {
    const current = frontier.shift()!;
    const key = `${current.row}:${current.column}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = getCell(nextBoard, current);

    // A flag is the player's own promise about that cell. We never open it, and we do
    // not cascade through it either, so a mistaken flag stays visible instead of being
    // silently corrected by the expansion.
    if (cell.visibility !== "covered") continue;

    nextBoard = updateCell(nextBoard, current, { visibility: "revealed" });
    revealedCount++;

    if (cell.adjacentMines === 0) {
      frontier.push(...getNeighbors(current));
    }
  }

  return { board: nextBoard, revealedCount };
}
