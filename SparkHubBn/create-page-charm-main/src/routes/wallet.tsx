import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useUser, userStore } from "@/lib/store";
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpRight,
  Wallet,
  Plus,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
  head: () => ({
    meta: [
      { title: "LightPay wallet — LightHub" },
      {
        name: "description",
        content:
          "Top up, withdraw and pay talents directly. Linked to local banks (BIBD / Baiduri).",
      },
    ],
  }),
});

const TXNS = [
  { id: "tx1", label: "Paid Sarah Yunos", date: "Today", amount: -60, kind: "out" as const },
  { id: "tx2", label: "Top up · BIBD", date: "Yesterday", amount: 200, kind: "in" as const },
  { id: "tx3", label: "Paid Hafiz Tariq", date: "Mon", amount: -150, kind: "out" as const },
  { id: "tx4", label: "Refund · Iman H.", date: "Last week", amount: 30, kind: "in" as const },
];

function WalletPage() {
  const user = useUser();
  const navigate = useNavigate();
  const [showLink, setShowLink] = useState(false);
  const [bank, setBank] = useState(user?.bankName ?? "");
  const [acct, setAcct] = useState(user?.bankAcct ?? "");

  if (!user) return null;

  function topUp() {
    userStore.patch({ walletBalance: (user!.walletBalance ?? 0) + 50 });
  }

  function saveBank() {
    userStore.patch({ bankName: bank, bankAcct: acct });
    setShowLink(false);
  }

  return (
    <AppShell bare>
      <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md px-3 py-3 flex items-center gap-2 border-b border-sand-dark/40">
        <button
          onClick={() => navigate({ to: "/profile" })}
          className="size-9 grid place-items-center rounded-full hover:bg-sand"
        >
          <ArrowLeft className="size-4" />
        </button>
        <p className="font-display text-base font-semibold">LightPay</p>
      </header>

      <section className="px-5 pt-6">
        <div className="bg-ink text-paper rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-44 bg-honey/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 size-44 bg-clay/40 rounded-full blur-3xl" />
          <div className="flex items-center gap-2 relative">
            <Wallet className="size-4 text-honey" />
            <p className="text-[10px] font-bold tracking-widest uppercase text-paper/80">
              Available balance
            </p>
          </div>
          <p className="font-display text-4xl font-semibold mt-2 relative">
            B$ {user.walletBalance.toFixed(2)}
          </p>
          <p className="text-xs text-paper/70 mt-1 relative">
            Linked to {user.bankName || "no bank yet"}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 relative">
            <button
              onClick={topUp}
              className="bg-honey text-ink py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-1.5"
            >
              <ArrowDownToLine className="size-4" />
              Top up
            </button>
            <button className="bg-paper/15 backdrop-blur text-paper py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-1.5">
              <ArrowUpRight className="size-4" />
              Withdraw
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 mt-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          Linked accounts
        </p>
        <div className="bg-paper border border-sand-dark rounded-2xl p-4">
          {user.bankName ? (
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-clay-soft text-clay grid place-items-center">
                <Building2 className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink text-sm">{user.bankName}</p>
                <p className="text-xs text-ink-muted">•••• {user.bankAcct?.slice(-4)}</p>
              </div>
              <button
                onClick={() => setShowLink(true)}
                className="text-xs font-semibold text-clay"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLink(true)}
              className="w-full flex items-center gap-3 text-left"
            >
              <div className="size-10 rounded-full border border-dashed border-sand-dark grid place-items-center text-clay">
                <Plus className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">Link a bank account</p>
                <p className="text-xs text-ink-muted">BIBD, Baiduri & more</p>
              </div>
            </button>
          )}
        </div>

        {showLink && (
          <div className="mt-3 bg-paper border border-sand-dark rounded-2xl p-4">
            <p className="text-[10px] font-bold tracking-widest uppercase text-sage mb-2">
              Link account (demo)
            </p>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full bg-sand rounded-xl px-3 py-2.5 text-sm mb-2 outline-none"
            >
              <option value="">Select bank…</option>
              <option>BIBD</option>
              <option>Baiduri Bank</option>
              <option>Standard Chartered</option>
            </select>
            <input
              value={acct}
              onChange={(e) => setAcct(e.target.value)}
              placeholder="Account number"
              className="w-full bg-sand rounded-xl px-3 py-2.5 text-sm mb-3 outline-none"
            />
            <button
              onClick={saveBank}
              disabled={!bank || !acct}
              className="w-full bg-clay text-paper py-2.5 rounded-full text-sm font-bold disabled:bg-sand disabled:text-ink-muted"
            >
              Save
            </button>
          </div>
        )}
      </section>

      <section className="px-5 mt-6 pb-12">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage mb-2">
          Recent activity
        </p>
        <div className="bg-paper border border-sand-dark rounded-2xl divide-y divide-sand-dark/40">
          {TXNS.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3">
              <div
                className={`size-9 rounded-full grid place-items-center ${
                  t.kind === "in" ? "bg-sage-soft text-sage" : "bg-clay-soft text-clay"
                }`}
              >
                {t.kind === "in" ? (
                  <ArrowDownToLine className="size-4" />
                ) : (
                  <ArrowUpRight className="size-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{t.label}</p>
                <p className="text-[11px] text-ink-muted">{t.date}</p>
              </div>
              <p
                className={`text-sm font-bold ${
                  t.kind === "in" ? "text-sage" : "text-ink"
                }`}
              >
                {t.kind === "in" ? "+" : "−"}B$ {Math.abs(t.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-ink-muted text-center mt-3">
          Demo wallet · planned partnerships with BIBD & Baiduri
        </p>
      </section>
    </AppShell>
  );
}
