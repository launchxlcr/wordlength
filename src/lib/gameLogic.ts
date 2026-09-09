import type { TileState, LengthHint } from '../types';

/**
 * Evaluate a guess against a solution.
 *
 * Rules:
 * - Positions within min(guess, solution) length are evaluated normally.
 * - Green: same letter, same position.
 * - Yellow: letter exists in solution but not at this position (Wordle duplicate counting applies).
 * - Letters in the guess beyond the solution length can still be yellow if the letter
 *   exists in the unused pool of solution letters.
 * - Letters in the solution beyond the guess length are added to the available pool
 *   for yellow matching within the guess.
 */
export function evaluateGuess(guess: string, solution: string): TileState[] {
  const g = guess.toUpperCase();
  const s = solution.toUpperCase();
  const result: TileState[] = new Array(g.length).fill('absent');

  // Build pool of solution letters not consumed by a green match.
  const pool: Record<string, number> = {};
  for (let i = 0; i < s.length; i++) {
    if (i < g.length && g[i] === s[i]) {
      // Green: consumed — don't add to pool
    } else {
      pool[s[i]] = (pool[s[i]] ?? 0) + 1;
    }
  }

  // First pass — mark greens (only within solution bounds)
  for (let i = 0; i < Math.min(g.length, s.length); i++) {
    if (g[i] === s[i]) {
      result[i] = 'correct';
    }
  }

  // Second pass — mark yellows across entire guess length
  for (let i = 0; i < g.length; i++) {
    if (result[i] === 'correct') continue;
    if (pool[g[i]] && pool[g[i]] > 0) {
      result[i] = 'present';
      pool[g[i]]--;
    }
  }

  return result;
}

export function getLengthHint(guess: string, solution: string): LengthHint {
  if (guess.length < solution.length) return 'longer';
  if (guess.length > solution.length) return 'shorter';
  return 'equal';
}

export function isGuessLengthValid(
  guessLength: number,
  minLength: number,
  maxLength: number
): boolean {
  return guessLength >= minLength && guessLength <= maxLength;
}

export function updateLengthConstraints(
  hint: LengthHint,
  guessLength: number,
  minLength: number,
  maxLength: number
): { minLength: number; maxLength: number } {
  switch (hint) {
    case 'longer':
      return { minLength: Math.max(minLength, guessLength + 1), maxLength };
    case 'shorter':
      return { minLength, maxLength: Math.min(maxLength, guessLength - 1) };
    case 'equal':
      return { minLength: guessLength, maxLength: guessLength };
  }
}

export function buildShareText(
  puzzleNumber: number,
  guesses: Array<{ tileStates: TileState[]; lengthHint: LengthHint }>,
  won: boolean,
  maxGuesses: number
): string {
  const score = won ? guesses.length : 'X';
  const header = `WordLength #${puzzleNumber}\n${score}/${maxGuesses}`;

  const rows = guesses.map(({ tileStates, lengthHint }) => {
    const tiles = tileStates
      .map(s => {
        if (s === 'correct') return '🟩';
        if (s === 'present') return '🟨';
        return '⬛';
      })
      .join('');
    const hint = lengthHint === 'longer' ? '➕' : lengthHint === 'shorter' ? '➖' : '🟰';
    return `${tiles} ${hint}`;
  });

  return `${header}\n\n${rows.join('\n')}`;
}
