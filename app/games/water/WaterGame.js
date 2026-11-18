"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon, PlayIcon } from "@/components/icons";
import { BASE_MASK, E, FlowerPot, N, Pipe, S, Tap, W, WaterPreview, rotateMask } from "./art";

const GAME = "water";
const BOARDS = 3;

const LEVELS = [
  { id: "easy", name: "Easy", n: 3, decoys: 0, hintAfter: 0, detail: "3 × 3 pipes" },
  { id: "medium", name: "Medium", n: 4, decoys: 0.5, hintAfter: 7000, detail: "4 × 4, some extra pipes" },
  { id: "hard", name: "Big", n: 5, decoys: 1, hintAfter: 9000, detail: "5 × 5, full of pipes" },
];

const OPP = { [N]: S, [S]: N, [E]: W, [W]: E };
const STEP = { [N]: [-1, 0], [S]: [1, 0], [E]: [0, 1], [W]: [0, -1] };

const rand = (n) => Math.floor(Math.random() * n);

/** Which pipe and which rotation make a tile open on exactly the two sides `a` and `b`. */
function pipeFor(a, b) {
  const mask = a | b;
  for (const type of ["straight", "corner"]) {
    for (let r = 0; r < 4; r++) if (rotateMask(BASE_MASK[type], r) === mask) return { type, rot: r };
  }
  return null;
}

/**
 * A path from the tap (left of row r0) to the pot (right of the last row the path ends on).
 * Moves only right, up or down, so it can never cross itself.
 */
function makePath(n) {
  let r = rand(n);
  const r0 = r;
  const cells = [];
  let from = W;
  for (let c = 0; c < n; c++) {
    // Optionally wander up or down in this column before moving right.
    const run = c === n - 1 && Math.random() < 0.3 ? 0 : Math.random() < 0.6 ? 1 + rand(n - 1) : 0;
    const dir = r === 0 ? S : r === n - 1 ? N : Math.random() < 0.5 ? N : S;
    let steps = 0;
    while (steps < run) {
      const nr = r + (dir === S ? 1 : -1);
      if (nr < 0 || nr >= n) break;
      cells.push({ r, c, from, to: dir });
      from = OPP[dir];
      r = nr;
      steps++;
    }
    cells.push({ r, c, from, to: E });
    from = W;
  }
  return { r0, r1: r, cells };
}

function makeBoard(level) {
  const { n, decoys } = level;
  const { r0, r1, cells: path } = makePath(n);
  const grid = Array.from({ length: n * n }, () => ({ type: null, rot: 0, need: null, onPath: false }));
  path.forEach((p, i) => {
    const { type, rot } = pipeFor(p.from, p.to);
    grid[p.r * n + p.c] = { type, rot, need: rot, onPath: true, order: i };
  });
  grid.forEach((cell, i) => {
    if (!cell.onPath && Math.random() < decoys) grid[i] = { type: Math.random() < 0.5 ? "straight" : "corner", rot: rand(4), need: null, onPath: false };
  });
  // Scramble: every path pipe starts turned the wrong way.
  grid.forEach((cell) => {
    if (!cell.type) return;
    if (!cell.onPath) cell.rot = rand(4);
    else cell.rot = cell.need + (cell.type === "straight" ? 1 : 1 + rand(3)); // straight pipes only have one wrong way
  });
  return { n, r0, r1, grid, pathLength: path.length };
}

/** Quarter turns needed to fix a tile from its current rotation (straight pipes repeat every half turn). */
function turnsNeeded(cell) {
  const period = cell.type === "straight" ? 2 : 4;
  return (((cell.need - cell.rot) % period) + period) % period;
}

/** Follow the water from the tap. Returns { wet: Map(index -> distance), done } */
function flow(board) {
  const { n, r0, r1, grid } = board;
  const wet = new Map();
  const start = r0 * n;
  const open = (i) => (grid[i].type ? rotateMask(BASE_MASK[grid[i].type], grid[i].rot) : 0);
  if (!(open(start) & W)) return { wet, done: false };
  const queue = [[start, 0]];
  wet.set(start, 0);
  while (queue.length) {
    const [i, d] = queue.shift();
    const m = open(i);
    const r = Math.floor(i / n);
    const c = i % n;
    for (const dir of [N, E, S, W]) {
      if (!(m & dir)) continue;
      const [dr, dc] = STEP[dir];
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
      const j = nr * n + nc;
      if (wet.has(j) || !(open(j) & OPP[dir])) continue;
      wet.set(j, d + 1);
      queue.push([j, d + 1]);
    }
  }
  const end = r1 * n + (n - 1);
  return { wet, done: wet.has(end) && !!(open(end) & E) };
}

