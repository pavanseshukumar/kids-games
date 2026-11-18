"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { sound } from "@/lib/sound";
import { AppBar, CheckSticker, HomeButton, SoundButton, Stars } from "@/components/ui";
import { ArrowIcon, BackIcon, PlayIcon, ReplayIcon } from "@/components/icons";
import { CARD_SETS, CardArt, CardBack, CardFan, MatchSticker } from "./art";

const LEVELS = [
  { id: "easy", name: "Easy", pairs: 3, cols: 3, rows: 2, peek: 1600 },
  { id: "medium", name: "Medium", pairs: 6, cols: 3, rows: 4, peek: 1500 },
  { id: "hard", name: "Big", pairs: 8, cols: 4, rows: 4, peek: 1300 },
];

const CHEERS = ["Great!", "Awesome!", "Super!", "Amazing!", "Wow!"];
const CONFETTI_COLORS = ["#E5483B", "#F59A2E", "#F8C630", "#3FB35F", "#3A8DE6", "#F2709C"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(set, level) {
  const faces = shuffle(Object.keys(set.art)).slice(0, level.pairs);
  return shuffle([...faces, ...faces]).map((face, i) => ({ key: `${i}-${face}`, face }));
}

function starsFor(moves, pairs) {
  if (moves <= Math.ceil(pairs * 1.5) + 1) return 3;
  if (moves <= Math.ceil(pairs * 2.5)) return 2;
  return 1;
}

// Best stars per level, kept in this browser only.
const BEST_KEY = "memory-best";
const bestListeners = new Set();
function subscribeBest(fn) {
  bestListeners.add(fn);
  return () => bestListeners.delete(fn);
}
function readBestRaw() {
  try {
    return localStorage.getItem(BEST_KEY) || "{}";
  } catch {
    return "{}";
  }
}
function parseBest(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function saveStars(levelId, stars) {
  const prev = parseBest(readBestRaw());
  if ((prev[levelId] || 0) >= stars) return;
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify({ ...prev, [levelId]: stars }));
  } catch {}
  bestListeners.forEach((fn) => fn());
}

