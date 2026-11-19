"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { useRouter } from "next/navigation";
import { saveBestScore } from "@/lib/progress";
import { AppBar, HomeButton, SoundButton } from "@/components/ui";
import { ProgressRail, ScoreSheet } from "@/components/game-ui";
import { ArrowIcon, BulbIcon, SoundOnIcon } from "@/components/icons";
import { ANIMALS, AnimalArt } from "./art";

const GAME = "shadows";
const ROUND = 8;

// Each animal: `hints` (gentle clues; two are picked at random, in random order),
// `give` (giveaway clues; one is picked and always comes last), `alike` (animals with
// a similar outline; one of them is always among the three answers).
const INFO = {
  elephant: {
    hints: ["I am very, very big and grey.", "I love a splash in the river.", "I can live for 70 years.", "My feet are as big as a bucket."],
    give: ["I have a long trunk!", "I have big flappy ears and ivory tusks!"],
    alike: ["rhino", "cow", "bear"],
  },
  giraffe: {
    hints: ["I eat leaves from tall trees.", "I have brown patches all over.", "I live on the grasslands of Africa.", "I sleep standing up, just a few minutes at a time."],
    give: ["I have a very, very long neck!", "I am the tallest animal in the world!"],
    alike: ["camel", "deer", "horse"],
  },
  rabbit: {
    hints: ["I love to munch carrots.", "I live in a burrow under the ground.", "My nose twitches all the time.", "I have big strong back feet."],
    give: ["I hop, hop, hop and have long ears!", "I have long ears and a fluffy white tail!"],
    alike: ["kangaroo", "squirrel", "cat"],
  },
  cat: {
    hints: ["I like a saucer of milk.", "I have whiskers and soft fur.", "I love to curl up and nap in the sun.", "I land on my feet when I jump."],
    give: ["I say meow!", "I purr when you stroke me!"],
    alike: ["fox", "rabbit", "squirrel"],
  },
  cow: {
    hints: ["I live on a farm.", "I eat grass all day long.", "I have a long tail to swish flies away.", "I have black and white patches."],
    give: ["I give milk and say moo!", "I say moo!"],
    alike: ["horse", "rhino", "pig"],
  },
  kangaroo: {
    hints: ["I live in Australia.", "I have a long, strong tail.", "I can't walk backwards.", "My baby is called a joey."],
    give: ["I carry my baby in a pouch!", "I jump and bounce on my big back legs!"],
    alike: ["rabbit", "squirrel", "deer"],
  },
  crocodile: {
    hints: ["I live in rivers.", "I have bumpy, scaly skin.", "I lie very still in the sun.", "I lay eggs on the riverbank."],
    give: ["I have lots of sharp teeth. Snap!", "I have a long tail and a giant snappy mouth!"],
    alike: ["tortoise", "frog", "fox"],
  },
  camel: {
    hints: ["I live in the hot desert.", "I can walk for days without water.", "I have long eyelashes to keep sand out.", "People ride on me across the sand."],
    give: ["I have a big hump on my back!", "I am called the ship of the desert!"],
    alike: ["giraffe", "horse", "deer"],
  },
  owl: {
    hints: ["I am a bird.", "I stay awake all night.", "I can turn my head almost all the way round.", "I fly without making a sound."],
    give: ["I have big round eyes and say hoot!", "I say twit-twoo!"],
    alike: ["penguin", "hen", "cat"],
  },
  snail: {
    hints: ["I am very, very slow.", "I leave a shiny, slimy trail.", "I love the rain.", "I have feelers on my head."],
    give: ["I carry my curly shell house on my back!", "I hide inside my curly shell!"],
    alike: ["tortoise", "frog", "crocodile"],
  },
  tortoise: {
    hints: ["I am slow, and I live a very long time.", "I can tuck my head away.", "I eat leaves and flowers.", "I sleep all winter long."],
    give: ["I have a hard, domed shell!", "I won a race against a hare!"],
    alike: ["snail", "frog", "crocodile"],
  },
  duck: {
    hints: ["I love to swim in ponds.", "I have webbed feet.", "Water rolls right off my feathers.", "My babies follow me in a line."],
    give: ["I say quack, quack!", "I have a flat beak and say quack!"],
    alike: ["hen", "penguin", "owl"],
  },
  horse: {
    hints: ["I have a long tail and a mane.", "I wear shoes made of metal.", "I can sleep standing up.", "I love hay and apples."],
    give: ["I say neigh and you can ride on me!", "I can gallop very fast. Neigh!"],
    alike: ["deer", "camel", "cow"],
  },
  lion: {
    hints: ["I am a big cat.", "I sleep for most of the day.", "I live with my family, called a pride.", "I have a tuft on the end of my tail."],
    give: ["I have a big fluffy mane and I roar!", "I am the king of the jungle. Roar!"],
    alike: ["bear", "fox", "cat"],
  },
  bear: {
    hints: ["I have thick, furry fur.", "I sleep all winter in a cave.", "I love to catch fish.", "I can stand up on my back legs."],
    give: ["I love honey and I growl!", "I am big and furry and love honey!"],
    alike: ["lion", "pig", "rhino"],
  },
  pig: {
    hints: ["I live on a farm.", "I love to roll in the mud.", "I am very clever.", "I have a curly tail."],
    give: ["I have a flat pink snout and say oink!", "I say oink, oink!"],
    alike: ["rhino", "bear", "sheep"],
  },
  sheep: {
    hints: ["I live on a farm.", "I eat grass in the fields.", "I live in a big group called a flock.", "My baby is called a lamb."],
    give: ["My woolly coat keeps you warm, and I say baa!", "I say baa, baa!"],
    alike: ["pig", "cow", "bear"],
  },
  penguin: {
    hints: ["I am a bird, but I can't fly.", "I live where it is icy cold.", "I am a super fast swimmer.", "I slide on my tummy over the ice."],
    give: ["I look like I'm wearing a black and white suit!", "I waddle on the ice in my black and white coat!"],
    alike: ["owl", "duck", "hen"],
  },
  fox: {
    hints: ["I come out at night.", "I live in a den.", "I have pointy ears and a pointy nose.", "I am a cousin of the dog."],
    give: ["I have orange fur and a big bushy tail!", "I am orange, sly, and have a white-tipped tail!"],
    alike: ["cat", "lion", "deer"],
  },
  deer: {
    hints: ["I live in the forest.", "I can run and leap very fast.", "My baby is called a fawn.", "I have a little white tail."],
    give: ["I have antlers on my head like tree branches!", "I have big branchy antlers!"],
    alike: ["horse", "giraffe", "camel"],
  },
  rhino: {
    hints: ["I am big, grey and heavy.", "I have very thick skin.", "I love rolling in mud.", "I can't see very well."],
    give: ["I have a big horn on my nose!", "I have two horns on my nose!"],
    alike: ["elephant", "pig", "bear"],
  },
  squirrel: {
    hints: ["I live up in the trees.", "I am very good at climbing.", "I hide food for the winter.", "I am small and quick."],
    give: ["I have a big bushy tail and love nuts!", "I collect acorns and nuts!"],
    alike: ["rabbit", "fox", "kangaroo"],
  },
  frog: {
    hints: ["I love ponds.", "I start life as a tadpole.", "I catch flies with my sticky tongue.", "I am green."],
    give: ["I say ribbit and jump on lily pads!", "I say ribbit, ribbit!"],
    alike: ["tortoise", "snail", "duck"],
  },
  hen: {
    hints: ["I am a bird that lives on a farm.", "I peck at seeds and corn.", "My babies are called chicks.", "I have a red comb on my head."],
    give: ["I lay eggs for your breakfast!", "I lay eggs and say cluck, cluck!"],
    alike: ["duck", "owl", "penguin"],
  },
};
const IDS = Object.keys(INFO);

