// Original illustrations for Ice Cream Stack. Scoops are drawn centred on (0, 0),
// about 68 wide. The cone's mouth is at (0, 0) and its tip points down.
const INK = "#3D2A1E";

export const FLAVOURS = {
  strawberry: { name: "strawberry", face: "#F7A8C4", edge: "#B84E77", deco: "sprinkles" },
  chocolate: { name: "chocolate", face: "#9A6440", edge: "#4E2E1A", deco: "shine" },
  vanilla: { name: "vanilla", face: "#FFF1C9", edge: "#B8955A", deco: "seeds" },
  mint: { name: "mint", face: "#A6E8CA", edge: "#3E9C74", deco: "chips" },
  blueberry: { name: "blueberry", face: "#A9C0F7", edge: "#4A63B8", deco: "berries" },
  lemon: { name: "lemon", face: "#FFE680", edge: "#B8920A", deco: "zest" },
};
export const FLAVOUR_IDS = Object.keys(FLAVOURS);

const SCOOP =
  "M-34 6C-37-22-19-34 0-34S37-22 34 6C31 11 26 15 20 12 16 19 9 19 6 13 0 19-8 19-12 12-18 17-27 15-30 10Z";

const SPRINKLES = [
  [-18, -16, 30, "#E5483B"],
  [-4, -24, -20, "#3A8DE6"],
  [12, -14, 60, "#F8C630"],
  [20, -2, -40, "#3FB35F"],
  [-22, -2, 10, "#9B6BE0"],
  [2, -6, 80, "#fff"],
];

