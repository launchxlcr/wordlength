import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameState, Stats, TileState } from './types';
import { evaluateGuess, getLengthHint, isGuessLengthValid, updateLengthConstraints, buildShareText } from './lib/gameLogic';
import { getDailyInfo, getTodayDateString } from './lib/words';
import { isValidWord } from './lib/validWords';
import { loadGameState, saveGameState, loadStats, saveStats, hasSeenInstructions, markInstructionsSeen } from './lib/storage';
import Header from './components/Header';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import HowToPlayModal from './components/HowToPlayModal';
import StatsModal from './components/StatsModal';
import Toast from './components/Toast';

const MAX_GUESSES = 6;
const MAX_GUESS_LENGTH = 15;

function buildLetterStates(guesses: GameState['guesses']): Record<string, TileState> {
  const priority: Record<TileState, number> = { correct: 3, present: 2, absent: 1, tbd: 0, empty: 0 };
  const states: Record<string, TileState> = {};
  for (const g of guesses) {
    g.word.toUpperCase().split('').forEach((letter, i) => {
      const next = g.tileStates[i];
      if (!states[letter] || priority[next] > priority[states[letter]]) {
        states[letter] = next;
      }
    });
  }
  return states;
}

function initGameState(): GameState {
  const { word, puzzleNumber } = getDailyInfo();
  return {
    solution: word,
    puzzleNumber,
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    minLength: 1,
    maxLength: MAX_GUESS_LENGTH,
    date: getTodayDateString(),
  };
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    const today = getTodayDateString();
    if (saved && saved.date === today) return saved;
    return initGameState();
  });
  const [stats, setStats] = useState<Stats>(loadStats);
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const shakingRef = useRef(false);
  const [shakeBoard, setShakeBoard] = useState(false);

  // Show instructions on first visit
  useEffect(() => {
    if (!hasSeenInstructions()) {
      setShowHelp(true);
      markInstructionsSeen();
    }
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const showToast = useCallback((msg: string) => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
  }, []);

  const handleKey = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;
    if (revealingRow !== null) return;

    if (key === '⌫' || key === 'BACKSPACE') {
      setGameState(prev => ({ ...prev, currentGuess: prev.currentGuess.slice(0, -1) }));
      return;
    }

    if (key === 'ENTER') {
      const { currentGuess, solution, guesses, minLength, maxLength } = gameState;

      if (currentGuess.length === 0) return;

      if (!isGuessLengthValid(currentGuess.length, minLength, maxLength)) {
        const lo = minLength;
        const hi = maxLength;
        if (lo === hi) {
          showToast(`Must be exactly ${lo} letter${lo === 1 ? '' : 's'}`);
        } else if (currentGuess.length < lo) {
          showToast(`Must be at least ${lo} letter${lo === 1 ? '' : 's'}`);
        } else {
          showToast(`Must be at most ${hi} letter${hi === 1 ? '' : 's'}`);
        }
        setShakeBoard(true);
        setTimeout(() => setShakeBoard(false), 600);
        return;
      }

      if (!isValidWord(currentGuess)) {
        showToast('Not in word list');
        setShakeBoard(true);
        setTimeout(() => setShakeBoard(false), 600);
        return;
      }

      const tileStates = evaluateGuess(currentGuess, solution);
      const lengthHint = getLengthHint(currentGuess, solution);
      const newGuess = { word: currentGuess, tileStates, lengthHint };
      const newGuesses = [...guesses, newGuess];

      const won = currentGuess.toUpperCase() === solution.toUpperCase();
      const rowIndex = guesses.length;

      setRevealingRow(rowIndex);
      const revealDuration = tileStates.length * 300 + 300;

      setTimeout(() => {
        setRevealingRow(null);
        const lost = !won && newGuesses.length >= MAX_GUESSES;
        const newStatus = won ? 'won' : lost ? 'lost' : 'playing';
        const { minLength: newMin, maxLength: newMax } = updateLengthConstraints(
          lengthHint, currentGuess.length, gameState.minLength, gameState.maxLength
        );

        setGameState(prev => ({
          ...prev,
          guesses: newGuesses,
          currentGuess: '',
          gameStatus: newStatus,
          minLength: newMin,
          maxLength: newMax,
        }));

        if (won || lost) {
          if (won) showToast(['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'][Math.min(rowIndex, 5)]);
          else showToast(solution);

          const updatedStats = { ...stats };
          updatedStats.gamesPlayed++;
          if (won) {
            updatedStats.gamesWon++;
            updatedStats.currentStreak++;
            updatedStats.maxStreak = Math.max(updatedStats.maxStreak, updatedStats.currentStreak);
            const key = String(newGuesses.length);
            updatedStats.guessDistribution[key] = (updatedStats.guessDistribution[key] ?? 0) + 1;
          } else {
            updatedStats.currentStreak = 0;
          }
          setStats(updatedStats);
          saveStats(updatedStats);

          setTimeout(() => setShowStats(true), 1800);
        }
      }, revealDuration);

      // Optimistically add the guess so the board shows it immediately
      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: '',
      }));
      return;
    }

    // Letter key
    if (/^[A-Z]$/.test(key.toUpperCase())) {
      const letter = key.toUpperCase();
      setGameState(prev => {
        if (prev.currentGuess.length >= MAX_GUESS_LENGTH) return prev;
        return { ...prev, currentGuess: prev.currentGuess + letter };
      });
    }
  }, [gameState, revealingRow, showToast, stats]);

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Backspace') { handleKey('BACKSPACE'); return; }
      if (e.key === 'Enter') { handleKey('ENTER'); return; }
      if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const handleShare = useCallback(() => {
    const text = buildShareText(
      gameState.puzzleNumber,
      gameState.guesses,
      gameState.gameStatus === 'won',
      MAX_GUESSES
    );
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!')).catch(() => {
      showToast('Could not copy');
    });
  }, [gameState, showToast]);

  const letterStates = buildLetterStates(gameState.guesses);
  const lastScore = gameState.gameStatus === 'won' ? gameState.guesses.length : null;

  return (
    <div className="app">
      <Header
        puzzleNumber={gameState.puzzleNumber}
        onHelp={() => setShowHelp(true)}
        onStats={() => setShowStats(true)}
      />
      <main className="game">
        <div className={`board-container${shakeBoard ? ' shake' : ''}`}>
          <Board
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            gameStatus={gameState.gameStatus}
            revealingRow={revealingRow}
            solutionLength={gameState.solution.length}
            minLength={gameState.minLength}
          />
        </div>
        {gameState.gameStatus !== 'playing' && gameState.minLength !== gameState.maxLength && (
          <p className="constraint-hint">
            Next guess: {gameState.minLength}
            {gameState.maxLength < MAX_GUESS_LENGTH ? `–${gameState.maxLength}` : '+'} letters
          </p>
        )}
        {gameState.gameStatus === 'playing' && (
          <p className="constraint-hint">
            {gameState.minLength === 1 && gameState.maxLength === MAX_GUESS_LENGTH
              ? 'Type your first guess - up to 10 letters!'
              : gameState.minLength === gameState.maxLength
              ? `Exactly ${gameState.minLength} letter${gameState.minLength === 1 ? '' : 's'}`
              : gameState.minLength > 1 && gameState.maxLength < MAX_GUESS_LENGTH
              ? `${gameState.minLength}–${gameState.maxLength} letters`
              : gameState.minLength > 1
              ? `At least ${gameState.minLength} letters`
              : `At most ${gameState.maxLength} letters`
            }
          </p>
        )}
        <Keyboard letterStates={letterStates} onKey={handleKey} />
      </main>

      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}
      {showStats && (
        <StatsModal
          stats={stats}
          lastScore={lastScore}
          won={gameState.gameStatus === 'won'}
          onClose={() => setShowStats(false)}
          onShare={handleShare}
        />
      )}
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
