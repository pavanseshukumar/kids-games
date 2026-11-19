"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { saveBestScore, useBestScores } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { LevelButton, ProgressRail, ScoreSheet, StepHeading } from "@/components/game-ui";
import { ArrowIcon, BackIcon, BulbIcon, SoundOnIcon } from "@/components/icons";
import { ANIMALS, AnimalArt, ShadowPreview } from "./art";

const GAME = "shadows";
const ROUND = 8;

// Clues go from gentle to giveaway. `alike` are animals with a similar outline,
// used as the wrong answers on Expert.
const INFO = {
  elephant: { clues: ["I am very, very big and grey.", "I have big flappy ears.", "I have a long trunk!"], alike: ["cow", "camel", "tortoise"] },
  giraffe: { clues: ["I eat leaves from tall trees.", "I have brown patches all over.", "I have a very long neck!"], alike: ["camel", "kangaroo", "cow"] },
  rabbit: { clues: ["I love to munch carrots.", "I hop, hop, hop.", "I have long ears and a fluffy tail!"], alike: ["kangaroo", "cat", "owl"] },
  cat: { clues: ["I like a saucer of milk.", "I have whiskers and soft fur.", "I say meow!"], alike: ["rabbit", "owl", "kangaroo"] },
  cow: { clues: ["I live on a farm.", "I eat grass all day long.", "I give milk and say moo!"], alike: ["camel", "elephant", "giraffe"] },
  kangaroo: { clues: ["I jump with my strong back legs.", "I live in Australia.", "I carry my baby in a pouch!"], alike: ["rabbit", "giraffe", "cat"] },
  crocodile: { clues: ["I live in rivers.", "I have a long tail and bumpy skin.", "I have lots of sharp teeth. Snap!"], alike: ["tortoise", "snail", "duck"] },
  camel: { clues: ["I live in the hot desert.", "I can walk for days without water.", "I have a big hump on my back!"], alike: ["giraffe", "cow", "elephant"] },
  owl: { clues: ["I am a bird.", "I stay awake all night.", "I have big round eyes and say hoot!"], alike: ["cat", "duck", "rabbit"] },
  snail: { clues: ["I am very, very slow.", "I leave a shiny, slimy trail.", "I carry my shell house on my back!"], alike: ["tortoise", "crocodile", "duck"] },
  tortoise: { clues: ["I am slow, and I live a very long time.", "I can tuck my head away.", "I have a hard, domed shell!"], alike: ["snail", "crocodile", "elephant"] },
  duck: { clues: ["I love to swim in ponds.", "I have webbed feet.", "I say quack, quack!"], alike: ["owl", "crocodile", "snail"] },
};
const IDS = Object.keys(INFO);

const LEVELS = [
  { id: "easy", name: "Easy", choices: 3, alike: false, detail: "Pick from 3", preview: "elephant" },
  { id: "tricky", name: "Tricky", choices: 4, alike: false, detail: "Pick from 4", preview: "rabbit" },
  { id: "expert", name: "Expert", choices: 4, alike: true, detail: "Look-alike shadows", preview: "camel" },
];

