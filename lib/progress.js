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
