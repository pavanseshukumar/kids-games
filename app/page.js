import Link from "next/link";
import { AppBar, SoundButton } from "@/components/ui";
import { PlayIcon } from "@/components/icons";
import { CARD_SETS, CardFan } from "./games/memory/art";
import { Bucket, ItemArt, makeItem } from "./games/colours/art";

const COVER_ITEM = makeItem("star", "red");

const INK = "#3D2A1E";

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
        <ItemArt item={COVER_ITEM} className="h-[78%] w-[78%]" />
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

function CountingArt() {
  const colors = ["#F2709C", "#3FA9F5", "#4CCB7E"];
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        {colors.map((c, i) => (
          <g key={c}>
            <rect x={14 + i * 34} y={70 - (i + 1) * 18} width="28" height={(i + 1) * 18} rx="4" fill={c} />
            <text x={28 + i * 34} y={70 - (i + 1) * 18 - 6} textAnchor="middle" fontSize="16" fontWeight="700" fill={INK} stroke="none" fontFamily="inherit">
              {i + 1}
            </text>
          </g>
        ))}
        <path d="M8 72h104" />
      </g>
    </svg>
  );
}

const GAMES = [
  { href: "/games/memory", title: "Memory", blurb: "Flip the cards and find all the pairs.", Cover: MemoryCover, btn: "" },
  { href: "/games/colours", title: "Colours", blurb: "Drop each thing in the paint of the same colour.", Cover: ColoursCover, btn: "btn-blue" },
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

      <section aria-labelledby="games-heading" className="mx-auto w-full max-w-3xl">
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

        {/* Coming soon: paper note with masking tape */}
        <div className="mx-auto mt-8 max-w-xs">
          <div className="paper flex items-center gap-4 px-4 pt-6 pb-4" style={{ transform: "rotate(-1.5deg)" }} role="group" aria-label="Counting, coming soon">
            <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg] whitespace-nowrap">Coming soon</span>
            <span className="block h-14 w-20 shrink-0 opacity-75 grayscale-[35%]">
              <CountingArt />
            </span>
            <h3 className="printed text-xl font-semibold">Counting</h3>
          </div>
        </div>
      </section>
    </main>
  );
}