export default function MemoryGame() {
  const [setId, setSetId] = useState(CARD_SETS[0].id);
  const [levelId, setLevelId] = useState(null); // null = picker screen
  const [deck, setDeck] = useState([]);
  const [round, setRound] = useState(0);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(() => new Set());
  const [wrong, setWrong] = useState([]);
  const [moves, setMoves] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | peek | play | won
  const [cheer, setCheer] = useState(null);
  const [confetti, setConfetti] = useState([]);

  const bestRaw = useSyncExternalStore(subscribeBest, readBestRaw, () => "{}");
  const best = useMemo(() => parseBest(bestRaw), [bestRaw]);

  const lock = useRef(false);
  const streak = useRef(0);
  const timers = useRef([]);

  const cardSet = CARD_SETS.find((s) => s.id === setId);
  const level = LEVELS.find((l) => l.id === levelId);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const start = useCallback(
    (lvlId) => {
      clearTimers();
      const lvl = LEVELS.find((l) => l.id === lvlId);
      setLevelId(lvlId);
      setDeck(makeDeck(CARD_SETS.find((s) => s.id === setId), lvl));
      setRound((r) => r + 1);
      setFlipped([]);
      setMatched(new Set());
      setWrong([]);
      setMoves(0);
      setCheer(null);
      setConfetti([]);
      streak.current = 0;
      lock.current = true;
      // Deal the cards in, then show them all for a quick peek.
      setPhase("idle");
      const dealTime = 450 + lvl.pairs * 2 * 45;
      later(() => setPhase("peek"), dealTime);
      later(() => {
        setPhase("play");
        lock.current = false;
      }, dealTime + lvl.peek);
    },
    [setId, later]
  );

  const backToPicker = () => {
    clearTimers();
    setLevelId(null);
    setPhase("idle");
  };

  const win = useCallback(
    (finalMoves) => {
      saveStars(level.id, starsFor(finalMoves, level.pairs));
      setConfetti(
        Array.from({ length: 50 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          dx: (Math.random() - 0.5) * 220,
          rot: (Math.random() - 0.5) * 1080,
          dur: 2.4 + Math.random() * 1.6,
          delay: Math.random() * 0.5,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        }))
      );
      sound.win();
      setPhase("won");
    },
    [level]
  );

  const flip = (i) => {
    if (lock.current || phase !== "play") return;
    if (flipped.includes(i) || matched.has(i)) return;

    sound.flip();
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length < 2) return;

    lock.current = true;
    const newMoves = moves + 1;
    setMoves(newMoves);
    const [a, b] = next;

    if (deck[a].face === deck[b].face) {
      later(() => {
        const m = new Set(matched);
        m.add(a).add(b);
        setMatched(m);
        setFlipped([]);
        sound.match();
        streak.current += 1;
        if (streak.current >= 2) {
          setCheer({ id: Date.now(), text: CHEERS[(streak.current - 2) % CHEERS.length] });
        }
        lock.current = false;
        if (m.size === deck.length) later(() => win(newMoves), 650);
      }, 380);
    } else {
      streak.current = 0;
      later(() => {
        setWrong(next);
        sound.miss();
      }, 450);
      later(() => {
        setWrong([]);
        setFlipped([]);
        lock.current = false;
      }, 1000);
    }
  };

  /* ---------------- Picker screen ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-7 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="text-center">
            <h1 className="toy-title text-5xl sm:text-6xl">Memory</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Flip the cards. Find the pairs!</p>
          </header>

          <section aria-labelledby="sets-heading">
            <h2 id="sets-heading" className="engraved label mb-3 flex items-center justify-center gap-2">
              <StepDot n={1} /> Pick your cards
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {CARD_SETS.map((s) => {
                const on = s.id === setId;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.tap();
                      setSetId(s.id);
                    }}
                    aria-pressed={on}
                    className="tile flex-col items-center gap-1 px-1.5 pt-2 pb-2.5 sm:gap-2 sm:px-3 sm:pt-4 sm:pb-4"
                  >
                    {on && <CheckSticker />}
                    <span className="block aspect-[5/4] w-full">
                      <CardFan set={s} />
                    </span>
                    <span className="printed text-lg font-semibold sm:text-2xl">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="size-heading">
            <h2 id="size-heading" className="engraved label mb-3 flex items-center justify-center gap-2">
              <StepDot n={2} /> Pick a size to play
            </h2>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  data-level={l.id}
                  onClick={() => {
                    sound.tap();
                    start(l.id);
                  }}
                  className="tile items-center gap-4 px-4 py-3 text-left sm:flex-col sm:gap-2 sm:px-4 sm:py-5 sm:text-center"
                >
                  <BoardPreview cols={l.cols} rows={l.rows} />
                  <span className="flex min-w-0 flex-1 flex-col sm:items-center">
                    <span className="printed text-2xl font-semibold">{l.name}</span>
                    <span className="printed-soft text-base">{l.pairs * 2} cards</span>
                    <span className="mt-1">
                      <Stars count={best[l.id] || 0} size={22} />
                    </span>
                  </span>
                  <span className="play-badge sm:hidden" aria-hidden>
                    <PlayIcon />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* ---------------- Game board ---------------- */
  const showAll = phase === "peek";
  const found = matched.size / 2;
  const stars = starsFor(moves, level.pairs);
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToPicker} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={
          <div className="rail" role="status" aria-label={`${found} of ${level.pairs} pairs found`}>
            {Array.from({ length: level.pairs }, (_, i) => (
              <span key={i} className="hole" data-on={i < found} />
            ))}
          </div>
        }
        right={<SoundButton />}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center">
        <p className="status engraved mb-2 h-8 text-center text-xl font-semibold" data-show={showAll} aria-live="polite">
          {showAll ? "Look closely..." : ""}
        </p>

        <div className="felt w-full p-3.5 sm:p-5" style={{ maxWidth: `min(100%, ${level.cols * 9.5 + 3}rem)` }}>
          <div
            key={round}
            className="mx-auto grid gap-2.5 sm:gap-3.5"
            style={{
              gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
              maxWidth: `min(100%, calc((100dvh - 12rem - env(safe-area-inset-top) - env(safe-area-inset-bottom)) * ${level.cols} / ${level.rows}))`,
            }}
          >
            {deck.map((card, i) => {
              const isMatched = matched.has(i);
              const isUp = showAll || isMatched || flipped.includes(i);
              return (
                <button
                  key={card.key}
                  onClick={() => flip(i)}
                  className="mem-card deal-in aspect-square"
                  style={{ "--i": i }}
                  data-face={card.face}
                  data-flipped={isUp}
                  data-matched={isMatched}
                  data-wrong={wrong.includes(i)}
                  aria-label={isUp ? `Card ${i + 1}: ${card.face}` : `Card ${i + 1}, face down`}
                  disabled={isMatched}
                >
                  <span className="mem-card-inner">
                    <span className="mem-face mem-back">
                      <CardBack />
                    </span>
                    <span className="mem-face mem-front">
                      <CardArt set={cardSet} name={card.face} />
                      {isMatched && <MatchSticker />}
                    </span>
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

      {phase === "won" && (
        <div className="scrim fixed inset-0 z-20 flex items-end justify-center sm:items-center sm:p-4">
          <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
            {confetti.map((c) => (
              <span
                key={c.id}
                className="confetti"
                style={{
                  left: `${c.left}%`,
                  background: c.color,
                  "--dx": `${c.dx}px`,
                  "--rot": `${c.rot}deg`,
                  "--dur": `${c.dur}s`,
                  "--delay": `${c.delay}s`,
                }}
              />
            ))}
          </div>
          <div role="dialog" aria-modal="true" aria-labelledby="win-title" className="paper sheet relative text-center">
            <span className="sheet-handle" aria-hidden />
            <div className="isolate inline-block">
              <h2 id="win-title" className="ribbon text-3xl sm:text-4xl">
                You did it!
              </h2>
            </div>
            <div className="my-5 flex justify-center">
              <Stars count={stars} size={68} animate />
            </div>
            <p className="printed text-xl font-medium">
              All {level.pairs} pairs in {moves} tries
            </p>
            <p className="printed-soft mt-1 text-base">
              {level.name} · {cardSet.name}
            </p>
            <div className="mt-6 flex flex-col gap-4">
              {nextLevel ? (
                <>
                  <button onClick={() => start(nextLevel.id)} className="btn w-full" autoFocus>
                    Try {nextLevel.name} <ArrowIcon />
                  </button>
                  <button onClick={() => start(level.id)} className="btn btn-cream w-full">
                    <ReplayIcon /> Play again
                  </button>
                </>
              ) : (
                <button onClick={() => start(level.id)} className="btn w-full" autoFocus>
                  <ReplayIcon /> Play again
                </button>
              )}
              <button
                onClick={backToPicker}
                className="printed-soft min-h-12 text-lg font-semibold underline decoration-2 underline-offset-4"
              >
                Choose other cards
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StepDot({ n }) {
  return (
    <span
      className="grid size-6 place-items-center rounded-full text-sm text-white"
      style={{
        background: "radial-gradient(circle at 40% 30%, #ff8c7e, #e5483b 65%)",
        boxShadow: "0 2px 0 #a42c22, inset 0 1px 1px rgba(255,255,255,.6)",
        textShadow: "0 1px 0 rgba(0,0,0,.3)",
      }}
      aria-hidden
    >
      {n}
    </span>
  );
}

/**
 * Tiny felt mat with the level's cards laid out on it, so kids can see
 * how big the game is. Cards shrink to fit; the mat always keeps its padding.
 */
function BoardPreview({ cols, rows }) {
  const box = 64;
  const inner = 44; // card area inside the stitched border
  const gap = 2.5;
  const n = Math.max(cols, rows);
  const cell = (inner - gap * (n - 1)) / n;
  const ox = (box - (cols * cell + (cols - 1) * gap)) / 2;
  const oy = (box - (rows * cell + (rows - 1) * gap)) / 2;
  return (
    <svg width="60" height="60" viewBox={`0 0 ${box} ${box}`} aria-hidden className="shrink-0 drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]">
      <defs>
        <radialGradient id="pv-felt" cx="50%" cy="35%" r="75%">
          <stop offset="0" stopColor="#35915A" />
          <stop offset="1" stopColor="#1D5E38" />
        </radialGradient>
        <linearGradient id="pv-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EA5F53" />
          <stop offset="1" stopColor="#B42E27" />
        </linearGradient>
      </defs>
      <rect width={box} height={box} rx="12" fill="url(#pv-felt)" />
      <rect x="4" y="4" width={box - 8} height={box - 8} rx="9" fill="none" stroke="#FFF6D2" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="2.5 2" />
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = ox + (i % cols) * (cell + gap);
        const y = oy + Math.floor(i / cols) * (cell + gap);
        return (
          <g key={i}>
            <rect x={x} y={y + 0.8} width={cell} height={cell} rx={cell * 0.22} fill="#0F3A22" opacity="0.45" />
            <rect x={x} y={y} width={cell} height={cell} rx={cell * 0.22} fill="#FFFAF0" />
            <rect
              x={x + cell * 0.14}
              y={y + cell * 0.14}
              width={cell * 0.72}
              height={cell * 0.72}
              rx={cell * 0.14}
              fill="url(#pv-card)"
            />
          </g>
        );
      })}
    </svg>
  );
}
