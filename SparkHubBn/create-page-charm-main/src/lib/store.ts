// Lightweight client-side store for SparkHub mockup.
// Persists user/session in localStorage and exposes a tiny pub/sub for React.

import { useEffect, useSyncExternalStore } from "react";

export type Role = "talent" | "business";
export type Niche = "tech" | "creative" | "fnb";
export type BusinessType = "startup" | "professional";

export const NICHES: Record<
  Niche,
  { label: string; tagline: string; emoji: string; color: string }
> = {
  tech: {
    label: "Tech & Digital",
    tagline: "Web, apps, IT support & data",
    emoji: "💻",
    color: "sage",
  },
  creative: {
    label: "Creative Arts",
    tagline: "Design, art, content & crafts",
    emoji: "🎨",
    color: "clay",
  },
  fnb: {
    label: "Food & Business",
    tagline: "F&B, hospitality & local trade",
    emoji: "🍜",
    color: "honey",
  },
};

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: "pending" | "shortlisted" | "accepted" | "rejected";
  appliedAt: string;
}

export interface Achievement {
  id: string;
  tier: "bronze" | "silver" | "gold";
  title: string;
  issuer: string;
  durationDays: number;
  date: string;
  comment?: string;
}

export interface UserProfile {
  role: Role;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  profileImage?: string;
  bio?: string;
  companyName?: string;
  businessType?: BusinessType;
  officeNumber?: string;
  address?: string;
  category?: Niche;
  categories?: Niche[]; // business multi
  skills?: Niche[]; // talent multi
  rate?: string;
  minRate?: number;
  negotiable?: boolean;
  cvFileName?: string;
  portfolio?: PortfolioItem[];
  externalLinks?: { label: string; url: string }[];
  applications?: Application[];
  achievements?: Achievement[];
  joinedNiches?: Niche[];
  /** Gamification */
  points: number;
  rating: number;
  streak: number;
  jobsCompleted: number;
  badges: string[];
  avatar?: string;
  walletBalance: number;
  bankAcct?: string;
  bankName?: string;
}

const STORAGE_KEY = "sparkhub:user:v1";

let user: UserProfile | null = null;
const listeners = new Set<() => void>();

function migrate(u: UserProfile): UserProfile {
  // Migrate legacy "professional" niche → "fnb"
  const fix = (n: unknown) => (n === "professional" ? "fnb" : n) as Niche;
  return {
    ...u,
    category: u.category ? fix(u.category) : undefined,
    categories: u.categories?.map(fix),
    skills: u.skills?.map(fix),
    joinedNiches: u.joinedNiches?.map(fix),
  };
}

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) user = migrate(JSON.parse(raw));
  } catch {
    user = null;
  }
}
load();

function persist() {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

function emit() {
  listeners.forEach((l) => l());
}

export const userStore = {
  get: () => user,
  set: (next: UserProfile | null) => {
    user = next;
    persist();
    emit();
  },
  patch: (patch: Partial<UserProfile>) => {
    if (!user) return;
    user = { ...user, ...patch };
    persist();
    emit();
  },
  toggleJoinedNiche: (n: Niche) => {
    if (!user) return;
    const current = user.joinedNiches ?? [];
    user = {
      ...user,
      joinedNiches: current.includes(n)
        ? current.filter((x) => x !== n)
        : [...current, n],
    };
    persist();
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useUser() {
  const subscribe = (cb: () => void) => userStore.subscribe(cb);
  const getSnapshot = () => userStore.get();
  const getServerSnapshot = () => null;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useHydrate() {
  useEffect(() => {
    load();
    emit();
  }, []);
}
