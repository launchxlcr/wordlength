import type { Stats } from '../types';

interface Props {
  stats: Stats;
  lastScore: number | null;
  won: boolean;
  onClose: () => void;
  onShare: () => void;
}

const MAX_GUESSES = 6;

export default function StatsModal({ stats, lastScore, won, onClose, onShare }: Props) {
  const winPct = stats.gamesPlayed === 0
    ? 0
    : Math.round((stats.gamesWon / stats.gamesPlayed) * 100);

  const maxDist = Math.max(1, ...Object.values(stats.guessDistribution));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2>Statistics</h2>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-num">{stats.gamesPlayed}</span>
            <span className="stat-label">Played</span>
          </div>
          <div className="stat">
            <span className="stat-num">{winPct}</span>
            <span className="stat-label">Win %</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.currentStreak}</span>
            <span className="stat-label">Current Streak</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.maxStreak}</span>
            <span className="stat-label">Max Streak</span>
          </div>
        </div>

        <h3>Guess Distribution</h3>
        <div className="distribution">
          {Array.from({ length: MAX_GUESSES }, (_, i) => i + 1).map(n => {
            const count = stats.guessDistribution[n] ?? 0;
            const pct = Math.max(7, Math.round((count / maxDist) * 100));
            const highlight = won && lastScore === n;
            return (
              <div key={n} className="dist-row">
                <span className="dist-label">{n}</span>
                <div
                  className={`dist-bar${highlight ? ' dist-bar--highlight' : ''}`}
                  style={{ width: `${pct}%` }}
                >
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn-primary btn-share" onClick={onShare}>
          Share
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,marginLeft:6}}>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
