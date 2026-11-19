"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon, BulbIcon, PlayIcon } from "@/components/icons";
import { MiniTray, PICTURES, PictureLibrary, PicturePart, TrayPreview, WholePicture } from "./art";

const GAME = "puzzle";
const PER_ROUND = 3;

const LEVELS = [
  { id: "easy", name: "Easy", n: 3, mix: 8, minWrong: 3, detail: "9 tiles, a little mixed" },
  { id: "medium", name: "Medium", n: 3, mix: 26, minWrong: 6, detail: "9 tiles, all mixed up" },
  { id: "hard", name: "Big", n: 4, mix: 34, minWrong: 9, detail: "16 tiles" },
];

const rand = (k) => Math.floor(Math.random() * k);

function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function neighbours(g, n) {
  const r = Math.floor(g / n);
  const c = g % n;
  const out = [];
  if (r > 0) out.push(g - n);
  if (r < n - 1) out.push(g + n);
  if (c > 0) out.push(g - 1);
  if (c < n - 1) out.push(g + 1);
  return out;
}

const solvedBoard = (n) => Array.from({ length: n * n }, (_, i) => i);

/** Slide the tile at `p` into the gap at `g` (they must be neighbours). */
function stepBoard(board, g, p) {
  const next = [...board];
  next[g] = board[p];
  next[p] = board[g];
  return next;
}

/**
 * Mix the picture by sliding tiles at random from the solved state, so it can
 * always be solved. Returns the gap positions in order (each = the tile that moved).
 */
function makeMix(level) {
  const { n, mix, minWrong } = level;
  const blank = n * n - 1;
  for (;;) {
    let board = solvedBoard(n);
    let g = blank;
    let prev = -1;
    const steps = [];
    for (let k = 0; k < mix; k++) {
      const opts = neighbours(g, n).filter((p) => p !== prev);
      const p = opts[rand(opts.length)];
      board = stepBoard(board, g, p);
      steps.push(p);
      prev = g;
      g = p;
    }
    const wrong = board.filter((t, i) => t !== i && t !== blank).length;
    if (wrong >= minWrong) return steps;
  }
}

/** Keep a trail of gap positions back to the solved picture; walking it backwards solves it. */
function walk(trail, p) {
  return trail.length >= 2 && trail[trail.length - 2] === p ? trail.slice(0, -1) : [...trail, p];
}

function starsFor(hints) {
  if (hints === 0) return 3;
  if (hints <= 2) return 2;
  return 1;
}

