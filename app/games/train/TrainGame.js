"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon, PlayIcon, ReplayIcon, StarIcon } from "@/components/icons";
import { Carriage, Engine, KidIcon, MapPreview, Pond, Rock, Station, StarPickup, Stop, StopPlatform, Tree } from "./art";

/** What the child should be told to collect on a level. */
function goalText(stops) {
  if (stops === 0) return "Draw the track to the station, and go over all the stars on the way!";
  if (stops === 1) return "Draw the track to the station. Pick up the passenger and all the stars on the way!";
  return "Draw the track to the station. Pick up both passengers and all the stars on the way!";
}

const GAME = "train";
const BOARDS = 3;
const STARS_PER_BOARD = 3;
const SPEED = 0.24; // map units per ms (2.4 squares a second)
const CARRIAGE_GAP = 64;

const LEVELS = [
  { id: "easy", name: "Easy", cols: 4, rows: 5, fill: 0.45, obstacles: 0.45, stops: 0, detail: "Draw to the station" },
  { id: "medium", name: "Medium", cols: 5, rows: 6, fill: 0.5, obstacles: 0.55, stops: 1, detail: "Pick up a passenger" },
  { id: "hard", name: "Big", cols: 5, rows: 7, fill: 0.55, obstacles: 0.6, stops: 2, detail: "Two passengers to collect" },
];

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const rand = (n) => Math.floor(Math.random() * n);
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Random self-avoiding walk of exactly `len` cells (with backtracking). */
function randomWalk(cols, rows, start, len) {
  const path = [start];
  const seen = new Set([start]);
  let budget = 4000;
  const step = () => {
    if (path.length === len) return true;
    if (--budget <= 0) return false;
    const cur = path[path.length - 1];
    const r = Math.floor(cur / cols);
    const c = cur % cols;
    const next = shuffle([
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ]).filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen.has(nr * cols + nc));
    for (const [nr, nc] of next) {
      const i = nr * cols + nc;
      path.push(i);
      seen.add(i);
      if (step()) return true;
      path.pop();
      seen.delete(i);
    }
    return false;
  };
  return step() ? path : null;
}

/** A map that is always solvable: obstacles only go where the hidden route doesn't. */
function makeBoard(level) {
  const { cols, rows } = level;
  const len = Math.round(cols * rows * level.fill);
  for (let attempt = 0; attempt < 60; attempt++) {
    const start = rand(rows) * cols; // left edge
    const route = randomWalk(cols, rows, start, len);
    if (!route) continue;
    const end = route[route.length - 1];
    const dist = Math.abs(Math.floor(end / cols) - Math.floor(start / cols)) + Math.abs((end % cols) - (start % cols));
    if (dist < 3) continue;
    const inner = route.slice(1, -1);
    // Stops spread along the route; stars on other route squares.
    const stops = level.stops === 0 ? [] : level.stops === 1 ? [inner[Math.floor(inner.length * 0.55)]] : [inner[Math.floor(inner.length * 0.3)], inner[Math.floor(inner.length * 0.7)]];
    const free = shuffle(inner.filter((i) => !stops.includes(i)));
    const stars = free.slice(0, STARS_PER_BOARD);
    const onRoute = new Set(route);
    const cells = Array.from({ length: cols * rows }, (_, i) => {
      if (onRoute.has(i) || Math.random() > level.obstacles) return "grass";
      const roll = Math.random();
      return roll < 0.55 ? "tree" : roll < 0.8 ? "rock" : "pond";
    });
    return { cols, rows, start, end, stops, stars, cells, route };
  }
  return null;
}

const centre = (i, cols) => [(i % cols) * 100 + 50, Math.floor(i / cols) * 100 + 50];
const adjacent = (a, b, cols) => {
  const dr = Math.abs(Math.floor(a / cols) - Math.floor(b / cols));
  const dc = Math.abs((a % cols) - (b % cols));
  return dr + dc === 1;
};

