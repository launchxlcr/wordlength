import { DAILY_SOLUTIONS } from './words';

// Word set is populated asynchronously from public/words.txt (191k words, 4–10 letters).
// isValidWord returns true while still loading so guesses are never silently blocked on first load.

let wordSet: Set<string> | null = null;
let loading = true;

async function loadWords(): Promise<void> {
  try {
    const res = await fetch('/words.txt');
    const text = await res.text();
    const set = new Set(text.split('\n').filter(Boolean).map(w => w.trim().toUpperCase()));
    // Ensure every solution word is always accepted
    for (const w of DAILY_SOLUTIONS) set.add(w.toUpperCase());
    wordSet = set;
  } catch {
    // If fetch fails, fall back to accepting everything (words.txt unavailable)
    wordSet = null;
  } finally {
    loading = false;
  }
}

// Kick off the load immediately when the module is imported
const loadPromise = loadWords();

export function isValidWord(word: string): boolean {
  // While the list is still loading, let the guess through (rare first-keystroke race)
  if (loading) return true;
  // If the load failed, don't block the player
  if (wordSet === null) return true;
  return wordSet.has(word.toUpperCase());
}

// Exposed so App can await the initial load if desired
export { loadPromise };
