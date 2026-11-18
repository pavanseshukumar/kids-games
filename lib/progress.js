// Best stars per level for each game, kept in this browser only.
import { useMemo, useSyncExternalStore } from "react";

const listeners = new Set();
const keyFor = (game) => `best:${game}`;

function read(game) {
  try {
    return localStorage.getItem(keyFor(game)) || "{}";
  } catch {
    return "{}";
  }
}

function parse(raw) {
  try {
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

/** Remember `stars` for a level if it beats the previous best. */
export function saveStars(game, levelId, stars) {
  const prev = parse(read(game));
  if ((prev[levelId] || 0) >= stars) return;
  try {
    localStorage.setItem(keyFor(game), JSON.stringify({ ...prev, [levelId]: stars }));
  } catch {}
  listeners.forEach((fn) => fn());
}

/* ---------- Best scores (endless games) ---------- */
const scoreKey = (game) => `score:${game}`;

function readScores(game) {
  try {
    return localStorage.getItem(scoreKey(game)) || "{}";
  } catch {
    return "{}";
  }
}

/** Remember `score` for a level. Returns { best, isNew } with the previous best for comparison. */
export function saveBestScore(game, levelId, score) {
  const prev = parse(readScores(game));
  const old = prev[levelId] || 0;
  if (score > old) {
    try {
      localStorage.setItem(scoreKey(game), JSON.stringify({ ...prev, [levelId]: score }));
    } catch {}
    listeners.forEach((fn) => fn());
  }
  return { best: Math.max(old, score), isNew: score > old && score > 0 };
}

/** { [levelId]: bestScore } for an endless game. Empty during server render. */
export function useBestScores(game) {
  const raw = useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => readScores(game),
    () => "{}"
  );
  return useMemo(() => parse(raw), [raw]);
}

/** { [levelId]: stars } for a game. Empty during server render. */
export function useBestStars(game) {
  const raw = useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => read(game),
    () => "{}"
  );
  return useMemo(() => parse(raw), [raw]);
}
