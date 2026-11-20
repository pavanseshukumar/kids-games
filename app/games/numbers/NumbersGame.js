"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveBestTime, saveStars, useBestStars, useBestTimes } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon } from "@/components/icons";
import { NumTile, PAINTS } from "./art";

const GAME = "numbers";
const PEEK_MS = 900; // how long a wrong tile stays open before it flips back

const LEVELS = [
  // `look`: seconds every number is shown after the shuffle, before the tiles close
  { id: "3", size: 3, look: 3, name: "Small", detail: "3 × 3 · 1 to 9" },
  { id: "4", size: 4, look: 5, name: "Medium", detail: "4 × 4 · 1 to 16" },
  { id: "5", size: 5, look: 7, name: "Big", detail: "5 × 5 · 1 to 25" },
];

const CHEERS = ["Super!", "Fast fingers!", "Keep going!", "Great!", "Yes!"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const now = () => Date.now();
const fmt = (tenths) => (tenths / 10).toFixed(1);

/**
 * Children see every number before the tiles close, so a few slips are normal
 * on bigger grids. Stars scale with the grid: on 4 × 4, up to 3 wrong flips is
 * 3 stars and up to 10 is 2.
 */
function starsFor(wrong, cells) {
  if (wrong <= Math.round(cells * 0.2)) return 3;
  if (wrong <= Math.round(cells * 0.6)) return 2;
  return 1;
}

/** Mini grid for the menu tiles: the level's size, with 1, 2, 3 already found. */
function GridPreview({ size }) {
  // A fixed jumble (stepping by 7 visits every cell), so server and browser agree.
  const cells = Array.from({ length: size * size }, (_, i) => ((i * 7) % (size * size)) + 1);
  return (
    <span
      className="num-preview grid size-[60px] shrink-0 gap-[2px] rounded-[12px] p-[5px]"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      aria-hidden
    >
      {cells.map((n) => (
        <span key={n} className="num-preview-cell" data-on={n <= 3} />
      ))}
    </span>
  );
}

export default function NumbersGame() {
  const [levelId, setLevelId] = useState(null);
  const [order, setOrder] = useState([]); // the numbers as laid out in the grid
  const [next, setNext] = useState(1); // the number to tap now
  const [mistakes, setMistakes] = useState(0);
  const [nope, setNope] = useState(null); // { n, id } for a wrong tap
  const [peek, setPeek] = useState(null); // a wrong tile showing its number for a moment
  const [look, setLook] = useState(null); // seconds left to memorise, while every number shows
  const [tenths, setTenths] = useState(0);
  const [running, setRunning] = useState(false);
  const [cheer, setCheer] = useState(null);
  const [won, setWon] = useState(null); // { stars, time, best, isNew, first }

  const bestStars = useBestStars(GAME);
  const bestTimes = useBestTimes(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
  const startAt = useRef(0);
  const peekTimer = useRef(null);
  const lookEnd = useRef(0);
  const ids = useRef(0);
  const nextId = () => ++ids.current;

  useEffect(
    () => () => {
      clearTimeout(peekTimer.current);
      sound.say("");
    },
    []
  );

  /* Memorise time: count down, then close every tile at once. */
  const closeTiles = useCallback(() => {
    setLook(null);
    sound.flip();
    sound.say("Find number one!");
  }, []);

  const lookActive = look != null;
  useEffect(() => {
    if (!lookActive) return;
    let last = null;
    const id = setInterval(() => {
      const rem = Math.ceil((lookEnd.current - now()) / 1000);
      if (rem <= 0) return closeTiles();
      if (rem !== last) {
        if (last != null) sound.tick();
        last = rem;
        setLook(rem);
      }
    }, 100);
    return () => clearInterval(id);
  }, [lookActive, closeTiles]);

  /* Stopwatch: starts with the first flip. */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTenths(Math.floor((now() - startAt.current) / 100)), 100);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback((lvlId) => {
    const lvl = LEVELS.find((l) => l.id === lvlId);
    setLevelId(lvlId);
    setOrder(shuffle(Array.from({ length: lvl.size * lvl.size }, (_, i) => i + 1)));
    setNext(1);
    setMistakes(0);
    setNope(null);
    clearTimeout(peekTimer.current);
    setPeek(null);
    setTenths(0);
    setRunning(false);
    setCheer(null);
    setWon(null);
    sound.shuffle();
    lookEnd.current = now() + lvl.look * 1000;
    setLook(lvl.look);
    sound.say("Remember where the numbers are!");
  }, []);

  const backToMenu = () => {
    clearTimeout(peekTimer.current);
    setLook(null);
    sound.say("");
    setRunning(false);
    setLevelId(null);
  };

  const tap = (n) => {
    if (won || n < next || peek != null || look != null) return;
    if (!running && tenths === 0) {
      startAt.current = now(); // the clock starts with the very first flip
      setRunning(true);
    }
    sound.flip();
    if (n !== next) {
      // Wrong tile: show its number for a moment, then close it again. Remember it!
      setMistakes((m) => m + 1);
      setPeek(n);
      setNope({ n, id: nextId() });
      sound.say(`That's ${n}.`);
      peekTimer.current = setTimeout(() => {
        setPeek(null);
        sound.flip();
      }, PEEK_MS);
      return;
    }
    const t = now();
    sound.pop();
    const total = order.length;
    if (n === total) {
      const time = Math.max(1, Math.floor((t - startAt.current) / 100));
      const stars = starsFor(mistakes, total);
      setRunning(false);
      setTenths(time);
      setNext(n + 1);
      saveStars(GAME, level.id, stars);
      const best = saveBestTime(GAME, level.id, time);
      sound.win();
      sound.say(`All ${total}! Well done!`);
      setWon({ stars, time, ...best });
      return;
    }
    setNext(n + 1);
    sound.say(String(n + 1));
    // A little cheer every five in a row
    if (n % 5 === 0) setCheer({ id: nextId(), text: pick(CHEERS) });
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="num-grid num-grid-mini mb-5 w-40" style={{ "--cols": 3 }} aria-hidden>
              {[7, 1, 5, 3, 9, 2, 6, 8, 4].map((n, i) => (
                <NumTile key={n} n={n} paint={PAINTS[i % PAINTS.length]} open={n <= 3 || n === 9} done={n <= 3} />
              ))}
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Number Hunt</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Look at the numbers, then the tiles flip over. Flip them back in order: 1, 2, 3…</p>
          </header>

          <section aria-labelledby="level-heading">
            <StepHeading id="level-heading">Pick a grid</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<GridPreview size={l.size} />}
                  name={l.name}
                  detail={bestTimes[l.id] != null ? `${l.detail} · Best ${fmt(bestTimes[l.id])}s` : l.detail}
                  stars={bestStars[l.id] || 0}
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
  const total = order.length;
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        right={<SoundButton />}
      />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 pb-2">
        {/* Next number · time */}
        <div className="flex items-center justify-between gap-3">
          <div className="score-plaque" role="status" aria-label={next > total ? "All done" : `Find ${next}`}>
            <span className="score-plaque-label">Find</span>
            <span key={next} className="score-plaque-num">
              {next > total ? "✓" : next}
            </span>
          </div>
          <p className="engraved flex-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
            {won
              ? "You did it!"
              : look != null
                ? `Remember where they are! ${look}…`
                : peek != null
                ? `That's ${peek}. Remember it!`
                : next === 1
                  ? "Flip a tile to find 1!"
                  : `Now find ${next}!`}
          </p>
          <div className="score-plaque" role="timer" aria-label={`${fmt(tenths)} seconds`}>
            <span className="score-plaque-label">Time</span>
            <span className="score-plaque-num tabular-nums">{fmt(tenths)}</span>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div key={`${level.id}-${order.join(",")}`} className="num-board w-full">
            <div className="num-grid" style={{ "--cols": level.size }}>
              {order.map((n, i) => {
                const done = n < next;
                const open = done || peek === n || !!won || look != null;
                return (
                  <NumTile
                    key={n}
                    as="button"
                    n={n}
                    // colour by position, not number, so a colour never gives a number away
                    paint={PAINTS[i % PAINTS.length]}
                    open={open}
                    done={done}
                    peek={peek === n}
                    onClick={() => tap(n)}
                    className={`deal-in ${nope?.n === n ? "nope-pulse" : ""}`}
                    style={{ "--i": i }}
                    data-n={n}
                    aria-label={open ? `${n}${done ? ", found" : ""}` : "Closed tile"}
                    aria-disabled={done}
                  />
                );
              })}
            </div>
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
        </div>

        {/* Room for the "ready" button, kept so the grid doesn't jump when it goes */}
        <div className="flex min-h-14 items-center justify-center">
          {look != null && (
            <button onClick={closeTiles} className="btn btn-orange sheet-pop px-10">
              I&apos;m ready!
            </button>
          )}
        </div>
      </div>

      {won && (
        <WinSheet
          stars={won.stars}
          summary={`All ${total} in ${fmt(won.time)} seconds!`}
          detail={
            won.isNew && !won.first
              ? `New best time! ${mistakes === 0 ? "No wrong taps." : ""}`
              : `${mistakes === 0 ? "No wrong taps!" : `${mistakes} wrong tap${mistakes > 1 ? "s" : ""}`} · Best ${fmt(won.best)}s`
          }
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
