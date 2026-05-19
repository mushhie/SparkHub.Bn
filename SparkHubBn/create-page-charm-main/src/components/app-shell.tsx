import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, MessageCircle, User, Bell, Plus, Trophy, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useUser } from "@/lib/store";

interface AppShellProps {
  children: ReactNode;
  /** Hide bottom nav (e.g. on auth screens). */
  bare?: boolean;
}

const LEFT_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
] as const;

const RIGHT_NAV = [
  { to: "/community", label: "Spark Space", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children, bare }: AppShellProps) {
  const location = useLocation();
  const user = useUser();

  return (
    <div className="min-h-dvh">
      <main className="app-shell flex flex-col">
        <div className={`flex-1 ${bare ? "" : "pb-28"}`}>{children}</div>

        {!bare && user && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] bg-paper/95 backdrop-blur-md border-t border-sand-dark/50 px-2 py-2 pb-5 z-40">
            <ul className="flex items-end justify-between gap-1">
              {LEFT_NAV.map(({ to, label, icon: Icon }) => (
                <NavItem
                  key={to}
                  to={to}
                  label={label}
                  Icon={Icon}
                  active={
                    to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(to)
                  }
                />
              ))}

              {/* Center raised Post button */}
              <li className="flex-1 flex justify-center -mt-7">
                <Link
                  to="/post"
                  className="size-14 rounded-full bg-clay text-paper grid place-items-center shadow-lg shadow-clay/40 ring-4 ring-paper"
                  aria-label="Post"
                >
                  <Plus className="size-6" strokeWidth={2.6} />
                </Link>
              </li>

              {RIGHT_NAV.map(({ to, label, icon: Icon }) => (
                <NavItem
                  key={to}
                  to={to}
                  label={label}
                  Icon={Icon}
                  active={location.pathname.startsWith(to)}
                />
              ))}
            </ul>
          </nav>
        )}
      </main>
    </div>
  );
}

function NavItem({
  to,
  label,
  Icon,
  active,
}: {
  to: string;
  label: string;
  Icon: typeof Home;
  active: boolean;
}) {
  return (
    <li className="flex-1">
      <Link
        to={to}
        className={`flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors ${
          active ? "text-clay" : "text-ink-muted"
        }`}
      >
        <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
        <span
          className={`text-[10px] font-medium tracking-wide ${
            active ? "font-semibold" : ""
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}

export function TopBar({
  title,
  subtitle,
  showAlerts = true,
  right,
}: {
  title?: string;
  subtitle?: string;
  showAlerts?: boolean;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md px-5 pt-5 pb-4 border-b border-sand-dark/40 flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink flex items-center gap-1.5">
          {title ?? (
            <>
              Spark<span className="text-clay">Hub</span>
              <span className="text-[10px] font-bold tracking-widest bg-clay text-paper px-1.5 py-0.5 rounded-full font-body">
                .bn
              </span>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="text-[11px] tracking-[0.18em] uppercase text-sage font-semibold mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {right}
        {showAlerts && (
          <>
            <Link
              to="/leaderboard"
              className="size-9 grid place-items-center rounded-full bg-sand border border-sand-dark/40 text-ink hover:bg-honey/40 transition-colors"
              aria-label="Leaderboard"
            >
              <Trophy className="size-4" />
            </Link>
            <Link
              to="/alerts"
              className="relative size-9 grid place-items-center rounded-full bg-sand border border-sand-dark/40 text-ink hover:bg-clay-soft transition-colors"
              aria-label="Alerts"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-clay ring-2 ring-paper" />
            </Link>
            <Link
              to="/chats"
              className="size-9 grid place-items-center rounded-full bg-sand border border-sand-dark/40 text-ink hover:bg-clay-soft transition-colors"
              aria-label="Chats"
            >
              <MessageCircle className="size-4" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
