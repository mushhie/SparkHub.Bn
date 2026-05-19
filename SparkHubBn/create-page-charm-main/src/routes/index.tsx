import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, TopBar } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { NichePill } from "@/components/niche-pill";
import { useUser, useHydrate } from "@/lib/store";
import { JOBS, ORGS, FEED, LEADERBOARD } from "@/lib/mock-data";
import {
  ArrowRight,
  Clock,
  MapPin,
  Search,
  Zap,
  Briefcase,
  UserCircle2,
  Trophy,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "SparkHub — Home" },
      {
        name: "description",
        content: "Discover urgent local gigs, trusted talents and community hubs near you.",
      },
    ],
  }),
});

function HomePage() {
  useHydrate();
  const user = useUser();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Redirect to login if not signed in (after hydration)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(() => {
      if (!useUserSnapshot()) navigate({ to: "/login" });
    }, 50);
    return () => clearTimeout(t);
  }, [navigate]);

  if (!user) {
    return (
      <AppShell bare>
        <div className="min-h-dvh grid place-items-center px-6 text-center">
          <div>
            <p className="font-display text-3xl text-ink">
              Spark<span className="text-clay">Hub</span>
            </p>
            <p className="text-ink-muted text-sm mt-2">Loading your neighborhood…</p>
            <Link
              to="/login"
              className="inline-block mt-6 px-6 py-2.5 rounded-full bg-clay text-paper text-sm font-semibold"
            >
              Get started
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const filteredJobs = JOBS.filter(
    (j) => !query || `${j.title} ${j.company}`.toLowerCase().includes(query.toLowerCase()),
  );
  const urgent = JOBS.filter((j) => j.urgent);
  const topAchievers = LEADERBOARD.all.slice(0, 3);

  return (
    <AppShell>
      <TopBar subtitle={`Hello, ${user.name.split(" ")[0]}`} />

      <div className="space-y-8">
        {/* Search */}
        <section className="px-5 pt-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, talent, or businesses…"
              className="w-full bg-paper border border-sand-dark rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:border-clay"
            />
          </div>
        </section>

        {/* Urgent banner */}
        <section className="px-5">
          <Link
            to="/discover"
            search={{ tab: "urgent" }}
            className="bg-clay text-paper rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 size-32 bg-honey/30 rounded-full blur-2xl pointer-events-none" />
            <div className="size-11 rounded-full bg-honey text-ink grid place-items-center shrink-0 relative">
              <Zap className="size-5" strokeWidth={2.4} />
            </div>
            <div className="flex-1 relative">
              <p className="font-display text-sm font-semibold leading-tight">
                URGENT: {urgent.length} openings need talent!
              </p>
              <p className="text-[11px] opacity-90 mt-0.5 truncate">
                {urgent.map((u) => u.title).slice(0, 2).join(" · ")}
              </p>
            </div>
            <span className="relative text-xs font-bold flex items-center gap-1">
              View <ArrowRight className="size-3" />
            </span>
          </Link>
        </section>

        {/* Quick actions */}
        <section className="px-5 grid grid-cols-2 gap-3">
          <Link
            to="/post"
            className="bg-paper border border-sand-dark rounded-2xl p-4 flex items-center gap-3 hover:border-clay/50"
          >
            <div className="size-10 rounded-full bg-clay-soft text-clay grid place-items-center">
              <Briefcase className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Post a Job</p>
              <p className="text-[10px] text-ink-muted">Find local talent</p>
            </div>
          </Link>
          <Link
            to="/profile"
            className="bg-paper border border-sand-dark rounded-2xl p-4 flex items-center gap-3 hover:border-clay/50"
          >
            <div className="size-10 rounded-full bg-sage-soft text-sage grid place-items-center">
              <UserCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">My Profile</p>
              <p className="text-[10px] text-ink-muted">Stats & badges</p>
            </div>
          </Link>
        </section>

        {/* Niche browse moved to Discover */}

        {/* Featured jobs */}
        <section>
          <SectionHeader
            caption="Notice board"
            title="Featured opportunities"
            to="/discover"
          />
          <div className="px-5 space-y-3">
            {filteredJobs.slice(0, 3).map((j) => (
              <Link
                key={j.id}
                to="/apply/$id"
                params={{ id: j.id }}
                className="block bg-paper border border-sand-dark rounded-2xl p-4 hover:border-clay/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-base text-ink leading-tight">
                      {j.title}
                    </h3>
                    <p className="text-xs text-ink-muted mt-0.5">{j.company}</p>
                  </div>
                  {j.urgent && (
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-clay text-paper flex items-center gap-1">
                      <Zap className="size-2.5" /> Urgent
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-muted">
                  <span className="font-semibold text-sage">💰 {j.budget}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {j.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {j.area}
                  </span>
                  <NichePill niche={j.niche} />
                </div>
              </Link>
            ))}
            {filteredJobs.length === 0 && (
              <p className="text-sm text-ink-muted text-center py-6">
                No jobs match your filters.
              </p>
            )}
          </div>
        </section>

        {/* Top organisations */}
        <section>
          <SectionHeader title="Top organisations" caption="Community pillars" to="/discover" />
          <div className="flex gap-5 overflow-x-auto no-scrollbar px-5 pb-2">
            {ORGS.map((o) => (
              <Link
                key={o.id}
                to="/profile/$id"
                params={{ id: o.id }}
                className="flex flex-col items-center gap-2 shrink-0 w-20"
              >
                <div className="relative size-16 rounded-full bg-sand-dark/30 p-1">
                  <img
                    src={o.avatar}
                    alt={o.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full"
                  />
                  {o.trusted && (
                    <BadgeCheck className="absolute -bottom-0.5 -right-0.5 size-5 text-clay bg-paper rounded-full p-0.5" />
                  )}
                </div>
                <span className="text-[11px] font-medium text-ink text-center leading-tight">
                  {o.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Top achievers (leaderboard preview) */}
        <section>
          <SectionHeader
            title="Top achievers"
            caption="Leaderboard"
            to="/leaderboard"
          />
          <div className="px-5 grid grid-cols-3 gap-2">
            {topAchievers.map((u) => (
              <div
                key={u.rank}
                className="bg-paper border border-sand-dark rounded-2xl p-3 text-center"
              >
                <div className="relative inline-block">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="size-12 rounded-full object-cover mx-auto"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 size-6 rounded-full grid place-items-center text-[10px] font-bold ring-2 ring-paper ${
                      u.rank === 1
                        ? "bg-honey text-ink"
                        : u.rank === 2
                          ? "bg-sand-dark text-ink"
                          : "bg-clay-soft text-clay"
                    }`}
                  >
                    {u.rank}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-ink mt-2 truncate">
                  {u.name.split(" ")[0]}
                </p>
                <p className="text-[10px] text-honey font-bold flex items-center justify-center gap-1">
                  <Trophy className="size-2.5" />
                  {u.points}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Community buzz */}
        <section>
          <SectionHeader title="Community buzz" caption="From the feed" to="/community" />
          <div className="px-5 space-y-3">
            {FEED.slice(0, 2).map((post) => (
              <Link
                key={post.id}
                to="/community"
                className="block bg-paper rounded-2xl p-4 border border-sand-dark/40"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={post.avatar} className="size-10 rounded-full object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{post.author}</p>
                    <p className="text-[11px] text-ink-muted">{post.ago} ago</p>
                  </div>
                  <NichePill niche={post.niche} />
                </div>
                <p className="text-sm text-ink leading-relaxed">{post.body}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-muted">
                  <span>♥ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span className="ml-auto text-clay font-medium flex items-center gap-1">
                    Open <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

// NicheChip removed — browse moved to Discover


function useUserSnapshot() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("sparkhub:user:v1");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
