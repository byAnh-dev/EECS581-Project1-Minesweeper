import { useState } from "react";
import SetupControls from "./components/SetupControls";
import { processSetupInput } from "./inputHandler";
import type { GameState } from "./types";
import TopPanel from "./components/TopPanel";


export default function UserInterface() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState("");

  function handleStart(rawInput: string) {
    // Ask the existing game logic to validate and initialize the game.
    const result = processSetupInput(rawInput);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    // Store the returned state so React updates the interface.
    setGameState(result.state);
    setError("");
  }

  return (
    <main>
      <TopPanel />
      
      <h1>Minesweeper</h1>
      <p>Uncover safe cells and flag suspected mines on a 10 × 10 board.</p>

      <div className="setup-panel">
      <SetupControls
        onStart={handleStart}
        disabled={gameState !== null}
      />
      </div>

      {error && <p role="alert">{error}</p>}

      <p className="status" role="status">
        {gameState === null
          ? "Choose your mine count, then click Start Game."
          : `Game initialized with ${gameState.mineCount} mines. The board display is not available yet.`}
      </p>
    </main>
  );
}