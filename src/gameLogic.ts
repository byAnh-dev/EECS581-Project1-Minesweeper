import type { ActionResult, GameState, Position, RandomSource } from "./types";

/** Game Logic contract only; gameplay functions are not implemented yet. */
export interface GameLogic {
  startGame(mineCount: number, random: RandomSource): ActionResult;
  uncover(state: GameState, position: Position, random: RandomSource): ActionResult;
  toggleFlag(state: GameState, position: Position): ActionResult;
}
