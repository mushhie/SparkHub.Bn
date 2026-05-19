import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { AppShell, TopBar } from "@/components/app-shell";
import { THREADS, MESSAGES, type ChatMessage } from "@/lib/mock-data";
import { NICHES, useUser, type Niche } from "@/lib/store";
import { Paperclip, Send, ArrowLeft, ImageIcon, FileText, Users } from "lucide-react";

export const Route = createFileRoute("/chats")({
  component: ChatsPage,
  head: () => ({
    meta: [
      { title: "Chats — SparkHub" },
      {
        name: "description",
        content:
          "Direct chats with employers and talents, plus community spaces for each niche.",
      },
    ],
  }),
});

interface CommunitySpace {
  id: Niche;
  name: string;
  members: number;
  lastMessage: string;
  ago: string;
}

const COMMUNITY: CommunitySpace[] = [
  { id: "tech", name: "Tech & Digital", members: 184, lastMessage: "Aqil: anyone using Supabase RLS?", ago: "5m" },
  { id: "creative", name: "Creative Arts", members: 312, lastMessage: "Afiqah shared a new mockup ✨", ago: "20m" },
  { id: "fnb", name: "Food & Business", members: 96, lastMessage: "Aida: Anyone need a halal caterer this Sat?", ago: "2h" },
];

const NICHE_BG: Record<Niche, string> = {
  tech: "bg-sage-soft",
  creative: "bg-clay-soft",
  fnb: "bg-honey/30",
};

const COMMUNITY_MESSAGES: Record<Niche, ChatMessage[]> = {
  tech: [
    { id: "tm1", threadId: "tech", from: "them", body: "Hey devs! Any React Native tips for beginners?", time: "9:00" },
    { id: "tm2", threadId: "tech", from: "them", body: "Aqil: anyone using Supabase RLS?", time: "9:30" },
  ],
  creative: [
    { id: "cm1", threadId: "creative", from: "them", body: "Afiqah shared a new mockup ✨", time: "10:10" },
  ],
  fnb: [
    { id: "pm1", threadId: "fnb", from: "them", body: "Aida: Anyone need a halal caterer this Sat?", time: "8:00" },
  ],
};

type ActiveChat = { kind: "direct"; id: string } | { kind: "community"; id: Niche };