export default function PuzzleGame() {
  const [levelId, setLevelId] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [p, setP] = useState(0);
  const [game, setGame] = useState(null); // { board, trail }
  const [phase, setPhase] = useState("ready"); // ready | show | mix | play | solved | won
  const [hints, setHints] = useState(0);
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState(-1); // board position to glow
  const [nope, setNope] = useState(null); // { tile, n } to replay the shake
  const [cheer, setCheer] = useState(null);

  const best = useBestStars(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
  const picture = pictures[p];

  const timers = useRef([]);
  const ids = useRef(0);
  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  /** Show the finished picture, then mix it up in front of the child. */
  const loadPicture = useCallback(
    (lvl, index) => {
      clearTimers();
      setP(index);
      setHint(-1);
      setGame({ board: solvedBoard(lvl.n), trail: [lvl.n * lvl.n - 1] });
      setPhase("show");
      const steps = makeMix(lvl);
      const each = Math.max(70, Math.min(150, 2600 / steps.length));
      later(() => {
        setPhase("mix");
        steps.forEach((pos, k) => {
          later(() => {
            sound.shuffle();
            setGame(({ board, trail }) => ({ board: stepBoard(board, board.indexOf(lvl.n * lvl.n - 1), pos), trail: [...trail, pos] }));
          }, k * each);
        });
        later(() => setPhase("play"), steps.length * each + 250);
      }, 1500);
    },
    [later]
  );

  const start = useCallback((lvlId) => {
    clearTimers();
    setLevelId(lvlId);
    setPictures(shuffled(PICTURES).slice(0, PER_ROUND).map((x) => x.id));
    setP(0);
    setGame(null);
    setHints(0);
    setMoves(0);
    setHint(-1);
    setCheer(null);
    setPhase("ready");
  }, []);

  const go = () => {
    sound.tap(); // unlocks audio on iOS
    sound.say("Look at the picture. Then slide the tiles to fix it!");
    loadPicture(level, 0);
  };

  const backToMenu = () => {
    clearTimers();
    setLevelId(null);
    setGame(null);
  };

  const n = level?.n ?? 3;
  const blank = n * n - 1;

  const solved = (board) => board.every((t, i) => t === i);

  const onSolved = () => {
    setPhase("solved");
    setHint(-1);
    sound.match();
    const name = PICTURES.find((x) => x.id === picture).name;
    sound.say(`You fixed ${name}!`);
    setCheer({ id: ++ids.current, text: "You fixed it!" });
    later(() => {
      if (p + 1 >= PER_ROUND) {
        saveStars(GAME, level.id, starsFor(hintsRef.current));
        sound.win();
        setPhase("won");
      } else {
        loadPicture(level, p + 1);
      }
    }, 2300);
  };

  /** Tap a tile: if it's in line with the gap, slide it (and any tiles between) over. */
  const slide = (pos) => {
    if (phase !== "play" || !game) return;
    const { board } = game;
    const g = board.indexOf(blank);
    const sameRow = Math.floor(pos / n) === Math.floor(g / n);
    const sameCol = pos % n === g % n;
    if (pos === g) return;
    if (!sameRow && !sameCol) {
      sound.boing();
      setNope({ tile: board[pos], n: ++ids.current });
      return;
    }
    const dir = sameRow ? (pos > g ? 1 : -1) : pos > g ? n : -n;
    let b = board;
    let trail = game.trail;
    let gap = g;
    while (gap !== pos) {
      const q = gap + dir;
      b = stepBoard(b, gap, q);
      trail = walk(trail, q);
      gap = q;
    }
    sound.slide();
    setGame({ board: b, trail });
    setMoves((m) => m + 1);
    setHint(-1);
    if (solved(b)) onSolved();
  };

  const help = () => {
    if (phase !== "play" || !game) return;
    sound.tap();
    const target = game.trail[game.trail.length - 2];
    setHint(target);
    setHints((h) => h + 1);
    sound.say("Slide the glowing tile!");
  };

  // Latest hint count for the timeout above.
  const hintsRef = useRef(0);
  useEffect(() => {
    hintsRef.current = hints;
  }, [hints]);

  // Arrow keys: push the tile next to the gap into it.
  const slideRef = useRef(slide);
  useEffect(() => {
    slideRef.current = slide;
  });
  useEffect(() => {
    if (!level) return;
    const onKey = (e) => {
      const map = { ArrowLeft: [0, 1], ArrowRight: [0, -1], ArrowUp: [1, 0], ArrowDown: [-1, 0] };
      const d = map[e.key];
      if (!d || !game) return;
      const g = game.board.indexOf(blank);
      const r = Math.floor(g / n) + d[0];
      const c = (g % n) + d[1];
      if (r < 0 || r >= n || c < 0 || c >= n) return;
      e.preventDefault();
      slideRef.current(r * n + c);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level, game, blank, n]);

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <PictureLibrary />
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <span className="mb-4 block w-40 rotate-[-3deg] drop-shadow-[0_8px_8px_rgba(40,18,0,0.45)] sm:w-44">
              <MiniTray picture="balloons" n={3} order={[0, 1, 2, 3, 4, 8, 6, 7, 5]} />
            </span>
            <h1 className="toy-title text-5xl sm:text-6xl">Sliding Puzzle</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Slide the tiles to fix the picture!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick a puzzle</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={
                    <TrayPreview
                      picture={l.id === "easy" ? "train" : l.id === "medium" ? "fish" : "house"}
                      n={l.n}
                      order={
                        l.id === "easy"
                          ? [0, 1, 2, 3, 4, 5, 6, 8, 7]
                          : l.id === "medium"
                            ? [3, 0, 2, 7, 1, 5, 8, 4, 6]
                            : [4, 0, 2, 3, 1, 5, 6, 7, 8, 9, 11, 15, 12, 13, 10, 14]
                      }
                    />
                  }
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
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];
  const done = phase === "solved" || phase === "won" ? p + 1 : p;
  const board = game?.board ?? solvedBoard(n);
  const gapPos = board.indexOf(blank);
  const whole = phase === "show" || phase === "solved" || phase === "won" || phase === "ready";

  const prompt =
    phase === "show"
      ? "Look at the picture..."
      : phase === "mix"
        ? "Mixing it up!"
        : phase === "solved" || phase === "won"
          ? "You fixed the picture!"
          : hint >= 0
            ? "Slide the glowing tile!"
            : "Tap a tile next to the gap to slide it.";

  // Where each tile sits now.
  const posOf = [];
  board.forEach((t, pos) => {
    posOf[t] = pos;
  });

  return (
    <main className="screen">
      <PictureLibrary />
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={PER_ROUND} done={done} label={`Picture ${p + 1} of ${PER_ROUND}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 min-h-[3.25rem] text-center text-lg leading-snug font-medium sm:min-h-0 sm:text-xl" aria-live="polite">
        {prompt}
      </p>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 py-2">
        <div key={`tray-${p}`} className="slide-tray board-in" data-done={phase === "solved"}>
          <div
            className="slide-well"
            style={{ "--n": n }}
            data-whole={whole}
            data-phase={phase}
            role="group"
            aria-label="Sliding puzzle. Tap a tile next to the gap to slide it."
          >
            {posOf.map((pos, tile) => {
              const isGap = tile === blank;
              const g = gapPos;
              const movable = !isGap && phase === "play" && (Math.floor(pos / n) === Math.floor(g / n) || pos % n === g % n);
              return (
                <button
                  key={`${p}-${tile}`}
                  className="slide-tile"
                  style={{ "--c": pos % n, "--r": Math.floor(pos / n) }}
                  data-tile={tile}
                  data-pos={pos}
                  data-gap={isGap}
                  data-hint={hint === pos && phase === "play"}
                  tabIndex={isGap || phase !== "play" ? -1 : 0}
                  aria-hidden={isGap || undefined}
                  aria-label={`Picture tile ${tile + 1}${pos === tile ? ", in the right place" : ""}${movable ? ". Can slide." : ""}`}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    slide(pos);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      slide(pos);
                    }
                  }}
                >
                  <span key={nope?.tile === tile ? nope.n : "rest"} className={`slide-face ${nope?.tile === tile ? "nope-shake" : ""}`}>
                    <PicturePart picture={picture} n={n} c={tile % n} r={Math.floor(tile / n)} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full max-w-sm items-center justify-center gap-4">
          <div className="paper lid-card relative shrink-0" aria-label="The picture to make">
            <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg] text-sm whitespace-nowrap">Make this</span>
            <span className="lid-pic">
              <WholePicture picture={picture} />
            </span>
          </div>
          <button onClick={help} className="btn btn-cream min-w-0 flex-1" data-help disabled={phase !== "play"}>
            <BulbIcon /> Help
          </button>
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
              <span className="block w-32 rotate-[-3deg] drop-shadow-[0_5px_5px_rgba(40,18,0,0.35)]" aria-hidden>
                <MiniTray picture={picture} n={3} order={[0, 1, 2, 3, 4, 5, 6, 8, 7]} />
              </span>
              <p className="printed text-2xl leading-tight font-bold">Fix the picture!</p>
              <p className="printed-soft text-base leading-snug">
                Watch the picture get mixed up. Then tap a tile next to the gap to slide it back.
              </p>
              <button onClick={go} className="btn mt-1 w-full" data-start autoFocus>
                <PlayIcon /> Start
              </button>
            </div>
          </div>
        )}
      </div>

      {phase === "won" && (
        <WinSheet
          stars={starsFor(hints)}
          summary={`${PER_ROUND} pictures fixed!`}
          detail={hints === 0 ? `No help needed · ${moves} slides` : `${level.name} · ${hints} help${hints > 1 ? "s" : ""} · ${moves} slides`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
