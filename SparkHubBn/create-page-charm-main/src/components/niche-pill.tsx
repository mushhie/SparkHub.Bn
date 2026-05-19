import type { Niche } from "@/lib/store";
import { NICHES } from "@/lib/store";

export function NichePill({ niche, size = "sm" }: { niche: Niche; size?: "sm" | "md" }) {
  const n = NICHES[niche];
  const cls =
    niche === "creative"
      ? "bg-clay-soft text-clay"
      : niche === "tech"
        ? "bg-sage-soft text-sage"
        : "bg-honey/30 text-ink";
  const padding = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold tracking-wide uppercase ${cls} ${padding}`}
    >
      <span className="text-[10px]">{n.emoji}</span>
      <span>{n.label}</span>
    </span>
  );
}