function Deco({ kind }) {
  if (kind === "sprinkles")
    return SPRINKLES.map(([x, y, r, c], i) => (
      <rect key={i} x={x - 4} y={y - 1.6} width="8" height="3.2" rx="1.6" fill={c} transform={`rotate(${r} ${x} ${y})`} />
    ));
  if (kind === "chips")
    return [[-16, -14], [6, -22], [18, -6], [-6, -2], [-24, 0]].map(([x, y], i) => (
      <path key={i} d={`M${x} ${y - 3}l4 5h-8Z`} fill="#4E2E1A" />
    ));
  if (kind === "seeds")
    return [[-14, -16], [8, -20], [18, -4], [-4, -6], [-22, -2], [4, 4]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="1.6" ry="1" fill="#6B4A2A" />
    ));
  if (kind === "berries")
    return [[-14, -14], [10, -18], [16, -2]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="5" fill="#4A63B8" stroke={INK} strokeWidth="1.5" />
        <circle cx={x - 1.5} cy={y - 1.5} r="1.4" fill="#fff" opacity="0.7" />
      </g>
    ));
  if (kind === "zest")
    return [[-14, -16, 20], [8, -20, -30], [18, -4, 50], [-6, -4, -10]].map(([x, y, r], i) => (
      <path key={i} d={`M${x - 4} ${y}q4-3 8 0`} fill="none" stroke="#F59A2E" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${r} ${x} ${y})`} />
    ));
  return <path d="M14-22q8 6 10 16" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />;
}

/** One scoop of ice cream. */
export function Scoop({ flavour }) {
  const f = FLAVOURS[flavour];
  return (
    <g>
      <path d={SCOOP} fill={f.face} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      {/* shading on the right and along the drips */}
      <path d="M8-32C26-28 37-14 34 6C31 11 26 15 20 12" fill="none" stroke={f.edge} strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="-14" cy="-20" rx="7" ry="4.5" transform="rotate(-30 -14 -20)" fill="#fff" opacity="0.6" />
      <Deco kind={f.deco} />
    </g>
  );
}

/** A cherry for the very top. */
export function Cherry() {
  return (
    <g>
      <path d="M0-10q2-14 12-18" fill="none" stroke="#3FA65E" strokeWidth="3" strokeLinecap="round" />
      <circle r="10" fill="#E5483B" stroke={INK} strokeWidth="3" />
      <circle cx="-3.5" cy="-3.5" r="3" fill="#fff" opacity="0.7" />
    </g>
  );
}

/** Waffle cone, mouth at (0,0), tip at (0, 95). */
export function Cone() {
  return (
    <g>
      <defs>
        <clipPath id="ic-cone-clip">
          <path d="M-32 0H32L0 95Z" />
        </clipPath>
      </defs>
      <path d="M-32 0H32L0 95Z" fill="#E8B26A" />
      <g clipPath="url(#ic-cone-clip)" stroke="#B9782F" strokeWidth="3">
        {[-60, -40, -20, 0, 20, 40, 60].map((k) => (
          <path key={k} d={`M${k - 40} 0l80 100M${k + 40} 0l-80 100`} />
        ))}
      </g>
      <path d="M-32 0H32L0 95Z" fill="none" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="-36" y="-6" width="72" height="14" rx="6" fill="#D99A50" stroke={INK} strokeWidth="3.5" />
      <path d="M-28-1h56" stroke="#F3C98A" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** Wooden cone holder on the counter; drawn IN FRONT of the cone. Top at y = 0. */
export function Holder() {
  return (
    <g>
      <rect x="-44" y="0" width="88" height="40" rx="8" fill="#C98A4A" stroke={INK} strokeWidth="3.5" />
      <path d="M-36 8h72" stroke="#F0C48E" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="0" cy="2" rx="18" ry="5" fill="#6E4322" />
    </g>
  );
}

/** The splat a dropped scoop leaves on the counter, centred on (0,0). */
export function Splat({ flavour }) {
  const f = FLAVOURS[flavour];
  return (
    <g>
      <path
        d="M-40 0C-44-8-30-10-26-16-24-24-12-20-6-24 2-28 10-20 18-22 28-24 30-12 38-10 46-6 44 2 36 4 20 8-20 8-36 4Z"
        fill={f.face}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="-48" cy="-6" r="4" fill={f.face} stroke={INK} strokeWidth="2" />
      <circle cx="50" cy="-12" r="3" fill={f.face} stroke={INK} strokeWidth="2" />
      <ellipse cx="-10" cy="-12" rx="7" ry="3" fill="#fff" opacity="0.5" />
    </g>
  );
}

/**
 * The scooper that rides along the rail. The held scoop hangs below at (0, 58)
 * and is drawn by the game so it can drop away.
 */
export function ScooperBack() {
  return (
    <g>
      <path d="M0 4v30" stroke="#8E949C" strokeWidth="8" strokeLinecap="round" />
      <path d="M0 4v30" stroke="#D5DADF" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
export function ScooperFront({ open }) {
  return (
    <g>
      {/* carriage on the rail */}
      <rect x="-20" y="-10" width="40" height="20" rx="7" fill="#E5483B" stroke={INK} strokeWidth="3" />
      <circle cx="-10" cy="-10" r="4" fill="#C9CDD2" stroke={INK} strokeWidth="2" />
      <circle cx="10" cy="-10" r="4" fill="#C9CDD2" stroke={INK} strokeWidth="2" />
      {/* metal scoop bowl, opening downwards; jaws part when it lets go */}
      <g style={{ transition: "transform 120ms" }} transform={open ? "translate(-5 0) rotate(-14 -36 44)" : undefined}>
        <path d="M-38 48A38 22 0 0 1 0 28V48Z" fill="#C9CDD2" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <g style={{ transition: "transform 120ms" }} transform={open ? "translate(5 0) rotate(14 36 44)" : undefined}>
        <path d="M38 48A38 22 0 0 0 0 28V48Z" fill="#AEB4BB" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <path d="M-26 38q10-6 20-6" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

/** Menu preview: a cone with `n` scoops. */
export function StackPreview({ n }) {
  const flavours = ["strawberry", "mint", "chocolate", "lemon"];
  return (
    <span className="relative block size-[60px] shrink-0 drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]" aria-hidden>
      <svg viewBox="-70 -166 140 266" className="h-full w-full">
        <Cone />
        {Array.from({ length: n }, (_, i) => (
          <g key={i} transform={`translate(${i === 0 ? 0 : i % 2 ? 5 : -4} ${-18 - i * 36})`}>
            <Scoop flavour={flavours[i]} />
          </g>
        ))}
      </svg>
    </span>
  );
}

/** A cone with a little tower of scoops, for covers and headers (SVG <g>). */
export function TowerArt({ flavours, lean = [0, -6, 4, 10, 6], cherry = true }) {
  const top = -18 - (flavours.length - 1) * 44;
  return (
    <g>
      <Cone />
      {flavours.map((f, i) => (
        <g key={i} transform={`translate(${lean[i] || 0} ${-18 - i * 44}) rotate(${(lean[i] || 0) / 2})`}>
          <Scoop flavour={f} />
        </g>
      ))}
      {cherry && (
        <g transform={`translate(${lean[flavours.length - 1] || 0} ${top - 38})`}>
          <Cherry />
        </g>
      )}
    </g>
  );
}