function starsFor(extraTurns) {
  if (extraTurns <= 4) return 3;
  if (extraTurns <= 12) return 2;
  return 1;
}

export default function WaterGame() {
  const [levelId, setLevelId] = useState(null);
  const [boards, setBoards] = useState(null);
  const [b, setB] = useState(0);
  const [grid, setGrid] = useState(null); // live tiles of the current board
  const [phase, setPhase] = useState("ready"); // ready | play | bloom | won
  const [turns, setTurns] = useState(0); // taps this round
  const [minTurns, setMinTurns] = useState(0); // fewest taps that would have solved every board so far
  const [idleHint, setIdleHint] = useState(false);
  const [cheer, setCheer] = useState(null);

  const best = useBestStars(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
  const timers = useRef([]);
  const idleTimer = useRef(null);
  const lastWet = useRef(0);
  const ids = useRef(0);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    clearTimeout(idleTimer.current);
  };
  useEffect(() => clearTimers, []);

  const board = boards?.[b];
  const live = useMemo(() => (board && grid ? { ...board, grid } : null), [board, grid]);
  const water = useMemo(() => (live ? flow(live) : { wet: new Map(), done: false }), [live]);

  const loadBoard = (bd) => {
    setGrid(bd.grid.map((cell) => ({ ...cell })));
    setMinTurns((m) => m + bd.grid.reduce((s, cell) => s + (cell.onPath ? turnsNeeded(cell) : 0), 0));
    lastWet.current = 0;
    setIdleHint(false);
  };

  const armIdleHint = (lvl) => {
    clearTimeout(idleTimer.current);
    setIdleHint(false);
    if (lvl.hintAfter) idleTimer.current = setTimeout(() => setIdleHint(true), lvl.hintAfter);
  };

  const start = useCallback((lvlId) => {
    clearTimers();
    const lvl = LEVELS.find((l) => l.id === lvlId);
    const bs = Array.from({ length: BOARDS }, () => makeBoard(lvl));
    setLevelId(lvlId);
    setBoards(bs);
    setB(0);
    setTurns(0);
    setMinTurns(0);
    setCheer(null);
    setPhase("ready");
    setGrid(bs[0].grid.map((cell) => ({ ...cell })));
    setMinTurns(bs[0].grid.reduce((s, cell) => s + (cell.onPath ? turnsNeeded(cell) : 0), 0));
    lastWet.current = 0;
    setIdleHint(false);
  }, []);

  const go = () => {
    sound.tap(); // unlocks audio on iOS
    sound.say("Turn the pipes to bring water to the flower!");
    setPhase("play");
    armIdleHint(level);
  };

  const backToMenu = () => {
    clearTimers();
    setLevelId(null);
    setBoards(null);
    setGrid(null);
  };

  const turn = (i) => {
    if (phase !== "play" || !grid[i].type) return;
    sound.tap();
    setTurns((t) => t + 1);
    const next = grid.map((cell, k) => (k === i ? { ...cell, rot: cell.rot + 1 } : cell));
    setGrid(next);
    armIdleHint(level);

    const result = flow({ ...board, grid: next });
    if (result.wet.size > lastWet.current) sound.splash();
    lastWet.current = result.wet.size;
    if (result.done) {
      // Water reaches the pot: wait for it to run through the pipes, then bloom.
      setPhase("bloom");
      clearTimeout(idleTimer.current);
      const runTime = Math.max(...result.wet.values()) * 90 + 450;
      later(() => {
        sound.match();
        sound.say("Hooray!");
        setCheer({ id: ++ids.current, text: "Hooray!" });
      }, runTime);
      later(() => {
        if (b + 1 >= BOARDS) {
          sound.win();
          setPhase("won");
        } else {
          setB(b + 1);
          loadBoard(boards[b + 1]);
          setPhase("play");
          armIdleHint(level);
          sound.pop();
        }
      }, runTime + 1700);
    }
  };

  /* Hint: the first pipe along the way that is still turned the wrong way. */
  const hintIndex = useMemo(() => {
    if (!live) return -1;
    let bestI = -1;
    let bestOrder = Infinity;
    live.grid.forEach((cell, i) => {
      if (cell.onPath && turnsNeeded(cell) > 0 && cell.order < bestOrder) {
        bestOrder = cell.order;
        bestI = i;
      }
    });
    return bestI;
  }, [live]);

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-24 items-center" aria-hidden>
              <span className="h-full w-[3.8rem]">
                <Tap />
              </span>
              <span className="pipe-tile size-24">
                <span className="block h-full w-full rotate-90">
                  <Pipe type="straight" wet />
                </span>
              </span>
              <span className="h-full w-[3.8rem]">
                <FlowerPot bloom />
              </span>
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Water Flow</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Turn the pipes to water the flower!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick a board size</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<WaterPreview size={l.n} />}
                  name={l.name}
                  detail={l.detail}
                  stars={best[l.id] || 0}
                  onClick={() => {
                    sound.tap();
                    start(l.id);
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* ---------------- Play ---------------- */
  const { n, r0, r1 } = board;
  const showHint = phase === "play" && (level.hintAfter === 0 || idleHint);
  const done = phase === "bloom" || phase === "won" ? b + 1 : b;
  const extra = Math.max(0, turns - minTurns);
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={BOARDS} done={done} label={`Board ${b + 1} of ${BOARDS}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {phase === "bloom" ? "The flower got water!" : "Tap a pipe to turn it. Get the water to the flower!"}
      </p>

      <div className="relative flex flex-1 items-center justify-center py-3">
        <div key={`board-${b}`} className="sorter-board water-board board-in" style={{ "--n": n }} data-solved={phase === "bloom"}>
          {/* tap on the left, aligned to its row */}
          <span className="water-end" style={{ gridColumn: 1, gridRow: r0 + 1 }}>
            <Tap />
          </span>
          {grid.map((cell, i) => {
            const r = Math.floor(i / n);
            const c = i % n;
            const wet = water.wet.has(i);
            return (
              <button
                key={i}
                onClick={() => turn(i)}
                className="pipe-tile"
                style={{ gridColumn: c + 2, gridRow: r + 1, "--d": water.wet.get(i) ?? 0 }}
                data-hint={showHint && i === hintIndex}
                data-index={i}
                data-onpath={cell.onPath}
                data-turns={cell.onPath ? turnsNeeded(cell) : ""}
                disabled={!cell.type}
                aria-label={cell.type ? `Pipe, row ${r + 1}, column ${c + 1}${wet ? ", has water" : ""}. Tap to turn.` : "Empty"}
              >
                {cell.type && (
                  <span className="pipe-turn" style={{ transform: `rotate(${cell.rot * 90}deg)` }}>
                    <Pipe type={cell.type} wet={wet} />
                  </span>
                )}
              </button>
            );
          })}
          {/* pot on the right, aligned to its row */}
          <span className="water-end" style={{ gridColumn: n + 2, gridRow: r1 + 1 }}>
            <FlowerPot bloom={phase === "bloom" || phase === "won"} />
          </span>
        </div>

        {cheer && (
          <div
            key={cheer.id}
            className="cheer pointer-events-none absolute top-1/2 left-1/2 z-10 text-3xl whitespace-nowrap sm:text-5xl"
            onAnimationEnd={(e) => e.animationName === "cheer" && setCheer(null)}
          >
            {cheer.text}
          </div>
        )}

        {phase === "ready" && (
          <div className="absolute inset-0 z-10 grid place-items-center p-6">
            <div className="paper sheet-pop flex w-full max-w-xs flex-col items-center gap-3 px-6 pt-6 pb-5 text-center">
              <div className="flex h-16 items-center" aria-hidden>
                <span className="h-full w-10">
                  <Tap />
                </span>
                <span className="pipe-tile size-16">
                  <span className="block h-full w-full rotate-90">
                    <Pipe type="straight" wet />
                  </span>
                </span>
                <span className="h-full w-10">
                  <FlowerPot bloom />
                </span>
              </div>
              <p className="printed text-2xl leading-tight font-bold">Water the flower!</p>
              <p className="printed-soft text-base leading-snug">Tap the pipes to turn them until the water reaches the pot.</p>
              <button onClick={go} className="btn mt-1 w-full" data-start autoFocus>
                <PlayIcon /> Start
              </button>
            </div>
          </div>
        )}
      </div>

      {phase === "won" && (
        <WinSheet
          stars={starsFor(extra)}
          summary={`You watered ${BOARDS} flowers!`}
          detail={extra === 0 ? "Not one extra turn!" : `${level.name} · ${turns} turns`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
