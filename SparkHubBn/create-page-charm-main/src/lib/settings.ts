import { useSyncExternalStore } from "react";

interface Settings {
  theme: "light" | "dark";
  notifications: boolean;
}

const KEY = "sparkhub:settings:v1";
const listeners = new Set<() => void>();

let state: Settings = { theme: "light", notifications: true };

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  applyTheme();
}

function applyTheme() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", state.theme === "dark");
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
  applyTheme();
  listeners.forEach((l) => l());
}

load();

export const settingsStore = {
  get: () => state,
  setTheme: (t: "light" | "dark") => {
    state = { ...state, theme: t };
    persist();
  },
  toggleTheme: () => {
    state = { ...state, theme: state.theme === "dark" ? "light" : "dark" };
    persist();
  },
  setNotifications: (v: boolean) => {
    state = { ...state, notifications: v };
    persist();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useSettings() {
  return useSyncExternalStore(
    settingsStore.subscribe,
    () => state,
    () => state,
  );
}
