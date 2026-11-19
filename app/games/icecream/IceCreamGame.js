"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveBestScore, useBestScores } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ScoreSheet, StepHeading } from "@/components/game-ui";
import { BackIcon, PlayIcon } from "@/components/icons";
import { Cherry, Cone, FLAVOUR_IDS, Holder, Scoop, ScooperBack, ScooperFront, Splat, StackPreview, TowerArt } from "./art";

const GAME = "icecream";

// Endless: every scoop that lands adds one to the tower. The scooper speeds up,
// the tower sways more the taller it gets, and one miss ends the game.
const LEVELS = [
  { id: "easy", name: "Easy", speed: 80, speedUp: 2, maxSpeed: 170, tol: 34, wob: 0.5, maxTilt: 7, detail: "Slow scooper, big catch" },
  { id: "medium", name: "Medium", speed: 115, speedUp: 3, maxSpeed: 220, tol: 30, wob: 0.7, maxTilt: 10, detail: "Faster, wobblier" },
  { id: "hard", name: "Big", speed: 145, speedUp: 4, maxSpeed: 270, tol: 26, wob: 0.9, maxTilt: 13, detail: "Speedy and very wobbly" },
];

/* Stage, in SVG units. The world scrolls; the scooper rail stays put. */
const W = 300;
const H = 460;
const COUNTER_Y = 400; // where world y = 0 (the counter top) sits on screen at the start
const RAIL_Y = 44;
const HELD_Y = RAIL_Y + 58; // screen y of the scoop in the scooper
const CONE_X = 150;
const MOUTH_Y = -100; // cone mouth, world
const FIRST = 18; // first scoop centre above the mouth
const STEP = 44; // each scoop sits this far above the last
const R = 30;
const GRAVITY = 3200;
const PERFECT = 6;
const X_MIN = 44;
const X_MAX = 256;
const TOP_MIN = 80; // keep the tower's top reachable
const TOP_MAX = 220;

const rad = (d) => (d * Math.PI) / 180;
const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

function nextFlavour(prev) {
  const opts = FLAVOUR_IDS.filter((f) => f !== prev);
  return opts[Math.floor(Math.random() * opts.length)];
}

/** Where every scoop is right now: each joint bends by the same small sway angle. */
function towerPoints(stack, sway, maxTilt) {
  const pts = [];
  let x = CONE_X;
  let y = MOUTH_Y;
  const cap = rad(maxTilt);
  stack.forEach((s, i) => {
    const a = Math.max(-cap, Math.min(cap, sway * (i + 1)));
    const [vx, vy] = rot(s.dx, i === 0 ? -FIRST : -STEP, a);
    x += vx;
    y += vy;
    pts.push({ x, y, a });
  });
  return pts;
}

/** Centre the next scoop would land on, given the tower now. */
function landingSpot(pts) {
  if (!pts.length) return { x: CONE_X, y: MOUTH_Y - FIRST, a: 0 };
  const top = pts[pts.length - 1];
  const [vx, vy] = rot(0, -STEP, top.a);
  return { x: top.x + vx, y: top.y + vy, a: top.a };
}

const tf = (x, y, a = 0) => `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((a * 180) / Math.PI).toFixed(2)})`;