const CHEERS = ["Yes!", "Great guess!", "You got it!", "Super spotting!", "Brilliant!"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const aName = (id) => `${/^[aeiou]/i.test(id) ? "an" : "a"} ${ANIMALS[id].name.toLowerCase()}`;

function makeRound(level) {
  return shuffle(IDS)
    .slice(0, ROUND)
    .map((id) => {
      const pool = level.alike ? INFO[id].alike : shuffle(IDS.filter((x) => x !== id));
      return { id, choices: shuffle([id, ...pool.slice(0, level.choices - 1)]) };
    });
}

export default function ShadowsGame() {
  const [levelId, setLevelId] = useState(null);
  const [round, setRound] = useState(null);
  const [q, setQ] = useState(0);
  const [phase, setPhase] = useState("ask"); // ask | right | done
  const [clues, setClues] = useState(0); // clues shown for this animal
  const [wrong, setWrong] = useState([]); // names guessed wrong for this animal
  const [points, setPoints] = useState(0);
  const [nope, setNope] = useState(null); // { choice, id }
  const [cheer, setCheer] = useState(null);
  const [result, setResult] = useState(null);

  const best = useBestScores(GAME);
  const level = LEVELS.find((l) => l.id === levelId);
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
  useEffect(
    () => () => {
      clearTimers();
      sound.say("");
    },
    []
  );

  const askAloud = () => sound.say("Whose shadow is this?");

  const start = useCallback(
    (lvlId) => {
      clearTimers();
      setLevelId(lvlId);
      setRound(makeRound(LEVELS.find((l) => l.id === lvlId)));
      setQ(0);
      setPhase("ask");
      setClues(0);
      setWrong([]);
      setPoints(0);
      setNope(null);
      setCheer(null);
      setResult(null);
      sound.unfold();
      later(askAloud, 400);
    },
    [later]
  );

  const backToMenu = () => {
    clearTimers();
    sound.say("");
    setLevelId(null);
    setRound(null);
  };

  const animal = round?.[q];
  const info = animal && INFO[animal.id];

  const showClue = () => {
    if (phase !== "ask" || clues >= info.clues.length) return;
    setClues(clues + 1);
    sound.ding();
    sound.say(info.clues[clues]);
  };

  const guess = (choice) => {
    if (phase !== "ask" || wrong.includes(choice)) return;
    if (choice === animal.id) {
      const earned = wrong.length === 0;
      setPhase("right");
      if (earned) setPoints((p) => p + 1);
      sound.match();
      setCheer({ id: nextId(), text: earned ? "+1 point!" : pick(CHEERS) });
      later(() => sound.say(`Yes! It's ${aName(choice)}!`), 400);
      return;
    }
    // Wrong: no point for this one, but a clue helps them get there.
    sound.miss();
    setWrong((w) => [...w, choice]);
    setNope({ choice, id: nextId() });
    if (clues < info.clues.length) {
      setClues(clues + 1);
      sound.say(`Not ${aName(choice)}. Here's a clue. ${info.clues[clues]}`);
    } else {
      sound.say(`Not ${aName(choice)}. Try again!`);
    }
  };

  const next = () => {
    clearTimers();
    if (q + 1 >= round.length) {
      const { best: b, isNew } = saveBestScore(GAME, level.id, points);
      sound.say("");
      if (isNew) sound.win();
      setResult({ score: points, best: b, isNew });
      setPhase("done");
      return;
    }
    setQ(q + 1);
    setPhase("ask");
    setClues(0);
    setWrong([]);
    setNope(null);
    setCheer(null);
    sound.unfold();
    later(askAloud, 300);
  };

  /* ---------------- Menu ---------------- */
  if (!level) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-1 pb-2 sm:justify-center sm:gap-10">
          <header className="flex flex-col items-center text-center">
            <div className="shadow-screen mb-5 flex w-56 items-end justify-center gap-1 rounded-[18px] px-4 pt-4 pb-2" aria-hidden>
              <span className="w-20">
                <AnimalArt id="giraffe" shadow />
              </span>
              <span className="w-16">
                <AnimalArt id="rabbit" shadow />
              </span>
              <span className="w-16">
                <AnimalArt id="duck" />
              </span>
            </div>
            <h1 className="toy-title text-5xl sm:text-6xl">Shadow Animals</h1>
            <p className="engraved mt-3 text-lg sm:text-xl">Whose shadow is it? Ask for a clue if you need one!</p>
          </header>

          <section aria-labelledby="level-heading">
            <StepHeading id="level-heading">Pick how tricky</StepHeading>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {LEVELS.map((l) => (
                <LevelButton
                  key={l.id}
                  data-level={l.id}
                  preview={<ShadowPreview id={l.preview} />}
                  name={l.name}
                  detail={l.detail}
                  bestScore={best[l.id] || 0}
                  onClick={() => {
                    sound.tap();
                    start(l.id);
                  }}
                />
              ))}
            </div>
          </section>

          <p className="engraved mx-auto max-w-md text-center text-base opacity-90">
            One point for each animal you get right first time. Clues are free!
          </p>
        </div>
      </main>
    );
  }

  /* ---------------- Play ---------------- */
  const a = animal || round[round.length - 1];
  const solved = phase !== "ask";
  const clueList = INFO[a.id].clues;
  const cluesLeft = clueList.length - clues;
  const last = q + 1 >= round.length;

  return (
    <main className="screen">
      <AppBar
        left={
          <button onClick={backToMenu} className="knob" aria-label="Back to menu">
            <BackIcon />
          </button>
        }
        center={<ProgressRail total={round.length} done={solved ? q + 1 : q} label={`Animal ${q + 1} of ${round.length}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {solved
          ? `It's ${aName(a.id)}!`
          : wrong.length
            ? "Not quite! Read the clue and try again."
            : "Whose shadow is this?"}
      </p>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-3 py-3">
        {/* The lit screen of a little shadow theatre */}
        <div className="shadow-stage w-full max-w-md">
          <div key={q} className="shadow-screen shadow-in relative aspect-[6/4] w-full rounded-[14px] px-[10%] pt-[8%] pb-[4%]" data-solved={solved}>
            <AnimalArt id={a.id} shadow={!solved} />
            <span className="score-plaque absolute top-2 right-2 scale-[0.8]" role="status" aria-label={`${points} points`}>
              <span className="score-plaque-label">Points</span>
              <span key={points} className="score-plaque-num">
                {points}
              </span>
            </span>
            {!solved && (
              <button onClick={askAloud} className="knob absolute top-2 left-2 scale-90" aria-label="Hear the question again">
                <SoundOnIcon />
              </button>
            )}
          </div>
        </div>

        {/* Clues, pinned under the stage as they're asked for */}
        {clues > 0 && (
          <ul className="flex w-full max-w-md flex-col gap-2" aria-live="polite">
            {clueList.slice(0, clues).map((c, i) => (
              <li key={i} className="clue-note paper flex items-center gap-2 px-3 py-2" data-new={i === clues - 1}>
                <span className="clue-bulb" aria-hidden>
                  <BulbIcon width={22} height={22} />
                </span>
                <span className="printed text-lg leading-snug font-medium">{c}</span>
              </li>
            ))}
          </ul>
        )}

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

      {/* Name buttons in the thumb zone */}
      <div className={`mx-auto grid w-full max-w-md gap-3 pb-3 ${a.choices.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
        {a.choices.map((c, i) => {
          const isWrong = wrong.includes(c);
          const isRight = solved && c === a.id;
          return (
            <button
              key={`${q}-${c}`}
              onClick={() => guess(c)}
              className={`shadow-choice btn deal-in ${isRight ? "" : "btn-cream"}`}
              style={{ "--i": i }}
              data-animal={c}
              data-wrong={isWrong}
              data-dim={solved && !isRight}
              aria-disabled={isWrong || solved}
              aria-label={isWrong ? `${ANIMALS[c].name}, not this one` : ANIMALS[c].name}
            >
              <span key={nope?.choice === c ? nope.id : "still"} className={nope?.choice === c ? "nope-shake inline-block" : "inline-block"}>
                {ANIMALS[c].name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto w-full max-w-md">
        {solved ? (
          <button onClick={next} className="btn sheet-pop w-full" autoFocus>
            {last ? "See my score" : "Next animal"} <ArrowIcon />
          </button>
        ) : (
          <button onClick={showClue} className="btn btn-orange w-full" disabled={cluesLeft === 0} data-empty={cluesLeft === 0}>
            <BulbIcon /> {cluesLeft === 0 ? "No more clues" : clues === 0 ? "Give me a clue" : `Another clue (${cluesLeft} left)`}
          </button>
        )}
      </div>

      {phase === "done" && result && (
        <ScoreSheet
          score={result.score}
          best={result.best}
          isNew={result.isNew}
          reason={<span className="printed-soft text-lg">{`${result.score} of ${round.length} right first time`}</span>}
          onReplay={() => start(level.id)}
          onMenu={backToMenu}
        />
      )}
    </main>
  );
}
