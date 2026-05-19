import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { NichePill } from "@/components/niche-pill";
import { TALENTS, ORGS } from "@/lib/mock-data";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Star,
  MessageCircle,
  Award,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/profile/$id")({
  component: PublicProfilePage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — LightHub profile` },
      { name: "description", content: "Local profile on LightHub." },
    ],
  }),
});

function PublicProfilePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const talent = TALENTS.find((t) => t.id === id);
  const org = ORGS.find((o) => o.id === id);

  if (!talent && !org) {
    return (
      <AppShell bare>
        <div className="min-h-dvh grid place-items-center px-6 text-center">
          <div>
            <p className="font-display text-xl text-ink mb-2">Profile not found</p>
            <Link to="/discover" className="text-clay text-sm font-semibold">
              Back to Discover →
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (talent) return <TalentProfile t={talent} onBack={() => navigate({ to: "/discover" })} />;
  return <OrgProfile o={org!} onBack={() => navigate({ to: "/discover" })} />;
}

function TalentProfile({
  t,
  onBack,
}: {
  t: (typeof TALENTS)[number];
  onBack: () => void;
}) {
  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md px-3 py-3 flex items-center gap-2 border-b border-sand-dark/40">
        <button onClick={onBack} className="size-9 grid place-items-center rounded-full hover:bg-sand">
          <ArrowLeft className="size-4" />
        </button>
        <p className="font-display text-base font-semibold">Talent profile</p>
      </header>

      <div className="px-5 pt-6">
        <div className="aspect-square rounded-3xl overflow-hidden bg-sand">
          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-ink">{t.name}</h1>
            {t.verified && <BadgeCheck className="size-5 text-clay" />}
          </div>
          <p className="text-sm text-ink-muted">{t.skill}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-ink-muted">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{t.area}</span>
            <span className="flex items-center gap-1"><Star className="size-3 fill-honey text-honey" />{t.rating} ({t.gigs} gigs)</span>
            <NichePill niche={t.niche} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5 bg-paper border border-sand-dark rounded-2xl p-3">
          <Stat label="Rate" value={t.rate} />
          <Stat label="Gigs" value={t.gigs} />
          <Stat label="Available" value={t.available} small />
        </div>

        <p className="mt-5 text-sm text-ink leading-relaxed">{t.bio}</p>

        <div className="mt-5 flex items-center gap-2">
          <Award className="size-4 text-honey" />
          <span className="text-xs font-semibold text-ink">Talent Badges</span>
          <div className="flex gap-1.5 ml-1">
            <span className="size-7 rounded-full bg-honey grid place-items-center text-[10px] font-bold">★</span>
            <span className="size-7 rounded-full bg-clay text-paper grid place-items-center text-[10px] font-bold">✓</span>
            <span className="size-7 rounded-full bg-sage text-paper grid place-items-center text-[10px] font-bold">B</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Link
            to="/chats"
            className="bg-sand text-ink py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle className="size-4" />
            Message
          </Link>
          <Link
            to="/apply/$id"
            params={{ id: t.id }}
            className="bg-clay text-paper py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Calendar className="size-4" />
            Hire / Book
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function OrgProfile({
  o,
  onBack,
}: {
  o: (typeof ORGS)[number];
  onBack: () => void;
}) {
  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md px-3 py-3 flex items-center gap-2 border-b border-sand-dark/40">
        <button onClick={onBack} className="size-9 grid place-items-center rounded-full hover:bg-sand">
          <ArrowLeft className="size-4" />
        </button>
        <p className="font-display text-base font-semibold">Business profile</p>
      </header>

      <div className="px-5 pt-6">
        <div className="bg-ink rounded-3xl p-6 text-paper relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-44 bg-clay/30 rounded-full blur-2xl" />
          <img src={o.avatar} className="size-20 rounded-full object-cover ring-4 ring-paper/20 relative" alt="" />
          <div className="mt-4 relative">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-semibold">{o.name}</h1>
              {o.trusted && <BadgeCheck className="size-5 text-honey" />}
            </div>
            <p className="text-sm text-paper/80 mt-1">{o.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-paper/80">
              <span className="flex items-center gap-1"><MapPin className="size-3" />{o.area}</span>
              <span>{o.members} members</span>
              <NichePill niche={o.niche} />
            </div>
          </div>
        </div>

        <p className="mt-6 text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-3">
          Open programmes
        </p>
        <div className="space-y-2">
          {[
            { t: "Saturday artisan market", w: "Looking for 3 artists" },
            { t: "Latte art workshop", w: "Looking for 1 trainer" },
          ].map((p) => (
            <div key={p.t} className="bg-paper border border-sand-dark rounded-2xl p-4">
              <p className="font-semibold text-ink">{p.t}</p>
              <p className="text-xs text-ink-muted mt-0.5">{p.w}</p>
              <Link
                to="/apply/$id"
                params={{ id: o.id }}
                className="block mt-3 w-full text-center bg-clay text-paper py-2 rounded-full text-sm font-semibold"
              >
                Apply
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            to="/chats"
            className="block w-full bg-sand text-ink py-3 rounded-full text-sm font-semibold text-center"
          >
            Message {o.name}
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div className="text-center">
      <p className={`font-display font-semibold text-ink ${small ? "text-xs" : "text-base"}`}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold">
        {label}
      </p>
    </div>
  );
}
