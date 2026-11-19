"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveStars, useBestStars } from "@/lib/progress";
import { AppBar, CheckSticker, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, StepHeading, WinSheet } from "@/components/game-ui";
import { ArrowIcon, BackIcon, SoundOnIcon } from "@/components/icons";
import { ChoicesPreview, THINGS, ThingArt, Trophy } from "./art";

const GAME = "riddles";

// Each riddle has a tempting wrong answer or two that shares the "clue" word
// (a glove also has a hand, a spoon also goes in your mouth), so kids have to think.
const RIDDLES = [
  { id: "clock", text: "I have hands but cannot clap.", why: "A clock's hands point to the time, but they can't clap!", tempt: ["glove", "book", "ball"] },
  { id: "comb", text: "I have teeth but cannot eat.", why: "A comb's teeth tidy your hair, but they can't chew!", tempt: ["spoon", "cup", "hat"] },
  { id: "bottle", text: "I have a neck but no head.", why: "A bottle's neck is the thin part at the top. No head!", tempt: ["hat", "cup", "glove"] },
  { id: "towel", text: "I get wet while drying.", why: "A towel dries you off, so it gets wet itself!", tempt: ["cup", "hat", "spoon"] },
  { id: "piano", text: "I have keys but no locks.", why: "A piano's keys make music. They don't open doors!", tempt: ["book", "ball", "spoon"] },
  { id: "needle", text: "I have one eye but cannot see.", why: "A needle's eye is the little hole for the thread. It can't see!", tempt: ["ball", "glove", "book"] },
];

const LEVELS = [
  { id: "easy", name: "Easy", choices: 2, detail: "Pick from 2" },
  { id: "tricky", name: "Tricky", choices: 3, detail: "Pick from 3" },
  { id: "champion", name: "Champion", choices: 4, detail: "Pick from 4" },
];

