"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon, PlayIcon } from "@/components/icons";
import { BoardPreview, CUP_REST_Y, Chute, Cup, CupBack, CupFront, MARBLE_R, Marble, Ramp, TILT } from "./art";

const CUP_Y_OFFSET = 58; // cup origin below the last row of pegs

const GAME = "marble";
const BOARDS = 3;
const TOP = 100; // space for the chute
const BOTTOM = 120; // space for the cup

const LEVELS = [
  { id: "easy", name: "Easy", cols: 4, rows: 4, density: 0.38, locked: 0.15, minFlips: 2, detail: "4 × 4 pegboard" },
  { id: "medium", name: "Medium", cols: 5, rows: 5, density: 0.36, locked: 0.25, minFlips: 3, detail: "5 × 5, some nailed ramps" },
  { id: "hard", name: "Big", cols: 5, rows: 7, density: 0.36, locked: 0.35, minFlips: 4, detail: "Tall board, more ramps" },
];

const rand = (n) => Math.floor(Math.random() * n);
const idx = (r, c, cols) => r * cols + c;

/**
 * Where does the marble go? Drops down column `col`; every ramp it meets sends it
 * one column left or right. Returns the ramps it touched and where it ended:
 * { col } in the tray, or { off: side } if it rolled off the board.
 */
function simulate(board, dirs) {
  const { cols, rows, ramps } = board;
  let c = board.start;
  const touched = [];
  for (let r = 0; r < rows; r++) {
    const i = idx(r, c, cols);
    if (!ramps[i]) continue;
    touched.push(i);
    c += dirs[i];
    if (c < 0 || c >= cols) return { touched, off: c < 0 ? -1 : 1, lastRow: r };
  }
  return { touched, col: c };
}

function makeBoard(level) {
  const { cols, rows } = level;
  for (let attempt = 0; attempt < 400; attempt++) {
    const ramps = Array.from({ length: cols * rows }, () =>
      Math.random() < level.density ? { locked: Math.random() < level.locked, paint: rand(4) } : null
    );
    // Never two ramps side by side in a row: a marble hopping off one ramp
    // would visibly pass through its neighbour.
    ramps.forEach((ramp, i) => {
      if (ramp && i % cols > 0 && ramps[i - 1]) ramps[i] = null;
    });
    const solution = ramps.map((ramp) => (ramp ? (Math.random() < 0.5 ? -1 : 1) : 0));
    const start = rand(cols);
    const board = { cols, rows, ramps, start };
    const run = simulate(board, solution);
    if (run.off != null) continue;
    const flipsOnPath = run.touched.filter((i) => !ramps[i].locked);
    if (flipsOnPath.length < level.minFlips) continue;
    // The cup shouldn't sit right under the chute with nothing in between.
    if (run.col === start && run.touched.length < 3) continue;
    // Scramble the flippable ramps; the marble must miss to begin with.
    const dirs = [...solution];
    flipsOnPath.forEach((i) => {
      if (Math.random() < 0.6) dirs[i] = -dirs[i];
    });
    ramps.forEach((ramp, i) => {
      if (ramp && !ramp.locked && !flipsOnPath.includes(i) && Math.random() < 0.5) dirs[i] = -dirs[i];
    });
    const now = simulate(board, dirs);
    if (now.col === run.col) continue;
    return { ...board, target: run.col, solution, dirs };
  }
  // Rare: no good board with this many ramps — try again with a few more.
  return makeBoard({ ...level, density: Math.min(0.7, level.density + 0.05) });
}

/* ---------- Geometry for the drop animation ---------- */
const cellX = (c) => c * 100 + 50;
const cellY = (r) => TOP + r * 100 + 50;
const rad = (deg) => (deg * Math.PI) / 180;
/** A point on top of ramp (r,c) tilted by `dir`, `local` units along the plank from its peg. */
function onRamp(r, c, dir, local) {
  const a = rad(dir * TILT);
  const y0 = -10 - MARBLE_R; // marble sits on the top surface
  return [cellX(c) + local * Math.cos(a) - y0 * Math.sin(a), cellY(r) + local * Math.sin(a) + y0 * Math.cos(a)];
}

