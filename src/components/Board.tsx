import Row, { EmptyRow } from './Row';
import type { GuessResult, GameStatus } from '../types';

const MAX_GUESSES = 6;

interface Props {
  guesses: GuessResult[];
  currentGuess: string;
  gameStatus: GameStatus;
  revealingRow: number | null;
  solutionLength: number;
  minLength: number;
}

export default function Board({
  guesses,
  currentGuess,
  gameStatus,
  revealingRow,
  solutionLength,
  minLength,
}: Props) {
  const emptyRows = Math.max(0, MAX_GUESSES - guesses.length - (gameStatus === 'playing' ? 1 : 0));

  return (
    <div className="board">
      {guesses.map((g, i) => (
        <Row
          key={i}
          word={g.word}
          tileStates={g.tileStates}
          lengthHint={g.lengthHint}
          isRevealing={revealingRow === i}
          revealDelay={0}
        />
      ))}
      {gameStatus === 'playing' && (
        <Row
          word={currentGuess}
          tileStates={[]}
          isCurrent
          minPlaceholder={minLength}
        />
      )}
      {Array.from({ length: emptyRows }).map((_, i) => (
        <EmptyRow key={`empty-${i}`} numTiles={solutionLength} />
      ))}
    </div>
  );
}