const CHOICES = 3;

const QUESTIONS = ["Whose shadow is this?", "Who's hiding behind the screen?", "Can you guess who this is?", "Who could this be?", "Which animal is this?"];
const WRONG = ["Not {a}.", "Hmm, not {a}.", "Good try, but not {a}.", "Ooh, close! Not {a}."];
const PRAISE = ["Yes! It's {a}!", "You got it! It's {a}!", "Well spotted! It's {a}!", "Hooray, it's {a}!"];

// Remember recent animals so the next few games show different ones.
const RECENT_KEY = "shadows:recent";
function readRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}
function writeRecent(ids) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, 16)));
  } catch {}
}

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

const fill = (t, id) => t.replace("{a}", aName(id));

/** Eight animals, fresh ones first, each with its own clues and three names to pick from. */
function makeRound() {
  const recent = readRecent();
  const fresh = shuffle(IDS.filter((id) => !recent.includes(id)));
  const stale = recent.filter((id) => IDS.includes(id)).reverse(); // oldest first
  const ids = [...fresh, ...stale].slice(0, ROUND);
  writeRecent([...ids, ...recent.filter((id) => !ids.includes(id))]);
  let lastQ = null;
  return ids.map((id) => {
    const info = INFO[id];
    const alike = shuffle(info.alike).slice(0, 1); // one look-alike keeps it thoughtful
    const others = shuffle(IDS.filter((x) => x !== id && !alike.includes(x)));
    const question = pick(QUESTIONS.filter((x) => x !== lastQ));
    lastQ = question;
    return {
      id,
      choices: shuffle([id, ...alike, ...others].slice(0, CHOICES)),
      clues: [...shuffle(info.hints).slice(0, 2), pick(info.give)],
      question,
    };
  });
}