/** Track through square centres, with rounded bends. */
function trackD(path, cols) {
  if (path.length < 2) return "";
  const p = path.map((i) => centre(i, cols));
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length; i++) {
    if (i === p.length - 1) {
      d += `L${p[i][0]} ${p[i][1]}`;
      break;
    }
    const inX = Math.sign(p[i][0] - p[i - 1][0]);
    const inY = Math.sign(p[i][1] - p[i - 1][1]);
    const outX = Math.sign(p[i + 1][0] - p[i][0]);
    const outY = Math.sign(p[i + 1][1] - p[i][1]);
    if (inX === outX && inY === outY) d += `L${p[i][0]} ${p[i][1]}`;
    else d += `L${p[i][0] - inX * 50} ${p[i][1] - inY * 50}Q${p[i][0]} ${p[i][1]} ${p[i][0] + outX * 50} ${p[i][1] + outY * 50}`;
  }
  return d;
}

/** Stars for the round: fewer failed runs (train arrived missing something) = more stars. */
function starsFor(fails) {
  if (fails === 0) return 3;
  if (fails <= 2) return 2;
  return 1;
}

/** "2 stars and a passenger" */
function missedText(stars, kids) {
  const parts = [];
  if (stars) parts.push(stars === 1 ? "a star" : `${stars} stars`);
  if (kids) parts.push(kids === 1 ? "a passenger" : `${kids} passengers`);
  return parts.join(" and ");
}

