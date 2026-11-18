"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveBestScore, useBestScores } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ScoreSheet, StepHeading } from "@/components/game-ui";
import { BackIcon, PlayIcon } from "@/components/icons";
import { Balloon, SkyPreview } from "./art";

const GAME = "balloons";

// Endless: balloons keep coming and speed up over time.
// The game ends when a wrong balloon is popped or a right one floats away.
const LEVELS = [
  { id: "easy", name: "Easy", palette: 2, rule: "colour", every: 1100, dur: [6.4, 7.4], detail: "Two colours" },
  { id: "medium", name: "Medium", palette: 4, rule: "colour", every: 850, dur: [5.2, 6], detail: "More colours, faster" },
  { id: "hard", name: "Big", palette: 4, rule: "symbol", every: 800, dur: [4.8, 5.6], detail: "Find the symbol" },
];
const SPEED_STEP_S = 12; // speed goes up every 12 seconds
const SPEED_PER_STEP = 0.25;
const MAX_SPEED = 2.6;

const COLOURS = ["red", "blue", "yellow", "green", "purple", "orange"];
const SYMBOLS = ["star", "heart", "circle"];
const SYMBOL_WORDS = { star: "stars", heart: "hearts", circle: "circles" };
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a, b) => a + Math.random() * (b - a);

function makeSetup(level) {
  const palette = shuffle(COLOURS).slice(0, level.palette);
  if (level.rule === "colour") return { palette, target: { kind: "colour", value: palette[0] } };
  return { palette, target: { kind: "symbol", value: pick(SYMBOLS) } };
}

function ruleText(target) {
  return target.kind === "colour" ? `Pop the ${target.value} balloons!` : `Pop the balloons with ${SYMBOL_WORDS[target.value]}!`;
}

