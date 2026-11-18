"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon } from "@/components/icons";
import { BoardPreview, Hole, PIECE_PAINTS, Piece, SHAPE_NAMES } from "./art";

const GAME = "shapes";
const BOARDS = 2;

const LEVELS = [
  { id: "easy", name: "Easy", shapes: 3, cols: 3, tint: true, pool: ["circle", "square", "triangle", "star", "heart"] },
  { id: "medium", name: "Medium", shapes: 4, cols: 2, tint: false, pool: ["circle", "square", "triangle", "star", "heart", "diamond"] },
  { id: "hard", name: "Big", shapes: 6, cols: 3, tint: false, pool: ["circle", "square", "triangle", "star", "heart", "diamond"] },
];

const CHEERS = ["Great fit!", "Super!", "All done!", "Brilliant!"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One board: holes in one order, the same shapes as loose pieces in another. */
function makeBoard(level) {
  const shapes = shuffle(level.pool).slice(0, level.shapes);
  const paints = shuffle(Object.keys(PIECE_PAINTS));
  const pieces = shapes.map((shape, i) => ({
    shape,
    paint: paints[i % paints.length],
    tilt: Math.round((Math.random() - 0.5) * 30),
  }));
  let tray = shuffle(pieces);
  // Never line the tray up exactly under its holes.
  for (let t = 0; t < 10 && tray.every((p, i) => p.shape === shapes[i]); t++) tray = shuffle(pieces);
  return { holes: shapes, tray };
}

function starsFor(mistakes) {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

export default function ShapesGame() {
  const [levelId, setLevelId] = useState(null);
  const [boards, setBoards] = useState(null);
  const [b, setB] = useState(0); // current board
  const [placed, setPlaced] = useState(() => new Set()); // shapes seated on this board
  const [held, setHeld] = useState(null); // shape picked up by tapping (tap-tap mode)
  const [hover, setHover] = useState(null); // hole index under a dragged piece
  const [nope, setNope] = useState(null); // { hole, id }
  const [misses, setMisses] = useState({}); // shape -> wrong tries on this board
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState("play"); // play | done (board finished) | won
  const [cheer, setCheer] = useState(null);

  const best = useBestStars(GAME);
  const level = LEVELS.find((l) => l.id === levelId);

  const pieceRefs = useRef({});
  const holeRefs = useRef([]);
  const drag = useRef(null);
  const busy = useRef(false);
  const timers = useRef([]);
  const ids = useRef(0);
  const nextId = () => ++ids.current;

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const resetBoard = () => {
    setPlaced(new Set());
    setHeld(null);
    setHover(null);
    setNope(null);
    setMisses({});
    setPhase("play");
    busy.current = false;
  };

  const start = useCallback((lvlId) => {
    clearTimers();
    const lvl = LEVELS.find((l) => l.id === lvlId);
    setLevelId(lvlId);
    setBoards(Array.from({ length: BOARDS }, () => makeBoard(lvl)));
    setB(0);
    setMistakes(0);
    setCheer(null);
    resetBoard();
    sound.pop();
  }, []);

  const backToMenu = () => {
    clearTimers();
    setLevelId(null);
    setBoards(null);
  };

  const board = boards?.[b];

  /** Move a piece element; `transition` animates it. */
  const place = (el, x, y, { scale = 1, rotate = 0, transition = "" } = {}) => {
    if (!el) return;
    el.style.transition = transition;
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
  };

  const settleBack = (shape) => {
    const el = pieceRefs.current[shape];
    place(el, 0, 0, { transition: "transform 420ms cubic-bezier(.34,1.5,.5,1)" });
    if (el) el.dataset.lifted = "false";
  };

  /** Try `shape` in hole `h`. `offset` = where the piece currently is (if dragged). */
  const tryFit = (shape, h, offset = { x: 0, y: 0 }) => {
    if (busy.current || phase !== "play") return;
    const target = board.holes[h];
    if (placed.has(target)) {
      settleBack(shape);
      return;
    }
    const el = pieceRefs.current[shape];
    if (target === shape) {
      busy.current = true;
      // Glide into the hole, straighten up, then drop in.
      const from = el.getBoundingClientRect();
      const to = holeRefs.current[h].getBoundingClientRect();
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      el.dataset.lifted = "true"; // straightens the resting tilt (CSS)
      place(el, offset.x + dx, offset.y + dy, {
        scale: to.width / el.offsetWidth, // offsetWidth ignores the lift scale
        transition: "transform 300ms cubic-bezier(.3,.9,.4,1)",
      });
      later(() => {
        sound.clunk();
        sound.say(SHAPE_NAMES[shape]);
        const next = new Set(placed);
        next.add(shape);
        setPlaced(next);
        setHeld(null);
        setHover(null);
        busy.current = false;
        if (next.size === board.holes.length) finishBoard();
      }, 300);
    } else {
      sound.boing();
      setMistakes((m) => m + 1);
      setMisses((m) => ({ ...m, [shape]: (m[shape] || 0) + 1 }));
      setNope({ hole: h, id: nextId() });
      setHeld(null);
      setHover(null);
      settleBack(shape);
    }
  };

  const finishBoard = () => {
    setPhase("done");
    later(() => {
      sound.match();
      setCheer({ id: nextId(), text: CHEERS[Math.floor(Math.random() * CHEERS.length)] });
    }, 250);
    later(() => {
      if (b + 1 >= BOARDS) {
        saveStars(GAME, level.id, starsFor(mistakes));
        sound.win();
        setPhase("won");
      } else {
        setB(b + 1);
        resetBoard();
        sound.pop();
      }
    }, 1900);
  };

  /* ---------- Dragging ---------- */
  const holeAt = (x, y) => {
    for (let i = 0; i < holeRefs.current.length; i++) {
      const el = holeRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const pad = r.width * 0.15;
      if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) return i;
    }
    return null;
  };

  const onPointerDown = (shape) => (e) => {
    if (busy.current || phase !== "play" || placed.has(shape)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.getBoundingClientRect();
    drag.current = {
      shape,
      startX: e.clientX,
      startY: e.clientY,
      grabX: e.clientX - (box.left + box.width / 2),
      grabY: e.clientY - (box.top + box.height / 2),
      offset: { x: 0, y: 0 },
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dx) + Math.abs(dy) > 6) {
      d.moved = true;
      setHeld(null);
      sound.tap();
      e.currentTarget.dataset.lifted = "true";
    }
    if (!d.moved) return;
    // Centre the piece just above the fingertip so it stays visible.
    const x = dx + d.grabX;
    const y = dy + d.grabY - 24;
    d.offset = { x, y };
    place(e.currentTarget, x, y, { scale: 1.12 });
    const over = holeAt(e.clientX, e.clientY - 24);
    setHover((h) => (h === over ? h : over));
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (!d.moved) {
      // Tap: pick the piece up (or put it down again) and say its name.
      setHeld((h) => (h === d.shape ? null : d.shape));
      sound.say(SHAPE_NAMES[d.shape]);
      return;
    }
    const over = holeAt(e.clientX, e.clientY - 24);
    setHover(null);
    e.currentTarget.dataset.lifted = "false";
    if (over != null) tryFit(d.shape, over, d.offset);
    else settleBack(d.shape);
  };

  const onHoleTap = (h) => {
    if (held) tryFit(held, h);
    else sound.say(SHAPE_NAMES[board.holes[h]]);
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="sorter-board mb-5 grid w-44 grid-cols-3 gap-2 p-3" aria-hidden>
              {["star", "circle", "heart"].map((s, i) => (
                <span key={s} className="relative aspect-square">
                  <Hole shape={s} />
                  {i !== 1 && (
                    <span className="absolute inset-0">
                      <Piece shape={s} paint={i ? "blue" : "yellow"} seated />
                    </span>
                  )}
                </span>
              ))}
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Shape Sorter</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Fit every shape into its hole!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick how many shapes</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<BoardPreview count={l.shapes} />}
                  name={l.name}
                  detail={`${l.shapes} shapes${l.tint ? " · colour hints" : ""}`}
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
  const total = BOARDS * level.shapes;
  const done = b * level.shapes + placed.size;
  const rows = Math.ceil(level.shapes / level.cols);
  const pieceColour = Object.fromEntries(board.tray.map((p) => [p.shape, p.paint]));
  const hintShape = Object.entries(misses).find(([s, n]) => n >= 2 && !placed.has(s))?.[0];
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={total} done={done} label={`${done} of ${total} shapes fitted`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {phase === "done"
          ? "The board is full!"
          : held
            ? `Now tap the ${SHAPE_NAMES[held]} hole!`
            : placed.size === 0 && b === 0
              ? "Drag each shape into its hole!"
              : "Which hole does it fit?"}
      </p>

      <div
        className="relative flex flex-1 flex-col items-center justify-center gap-5 py-3"
        style={{ "--cols": level.cols, "--rows": rows }}
      >
        {/* Wooden board with holes */}
        <div key={`board-${b}`} className="sorter-board sorter-play board-in" data-done={phase === "done"}>
          {board.holes.map((shape, h) => (
            <button
              key={shape}
              ref={(el) => {
                holeRefs.current[h] = el;
              }}
              onClick={() => onHoleTap(h)}
              className="sorter-hole"
              data-hover={hover === h}
              data-hint={hintShape === shape}
              data-shape={shape}
              aria-label={placed.has(shape) ? `${SHAPE_NAMES[shape]}, done` : `${SHAPE_NAMES[shape]} hole`}
            >
              <span key={nope?.hole === h ? nope.id : "still"} className={`block h-full w-full ${nope?.hole === h ? "nope-shake" : ""}`}>
                <Hole shape={shape} tint={level.tint ? pieceColour[shape] : null} />
              </span>
              {placed.has(shape) && (
                <span className="sorter-seated" style={{ "--i": h }}>
                  <Piece shape={shape} paint={pieceColour[shape]} seated />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Felt tray with loose pieces */}
        <div key={`tray-${b}`} className="felt sorter-tray">
          {board.tray.map((p, i) => (
            <div
              key={p.shape}
              ref={(el) => {
                pieceRefs.current[p.shape] = el;
              }}
              className="sorter-piece"
              style={{ "--i": i, visibility: placed.has(p.shape) ? "hidden" : undefined }}
              data-held={held === p.shape}
              data-shape={p.shape}
              role="button"
              tabIndex={placed.has(p.shape) ? -1 : 0}
              aria-label={`${p.paint} ${SHAPE_NAMES[p.shape]} piece`}
              aria-pressed={held === p.shape}
              onPointerDown={onPointerDown(p.shape)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setHeld((h) => (h === p.shape ? null : p.shape));
                  sound.say(SHAPE_NAMES[p.shape]);
                }
              }}
            >
              {/* drag moves the outer div; this layer only plays the entrance */}
              <span className="sorter-piece-in">
                <span className="sorter-piece-art" style={{ "--tilt": `${p.tilt}deg` }}>
                  <Piece shape={p.shape} paint={p.paint} />
                </span>
              </span>
            </div>
          ))}
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
        <WinSheet
          stars={starsFor(mistakes)}
          summary={`You fitted all ${total} shapes!`}
          detail={mistakes === 0 ? "Perfect fitting!" : `${level.name} · ${mistakes} wrong hole${mistakes > 1 ? "s" : ""}`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
