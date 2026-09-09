import type { TileState } from '../types';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

interface Props {
  letterStates: Record<string, TileState>;
  onKey: (key: string) => void;
}

function keyClass(state: TileState | undefined): string {
  switch (state) {
    case 'correct': return 'key key--correct';
    case 'present': return 'key key--present';
    case 'absent':  return 'key key--absent';
    default:        return 'key';
  }
}

export default function Keyboard({ letterStates, onKey }: Props) {
  return (
    <div className="keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              className={`${keyClass(letterStates[key])}${key === 'ENTER' || key === '⌫' ? ' key--wide' : ''}`}
              onClick={() => onKey(key)}
              aria-label={key === '⌫' ? 'Backspace' : key}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
