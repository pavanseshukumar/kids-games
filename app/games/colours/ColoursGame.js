"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon } from "@/components/icons";
import { Bucket, COLOURS, ColourPreview, ItemArt, PaperBall, SHAPES, makeItem } from "./art";

const GAME = "colours";

const LEVELS = [
  { id: "easy", name: "Easy", colours: 2 },
  { id: "medium", name: "Medium", colours: 3 },
  { id: "hard", name: "Big", colours: 4 },
];
const PER_COLOUR = 3;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick the colours for a round and a queue of things to sort.
 * Each colour appears equally often, every thing is a different shape, and
 * shapes get a random colour each round, so kids sort by colour, not by shape.
 */
function makeRound(level) {
  const colours = shuffle(Object.keys(COLOURS)).slice(0, level.colours);
  const shapes = shuffle(SHAPES.map((s) => s.id));
  const slots = colours.flatMap((c) => Array(PER_COLOUR).fill(c));
  const items = slots.map((c, i) => makeItem(shapes[i], c));
  // Spread the order out so the same colour rarely comes three times in a row.
  let queue = shuffle(items);
  for (let tries = 0; tries < 20 && hasRunOf3(queue); tries++) queue = shuffle(items);
  return { colours, queue };
}

function hasRunOf3(queue) {
  return queue.some((it, i) => i >= 2 && it.colour === queue[i - 1].colour && it.colour === queue[i - 2].colour);
}

function starsFor(mistakes, total) {
  if (mistakes <= Math.floor(total / 6)) return 3;
  if (mistakes <= Math.ceil(total / 3)) return 2;
  return 1;
}

