"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/sound";
import { saveStars } from "@/lib/progress";
import { AppBar, CheckSticker, HomeButton, SoundButton } from "@/components/ui";
import { ProgressRail, WinSheet } from "@/components/game-ui";
import { ArrowIcon, SoundOnIcon } from "@/components/icons";
import { ITEMS, ItemArt } from "./art";
import { QUESTIONS } from "./questions";

const GAME = "oddone";
const PER_GAME = 8;
const DECK_KEY = "oddone:deck";

const CHEERS = ["You found it!", "Odd one out!", "Clever!", "Well spotted!", "Yes!"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Deal PER_GAME questions from a shuffled deck kept in this browser, so a child
 * sees every question before any comes back.
 */
function makeRound() {
  let deck = [];
  try {
    deck = JSON.parse(localStorage.getItem(DECK_KEY) || "[]").filter((i) => Number.isInteger(i) && i >= 0 && i < QUESTIONS.length);
  } catch {}
  if (deck.length < PER_GAME) deck = [...deck, ...shuffle(QUESTIONS.map((_, i) => i)).filter((i) => !deck.includes(i))];
  const picked = deck.slice(0, PER_GAME);
  try {
    localStorage.setItem(DECK_KEY, JSON.stringify(deck.slice(PER_GAME)));
  } catch {}
  return picked.map((i) => ({ ...QUESTIONS[i], items: shuffle(QUESTIONS[i].items) }));
}

/** "apple, mango, carrot and banana" */
function listWords(ids) {
  const words = ids.map((id) => ITEMS[id].word);
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

const ask = (q) => sound.say(`${listWords(q.items)}. Which one does not belong?`);

function starsFor(mistakes) {
  if (mistakes <= 1) return 3;
  if (mistakes <= 4) return 2;
  return 1;
}

export default function OddOneGame() {
  const [round, setRound] = useState(null);
  const [q, setQ] = useState(0);
  const [phase, setPhase] = useState("ask"); // ask | right | won
  const [wrong, setWrong] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [nope, setNope] = useState(null); // { choice, id }
  const [cheer, setCheer] = useState(null);

  const router = useRouter();
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

  const start = useCallback(() => {
    clearTimers();
    const r = makeRound();
    setRound(r);
    setQ(0);
    setPhase("ask");
    setWrong([]);
    setMistakes(0);
    setNope(null);
    setCheer(null);
    sound.unfold();
    later(() => ask(r[0]), 400);
  }, [later]);

  // No menu: the first four pictures are up as soon as the page opens.
  // (Deferred a tick: the order is random, so it can't be made during server render.)
  useEffect(() => {
    const t = setTimeout(start, 0);
    return () => clearTimeout(t);
  }, [start]);

  const goHome = () => {
    clearTimers();
    sound.say("");
    router.push("/");
  };

  const question = round?.[q];

  const guess = (choice) => {
    if (phase !== "ask" || wrong.includes(choice)) return;
    if (choice === question.odd) {
      setPhase("right");
      sound.match();
      setCheer({ id: nextId(), text: pick(CHEERS) });
      later(() => sound.say(`Yes! ${question.why}`), 400);
      return;
    }
    // Wrong: give the clue (what the other three share), out loud and on the card.
    sound.miss();
    setMistakes((m) => m + 1);
    setWrong((w) => [...w, choice]);
    setNope({ choice, id: nextId() });
    sound.say(`Not ${ITEMS[choice].a}. Here's a clue: ${question.groupTag}. Try again!`);
  };

  const next = () => {
    clearTimers();
    if (q + 1 >= round.length) {
      saveStars(GAME, "all", starsFor(mistakes));
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

  if (!round) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
      </main>
    );
  }

  const cur = question || round[round.length - 1];
  const solved = phase !== "ask";
  const hint = phase === "ask" && wrong.length >= 2;
  const last = q + 1 >= round.length;

  return (
    <main className="screen">
      <AppBar
        left={<HomeButton />}
        center={<ProgressRail total={round.length} done={solved ? q + 1 : q} label={`Question ${q + 1} of ${round.length}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {solved ? "That's the odd one out!" : hint ? "Look at the glowing one…" : wrong.length ? "Not that one. Try again!" : "Find the one that's different!"}
      </p>

      <div className="odd-top flex flex-col items-center gap-5 py-3">
        {/* The question, on a card taped to the table */}
        <div key={q} className="riddle-card odd-card paper w-full max-w-xl" data-solved={solved}>
          <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg] whitespace-nowrap">Question {q + 1}</span>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="min-w-0 flex-1">
              <p className="printed text-2xl leading-tight font-semibold text-balance sm:text-3xl">
                {solved ? `${ITEMS[cur.odd].word[0].toUpperCase()}${ITEMS[cur.odd].word.slice(1)} doesn't belong!` : "Which one does not belong?"}
              </p>
              <p className="printed-soft mt-2 text-lg leading-snug font-medium sm:text-xl">
                {solved ? (
                  cur.why
                ) : wrong.length ? (
                  <span className="odd-clue">Clue: {cur.groupTag}</span>
                ) : (
                  "Three go together. Tap the one that doesn't!"
                )}
              </p>
            </div>
            {!solved && (
              <button onClick={() => ask(cur)} className="knob size-14 shrink-0" aria-label="Hear the question again">
                <SoundOnIcon width={28} height={28} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-xl grid-cols-2 gap-x-3 gap-y-5 pb-3 sm:max-w-3xl sm:grid-cols-4 sm:gap-5">
        {cur.items.map((c, i) => {
          const isWrong = wrong.includes(c);
          const isOdd = c === cur.odd;
          return (
            <button
              key={`${q}-${c}`}
              onClick={() => guess(c)}
              className="riddle-choice odd-choice tile deal-in flex-col items-center px-2 pt-3"
              style={{ "--i": i }}
              data-item={c}
              data-wrong={isWrong && !solved}
              data-right={solved && isOdd}
              data-group={solved && !isOdd}
              data-hint={hint && isOdd}
              aria-pressed={solved && isOdd}
              aria-disabled={isWrong || solved}
              aria-label={isWrong ? `${ITEMS[c].word}, not this one` : ITEMS[c].word}
            >
              <span key={nope?.choice === c ? nope.id : "still"} className={`riddle-choice-art ${nope?.choice === c ? "nope-shake" : ""}`}>
                <ItemArt id={c} />
              </span>
              <span className="printed mt-1 text-xl font-semibold capitalize sm:text-2xl">{ITEMS[c].word}</span>
              {isWrong && !solved && (
                <span className="riddle-cross" aria-hidden>
                  ✕
                </span>
              )}
              {solved && isOdd && <CheckSticker />}
              {solved && (
                <span className="odd-tag" data-odd={isOdd} style={{ "--i": isOdd ? 0 : i + 1 }}>
                  {isOdd ? cur.oddTag : cur.groupTag}
                </span>
              )}
            </button>
          );
        })}

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

      <div className="mx-auto mt-auto w-full max-w-md pt-2">
        {solved && phase !== "won" && (
          <button onClick={next} className="btn sheet-pop w-full" autoFocus>
            {last ? "See my stars" : "Next question"} <ArrowIcon />
          </button>
        )}
      </div>

      {phase === "won" && (
        <WinSheet
          stars={starsFor(mistakes)}
          summary={`You found all ${round.length} odd ones out!`}
          detail={mistakes === 0 ? "Every one right first time!" : `${mistakes} wrong tap${mistakes > 1 ? "s" : ""}`}
          onReplay={start}
          onMenu={goHome}
          menuLabel="Back to games"
        />
      )}
    </main>
  );
}
