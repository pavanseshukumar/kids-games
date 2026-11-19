import Link from "next/link";
import { AppBar, SoundButton } from "@/components/ui";
import { PlayIcon } from "@/components/icons";
import { CARD_SETS, CardFan } from "./games/memory/art";
import { Bucket, ItemArt, makeItem } from "./games/colours/art";
import { NumberBlock } from "./games/counting/art";
import { Hole, Piece } from "./games/shapes/art";
import { Bead } from "./games/patterns/art";
import { Balloon } from "./games/balloons/art";
import { FlowerPot, Pipe, Tap } from "./games/water/art";
import { Carriage, Engine, Station, Tree } from "./games/train/art";
import { Chute, Cup, Marble, Ramp } from "./games/marble/art";

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

function ShapesCover() {
  return (
    <div className="absolute inset-x-[14%] top-[10%] bottom-[12%] flex flex-col items-center justify-between">
      <span className="w-[22%] -rotate-12 drop-shadow-[0_8px_6px_rgba(0,0,0,0.4)]">
        <Piece shape="star" paint="yellow" />
      </span>
      <span className="sorter-board grid w-[78%] grid-cols-3 gap-[6%] p-[5%]">
        {[
          ["circle", "blue"],
          ["star", null],
          ["heart", "red"],
        ].map(([s, p]) => (
          <span key={s} className="relative aspect-square">
            <Hole shape={s} />
            {p && (
              <span className="absolute inset-0">
                <Piece shape={s} paint={p} seated />
              </span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
}

function BalloonsCover() {
  return (
    <div className="sky absolute inset-[7%] overflow-hidden">
      {[
        ["red", 10, 34, -8],
        ["blue", 34, 10, 4],
        ["red", 58, 28, 8],
        ["yellow", 78, 46, -4],
      ].map(([p, x, y, r], i) => (
        <span
          key={i}
          className="absolute w-[17%] drop-shadow-[0_5px_4px_rgba(20,50,90,0.3)]"
          style={{ left: `${x}%`, top: `${y}%`, transform: `rotate(${r}deg)` }}
        >
          <Balloon paint={p} />
        </span>
      ))}
    </div>
  );
}

function WaterCover() {
  // tap → straight → bend down → bend right → pot
  const tiles = [
    ["straight", 1, true],
    ["corner", 2, true],
    [null],
    [null],
    ["corner", 0, true],
    ["straight", 1, false],
  ];
  return (
    <div className="absolute inset-[9%] grid place-items-center">
      <div className="water-board sorter-board" style={{ "--n": 3, "--tile": "min(3.4rem, 15vw)", gridTemplateRows: "repeat(2, var(--tile))", gridTemplateColumns: "calc(var(--tile) * .64) repeat(3, var(--tile)) calc(var(--tile) * .64)", padding: "0.4rem 0.3rem" }}>
        <span className="water-end" style={{ gridColumn: 1, gridRow: 1 }}>
          <Tap />
        </span>
        {tiles.map(([type, rot, wet], i) => (
          <span key={i} className="pipe-tile" style={{ gridColumn: (i % 3) + 2, gridRow: Math.floor(i / 3) + 1 }}>
            {type && (
              <span className="pipe-turn" style={{ transform: `rotate(${rot * 90}deg)` }}>
                <Pipe type={type} wet={wet} />
              </span>
            )}
          </span>
        ))}
        <span className="water-end" style={{ gridColumn: 5, gridRow: 2 }}>
          <FlowerPot bloom={false} />
        </span>
      </div>
    </div>
  );
}

function TrainCover() {
  const d = "M60 60H200Q260 60 260 120V140Q260 200 320 200H460";
  return (
    <svg viewBox="0 0 520 260" className="absolute inset-[6%] h-[88%] w-[88%]" aria-hidden>
      <path d={d} fill="none" stroke="#7A4A22" strokeWidth="46" strokeDasharray="9 15" />
      <path d={d} fill="none" stroke="#B9BEC4" strokeWidth="32" />
      <path d={d} fill="none" stroke="#2A7A4B" strokeWidth="22" />
      <g transform="translate(60 60)">
        <Station />
      </g>
      <g transform="translate(460 200)">
        <Station flag />
      </g>
      <g transform="translate(120 190) scale(1.1)">
        <Tree />
      </g>
      <g transform="translate(400 70) scale(0.9)">
        <Tree />
      </g>
      <g transform="translate(150 60)">
        <Carriage riders={2} />
      </g>
      <g transform="translate(226 66) rotate(25)">
        <Engine />
      </g>
    </svg>
  );
}

function PatternsCover() {
  return (
    <div className="absolute inset-x-[8%] top-[12%] bottom-[16%] flex flex-col items-center justify-between">
      <span className="w-[16%] rotate-6 drop-shadow-[0_8px_6px_rgba(0,0,0,0.4)]">
        <Bead paint="blue" />
      </span>
      <span className="bead-string w-full" style={{ "--bead": "15%", gap: "2%" }}>
        {["red", "blue", "red", "blue", "red"].map((p, i) => (
          <span key={i} className="bead-slot">
            <Bead paint={p} />
          </span>
        ))}
        <span className="bead-slot bead-gap" style={{ fontSize: "1.25rem" }}>
          ?
        </span>
      </span>
    </div>
  );
}

function MarbleCover() {
  return (
    <svg viewBox="0 0 400 250" className="absolute inset-[6%] h-[88%] w-[88%]" aria-hidden>
      <rect x="40" y="0" width="320" height="250" rx="24" fill="#E2B784" stroke="#9C6A3C" strokeWidth="6" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={90 + (i % 4) * 75} cy={60 + Math.floor(i / 4) * 70} r="5" fill="#6E4322" opacity="0.5" />
      ))}
      <g transform="translate(130 35)">
        <Chute />
      </g>
      <g transform="translate(150 95)">
        <Ramp dir={1} paint={0} />
      </g>
      <g transform="translate(250 145)">
        <Ramp dir={-1} locked />
      </g>
      <g transform="translate(150 185)">
        <Ramp dir={1} paint={1} />
      </g>
      <g transform="translate(184 74)">
        <Marble />
      </g>
      <g transform="translate(270 205) scale(0.7)">
        <Cup />
      </g>
    </svg>
  );
}

const GAMES = [
  { href: "/games/memory", title: "Memory", blurb: "Flip the cards and find all the pairs.", Cover: MemoryCover, btn: "" },
  // { href: "/games/colours", title: "Colours", blurb: "Drop each thing in the paint of the same colour.", Cover: ColoursCover, btn: "btn-blue" },
  // { href: "/games/counting", title: "Counting", blurb: "Count the things and pick the right number.", Cover: CountingCover, btn: "btn-orange" },
  // { href: "/games/shapes", title: "Shape Sorter", blurb: "Fit each wooden shape into its hole.", Cover: ShapesCover, btn: "btn-red" },
  // { href: "/games/patterns", title: "What Comes Next?", blurb: "Finish the bead pattern on the string.", Cover: PatternsCover, btn: "btn-blue" },
  { href: "/games/balloons", title: "Pop the Balloons", blurb: "Pop only the balloons the card asks for.", Cover: BalloonsCover, btn: "btn-orange" },
  { href: "/games/water", title: "Water Flow", blurb: "Turn the pipes to water the flower.", Cover: WaterCover, btn: "btn-blue" },
  { href: "/games/train", title: "Train Track", blurb: "Draw a track and drive the train home.", Cover: TrainCover, btn: "btn-red" },
  { href: "/games/marble", title: "Marble Run", blurb: "Flip the ramps and roll the marble into the cup.", Cover: MarbleCover, btn: "btn-orange" },
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

      <section aria-labelledby="games-heading" className="mx-auto w-full max-w-4xl">
        <h2 id="games-heading" className="sr-only">
          Games
        </h2>

        <ul className="grid gap-5 sm:grid-cols-2">
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
