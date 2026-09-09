interface Props {
  puzzleNumber: number;
  onHelp: () => void;
  onStats: () => void;
}

export default function Header({ puzzleNumber, onHelp, onStats }: Props) {
  return (
    <header className="header">
      <button className="icon-btn" onClick={onHelp} aria-label="How to play">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
        </svg>
      </button>
      <div className="header-center">
        <h1 className="title">WordLength</h1>
        <span className="puzzle-num">#{puzzleNumber}</span>
      </div>
      <button className="icon-btn" onClick={onStats} aria-label="Statistics">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6"  y1="20" x2="6"  y2="14" />
        </svg>
      </button>
    </header>
  );
}
