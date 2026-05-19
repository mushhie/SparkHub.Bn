import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, TopBar } from "@/components/app-shell";
import { LEADERBOARD } from "@/lib/mock-data";
import { NICHES, type Niche } from "@/lib/store";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
  head: () => ({
    meta: [
      { title: "Leaderboard — SparkHub" },
      { name: "description", content: "Top achievers across SparkHub niches." },
    ],
  }),
});

function LeaderboardPage() {
  const [filter, setFilter] = useState<"all" | Niche>("all");
  const data = LEADERBOARD[filter];

  const podium = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <AppShell>
      <TopBar title="Leaderboard" showAlerts={false} />

      <div className="px-5 pt-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            🏆 All
          </Chip>
          {(Object.keys(NICHES) as Niche[]).map((k) => (
            <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>
              {NICHES[k].emoji} {NICHES[k].label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Podium */}
      <section className="px-5 pt-6">
        <div className="grid grid-cols-3 gap-2 items-end">
          {/* 2nd */}
          {podium[1] && <PodiumCard entry={podium[1]} height="h-24" />}
          {/* 1st */}
          {podium[0] && <PodiumCard entry={podium[0]} height="h-32" highlight />}
          {/* 3rd */}
          {podium[2] && <PodiumCard entry={podium[2]} height="h-20" />}
        </div>
      </section>

      {/* Rest of list */}
      <section className="px-5 pt-6 space-y-2">
        {rest.map((u) => (
          <div
            key={u.rank}
            className="bg-paper border border-sand-dark rounded-2xl p-3 flex items-center gap-3"
          >
            <span className="font-display text-base font-bold text-ink-muted w-6 text-center">
              {u.rank}
            </span>
            <img src={u.avatar} className="size-10 rounded-full object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{u.name}</p>
              <p className="text-[11px] text-ink-muted">{NICHES[u.niche].label}</p>
            </div>
            <p className="text-sm font-bold text-honey flex items-center gap-1">
              <Trophy className="size-3" /> {u.points}
            </p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
        active
          ? "bg-clay text-paper"
          : "bg-paper border border-sand-dark text-ink-muted"
      }`}
    >
      {children}
    </button>
  );
}

function PodiumCard({
  entry,
  height,
  highlight,
}: {
  entry: { rank: number; name: string; points: number; avatar: string };
  height: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={entry.avatar}
        className={`rounded-full object-cover mb-2 ring-2 ${
          highlight
            ? "size-16 ring-honey"
            : entry.rank === 2
              ? "size-14 ring-sand-dark"
              : "size-12 ring-clay-soft"
        }`}
        alt=""
      />
      <p className="text-[11px] font-semibold text-ink text-center truncate w-full px-1">
        {entry.name.split(" ")[0]}
      </p>
      <p className="text-[10px] text-honey font-bold mb-2">
        {entry.points} pts
      </p>
      <div
        className={`${height} w-full rounded-t-2xl grid place-items-center font-display text-2xl font-bold ${
          highlight
            ? "bg-honey text-ink"
            : entry.rank === 2
              ? "bg-sand-dark text-ink"
              : "bg-clay-soft text-clay"
        }`}
      >
        #{entry.rank}
      </div>
    </div>
  );
}
