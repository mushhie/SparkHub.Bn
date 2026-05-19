import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, TopBar } from "@/components/app-shell";
import { NichePill } from "@/components/niche-pill";
import { FEED } from "@/lib/mock-data";
import { NICHES, useUser, userStore, type Niche } from "@/lib/store";
import { Heart, MessageCircle, Share2, Plus, Check, Send } from "lucide-react";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
  head: () => ({
    meta: [
      { title: "Spark Space — Community" },
      {
        name: "description",
        content: "Posts, stories and conversations between local talents and businesses.",
      },
    ],
  }),
});

interface Comment {
  id: string;
  author: string;
  body: string;
  ago: string;
}

const SEED_COMMENTS: Record<string, Comment[]> = {
  f1: [
    { id: "c1", author: "Rasa Bistro", body: "Beautiful work! DM us about a cafe refresh.", ago: "1h" },
    { id: "c2", author: "Hafiz Rosli", body: "Love the typography 🔥", ago: "30m" },
  ],
  f2: [{ id: "c3", author: "Aqil Mansor", body: "Happy to do a 30-min chat this weekend!", ago: "3h" }],
  f3: [],
};

function CommunityPage() {
  const user = useUser();
  const [filter, setFilter] = useState<Niche | "all">("all");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>(SEED_COMMENTS);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const joined = user?.joinedNiches ?? [];
  const feed = filter === "all" ? FEED : FEED.filter((p) => p.niche === filter);

  function postComment(postId: string) {
    const body = (drafts[postId] ?? "").trim();
    if (!body || !user) return;
    setComments((p) => ({
      ...p,
      [postId]: [
        ...(p[postId] ?? []),
        { id: `c-${Date.now()}`, author: user.name, body, ago: "now" },
      ],
    }));
    setDrafts((d) => ({ ...d, [postId]: "" }));
  }

  return (
    <AppShell>
      <TopBar title="Spark Space" />

      {/* Niches you can join */}
      <section className="px-5 pt-5">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          Niches you can join
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(NICHES) as Niche[]).map((k) => {
            const n = NICHES[k];
            const isJoined = joined.includes(k);
            return (
              <button
                key={k}
                onClick={() => userStore.toggleJoinedNiche(k)}
                className={`relative rounded-2xl p-3 border text-center transition-all ${
                  isJoined
                    ? "bg-clay text-paper border-clay shadow-sm"
                    : "bg-paper border-sand-dark text-ink hover:border-clay/50"
                }`}
              >
                <div className="text-2xl">{n.emoji}</div>
                <div className="text-[10px] font-semibold mt-1 leading-tight">{n.label}</div>
                <div
                  className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isJoined ? "bg-paper/20 text-paper" : "bg-sage-soft text-sage"
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="size-3" /> Joined
                    </>
                  ) : (
                    <>
                      <Plus className="size-3" /> Join
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-ink-muted mt-2 pl-1">
          Joined niches appear under Chats → Community.
        </p>
      </section>

      {/* Niche filter */}
      <section className="px-5 mt-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            🔥 All posts
          </FilterChip>
          {(Object.keys(NICHES) as Niche[]).map((k) => (
            <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)}>
              {NICHES[k].emoji} {NICHES[k].label}
            </FilterChip>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section className="mt-5 px-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Latest posts</h2>
          <Link
            to="/post"
            className="text-[11px] font-semibold text-clay flex items-center gap-1"
          >
            <Plus className="size-3" /> New post
          </Link>
        </div>

        {feed.map((post) => {
          const isLiked = !!liked[post.id];
          const postComments = comments[post.id] ?? [];
          const isOpen = !!openComments[post.id];
          return (
            <article
              key={post.id}
              className="bg-paper border border-sand-dark rounded-2xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={post.avatar}
                  className="size-10 rounded-full object-cover"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{post.author}</p>
                  <p className="text-[11px] text-ink-muted capitalize">
                    {post.authorRole} · {post.ago} ago
                  </p>
                </div>
                <NichePill niche={post.niche} />
              </div>

              {post.cover && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-sand">
                  <img src={post.cover} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-sm text-ink leading-relaxed mb-3">{post.body}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold text-clay bg-clay-soft px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-5 pt-3 border-t border-sand-dark/40 text-xs text-ink-muted">
                <button
                  onClick={() => setLiked((p) => ({ ...p, [post.id]: !p[post.id] }))}
                  className="flex items-center gap-1.5 hover:text-clay"
                >
                  <Heart className={`size-4 ${isLiked ? "fill-clay text-clay" : ""}`} />
                  {post.likes + (isLiked ? 1 : 0)}
                </button>
                <button
                  onClick={() =>
                    setOpenComments((p) => ({ ...p, [post.id]: !p[post.id] }))
                  }
                  className="flex items-center gap-1.5 hover:text-clay"
                >
                  <MessageCircle className="size-4" />
                  {post.comments + postComments.length}
                </button>
                <button className="ml-auto flex items-center gap-1.5 hover:text-clay">
                  <Share2 className="size-4" />
                </button>
              </div>

              {isOpen && (
                <div className="mt-3 pt-3 border-t border-sand-dark/40 space-y-2">
                  {postComments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2">
                      <div className="size-7 rounded-full bg-sand grid place-items-center text-[11px] font-semibold text-clay shrink-0">
                        {c.author.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0 bg-sand/50 rounded-xl px-3 py-1.5">
                        <p className="text-[11px] font-semibold text-ink">
                          {c.author}{" "}
                          <span className="text-ink-muted font-normal">· {c.ago}</span>
                        </p>
                        <p className="text-xs text-ink leading-snug">{c.body}</p>
                      </div>
                    </div>
                  ))}
                  {postComments.length === 0 && (
                    <p className="text-[11px] text-ink-muted italic">Be the first to comment.</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      value={drafts[post.id] ?? ""}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && postComment(post.id)}
                      placeholder="Write a comment…"
                      className="flex-1 bg-sand rounded-full px-3 py-1.5 text-xs outline-none focus:bg-paper focus:ring-2 focus:ring-clay/30"
                    />
                    <button
                      onClick={() => postComment(post.id)}
                      className="size-8 grid place-items-center rounded-full bg-clay text-paper"
                      aria-label="Send"
                    >
                      <Send className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {feed.length === 0 && (
          <p className="text-sm text-ink-muted text-center py-8">
            No posts in this niche yet.
          </p>
        )}
      </section>
    </AppShell>
  );
}

function FilterChip({
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
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        active
          ? "bg-clay text-paper shadow-sm"
          : "bg-paper border border-sand-dark text-ink-muted hover:bg-clay-soft"
      }`}
    >
      {children}
    </button>
  );
}
