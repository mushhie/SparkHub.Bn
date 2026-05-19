import { Link, useLocation } from "@tanstack/react-router";

export function SectionHeader({
  title,
  caption,
  to,
}: {
  title: string;
  caption?: string;
  to?: string;
}) {
  return (
    <div className="px-5 flex items-baseline justify-between mb-4">
      <div>
        {caption && (
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-1">
            {caption}
          </p>
        )}
        <h2 className="font-display text-xl text-ink">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="text-xs font-medium text-clay hover:underline">
          See all
        </Link>
      )}
    </div>
  );
}

export function useActiveTab() {
  const loc = useLocation();
  return loc.pathname;
}