const CHEERS = ["Clever!", "You got it!", "Riddle solved!", "Smart thinking!", "Brilliant!"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Every riddle once, in a fresh order, each with its picture choices. */
function makeRound(level) {
  return shuffle(RIDDLES).map((r) => ({
    ...r,
    // the first tempting answer is always in: it's the one that makes the riddle fun
    choices: shuffle([r.id, r.tempt[0], ...shuffle(r.tempt.slice(1)).slice(0, level.choices - 2)]),
  }));
}

function starsFor(mistakes) {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

const ask = (r) => sound.say(`${r.text} What am I?`);

export default function RiddlesGame() {
  const [levelId, setLevelId] = useState(null);
  const [round, setRound] = useState(null);
  const [q, setQ] = useState(0);
  const [phase, setPhase] = useState("ask"); // ask | right | won
  const [wrong, setWrong] = useState([]); // choices already guessed wrong for this riddle
  const [mistakes, setMistakes] = useState(0);
  const [nope, setNope] = useState(null); // { choice, id }
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
  useEffect(
    () => () => {
      clearTimers();
      sound.say(""); // stop any riddle still being read out
    },
    []
  );

  const start = useCallback(
    (lvlId) => {
      clearTimers();
      const r = makeRound(LEVELS.find((l) => l.id === lvlId));
      setLevelId(lvlId);
      setRound(r);
      setQ(0);
      setPhase("ask");
      setWrong([]);
      setMistakes(0);
      setNope(null);
      setCheer(null);
      sound.unfold();
      later(() => ask(r[0]), 350);
    },
    [later]
  );

  const backToMenu = () => {
    clearTimers();
    sound.say("");
    setLevelId(null);
    setRound(null);
  };

  const riddle = round?.[q];

  const guess = (choice) => {
    if (phase !== "ask" || wrong.includes(choice)) return;
    if (choice === riddle.id) {
      setPhase("right");
      sound.match();
      setCheer({ id: nextId(), text: pick(CHEERS) });
      later(() => sound.say(`Yes! I'm a ${THINGS[choice].name}! ${riddle.why}`), 450);
    } else {
      sound.miss();
      setMistakes((m) => m + 1);
      setWrong((w) => [...w, choice]);
      setNope({ choice, id: nextId() });
      sound.say(`Not a ${THINGS[choice].name}. Try again!`);
    }
  };

  const next = () => {
    clearTimers();
    if (q + 1 >= round.length) {
      saveStars(GAME, level.id, starsFor(mistakes));
      sound.say("");
      sound.win();
      setPhase("won");
      return;
    }
    setQ(q + 1);
    setPhase("ask");
    setWrong([]);
    setNope(null);
    setCheer(null);
    sound.unfold();
    later(() => ask(round[q + 1]), 300);
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-end" aria-hidden>
              <span className="mini-card-front grid aspect-square w-14 -rotate-12 place-items-center rounded-[10px] p-1.5">
                <ThingArt id="clock" />
              </span>
              <span className="-mx-2 w-24 drop-shadow-[0_8px_6px_rgba(40,18,0,0.45)]">
                <Trophy />
              </span>
              <span className="mini-card-front grid aspect-square w-14 rotate-12 place-items-center rounded-[10px] p-1.5">
                <ThingArt id="piano" />
              </span>
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Riddle Champion</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Listen to the riddle, then pick the answer!</p>
          </header>

          <section aria-labelledby="level-heading">
            <StepHeading id="level-heading">Pick how tricky</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<ChoicesPreview n={l.choices} />}
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
  const r = riddle || round[round.length - 1];
  const solved = phase !== "ask";
  const hint = phase === "ask" && wrong.length >= Math.max(1, r.choices.length - 2);
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level.id) + 1];
  const last = q + 1 >= round.length;

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={round.length} done={solved ? q + 1 : q} label={`Riddle ${q + 1} of ${round.length}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {solved ? `Yes, a ${THINGS[r.id].name}!` : hint ? "Look closely… which one fits?" : wrong.length ? "Not that one. Try again!" : "What am I? Tap the answer!"}
      </p>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-5 py-4">
        {/* The riddle, on a card taped to the table */}
        <div key={q} className="riddle-card paper w-full max-w-xl" data-solved={solved}>
          <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg] whitespace-nowrap">
            Riddle {q + 1}
          </span>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="min-w-0 flex-1">
              <p className="printed text-2xl leading-tight font-semibold text-balance sm:text-3xl" aria-live="polite">
                “{r.text}”
              </p>
              <p className="printed-soft mt-2 text-lg font-medium sm:text-xl">
                {solved ? r.why : "What am I?"}
              </p>
            </div>
            {solved ? (
              <span className="riddle-reveal grid size-24 shrink-0 place-items-center sm:size-28" data-thing={r.id}>
                <ThingArt id={r.id} />
              </span>
            ) : (
              <button onClick={() => ask(r)} className="knob size-14 shrink-0" aria-label="Hear the riddle again">
                <SoundOnIcon width={28} height={28} />
              </button>
            )}
          </div>
        </div>

        {cheer && (
          <div
            key={cheer.id}
            className="cheer pointer-events-none absolute top-1/3 left-1/2 z-10 text-3xl whitespace-nowrap sm:text-5xl"
            onAnimationEnd={(e) => e.animationName === "cheer" && setCheer(null)}
          >
            {cheer.text}
          </div>
        )}
      </div>

      {/* Picture answers in the thumb zone */}
      <div
        className={`mx-auto grid w-full gap-3 pb-3 sm:gap-5 ${r.choices.length === 3 ? "max-w-xl grid-cols-3" : r.choices.length === 4 ? "max-w-xl grid-cols-2 sm:grid-cols-4" : "max-w-md grid-cols-2"}`}
      >
        {r.choices.map((c, i) => {
          const isWrong = wrong.includes(c);
          const isRight = solved && c === r.id;
          return (
            <button
              key={`${q}-${c}`}
              onClick={() => guess(c)}
              className="riddle-choice tile deal-in flex-col items-center px-2 pt-3 pb-2"
              style={{ "--i": i }}
              data-thing={c}
              data-wrong={isWrong}
              data-right={isRight}
              data-dim={solved && !isRight}
              data-hint={hint && c === r.id}
              aria-pressed={isRight}
              aria-disabled={isWrong || solved}
              aria-label={isWrong ? `${THINGS[c].name}, not this one` : THINGS[c].name}
            >
              <span key={nope?.choice === c ? nope.id : "still"} className={`riddle-choice-art ${nope?.choice === c ? "nope-shake" : ""}`}>
                <ThingArt id={c} />
              </span>
              <span className="printed mt-1 text-xl font-semibold capitalize sm:text-2xl">{THINGS[c].name}</span>
              {isWrong && (
                <span className="riddle-cross" aria-hidden>
                  ✕
                </span>
              )}
              {isRight && <CheckSticker />}
            </button>
          );
        })}
      </div>

      <div className="mx-auto w-full max-w-md" data-show={solved}>
        {solved && (
          <button onClick={next} className="btn sheet-pop w-full" autoFocus>
            {last ? "See my stars" : "Next riddle"} <ArrowIcon />
          </button>
        )}
      </div>

      {phase === "won" && (
        <WinSheet
          stars={starsFor(mistakes)}
          summary={`You solved all ${round.length} riddles!`}
          detail={mistakes === 0 ? "Riddle Champion! No wrong guesses." : `${level.name} · ${mistakes} wrong guess${mistakes > 1 ? "es" : ""}`}
          next={nextLevel && { label: `Try ${nextLevel.name}`, onClick: () => start(nextLevel.id) }}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
          menuLabel="Back to menu"
        />
      )}
    </main>
  );
}
