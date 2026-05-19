import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AppShell, TopBar } from "@/components/app-shell";
import { NichePill } from "@/components/niche-pill";
import { TALENTS, ORGS, JOBS } from "@/lib/mock-data";
import { NICHES, type Niche } from "@/lib/store";
import { Search, Star, BadgeCheck, Clock, MapPin, Zap } from "lucide-react";

const searchSchema = z.object({
  niche: z.enum(["tech", "creative", "fnb"]).optional(),
  tab: z.enum(["all", "jobs", "talent", "business", "urgent"]).optional(),
});

export const Route = createFileRoute("/discover")({
  component: DiscoverPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Discover — SparkHub" },
      {
        name: "description",
        content: "Browse local jobs, talents and businesses across Brunei.",
      },
    ],
  }),
});

const TABS = [
  { id: "all", label: "All" },
  { id: "jobs", label: "Jobs" },
  { id: "talent", label: "Talent" },
  { id: "business", label: "Business" },
  { id: "urgent", label: "⚡ Urgent" },
] as const;

function DiscoverPage() {
  const { tab = "all", niche } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [activeNiche, setActiveNiche] = useState<Niche | undefined>(niche);

  const filterNiche = <T extends { niche: Niche }>(items: T[]) =>
    activeNiche ? items.filter((i) => i.niche === activeNiche) : items;
  const filterQuery = <T,>(items: T[]) =>
    !query
      ? items
      : items.filter((i) =>
          JSON.stringify(i).toLowerCase().includes(query.toLowerCase()),
        );

  const showJobs = tab === "all" || tab === "jobs" || tab === "urgent";
  const showTalents = tab === "all" || tab === "talent";
  const showOrgs = tab === "all" || tab === "business";

  const jobs = filterQuery(
    filterNiche(tab === "urgent" ? JOBS.filter((j) => j.urgent) : JOBS),
  );
  const talents = filterQuery(filterNiche(TALENTS));
  const orgs = filterQuery(filterNiche(ORGS));

  return (
    <AppShell>
      <TopBar title="Discover" />
      <div className="px-5 pt-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, names, areas…"
            className="w-full bg-paper border border-sand-dark rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:border-clay"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-sand p-1 rounded-full overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <Link
              key={t.id}
              to="/discover"
              search={{ tab: t.id, niche: activeNiche }}
              className={`shrink-0 px-3 text-center py-2 rounded-full text-xs font-semibold ${
                tab === t.id
                  ? t.id === "urgent"
                    ? "bg-clay text-paper shadow-sm"
                    : "bg-paper text-ink shadow-sm"
                  : "text-ink-muted"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Niche chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveNiche(undefined)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
              !activeNiche ? "bg-ink text-paper" : "bg-paper border border-sand-dark text-ink-muted"
            }`}
          >
            All niches
          </button>
          {(Object.keys(NICHES) as Niche[]).map((k) => (
            <button
              key={k}
              onClick={() => setActiveNiche(k === activeNiche ? undefined : k)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                activeNiche === k
                  ? "bg-clay text-paper"
                  : "bg-paper border border-sand-dark text-ink-muted"
              }`}
            >
              <span>{NICHES[k].emoji}</span>
              <span>{NICHES[k].label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8 mt-6">
        {showJobs && jobs.length > 0 && (
          <section>
            <h2 className="font-display text-lg px-5 mb-3">
              {tab === "urgent" ? "Urgent jobs" : "Jobs"}
            </h2>
            <div className="px-5 space-y-3">
              {jobs.map((j) => (
                <Link
                  key={j.id}
                  to="/apply/$id"
                  params={{ id: j.id }}
                  className="block bg-paper border border-sand-dark rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-ink leading-snug">{j.title}</h3>
                    {j.urgent && (
                      <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-clay text-paper flex items-center gap-1">
                        <Zap className="size-2.5" /> Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted mb-2">{j.company}</p>
                  <div className="flex items-center gap-3 text-[11px] text-ink-muted">
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
            </div>
          </section>
        )}

        {showTalents && talents.length > 0 && (
          <section>
            <h2 className="font-display text-lg px-5 mb-3">Talent</h2>
            <div className="grid grid-cols-2 gap-3 px-5">
              {talents.map((t) => (
                <Link
                  key={t.id}
                  to="/profile/$id"
                  params={{ id: t.id }}
                  className="bg-paper rounded-2xl p-3 border border-sand-dark/40 hover:border-clay/50"
                >
                  <div className="aspect-square rounded-xl bg-sand overflow-hidden mb-3 relative">
                    <img src={t.avatar} alt="" loading="lazy" className="w-full h-full object-cover" />
                    {t.verified && (
                      <BadgeCheck className="absolute top-2 right-2 size-5 text-paper bg-clay rounded-full p-0.5" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-ink truncate">{t.name}</h3>
                  <p className="text-[11px] text-ink-muted truncate">{t.skill}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-ink">
                      <Star className="size-3 fill-honey text-honey" />
                      {t.rating}
                    </span>
                    <span className="text-ink-muted">{t.area}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {showOrgs && orgs.length > 0 && (
          <section>
            <h2 className="font-display text-lg px-5 mb-3">Businesses & hubs</h2>
            <div className="px-5 space-y-3">
              {orgs.map((o) => (
                <Link
                  key={o.id}
                  to="/profile/$id"
                  params={{ id: o.id }}
                  className="bg-paper border border-sand-dark rounded-2xl p-4 flex items-center gap-3"
                >
                  <img src={o.avatar} className="size-14 rounded-full object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-ink">{o.name}</h3>
                      {o.trusted && <BadgeCheck className="size-4 text-clay" />}
                    </div>
                    <p className="text-xs text-ink-muted truncate">{o.description}</p>
                    <p className="text-[10px] text-ink-muted mt-0.5">
                      {o.area} · ⭐ {o.rating}
                    </p>
                  </div>
                  <NichePill niche={o.niche} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {!jobs.length && !talents.length && !orgs.length && (
          <div className="px-5 py-12 text-center">
            <p className="text-ink-muted text-sm">No results — try clearing filters.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
