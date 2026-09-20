/**
 * Module: types: shared game constants and read-only data contracts
 * Inputs: None
 * Outputs: Board limits, Cell/Board/GameState/Position/ActionResult/RandomSource types
 * Author: Anh Hoang
 * Created: 2026-09-10 
 */
export const BOARD_SIZE = 10;
export const MIN_MINES = 10;
export const MAX_MINES = 20;

export type AdjacentMines = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Visibility = "covered" | "flagged" | "revealed";
export type GameStatus = "playing" | "won" | "lost";

export interface Position {
  readonly row: number;
  readonly column: number;
}

export interface Cell {
  readonly hasMine: boolean;
  readonly adjacentMines: AdjacentMines;
  readonly visibility: Visibility;
}

export type Board = ReadonlyArray<ReadonlyArray<Cell>>;

export interface GameState {
  readonly board: Board;
  readonly mineCount: number;
  readonly flagsPlaced: number;
  readonly revealedSafeCount: number;
  readonly firstRevealDone: boolean;
  readonly status: GameStatus;
}

/** Returns a number in [0, 1); injectable for reproducible board tests. */
export type RandomSource = () => number;

export type ActionResult =
  | { readonly ok: true; readonly state: GameState; readonly changed: boolean }
  | {
      readonly ok: false;
      readonly code: "INVALID_MINE_COUNT" | "INVALID_POSITION";
      readonly message: string;
    };
