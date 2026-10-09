import { useMemo, useRef } from "react";

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

// Players with photos first, then a random pick of the rest.
function pickPlayers(players) {
  const withImage = players.filter((p) => p.image);
  const rest = players.filter((p) => !p.image).sort(() => Math.random() - 0.5);
  return [...withImage, ...rest].slice(0, CARD_COUNT);
}

export default function PlayerHero({ players, onSelect }) {
  const sceneRef = useRef(null);
  // Re-pick only when the roster size changes, not on every player edit.
  const cards = useMemo(() => pickPlayers(players), [players.length]);

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

function CardFace({ player, tint, back = false }) {
  return (
    <span className={`hero-face ${back ? "hero-face-back" : ""} block h-full w-full overflow-hidden rounded-lg bg-neutral-900 shadow-2xl ring-1 ring-white/10`}>
      {player.image ? (
        <img src={player.image} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${tint}`}>
          <span className="text-[5cqw] font-black tracking-tighter text-white/90">{initials(player.name)}</span>
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2.5 pt-8 text-left">
        <span className="block truncate text-[0.95cqw] font-medium text-white">{player.name}</span>
        {player.level && (
          <span className="mt-1 inline-block rounded-full bg-lime px-1.5 py-px text-[0.7cqw] font-bold text-ink">
            {player.level}
          </span>
        )}
      </span>
    </span>
  );
}
