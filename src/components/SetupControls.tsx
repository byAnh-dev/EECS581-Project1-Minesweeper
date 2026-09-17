/**
 * Module: SetupControls
 * Description: Lets the player choose a mine count and request game start.
 * Inputs: onStart callback and optional disabled flag.
 * Outputs: Setup form; passes the selected count to onStart.
 */

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { MIN_MINES, MAX_MINES } from "../types";

type SetupControlsProps = {
  onStart: (mineCount: number) => void;
  disabled?: boolean;
};

export default function SetupControls({
  onStart,
  disabled = false,
}: SetupControlsProps) {
  const [mineCount, setMineCount] = useState(MIN_MINES);
  const selectId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the browser from refreshing when the form is submitted.
    event.preventDefault();

    if (!disabled) {
      onStart(mineCount);
    }
  }

  return (
    <form className="setup-controls" onSubmit={handleSubmit}>
      <h2>Set up your game</h2>
      <p>Choose 10–20 mines for your 10 × 10 board.</p>

      <label htmlFor={selectId}>Number of mines</label>

      <select
        id={selectId}
        value={mineCount}
        onChange={(event) => setMineCount(Number(event.target.value))}
        disabled={disabled}
      >
        {Array.from(
          { length: MAX_MINES - MIN_MINES + 1 },
          (_, index) => MIN_MINES + index,
        ).map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </select>

      <button type="submit" disabled={disabled}>
        Start Game
      </button>
    </form>
  );
}