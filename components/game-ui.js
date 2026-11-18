"use client";

// Building blocks every game screen shares: menu headings, level buttons,
// the progress rail, and the win sheet with confetti.
import { useState } from "react";
import { Stars } from "./ui";
import { ArrowIcon, PlayIcon, ReplayIcon } from "./icons";

export function StepHeading({ n, children, id }) {
  return (
    <h2 id={id} className="engraved label mb-3 flex items-center justify-center gap-2">
      {n != null && (
        <span
          className="grid size-6 place-items-center rounded-full text-sm text-white"
          style={{
            background: "radial-gradient(circle at 40% 30%, #ff8c7e, #e5483b 65%)",
            boxShadow: "0 2px 0 #a42c22, inset 0 1px 1px rgba(255,255,255,.6)",
            textShadow: "0 1px 0 rgba(0,0,0,.3)",
          }}
          aria-hidden
        >
          {n}
        </span>
      )}
      {children}
    </h2>
  );
}

/** Paper tile that starts a level: preview art, name, detail, best stars. */
export function LevelButton({ preview, name, detail, stars, onClick, ...rest }) {
  return (
    <button
      onClick={onClick}
      className="tile items-center gap-4 px-4 py-3 text-left sm:flex-col sm:gap-2 sm:px-4 sm:py-5 sm:text-center"
      {...rest}
    >
      {preview}
      <span className="flex min-w-0 flex-1 flex-col sm:items-center">
        <span className="printed text-2xl font-semibold">{name}</span>
        <span className="printed-soft text-base">{detail}</span>
        <span className="mt-1">
          <Stars count={stars} size={22} />
        </span>
      </span>
      <span className="play-badge sm:hidden" aria-hidden>
        <PlayIcon />
      </span>
    </button>
  );
}

/** Marbles in a wooden rail: one hole per step, filled as the child progresses. */
export function ProgressRail({ total, done, label }) {
  return (
    <div className="rail" data-dense={total > 8} role="status" aria-label={label}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="hole" data-on={i < done} />
      ))}
    </div>
  );
}

const CONFETTI_COLORS = ["#E5483B", "#F59A2E", "#F8C630", "#3FB35F", "#3A8DE6", "#F2709C"];

function makeConfetti() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    dx: (Math.random() - 0.5) * 220,
    rot: (Math.random() - 0.5) * 1080,
    dur: 2.4 + Math.random() * 1.6,
    delay: Math.random() * 0.5,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));
}

/**
 * End-of-round celebration. Bottom sheet on phones, centred card on larger screens.
 * `next` is optional: { label, onClick } for the harder level.
 */
export function WinSheet({ stars, summary, detail, next, onReplay, onMenu, menuLabel }) {
  const [confetti] = useState(makeConfetti);
  return (
    <div className="scrim fixed inset-0 z-20 flex items-end justify-center sm:items-center sm:p-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti"
            style={{
              left: `${c.left}%`,
              background: c.color,
              "--dx": `${c.dx}px`,
              "--rot": `${c.rot}deg`,
              "--dur": `${c.dur}s`,
              "--delay": `${c.delay}s`,
            }}
          />
        ))}
      </div>
      <div role="dialog" aria-modal="true" aria-labelledby="win-title" className="paper sheet relative text-center">
        <span className="sheet-handle" aria-hidden />
        <div className="isolate inline-block">
          <h2 id="win-title" className="ribbon text-3xl sm:text-4xl">
            You did it!
          </h2>
        </div>
        <div className="my-5 flex justify-center">
          <Stars count={stars} size={68} animate />
        </div>
        <p className="printed text-xl font-medium">{summary}</p>
        {detail && <p className="printed-soft mt-1 text-base">{detail}</p>}
        <div className="mt-6 flex flex-col gap-4">
          {next ? (
            <>
              <button onClick={next.onClick} className="btn w-full" autoFocus>
                {next.label} <ArrowIcon />
              </button>
              <button onClick={onReplay} className="btn btn-cream w-full">
                <ReplayIcon /> Play again
              </button>
            </>
          ) : (
            <button onClick={onReplay} className="btn w-full" autoFocus>
              <ReplayIcon /> Play again
            </button>
          )}
          <button
            onClick={onMenu}
            className="printed-soft min-h-12 text-lg font-semibold underline decoration-2 underline-offset-4"
          >
            {menuLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
