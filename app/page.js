import Link from "next/link";
import { AppBar, SoundButton } from "@/components/ui";
import { PlayIcon } from "@/components/icons";
import { CARD_SETS, CardFan } from "./games/memory/art";
import { Bucket, ItemArt, makeItem } from "./games/colours/art";
import { NumberBlock } from "./games/counting/art";

const STAR = makeItem("star", "red");
const BALLOON = makeItem("balloon", "blue");

function MemoryCover() {
  return (
    <div className="absolute inset-[12%_14%]">
      <CardFan set={CARD_SETS[0]} names={[null, "heart", null]} />
    </div>
  );
}

function ColoursCover() {
  return (
    <div className="absolute inset-x-[10%] top-[10%] bottom-[8%] flex flex-col items-center justify-between">
      <span className="mini-card-front grid aspect-square w-[24%] -rotate-6 place-items-center rounded-[10px]">
        <ItemArt item={STAR} className="h-[78%] w-[78%]" />
      </span>
      <span className="flex w-full items-end justify-center gap-[4%]">
        {["red", "yellow", "blue"].map((c) => (
          <span key={c} className="w-[26%] drop-shadow-[0_5px_4px_rgba(0,0,0,0.35)]">
            <Bucket colour={c} />
          </span>
        ))}
      </span>
    </div>
  );
}

function CountingCover() {
  return (
    <div className="absolute inset-x-[10%] top-[12%] bottom-[10%] flex flex-col items-center justify-between">
      <span className="flex w-full justify-center gap-[3%]">
        {[-6, 4, -3].map((t, i) => (
          <span key={i} className="w-[18%] drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]" style={{ transform: `rotate(${t}deg)` }}>
            <ItemArt item={BALLOON} className="h-full w-full" />
          </span>
        ))}
      </span>
      <span className="flex w-full items-end justify-center gap-[4%]">
        {[
          [2, "red"],
          [3, "blue"],
          [4, "green"],
        ].map(([v, p]) => (
          <span key={v} className={`w-[22%] drop-shadow-[0_5px_4px_rgba(0,0,0,0.4)] ${v === 3 ? "-translate-y-[10%]" : ""}`}>
            <NumberBlock value={v} paint={p} />
          </span>
        ))}
      </span>
    </div>
  );
}

const GAMES = [
  { href: "/games/memory", title: "Memory", blurb: "Flip the cards and find all the pairs.", Cover: MemoryCover, btn: "" },
  { href: "/games/colours", title: "Colours", blurb: "Drop each thing in the paint of the same colour.", Cover: ColoursCover, btn: "btn-blue" },
  { href: "/games/counting", title: "Counting", blurb: "Count the things and pick the right number.", Cover: CountingCover, btn: "btn-orange" },
];

export default function Home() {
  return (
    <main className="screen">
      <AppBar right={<SoundButton />} />

      {/* Hanging sign */}
      <section className="flex flex-col items-center pt-2 pb-8 sm:pt-4 sm:pb-12">
        <div className="sway ropes">
          <div className="sign">
            <h1 className="toy-title px-4 text-5xl sm:text-7xl">Play Time</h1>
          </div>
        </div>
        <p className="engraved mt-5 text-xl font-medium sm:text-2xl">Pick a game and have fun!</p>
      </section>

      <section aria-labelledby="games-heading" className="mx-auto w-full max-w-5xl">
        <h2 id="games-heading" className="sr-only">
          Games
        </h2>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map(({ href, title, blurb, Cover, btn }) => (
            <li key={href}>
              <Link href={href} className="game-link block h-full rounded-[22px]">
                <article className="tile h-full flex-col p-3">
                  <div className="felt aspect-[16/10] w-full">
                    <Cover />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-2 pt-4 pb-2">
                    <h3 className="printed text-3xl font-bold sm:text-4xl">{title}</h3>
                    <p className="printed-soft flex-1 text-lg leading-snug">{blurb}</p>
                    <span className={`btn ${btn} mt-2 w-full`}>
                      <PlayIcon /> Play
                    </span>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-xs">
          <div className="paper px-4 pt-6 pb-4 text-center" style={{ transform: "rotate(-1.5deg)" }}>
            <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg] whitespace-nowrap">Coming soon</span>
            <p className="printed text-lg font-semibold">More games are on the way!</p>
          </div>
        </div>
      </section>
    </main>
  );
}