export default function ColoursGame() {
  const [levelId, setLevelId] = useState(null);
  const [round, setRound] = useState(null); // { colours, queue }
  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [misses, setMisses] = useState(0); // wrong tries on the current item
  const [won, setWon] = useState(false);
  const [hover, setHover] = useState(null);
  const [nope, setNope] = useState(null); // { colour, id } bucket shaking "no"
  const [splashes, setSplashes] = useState({}); // colour -> count, replays the slosh
  const [shake, setShake] = useState(0); // bumps when the item bounces back
  const [ball, setBall] = useState(false); // card scrunched into a paper ball while carried

  const best = useBestStars(GAME);
  const level = LEVELS.find((l) => l.id === levelId);

  const itemRef = useRef(null);
  const bucketRefs = useRef({});
  const busy = useRef(false);
  const drag = useRef(null);
  const timers = useRef([]);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const start = useCallback((lvlId) => {
    clearTimers();
    const lvl = LEVELS.find((l) => l.id === lvlId);
    setLevelId(lvlId);
    setRound(makeRound(lvl));
    setIndex(0);
    setMistakes(0);
    setMisses(0);
    setWon(false);
    setHover(null);
    setNope(null);
    setSplashes({});
    setShake(0);
    setBall(false);
    busy.current = false;
    sound.pop();
  }, []);

  const backToMenu = () => {
    clearTimers();
    setLevelId(null);
    setRound(null);
    setWon(false);
  };

  const item = round?.queue[index];

  /** Move the item element; `animate` springs it with a transition. */
  const place = (x, y, { scale = 1, rotate = 0, opacity = 1, transition = "" } = {}) => {
    const el = itemRef.current;
    if (!el) return;
    el.style.transition = transition;
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
    el.style.opacity = String(opacity);
  };

  const answer = (colour) => {
    if (busy.current || !item || won) return;
    busy.current = true;
    const offset = drag.current?.offset || { x: 0, y: 0 };
    drag.current = null;
    setHover(null);

    if (colour === item.colour) {
      // Tapped a bucket without dragging: scrunch the paper first, then throw it.
      const wasBall = ball;
      if (!wasBall) {
        sound.crumple();
        setBall(true);
      }
      const throwDelay = wasBall ? 0 : 260;
      later(() => {
        // Fly the ball into the bucket mouth.
        const itemBox = itemRef.current.getBoundingClientRect();
        const bucketBox = bucketRefs.current[colour].getBoundingClientRect();
        const dx = bucketBox.left + bucketBox.width / 2 - (itemBox.left + itemBox.width / 2);
        const dy = bucketBox.top + bucketBox.height * 0.3 - (itemBox.top + itemBox.height / 2);
        place(offset.x + dx, offset.y + dy, {
          scale: 0.5,
          rotate: 160,
          opacity: 0.3,
          transition: "transform 440ms cubic-bezier(.45,-0.35,.6,1), opacity 440ms ease-in",
        });
      }, throwDelay);
      later(() => {
        sound.splash();
        sound.say(COLOURS[colour].name);
        setSplashes((s) => ({ ...s, [colour]: (s[colour] || 0) + 1 }));
      }, throwDelay + 380);
      later(() => {
        const next = index + 1;
        setMisses(0);
        setShake(0);
        setBall(false);
        if (next >= round.queue.length) {
          setIndex(next);
          later(() => {
            saveStars(GAME, level.id, starsFor(mistakes, round.queue.length));
            sound.win();
            setWon(true);
          }, 350);
        } else {
          setIndex(next);
          sound.pop();
          busy.current = false;
        }
      }, throwDelay + 680);
    } else {
      sound.miss();
      setMistakes((m) => m + 1);
      setMisses((m) => m + 1);
      setNope({ colour, id: Date.now() });
      place(0, 0, { transition: "transform 380ms cubic-bezier(.34,1.5,.5,1)" });
      if (ball) {
        setBall(false);
        sound.unfold();
      }
      setShake((s) => s + 1);
      later(() => {
        busy.current = false;
      }, 420);
    }
  };

  /* ---------- Dragging (pointer events: works for touch, pen and mouse) ---------- */
  const bucketAt = (x, y) => {
    for (const [colour, el] of Object.entries(bucketRefs.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 24 && y <= r.bottom + 12) return colour;
    }
    return null;
  };

  const onPointerDown = (e) => {
    if (busy.current || won) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.getBoundingClientRect();
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      // where the finger grabbed, relative to the card centre
      grabX: e.clientX - (box.left + box.width / 2),
      grabY: e.clientY - (box.top + box.height / 2),
      offset: { x: 0, y: 0 },
      moved: false,
    };
    place(0, 0, { scale: 1.05, transition: "transform 120ms ease-out" });
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dx) + Math.abs(dy) > 6) {
      // Start carrying: scrunch the card into a ball that sits under the finger.
      d.moved = true;
      sound.crumple();
      setBall(true);
    }
    if (!d.moved) return;
    // Ball centre follows the finger (slightly above it so the finger doesn't hide it).
    const x = dx + d.grabX;
    const y = dy + d.grabY - 18;
    d.offset = { x, y };
    place(x, y, { rotate: dx * 0.6 });
    const over = bucketAt(e.clientX, e.clientY);
    setHover((h) => (h === over ? h : over));
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d) return;
    const over = bucketAt(e.clientX, e.clientY);
    if (d.moved && over) {
      answer(over);
      return;
    }
    drag.current = null;
    setHover(null);
    place(0, 0, { transition: "transform 380ms cubic-bezier(.34,1.4,.5,1)" });
    if (d.moved) {
      setBall(false); // dropped on the table: smooth the paper back out
      sound.unfold();
    } else {
      sound.say(`${COLOURS[item.colour].name} ${item.name}`); // a tap names it: "Blue star"
    }
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-end gap-1" aria-hidden>
              {["red", "yellow", "blue"].map((c, i) => (
                <span key={c} className={i === 1 ? "w-20" : "w-16"}>
                  <Bucket colour={c} />
                </span>
              ))}
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Colours</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Put each thing in the bucket of the same colour!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick how many colours</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<ColourPreview count={l.colours} />}
                  name={l.name}
                  detail={`${l.colours} colours`}
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
  const total = round.queue.length;
  const hintColour = misses >= 2 && item ? item.colour : null;
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={total} done={index} label={`${index} of ${total} sorted`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {!item ? "All sorted!" : misses ? "Try another bucket!" : index === 0 ? "Drag it into the same colour!" : "Where does this go?"}
      </p>

      {/* Stage: the thing to sort */}
      <div className="relative flex flex-1 items-center justify-center py-4">
        {item && (
          <div
            key={index}
            ref={itemRef}
            className="sort-item"
            data-ball={ball}
            role="img"
            aria-label={`${COLOURS[item.colour].name} ${item.name}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span key={shake} className={`absolute inset-0 ${shake ? "nope-shake" : "drop-in"}`}>
              <span className="paper sort-card">
                <ItemArt item={item} />
              </span>
              <span className="sort-ball">
                <PaperBall item={item} />
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Buckets in the thumb zone */}
      <div
        className="mx-auto grid w-full gap-3 pb-1 sm:gap-6"
        style={{ gridTemplateColumns: `repeat(${round.colours.length}, minmax(0, 1fr))`, maxWidth: `${round.colours.length * 10.5}rem` }}
      >
        {round.colours.map((c) => (
          <button
            key={c}
            ref={(el) => {
              bucketRefs.current[c] = el;
            }}
            onClick={() => answer(c)}
            className="bucket"
            data-colour={c}
            data-hover={hover === c}
            data-hint={hintColour === c}
            aria-label={`${COLOURS[c].name} bucket`}
          >
            <span key={nope?.colour === c ? nope.id : "still"} className={`bucket-body ${nope?.colour === c ? "nope-shake" : ""}`}>
              <span key={`pail-${splashes[c] || 0}`} className={splashes[c] ? "slosh block" : "block"}>
                <Bucket colour={c} />
              </span>
              {splashes[c] > 0 && <Splash key={`splash-${splashes[c]}`} colour={c} />}
            </span>
            <span className="bucket-tag">{COLOURS[c].name}</span>
          </button>
        ))}
      </div>

      {won && (
        <WinSheet
          stars={starsFor(mistakes, total)}
          summary={`All ${total} things sorted!`}
          detail={mistakes === 0 ? "Perfect, no mix-ups!" : `${level.name} · ${mistakes} mix-up${mistakes > 1 ? "s" : ""}`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}

/** Paint droplets that jump out of a bucket. */
function Splash({ colour }) {
  const drops = [
    [-34, -46, 10], [-14, -64, 8], [8, -58, 11], [28, -44, 8], [40, -26, 7], [-42, -22, 7],
  ];
  return (
    <span className="pointer-events-none absolute top-[30%] left-1/2" aria-hidden>
      {drops.map(([dx, dy, s], i) => (
        <span
          key={i}
          className="drop"
          style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, width: s, height: s, background: COLOURS[colour].paint }}
        />
      ))}
    </span>
  );
}