/** Turn a simulated run into animation segments. */
function buildSegments(board, dirs) {
  const { cols, rows, ramps, start, target } = board;
  const H = TOP + rows * 100 + BOTTOM;
  const segs = [];
  let pos = [cellX(start), 46];
  let c = start;
  const push = (to, kind, sound) => {
    segs.push({ from: pos, to, kind, sound });
    pos = to;
  };
  for (let r = 0; r < rows; r++) {
    const i = idx(r, c, cols);
    if (!ramps[i]) continue;
    const d = dirs[i];
    // Land exactly where the column meets the top of the plank (no sideways jump).
    const touch = (-10 - MARBLE_R) * Math.tan(rad(d * TILT));
    push(onRamp(r, c, d, touch), "fall", "clack");
    push(onRamp(r, c, d, d * 42), "roll"); // roll down to its low end
    const nc = c + d;
    if (nc < 0 || nc >= cols) {
      // Rolls off the side of the board.
      push([cellX(c) + d * 90, cellY(r) + 40], "hop");
      push([cellX(c) + d * 110, H + 60], "fall");
      return { segs, result: "off" };
    }
    push([cellX(nc), cellY(r) + 46], "hop");
    c = nc;
  }
  if (c === target) {
    const cupY = TOP + rows * 100 + CUP_Y_OFFSET;
    push([cellX(c), cupY - 26], "fall"); // to just above the rim
    push([cellX(c), cupY + CUP_REST_Y], "settle", "plink"); // drop inside, behind the front wall
    return { segs, result: "cup" };
  }
  push([cellX(c), H - MARBLE_R - 6], "fall", "clack");
  push([cellX(c) + (c < target ? -20 : 20), H - MARBLE_R - 6], "roll");
  return { segs, result: "floor" };
}

const durationOf = (seg) => {
  const dx = seg.to[0] - seg.from[0];
  const dy = seg.to[1] - seg.from[1];
  const dist = Math.hypot(dx, dy);
  if (seg.kind === "fall") return Math.max(140, Math.sqrt(Math.max(dy, 1)) * 26);
  if (seg.kind === "roll") return 230;
  if (seg.kind === "hop") return 200;
  return Math.max(120, dist * 6);
};
const ease = { fall: (t) => t * t, roll: (t) => t * (2 - t) * 0.4 + t * 0.6, hop: (t) => t, settle: (t) => 1 - (1 - t) * (1 - t) };

function starsFor(misses) {
  if (misses === 0) return 3;
  if (misses <= 2) return 2;
  return 1;
}

