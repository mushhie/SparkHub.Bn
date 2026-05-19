import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { AppShell, TopBar } from "@/components/app-shell";
import { NICHES, useUser, type Niche } from "@/lib/store";
import {
  CheckCircle2,
  Briefcase,
  Sparkles,
  Users,
  Plus,
  Minus,
  Paperclip,
  Image as ImageIcon,
  X,
} from "lucide-react";

export const Route = createFileRoute("/post")({
  component: PostPage,
  head: () => ({
    meta: [
      { title: "Create a post — SparkHub" },
      { name: "description", content: "Post a job, showcase your skills, or share with the community." },
    ],
  }),
});

type Mode = "community" | "primary";
type BudgetType = "fixed" | "hourly" | "range";

function PostPage() {
  const user = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("primary");
  const [title, setTitle] = useState("");
  const [niche, setNiche] = useState<Niche>("creative");
  const [budgetType, setBudgetType] = useState<BudgetType>("fixed");
  const [budget, setBudget] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [duration, setDuration] = useState("");
  const [desc, setDesc] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState(false);

  if (!user) return null;
  const isBiz = user.role === "business";
  const primaryLabel = isBiz ? "Post a Job" : "Showcase skill";
  const PrimaryIcon = isBiz ? Briefcase : Sparkles;

  // Validation
  const budgetNum = budget === "" ? null : Number(budget);
  const budgetInvalid = budget !== "" && (isNaN(budgetNum!) || budgetNum! < 0);
  const budgetMaxNum = budgetMax === "" ? null : Number(budgetMax);
  const budgetMaxInvalid =
    budgetType === "range" && budgetMax !== "" && (isNaN(budgetMaxNum!) || budgetMaxNum! < 0);
  const durationNum = duration === "" ? null : Number(duration);
  const durationInvalid = duration !== "" && (!/^\d+$/.test(duration) || durationNum! < 1);

  function bump(value: string, setter: (v: string) => void, delta: number) {
    const curr = value === "" ? 0 : Number(value);
    if (isNaN(curr)) return;
    setter(Math.max(0, curr + delta).toFixed(2));
  }
  function onBudgetBlur(value: string, setter: (v: string) => void, invalid: boolean) {
    if (value === "" || invalid) return;
    setter(Number(value).toFixed(2));
  }

  function toggleReq(r: string) {
    setRequirements((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));
  }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAttachment(f.name);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (mode === "primary" && (budgetInvalid || budgetMaxInvalid || durationInvalid)) return;
    setDone(true);
  }

  if (done) {
    return (
      <AppShell bare>
        <div className="min-h-dvh grid place-items-center text-center px-6">
          <div>
            <div className="size-20 rounded-full bg-sage text-paper grid place-items-center mx-auto mb-4">
              <CheckCircle2 className="size-10" />
            </div>
            <h1 className="font-display text-2xl text-ink">
              {mode === "community" ? "Posted to community!" : isBiz ? "Job posted!" : "Skill showcased!"}
            </h1>
            <p className="text-sm text-ink-muted mt-2 max-w-xs">
              Your post is live on the community board.
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-6 bg-clay text-paper px-6 py-3 rounded-full text-sm font-semibold"
            >
              Back to home
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title="Create post" showAlerts={false} />

      <div className="px-5 pt-5">
        {/* Mode toggle */}
        <div className="bg-sand p-1 rounded-full flex shadow-inner mb-5">
          <button
            onClick={() => setMode("primary")}
            className={`flex-1 text-xs font-semibold py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              mode === "primary" ? "bg-paper shadow-sm text-ink" : "text-ink-muted"
            }`}
          >
            <PrimaryIcon className="size-3.5" /> {primaryLabel}
          </button>
          <button
            onClick={() => setMode("community")}
            className={`flex-1 text-xs font-semibold py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              mode === "community" ? "bg-paper shadow-sm text-ink" : "text-ink-muted"
            }`}
          >
            <Users className="size-3.5" /> Community post
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Field label={mode === "community" ? "What's on your mind?" : isBiz ? "Job title" : "Skill title"}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                mode === "community"
                  ? "e.g. Looking for collab partners!"
                  : isBiz
                    ? "e.g. Graphic Designer"
                    : "e.g. Brand identity & logo design"
              }
              className="w-full bg-paper border border-sand-dark rounded-xl px-4 py-2.5 text-sm outline-none focus:border-clay"
            />
          </Field>

          <Field label="Category">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(NICHES) as Niche[]).map((k) => (
                <button
                  type="button"
                  key={k}
                  onClick={() => setNiche(k)}
                  className={`p-2 rounded-xl text-center transition-all ${
                    niche === k
                      ? "bg-clay text-paper"
                      : "bg-paper border border-sand-dark text-ink-muted hover:bg-clay-soft"
                  }`}
                >
                  <div className="text-lg">{NICHES[k].emoji}</div>
                  <div className="text-[10px] font-semibold leading-tight mt-0.5">
                    {NICHES[k].label}
                  </div>
                </button>
              ))}
            </div>
          </Field>

          {mode === "primary" && (
            <>
              {/* Budget type toggle */}
              <Field label={isBiz ? "Budget type" : "Rate type"}>
                <div className="flex gap-1 bg-sand p-1 rounded-full">
                  {(["fixed", "hourly", "range"] as BudgetType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBudgetType(t)}
                      className={`flex-1 text-[11px] font-semibold py-2 rounded-full capitalize transition-all ${
                        budgetType === t ? "bg-paper shadow-sm text-ink" : "text-ink-muted"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={budgetType === "range" ? "Min (B$)" : isBiz ? "Budget (B$)" : "Rate (B$)"}>
                <BudgetInput
                  value={budget}
                  setValue={setBudget}
                  invalid={budgetInvalid}
                  onBump={(d) => bump(budget, setBudget, d)}
                  onBlur={() => onBudgetBlur(budget, setBudget, budgetInvalid)}
                />
                {budgetInvalid && (
                  <p className="text-[11px] text-rose mt-1">Enter a valid number (e.g. 12.50).</p>
                )}
              </Field>

              {budgetType === "range" && (
                <Field label="Max (B$)">
                  <BudgetInput
                    value={budgetMax}
                    setValue={setBudgetMax}
                    invalid={budgetMaxInvalid}
                    onBump={(d) => bump(budgetMax, setBudgetMax, d)}
                    onBlur={() => onBudgetBlur(budgetMax, setBudgetMax, budgetMaxInvalid)}
                  />
                  {budgetMaxInvalid && (
                    <p className="text-[11px] text-rose mt-1">Enter a valid number.</p>
                  )}
                </Field>
              )}

              <label className="flex items-center gap-2 text-xs text-ink-muted">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="accent-clay"
                />
                Negotiable
              </label>

              <Field label="Duration (days)">
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  inputMode="numeric"
                  placeholder="e.g. 14"
                  className={`w-full bg-paper border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${
                    durationInvalid ? "border-rose" : "border-sand-dark focus:border-clay"
                  }`}
                />
                {durationInvalid && (
                  <p className="text-[11px] text-rose mt-1">Days must be a whole number (e.g. 7).</p>
                )}
              </Field>

              {isBiz && (
                <Field label="Required from applicants">
                  <div className="space-y-2">
                    {["Certificate", "Portfolio", "Experience Badge"].map((r) => (
                      <label
                        key={r}
                        className="flex items-center gap-2 text-sm text-ink bg-paper border border-sand-dark rounded-xl px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={requirements.includes(r)}
                          onChange={() => toggleReq(r)}
                          className="accent-clay"
                        />
                        {r}
                      </label>
                    ))}
                  </div>
                </Field>
              )}
            </>
          )}

          <Field label={mode === "community" ? "Caption" : "Description"}>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder={
                mode === "community"
                  ? "Share an update, ask a question, or celebrate a win…"
                  : isBiz
                    ? "What talents can expect: scope, deliverables, how to apply…"
                    : "Tell people what you can do, examples & availability…"
              }
              className="w-full bg-paper border border-sand-dark rounded-2xl p-3 text-sm outline-none focus:border-clay resize-none"
            />
          </Field>

          {/* Attachment */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*,application/pdf"
              className="hidden"
              onChange={onFile}
            />
            {attachment ? (
              <div className="flex items-center gap-2 bg-clay-soft border border-clay/30 rounded-xl px-3 py-2 text-xs text-ink">
                <Paperclip className="size-3.5 text-clay" />
                <span className="flex-1 truncate">{attachment}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(undefined)}
                  className="text-ink-muted hover:text-rose"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-ink-muted bg-paper border border-dashed border-sand-dark rounded-xl py-2.5 hover:border-clay hover:text-clay"
              >
                <ImageIcon className="size-3.5" /> Add image / video / file
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={mode === "primary" && (budgetInvalid || budgetMaxInvalid || durationInvalid)}
            className="w-full bg-clay text-paper font-bold py-3 rounded-full hover:bg-clay/90 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === "community"
              ? "Share to community →"
              : isBiz
                ? "Post Job →"
                : "Showcase →"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}

function BudgetInput({
  value,
  setValue,
  invalid,
  onBump,
  onBlur,
}: {
  value: string;
  setValue: (v: string) => void;
  invalid: boolean;
  onBump: (d: number) => void;
  onBlur: () => void;
}) {
  return (
    <div
      className={`flex items-center bg-paper border rounded-xl overflow-hidden transition-colors ${
        invalid ? "border-rose" : "border-sand-dark focus-within:border-clay"
      }`}
    >
      <span className="pl-3 pr-1 text-sm text-ink-muted font-semibold">B$</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        inputMode="decimal"
        placeholder="0.00"
        className="flex-1 bg-transparent px-1 py-2.5 text-sm outline-none"
      />
      <div className="flex border-l border-sand-dark/60">
        <button
          type="button"
          onClick={() => onBump(-1)}
          className="size-10 grid place-items-center hover:bg-sand"
          aria-label="Decrease"
        >
          <Minus className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onBump(1)}
          className="size-10 grid place-items-center hover:bg-sand border-l border-sand-dark/60"
          aria-label="Increase"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">{label}</p>
      {children}
    </div>
  );
}
