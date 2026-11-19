"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/sound";
import { saveBestScore } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { ScoreSheet } from "@/components/game-ui";
import { PlayIcon } from "@/components/icons";
import { ParkBackdrop, THINGS, THING_IDS, Thing, ThingIcon } from "./art";

const GAME = "seek";
const SECONDS = 60;
const SIZE = 360; // the picture is SIZE × SIZE
const MARGIN = 24;
const GAP = 40; // closest two objects may sit, so every one stays easy to tap
const DISTRACTORS = 27;
const HINT_AFTER = 12000; // ms without a find before one object starts to twinkle

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const now = () => Date.now();

/** Spread points over the picture, never closer than GAP. */
function scatter(n) {
  const pts = [];
  for (let tries = 0; pts.length < n && tries < 5000; tries++) {
    const x = rand(MARGIN, SIZE - MARGIN);
    const y = rand(MARGIN, SIZE - MARGIN);
    if (pts.every((p) => (p.x - x) ** 2 + (p.y - y) ** 2 >= GAP * GAP)) pts.push({ x, y });
  }
  return pts;
}

let keys = 0;

/**
 * A new busy picture: three kinds of thing to find (3, 2 and 1 of them, in some order)
 * hidden among lots of other things. Avoids repeating the last list's kinds.
 */
function makeScene(prev = []) {
  const fresh = THING_IDS.filter((id) => !prev.includes(id));
  const kinds = shuffle(fresh).slice(0, 3);
  const counts = shuffle([3, 2, 1]);
  const targets = kinds.map((id, i) => ({ id, need: counts[i] }));
  const others = THING_IDS.filter((id) => !kinds.includes(id));
  const want = [
    ...targets.flatMap((t) => Array.from({ length: t.need }, () => ({ id: t.id, target: true }))),
    ...Array.from({ length: DISTRACTORS }, (_, i) => ({ id: others[i % others.length], target: false })),
  ];
  const spots = shuffle(scatter(want.length));
  const items = want.slice(0, spots.length).map((w, i) => ({
    ...w,
    key: ++keys,
    colour: pick(THINGS[w.id].colours),
    x: spots[i].x,
    y: spots[i].y,
    rot: Math.round(rand(-25, 25)),
    scale: rand(0.85, 1.12).toFixed(2),
  }));
  // targets must all have made it onto the picture
  targets.forEach((t) => (t.need = Math.min(t.need, items.filter((it) => it.id === t.id && it.target).length)));
  return { items: shuffle(items), targets };
}

function listText(targets) {
  const parts = targets.map((t) => `${t.need} ${t.need === 1 ? THINGS[t.id].one : THINGS[t.id].many}`);
  return `Find ${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}!`;
}