export default function MarbleGame() {
  const [levelId, setLevelId] = useState(null);
  const [boards, setBoards] = useState(null);
  const [b, setB] = useState(0);
  const [dirs, setDirs] = useState([]);
  const [phase, setPhase] = useState("ready"); // ready | set | rolling | scored | missed | won
  const [misses, setMisses] = useState(0); // whole round
  const [boardMisses, setBoardMisses] = useState(0);
  const [missWhy, setMissWhy] = useState(null); // "off" | "floor"
  const [flipping, setFlipping] = useState(null); // { i, n } to replay the flip wobble
  const [cheer, setCheer] = useState(null);

  const best = useBestStars(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
  const board = boards?.[b];

  const marbleRef = useRef(null);
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

  const placeMarble = (x, y, spin = 0) => marbleRef.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${spin})`);

  const loadBoard = (bd) => {
    setDirs([...bd.dirs]);
    setBoardMisses(0);
    setMissWhy(null);
  };

  const start = useCallback((lvlId) => {
    clearTimers();
    const lvl = LEVELS.find((l) => l.id === lvlId);
    const bs = Array.from({ length: BOARDS }, () => makeBoard(lvl));
    setLevelId(lvlId);
    setBoards(bs);
    setB(0);
    setMisses(0);
    setCheer(null);
    setDirs([...bs[0].dirs]);
    setBoardMisses(0);
    setMissWhy(null);
    setPhase("ready");
  }, []);

  const go = () => {
    sound.tap(); // unlocks audio on iOS
    sound.say("Tap the ramps to flip them. Then press drop!");
    setPhase("set");
  };

  const backToMenu = () => {
    clearTimers();
    setLevelId(null);
    setBoards(null);
  };

  const flip = (i) => {
    if (phase !== "set" && phase !== "missed") return;
    if (!board.ramps[i] || board.ramps[i].locked) return;
    sound.click();
    setDirs((ds) => ds.map((d, k) => (k === i ? -d : d)));
    setFlipping({ i, n: ++ids.current });
    if (phase === "missed") {
      setPhase("set");
      setMissWhy(null);
    }
  };

  const drop = () => {
    if (phase !== "set" && phase !== "missed") return;
    setPhase("rolling");
    setMissWhy(null);
    sound.pop();
    const { segs, result } = buildSegments(board, dirs);
    let k = 0;
    let t0 = null; // set from the first animation frame
    let spin = 0;
    let prevX = segs[0].from[0];
    const tick = (t) => {
      if (t0 === null) t0 = t;
      const seg = segs[k];
      const dur = durationOf(seg);
      const p = Math.min(1, (t - t0) / dur);
      const e = (ease[seg.kind] || ((x) => x))(p);
      const [ax, ay] = seg.from;
      const [bx, by] = seg.to;
      let x;
      let y;
      if (seg.kind === "hop") {
        // Leave the end of the ramp moving sideways, then curve down (a little arc).
        const cx = ax + (bx - ax) * 0.7;
        const cy = ay + (by - ay) * 0.1;
        x = (1 - e) * (1 - e) * ax + 2 * (1 - e) * e * cx + e * e * bx;
        y = (1 - e) * (1 - e) * ay + 2 * (1 - e) * e * cy + e * e * by;
      } else {
        x = ax + (bx - ax) * e;
        y = ay + (by - ay) * e;
      }
      // Turn by the distance actually rolled (about 4° per unit for a marble this size).
      spin += (x - prevX) * (360 / (2 * Math.PI * MARBLE_R));
      prevX = x;
      placeMarble(x, y, spin);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      if (seg.sound) sound[seg.sound]();
      k++;
      t0 = t;
      if (k < segs.length) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      finish(result);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const finish = (result) => {
    if (result === "cup") {
      setPhase("scored");
      sound.match();
      sound.say("In the cup!");
      setCheer({ id: ++ids.current, text: "In the cup!" });
      later(() => {
        if (b + 1 >= BOARDS) {
          saveStars(GAME, level.id, starsFor(missesRef.current));
          sound.win();
          setPhase("won");
        } else {
          setB(b + 1);
          loadBoard(boards[b + 1]);
          setPhase("set");
          sound.pop();
        }
      }, 1700);
      return;
    }
    sound.miss();
    sound.say(result === "off" ? "Oops! It rolled off. Flip some ramps!" : "So close! Flip some ramps and try again.");
    setMisses((m) => m + 1);
    setBoardMisses((m) => m + 1);
    setMissWhy(result);
    later(() => {
      placeMarble(cellX(board.start), 46);
      setPhase("missed");
    }, 900);
  };

  // Latest total misses for the timeout above.
  const missesRef = useRef(0);
  useEffect(() => {
    missesRef.current = misses;
  }, [misses]);

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <svg viewBox="0 0 300 200" className="mb-3 w-56" aria-hidden>
              <g transform="translate(70 40)">
                <Marble />
              </g>
              <g transform="translate(100 80)">
                <Ramp dir={1} paint={0} />
              </g>
              <g transform="translate(200 120)">
                <Ramp dir={-1} paint={1} />
              </g>
              <g transform="translate(110 160) scale(0.7)">
                <Cup />
              </g>
            </svg>
            <h1 className="toy-title text-5xl sm:text-6xl">Marble Run</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Flip the ramps. Roll the marble into the cup!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick a pegboard</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={
                    <BoardPreview
                      ramps={
                        l.id === "easy"
                          ? [[100, 130, 1, false], [190, 190, -1, false]]
                          : l.id === "medium"
                            ? [[90, 110, 1, false], [200, 150, -1, true], [120, 200, 1, false]]
                            : [[80, 100, 1, true], [190, 120, -1, false], [110, 170, 1, false], [220, 200, -1, true]]
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
  const { cols, rows, ramps, start: startCol, target } = board;
  const W = cols * 100;
  const H = TOP + rows * 100 + BOTTOM;
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];
  const done = phase === "scored" || phase === "won" ? b + 1 : b;
  const busy = phase === "rolling" || phase === "scored";
  // Hint after two misses on this board: first ramp along the right route that is the wrong way round.
  let hintRamp = -1;
  if (boardMisses >= 2 && !busy) {
    const route = simulate(board, board.solution).touched;
    hintRamp = route.find((i) => !ramps[i].locked && dirs[i] !== board.solution[i]) ?? -1;
  }

  const prompt =
    phase === "rolling"
      ? "Here it goes..."
      : phase === "scored"
        ? "In the cup!"
        : missWhy === "off"
          ? "It rolled off! Flip some ramps and drop again."
          : missWhy === "floor"
            ? "Missed the cup! Flip some ramps and drop again."
            : hintRamp >= 0
              ? "Try flipping the glowing ramp!"
              : "Tap the coloured ramps to flip them. Then press Drop!";

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={BOARDS} done={done} label={`Board ${b + 1} of ${BOARDS}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 min-h-[3.25rem] text-center text-lg leading-snug font-medium sm:min-h-0 sm:text-xl" aria-live="polite">
        {prompt}
      </p>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 py-2">
        <div key={`board-${b}`} className="pegboard board-in">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block"
            style={{ width: `min(calc(100vw - 3rem), 26rem, calc((100dvh - 15rem) * ${W} / ${H}))`, height: "auto" }}
            data-target={target}
            data-solution={board.solution.join(",")}
            role="application"
            aria-label="Pegboard. Tap the coloured ramps to flip them, then press Drop."
          >
            {/* peg holes */}
            {Array.from({ length: cols * (rows + 1) }, (_, i) => {
              const c = i % cols;
              const r = Math.floor(i / cols);
              return <circle key={`h${i}`} cx={c * 100 + 50} cy={TOP + r * 100} r="4.5" className="peg-hole" />;
            })}

            {/* target cup with a little guide line from above */}
            <path d={`M${cellX(target)} ${TOP + rows * 100 - 10}v24`} stroke="#fff6a8" strokeWidth="4" strokeDasharray="5 5" opacity="0.7" />
            {/* back of the cup sits behind the marble... */}
            <g transform={`translate(${cellX(target)} ${TOP + rows * 100 + CUP_Y_OFFSET})`}>
              <CupBack />
            </g>

            {/* ramps */}
            {ramps.map((ramp, i) => {
              if (!ramp) return null;
              const r = Math.floor(i / cols);
              const c = i % cols;
              return (
                <g
                  key={`r${i}`}
                  transform={`translate(${cellX(c)} ${cellY(r)})`}
                  className="ramp"
                  data-locked={ramp.locked}
                  data-hint={hintRamp === i}
                  data-index={i}
                  data-dir={dirs[i]}
                  onClick={() => flip(i)}
                  role={ramp.locked ? undefined : "button"}
                  aria-label={ramp.locked ? undefined : `Ramp sloping ${dirs[i] > 0 ? "right" : "left"}. Tap to flip.`}
                  tabIndex={ramp.locked ? undefined : 0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      flip(i);
                    }
                  }}
                >
                  {/* big invisible tap target */}
                  <rect x="-50" y="-50" width="100" height="100" fill="transparent" />
                  <g key={flipping?.i === i ? flipping.n : "rest"} className={flipping?.i === i ? "ramp-flip" : undefined}>
                    <Ramp dir={dirs[i]} locked={ramp.locked} paint={ramp.paint} />
                  </g>
                </g>
              );
            })}

            {/* chute + marble */}
            <g transform={`translate(${cellX(startCol)} 40)`}>
              <Chute />
            </g>
            <g key={`marble-${b}`} ref={marbleRef} transform={`translate(${cellX(startCol)} 46)`} className="marble">
              <Marble />
            </g>

            {/* ...and its front wall in front, so the marble drops INTO the cup */}
            <g
              transform={`translate(${cellX(target)} ${TOP + rows * 100 + CUP_Y_OFFSET})`}
              className="marble-cup"
              data-full={phase === "scored" || phase === "won"}
            >
              <CupFront />
            </g>
          </svg>
        </div>

        <button onClick={drop} className="btn btn-blue w-full max-w-sm" data-drop disabled={busy || phase === "ready"} data-ready={phase === "set" || phase === "missed"}>
          <PlayIcon /> Drop!
        </button>

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
              <svg viewBox="0 0 200 130" className="w-40" aria-hidden>
                <g transform="translate(60 22)">
                  <Marble />
                </g>
                <g transform="translate(80 62)">
                  <Ramp dir={1} paint={2} />
                </g>
                <g transform="translate(150 100) scale(0.6)">
                  <Cup />
                </g>
              </svg>
              <p className="printed text-2xl leading-tight font-bold">Get the marble in the cup!</p>
              <p className="printed-soft text-base leading-snug">Tap a coloured ramp to flip it. Wooden ramps are nailed down. Then press Drop!</p>
              <button onClick={go} className="btn mt-1 w-full" data-start autoFocus>
                <PlayIcon /> Start
              </button>
            </div>
          </div>
        )}
      </div>

      {phase === "won" && (
        <WinSheet
          stars={starsFor(misses)}
          summary={`${BOARDS} marbles in the cup!`}
          detail={misses === 0 ? "Every drop went in first time!" : `${level.name} · ${misses} miss${misses > 1 ? "es" : ""}`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
