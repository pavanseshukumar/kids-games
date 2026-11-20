"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveBestTime, saveStars, useBestStars, useBestTimes } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon } from "@/components/icons";

const GAME = "numbers";
const HINT_AFTER = 5000; // ms without the right tap before the next number glows

const LEVELS = [
  { id: "3", size: 3, name: "Small", detail: "3 × 3 · 1 to 9" },
  { id: "4", size: 4, name: "Medium", detail: "4 × 4 · 1 to 16" },
  { id: "5", size: 5, name: "Big", detail: "5 × 5 · 1 to 25" },
];

// Tile colours cycle so neighbouring numbers don't all look the same.
const PAINTS = ["red", "blue", "green", "yellow", "orange", "purple"];
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
  const [hint, setHint] = useState(false);
  const [tenths, setTenths] = useState(0);
  const [running, setRunning] = useState(false);
  const [cheer, setCheer] = useState(null);
  const [won, setWon] = useState(null); // { stars, time, best, isNew, first }

  const bestStars = useBestStars(GAME);
  const bestTimes = useBestTimes(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
  const startAt = useRef(0);
  const lastTap = useRef(0);
  const ids = useRef(0);
  const nextId = () => ++ids.current;

  useEffect(() => () => sound.say(""), []);

  /* Stopwatch (starts on the first right tap) plus the "you're stuck" glow. */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTenths(Math.floor((now() - startAt.current) / 100));
      if (now() - lastTap.current > HINT_AFTER) setHint(true);
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback((lvlId) => {
    const lvl = LEVELS.find((l) => l.id === lvlId);
    setLevelId(lvlId);
    setOrder(shuffle(Array.from({ length: lvl.size * lvl.size }, (_, i) => i + 1)));
    setNext(1);
    setMistakes(0);
    setNope(null);
    setHint(false);
    setTenths(0);
    setRunning(false);
    setCheer(null);
    setWon(null);
    sound.shuffle();
    sound.say("Find number one!");
  }, []);

  const backToMenu = () => {
    sound.say("");
    setRunning(false);
    setLevelId(null);
  };

  const tap = (n) => {
    if (won || n < next) return;
    if (n !== next) {
      setMistakes((m) => m + 1);
      setNope({ n, id: nextId() });
      sound.boing();
      return;
    }
    const t = now();
    if (n === 1) {
      startAt.current = t;
      setRunning(true);
    }
    lastTap.current = t;
    setHint(false);
    sound.pop();
    const total = order.length;
    if (n === total) {
      const time = Math.max(1, Math.floor((t - startAt.current) / 100));
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
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
                <span key={n} className="num-tile" data-paint={PAINTS[i % PAINTS.length]} data-done={n <= 3}>
                  <span className="num-tile-face">{n}</span>
                </span>
              ))}
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Number Hunt</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">The numbers are all mixed up. Tap them in order: 1, 2, 3…</p>
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
            {won ? "You did it!" : next === 1 ? "Tap 1 to start the clock!" : hint ? `Where's ${next}? Look for the glow!` : `Now find ${next}!`}
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
                return (
                  <button
                    key={n}
                    onClick={() => tap(n)}
                    className="num-tile deal-in"
                    style={{ "--i": i }}
                    data-paint={PAINTS[(n - 1) % PAINTS.length]}
                    data-done={done}
                    data-hint={hint && n === next && !won}
                    data-n={n}
                    aria-label={done ? `${n}, found` : `${n}`}
                    aria-disabled={done}
                  >
                    <span key={nope?.n === n ? nope.id : "still"} className={`num-tile-face ${nope?.n === n ? "nope-shake" : ""}`}>
                      {n}
                    </span>
                  </button>
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