export default function SeekGame() {
  const router = useRouter();
  const [scene, setScene] = useState(null);
  const [phase, setPhase] = useState("ready"); // ready | play | over | done
  const [found, setFound] = useState([]); // keys of objects found in this picture
  const [points, setPoints] = useState(0);
  const [pictures, setPictures] = useState(1);
  const [left, setLeft] = useState(SECONDS);
  const [wobble, setWobble] = useState(null); // { key, id } for a wrong tap
  const [hint, setHint] = useState(null); // key of a twinkling object
  const [banner, setBanner] = useState(null);
  const [result, setResult] = useState(null);

  const timers = useRef([]);
  const endAt = useRef(0);
  const lastFind = useRef(0);
  const phaseRef = useRef(phase);
  const ids = useRef(0);
  const nextId = () => ++ids.current;

  const pointsRef = useRef(0);
  useEffect(() => {
    phaseRef.current = phase;
    pointsRef.current = points;
  }, [phase, points]);

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

  /* Lay out the first picture once we're in the browser (it's random). */
  const reset = useCallback(() => {
    clearTimers();
    const s = makeScene();
    setScene(s);
    setPhase("ready");
    setFound([]);
    setPoints(0);
    setPictures(1);
    setLeft(SECONDS);
    setWobble(null);
    setHint(null);
    setBanner(null);
    setResult(null);
    later(() => sound.say(listText(s.targets)), 300);
  }, [later]);

  useEffect(() => {
    const t = setTimeout(reset, 0);
    return () => clearTimeout(t);
  }, [reset]);

  const go = () => {
    sound.go();
    endAt.current = now() + SECONDS * 1000;
    lastFind.current = now();
    setLeft(SECONDS);
    setPhase("play");
  };

  const timeUp = useCallback(() => {
    clearTimers();
    sound.timeUp();
    setHint(null);
    setBanner(null);
    setPhase("over"); // shows where the missed ones were hiding
    later(() => {
      const score = pointsRef.current;
      const { best, isNew } = saveBestScore(GAME, "all", score);
      if (isNew) sound.win();
      setResult({ score, best, isNew });
      setPhase("done");
    }, 2200);
  }, [later]);

  /* The 60-second clock, ticks for the last five seconds, and a twinkle hint when stuck. */
  useEffect(() => {
    if (phase !== "play") return;
    let last = SECONDS;
    const id = setInterval(() => {
      const rem = Math.max(0, Math.ceil((endAt.current - now()) / 1000));
      if (rem !== last) {
        last = rem;
        setLeft(rem);
        if (rem > 0 && rem <= 5) sound.tick();
        if (rem === 0) timeUp();
      }
      if (now() - lastFind.current > HINT_AFTER) {
        setHint((h) => h ?? "pending");
      }
    }, 150);
    return () => clearInterval(id);
  }, [phase, timeUp]);

  // Choose which object twinkles once the hint is due.
  const hintKey =
    hint === "pending" && scene ? scene.items.find((it) => it.target && !found.includes(it.key))?.key ?? null : hint;

  const tap = (item) => {
    if (phase !== "play" || found.includes(item.key)) return;
    const target = scene.targets.find((t) => t.id === item.id);
    const have = found.filter((k) => scene.items.find((it) => it.key === k)?.id === item.id).length;
    if (!target || have >= target.need) {
      setWobble({ key: item.key, id: nextId() });
      sound.boing();
      return;
    }
    const nowFound = [...found, item.key];
    setFound(nowFound);
    setPoints((p) => p + 1);
    setHint(null);
    lastFind.current = now();
    sound.pop();
    const total = scene.targets.reduce((s, t) => s + t.need, 0);
    if (nowFound.length >= total) {
      // Whole list found: a fresh picture while the clock keeps running.
      sound.match();
      setBanner({ id: nextId(), text: "All found! New picture!" });
      later(() => {
        if (phaseRef.current !== "play") return;
        const s = makeScene(scene.targets.map((t) => t.id));
        setScene(s);
        setFound([]);
        setPictures((n) => n + 1);
        lastFind.current = now();
        sound.unfold();
        sound.say(listText(s.targets));
      }, 1100);
    } else if (have + 1 === target.need) {
      sound.say(`All the ${THINGS[item.id].many}!`);
    }
  };

  const goHome = () => {
    clearTimers();
    sound.say("");
    router.push("/");
  };

  if (!scene) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
      </main>
    );
  }

  const countFound = (id) => found.filter((k) => scene.items.find((it) => it.key === k)?.id === id).length;
  const low = phase === "play" && left <= 10;

  return (
    <main className="screen">
      <AppBar left={<HomeButton />} center={<h1 className="engraved text-xl font-semibold sm:text-2xl">Find It Fast</h1>} right={<SoundButton />} />

      <div className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col gap-3 pb-1">
        {/* Clock · what to find · points */}
        <div className="flex items-center justify-between gap-2">
          <div className="score-plaque" data-low={low} role="timer" aria-label={`${left} seconds left`}>
            <span className="score-plaque-label">Time</span>
            <span key={left} className="score-plaque-num alpha-secs">
              {left}
            </span>
          </div>

          <ul className="seek-list paper" aria-label={listText(scene.targets)}>
            {scene.targets.map((t) => {
              const got = countFound(t.id);
              const done = got >= t.need;
              return (
                <li key={`${pictures}-${t.id}`} className="seek-want" data-done={done} data-thing={t.id}>
                  <span className="seek-want-art">
                    <ThingIcon id={t.id} />
                  </span>
                  <span key={got} className="seek-want-num">
                    {done ? "✓" : t.need - got}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="score-plaque" role="status" aria-label={`${points} points`}>
            <span className="score-plaque-label">Points</span>
            <span key={points} className="score-plaque-num">
              {points}
            </span>
          </div>
        </div>

        <p className="engraved text-center text-lg font-medium" aria-live="polite">
          {phase === "over" ? "Time's up! Here's where the others were hiding." : listText(scene.targets)}
        </p>

        {/* The busy picture */}
        <div className="seek-frame relative w-full">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="seek-scene block h-auto w-full" data-phase={phase} role="group" aria-label="Busy picture">
            <ParkBackdrop />
            {scene.items.map((it) => {
              const isFound = found.includes(it.key);
              const missed = phase === "over" && it.target && !isFound;
              return (
                <g key={it.key} transform={`translate(${it.x.toFixed(1)} ${it.y.toFixed(1)})`}>
                  <g
                    className="seek-item"
                    role="button"
                    tabIndex={phase === "play" ? 0 : -1}
                    aria-label={THINGS[it.id].one}
                    data-thing={it.id}
                    data-target={it.target}
                    data-found={isFound}
                    data-missed={missed}
                    data-hint={hintKey === it.key && phase === "play"}
                    onClick={() => tap(it)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), tap(it))}
                  >
                    <circle r="20" fill="transparent" />
                    <g key={wobble?.key === it.key ? wobble.id : "still"} className={wobble?.key === it.key ? "seek-wobble" : undefined}>
                      <g transform={`rotate(${it.rot}) scale(${it.scale})`}>
                        <Thing id={it.id} colour={it.colour} />
                      </g>
                    </g>
                    {(isFound || missed) && <circle r="21" className="seek-ring" />}
                  </g>
                </g>
              );
            })}
          </svg>

          {banner && (
            <div
              key={banner.id}
              className="cheer pointer-events-none absolute top-1/2 left-1/2 z-10 text-2xl whitespace-nowrap sm:text-4xl"
              onAnimationEnd={(e) => e.animationName === "cheer" && setBanner(null)}
            >
              {banner.text}
            </div>
          )}

          {phase === "ready" && (
            <div className="seek-ready absolute inset-0 grid place-items-center p-4">
              <div className="paper sheet-pop flex w-full max-w-xs flex-col items-center gap-3 px-5 pt-5 pb-4 text-center">
                <p className="printed text-2xl font-semibold">Can you find…</p>
                <ul className="flex justify-center gap-4">
                  {scene.targets.map((t) => (
                    <li key={t.id} className="flex flex-col items-center">
                      <span className="block size-14">
                        <ThingIcon id={t.id} />
                      </span>
                      <span className="printed text-lg font-semibold">
                        {t.need} {t.need === 1 ? THINGS[t.id].one : THINGS[t.id].many}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="printed-soft text-base">You have 60 seconds. Clear the list for a new picture!</p>
                <button onClick={go} className="btn w-full" autoFocus>
                  <PlayIcon /> Go!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {phase === "done" && result && (
        <ScoreSheet
          score={result.score}
          best={result.best}
          isNew={result.isNew}
          reason={<span className="printed-soft text-lg">{`You found ${result.score} thing${result.score === 1 ? "" : "s"} in 60 seconds!`}</span>}
          onReplay={reset}
          onMenu={goHome}
          menuLabel="Back to games"
        />
      )}
    </main>
  );
}
