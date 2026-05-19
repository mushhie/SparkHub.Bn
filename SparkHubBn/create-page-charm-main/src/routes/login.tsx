import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { userStore, type Role, type Niche, type BusinessType, NICHES } from "@/lib/store";
import { Sparkles, MapPin, Search, ImagePlus, Briefcase, Rocket } from "lucide-react";

const ADDRESS_SUGGESTIONS = [
  "Unit 12, Ground Floor, Kiulap Plaza, Jln Kiulap, BSB",
  "No. 24, Spg 88, Jln Gadong, Gadong BE3919",
  "Block C, The Mall, Jln Bunga Raya, Gadong BE3919",
  "Lot 5, Jln Berakas, Berakas BB2713",
  "No. 8, Jln Tutong, Beribi BE1518",
  "Spg 134, Jln Jerudong, Jerudong BG3122",
  "Yayasan Complex, Jln Pretty, BSB BS8711",
  "Unit 3A, One Riverside, Jln McArthur, BSB BS8711",
  "Spg 88, Jln Muara, Serusop BB2313",
  "Times Square Shopping Centre, Berakas BB4713",
];

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in to SparkHub" },
      { name: "description", content: "Join SparkHub as a Talent or a Business in seconds." },
    ],
  }),
});

type Step = "role" | "biztype" | "form";

