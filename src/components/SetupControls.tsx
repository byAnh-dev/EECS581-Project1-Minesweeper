
import { useId, useState } from "react";
import type { SubmitEvent } from "react";
import { MIN_MINES, MAX_MINES } from "../types";

type SetupControlsProps = {
  onStart: (rawInput: string) => void;
  disabled?: boolean;
};

export default function SetupControls({
  onStart,
  disabled = false,
}: SetupControlsProps) {
  const [mineCount, setMineCount] = useState("");
  const inputId = useId();
  const helpId = useId();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // Send the text to the parent, which calls the input handler.
    if (!disabled) {
      onStart(mineCount);
    }
  }

  return (
    <form className="setup-controls" onSubmit={handleSubmit}>
      <div className="setup-controls__field">
        <label htmlFor={inputId}>MINE COUNT</label>

        <input
          id={inputId}
          type="number"
          min={MIN_MINES}
          max={MAX_MINES}
          step={1}
          required
          placeholder="10–20"
          aria-describedby={helpId}
          value={mineCount}
          onChange={(event) => setMineCount(event.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="setup-controls__description">
        <h2>Dial in the difficulty</h2>

        <p id={helpId}>
          Board stays 10×10. Only the mine count changes between games.
        </p>
      </div>

      <button type="submit" disabled={disabled}>
        Start round
      </button>
    </form>
  );
}