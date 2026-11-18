// Original illustrations for Pop the Balloons.
import { PIECE_PAINTS, SHAPE_PATHS } from "../shapes/art";

export const BALLOON_COLOURS = {
  red: "red",
  blue: "blue",
  yellow: "yellow",
  green: "green",
  purple: "purple",
  orange: "orange",
};

/** A rubber balloon on a string, optionally printed with a white symbol. */
export function Balloon({ paint, symbol }) {
  const [face, edge] = PIECE_PAINTS[paint];
  return (
    <svg viewBox="0 0 64 100" className="h-full w-full" aria-hidden focusable={false} overflow="visible">
      <path d="M32 74q-6 7 0 13t0 13" fill="none" stroke="#7A6650" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M27.5 75h9l-4.5-7Z" fill={face} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M32 4C50 4 60 19 60 36 60 55 45 70 32 70 19 70 4 55 4 36 4 19 14 4 32 4Z"
        fill={face}
        stroke={edge}
        strokeWidth="2.5"
      />
      {/* rubbery shading */}
      <path d="M32 4C50 4 60 19 60 36 60 55 45 70 32 70" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="7" />
      {symbol && (
        <path d={SHAPE_PATHS[symbol]} transform="translate(32 37) scale(0.42) translate(-32 -32)" fill="#fff" fillOpacity="0.93" />
      )}
      <ellipse cx="20" cy="22" rx="5.5" ry="10" transform="rotate(-28 20 22)" fill="#fff" opacity="0.5" />
      <circle cx="26" cy="11" r="2.2" fill="#fff" opacity="0.55" />
    </svg>
  );
}

/** Menu preview: a tiny framed sky with three balloons. */
export function SkyPreview({ balloons }) {
  return (
    <span className="sky-frame relative block size-[60px] shrink-0 overflow-hidden p-[5px]" aria-hidden>
      <span className="sky relative block h-full w-full overflow-hidden rounded-[6px]">
        {balloons.map((b, i) => (
          <span
            key={i}
            className="absolute w-[34%]"
            style={{ left: `${6 + i * 30}%`, top: `${[30, 8, 26][i]}%` }}
          >
            <Balloon paint={b.paint} symbol={b.symbol} />
          </span>
        ))}
      </span>
    </span>
  );
}
