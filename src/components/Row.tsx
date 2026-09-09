import { useEffect, useRef, useState } from 'react';
import type { TileState, LengthHint } from '../types';

interface Props {
  word: string;
  tileStates: TileState[];
  lengthHint?: LengthHint;
  isCurrent?: boolean;
  minPlaceholder?: number;
  isRevealing?: boolean;
  revealDelay?: number;
}

function tileClass(state: TileState): string {
  switch (state) {
    case 'correct': return 'tile correct';
    case 'present': return 'tile present';
    case 'absent':  return 'tile absent';
    case 'tbd':     return 'tile tbd';
    default:        return 'tile empty';
  }
}

function LengthBadge({ hint }: { hint: LengthHint }) {
  const cls = `length-hint length-hint--${hint}`;
  const label = hint === 'longer' ? '+' : hint === 'shorter' ? '−' : '=';
  return <span className={cls}>{label}</span>;
}

const MAX_BOARD_WIDTH = 480;
const BOARD_SIDE_PADDING = 16; // matches .game's horizontal padding
const MAX_TILE = 41;
const MIN_TILE = 18;
const GAP = 5;
const BADGE_WIDTH = 36; // .length-hint (28px) + its margin-left (8px)
const FLIP_DURATION = 300; // ms — must match CSS .tile.flip animation duration

function useViewportWidth(): number {
  const [width, setWidth] = useState(() =>
    typeof window === 'undefined' ? MAX_BOARD_WIDTH : window.innerWidth
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

function tileSize(numLetters: number, maxBoardWidth: number): number {
  if (numLetters === 0) return MAX_TILE;
  const available = maxBoardWidth - GAP * (numLetters - 1);
  return Math.min(MAX_TILE, Math.max(MIN_TILE, Math.floor(available / numLetters)));
}

export default function Row({
  word,
  tileStates,
  lengthHint,
  isCurrent = false,
  minPlaceholder = 1,
  isRevealing = false,
  revealDelay = 0,
}: Props) {
  const letters = word.toUpperCase().split('');
  // For the active row, render at least minPlaceholder tiles so there's always a visible target
  const tileCount = isCurrent ? Math.max(letters.length, minPlaceholder) : letters.length;
  const viewportWidth = useViewportWidth();
  const maxBoardWidth = Math.min(MAX_BOARD_WIDTH, viewportWidth - BOARD_SIDE_PADDING);
  const size = tileSize(tileCount || 1, maxBoardWidth - (lengthHint ? BADGE_WIDTH : 0));

  // flipping[i]: flip animation is playing (tile is mid-rotation, color hidden)
  const [flipping, setFlipping] = useState<boolean[]>(() => new Array(tileStates.length).fill(false));
  // colored[i]: color has been revealed (fires at the midpoint of the flip, while tile is face-down)
  const [colored, setColored] = useState<boolean[]>(() => new Array(tileStates.length).fill(false));

  const prevRevealingRef = useRef(false);

  useEffect(() => {
    if (isRevealing && !prevRevealingRef.current) {
      const timers: ReturnType<typeof setTimeout>[] = [];
      tileStates.forEach((_, i) => {
        const flipStart = revealDelay + i * FLIP_DURATION;
        const colorAt  = flipStart + FLIP_DURATION / 2; // midpoint — tile is at 90°

        timers.push(setTimeout(() => {
          setFlipping(prev => { const n = [...prev]; n[i] = true; return n; });
        }, flipStart));

        timers.push(setTimeout(() => {
          setColored(prev => { const n = [...prev]; n[i] = true; return n; });
        }, colorAt));
      });
      return () => timers.forEach(clearTimeout);
    }
    prevRevealingRef.current = isRevealing;
  }, [isRevealing, tileStates, revealDelay]);

  const displayState = (i: number): TileState => {
    if (isCurrent) return letters[i] ? 'tbd' : 'empty';
    // Completed row not mid-reveal: show final colors immediately
    if (!isRevealing) return tileStates[i] ?? 'empty';
    // During reveal: show color only after the flip midpoint
    return colored[i] ? (tileStates[i] ?? 'empty') : 'tbd';
  };

  return (
    <div className="row" style={{ gap: GAP }}>
      {Array.from({ length: tileCount }, (_, i) => (
        <div
          key={i}
          className={`${tileClass(displayState(i))}${flipping[i] ? ' flip' : ''}`}
          style={{ width: size, height: size, fontSize: size * 0.44 }}
          data-animation={isCurrent && letters[i] ? 'pop' : undefined}
        >
          {letters[i] ?? ''}
        </div>
      ))}
      {lengthHint && <LengthBadge hint={lengthHint} />}
    </div>
  );
}

// Empty row (future guess slot)
export function EmptyRow({ numTiles = 5 }: { numTiles?: number }) {
  const viewportWidth = useViewportWidth();
  const maxBoardWidth = Math.min(MAX_BOARD_WIDTH, viewportWidth - BOARD_SIDE_PADDING);
  const size = tileSize(numTiles, maxBoardWidth);
  return (
    <div className="row" style={{ gap: GAP }}>
      {Array.from({ length: numTiles }).map((_, i) => (
        <div key={i} className="tile empty" style={{ width: size, height: size }} />
      ))}
    </div>
  );
}