export default function IceCreamGame() {
  const [levelId, setLevelId] = useState(null);
  const [phase, setPhase] = useState("ready"); // ready | play | oops | over
  const [stack, setStack] = useState([]); // flavours, bottom first
  const [held, setHeld] = useState(null); // flavour in the scooper
  const [falling, setFalling] = useState(null); // flavour of the dropping scoop
  const [splat, setSplat] = useState(null); // { x, flavour }
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [cheer, setCheer] = useState(null);
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState(0); // restarts the frame loop on "Play again"

  const bestScores = useBestScores(GAME);
  const level = LEVELS.find((l) => l.id === levelId);

  const sim = useRef(null);
  const raf = useRef(0);
  const timers = useRef([]);
  const ids = useRef(0);
  const worldRef = useRef(null);
  const scooperRef = useRef(null);
  const fallRef = useRef(null);
  const scoopRefs = useRef([]);
  const wallRef = useRef(null);
  const cherryRef = useRef(null);
  const aimRef = useRef(null);
  /** Callback ref that remembers the element and paints it straight away. */
  const attach = (box, el) => {
    box.current = el;
    if (el) paint.current?.();
  };

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const stopAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(raf.current);
  };
  useEffect(() => stopAll, []);

  const start = useCallback((lvlId) => {
    stopAll();
    const lvl = LEVELS.find((l) => l.id === lvlId);
    const first = nextFlavour(null);
    sim.current = {
      level: lvl,
      t: 0,
      x: 70,
      dir: 1,
      speed: lvl.speed,
      stack: [], // { dx, flavour }
      pts: [],
      imp: 0,
      cam: COUNTER_Y,
      zoom: 1,
      held: first,
      falling: null,
      reloadAt: null,
      over: false,
    };
    scoopRefs.current = [];
    setLevelId(lvlId);
    setPhase("ready");
    setStack([]);
    setHeld(first);
    setFalling(null);
    setSplat(null);
    setScore(0);
    setResult(null);
    setCheer(null);
    setOpen(false);
    setRound((r) => r + 1);
  }, []);

  const backToMenu = () => {
    stopAll();
    setLevelId(null);
  };

  const showCheer = (text) => setCheer({ id: ++ids.current, text });

  const land = (d, spot) => {
    const s = sim.current;
    const lvl = s.level;
    const f = s.falling;
    let dx = Math.abs(d) <= PERFECT ? 0 : d * 0.6;
    // Keep the top within reach of the scooper.
    const newX = spot.x + dx;
    if (newX < TOP_MIN) dx += TOP_MIN - newX;
    if (newX > TOP_MAX) dx -= newX - TOP_MAX;
    s.stack.push({ dx, flavour: f.flavour });
    s.pts = towerPoints(s.stack, 0, lvl.maxTilt);
    s.falling = null;
    s.lastFlavour = f.flavour;
    s.imp = Math.min(2.5, s.imp + (Math.abs(d) / lvl.tol) * 1.2);
    s.speed = Math.min(lvl.maxSpeed, s.speed + lvl.speedUp);
    s.reloadAt = s.t + 0.28;
    const n = s.stack.length;
    setFalling(null);
    setStack(s.stack.map((x) => x.flavour));
    setScore(n);
    scoreRef.current = n;
    sound.scoop();
    if (n % 10 === 0) {
      sound.match();
      sound.say(`${n} scoops!`);
      showCheer(`${n} scoops!`);
    } else if (dx === 0) {
      sound.ding();
      showCheer("Perfect!");
    }
  };

  const scoreRef = useRef(0);

  const endGame = () => {
    const s = sim.current;
    setResult(saveBestScore(GAME, s.level.id, scoreRef.current));
    sound.say("Oh no! It fell!");
    later(() => {
      sound.win();
      setPhase("over");
    }, 2000);
  };

  /* ---------- The frame loop ---------- */
  const tick = useRef(null);
  const paint = useRef(null);
  useEffect(() => {
  tick.current = (dt) => {
    const s = sim.current;
    if (!s) return;
    const lvl = s.level;
    s.t += dt;

    // Scooper glides back and forth at a steady speed.
    if (!s.over) {
      s.x += s.dir * s.speed * dt;
      if (s.x > X_MAX) (s.x = X_MAX), (s.dir = -1);
      if (s.x < X_MIN) (s.x = X_MIN), (s.dir = 1);
    }

    // Sway: a small angle per scoop, so taller towers lean further. Knocks add more.
    s.imp *= Math.exp(-dt / 1.1);
    const period = 1.7 + Math.min(0.8, s.stack.length * 0.03);
    const sway = rad(lvl.wob * (1 + s.imp)) * Math.sin((2 * Math.PI * s.t) / period);
    s.pts = towerPoints(s.stack, s.over ? sway * Math.exp(-(s.t - s.overAt) * 2) : sway, lvl.maxTilt);
    const spot = landingSpot(s.pts);
    s.spot = spot;

    // Falling scoop.
    const f = s.falling;
    if (f) {
      f.vy += GRAVITY * dt;
      f.y += f.vy * dt;
      if (f.miss) {
        f.x += f.miss.vx * dt;
        f.rot += f.miss.vr * dt;
        if (f.y >= -R * 0.4) {
          // Splat on the counter.
          s.falling = null;
          sound.splat();
          setFalling(null);
          setSplat({ x: f.x, flavour: f.flavour });
          endGame();
        }
      } else if (f.y >= spot.y) {
        const d = f.x - spot.x;
        if (Math.abs(d) <= lvl.tol) {
          land(d, spot);
        } else {
          // Misses: bumps the edge (or nothing) and tumbles down.
          const side = Math.sign(d) || 1;
          f.miss = { vx: side * (Math.abs(d) < lvl.tol + R ? 110 : 30), vr: side * 4 };
          f.rot = 0;
          if (Math.abs(d) < lvl.tol + R) sound.boing();
          else sound.miss();
          s.over = true;
          s.overAt = s.t;
          setPhase("oops");
        }
      }
    }

    // Reload the scooper.
    if (s.reloadAt != null && s.t >= s.reloadAt && !s.over) {
      s.reloadAt = null;
      s.held = nextFlavour(s.lastFlavour);
      setHeld(s.held);
      setOpen(false);
    }

    // Camera: keep the next landing spot in the lower middle; zoom out at the end.
    const topY = s.pts.length ? s.pts[s.pts.length - 1].y : MOUTH_Y;
    let targetZoom = 1;
    let targetCam = Math.max(COUNTER_Y, 250 - spot.y);
    if (s.over && s.t - s.overAt > 0.5) {
      const span = 60 - (topY - 60);
      targetZoom = Math.min(1, (H - 50) / span);
      targetCam = H - 20 - 60 * targetZoom;
    }
    const k = Math.min(1, dt * (s.over ? 2.5 : 3.5));
    s.cam += (targetCam - s.cam) * k;
    s.zoom += (targetZoom - s.zoom) * k;

    paint.current();
  };

  /** Push the simulation onto the SVG (called every frame, and when parts mount). */
  paint.current = () => {
    const s = sim.current;
    if (!s) return;
    worldRef.current?.setAttribute("transform", `translate(${(CONE_X * (1 - s.zoom)).toFixed(1)} ${s.cam.toFixed(1)}) scale(${s.zoom.toFixed(4)})`);
    wallRef.current?.setAttribute("patternTransform", `translate(0 ${(s.cam % 48).toFixed(1)})`);
    scooperRef.current?.setAttribute("transform", `translate(${s.x.toFixed(1)} ${RAIL_Y})`);
    const aim = aimRef.current;
    if (aim && s.spot) {
      const show = !!s.held && !s.over && !s.falling;
      const y2 = (s.spot.y + 20) * s.zoom + s.cam; // the cone mouth / top of the last scoop
      const on = Math.abs(s.x - s.spot.x) <= s.level.tol;
      aim.setAttribute("opacity", show ? 1 : 0);
      aim.style.stroke = on ? "#1F9A47" : "rgba(110, 40, 60, 0.45)";
      aim.style.strokeWidth = on ? "4" : "3";
      aim.lastChild.setAttribute("fill", on ? "rgba(63, 179, 95, 0.45)" : "none");
      aim.setAttribute("transform", `translate(${s.x.toFixed(1)} 0)`);
      aim.firstChild.setAttribute("y2", Math.max(HELD_Y + 30, y2).toFixed(1));
      aim.lastChild.setAttribute("cy", Math.max(HELD_Y + 30, y2).toFixed(1));
    }
    s.pts.forEach((p, i) => scoopRefs.current[i]?.setAttribute("transform", tf(p.x, p.y, p.a)));
    if (s.falling && fallRef.current) fallRef.current.setAttribute("transform", tf(s.falling.x, s.falling.y, s.falling.rot || 0));
    const top = s.pts[s.pts.length - 1];
    if (top && cherryRef.current) {
      const [cx, cy] = rot(0, -36, top.a);
      cherryRef.current.setAttribute("transform", tf(top.x + cx, top.y + cy, top.a));
    }
  };
  });

  // Run the loop while playing (and while the tower settles after a miss).
  useEffect(() => {
    if (!levelId) return;
    let last = null;
    const loop = (t) => {
      const dt = last == null ? 0 : Math.min(0.05, (t - last) / 1000);
      last = t;
      tick.current(dt);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [levelId, round]);

  const drop = useCallback(() => {
    const s = sim.current;
    if (!s || phase !== "play" || s.over || s.falling || !s.held) return;
    s.falling = { x: s.x, y: HELD_Y - s.cam, vy: 0, flavour: s.held, rot: 0 };
    s.held = null;
    sound.click();
    setFalling(s.falling.flavour);
    setHeld(null);
    setOpen(true);
  }, [phase]);

  useEffect(() => {
    if (!level) return;
    const onKey = (e) => {
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
        if (phase !== "play") return;
        e.preventDefault();
        drop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level, phase, drop]);

  const go = () => {
    sound.tap(); // unlocks audio on iOS
    sound.say("Tap to drop the scoop on the cone!");
    setPhase("play");
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <svg viewBox="-90 -250 180 350" className="mb-2 h-44 drop-shadow-[0_8px_8px_rgba(40,18,0,0.4)]" aria-hidden>
              <TowerArt flavours={["strawberry", "mint", "chocolate", "lemon"]} />
            </svg>
            <h1 className="toy-title text-5xl sm:text-6xl">Ice Cream Stack</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Drop the scoops. How tall can it get?</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick a speed</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l, i) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<StackPreview n={i + 2} />}
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
  const best = bestScores[level.id] || 0;
  const rulerMax = Math.max(stack.length + 12, best + 6, 15);

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
            <span className="score-plaque-label">Scoops</span>
            <span key={score} className="score-plaque-num">
              {score}
            </span>
          </div>
        }
        right={<SoundButton />}
      />

      <p className="engraved mt-1 mb-2 text-center text-lg leading-snug font-medium sm:text-xl" aria-live="polite">
        {phase === "oops" || phase === "over" ? "Oh no! It fell!" : "Tap to drop the scoop!"}
      </p>

      <div className="relative flex flex-1 flex-col items-center justify-center pb-2">
        <div className="parlour-frame">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block touch-none"
            style={{ width: `min(calc(100vw - 2.6rem), 26rem, calc((100dvh - 12.5rem) * ${W} / ${H}))`, height: "auto" }}
            role="button"
            tabIndex={0}
            aria-label="Ice cream stand. Tap to drop the scoop."
            data-phase={phase}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              drop();
            }}
          >
            <defs>
              <pattern id="ic-wall" ref={(el) => attach(wallRef, el)} width="48" height="48" patternUnits="userSpaceOnUse">
                <rect width="48" height="48" fill="#FFE3EC" />
                <rect width="24" height="48" fill="#FFD3E1" />
                <circle cx="12" cy="12" r="3" fill="#fff" opacity="0.8" />
                <circle cx="36" cy="36" r="3" fill="#fff" opacity="0.8" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#ic-wall)" />

            {/* The world: ruler, counter, cone and the tower */}
            <g ref={(el) => attach(worldRef, el)} transform={`translate(0 ${COUNTER_Y})`}>
              {/* height ruler, one mark per scoop */}
              <g>
                <rect x="6" y={MOUTH_Y - FIRST - (rulerMax - 1) * STEP - 30} width="26" height={-(MOUTH_Y - FIRST - (rulerMax - 1) * STEP - 30)} rx="4" fill="#F8D25C" stroke="#B8920A" strokeWidth="2" />
                {Array.from({ length: rulerMax }, (_, i) => {
                  const y = MOUTH_Y - FIRST - i * STEP;
                  const big = (i + 1) % 5 === 0;
                  return (
                    <g key={i}>
                      <path d={`M6 ${y}h${big ? 10 : 7}`} stroke="#6E4A0A" strokeWidth={big ? 3 : 2} />
                      {big && (
                        <text x="24" y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#6E4A0A">
                          {i + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
                {best > 0 && (
                  <g transform={`translate(32 ${MOUTH_Y - FIRST - (best - 1) * STEP})`} className="best-flag">
                    <path d="M0 0h10" stroke="#7A1E16" strokeWidth="3" />
                    <path d="M10-12h40l-7 8 7 8H10Z" fill="#E5483B" stroke="#7A1E16" strokeWidth="2" strokeLinejoin="round" />
                    <text x="28" y="0" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
                      BEST
                    </text>
                  </g>
                )}
              </g>

              {/* counter */}
              <rect x="-400" y="0" width="1100" height="400" fill="#B47843" />
              <rect x="-400" y="0" width="1100" height="14" fill="#E2AE74" />
              <rect x="-400" y="14" width="1100" height="5" fill="#7A4A22" opacity="0.5" />

              <g transform={`translate(${CONE_X} ${MOUTH_Y})`}>
                <Cone />
              </g>
              <g transform={`translate(${CONE_X} -38)`}>
                <Holder />
              </g>

              {stack.map((flavour, i) => (
                <g
                  key={i}
                  ref={(el) => {
                    scoopRefs.current[i] = el;
                    const p = sim.current?.pts[i];
                    if (el && p) el.setAttribute("transform", tf(p.x, p.y, p.a));
                  }}
                  className={i === stack.length - 1 && phase === "play" ? "scoop-land" : undefined}
                >
                  <g className="scoop-squish">
                    <Scoop flavour={flavour} />
                  </g>
                </g>
              ))}

              {phase === "over" && stack.length > 0 && (
                <g ref={(el) => attach(cherryRef, el)}>
                  <g className="cherry-in">
                    <Cherry />
                  </g>
                </g>
              )}

              {falling && (
                <g
                  ref={(el) => {
                    fallRef.current = el;
                    const fl = sim.current?.falling;
                    // Place it before paint so it doesn't flash at the origin.
                    if (el && fl) el.setAttribute("transform", tf(fl.x, fl.y, fl.rot || 0));
                  }}
                >
                  <Scoop flavour={falling} />
                </g>
              )}

              {splat && (
                <g transform={`translate(${splat.x} 2)`} className="splat-in">
                  <Splat flavour={splat.flavour} />
                </g>
              )}
            </g>

            {/* Striped awning */}
            <g aria-hidden>
              {Array.from({ length: 13 }, (_, i) => (
                <path key={i} d={`M${i * 24} 0h24v16a12 12 0 0 1-24 0Z`} fill={i % 2 ? "#FFF6E6" : "#E5483B"} stroke="#3D2A1E" strokeWidth="2" />
              ))}
              <rect width={W} height="6" fill="#A42C22" />
            </g>

            {/* Aim line: where the scoop will fall; green when it will land */}
            <g ref={(el) => attach(aimRef, el)} className="ic-aim" opacity="0" stroke="rgba(110, 40, 60, 0.45)" aria-hidden>
              <line x1="0" x2="0" y1={HELD_Y + 30} y2={HELD_Y + 30} strokeDasharray="2 8" strokeLinecap="round" />
              <ellipse cx="0" cy={HELD_Y + 30} rx="18" ry="6" fill="none" />
            </g>

            {/* Rail and scooper, fixed at the top */}
            <g className="ic-rail" data-hide={phase === "oops" || phase === "over"}>
              <rect x="-10" y={RAIL_Y - 4} width={W + 20} height="8" rx="4" fill="#AEB4BB" stroke="#3D2A1E" strokeWidth="2.5" />
              <g ref={(el) => attach(scooperRef, el)} transform={`translate(70 ${RAIL_Y})`}>
                <ScooperBack />
                {held && (
                  <g transform="translate(0 58)" className="scoop-load">
                    <Scoop flavour={held} />
                  </g>
                )}
                <ScooperFront open={open} />
              </g>
            </g>
          </svg>

          {cheer && (
            <div
              key={cheer.id}
              className="cheer pointer-events-none absolute top-1/3 left-1/2 z-10 text-3xl whitespace-nowrap sm:text-4xl"
              onAnimationEnd={(e) => e.animationName === "cheer" && setCheer(null)}
            >
              {cheer.text}
            </div>
          )}

          {phase === "ready" && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-[rgba(90,30,50,0.2)] p-5">
              <div className="paper sheet-pop flex w-full max-w-xs flex-col items-center gap-3 px-6 pt-6 pb-5 text-center">
                <svg viewBox="-48 -140 96 238" className="h-36" aria-hidden>
                  <g transform="translate(0 -128)">
                    <ScooperBack />
                    <g transform="translate(0 58)">
                      <Scoop flavour="strawberry" />
                    </g>
                    <ScooperFront />
                  </g>
                  <path d="M0 -36v14" stroke="#3D2A1E" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 6" />
                  <g transform="scale(0.8)">
                    <Cone />
                  </g>
                </svg>
                <p className="printed text-2xl leading-tight font-bold">Stack it high!</p>
                <p className="printed-soft text-base leading-snug">
                  Tap to drop the scoop onto the cone. If one misses, it&apos;s game over!
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
            splat && (
              <>
                <svg viewBox="-55 -30 110 45" className="w-12 shrink-0" aria-hidden>
                  <Splat flavour={splat.flavour} />
                </svg>
                <span className="printed-soft text-base">
                  {score === 0 ? "The scoop missed the cone." : `Splat! The ${splat.flavour} scoop missed.`}
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
