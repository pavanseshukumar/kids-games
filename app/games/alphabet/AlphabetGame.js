"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveBestScore, useBestScores } from "@/lib/progress";
import { AppBar, CheckSticker, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, ScoreSheet, StepHeading } from "@/components/game-ui";
import { ArrowIcon, BackIcon } from "@/components/icons";
import { NumberBlock } from "../counting/art";
import { CATEGORIES, CategoryArt, LettersPreview } from "./art";

const GAME = "alphabet";
const SECONDS = 30;

const LEVELS = [
  { id: "quick", name: "Quick", rounds: 1, detail: "1 letter", preview: ["B"] },
  { id: "speedy", name: "Speedy", rounds: 3, detail: "3 letters", preview: ["C", "M", "P"] },
  { id: "super", name: "Super", rounds: 5, detail: "5 letters", preview: ["A", "D", "K", "S", "T"] },
];

// Ideas shown (and read out) after each letter: [animal, fruit, place, object].
// X is left out: there's no fair fruit or place for little ones.
const IDEAS = {
  A: ["Ant", "Apple", "Agra", "Anchor"],
  B: ["Bear", "Banana", "Bengaluru", "Bottle"],
  C: ["Cat", "Cherry", "Chennai", "Cup"],
  D: ["Dog", "Dates", "Delhi", "Drum"],
  E: ["Elephant", "Elderberry", "Egypt", "Envelope"],
  F: ["Fox", "Fig", "France", "Fan"],
  G: ["Giraffe", "Grapes", "Goa", "Glass"],
  H: ["Horse", "Honeydew melon", "Hyderabad", "Hat"],
  I: ["Iguana", "Ice apple", "Indore", "Iron"],
  J: ["Jaguar", "Jackfruit", "Jaipur", "Jug"],
  K: ["Kangaroo", "Kiwi", "Kolkata", "Kite"],
  L: ["Lion", "Lemon", "Lucknow", "Lamp"],
  M: ["Monkey", "Mango", "Mumbai", "Mirror"],
  N: ["Newt", "Nectarine", "Nagpur", "Needle"],
  O: ["Owl", "Orange", "Ooty", "Oven"],
  P: ["Parrot", "Papaya", "Pune", "Pencil"],
  Q: ["Quail", "Quince", "Qatar", "Quilt"],
  R: ["Rabbit", "Raspberry", "Ranchi", "Ruler"],
  S: ["Snake", "Strawberry", "Shimla", "Spoon"],
  T: ["Tiger", "Tangerine", "Tokyo", "Table"],
  U: ["Umbrellabird", "Ugli fruit", "Udaipur", "Umbrella"],
  V: ["Vulture", "Victoria plum", "Varanasi", "Violin"],
  W: ["Whale", "Watermelon", "Washington", "Watch"],
  Y: ["Yak", "Yuzu", "Yercaud", "Yo-yo"],
  Z: ["Zebra", "Zucchini", "Zurich", "Zip"],
};
const LETTERS = Object.keys(IDEAS);
const PAINTS = ["red", "blue", "green", "yellow"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function AlphabetGame() {
  const [levelId, setLevelId] = useState(null);
  const [letters, setLetters] = useState([]);
  const [r, setR] = useState(0); // round
  const [phase, setPhase] = useState("spin"); // spin | count | play | result | done
  const [shown, setShown] = useState("A"); // letter on the block (flicks during the spin)
  const [count, setCount] = useState(3);
  const [left, setLeft] = useState(SECONDS);
  const [marks, setMarks] = useState([]); // categories answered this round
  const [scores, setScores] = useState([]); // points from finished rounds
  const [ended, setEnded] = useState(null); // how the round ended: time | done | all
  const [result, setResult] = useState(null); // { score, best, isNew }

  const bestScores = useBestScores(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
  const timers = useRef([]);
  const endAt = useRef(0);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(
    () => () => {
      clearTimers();
      sound.say("");
    },
    []
  );

  /* Flick through letters like a spinning wheel, land on the round's letter, then 3-2-1-Go. */
  const startRound = useCallback(
    (i, lets) => {
      clearTimers();
      const L = lets[i];
      setR(i);
      setMarks([]);
      setEnded(null);
      setLeft(SECONDS);
      setPhase("spin");
      const steps = 14;
      for (let s = 0; s < steps; s++) {
        later(() => {
          setShown(pick(LETTERS.filter((x) => x !== L)));
          sound.shuffle();
        }, s * (60 + s * 6));
      }
      const landed = steps * (60 + steps * 6);
      later(() => {
        setShown(L);
        setPhase("count");
        setCount(3);
        sound.clunk();
        sound.say(`${L}!`);
      }, landed);
      [3, 2, 1].forEach((n, k) =>
        later(() => {
          setCount(n);
          sound.tap();
          if (k > 0) sound.say(String(n));
        }, landed + 1100 + k * 800)
      );
      later(() => {
        sound.go();
        sound.say("Go!");
        endAt.current = Date.now() + SECONDS * 1000;
        setLeft(SECONDS);
        setPhase("play");
      }, landed + 1100 + 3 * 800);
    },
    [later]
  );

  const start = useCallback(
    (lvlId) => {
      const lvl = LEVELS.find((l) => l.id === lvlId);
      const lets = shuffle(LETTERS).slice(0, lvl.rounds);
      setLevelId(lvlId);
      setLetters(lets);
      setScores([]);
      setResult(null);
      startRound(0, lets);
    },
    [startRound]
  );

  const backToMenu = () => {
    clearTimers();
    sound.say("");
    setLevelId(null);
    setPhase("spin");
  };

  const letter = letters[r];

  const endRound = useCallback(
    (how) => {
      const byTime = how === "time";
      setEnded(how);
      setPhase("result");
      if (byTime) sound.timeUp();
      const [a, f, p, o] = IDEAS[letter];
      later(() => sound.say(`${letter} is for ${a}, ${f}, ${p}, and ${o}!`), byTime ? 800 : 500);
    },
    [letter, later]
  );

  /* The 30-second clock, with ticks for the last five seconds. */
  useEffect(() => {
    if (phase !== "play") return;
    let last = SECONDS;
    const id = setInterval(() => {
      const rem = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      if (rem !== last) {
        last = rem;
        setLeft(rem);
        if (rem > 0 && rem <= 5) sound.tick();
        if (rem === 0) endRound("time");
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, endRound]);

  const toggle = (id) => {
    if (phase !== "play" && phase !== "result") return;
    if (marks.includes(id)) {
      setMarks(marks.filter((m) => m !== id));
      sound.flip();
      return;
    }
    const next = [...marks, id];
    setMarks(next);
    sound.pop();
    if (phase === "play" && next.length === CATEGORIES.length) {
      // All four before the bell: stop the clock and celebrate.
      sound.match();
      endRound("all");
    }
  };

  const next = () => {
    clearTimers();
    const done = [...scores, marks.length];
    setScores(done);
    if (r + 1 < letters.length) {
      startRound(r + 1, letters);
      return;
    }
    const total = done.reduce((s, v) => s + v, 0);
    const { best, isNew } = saveBestScore(GAME, level.id, total);
    sound.say("");
    if (isNew) sound.win();
    setResult({ score: total, best, isNew });
    setPhase("done");
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
                <NumberBlock value="A" paint="red" />
              </span>
              <span className="-mx-1 mb-3 w-20">
                <NumberBlock value="B" paint="blue" />
              </span>
              <span className="w-16 rotate-6">
                <NumberBlock value="C" paint="green" />
              </span>
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Alphabet Speed</h1>
            <p className="engraved mt-3 max-w-md text-lg sm:text-xl">
              Name an animal, a fruit, a place and an object that start with the letter. You have 30 seconds!
            </p>
          </header>

          <section aria-labelledby="level-heading">
            <StepHeading id="level-heading">Pick how many letters</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<LettersPreview letters={l.preview} />}
                  name={l.name}
                  detail={`${l.detail} · ${l.rounds * 4} points`}
                  bestScore={bestScores[l.id] || 0}
                  onClick={() => {
                    sound.tap();
                    start(l.id);
                  }}
                />
              ))}
            </div>
          </section>

          <p className="engraved mx-auto max-w-md text-center text-base opacity-90">
            Say your answers out loud. A grown-up can tap each one you get right!
          </p>
        </div>
      </main>
    );
  }

  /* ---------------- Play ---------------- */
  const points = scores.reduce((s, v) => s + v, 0) + marks.length;
  const live = phase === "play" || phase === "result";
  const lastRound = r + 1 >= letters.length;
  const low = phase === "play" && left <= 10;
  const paint = PAINTS[r % PAINTS.length];

  const status =
    phase === "spin"
      ? "Picking a letter…"
      : phase === "count"
        ? `Think of things that start with ${letter}!`
        : phase === "play"
          ? "Say them out loud! Tap each one you get."
          : ended === "all"
            ? "All four! Super speedy!"
            : ended === "done"
              ? `Finished! You got ${marks.length} of 4.`
              : `Time's up! You got ${marks.length} of 4.`;

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={
          letters.length > 1 ? (
            <ProgressRail
              total={letters.length}
              done={phase === "result" || phase === "done" ? r + 1 : r}
              label={`Letter ${r + 1} of ${letters.length}`}
            />
          ) : null
        }
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {status}
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 py-3 sm:gap-8">
        {/* Clock · letter · points */}
        <div className="flex w-full max-w-md items-center justify-between gap-2">
          <div className="score-plaque" data-low={low} role="timer" aria-label={`${left} seconds left`}>
            <span className="score-plaque-label">Time</span>
            <span key={left} className="score-plaque-num alpha-secs">
              {left}
            </span>
          </div>

          <div className="alpha-dial" data-phase={phase} data-low={low}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
              <circle cx="50" cy="50" r="45" className="alpha-dial-track" />
              <circle
                key={`${r}-${phase === "play" || phase === "result"}`}
                cx="50"
                cy="50"
                r="45"
                pathLength="100"
                className="alpha-dial-ring"
                style={{ "--secs": `${SECONDS}s` }}
              />
            </svg>
            <span key={phase === "spin" ? shown : `${r}-landed`} className={`alpha-letter ${phase === "spin" ? "" : "alpha-land"}`}>
              <NumberBlock value={shown} paint={paint} />
            </span>
            {phase === "count" && (
              <span key={count} className="alpha-count" aria-live="assertive">
                {count}
              </span>
            )}
          </div>

          <div className="score-plaque" role="status" aria-label={`${points} points`}>
            <span className="score-plaque-label">Points</span>
            <span key={points} className="score-plaque-num">
              {points}
            </span>
          </div>
        </div>

        {/* One card per category: tap when the child names one */}
        <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {CATEGORIES.map((c, i) => {
            const on = marks.includes(c.id);
            const idea = letter ? IDEAS[letter][i] : "";
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className="alpha-card tile flex-col items-center px-2 pt-3 pb-2.5"
                style={{ "--paint": c.paint }}
                data-cat={c.id}
                data-live={live}
                aria-pressed={on}
                disabled={!live}
                aria-label={`${c.name}${on ? ", got it" : ""}`}
              >
                <span className="alpha-card-art">
                  <CategoryArt id={c.id} />
                </span>
                <span className="printed text-xl font-semibold sm:text-2xl">{c.name}</span>
                <span className="alpha-card-foot printed-soft text-base">
                  {phase === "result" ? (
                    <span className="alpha-idea">
                      Like <b className="printed">{idea}</b>
                    </span>
                  ) : on ? (
                    "Got it!"
                  ) : (
                    `${letter && live ? `${letter}…` : ""}`
                  )}
                </span>
                {on && <CheckSticker />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto w-full max-w-md pb-1">
        {phase === "play" && (
          <button onClick={() => endRound("done")} className="btn btn-cream w-full">
            We&apos;re done!
          </button>
        )}
        {phase === "result" && (
          <>
            <p className="engraved mb-3 text-center text-base">Forgot to tap one? Tap it now.</p>
            <button onClick={next} className="btn sheet-pop w-full" autoFocus>
              {lastRound ? "See my score" : "Next letter"} <ArrowIcon />
            </button>
          </>
        )}
      </div>

      {phase === "done" && result && (
        <ScoreSheet
          score={result.score}
          best={result.best}
          isNew={result.isNew}
          reason={letters.map((L, i) => (
            <span key={L} className="alpha-chip" title={`${L}: ${scores[i]} points`}>
              {L} <small>{scores[i]}</small>
            </span>
          ))}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
        />
      )}
    </main>
  );
}