export default function ShadowsGame() {
  const [round, setRound] = useState(null);
  const [q, setQ] = useState(0);
  const [phase, setPhase] = useState("ask"); // ask | right | done
  const [clues, setClues] = useState(0); // clues shown for this animal
  const [wrong, setWrong] = useState([]); // names guessed wrong for this animal
  const [points, setPoints] = useState(0);
  const [nope, setNope] = useState(null); // { choice, id }
  const [cheer, setCheer] = useState(null);
  const [result, setResult] = useState(null);

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

  const start = useCallback(
    () => {
      clearTimers();
      const r = makeRound();
      setRound(r);
      setQ(0);
      setPhase("ask");
      setClues(0);
      setWrong([]);
      setPoints(0);
      setNope(null);
      setCheer(null);
      setResult(null);
      sound.unfold();
      later(() => sound.say(r[0].question), 400);
    },
    [later]
  );

  // No menu: the first shadow is up as soon as the page opens.
  // (Deferred a tick: the round is random and reads localStorage, so it can't be made during server render.)
  useEffect(() => {
    const t = setTimeout(start, 0);
    return () => clearTimeout(t);
  }, [start]);

  const goHome = () => {
    clearTimers();
    sound.say("");
    router.push("/");
  };

  const animal = round?.[q];

  const showClue = () => {
    if (phase !== "ask" || clues >= animal.clues.length) return;
    setClues(clues + 1);
    sound.ding();
    sound.say(animal.clues[clues]);
  };

  const guess = (choice) => {
    if (phase !== "ask" || wrong.includes(choice)) return;
    if (choice === animal.id) {
      const earned = wrong.length === 0;
      setPhase("right");
      if (earned) setPoints((p) => p + 1);
      sound.match();
      setCheer({ id: nextId(), text: earned ? "+1 point!" : pick(CHEERS) });
      later(() => sound.say(fill(pick(PRAISE), choice)), 400);
      return;
    }
    // Wrong: no point for this one, but a clue helps them get there.
    sound.miss();
    setWrong((w) => [...w, choice]);
    setNope({ choice, id: nextId() });
    const no = fill(pick(WRONG), choice);
    if (clues < animal.clues.length) {
      setClues(clues + 1);
      sound.say(`${no} Here's a clue. ${animal.clues[clues]}`);
    } else {
      sound.say(`${no} Try again!`);
    }
  };

  const next = () => {
    clearTimers();
    if (q + 1 >= round.length) {
      const { best: b, isNew } = saveBestScore(GAME, "all", points);
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
    later(() => sound.say(round[q + 1].question), 300);
  };

  if (!round) {
    return (
      <main className="screen">
        <AppBar left={<HomeButton />} right={<SoundButton />} />
      </main>
    );
  }

  /* ---------------- Play ---------------- */
  const a = animal || round[round.length - 1];
  const solved = phase !== "ask";
  const clueList = a.clues;
  const cluesLeft = clueList.length - clues;
  const last = q + 1 >= round.length;

  return (
    <main className="screen">
      <AppBar
        left={<HomeButton />}
        center={<ProgressRail total={round.length} done={solved ? q + 1 : q} label={`Animal ${q + 1} of ${round.length}`} />}
        right={<SoundButton />}
      />

      <p className="engraved mt-1 text-center text-lg font-medium sm:text-xl" aria-live="polite">
        {solved
          ? `It's ${aName(a.id)}!`
          : wrong.length
            ? "Not quite! Read the clue and try again."
            : a.question}
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
              <button onClick={() => sound.say(a.question)} className="knob absolute top-2 left-2 scale-90" aria-label="Hear the question again">
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
      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-3 pb-3 sm:grid-cols-3">
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
          onReplay={start}
          onMenu={goHome}
          menuLabel="Back to games"
        />
      )}
    </main>
  );
}
