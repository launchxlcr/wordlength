export type TileState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';
export type LengthHint = 'longer' | 'shorter' | 'equal';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface GuessResult {
  word: string;
  tileStates: TileState[];
  lengthHint: LengthHint;
}

export interface GameState {
  solution: string;
  puzzleNumber: number;
  guesses: GuessResult[];
  currentGuess: string;
  gameStatus: GameStatus;
  minLength: number;
  maxLength: number;
  date: string;
}

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<string, number>;
}
