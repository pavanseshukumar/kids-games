"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon } from "@/components/icons";
import { COLOURS, ItemArt, SHAPES, makeItem } from "../colours/art";
import { BlockPreview, NumberBlock } from "./art";

const GAME = "counting";
const QUESTIONS = 6;

const LEVELS = [
  { id: "easy", name: "Easy", min: 1, max: 5 },
  { id: "medium", name: "Medium", min: 3, max: 10 },
  { id: "hard", name: "Big", min: 6, max: 15 },
];

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen"];
const BLOCK_PAINTS = ["red", "blue", "green"];
const CHEERS = ["Yes!", "Great counting!", "You got it!", "Super!", "Brilliant!"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Two wrong answers close to the right one (kids learn most from near misses). */
function choicesFor(n, level) {
  const near = [n - 1, n + 1, n - 2, n + 2].filter((v) => v >= 1 && v <= level.max + 2);
  const wrong = shuffle(near.slice(0, 3)).slice(0, 2);
  return shuffle([n, ...wrong]);
}

/** Six questions: different amounts (no repeat back-to-back), different things, random colours. */
function makeRound(level) {
  const range = Array.from({ length: level.max - level.min + 1 }, (_, i) => level.min + i);
  let counts = shuffle(range).slice(0, QUESTIONS);
  while (counts.length < QUESTIONS) {
    const last = counts[counts.length - 1];
    counts.push(pick(range.filter((v) => v !== last)));
  }
  const shapes = shuffle(SHAPES.map((s) => s.id));
  const colours = Object.keys(COLOURS);
  return counts.map((n, i) => ({
    n,
    item: makeItem(shapes[i], pick(colours)),
    choices: choicesFor(n, level),
    // gentle tilt on each thing so the mat looks hand-arranged
    tilts: Array.from({ length: n }, () => Math.round((Math.random() - 0.5) * 16)),
    paints: shuffle(BLOCK_PAINTS),
  }));
}

function starsFor(mistakes) {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

export default function CountingGame() {
  const [levelId, setLevelId] = useState(null);
  const [round, setRound] = useState(null);
  const [q, setQ] = useState(0);
  const [order, setOrder] = useState([]); // indexes of things in the order they were counted
  const [phase, setPhase] = useState("ask"); // ask | counting (game counts along) | right | won
  const [mistakes, setMistakes] = useState(0);
  const [hint, setHint] = useState(false);
  const [nope, setNope] = useState(null); // { value, id }
  const [hop, setHop] = useState(null); // { index, id } — a counted thing tapped again
  const [cheer, setCheer] = useState(null);

  const best = useBestStars(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
  const timers = useRef([]);
  const ids = useRef(0);
  const nextId = () => ++ids.current; // unique keys to replay animations

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const resetQuestion = () => {
    setOrder([]);
    setHint(false);
    setNope(null);
    setHop(null);
    setPhase("ask");
  };

  const start = useCallback((lvlId) => {
    clearTimers();
    setLevelId(lvlId);
    setRound(makeRound(LEVELS.find((l) => l.id === lvlId)));
    setQ(0);
    setMistakes(0);
    setCheer(null);
    resetQuestion();
    sound.pop();
  }, []);

  const backToMenu = () => {
    clearTimers();
    setLevelId(null);
    setRound(null);
  };

  const question = round?.[q];

  /* Child taps a thing to count it. */
  const countThing = (i) => {
    if (phase !== "ask") return;
    const at = order.indexOf(i);
    if (at >= 0) {
      // Already counted: hop and repeat its number.
      setHop({ index: i, id: nextId() });
      sound.say(WORDS[at + 1]);
      return;
    }
    const next = [...order, i];
    setOrder(next);
    sound.pop();
    sound.say(WORDS[next.length]);
  };

  /* Child picks a number block. */
  const choose = (value) => {
    if (phase !== "ask") return;
    const n = question.n;
    if (value === n) {
      setPhase("right");
      setHint(false);
      setOrder(Array.from({ length: n }, (_, i) => i)); // show every number sticker
      sound.match();
      sound.say(WORDS[n]);
      setCheer({ id: nextId(), text: pick(CHEERS) });
      later(() => {
        if (q + 1 >= round.length) {
          saveStars(GAME, level.id, starsFor(mistakes));
          sound.win();
          setPhase("won");
        } else {
          setQ(q + 1);
          resetQuestion();
          sound.pop();
        }
      }, 1700);
    } else {
      sound.miss();
      setMistakes((m) => m + 1);
      setNope({ value, id: nextId() });
      setPhase("counting");
      setOrder([]);
      // Count along together, one thing at a time, then light up the right block.
      later(() => sound.say("Let's count!"), 350);
      for (let i = 0; i < n; i++) {
        later(() => {
          setOrder(Array.from({ length: i + 1 }, (_, k) => k));
          sound.pop();
          sound.say(WORDS[i + 1]);
        }, 1300 + i * 700);
      }
      later(() => {
        setHint(true);
        setPhase("ask");
      }, 1300 + n * 700);
    }
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-end" aria-hidden>
              <span className="w-16 -rotate-6">
                <NumberBlock value={1} paint="red" />
              </span>
              <span className="-mx-1 mb-3 w-20">
                <NumberBlock value={2} paint="blue" />
              </span>
              <span className="w-16 rotate-6">
                <NumberBlock value={3} paint="green" />
              </span>
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Counting</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Count the things, then pick the number!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick how far to count</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<BlockPreview max={l.max} />}
                  name={l.name}
                  detail={`Up to ${l.max}`}
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
  const { n, item, choices, tilts, paints } = question || round[round.length - 1];
  const rows = Math.ceil(level.max / 5);
  const counted = order.length;
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];
  const thingName = `${COLOURS[item.colour].name.toLowerCase()} ${item.name}`;

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={round.length} done={phase === "right" || phase === "won" ? q + 1 : q} label={`Question ${q + 1} of ${round.length}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {phase === "counting"
          ? "Let's count together!"
          : phase === "right"
            ? `Yes, ${n}!`
            : hint
              ? "Now tap the number!"
              : counted
                ? "Keep counting, then pick a number!"
                : "How many? Tap each one to count!"}
      </p>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 py-3">
        {/* Running total on a little wooden plaque */}
        <div className="count-plaque" data-show={counted > 0} aria-live="polite" aria-label={`Counted ${counted}`}>
          <span key={counted} className="count-plaque-num">
            {counted}
          </span>
        </div>

        {/* The things to count, in rows of five like a counting frame */}
        <div key={q} className="felt w-full max-w-xl px-3 py-4 sm:px-6 sm:py-6" data-count={n}>
          <div className="count-grid" style={{ minHeight: `calc(${rows} * var(--thing) + ${rows - 1} * 0.5rem)` }}>
            {Array.from({ length: n }, (_, i) => {
              const at = order.indexOf(i);
              return (
                <button
                  key={i}
                  onClick={() => countThing(i)}
                  className="count-thing"
                  style={{ "--i": i, "--tilt": `${tilts[i]}deg` }}
                  data-counted={at >= 0}
                  data-cheer={phase === "right"}
                  aria-label={at >= 0 ? `${thingName}, number ${at + 1}` : `${thingName}, not counted yet`}
                >
                  <span key={hop?.index === i ? hop.id : "rest"} className={`count-thing-art ${hop?.index === i ? "count-hop" : ""}`}>
                    <ItemArt item={item} className="h-full w-full" />
                  </span>
                  {at >= 0 && <span className="count-badge">{at + 1}</span>}
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

      {/* Number blocks in the thumb zone */}
      <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-4 pb-2 sm:gap-6">
        {choices.map((v, i) => (
          <button
            key={`${q}-${v}`}
            onClick={() => choose(v)}
            className="num-block"
            data-value={v}
            data-hint={hint && v === n}
            data-right={phase === "right" && v === n}
            data-dim={phase === "right" && v !== n}
            aria-label={`${v}`}
            disabled={phase === "counting"}
          >
            <span key={nope?.value === v ? nope.id : "still"} className={`block ${nope?.value === v ? "nope-shake" : ""}`}>
              <NumberBlock value={v} paint={paints[i]} />
            </span>
          </button>
        ))}
      </div>

      {phase === "won" && (
        <WinSheet
          stars={starsFor(mistakes)}
          summary={`You counted all ${round.length}!`}
          detail={mistakes === 0 ? "Perfect counting!" : `${level.name} · ${mistakes} mix-up${mistakes > 1 ? "s" : ""}`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
