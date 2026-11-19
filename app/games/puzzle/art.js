// Sliding Puzzle art helpers. The pictures themselves live in ./scenes.
// Every picture is drawn ONCE into <PictureLibrary /> and every tile shows its
// own square of it with <use>, so tiles always line up.
import { PICTURES, SIZE } from "./scenes";

export { PICTURES, SIZE };

const sceneId = (id) => `pz-scene-${id}`;

/** Draws every picture once, off screen, for tiles to <use>. Mount once per page. */
export function PictureLibrary() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable={false} style={{ overflow: "hidden" }}>
      <defs>
        {PICTURES.map(({ id, Scene }) => (
          <g key={id} id={sceneId(id)}>
            <Scene />
          </g>
        ))}
      </defs>
    </svg>
  );
}

/** One square of a picture: column `c`, row `r` of an `n` × `n` grid. */
export function PicturePart({ picture, n, c, r }) {
  const s = SIZE / n;
  return (
    <svg viewBox={`${c * s} ${r * s} ${s} ${s}`} className="block h-full w-full" aria-hidden focusable={false}>
      <use href={`#${sceneId(picture)}`} />
    </svg>
  );
}

/** The whole picture (the reference card on the table). */
export function WholePicture({ picture, className = "block h-full w-full" }) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={className} aria-hidden focusable={false}>
      <use href={`#${sceneId(picture)}`} />
    </svg>
  );
}

/**
 * A little wooden tray of tiles, drawn as one SVG: menus and covers.
 * `order[pos]` = which tile sits at that spot; the last tile number is the gap.
 */
export function MiniTray({ picture, n, order, className = "block h-full w-full" }) {
  const pad = 18;
  const gap = 5;
  const t = (SIZE - (n - 1) * gap) / n;
  const s = SIZE / n;
  const W = SIZE + pad * 2;
  return (
    <svg viewBox={`0 0 ${W} ${W}`} className={className} aria-hidden focusable={false}>
      <rect width={W} height={W} rx="30" fill="#C98A4A" stroke="#7A4A22" strokeWidth="6" />
      <rect x="4" y="4" width={W - 8} height={W - 8} rx="27" fill="none" stroke="#F0C48E" strokeWidth="3" opacity="0.6" />
      <rect x={pad - 4} y={pad - 4} width={SIZE + 8} height={SIZE + 8} rx="12" fill="#4A2A12" />
      {order.map((tile, pos) => {
        if (tile === n * n - 1) return null;
        const x = pad + (pos % n) * (t + gap);
        const y = pad + Math.floor(pos / n) * (t + gap);
        const tc = tile % n;
        const tr = Math.floor(tile / n);
        return (
          <g key={pos}>
            <rect x={x} y={y + 3} width={t} height={t} rx="8" fill="#2A1508" opacity="0.6" />
            <svg x={x} y={y} width={t} height={t} viewBox={`${tc * s} ${tr * s} ${s} ${s}`} preserveAspectRatio="none">
              <use href={`#${sceneId(picture)}`} />
            </svg>
            <rect x={x + 1} y={y + 1} width={t - 2} height={t - 2} rx="7" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" />
          </g>
        );
      })}
    </svg>
  );
}

/** Menu preview: a 60px tray. */
export function TrayPreview({ picture, n, order }) {
  return (
    <span className="relative block size-[60px] shrink-0 drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]" aria-hidden>
      <MiniTray picture={picture} n={n} order={order} />
    </span>
  );
}