function ChatsPage() {
  const user = useUser();
  const [tab, setTab] = useState<"direct" | "community">("direct");
  const [active, setActive] = useState<ActiveChat | null>(null);
  const joined = user?.joinedNiches ?? [];
  const joinedSpaces = COMMUNITY.filter((c) => joined.includes(c.id));

  if (active?.kind === "direct") {
    return <ChatView threadId={active.id} onBack={() => setActive(null)} />;
  }
  if (active?.kind === "community") {
    return <CommunityView nicheId={active.id} onBack={() => setActive(null)} />;
  }

  return (
    <AppShell>
      <TopBar title="Chats" />
      <div className="px-5 pt-3">
        <div className="flex gap-1 bg-sand p-1 rounded-full">
          {(["direct", "community"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-xs font-semibold py-2 rounded-full capitalize ${
                tab === t ? "bg-paper shadow-sm text-ink" : "text-ink-muted"
              }`}
            >
              {t === "direct" ? "Direct" : "Community"}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-3">
        {tab === "direct" &&
          THREADS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive({ kind: "direct", id: t.id })}
              className="w-full px-5 py-3 flex items-center gap-3 hover:bg-sand/40 text-left border-b border-sand-dark/30"
            >
              <img src={t.avatar} className="size-12 rounded-full object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink truncate">{t.name}</p>
                  <span className="text-[10px] text-ink-muted">{t.ago}</span>
                </div>
                <p className="text-xs text-ink-muted truncate mt-0.5">{t.lastMessage}</p>
              </div>
              {t.unread > 0 && (
                <span className="size-5 rounded-full bg-clay text-paper text-[10px] font-bold grid place-items-center">
                  {t.unread}
                </span>
              )}
            </button>
          ))}

        {tab === "community" && (
          <>
            <p className="px-5 text-[11px] text-ink-muted mb-1">
              Only niches you've joined in Spark Space appear here.
            </p>
            {joinedSpaces.map((c) => {
              const meta = NICHES[c.id];
              return (
                <button
                  key={c.id}
                  onClick={() => setActive({ kind: "community", id: c.id })}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-sand/40 text-left border-b border-sand-dark/30"
                >
                  <div className={`size-12 rounded-2xl grid place-items-center text-2xl ${NICHE_BG[c.id]}`}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink truncate">{c.name}</p>
                      <span className="text-[10px] text-ink-muted">{c.ago}</span>
                    </div>
                    <p className="text-xs text-ink-muted truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-ink-muted">
                    <Users className="size-3" />
                    {c.members}
                  </span>
                </button>
              );
            })}
            {joinedSpaces.length === 0 && (
              <div className="px-5 py-8 text-center">
                <p className="text-xs text-ink-muted mb-2">No community spaces joined yet.</p>
                <Link to="/community" className="text-xs text-clay font-semibold">
                  Browse Spark Space →
                </Link>
              </div>
            )}
          </>
        )}

        {tab === "direct" && (
          <div className="px-5 py-8 text-center">
            <Link to="/discover" className="text-xs text-clay font-semibold">
              Browse talents to start a new chat →
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function CommunityView({ nicheId, onBack }: { nicheId: Niche; onBack: () => void }) {
  const meta = NICHES[nicheId];
  const space = COMMUNITY.find((c) => c.id === nicheId)!;
  const [msgs, setMsgs] = useState<ChatMessage[]>(COMMUNITY_MESSAGES[nicheId]);
  const [draft, setDraft] = useState("");

  function send() {
    const body = draft.trim();
    if (!body) return;
    setMsgs((p) => [...p, { id: `cm-${Date.now()}`, threadId: nicheId, from: "me", body, time: "now" }]);
    setDraft("");
  }

  return (
    <AppShell bare>
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md px-3 py-3 border-b border-sand-dark/40 flex items-center gap-3">
        <button onClick={onBack} className="size-9 grid place-items-center rounded-full hover:bg-sand">
          <ArrowLeft className="size-4" />
        </button>
        <div className={`size-9 rounded-xl grid place-items-center text-lg ${NICHE_BG[nicheId]}`}>
          {meta.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{space.name} Space</p>
          <p className="text-[10px] text-sage font-semibold uppercase tracking-wide">
            {space.members} members
          </p>
        </div>
      </header>

      <div className="px-4 py-5 space-y-3 min-h-[60dvh]">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2 ${
                m.from === "me" ? "bg-clay text-paper rounded-br-md" : "bg-sand text-ink rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-snug">{m.body}</p>
              <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-paper/70" : "text-ink-muted"}`}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] bg-paper border-t border-sand-dark/40 p-3 pb-5 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Message the ${meta.label} space…`}
          className="flex-1 bg-sand rounded-full px-4 py-2.5 text-sm outline-none focus:bg-paper focus:ring-2 focus:ring-clay/30"
        />
        <button onClick={send} className="size-10 grid place-items-center rounded-full bg-clay text-paper hover:bg-clay/90" aria-label="Send">
          <Send className="size-4" />
        </button>
      </div>
    </AppShell>
  );
}

function ChatView({ threadId, onBack }: { threadId: string; onBack: () => void }) {
  const thread = THREADS.find((t) => t.id === threadId)!;
  const [msgs, setMsgs] = useState<ChatMessage[]>(MESSAGES[threadId] ?? []);
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function send() {
    const body = draft.trim();
    if (!body) return;
    setMsgs((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, threadId, from: "me", body, time: "now" },
    ]);
    setDraft("");
  }

  function attachFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const isImage = f.type.startsWith("image/");
    const url = isImage ? URL.createObjectURL(f) : undefined;
    setMsgs((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        threadId,
        from: "me",
        body: isImage ? "" : `Sent a file: ${f.name}`,
        time: "now",
        attachment: { name: f.name, kind: isImage ? "image" : "file", url },
      },
    ]);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <AppShell bare>
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md px-3 py-3 border-b border-sand-dark/40 flex items-center gap-3">
        <button onClick={onBack} className="size-9 grid place-items-center rounded-full hover:bg-sand">
          <ArrowLeft className="size-4" />
        </button>
        <img src={thread.avatar} className="size-9 rounded-full object-cover" alt="" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{thread.name}</p>
          <p className="text-[10px] text-sage font-semibold uppercase tracking-wide">{thread.role}</p>
        </div>
      </header>

      <div className="px-4 py-5 space-y-3 min-h-[60dvh]">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2 ${
                m.from === "me" ? "bg-clay text-paper rounded-br-md" : "bg-sand text-ink rounded-bl-md"
              }`}
            >
              {m.attachment?.kind === "image" && m.attachment.url && (
                <img src={m.attachment.url} alt={m.attachment.name} className="rounded-lg max-w-full mb-1" />
              )}
              {m.attachment?.kind === "file" && (
                <div className="flex items-center gap-2 bg-black/10 rounded-lg p-2 mb-1">
                  <FileText className="size-4" />
                  <span className="text-xs font-medium">{m.attachment.name}</span>
                </div>
              )}
              {m.body && <p className="text-sm leading-snug">{m.body}</p>}
              <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-paper/70" : "text-ink-muted"}`}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] bg-paper border-t border-sand-dark/40 p-3 pb-5 flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf,.doc,.docx"
          className="hidden"
          onChange={attachFile}
        />
        <button onClick={() => fileRef.current?.click()} className="size-10 grid place-items-center rounded-full bg-sand text-ink hover:bg-clay-soft" aria-label="Attach">
          <Paperclip className="size-4" />
        </button>
        <button onClick={() => fileRef.current?.click()} className="size-10 grid place-items-center rounded-full bg-sand text-ink hover:bg-clay-soft" aria-label="Image">
          <ImageIcon className="size-4" />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message…"
          className="flex-1 bg-sand rounded-full px-4 py-2.5 text-sm outline-none focus:bg-paper focus:ring-2 focus:ring-clay/30"
        />
        <button onClick={send} className="size-10 grid place-items-center rounded-full bg-clay text-paper hover:bg-clay/90" aria-label="Send">
          <Send className="size-4" />
        </button>
      </div>
    </AppShell>
  );
}
