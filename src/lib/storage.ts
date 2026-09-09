import type { GameState, Stats } from '../types';

const GAME_STATE_KEY = 'wordlength_game_state';
const STATS_KEY = 'wordlength_stats';
const INSTRUCTIONS_KEY = 'wordlength_seen_instructions';

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch {}
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as Stats;
  } catch {}
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {},
  };
}

export function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function hasSeenInstructions(): boolean {
  return localStorage.getItem(INSTRUCTIONS_KEY) === 'true';
}

export function markInstructionsSeen(): void {
  localStorage.setItem(INSTRUCTIONS_KEY, 'true');
}
