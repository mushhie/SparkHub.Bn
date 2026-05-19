import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, TopBar } from "@/components/app-shell";
import { useUser } from "@/lib/store";
import { TALENTS } from "@/lib/mock-data";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Award,
  Heart,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/alerts")({
  component: AlertsPage,
  head: () => ({
    meta: [
      { title: "Alerts — LightHub" },
      { name: "description", content: "Notifications, applications and worker management." },
    ],
  }),
});

interface Application {
  id: string;
  company: string;
  role: string;
  status: "pending" | "accepted" | "denied";
  ago: string;
}

interface Applicant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  ago: string;
  cv: string;
}

const SEEKER_APPS: Application[] = [
  { id: "a1", company: "Kopitiam 67", role: "Mural artist (weekend)", status: "pending", ago: "2d" },
  { id: "a2", company: "Zen Studio", role: "Sub yoga instructor", status: "accepted", ago: "1w" },
  { id: "a3", company: "Rumah Bersih", role: "Weekend cleaner", status: "denied", ago: "2w" },
];

const APPLICANTS: Applicant[] = [
  { id: "ap1", name: "Sarah Yunos", role: "Sub yoga instructor", avatar: TALENTS[1].avatar, ago: "3h", cv: "sarah-yunos-cv.pdf" },
  { id: "ap2", name: "Hafiz Tariq", role: "Mural artist", avatar: TALENTS[0].avatar, ago: "1d", cv: "hafiz-tariq-cv.pdf" },
];

const GENERAL = [
  { id: "n1", icon: Heart, text: "Aiman liked your post about weekend pop-up", ago: "20m" },
  { id: "n2", icon: AlertTriangle, text: "New urgent gig in Kiulap matches your skill", ago: "1h" },
  { id: "n3", icon: MessageSquare, text: "Sarah Yunos sent you a message", ago: "2h" },
];

function AlertsPage() {
  const user = useUser();
  const [tab, setTab] = useState<"general" | "track" | "applications" | "manage">(
    "general",
  );

  if (!user) return null;
  const isBiz = user.role === "business";

  const tabs = isBiz
    ? [
        { id: "general", label: "General" },
        { id: "applications", label: "Applications" },
        { id: "manage", label: "Workers" },
      ]
    : [
        { id: "general", label: "General" },
        { id: "track", label: "My applications" },
      ];

  return (
    <AppShell>
      <TopBar title="Alerts" showAlerts={false} />

      <div className="px-5 pt-3">
        <div className="flex gap-1 bg-sand p-1 rounded-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex-1 text-xs font-semibold py-2 rounded-full ${
                tab === t.id ? "bg-paper shadow-sm text-ink" : "text-ink-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {tab === "general" && <GeneralFeed />}
        {tab === "track" && <TrackApplications />}
        {tab === "applications" && <ManageApplications />}
        {tab === "manage" && <ManageWorkers />}
      </div>
    </AppShell>
  );
}

function GeneralFeed() {
  return (
    <div className="px-5 space-y-2">
      {GENERAL.map(({ id, icon: Icon, text, ago }) => (
        <div
          key={id}
          className="bg-paper border border-sand-dark rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="size-9 rounded-full bg-clay-soft text-clay grid place-items-center shrink-0">
            <Icon className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-ink leading-snug">{text}</p>
            <p className="text-[11px] text-ink-muted mt-1">{ago} ago</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackApplications() {
  return (
    <div className="px-5 space-y-3">
      {SEEKER_APPS.map((a) => {
        const cfg =
          a.status === "accepted"
            ? { color: "bg-sage text-paper", icon: CheckCircle2, label: "Accepted" }
            : a.status === "denied"
              ? { color: "bg-rose text-paper", icon: XCircle, label: "Denied" }
              : { color: "bg-honey text-ink", icon: Clock, label: "Pending" };
        const Icon = cfg.icon;
        return (
          <div key={a.id} className="bg-paper border border-sand-dark rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="font-semibold text-ink">{a.role}</p>
                <p className="text-xs text-ink-muted">{a.company} · {a.ago} ago</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full flex items-center gap-1 ${cfg.color}`}>
                <Icon className="size-3" />
                {cfg.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ManageApplications() {
  const [decided, setDecided] = useState<Record<string, "accepted" | "denied">>({});
  return (
    <div className="px-5 space-y-3">
      {APPLICANTS.map((ap) => {
        const status = decided[ap.id];
        return (
          <div key={ap.id} className="bg-paper border border-sand-dark rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={ap.avatar} className="size-12 rounded-full object-cover" alt="" />
              <div className="flex-1">
                <p className="font-semibold text-ink">{ap.name}</p>
                <p className="text-xs text-ink-muted">{ap.role} · {ap.ago} ago</p>
              </div>
            </div>
            <button className="w-full bg-sand hover:bg-clay-soft rounded-xl p-3 flex items-center gap-2 mb-3 text-sm">
              <FileText className="size-4 text-clay" />
              <span className="font-medium">{ap.cv}</span>
              <span className="ml-auto text-xs text-clay font-semibold">View CV</span>
            </button>
            {status ? (
              <div
                className={`text-center text-xs font-bold uppercase py-2 rounded-full ${
                  status === "accepted" ? "bg-sage text-paper" : "bg-rose text-paper"
                }`}
              >
                {status === "accepted" ? "Accepted ✓" : "Denied ✕"}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDecided((p) => ({ ...p, [ap.id]: "denied" }))}
                  className="py-2.5 rounded-full text-sm font-semibold bg-sand text-ink hover:bg-rose hover:text-paper"
                >
                  Deny
                </button>
                <button
                  onClick={() => setDecided((p) => ({ ...p, [ap.id]: "accepted" }))}
                  className="py-2.5 rounded-full text-sm font-semibold bg-clay text-paper hover:bg-clay/90"
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ManageWorkers() {
  const workers = TALENTS.slice(0, 3);
  const [issued, setIssued] = useState<Record<string, boolean>>({});
  const [rates, setRates] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  return (
    <div className="px-5 space-y-3">
      {workers.map((w) => (
        <div key={w.id} className="bg-paper border border-sand-dark rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <img src={w.avatar} className="size-12 rounded-full object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink truncate">{w.name}</p>
              <p className="text-xs text-ink-muted truncate">{w.skill}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i <= Math.round(w.rating)
                      ? "fill-honey text-honey"
                      : "text-sand-dark"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <label className="text-[10px] uppercase tracking-wide text-ink-muted font-semibold col-span-2">
              Rate (B$/hr)
            </label>
            <input
              value={rates[w.id] ?? ""}
              onChange={(e) => setRates((p) => ({ ...p, [w.id]: e.target.value }))}
              type="number"
              placeholder={w.rate}
              className="bg-sand rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clay/30 col-span-2"
            />
          </div>

          <textarea
            value={comments[w.id] ?? ""}
            onChange={(e) => setComments((p) => ({ ...p, [w.id]: e.target.value }))}
            placeholder="Personal comment / review…"
            rows={2}
            className="w-full bg-sand rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clay/30 mb-3 resize-none"
          />

          <button
            onClick={() => setIssued((p) => ({ ...p, [w.id]: true }))}
            disabled={issued[w.id]}
            className={`w-full py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 ${
              issued[w.id]
                ? "bg-sage text-paper"
                : "bg-ink text-honey hover:bg-ink/90"
            }`}
          >
            <Award className="size-4" />
            {issued[w.id] ? "Talent Badge issued ✓" : "Issue Talent Badge"}
          </button>
        </div>
      ))}
    </div>
  );
}
