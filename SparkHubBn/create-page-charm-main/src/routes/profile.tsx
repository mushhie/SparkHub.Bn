import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { AppShell, TopBar } from "@/components/app-shell";
import { NichePill } from "@/components/niche-pill";
import {
  useUser,
  userStore,
  NICHES,
  type Niche,
  type PortfolioItem,
  type Achievement,
  type Application,
} from "@/lib/store";
import { useSettings, settingsStore } from "@/lib/settings";
import {
  Edit3,
  FileText,
  LogOut,
  Star,
  Wallet,
  Upload,
  ListChecks,
  Plus,
  Sun,
  Moon,
  Bell,
  Image as ImageIcon,
  Award,
  Briefcase,
  ClipboardList,
  Trash2,
  RefreshCcw,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: MyProfilePage,
  head: () => ({
    meta: [
      { title: "My profile — LightHub" },
      { name: "description", content: "Your bio, skills, CV, badges and points." },
    ],
  }),
});

function MyProfilePage() {
  const user = useUser();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [skills, setSkills] = useState<Niche[]>(user?.skills ?? []);
  const [category, setCategory] = useState<Niche | undefined>(user?.category);
  const [cv, setCv] = useState<string | undefined>(user?.cvFileName);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <AppShell bare>
        <div className="min-h-dvh grid place-items-center px-6">
          <Link to="/login" className="text-clay font-semibold">
            Sign in to see your profile →
          </Link>
        </div>
      </AppShell>
    );
  }

  const isBiz = user.role === "business";

  function save() {
    userStore.patch({ name, bio, skills: isBiz ? undefined : skills, category: isBiz ? category : undefined, cvFileName: cv });
    setEditing(false);
  }

  function logout() {
    userStore.set(null);
    navigate({ to: "/login" });
  }

  function uploadCv(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCv(f.name);
    userStore.patch({ cvFileName: f.name });
  }

  function toggleSkill(n: Niche) {
    setSkills((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  }

  return (
    <AppShell>
      <TopBar title="Profile" />

      {/* Header card */}
      <section className="px-5 pt-5">
        <div className="bg-paper border border-sand-dark rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-40 bg-clay/10 rounded-full blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="size-20 rounded-full bg-sand grid place-items-center text-3xl font-display font-bold text-clay">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-sand rounded-lg px-2 py-1 text-lg font-display font-semibold"
                />
              ) : (
                <h2 className="font-display text-xl font-semibold text-ink truncate">
                  {user.name}
                </h2>
              )}
              <p className="text-xs text-ink-muted truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] uppercase tracking-widest font-bold bg-ink text-paper px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
                {!isBiz && user.badges?.[0] && (
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-honey text-ink px-2 py-0.5 rounded-full">
                    🏅 {user.badges[0]}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => (editing ? save() : setEditing(true))}
              className="size-9 grid place-items-center rounded-full bg-clay text-paper"
              aria-label="Edit profile"
            >
              {editing ? <ListChecks className="size-4" /> : <Edit3 className="size-4" />}
            </button>
          </div>

          {!isBiz && (
            <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-sand-dark/40">
              <Stat label="Points" value={user.points} />
              <Stat label="Gigs" value={user.jobsCompleted} />
              <Stat label="Rating" value={`${user.rating || 4.8} ★`} />
            </div>
          )}
          {isBiz && (
            <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-sand-dark/40">
              <Stat label="Posted" value={6} />
              <Stat label="Workers" value={3} />
              <Stat label="Trust" value="High" />
            </div>
          )}
        </div>
      </section>

      {/* Wallet */}
      <section className="px-5 mt-4">
        <Link
          to="/wallet"
          className="bg-ink text-paper rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 size-24 bg-honey/30 rounded-full blur-2xl" />
          <div className="size-11 rounded-full bg-honey grid place-items-center text-ink shrink-0">
            <Wallet className="size-5" />
          </div>
          <div className="flex-1 relative">
            <p className="text-[10px] uppercase tracking-widest text-paper/70 font-bold">
              LightPay wallet
            </p>
            <p className="text-lg font-display font-semibold">
              B$ {user.walletBalance.toFixed(2)}
            </p>
          </div>
          <span className="text-xs font-semibold text-honey relative">Manage →</span>
        </Link>
      </section>

      {/* Bio */}
      <section className="px-5 mt-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">Bio</p>
        {editing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A few lines about yourself…"
            className="w-full bg-paper border border-sand-dark rounded-2xl p-3 text-sm outline-none focus:border-clay resize-none"
          />
        ) : (
          <p className="text-sm text-ink leading-relaxed bg-paper border border-sand-dark rounded-2xl p-3">
            {user.bio?.trim() ||
              (isBiz
                ? "Tell talents about your business, what programmes you run and what kind of help you usually look for."
                : "Tell businesses about your skills, story and what you love doing.")}
          </p>
        )}
      </section>

      {/* Skills / Category */}
      <section className="px-5 mt-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          {isBiz ? "Business category" : "Skill areas"}
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(NICHES) as Niche[]).map((k) => {
            const active = isBiz ? category === k : skills.includes(k);
            const click = () =>
              editing && (isBiz ? setCategory(k) : toggleSkill(k));
            if (!editing && !active) return null;
            return (
              <button
                key={k}
                disabled={!editing}
                onClick={click}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  active
                    ? "bg-clay text-paper"
                    : "bg-sand text-ink-muted hover:bg-clay-soft"
                }`}
              >
                <span>{NICHES[k].emoji}</span>
                <span>{NICHES[k].label}</span>
              </button>
            );
          })}
          {!editing &&
            ((isBiz ? !category : skills.length === 0) && (
              <p className="text-xs text-ink-muted italic">
                Tap edit to add {isBiz ? "a category" : "skills"}.
              </p>
            ))}
        </div>
      </section>

      {/* CV / Programmes */}
      <section className="px-5 mt-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          {isBiz ? "Programmes you run" : "CV / Experience"}
        </p>
        {!isBiz && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.doc,.docx"
              className="hidden"
              onChange={uploadCv}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full bg-paper border border-dashed border-sand-dark hover:border-clay rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="size-10 rounded-full bg-clay-soft text-clay grid place-items-center">
                {cv ? <FileText className="size-4" /> : <Upload className="size-4" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-ink">
                  {cv || "Upload your CV (PDF)"}
                </p>
                <p className="text-[11px] text-ink-muted">
                  Used as additional verification when you apply.
                </p>
              </div>
            </button>

            <div className="mt-3 bg-paper border border-sand-dark rounded-2xl p-4 space-y-3">
              <ExperienceRow title="Mural artist" org="Kopitiam 67" when="2024 – present" />
              <ExperienceRow title="Workshop facilitator" org="Seni Maker Hub" when="2023" />
              <button className="w-full text-xs font-semibold text-clay flex items-center justify-center gap-1 mt-2">
                <Plus className="size-3" /> Add experience
              </button>
            </div>
          </>
        )}
        {isBiz && (
          <div className="bg-paper border border-sand-dark rounded-2xl p-4 space-y-3">
            <ExperienceRow title="Weekend artisan market" org="Recurring Sat 9–2" when="Looking for: artists" />
            <ExperienceRow title="Latte art workshop" org="Monthly" when="Looking for: trainers" />
            <button className="w-full text-xs font-semibold text-clay flex items-center justify-center gap-1 mt-2">
              <Plus className="size-3" /> Add programme
            </button>
          </div>
        )}
      </section>

      {/* Portfolio — talent only */}
      {!isBiz && <PortfolioSection items={user.portfolio ?? []} />}

      {/* Achievements */}
      <AchievementsSection items={seedAchievements(user.achievements)} />

      {/* Applications / Job posts */}
      {!isBiz ? (
        <ApplicationsSection items={seedApplications(user.applications)} />
      ) : (
        <BizJobsSection />
      )}

      {/* Settings */}
      <SettingsPanel onLogout={logout} />


      {/* unused */}
      <Star className="hidden" />
      <Link to="/alerts" className="hidden" />
    </AppShell>
  );
}

function SettingsPanel({ onLogout }: { onLogout: () => void }) {
  const settings = useSettings();
  const isDark = settings.theme === "dark";
  return (
    <section className="px-5 mt-6 mb-4">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">Settings</p>
      <div className="bg-paper border border-sand-dark rounded-2xl overflow-hidden">
        <button
          onClick={() => settingsStore.toggleTheme()}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sand/40 border-b border-sand-dark/40"
        >
          <div className="size-9 rounded-full bg-sand grid place-items-center text-ink">
            {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </div>
          <span className="flex-1 text-left text-sm font-medium text-ink">
            {isDark ? "Dark mode" : "Light mode"}
          </span>
          <span
            className={`relative w-10 h-5 rounded-full transition-colors ${isDark ? "bg-clay" : "bg-sand-dark"}`}
          >
            <span
              className={`absolute top-0.5 size-4 bg-paper rounded-full transition-transform ${isDark ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </span>
        </button>
        <button
          onClick={() => settingsStore.setNotifications(!settings.notifications)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sand/40 border-b border-sand-dark/40"
        >
          <div className="size-9 rounded-full bg-sand grid place-items-center text-ink">
            <Bell className="size-4" />
          </div>
          <span className="flex-1 text-left text-sm font-medium text-ink">Notifications</span>
          <span
            className={`relative w-10 h-5 rounded-full transition-colors ${settings.notifications ? "bg-clay" : "bg-sand-dark"}`}
          >
            <span
              className={`absolute top-0.5 size-4 bg-paper rounded-full transition-transform ${settings.notifications ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose/10 text-rose"
        >
          <div className="size-9 rounded-full bg-rose/15 grid place-items-center">
            <LogOut className="size-4" />
          </div>
          <span className="flex-1 text-left text-sm font-semibold">Sign out</span>
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="font-display text-base font-semibold text-ink">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold">
        {label}
      </p>
    </div>
  );
}

function ExperienceRow({ title, org, when }: { title: string; org: string; when: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-2 rounded-full bg-clay mt-1.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-[11px] text-ink-muted">{org} · {when}</p>
      </div>
    </div>
  );
}

// suppress unused
void NichePill;
void ImageIcon;

// ─────────────── Portfolio ───────────────

function PortfolioSection({ items }: { items: PortfolioItem[] }) {
  const [list, setList] = useState<PortfolioItem[]>(
    items.length
      ? items
      : [
          {
            id: "p1",
            title: "Cafe rebrand",
            description: "Logo + menu redesign for Kopitiam 67.",
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
          },
          {
            id: "p2",
            title: "Event poster",
            description: "Maker market launch series.",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=400",
          },
        ],
  );
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "" });

  function add() {
    if (!draft.title.trim() || list.length >= 10) return;
    const next: PortfolioItem[] = [
      ...list,
      { id: `p${Date.now()}`, title: draft.title, description: draft.description },
    ];
    setList(next);
    userStore.patch({ portfolio: next });
    setDraft({ title: "", description: "" });
    setAdding(false);
  }
  function remove(id: string) {
    const next = list.filter((p) => p.id !== id);
    setList(next);
    userStore.patch({ portfolio: next });
  }

  return (
    <section className="px-5 mt-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage">
          Portfolio ({list.length}/10)
        </p>
        {list.length < 10 && (
          <button
            onClick={() => setAdding((v) => !v)}
            className="text-xs font-semibold text-clay flex items-center gap-1"
          >
            <Plus className="size-3" /> Add
          </button>
        )}
      </div>
      {adding && (
        <div className="bg-paper border border-sand-dark rounded-2xl p-3 mb-3 space-y-2">
          <input
            placeholder="Project title"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            className="w-full bg-sand/60 border border-sand-dark rounded-lg px-3 py-2 text-sm outline-none focus:border-clay"
          />
          <textarea
            placeholder="Description"
            rows={2}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            className="w-full bg-sand/60 border border-sand-dark rounded-lg px-3 py-2 text-sm outline-none focus:border-clay resize-none"
          />
          <button
            onClick={add}
            className="w-full bg-clay text-paper text-xs font-semibold py-2 rounded-full"
          >
            Save piece
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {list.map((p) => (
          <div
            key={p.id}
            className="bg-paper border border-sand-dark rounded-2xl overflow-hidden relative group"
          >
            {p.image ? (
              <img src={p.image} alt={p.title} className="w-full h-24 object-cover" />
            ) : (
              <div className="w-full h-24 bg-clay-soft grid place-items-center">
                <ImageIcon className="size-6 text-clay" />
              </div>
            )}
            <div className="p-2">
              <p className="text-xs font-semibold text-ink truncate">{p.title}</p>
              <p className="text-[10px] text-ink-muted line-clamp-2">{p.description}</p>
            </div>
            <button
              onClick={() => remove(p.id)}
              className="absolute top-1.5 right-1.5 size-6 grid place-items-center rounded-full bg-paper/90 text-rose opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────── Achievements ───────────────

function seedAchievements(existing?: Achievement[]): Achievement[] {
  if (existing && existing.length) return existing;
  return [
    {
      id: "a1",
      tier: "bronze",
      title: "Cafe rebrand sprint",
      issuer: "Kopitiam 67",
      durationDays: 14,
      date: "2025-09-12",
      comment: "Delivered on time, friendly to work with.",
    },
    {
      id: "a2",
      tier: "silver",
      title: "Seasonal campaign",
      issuer: "Nusantara Threads",
      durationDays: 35,
      date: "2025-07-04",
    },
  ];
}

function AchievementsSection({ items }: { items: Achievement[] }) {
  const tierStyle = {
    bronze: "bg-clay-soft text-clay",
    silver: "bg-sand-dark/50 text-ink",
    gold: "bg-honey text-ink",
  } as const;
  return (
    <section className="px-5 mt-6">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
        SparkHub Verified Achievements
      </p>
      <div className="bg-paper border border-sand-dark rounded-2xl divide-y divide-sand-dark/40">
        {items.map((a) => (
          <div key={a.id} className="p-3 flex items-start gap-3">
            <div className={`size-10 rounded-full grid place-items-center ${tierStyle[a.tier]}`}>
              <Award className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ink truncate">{a.title}</p>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${tierStyle[a.tier]}`}
                >
                  {a.tier}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                {a.issuer} · {a.durationDays} days · {a.date}
              </p>
              {a.comment && (
                <p className="text-[11px] text-ink mt-1 italic">"{a.comment}"</p>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-ink-muted italic p-4 text-center">
            Complete a gig to earn your first achievement.
          </p>
        )}
      </div>
    </section>
  );
}

// ─────────────── Applications (talent) ───────────────

function seedApplications(existing?: Application[]): Application[] {
  if (existing && existing.length) return existing;
  return [
    {
      id: "ap1",
      jobId: "j1",
      jobTitle: "Graphic Designer",
      company: "Rasa Bistro",
      status: "shortlisted",
      appliedAt: "2 days ago",
    },
    {
      id: "ap2",
      jobId: "j3",
      jobTitle: "Frontend Developer",
      company: "PixelCraft Studio",
      status: "pending",
      appliedAt: "5 days ago",
    },
  ];
}

function ApplicationsSection({ items }: { items: Application[] }) {
  const statusStyle: Record<Application["status"], string> = {
    pending: "bg-sand text-ink-muted",
    shortlisted: "bg-honey/40 text-ink",
    accepted: "bg-sage-soft text-sage",
    rejected: "bg-rose/20 text-rose",
  };
  return (
    <section className="px-5 mt-6">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
        My Applications
      </p>
      <div className="bg-paper border border-sand-dark rounded-2xl divide-y divide-sand-dark/40">
        {items.map((a) => (
          <Link
            to="/apply/$id"
            params={{ id: a.jobId }}
            key={a.id}
            className="p-3 flex items-center gap-3 hover:bg-sand/30"
          >
            <div className="size-9 rounded-full bg-clay-soft text-clay grid place-items-center">
              <ClipboardList className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{a.jobTitle}</p>
              <p className="text-[11px] text-ink-muted">
                {a.company} · {a.appliedAt}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${statusStyle[a.status]}`}
            >
              {a.status}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─────────────── Business Job Posts & Past Hires ───────────────

function BizJobsSection() {
  const posts = [
    { id: "j1", title: "Graphic Designer", applications: 8, status: "open" },
    { id: "j2", title: "Pastry Chef (PT)", applications: 5, status: "open" },
  ];
  const hires = [
    { id: "h1", name: "Afiqah Rahman", role: "Logo redesign", rating: 4.9 },
    { id: "h2", name: "Hafiz Rosli", role: "Booking system", rating: 4.8 },
  ];
  return (
    <>
      <section className="px-5 mt-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          My Job Posts
        </p>
        <div className="bg-paper border border-sand-dark rounded-2xl divide-y divide-sand-dark/40">
          {posts.map((p) => (
            <div key={p.id} className="p-3 flex items-center gap-3">
              <div className="size-9 rounded-full bg-clay-soft text-clay grid place-items-center">
                <Briefcase className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{p.title}</p>
                <p className="text-[11px] text-ink-muted">
                  {p.applications} applications · {p.status}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-sage-soft text-sage">
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 mt-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          Past Hires
        </p>
        <div className="bg-paper border border-sand-dark rounded-2xl divide-y divide-sand-dark/40">
          {hires.map((h) => (
            <div key={h.id} className="p-3 flex items-center gap-3">
              <div className="size-9 rounded-full bg-sand grid place-items-center text-ink font-bold">
                {h.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{h.name}</p>
                <p className="text-[11px] text-ink-muted">
                  {h.role} · ★ {h.rating}
                </p>
              </div>
              <button className="text-[11px] font-semibold text-clay flex items-center gap-1 hover:underline">
                <RefreshCcw className="size-3" /> Rehire
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
