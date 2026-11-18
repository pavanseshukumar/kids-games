import Link from "next/link";
import { AppBar, SoundButton } from "@/components/ui";
import { PlayIcon } from "@/components/icons";
import { CARD_SETS, CardFan } from "./games/memory/art";

const INK = "#3D2A1E";

function ColorsArt() {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M24 70c-8-20 6-48 34-52 26-4 44 14 40 32-3 12-16 10-22 16-6 7 0 18-14 20-16 2-32-2-38-16Z" fill="#F4C98B" />
        <circle cx="66" cy="62" r="6" fill="#FFFAF0" />
        <circle cx="42" cy="38" r="7" fill="#F2709C" />
        <circle cx="62" cy="30" r="7" fill="#FFD84D" />
        <circle cx="80" cy="42" r="7" fill="#3FA9F5" />
        <circle cx="40" cy="58" r="7" fill="#4CCB7E" />
      </g>
    </svg>
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

const SOON = [
  { title: "Colours", Art: ColorsArt },
  { title: "Counting", Art: CountingArt },
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

        {/* Featured game: a box with a felt window */}
        <Link href="/games/memory" className="game-link block rounded-[22px]">
          <article className="tile flex-col overflow-hidden p-3 sm:flex-row sm:items-stretch sm:gap-2">
            <div className="felt aspect-[16/10] w-full sm:aspect-auto sm:w-1/2">
              <div className="absolute inset-[12%_14%]">
                <CardFan set={CARD_SETS[0]} names={[null, "heart", null]} />
              </div>
            </div>
            <div className="flex flex-col gap-3 px-2 pt-4 pb-2 sm:w-1/2 sm:justify-center sm:px-6">
              <h3 className="printed text-4xl font-bold">Memory</h3>
              <p className="printed-soft text-lg leading-snug">Flip the cards and find all the pairs.</p>
              <span className="btn mt-1 w-full sm:w-auto sm:self-start">
                <PlayIcon /> Play
              </span>
            </div>
          </article>
        </Link>

        {/* Coming soon: paper notes with masking tape */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {SOON.map(({ title, Art }, i) => (
            <div
              key={title}
              className="paper flex flex-col items-center px-3 pt-7 pb-4 text-center"
              style={{ transform: `rotate(${i ? 1.5 : -1.5}deg)` }}
              aria-label={`${title}, coming soon`}
              role="group"
            >
              <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg] whitespace-nowrap">Coming soon</span>
              <span className="block h-16 w-24 opacity-75 grayscale-[35%] sm:h-20 sm:w-28">
                <Art />
              </span>
              <h3 className="printed mt-2 text-xl font-semibold">{title}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
