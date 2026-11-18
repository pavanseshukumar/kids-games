"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { BackIcon } from "@/components/icons";
import { Bead, COLOUR_NAMES, StringPreview } from "./art";

const GAME = "patterns";
const QUESTIONS = 6;
const BEAT_MS = 560;

const LEVELS = [
  { id: "easy", name: "Easy", patterns: ["AB"], kinds: ["colour"], choices: 2, middleGap: 0, detail: "Two colours" },
  { id: "medium", name: "Medium", patterns: ["AAB", "ABB", "AAB", "ABB", "AB"], kinds: ["colour"], choices: 3, middleGap: 0, detail: "Trickier patterns" },
  { id: "hard", name: "Big", patterns: ["ABC", "AAB", "ABB", "ABC"], kinds: ["colour", "shape", "both"], choices: 3, middleGap: 0.3, detail: "Colours and shapes" },
];

const PAINTS = ["red", "blue", "yellow", "green", "orange", "purple"];
const SHAPES = ["circle", "square", "triangle", "star", "heart", "diamond"];
const CHEERS = ["Yes!", "You got it!", "Super!", "Pattern pro!", "Brilliant!"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const keyOf = (t) => `${t.shape}-${t.paint}`;

/** Spoken name of a bead, depending on what the pattern is about. */
function nameOf(t, kind) {
  if (kind === "shape") return t.shape;
  if (kind === "both") return `${COLOUR_NAMES[t.paint]} ${t.shape}`;
  return COLOUR_NAMES[t.paint];
}

/** `n` distinct bead tokens for a pattern kind. */
function makeTokens(kind, n) {
  const paints = shuffle(PAINTS);
  const shapes = shuffle(SHAPES);
  if (kind === "colour") return paints.slice(0, n).map((paint) => ({ shape: "circle", paint }));
  if (kind === "shape") {
    const paint = paints[0];
    return shapes.slice(0, n).map((shape) => ({ shape, paint }));
  }
  return Array.from({ length: n }, (_, i) => ({ shape: shapes[i], paint: paints[i] }));
}

function makeQuestion(level) {
  const pattern = pick(level.patterns);
  const kind = pick(level.kinds);
  const letters = [...new Set(pattern)].length;
  const tokens = makeTokens(kind, Math.min(letters + 2, 6)); // pattern tokens + spare distractors
  const unit = [...pattern].map((ch) => ch.charCodeAt(0) - 65);
  const total = 6; // two full repeats of a 3-bead unit; keeps beads big on phones
  const seq = Array.from({ length: total }, (_, i) => tokens[unit[i % unit.length]]);
  const gap = Math.random() < level.middleGap ? 3 + Math.floor(Math.random() * (total - 4)) : total - 1;
  const answer = seq[gap];

  // Choices: the answer, the other pattern beads, then a distractor if needed.
  const inPattern = tokens.slice(0, letters).filter((t) => keyOf(t) !== keyOf(answer));
  const spare = tokens.slice(letters);
  const others = shuffle([...shuffle(inPattern), ...spare]).slice(0, level.choices - 1);
  if (level.choices === 2 && inPattern.length) others[0] = inPattern[0];
  const choices = shuffle([answer, ...others]);
  return { kind, seq, gap, answer, choices };
}

function makeRound(level) {
  const qs = [];
  while (qs.length < QUESTIONS) {
    const q = makeQuestion(level);
    const prev = qs[qs.length - 1];
    if (prev && keyOf(prev.answer) === keyOf(q.answer) && prev.kind === q.kind) continue;
    qs.push(q);
  }
  return qs;
}

function starsFor(mistakes) {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

export default function PatternsGame() {
  const [levelId, setLevelId] = useState(null);
  const [round, setRound] = useState(null);
  const [q, setQ] = useState(0);
  const [phase, setPhase] = useState("play"); // play | readout | right | won
  const [filled, setFilled] = useState(false);
  const [beat, setBeat] = useState(-1); // index of the bead bouncing in the read-aloud
  const [mistakes, setMistakes] = useState(0);
  const [misses, setMisses] = useState(0);
  const [nope, setNope] = useState(null); // { key, id }
  const [over, setOver] = useState(false); // dragged bead is over the string
  const [cheer, setCheer] = useState(null);

  const best = useBestStars(GAME);
  const level = LEVELS.find((l) => l.id === levelId);

  const choiceRefs = useRef({});
  const gapRef = useRef(null);
  const matRef = useRef(null);
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

  const resetQuestion = () => {
    setFilled(false);
    setBeat(-1);
    setMisses(0);
    setNope(null);
    setOver(false);
    setPhase("play");
    busy.current = false;
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

  const place = (el, x, y, { scale = 1, transition = "" } = {}) => {
    if (!el) return;
    el.style.transition = transition;
    el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };
  const settleBack = (key) => {
    const el = choiceRefs.current[key];
    place(el, 0, 0, { transition: "transform 420ms cubic-bezier(.34,1.5,.5,1)" });
    if (el) el.dataset.lifted = "false";
  };

  /** Read the string aloud in rhythm, bouncing each bead. Stops at the gap if `stopAtGap`. */
  const readAloud = (stopAtGap, onDone) => {
    const { seq, gap, kind } = question;
    const last = stopAtGap ? gap : seq.length - 1;
    for (let i = 0; i <= last; i++) {
      later(() => {
        setBeat(i);
        if (stopAtGap && i === gap) sound.say("What comes next?");
        else sound.say(nameOf(seq[i], kind));
      }, i * BEAT_MS);
    }
    later(() => {
      setBeat(-1);
      onDone?.();
    }, (last + 1) * BEAT_MS + (stopAtGap ? 900 : 200));
  };

  const answer = (token, offset = { x: 0, y: 0 }) => {
    if (busy.current || phase !== "play") return;
    busy.current = true;
    const key = keyOf(token);
    const el = choiceRefs.current[key];
    setOver(false);

    if (key === keyOf(question.answer)) {
      // Slide the bead onto the string at the gap.
      const from = el.getBoundingClientRect();
      const to = gapRef.current.getBoundingClientRect();
      el.dataset.lifted = "true";
      place(el, offset.x + to.left + to.width / 2 - (from.left + from.width / 2), offset.y + to.top + to.height / 2 - (from.top + from.height / 2), {
        scale: to.width / el.offsetWidth,
        transition: "transform 340ms cubic-bezier(.3,.9,.4,1)",
      });
      later(() => {
        sound.clunk();
        setFilled(true);
        setPhase("right");
        setCheer({ id: nextId(), text: pick(CHEERS) });
        sound.match();
      }, 340);
      // Then hear the whole pattern in rhythm.
      later(() => {
        readAloud(false, () => {
          if (q + 1 >= round.length) {
            saveStars(GAME, level.id, starsFor(mistakes));
            sound.win();
            setPhase("won");
          } else {
            setQ(q + 1);
            resetQuestion();
            sound.pop();
          }
        });
      }, 900);
    } else {
      sound.boing();
      setMistakes((m) => m + 1);
      setMisses((m) => m + 1);
      setNope({ key, id: nextId() });
      settleBack(key);
      // Read up to the gap so the child can hear what is missing.
      later(() => {
        setPhase("readout");
        readAloud(true, () => {
          setPhase("play");
          busy.current = false;
        });
      }, 500);
    }
  };

  /* ---------- Dragging ---------- */
  const overString = (x, y) => {
    const r = matRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top - 20 && y <= r.bottom + 20;
  };

  const onPointerDown = (token) => (e) => {
    if (busy.current || phase !== "play") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.getBoundingClientRect();
    drag.current = {
      token,
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
      sound.tap();
      e.currentTarget.dataset.lifted = "true";
    }
    if (!d.moved) return;
    const x = dx + d.grabX;
    const y = dy + d.grabY - 24;
    d.offset = { x, y };
    place(e.currentTarget, x, y, { scale: 1.1 });
    const now = overString(e.clientX, e.clientY - 24);
    setOver((o) => (o === now ? o : now));
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (!d.moved) {
      answer(d.token); // a tap places the bead
      return;
    }
    if (overString(e.clientX, e.clientY - 24)) answer(d.token, d.offset);
    else {
      setOver(false);
      settleBack(keyOf(d.token));
    }
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    const previews = {
      easy: [{ paint: "red" }, { paint: "blue" }, { paint: "red" }],
      medium: [{ paint: "green" }, { paint: "green" }, { paint: "orange" }],
      hard: [{ paint: "purple", shape: "star" }, { paint: "yellow", shape: "square" }, { paint: "blue", shape: "heart" }],
    };
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="bead-string mb-5" style={{ "--bead": "2.9rem" }} aria-hidden>
              {["red", "blue", "red", "blue"].map((p, i) => (
                <span key={i} className="bead-slot">
                  <Bead paint={p} />
                </span>
              ))}
              <span className="bead-slot bead-gap">?</span>
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">What Comes Next?</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Finish the bead pattern!</p>
          </header>

          <section aria-labelledby="size-heading">
            <StepHeading id="size-heading">Pick a pattern level</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<StringPreview beads={previews[l.id]} />}
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
  const { seq, gap, choices, kind, answer: right } = question;
  const hint = misses >= 2 && phase === "play";
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];
  const done = phase === "right" || phase === "won" ? q + 1 : q;

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={round.length} done={done} label={`Pattern ${q + 1} of ${round.length}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {phase === "readout"
          ? "Listen to the pattern..."
          : phase === "right"
            ? "Say it with me!"
            : gap === seq.length - 1
              ? "Which bead comes next?"
              : "Which bead is missing?"}
      </p>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 py-3">
        {/* The string of beads */}
        <div ref={matRef} key={q} className="felt board-in w-full max-w-2xl px-3 py-6 sm:px-6 sm:py-9" data-over={over} data-answer={keyOf(right)}>
          <div className="bead-string" style={{ "--slots": seq.length }} data-testid="string">
            {seq.map((t, i) => {
              const isGap = i === gap;
              if (isGap && !filled) {
                return (
                  <span key={i} ref={gapRef} className="bead-slot bead-gap" data-beat={beat === i} data-over={over}>
                    ?
                  </span>
                );
              }
              return (
                <span
                  key={i}
                  ref={isGap ? gapRef : undefined}
                  className={`bead-slot ${isGap ? "bead-landed" : ""}`}
                  data-beat={beat === i}
                  style={{ "--i": i }}
                  aria-label={nameOf(t, kind)}
                  role="img"
                >
                  <Bead shape={t.shape} paint={t.paint} />
                </span>
              );
            })}
          </div>
        </div>

        {/* Loose beads to choose from */}
        <div key={`choices-${q}`} className="flex w-full max-w-md justify-center gap-5 sm:gap-8">
          {choices.map((t, i) => {
            const key = keyOf(t);
            const used = filled && key === keyOf(right);
            return (
              <div
                key={key}
                ref={(el) => {
                  choiceRefs.current[key] = el;
                }}
                className="bead-choice"
                style={{ "--i": i, visibility: used ? "hidden" : undefined }}
                data-hint={hint && key === keyOf(right)}
                data-key={key}
                role="button"
                tabIndex={0}
                aria-label={`${nameOf(t, kind)} bead`}
                onPointerDown={onPointerDown(t)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    answer(t);
                  }
                }}
              >
                <span className="bead-choice-in">
                  <span key={nope?.key === key ? nope.id : "still"} className={`block h-full w-full ${nope?.key === key ? "nope-shake" : ""}`}>
                    <Bead shape={t.shape} paint={t.paint} />
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {cheer && (
          <div
            key={cheer.id}
            className="cheer pointer-events-none absolute top-[30%] left-1/2 z-10 text-3xl whitespace-nowrap sm:text-5xl"
            onAnimationEnd={(e) => e.animationName === "cheer" && setCheer(null)}
          >
            {cheer.text}
          </div>
        )}
      </div>

      {phase === "won" && (
        <WinSheet
          stars={starsFor(mistakes)}
          summary={`You finished all ${round.length} patterns!`}
          detail={mistakes === 0 ? "Perfect patterns!" : `${level.name} · ${mistakes} mix-up${mistakes > 1 ? "s" : ""}`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
