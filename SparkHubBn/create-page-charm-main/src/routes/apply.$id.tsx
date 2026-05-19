import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { TALENTS, ORGS, URGENT_POSTS } from "@/lib/mock-data";
import { useUser } from "@/lib/store";
import { ArrowLeft, Upload, FileText, CheckCircle2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/apply/$id")({
  component: ApplyPage,
  head: () => ({
    meta: [
      { title: "Apply now — LightHub" },
      { name: "description", content: "Send your CV and a quick note to apply for this gig." },
    ],
  }),
});

function ApplyPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const user = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const [cv, setCv] = useState<string | undefined>(user?.cvFileName);
  const [note, setNote] = useState("");
  const [rate, setRate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const job = URGENT_POSTS.find((p) => p.id === id);
  const talent = TALENTS.find((t) => t.id === id);
  const org = ORGS.find((o) => o.id === id);
  const target = job ?? talent ?? org;

  if (!target) {
    return (
      <AppShell bare>
        <div className="min-h-dvh grid place-items-center text-center px-6">
          <p className="text-ink-muted">Listing not found.</p>
        </div>
      </AppShell>
    );
  }

  const title: string = job?.title ?? talent?.name ?? org?.name ?? "Gig";
  const subtitle: string =
    job?.company ?? talent?.skill ?? org?.description ?? "Local hub";

  function uploadCv(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCv(f.name);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cv) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AppShell bare>
        <div className="min-h-dvh grid place-items-center text-center px-6">
          <div>
            <div className="size-20 rounded-full bg-sage text-paper grid place-items-center mx-auto mb-4">
              <CheckCircle2 className="size-10" />
            </div>
            <h1 className="font-display text-2xl text-ink">Application sent!</h1>
            <p className="text-sm text-ink-muted mt-2 max-w-xs">
              You'll get a notification when {subtitle} reviews it. You can chat in the meantime.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 max-w-xs mx-auto">
              <Link to="/alerts" className="bg-sand text-ink py-3 rounded-full text-sm font-semibold">
                Track
              </Link>
              <Link to="/chats" className="bg-clay text-paper py-3 rounded-full text-sm font-semibold">
                Open chat
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell bare>
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md px-3 py-3 flex items-center gap-2 border-b border-sand-dark/40">
        <button
          onClick={() => navigate({ to: "/discover" })}
          className="size-9 grid place-items-center rounded-full hover:bg-sand"
        >
          <ArrowLeft className="size-4" />
        </button>
        <p className="font-display text-base font-semibold">Apply now</p>
      </header>

      <form onSubmit={submit} className="px-5 pt-6 pb-12">
        <div className="bg-clay text-paper rounded-3xl p-5 mb-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-32 bg-white/15 rounded-full blur-2xl" />
          <p className="text-[10px] font-bold tracking-widest uppercase text-paper/80 relative">
            Applying for
          </p>
          <h2 className="font-display text-xl mt-1 leading-tight relative">{title}</h2>
          <p className="text-xs text-paper/90 mt-1 relative">{subtitle}</p>
        </div>

        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          Attach your CV
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,.doc,.docx"
          className="hidden"
          onChange={uploadCv}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`w-full rounded-2xl p-4 flex items-center gap-3 mb-5 ${
            cv
              ? "bg-sage-soft border border-sage"
              : "bg-paper border border-dashed border-sand-dark hover:border-clay"
          }`}
        >
          <div className="size-10 rounded-full bg-clay text-paper grid place-items-center">
            {cv ? <FileText className="size-4" /> : <Upload className="size-4" />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-ink">
              {cv || "Upload CV (PDF / DOCX)"}
            </p>
            <p className="text-[11px] text-ink-muted">
              {cv ? "Tap to replace" : "Required for verification"}
            </p>
          </div>
        </button>

        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          Your proposed rate (optional)
        </p>
        <input
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="e.g. B$25/hr"
          className="w-full bg-paper border border-sand-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-clay mb-5"
        />

        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          Personal note
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Why are you a great fit? Mention any relevant experience…"
          className="w-full bg-paper border border-sand-dark rounded-2xl p-3 text-sm outline-none focus:border-clay resize-none mb-6"
        />

        <button
          type="submit"
          disabled={!cv}
          className={`w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 ${
            cv ? "bg-clay text-paper hover:bg-clay/90" : "bg-sand text-ink-muted"
          }`}
        >
          <Sparkles className="size-4" />
          Send application
        </button>
        {!cv && (
          <p className="text-[11px] text-ink-muted text-center mt-2">
            Upload a CV to enable
          </p>
        )}
      </form>
    </AppShell>
  );
}