export default function BalloonsGame() {
  const [levelId, setLevelId] = useState(null);
  const [setup, setSetup] = useState(null); // { palette, target }
  const [phase, setPhase] = useState("ready"); // ready | play | oops (frozen) | over
  const [balloons, setBalloons] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [score, setScore] = useState(0);
  const [wobble, setWobble] = useState(null); // { id, n }
  const [culprit, setCulprit] = useState(null); // { balloon, why: "wrong" | "missed" } that ended the game
  const [result, setResult] = useState(null); // { best, isNew }
  const [cheer, setCheer] = useState(null);

  const bestScores = useBestScores(GAME);
  const level = LEVELS.find((l) => l.id === levelId);

  const stageRef = useRef(null);
  const ids = useRef(0);
  const nextId = () => ++ids.current;
  const lastX = useRef(50);
  const sinceTarget = useRef(0);
  const scoreRef = useRef(0);
  const startedAt = useRef(0);
  const tier = useRef(0);
  const timers = useRef([]);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const isTarget = (b) => (setup.target.kind === "colour" ? b.paint === setup.target.value : b.symbol === setup.target.value);

  /* Release balloons while playing, faster and faster. */
  useEffect(() => {
    if (phase !== "play" || !level || !setup) return;
    let timer;
    const speedNow = () => {
      const secs = (performance.now() - startedAt.current) / 1000;
      const step = Math.floor(secs / SPEED_STEP_S);
      if (step > tier.current) {
        tier.current = step;
        if (1 + (step - 1) * SPEED_PER_STEP < MAX_SPEED) {
          setCheer({ id: ++ids.current, text: "Faster!" });
          sound.match();
        }
      }
      return Math.min(MAX_SPEED, 1 + step * SPEED_PER_STEP);
    };
    const spawn = () => {
      const speed = speedNow();
      // About half are targets; never more than two non-targets in a row.
      const target = sinceTarget.current >= 2 || Math.random() < 0.48;
      sinceTarget.current = target ? 0 : sinceTarget.current + 1;
      const { palette, target: t } = setup;
      let paint;
      let symbol = null;
      if (t.kind === "colour") {
        paint = target ? t.value : pick(palette.filter((c) => c !== t.value));
      } else {
        paint = pick(palette);
        symbol = target ? t.value : pick(SYMBOLS.filter((s) => s !== t.value));
      }
      let x = rand(4, 78);
      for (let k = 0; k < 6 && Math.abs(x - lastX.current) < 18; k++) x = rand(4, 78);
      lastX.current = x;
      setBalloons((bs) => [
        ...bs,
        {
          id: ++ids.current,
          paint,
          symbol,
          x,
          dur: rand(...level.dur) / speed,
          sway: rand(8, 18) * (Math.random() < 0.5 ? -1 : 1),
          scale: rand(0.9, 1.08),
        },
      ]);
      timer = setTimeout(spawn, Math.max(420, level.every / speed));
    };
    spawn();
    return () => clearTimeout(timer);
  }, [phase, level, setup]);

  const start = useCallback((lvlId) => {
    clearTimers();
    const lvl = LEVELS.find((l) => l.id === lvlId);
    setLevelId(lvlId);
    setSetup(makeSetup(lvl));
    setPhase("ready");
    setBalloons([]);
    setBursts([]);
    setScore(0);
    scoreRef.current = 0;
    sinceTarget.current = 0;
    tier.current = 0;
    setWobble(null);
    setCulprit(null);
    setResult(null);
    setCheer(null);
  }, []);

  const go = () => {
    sound.tap(); // also unlocks audio on iOS (needs a user gesture)
    sound.say(ruleText(setup.target));
    startedAt.current = performance.now();
    setPhase("play");
  };

  const backToMenu = () => {
    clearTimers();
    setLevelId(null);
    setSetup(null);
    setBalloons([]);
  };

  const remove = (id) => setBalloons((bs) => bs.filter((b) => b.id !== id));

  /** Freeze the sky, show what happened, then the score sheet. */
  const endGame = (balloon, why) => {
    setCulprit({ balloon, why });
    setPhase("oops");
    setResult(saveBestScore(GAME, level.id, scoreRef.current));
    later(() => {
      sound.win();
      setPhase("over");
    }, 1300);
  };

  /** A balloon reached the top of the window. */
  const floatedAway = (b) => {
    if (phase === "play" && isTarget(b)) {
      // A balloon that should have been popped got away.
      sound.boing();
      sound.say("Oh no!");
      endGame(b, "missed");
    }
    remove(b.id);
  };

  const tapBalloon = (b) => (e) => {
    if (phase !== "play") return;
    if (isTarget(b)) {
      const stage = stageRef.current.getBoundingClientRect();
      const r = e.currentTarget.getBoundingClientRect();
      const burst = { id: nextId(), x: r.left - stage.left + r.width / 2, y: r.top - stage.top + r.width * 0.55, paint: b.paint };
      setBursts((bs) => [...bs, burst]);
      later(() => setBursts((bs) => bs.filter((x) => x.id !== burst.id)), 700);
      remove(b.id);
      sound.balloonPop();
      const n = scoreRef.current + 1;
      scoreRef.current = n;
      setScore(n);
      // Count aloud while numbers are small, then every fifth so it doesn't get chatty.
      if (n <= 10) sound.say(WORDS[n]);
      else if (n % 5 === 0) sound.say(String(n));
    } else {
      // Wrong balloon: show which one it was, then the score.
      sound.boing();
      sound.say("Oops!");
      setWobble({ id: b.id, n: nextId() });
      endGame(b, "wrong");
    }
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="mb-3 flex items-end gap-1" aria-hidden>
              {[
                ["red", null, "w-14 rotate-[-8deg]"],
                ["blue", "star", "w-16 -translate-y-3"],
                ["yellow", null, "w-14 rotate-[8deg]"],
              ].map(([p, s, cls]) => (
                <span key={p} className={`float ${cls}`}>
                  <Balloon paint={p} symbol={s} />
                </span>
              ))}
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Pop the Balloons</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Pop the right ones. Don&apos;t pop the wrong ones!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick a level</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={
                    <SkyPreview
                      balloons={
                        l.rule === "symbol"
                          ? [{ paint: "green", symbol: "heart" }, { paint: "red", symbol: "star" }, { paint: "blue", symbol: "star" }]
                          : l.palette === 2
                            ? [{ paint: "red" }, { paint: "blue" }, { paint: "red" }]
                            : [{ paint: "yellow" }, { paint: "purple" }, { paint: "green" }]
                      }
                    />
                  }
                  name={l.name}
                  detail={l.detail}
                  bestScore={bestScores[l.id] || 0}
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
  const { target } = setup;
  const example = target.kind === "colour" ? { paint: target.value } : { paint: "blue", symbol: target.value };

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={
          <div className="score-plaque" role="status" aria-label={`Score ${score}`}>
            <span className="score-plaque-label">Score</span>
            <span key={score} className="score-plaque-num">
              {score}
            </span>
          </div>
        }
        right={<SoundButton />}
      />

      {/* The rule, always visible: picture first, words second */}
      <div className="flex justify-center pt-1 pb-3">
        <div className="paper rule-card">
          <span className="tape -top-2.5 left-1/2 -translate-x-1/2 -rotate-2 px-3! py-0.5! text-[0.7rem]!">Pop these</span>
          <span className="rule-card-balloon">
            <Balloon paint={example.paint} symbol={example.symbol} />
          </span>
          <span className="printed text-lg leading-tight font-semibold sm:text-xl">{ruleText(target)}</span>
        </div>
      </div>

      {/* Sky window */}
      <div ref={stageRef} className="sky-frame relative flex-1">
        <div className="sky sky-stage" data-frozen={phase === "oops" || phase === "over"}>
          {balloons.map((b) => (
            <button
              key={b.id}
              className="balloon"
              style={{ left: `${b.x}%`, "--dur": `${b.dur}s`, "--sway": `${b.sway}px`, "--scale": b.scale }}
              onPointerDown={tapBalloon(b)}
              onAnimationEnd={(e) => e.animationName === "rise" && floatedAway(b)}
              data-target={isTarget(b)}
              data-culprit={culprit?.balloon.id === b.id}
              aria-label={`${b.paint} balloon${b.symbol ? ` with a ${b.symbol}` : ""}`}
            >
              <span className="balloon-sway">
                <span key={wobble?.id === b.id ? wobble.n : "still"} className={`balloon-hit ${wobble?.id === b.id ? "balloon-wobble" : ""}`}>
                  <Balloon paint={b.paint} symbol={b.symbol} />
                </span>
              </span>
            </button>
          ))}

          {bursts.map((p) => (
            <span key={p.id} className="burst" style={{ left: p.x, top: p.y }} aria-hidden>
              <span className="burst-ring" />
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i} className="burst-bit" style={{ "--a": `${i * 51}deg`, background: `var(--bit-${p.paint})` }} />
              ))}
              <span className="burst-word">POP!</span>
            </span>
          ))}

          {cheer && (
            <div
              key={cheer.id}
              className="cheer pointer-events-none absolute top-1/3 left-1/2 z-10 text-3xl whitespace-nowrap sm:text-5xl"
              onAnimationEnd={(e) => e.animationName === "cheer" && setCheer(null)}
            >
              {cheer.text}
            </div>
          )}

          {phase === "ready" && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-[rgba(30,60,90,0.25)] p-6">
              <div className="paper sheet-pop flex w-full max-w-xs flex-col items-center gap-3 px-6 pt-6 pb-5 text-center">
                <span className="w-16">
                  <Balloon paint={example.paint} symbol={example.symbol} />
                </span>
                <p className="printed text-2xl leading-tight font-bold">{ruleText(target)}</p>
                <p className="printed-soft text-base leading-snug">
                  Don&apos;t let them float away,
                  <br />
                  and don&apos;t pop the wrong ones!
                </p>
                <button onClick={go} className="btn mt-1 w-full" data-start autoFocus>
                  <PlayIcon /> Start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {phase === "over" && result && (
        <ScoreSheet
          score={score}
          best={result.best}
          isNew={result.isNew}
          reason={
            culprit && (
              <>
                <span className="w-7 shrink-0">
                  <Balloon paint={culprit.balloon.paint} symbol={culprit.balloon.symbol} />
                </span>
                <span className="printed-soft text-base">
                  {culprit.why === "missed"
                    ? `Oh no! A ${target.kind === "colour" ? culprit.balloon.paint : `${culprit.balloon.symbol}`} balloon floated away.`
                    : `Oops! That one ${target.kind === "colour" ? `was ${culprit.balloon.paint}` : `had a ${culprit.balloon.symbol}`}.`}
                </span>
              </>
            )
          }
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
        />
      )}
    </main>
  );
}