export default function TrainGame() {
  const [levelId, setLevelId] = useState(null);
  const [boards, setBoards] = useState(null);
  const [b, setB] = useState(0);
  const [path, setPath] = useState([]);
  const [phase, setPhase] = useState("ready"); // ready | draw | drive | arrived | won
  const [got, setGot] = useState(() => new Set()); // stars collected on this board
  const [boarded, setBoarded] = useState(() => new Set());
  const [fails, setFails] = useState(0); // runs that arrived without collecting everything
  const [missed, setMissed] = useState(null); // { stars, kids } after a failed run
  const [puffs, setPuffs] = useState([]);
  const [cheer, setCheer] = useState(null);
  const [drawn, setDrawn] = useState(false); // has the child started drawing (hides the start hint)
  const [flyers, setFlyers] = useState([]); // stars / passengers flying from the map to the tray
  const [filled, setFilled] = useState({ stars: 0, kids: 0 }); // tray slots filled this map

  const best = useBestStars(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
  const board = boards?.[b];

  const svgRef = useRef(null);
  const starSlots = useRef([]);
  const kidSlots = useRef([]);
  const trackRef = useRef(null);
  const engineRef = useRef(null);
  const carriageRef = useRef(null);
  const pathRef = useRef([]);
  const drawing = useRef(false);
  const lastPt = useRef(null);
  const raf = useRef(0);
  const timers = useRef([]);
  const ids = useRef(0);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(raf.current);
  };
  useEffect(() => clearTimers, []);

  const updatePath = (p) => {
    pathRef.current = p;
    setPath(p);
  };

  const loadBoard = (bd) => {
    updatePath([bd.start]);
    setGot(new Set());
    setBoarded(new Set());
    setPuffs([]);
    setFlyers([]);
    setFilled({ stars: 0, kids: 0 });
  };

  const start = useCallback((lvlId) => {
    clearTimers();
    const lvl = LEVELS.find((l) => l.id === lvlId);
    const bs = Array.from({ length: BOARDS }, () => makeBoard(lvl));
    setLevelId(lvlId);
    setBoards(bs);
    setB(0);
    setFails(0);
    setMissed(null);
    setCheer(null);
    setDrawn(false);
    setPhase("ready");
    pathRef.current = [bs[0].start];
    setPath([bs[0].start]);
    setGot(new Set());
    setBoarded(new Set());
    setPuffs([]);
    setFlyers([]);
    setFilled({ stars: 0, kids: 0 });
  }, []);

  /** Send a star or passenger flying from map square `i` into tray slot `slot`. */
  const flyToTray = (kind, i, slot) => {
    const svg = svgRef.current.getBoundingClientRect();
    const target = (kind === "star" ? starSlots : kidSlots).current[slot];
    if (!target) return;
    const to = target.getBoundingClientRect();
    const [cx, cy] = centre(i, board.cols);
    const x = svg.left + (cx / (board.cols * 100)) * svg.width;
    const y = svg.top + (cy / (board.rows * 100)) * svg.height;
    const size = to.width;
    setFlyers((fs) => [
      ...fs,
      {
        id: ++ids.current,
        kind,
        x: x - size / 2,
        y: y - size / 2,
        dx: to.left - (x - size / 2),
        dy: to.top - (y - size / 2),
        size,
      },
    ]);
  };

  const land = (f) => {
    setFlyers((fs) => fs.filter((x) => x.id !== f.id));
    setFilled((v) => (f.kind === "star" ? { ...v, stars: v.stars + 1 } : { ...v, kids: v.kids + 1 }));
    if (f.kind === "star") sound.ding();
    else sound.match();
  };

  const go = () => {
    sound.tap(); // unlocks audio on iOS
    sound.say(goalText(level.stops));
    setPhase("draw");
  };

  const backToMenu = () => {
    clearTimers();
    setLevelId(null);
    setBoards(null);
  };

  /* ---------- Drawing the track ---------- */
  const cellAt = (x, y) => {
    const r = svgRef.current.getBoundingClientRect();
    const c = Math.floor(((x - r.left) / r.width) * board.cols);
    const row = Math.floor(((y - r.top) / r.height) * board.rows);
    if (c < 0 || c >= board.cols || row < 0 || row >= board.rows) return null;
    return row * board.cols + c;
  };

  const canEnter = (i) => board.cells[i] === "grass";

  /** Apply one square under the finger: extend, step back, or ignore. */
  const visit = (i) => {
    const p = pathRef.current;
    const last = p[p.length - 1];
    if (i == null || i === last) return;
    if (p.length >= 2 && i === p[p.length - 2]) {
      updatePath(p.slice(0, -1)); // slid back: pick the last piece up again
      return;
    }
    if (last === board.end || !adjacent(last, i, board.cols) || !canEnter(i) || p.includes(i)) return;
    updatePath([...p, i]);
    if (i === board.end) {
      sound.match();
      sound.say("Press go!");
    } else sound.click();
  };

  const onPointerDown = (e) => {
    if (phase !== "draw") return;
    const i = cellAt(e.clientX, e.clientY);
    if (i == null) return;
    const p = pathRef.current;
    const at = p.indexOf(i);
    if (at >= 0) {
      if (at < p.length - 1) updatePath(p.slice(0, at + 1)); // redraw from here
    } else if (adjacent(p[p.length - 1], i, board.cols)) {
      visit(i);
    } else return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    lastPt.current = [e.clientX, e.clientY];
    setDrawn(true);
  };

  const onPointerMove = (e) => {
    if (!drawing.current) return;
    // Sample along the finger's movement so fast swipes don't skip squares.
    const [x0, y0] = lastPt.current;
    const r = svgRef.current.getBoundingClientRect();
    const stepPx = r.width / board.cols / 4;
    const dist = Math.hypot(e.clientX - x0, e.clientY - y0);
    const steps = Math.max(1, Math.ceil(dist / stepPx));
    for (let s = 1; s <= steps; s++) visit(cellAt(x0 + ((e.clientX - x0) * s) / steps, y0 + ((e.clientY - y0) * s) / steps));
    lastPt.current = [e.clientX, e.clientY];
  };

  const onPointerUp = () => {
    drawing.current = false;
  };

  const clearTrack = () => {
    if (phase !== "draw") return;
    sound.unfold();
    updatePath([board.start]);
  };

  /* ---------- Driving ---------- */
  const complete = board && path[path.length - 1] === board.end;
  // The train may always go once the track reaches the station; missing things fails the run.
  const canGo = phase === "draw" && complete;

  /** Place engine + carriage at distance `s` along the track. */
  const pose = (s) => {
    const el = trackRef.current;
    const total = el.getTotalLength();
    const at = (d) => {
      if (d >= 0) {
        const pt = el.getPointAtLength(Math.min(d, total));
        const ahead = el.getPointAtLength(Math.min(d + 1, total));
        const behind = el.getPointAtLength(Math.max(Math.min(d, total) - 1, 0));
        return { x: pt.x, y: pt.y, a: (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI };
      }
      // Before the start: line up behind the first stretch of track.
      const p0 = el.getPointAtLength(0);
      const p1 = el.getPointAtLength(1);
      const ang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      return { x: p0.x + Math.cos(ang) * d, y: p0.y + Math.sin(ang) * d, a: (ang * 180) / Math.PI };
    };
    const e = at(s);
    const c = at(s - CARRIAGE_GAP);
    engineRef.current?.setAttribute("transform", `translate(${e.x} ${e.y}) rotate(${e.a})`);
    carriageRef.current?.setAttribute("transform", `translate(${c.x} ${c.y}) rotate(${c.a})`);
    return { e, total };
  };

  // Park the train at the start whenever the track changes.
  useEffect(() => {
    if (!board || phase === "drive" || phase === "arrived" || !trackRef.current) return;
    if (path.length >= 2) pose(0);
  });

  const drive = () => {
    if (!canGo) return;
    setPhase("drive");
    sound.whistle();
    sound.say("All aboard!");
    const startT = performance.now();
    let lastPuff = 0;
    const taken = new Set();
    const riders = new Set();
    const tick = (t) => {
      const s = (t - startT) * SPEED;
      const { e, total } = pose(s);
      // Pick things up as the engine passes over them.
      board.stars.forEach((i) => {
        if (taken.has(i)) return;
        const [x, y] = centre(i, board.cols);
        if (Math.hypot(e.x - x, e.y - y) < 32) {
          taken.add(i);
          setGot(new Set(taken));
          flyToTray("star", i, taken.size - 1);
          sound.pop();
          sound.say(WORDS[taken.size]);
        }
      });
      board.stops.forEach((i) => {
        if (riders.has(i)) return;
        const [x, y] = centre(i, board.cols);
        if (Math.hypot(e.x - x, e.y - y) < 36) {
          riders.add(i);
          setBoarded(new Set(riders));
          flyToTray("kid", i, riders.size - 1);
          sound.ding();
        }
      });
      // Steam puffs from the chimney.
      if (t - lastPuff > 280) {
        lastPuff = t;
        const rad = (e.a * Math.PI) / 180;
        const puff = { id: ++ids.current, x: e.x + Math.cos(rad) * 16, y: e.y + Math.sin(rad) * 16 };
        setPuffs((ps) => [...ps.slice(-8), puff]);
        sound.chug();
      }
      if (s < total) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      // Arrived. Did the train collect everything?
      const lostStars = board.stars.length - taken.size;
      const lostKids = board.stops.length - riders.size;
      if (lostStars || lostKids) {
        setPhase("missed");
        setFails((f) => f + 1);
        sound.miss();
        later(() => {
          setMissed({ stars: lostStars, kids: lostKids });
          sound.say(`Oh no! You missed ${missedText(lostStars, lostKids)}.`);
        }, 700);
        return;
      }
      setPhase("arrived");
      sound.whistle();
      setCheer({ id: ++ids.current, text: "Toot toot!" });
      later(() => {
        if (b + 1 >= BOARDS) {
          saveStars(GAME, level.id, starsFor(failsRef.current));
          sound.win();
          setPhase("won");
        } else {
          setB(b + 1);
          loadBoard(boards[b + 1]);
          setPhase("draw");
          sound.pop();
        }
      }, 1800);
    };
    raf.current = requestAnimationFrame(tick);
  };

  /** After a failed run: put the train back and let the child fix (or redo) the track. */
  const retry = (keepTrack) => {
    sound.tap();
    setMissed(null);
    setGot(new Set());
    setBoarded(new Set());
    setFilled({ stars: 0, kids: 0 });
    setFlyers([]);
    setPuffs([]);
    updatePath(keepTrack ? [...pathRef.current] : [board.start]);
    setPhase("draw");
  };

  // Latest fail count for the timeout above.
  const failsRef = useRef(0);
  useEffect(() => {
    failsRef.current = fails;
  }, [fails]);

  const d = useMemo(() => (board ? trackD(path, board.cols) : ""), [board, path]);

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <svg viewBox="-160 -60 320 120" className="mb-3 w-64" aria-hidden>
              <path d="M-160 20H160" stroke="#7A4A22" strokeWidth="44" strokeDasharray="10 16" />
              <path d="M-160 20H160" stroke="#C9CDD2" strokeWidth="30" />
              <path d="M-160 20H160" stroke="#A96F3D" strokeWidth="20" />
              <g transform="translate(-30 20)">
                <Carriage riders={2} />
              </g>
              <g transform="translate(46 20)">
                <Engine />
              </g>
              <circle className="train-puff-loop" cx="62" cy="-10" r="12" fill="#fff" opacity="0.8" />
            </svg>
            <h1 className="toy-title text-5xl sm:text-6xl">Train Track</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Draw the track to the station!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick a map</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<MapPreview variant={l.id} />}
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
  const { cols, rows, cells } = board;
  const W = cols * 100;
  const H = rows * 100;
  const [sx, sy] = centre(board.start, cols);
  const [ex, ey] = centre(board.end, cols);
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];
  const done = phase === "arrived" || phase === "won" ? b + 1 : b;
  const riders = boarded.size;
  const onTrack = new Set(path);

  const prompt =
    phase === "drive"
      ? "Choo choo!"
      : phase === "arrived"
        ? "The train made it with everything!"
        : phase === "missed"
          ? "Oh no! The train missed some things."
          : canGo
            ? "Track done! Did you get everything? Press Go!"
            : path.length <= 1
              ? goalText(board.stops.length)
              : "Keep going to the station with the flag!";

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={BOARDS} done={done} label={`Map ${b + 1} of ${BOARDS}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 min-h-[3.25rem] text-center text-lg leading-snug font-medium sm:min-h-0 sm:text-xl" aria-live="polite">
        {prompt}
      </p>

      {/* Wooden collection tray: slots fill as the train picks things up */}
      <div className="flex justify-center pt-2">
        <div
          className="collect-tray"
          role="status"
          aria-label={`Stars collected: ${filled.stars} of ${board.stars.length}${board.stops.length ? `. Passengers: ${filled.kids} of ${board.stops.length}` : ""}`}
        >
          {board.stars.map((_, k) => (
            <span
              key={`st${b}-${k}`}
              ref={(el) => {
                starSlots.current[k] = el;
              }}
              className="tray-slot"
              data-filled={k < filled.stars}
            >
              <StarIcon size={30} on={k < filled.stars} surface="wood" />
            </span>
          ))}
          {board.stops.length > 0 && <span className="tray-divider" aria-hidden />}
          {board.stops.map((_, k) => (
            <span
              key={`kd${b}-${k}`}
              ref={(el) => {
                kidSlots.current[k] = el;
              }}
              className="tray-slot tray-seat"
              data-filled={k < filled.kids}
            >
              <span className="block h-[30px] w-[22px]">
                <KidIcon on={k < filled.kids} />
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Things flying from the map into the tray */}
      {flyers.map((f) => (
        <span
          key={f.id}
          className="tray-flyer"
          style={{ left: f.x, top: f.y, width: f.size, height: f.size, "--dx": `${f.dx}px`, "--dy": `${f.dy}px` }}
          onAnimationEnd={() => land(f)}
          aria-hidden
        >
          {f.kind === "star" ? (
            <StarIcon size={f.size} />
          ) : (
            <span className="block h-full w-[75%]">
              <KidIcon on />
            </span>
          )}
        </span>
      ))}

      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 py-2">
        <div key={`map-${b}`} className="felt board-in p-2.5 sm:p-3.5">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="train-map"
            style={{ width: `min(calc(100vw - 3.5rem), 30rem, calc((100dvh - 21rem) * ${cols} / ${rows}))` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            data-route={board.route.join(",")}
            data-start-cell={board.start}
            data-end-cell={board.end}
            data-stars={board.stars.join(",")}
            data-stops={board.stops.join(",")}
            role="application"
            aria-label="Map. Slide from the train to draw a track to the station."
          >
            <defs>
              <mask id={`rails-${b}`} maskUnits="userSpaceOnUse">
                <rect width={W} height={H} fill="#fff" />
                <path d={d} fill="none" stroke="#000" strokeWidth="22" strokeLinejoin="round" />
              </mask>
            </defs>

            {/* faint square grid so kids can see where track can go */}
            {cells.map((kind, i) => {
              const [x, y] = centre(i, cols);
              return <rect key={`g${i}`} x={x - 47} y={y - 47} width="94" height="94" rx="12" className="map-cell" data-kind={kind} />;
            })}

            {/* obstacles */}
            {cells.map((kind, i) => {
              if (kind === "grass") return null;
              const [x, y] = centre(i, cols);
              return (
                <g key={`o${i}`} transform={`translate(${x} ${y})`}>
                  {kind === "tree" ? <Tree /> : kind === "rock" ? <Rock /> : <Pond />}
                </g>
              );
            })}

            {/* stations */}
            <g transform={`translate(${sx} ${sy})`}>
              <Station />
            </g>
            <g transform={`translate(${ex} ${ey})`} className="map-goal" data-done={complete}>
              <Station flag />
            </g>

            {/* passenger platforms sit under the track */}
            {board.stops.map((i) => {
              const [x, y] = centre(i, cols);
              return (
                <g key={`pl${i}`} transform={`translate(${x} ${y})`}>
                  <StopPlatform />
                </g>
              );
            })}

            {/* track: sleepers, then two steel rails (a wide stroke with its middle masked out) */}
            {d && (
              <g className="track">
                <path d={d} fill="none" stroke="#7A4A22" strokeWidth="46" strokeDasharray="9 15" strokeLinejoin="round" />
                <path d={d} fill="none" stroke="#B9BEC4" strokeWidth="32" strokeLinejoin="round" mask={`url(#rails-${b})`} />
                <path d={d} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeLinejoin="round" transform="translate(-1 -1)" mask={`url(#rails-${b})`} />
              </g>
            )}
            <path ref={trackRef} d={d || `M${sx} ${sy}h1`} fill="none" stroke="none" />

            {/* stars and passengers; a glowing ring means "the train will get this one" */}
            {board.stars.map((i) => {
              if (got.has(i)) return null;
              const [x, y] = centre(i, cols);
              return (
                <g key={`s${i}`} transform={`translate(${x} ${y})`}>
                  {phase === "missed" ? <circle r="38" className="missed-ring" /> : onTrack.has(i) && <circle r="36" className="on-track-ring" />}
                  <StarPickup />
                </g>
              );
            })}
            {board.stops.map((i) => {
              const [x, y] = centre(i, cols);
              return (
                <g key={`p${i}`} transform={`translate(${x} ${y})`} className="map-stop" data-need={phase === "missed" && !boarded.has(i)}>
                  <Stop boarded={boarded.has(i)} />
                </g>
              );
            })}

            {/* where to start drawing */}
            {phase === "draw" && !drawn && path.length <= 1 && <circle cx={sx} cy={sy} r="46" className="map-start-ring" />}

            {/* the train */}
            <g ref={carriageRef} transform={`translate(${sx - CARRIAGE_GAP} ${sy})`}>
              <Carriage riders={riders} />
            </g>
            <g ref={engineRef} transform={`translate(${sx} ${sy})`}>
              <Engine />
            </g>
            {puffs.map((p) => (
              <circle key={p.id} cx={p.x} cy={p.y} r="12" className="train-puff" />
            ))}
          </svg>
        </div>

        <div className="flex w-full max-w-sm items-center gap-4">
          <button onClick={clearTrack} className="knob shrink-0" aria-label="Clear the track" disabled={phase !== "draw" || path.length <= 1}>
            <ReplayIcon />
          </button>
          <button onClick={drive} className="btn go-btn flex-1" data-go data-ready={canGo} disabled={!canGo}>
            <PlayIcon /> Go!
          </button>
        </div>

        {cheer && (
          <div
            key={cheer.id}
            className="cheer pointer-events-none absolute top-1/2 left-1/2 z-10 text-3xl whitespace-nowrap sm:text-5xl"
            onAnimationEnd={(ev) => ev.animationName === "cheer" && setCheer(null)}
          >
            {cheer.text}
          </div>
        )}

        {phase === "ready" && (
          <div className="absolute inset-0 z-10 grid place-items-center p-6">
            <div className="paper sheet-pop flex w-full max-w-xs flex-col items-center gap-3 px-6 pt-6 pb-5 text-center">
              <svg viewBox="-100 -50 200 100" className="w-40" aria-hidden>
                <path d="M-100 10H100" stroke="#7A4A22" strokeWidth="44" strokeDasharray="9 15" />
                <path d="M-100 10H100" stroke="#B9BEC4" strokeWidth="32" />
                <path d="M-100 10H100" stroke="#FFFAF0" strokeWidth="22" />
                <g transform="translate(-6 10)">
                  <Engine />
                </g>
                <g transform="translate(-70 10)">
                  <Carriage riders={1} />
                </g>
              </svg>
              <p className="printed text-2xl leading-tight font-bold">Draw the track!</p>
              <p className="printed-soft text-base leading-snug">Slide your finger from the train to the station with the flag.</p>
              <div className="flex w-full flex-col gap-2 rounded-xl bg-[rgba(120,80,40,0.08)] px-3 py-2.5 text-left">
                <span className="printed flex items-center gap-2.5 text-base font-medium">
                  <span className="shrink-0">
                    <StarIcon size={26} />
                  </span>
                  Go over every star
                </span>
                {level.stops > 0 && (
                  <span className="printed flex items-center gap-2.5 text-base font-medium">
                    <span className="h-8 w-[26px] shrink-0">
                      <KidIcon on />
                    </span>
                    {level.stops > 1 ? "Pick up both passengers" : "Pick up the passenger"}
                  </span>
                )}
              </div>
              <p className="printed-soft text-base leading-snug">Then press Go!</p>
              <button onClick={go} className="btn mt-1 w-full" data-start autoFocus>
                <PlayIcon /> Start
              </button>
            </div>
          </div>
        )}
      </div>

      {missed && (
        <div className="scrim fixed inset-0 z-20 flex items-end justify-center sm:items-center sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="missed-title" className="paper sheet relative text-center">
            <span className="sheet-handle" aria-hidden />
            <div className="isolate inline-block">
              <h2 id="missed-title" className="ribbon text-3xl sm:text-4xl">
                Oh no!
              </h2>
            </div>
            <p className="printed mt-5 text-xl font-medium">The train missed {missedText(missed.stars, missed.kids)}.</p>
            <div className="my-4 flex items-center justify-center gap-2" aria-hidden>
              {Array.from({ length: missed.stars }, (_, k) => (
                <span key={`ms${k}`} className="missed-item">
                  <StarIcon size={40} />
                </span>
              ))}
              {Array.from({ length: missed.kids }, (_, k) => (
                <span key={`mk${k}`} className="missed-item h-12 w-9">
                  <KidIcon on />
                </span>
              ))}
            </div>
            <p className="printed-soft text-base">Draw the track over everything, then try again.</p>
            <div className="mt-6 flex flex-col gap-4">
              <button onClick={() => retry(true)} className="btn w-full" autoFocus>
                <ReplayIcon /> Fix the track
              </button>
              <button
                onClick={() => retry(false)}
                className="printed-soft min-h-12 text-lg font-semibold underline decoration-2 underline-offset-4"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "won" && (
        <WinSheet
          stars={starsFor(fails)}
          summary={`All aboard! You collected everything on ${BOARDS} maps`}
          detail={fails === 0 ? "First try every time!" : `${fails} ${fails === 1 ? "map needed" : "tries needed"} another go`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
