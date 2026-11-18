// Original illustrations for Water Flow: copper pipe tiles, a brass tap, a flower pot.

/* Open sides as a bitmask: N=1, E=2, S=4, W=8. Pipes are drawn in their base orientation. */
export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;
export const BASE_MASK = { straight: N | S, corner: N | E };

/** Rotate an open-sides mask clockwise `times` quarter turns. */
export function rotateMask(mask, times) {
  let m = mask;
  for (let i = 0; i < ((times % 4) + 4) % 4; i++) m = ((m << 1) | (m >> 3)) & 15;
  return m;
}

const PIPE_PATH = {
  straight: "M50 0V100",
  corner: "M50 0V22A28 28 0 0 0 78 50H100",
};

/** Brass collars where the pipe meets the tile edge. */
function Collars({ type }) {
  const top = <rect x="29" y="-1" width="42" height="9" rx="2" />;
  const bottom = <rect x="29" y="92" width="42" height="9" rx="2" />;
  const right = <rect x="92" y="29" width="9" height="42" rx="2" />;
  return (
    <g fill="#B8823F" stroke="#6E4322" strokeWidth="2">
      {top}
      {type === "straight" ? bottom : right}
    </g>
  );
}

/**
 * A pipe tile. The tile itself is drawn by CSS; this is just the copper pipe.
 * `wet` fills the channel with flowing water.
 */
export function Pipe({ type, wet }) {
  const d = PIPE_PATH[type];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden focusable={false} overflow="visible">
      <path d={d} fill="none" stroke="#6E4322" strokeWidth="36" />
      <path d={d} fill="none" stroke="#D39A5C" strokeWidth="29" />
      <path d={d} fill="none" stroke="#F0C48E" strokeWidth="4" strokeOpacity="0.8" transform="translate(-7 -2)" className="pipe-shine" />
      <path d={d} fill="none" strokeWidth="15" className="pipe-channel" data-wet={wet} />
      {wet && <path d={d} fill="none" strokeWidth="3" className="pipe-flow" />}
      <Collars type={type} />
    </svg>
  );
}

/** The brass tap on the wall feeding the first tile. */
export function Tap() {
  return (
    <svg viewBox="0 0 64 100" className="h-full w-full" aria-hidden focusable={false} overflow="visible">
      {/* pipe stub into the board */}
      <path d="M20 50H64" stroke="#6E4322" strokeWidth="36" />
      <path d="M20 50H64" stroke="#D39A5C" strokeWidth="29" />
      <path d="M20 50H64" stroke="#3FA9F5" strokeWidth="15" />
      <path d="M20 50H64" stroke="#BFE6FF" strokeWidth="3" className="pipe-flow" />
      {/* tap body */}
      <rect x="2" y="28" width="26" height="44" rx="8" fill="#C9A43A" stroke="#6E4322" strokeWidth="3" />
      <rect x="6" y="32" width="6" height="34" rx="3" fill="#F3DD8A" opacity="0.7" />
      {/* valve wheel */}
      <path d="M15 28V16" stroke="#6E4322" strokeWidth="5" />
      <circle cx="15" cy="12" r="10" fill="#E5483B" stroke="#8E2A20" strokeWidth="3" />
      <path d="M8 12h14M15 5v14" stroke="#8E2A20" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Terracotta pot fed by a pipe. The flower droops until `bloom`. */
export function FlowerPot({ bloom }) {
  return (
    <svg viewBox="0 0 64 100" className="h-full w-full" aria-hidden focusable={false} overflow="visible">
      {/* pipe stub from the board into the pot */}
      <path d="M0 50H22" stroke="#6E4322" strokeWidth="36" />
      <path d="M0 50H22" stroke="#D39A5C" strokeWidth="29" />
      <path d="M0 50H22" strokeWidth="15" className="pipe-channel" data-wet={bloom} />
      {/* flower */}
      <g className="flower" data-bloom={bloom}>
        <path d="M40 66C40 50 40 40 40 28" fill="none" stroke="#2F8F4E" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 52c-10-2-14-8-14-12 6 0 12 4 14 12Z" fill="#4CB860" stroke="#23803F" strokeWidth="2" />
        <path d="M40 46c8-2 12-7 12-11-5 0-10 4-12 11Z" fill="#4CB860" stroke="#23803F" strokeWidth="2" />
        <g className="flower-head">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="40" cy="17" rx="6" ry="9" fill="#F2709C" stroke="#B83E6A" strokeWidth="2" transform={`rotate(${a} 40 26)`} />
          ))}
          <circle cx="40" cy="26" r="6" fill="#FFD23F" stroke="#B8870A" strokeWidth="2" />
        </g>
      </g>
      {/* pot */}
      <path d="M20 64h40l-5 32H25Z" fill="#D9774A" stroke="#7A3A1E" strokeWidth="3" strokeLinejoin="round" />
      <rect x="17" y="58" width="46" height="10" rx="3" fill="#E58A5C" stroke="#7A3A1E" strokeWidth="3" />
      <path d="M26 72v18" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Menu preview: tap → bend → pot on a little board. */
export function WaterPreview({ size }) {
  const n = size;
  const cells = Array.from({ length: n * n }, (_, i) => i);
  const mid = Math.floor(n / 2);
  return (
    <span className="sorter-board relative grid size-[60px] shrink-0 place-items-center p-[6px]" aria-hidden>
      <span className="grid h-full w-full gap-[2px]" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {cells.map((i) => {
          const r = Math.floor(i / n);
          return (
            <span key={i} className="pipe-tile-mini">
              {r === mid && (
                <span className="block h-full w-full rotate-90">
                  <Pipe type="straight" wet={i % n <= mid} />
                </span>
              )}
            </span>
          );
        })}
      </span>
    </span>
  );
}
