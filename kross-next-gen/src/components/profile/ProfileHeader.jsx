import { ArrowLeft, Pencil, User, Calendar } from "lucide-react";
import Avatar from "../Avatar";
import Badge from "../ui/Badge";

export default function ProfileHeader({ player, onBack, onEdit }) {
  return (
    <div className="border-b border-neutral-200 px-5 pt-5 pb-6 sm:px-7">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm
                     text-neutral-700 transition hover:bg-neutral-100"
        >
          <ArrowLeft size={18} />
          Back to players
        </button>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2
                     text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          <Pencil size={14} />
          Edit
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Avatar name={player.name} src={player.image} size="lg" />

        <div className="min-w-0">
          <h1 className="truncate text-3xl font-bold tracking-tight">{player.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="lime">{player.level}</Badge>
            <Badge>{player.class}</Badge>
          </div>

          <div className="mt-3 flex flex-col gap-1.5 text-sm text-neutral-600">
            <span className="flex items-center gap-2">
              <User size={15} className="text-neutral-400" />
              Coach: {player.coach}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={15} className="text-neutral-400" />
              Member since: {player.memberSince}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
