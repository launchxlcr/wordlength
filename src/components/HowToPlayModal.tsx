interface Props {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2>How To Play</h2>
        <p>Guess the secret word in <strong>6 tries</strong>. The word can be between 4 and 10 letters!</p>

        <h3>Tile colors</h3>
        <div className="how-row">
          <span className="demo-tile correct">B</span>
          <span className="how-text">Letter is in the correct spot.</span>
        </div>
        <div className="how-row">
          <span className="demo-tile present">R</span>
          <span className="how-text">Letter is in the word but wrong position.</span>
        </div>
        <div className="how-row">
          <span className="demo-tile absent">S</span>
          <span className="how-text">Letter is not in the word.</span>
        </div>

        <hr />

        <h3>Length hints</h3>
        <p>After each guess, a symbol appears to the right:</p>
        <div className="how-row">
          <span className="length-hint length-hint--longer">+</span>
          <span className="how-text"><strong style={{color:'#fc8181'}}>Red +</strong> — the answer is <strong>longer</strong> than your guess.</span>
        </div>
        <div className="how-row">
          <span className="length-hint length-hint--equal">=</span>
          <span className="how-text"><strong style={{color:'#b794f4'}}>Purple =</strong> — the answer is the <strong>same length</strong> as your guess.</span>
        </div>
        <div className="how-row">
          <span className="length-hint length-hint--shorter">−</span>
          <span className="how-text"><strong style={{color:'#63b3ed'}}>Blue −</strong> — the answer is <strong>shorter</strong> than your guess.</span>
        </div>

        <hr />

        <h3>Length rules after the first guess</h3>
        <p>
          Each subsequent guess must respect all length hints so far. For example:
          if your first guess gets a <span className="length-hint length-hint--longer" style={{fontSize:13,padding:'1px 5px'}}>+</span>,
          your next guess <em>must be longer</em> than the first.
        </p>

        <hr />

        <h3>Letters beyond the shared length</h3>
        <p>
          When lengths differ, letters outside the shared range still count toward yellow
          if they appear in the answer:
        </p>
        <ul>
          <li>Guess <strong>CORN</strong> vs answer <strong>POPCORN</strong> — the letters C, R, N are yellow; O is green.</li>
          <li>Guess <strong>BUILDERS</strong> vs answer <strong>DERBY</strong> — B, D, E, R are all yellow.</li>
        </ul>

        <button className="btn-primary" onClick={onClose}>Got it!</button>
      </div>
    </div>
  );
}
