/**
 * File: inputHandler.ts
 * Description: Validates setup and cell inputs before sending them to game logic.
 * Inputs: Mine-count text, cell selections, game state, and optional random source.
 * Outputs: ActionResult containing an updated state or an error.
 * Author: Shayaan Mohammed
 * Creation Date: September 16, 2026
 * External Source: OpenAI ChatGPT assisted with code review and comments.
 */

import { startGame, uncover } from "./gameLogic.ts";
import { toggleFlag } from "./gameLogicFeatures.ts";
import { isValidPosition } from "./boardManager.ts";

import {
  MIN_MINES,
  MAX_MINES,
  type ActionResult,
  type GameState,
  type Position,
  type RandomSource,
} from "./types.ts";

/**
 * Converts mine-count text to a whole number.
 * Returns null if the format is invalid.
 */
export function parseMineCount(rawInput: string): number | null {
  const trimmed = rawInput.trim();

  // Accept digits only.
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  return Number.parseInt(trimmed, 10);
}

/**
 * Validates the mine count and starts a new game.
 */
export function processSetupInput(
  rawInput: string,
  random: RandomSource = Math.random,
): ActionResult {
  const mineCount = parseMineCount(rawInput);

  if (mineCount === null) {
    return {
      ok: false,
      code: "INVALID_MINE_COUNT",
      message: `Enter a whole number from ${MIN_MINES} through ${MAX_MINES}.`,
    };
  }

  return startGame(mineCount, random);
}

/**
 * Supported methods for selecting a cell.
 */
export type CellInputEvent =
  | { readonly kind: "click"; readonly position: Position }
  | { readonly kind: "keypress"; readonly position: Position }
  | { readonly kind: "text"; readonly reference: string };

/**
 * Matches coordinates from A1 through J10.
 */
const CELL_REFERENCE_PATTERN = /^([A-J])\s*(10|[1-9])$/i;

/**
 * Converts a cell reference such as "B5" into a Position.
 */
export function parseCellReference(reference: string): Position | null {
  const match = CELL_REFERENCE_PATTERN.exec(reference.trim());

  if (!match) {
    return null;
  }

  // Convert the column letter to a 0–9 index.
  const column =
    match[1]!.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);

  // Convert the row number to a 0–9 index.
  const row = Number.parseInt(match[2]!, 10) - 1;

  const position: Position = { row, column };

  return isValidPosition(position) ? position : null;
}

/**
 * Returns a valid position for any supported input type.
 */
function resolvePosition(event: CellInputEvent): Position | null {
  if (event.kind === "text") {
    return parseCellReference(event.reference);
  }

  return isValidPosition(event.position) ? event.position : null;
}

/**
 * Returns an error for an invalid cell selection.
 */
function malformedCellInput(): ActionResult {
  return {
    ok: false,
    code: "INVALID_POSITION",
    message: "Point at a cell on the board, or type a reference like B5.",
  };
}
