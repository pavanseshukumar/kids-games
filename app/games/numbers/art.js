// The Number Hunt tile: a two-sided wooden tile that flips over to show its number.
// Closed, it shows a coloured back with a "?"; open, the cream face with the number.
export const PAINTS = ["red", "blue", "green", "yellow", "orange", "purple"];

export function NumTile({ n, paint, open = false, done = false, peek = false, as: Tag = "span", className = "", ...rest }) {
  return (
    <Tag className={`num-tile ${className}`} data-paint={paint} data-open={open} data-done={done} data-peek={peek} {...rest}>
      <span className="num-flip">
        <span className="num-face num-back" aria-hidden>
          ?
        </span>
        <span className="num-face num-front" aria-hidden>
          {n}
        </span>
      </span>
    </Tag>
  );
}
