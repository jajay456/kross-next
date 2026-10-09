import { useMemo, useRef } from "react";
import { ASSESSMENT_FIELDS } from "../data/players";

const CARD_COUNT = 14;
// Vertical offsets (in cqw) so the ring looks scattered rather than a flat band.
const OFFSETS = [-14, 6, -4, 12, -10, 2, 14, -12, 8, -6, 10, -2, -14, 4];
// Dark tints for cards without a photo.
const TINTS = [
  "from-lime/50 to-neutral-900",
  "from-rose-500/50 to-neutral-900",
  "from-sky-500/50 to-neutral-900",
  "from-amber-400/50 to-neutral-900",
  "from-violet-500/50 to-neutral-900",
  "from-emerald-500/50 to-neutral-900",
];

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

// Most recent assessment or training class date (ms), or 0 if none.
// Dates are stored as display strings like "24 Aug 2026".
function lastActivity(player) {
  const dates = [...(player.assessmentHistory || []), ...(player.recentClasses || [])]
    .map((e) => Date.parse(e.date))
    .filter((t) => !Number.isNaN(t));
  return dates.length ? Math.max(...dates) : 0;
}

// Most recently active players first (the first card starts at the front and
// the rest rotate in after it); fill any remaining slots with players who have
// photos, then the rest in a stable order (so edits don't reshuffle the ring).
function pickPlayers(players) {
  const active = players
    .map((p) => ({ p, t: lastActivity(p) }))
    .filter(({ t }) => t > 0)
    .sort((a, b) => b.t - a.t)
    .map(({ p }) => p);
  const idle = players.filter((p) => lastActivity(p) === 0);
  const withImage = idle.filter((p) => p.image);
  const rest = idle.filter((p) => !p.image).sort((a, b) => a.id.localeCompare(b.id));
  return [...active, ...withImage, ...rest].slice(0, CARD_COUNT);
}

export default function PlayerHero({ players, onSelect }) {
  const sceneRef = useRef(null);
  // Re-pick when the roster loads/changes so new activity reorders the ring.
  const cards = useMemo(() => pickPlayers(players), [players]);

  // Tilt the whole scene towards the pointer.
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    sceneRef.current?.style.setProperty("--tilt-x", `${-y * 10}deg`);
    sceneRef.current?.style.setProperty("--tilt-y", `${x * 14}deg`);
  };
  const handleLeave = () => {
    sceneRef.current?.style.setProperty("--tilt-x", "0deg");
    sceneRef.current?.style.setProperty("--tilt-y", "0deg");
  };

  const step = 360 / Math.max(cards.length, 1);

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="hero-stage relative hidden h-full min-h-[560px] w-full flex-1 overflow-hidden bg-[#161616] lg:flex"
    >
      <div
        ref={sceneRef}
        className="hero-scene absolute inset-0 flex items-center justify-center"
      >
        <div className="hero-ring absolute">
          {cards.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              aria-label={`Open ${p.name}`}
              className="hero-card absolute"
              style={{
                "--angle": `${i * step}deg`,
                "--offset": `${OFFSETS[i % OFFSETS.length]}cqw`,
                "--tilt": `${(i % 2 ? 1 : -1) * (2 + (i % 3))}deg`,
              }}
            >
              <CardFace player={p} tint={TINTS[i % TINTS.length]} />
              <CardFace player={p} tint={TINTS[i % TINTS.length]} back />
            </button>
          ))}
        </div>

        <h2 className="hero-title pointer-events-none select-none text-center font-black uppercase leading-[0.86] tracking-tighter text-white">
          Building
          <br />
          The <span className="text-lime">Next</span>
          <br />
          Generation
        </h2>
      </div>

      {/* Edge vignette for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.75)_100%)]" />

      <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-xs font-medium tracking-wide text-neutral-400">
        Select a player from the list — or tap a card
      </p>
    </div>
  );
}

// Latest dated assessment, with the average of its five scores (0 if unscored).
function latestAssessment(player) {
  const latest = (player.assessmentHistory || [])
    .filter((a) => !Number.isNaN(Date.parse(a.date)))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0];
  if (!latest) return null;
  const scores = ASSESSMENT_FIELDS.map(({ key }) => Number(latest[key]) || 0).filter((n) => n > 0);
  const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const comment = latest.coachComment?.trim();
  return {
    average,
    date: latest.date,
    coach: latest.coach || player.coach || "",
    comment: comment && comment !== "..." ? comment : "",
  };
}

// No overflow-hidden here: clipping a rounded, 3D-transformed layer needs a
// mask that the GPU redraws every frame. Children round their own corners.
function CardFace({ player, tint, back = false }) {
  const assessment = latestAssessment(player);

  return (
    <span className={`hero-face ${back ? "hero-face-back" : ""} block h-full w-full rounded-lg bg-neutral-900 shadow-lg ring-1 ring-white/10`}>
      {player.image ? (
        <img src={player.image} alt="" className="h-full w-full rounded-lg object-cover" draggable={false} />
      ) : (
        <span className={`flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br pb-[28%] ${tint}`}>
          <span className="text-[5cqw] font-black tracking-tighter text-white/90">{initials(player.name)}</span>
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 rounded-b-lg bg-gradient-to-t from-black/90 via-black/70 to-transparent px-[0.9cqw] pb-[0.8cqw] pt-[3cqw] text-left">
        <span className="block truncate text-[0.95cqw] font-medium text-white">{player.name}</span>
        <span className="mt-[0.35cqw] flex items-center gap-[0.5cqw]">
          {player.level && (
            <span className="rounded-full bg-lime px-[0.45cqw] py-px text-[0.7cqw] font-bold text-ink">
              {player.level}
            </span>
          )}
          {assessment?.average > 0 && (
            <span className="flex items-center gap-[0.3cqw]" aria-label={`Average ${assessment.average.toFixed(1)} of 5`}>
              <span className="text-[0.75cqw] leading-none tracking-[0.05em]">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < Math.round(assessment.average) ? "text-lime" : "text-white/20"}>
                    ★
                  </span>
                ))}
              </span>
              <span className="text-[0.7cqw] font-semibold tabular-nums text-white/80">
                {assessment.average.toFixed(1)}
              </span>
            </span>
          )}
        </span>
        {assessment && (
          <span className="mt-[0.35cqw] block truncate text-[0.6cqw] text-white/45">
            {[assessment.date, assessment.coach && `Coach ${assessment.coach}`].filter(Boolean).join(" · ")}
          </span>
        )}
        {assessment?.comment && (
          <span className="mt-[0.45cqw] line-clamp-2 border-l-2 border-lime/60 pl-[0.5cqw] text-[0.65cqw] italic leading-snug text-white/65">
            {assessment.comment}
          </span>
        )}
      </span>
    </span>
  );
}