function LoginPage() {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role>("talent");
  const [bizType, setBizType] = useState<BusinessType>("startup");
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("Afiqah Rahman");
  const [email, setEmail] = useState("afiqah@example.com");
  const [phone, setPhone] = useState("888 1234");
  const [officeNumber, setOfficeNumber] = useState("242 1234");
  const [birthdate, setBirthdate] = useState("1999-04-12");
  const [companyName, setCompanyName] = useState("Rasa Bistro");
  const [address, setAddress] = useState("Kiulap, Brunei");
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [skills, setSkills] = useState<Niche[]>(["creative"]);
  const [categories, setCategories] = useState<Niche[]>(["fnb"]);

  function pickRole(r: Role) {
    setRole(r);
    if (r === "business") {
      setName("Aida Rahman");
      setEmail("hello@rasabistro.com");
      setPhone("222 5678");
      setStep("biztype");
    } else {
      setName("Afiqah Rahman");
      setEmail("afiqah@example.com");
      setPhone("888 1234");
      setStep("form");
    }
  }

  function toggleSkill(n: Niche) {
    setSkills((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  }
  function toggleCategory(n: Niche) {
    setCategories((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  }

  function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(f);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const phoneFull = `+673 ${phone.replace(/^\+?673\s*/, "")}`.trim();
    userStore.set({
      role,
      name: role === "business" ? companyName || name : name,
      email,
      phone: phoneFull,
      birthdate: role === "talent" ? birthdate : undefined,
      profileImage,
      companyName: role === "business" ? companyName || name : undefined,
      businessType: role === "business" ? bizType : undefined,
      officeNumber: role === "business" && bizType === "professional" ? `+673 ${officeNumber}` : undefined,
      address: role === "business" ? address : undefined,
      categories: role === "business" ? categories : undefined,
      category: role === "business" ? categories[0] : undefined,
      skills: role === "talent" ? skills : undefined,
      portfolio: [],
      achievements: [],
      applications: [],
      joinedNiches: [],
      bio: "",
      rate: role === "talent" ? "B$12/hr" : undefined,
      points: role === "talent" ? 120 : 0,
      rating: role === "talent" ? 0 : 0,
      streak: 0,
      jobsCompleted: 0,
      badges: [],
      walletBalance: role === "business" ? 250 : 0,
    });
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-dvh bg-ink/95 flex items-center justify-center p-5">
      <div className="w-full max-w-[420px] bg-paper rounded-3xl p-7 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-44 bg-honey/30 rounded-full blur-2xl" />
        <div className="relative">
          <div className="text-center mb-1">
            <span className="font-display text-3xl font-semibold text-ink">
              Spark<span className="text-clay">Hub</span>
            </span>
            <span className="ml-1 text-[10px] font-bold tracking-widest bg-clay text-paper px-1.5 py-0.5 rounded-full align-middle">
              .bn
            </span>
            <Sparkles className="inline-block size-4 text-honey ml-2 align-middle" />
          </div>

          {step === "role" && (
            <>
              <p className="text-sm text-ink-muted mb-6 text-left">Choose your path ✦</p>

              <button
                onClick={() => pickRole("talent")}
                className="w-full text-left bg-sand/60 hover:bg-clay-soft border-2 border-transparent hover:border-clay rounded-2xl p-5 mb-3 transition-all"
              >
                <div className="text-2xl mb-1">🌟</div>
                <p className="font-display text-base font-semibold text-ink">
                  I'm a Talent / Job Seeker
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  Find work, earn achievements, build your reputation.
                </p>
              </button>

              <button
                onClick={() => pickRole("business")}
                className="w-full text-left bg-sand/60 hover:bg-honey/30 border-2 border-transparent hover:border-honey rounded-2xl p-5 transition-all"
              >
                <div className="text-2xl mb-1">🏢</div>
                <p className="font-display text-base font-semibold text-ink">
                  I'm a Business / Employer
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  Post jobs, find talent, issue verified achievements.
                </p>
              </button>

              <p className="text-[11px] text-center text-ink-muted mt-6">
                Built for Brunei • Mockup demo
              </p>
            </>
          )}

          {step === "biztype" && (
            <>
              <button
                onClick={() => setStep("role")}
                className="text-xs text-ink-muted mb-3 hover:underline"
              >
                ← Back
              </button>
              <p className="font-display text-lg text-ink mb-1">Which best describes you?</p>
              <p className="text-xs text-ink-muted mb-5">
                We'll tailor your registration form.
              </p>
              <button
                onClick={() => {
                  setBizType("startup");
                  setStep("form");
                }}
                className="w-full text-left bg-sand/60 hover:bg-honey/30 border-2 border-transparent hover:border-honey rounded-2xl p-5 mb-3 transition-all flex items-start gap-3"
              >
                <Rocket className="size-6 text-clay mt-0.5" />
                <div>
                  <p className="font-display text-base font-semibold text-ink">Startup</p>
                  <p className="text-xs text-ink-muted mt-1">
                    Young business, small team, fast pace.
                  </p>
                </div>
              </button>
              <button
                onClick={() => {
                  setBizType("professional");
                  setStep("form");
                }}
                className="w-full text-left bg-sand/60 hover:bg-clay-soft border-2 border-transparent hover:border-clay rounded-2xl p-5 transition-all flex items-start gap-3"
              >
                <Briefcase className="size-6 text-sage mt-0.5" />
                <div>
                  <p className="font-display text-base font-semibold text-ink">Professional</p>
                  <p className="text-xs text-ink-muted mt-1">
                    Established firm with office & operations.
                  </p>
                </div>
              </button>
            </>
          )}

          {step === "form" && (
            <form onSubmit={submit}>
              <button
                type="button"
                onClick={() => setStep(role === "business" ? "biztype" : "role")}
                className="text-xs text-ink-muted mb-3 hover:underline"
              >
                ← Back
              </button>
              <p className="font-display text-lg text-ink mb-1">
                {role === "talent"
                  ? "Create your talent account"
                  : `Register your ${bizType === "startup" ? "startup" : "business"}`}{" "}
                ✦
              </p>
              <p className="text-xs text-ink-muted mb-5">
                Quick demo signup — you can edit later.
              </p>

              {role === "talent" && (
                <div className="flex justify-center mb-4">
                  <label className="relative cursor-pointer">
                    <div className="size-20 rounded-full bg-sand border-2 border-dashed border-sand-dark grid place-items-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="size-6 text-ink-muted" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImage}
                    />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-clay font-semibold whitespace-nowrap">
                      add photo
                    </span>
                  </label>
                </div>
              )}

              {role === "business" && (
                <input
                  className="w-full bg-sand/60 border border-sand-dark rounded-xl px-4 py-2.5 text-sm mb-2 outline-none focus:border-clay"
                  type="text"
                  placeholder="Business name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              )}
              <input
                className="w-full bg-sand/60 border border-sand-dark rounded-xl px-4 py-2.5 text-sm mb-2 outline-none focus:border-clay"
                type="text"
                placeholder={role === "business" ? "Contact person" : "Full name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full bg-sand/60 border border-sand-dark rounded-xl px-4 py-2.5 text-sm mb-2 outline-none focus:border-clay"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {role === "talent" && (
                <input
                  className="w-full bg-sand/60 border border-sand-dark rounded-xl px-4 py-2.5 text-sm mb-2 outline-none focus:border-clay"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              )}

              <PhonePrefix label="Phone" value={phone} onChange={setPhone} />
              {role === "business" && bizType === "professional" && (
                <PhonePrefix label="Office no." value={officeNumber} onChange={setOfficeNumber} />
              )}
              {role === "business" && <AddressPicker value={address} onChange={setAddress} />}

              <p className="text-[11px] font-semibold tracking-widest uppercase text-sage mt-2 mb-2">
                {role === "talent" ? "Pick your skill areas (multi)" : "Pick your categories (multi)"}
              </p>
              <div className="grid grid-cols-3 gap-2 mb-1">
                {(Object.keys(NICHES) as Niche[]).map((k) => {
                  const active =
                    role === "talent" ? skills.includes(k) : categories.includes(k);
                  return (
                    <button
                      type="button"
                      key={k}
                      onClick={() => (role === "talent" ? toggleSkill(k) : toggleCategory(k))}
                      className={`p-2 rounded-xl text-center transition-all ${
                        active
                          ? "bg-clay text-paper"
                          : "bg-sand text-ink-muted hover:bg-clay-soft"
                      }`}
                    >
                      <div className="text-lg">{NICHES[k].emoji}</div>
                      <div className="text-[10px] font-semibold leading-tight mt-0.5">
                        {NICHES[k].label}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-ink-muted mb-4 pl-1">
                You can edit these anytime in your profile.
              </p>

              <button
                type="submit"
                className="w-full bg-clay text-paper font-semibold py-3 rounded-full hover:bg-clay/90"
              >
                {role === "talent" ? "Start Journey →" : "Register →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function PhonePrefix({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-2">
      <div className="flex items-center bg-sand/60 border border-sand-dark rounded-xl overflow-hidden focus-within:border-clay">
        <span className="pl-3 pr-2 text-sm text-ink-muted font-semibold border-r border-sand-dark">
          +673
        </span>
        <input
          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
          type="tel"
          inputMode="numeric"
          placeholder={`${label} number`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function AddressPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ADDRESS_SUGGESTIONS.slice(0, 5);
    return ADDRESS_SUGGESTIONS.filter((a) => a.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  return (
    <div className="mb-3 relative">
      <div className="relative">
        <Search className="size-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          className="w-full bg-sand/60 border border-sand-dark rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-clay"
          type="text"
          placeholder="Search your address or area…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
      </div>
      {open && matches.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-paper border border-sand-dark rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {matches.map((m) => (
            <button
              type="button"
              key={m}
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery(m);
                onChange(m);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-clay-soft flex items-start gap-2 border-b border-sand-dark/40 last:border-0"
            >
              <MapPin className="size-3.5 text-clay shrink-0 mt-0.5" />
              <span className="text-ink">{m}</span>
            </button>
          ))}
        </div>
      )}
      <p className="text-[10px] text-ink-muted mt-1 pl-1">Pick from suggestions — like Temu address search.</p>
    </div>
  );
}
