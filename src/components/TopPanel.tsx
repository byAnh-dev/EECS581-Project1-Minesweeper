export default function TopPanel() {
  return (
    <div className="top-panel">
      <p className="top-panel__level">LEVEL · EECS 581</p>

      {/* Decorative hearts; these do not represent gameplay lives. */}
      <div className="top-panel__hearts" aria-hidden="true">
        {[0, 1, 2].map((heart) => (
          <svg
            key={heart}
            width="16"
            height="14"
            viewBox="0 0 16 14"
            focusable="false"
          >
            <path
              d="M2 0H6V2H10V0H14V2H16V6H14V8H12V10H10V12H8V14H6V12H4V10H2V8H0V2H2Z"
              fill="currentColor"
            />
          </svg>
        ))}
      </div>

      {/* Static Figma artwork, not actual loading progress. */}
      <div className="top-panel__loading" aria-hidden="true">
        <div className="top-panel__track">
          <div className="top-panel__fill" />
        </div>

        <p className="top-panel__loading-text">LOADING...</p>
      </div>
    </div>
  );
}
