import type { Niche } from "./store";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  niche: Niche;
  budget: string;
  duration: string;
  urgent: boolean;
  area: string;
  description: string;
  when?: string;
}

export interface Talent {
  id: string;
  name: string;
  niche: Niche;
  skill: string;
  skills: string[];
  area: string;
  rating: number;
  gigs: number;
  rate: string;
  avatar: string;
  bio: string;
  available: string;
  verified: boolean;
  points: number;
  streak: number;
  badges: string[];
}

export interface Org {
  id: string;
  name: string;
  niche: Niche;
  area: string;
  description: string;
  avatar: string;
  members: number;
  trusted: boolean;
  rating: number;
}

export interface FeedPost {
  id: string;
  author: string;
  authorRole: "talent" | "business";
  niche: Niche;
  avatar: string;
  cover?: string;
  ago: string;
  body: string;
  likes: number;
  comments: number;
  tags: string[];
}

export interface ChatThread {
  id: string;
  name: string;
  role: "talent" | "business";
  avatar: string;
  lastMessage: string;
  ago: string;
  unread: number;
  niche: Niche;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  from: "me" | "them";
  body: string;
  time: string;
  attachment?: { name: string; kind: "image" | "file"; url?: string };
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  niche: Niche;
  points: number;
  avatar: string;
}

const a = (seed: number) => `https://i.pravatar.cc/200?img=${(seed % 70) + 1}`;

// ────────────────────────────────────────────────────────────
// Talents
// ────────────────────────────────────────────────────────────
export const TALENTS: Talent[] = [
  {
    id: "t1",
    name: "Afiqah Rahman",
    niche: "creative",
    skill: "Graphic Design · Figma · Illustration",
    skills: ["Graphic Design", "Figma", "Illustration"],
    area: "Gadong",
    rating: 4.9,
    gigs: 12,
    rate: "B$12/hr",
    avatar: a(20),
    bio: "Creative designer with 3 years experience working with local cafes & boutiques.",
    available: "Weekends",
    verified: true,
    points: 3120,
    streak: 15,
    badges: ["Bronze Achievement"],
  },
  {
    id: "t2",
    name: "Hafiz Rosli",
    niche: "tech",
    skill: "React · Python · UI/UX",
    skills: ["React", "Python", "UI/UX"],
    area: "Kiulap",
    rating: 4.8,
    gigs: 8,
    rate: "B$15/hr",
    avatar: a(12),
    bio: "Full-stack developer passionate about clean, useful web apps for SMEs.",
    available: "Mon–Fri evenings",
    verified: true,
    points: 2840,
    streak: 8,
    badges: [],
  },
  {
    id: "t3",
    name: "Sarah Lim",
    niche: "fnb",
    skill: "Marketing · SEO · Content writing",
    skills: ["Marketing", "SEO", "Content"],
    area: "Berakas",
    rating: 4.7,
    gigs: 6,
    rate: "B$20/hr",
    avatar: a(33),
    bio: "Marketing specialist helping local businesses grow online presence.",
    available: "Daily",
    verified: true,
    points: 2590,
    streak: 5,
    badges: [],
  },
  {
    id: "t4",
    name: "Amirah Zulkarnain",
    niche: "creative",
    skill: "Wedding photography",
    skills: ["Photography", "Editing"],
    area: "BSB",
    rating: 4.6,
    gigs: 9,
    rate: "B$200/event",
    avatar: a(9),
    bio: "Candid storytelling for intimate weddings & engagements.",
    available: "By booking",
    verified: false,
    points: 2100,
    streak: 3,
    badges: [],
  },
  {
    id: "t5",
    name: "Ryzal Aman",
    niche: "tech",
    skill: "IT support · Networking",
    skills: ["IT Support", "Networking"],
    area: "Jerudong",
    rating: 4.7,
    gigs: 14,
    rate: "B$18/hr",
    avatar: a(14),
    bio: "On-site IT troubleshooting for small offices.",
    available: "Weekends",
    verified: true,
    points: 1950,
    streak: 6,
    badges: [],
  },
  {
    id: "t6",
    name: "Fatin Suhaili",
    niche: "creative",
    skill: "Pastry chef · Cake design",
    skills: ["Pastry", "Cake Design"],
    area: "Sengkurong",
    rating: 4.9,
    gigs: 22,
    rate: "B$15/hr",
    avatar: a(45),
    bio: "Custom celebration cakes & pastry for events.",
    available: "Weekends",
    verified: true,
    points: 1780,
    streak: 4,
    badges: [],
  },
];

// ────────────────────────────────────────────────────────────
// Businesses / Organisations
// ────────────────────────────────────────────────────────────
export const ORGS: Org[] = [
  {
    id: "o1",
    name: "Rasa Bistro",
    niche: "creative",
    area: "Kiulap",
    description: "Modern cafe serving fusion cuisine.",
    avatar: a(50),
    members: 12,
    trusted: true,
    rating: 4.8,
  },
  {
    id: "o2",
    name: "PixelCraft Studio",
    niche: "tech",
    area: "Gadong",
    description: "Digital agency specialising in web design.",
    avatar: a(55),
    members: 8,
    trusted: true,
    rating: 4.9,
  },
  {
    id: "o3",
    name: "Nusantara Threads",
    niche: "creative",
    area: "Serusop",
    description: "Local fashion brand showcasing traditional textiles.",
    avatar: a(60),
    members: 6,
    trusted: true,
    rating: 4.7,
  },
  {
    id: "o4",
    name: "Borneo Ledger Co.",
    niche: "fnb",
    area: "BSB",
    description: "Accounting & admin services for SMEs.",
    avatar: a(40),
    members: 5,
    trusted: false,
    rating: 4.5,
  },
];

// ────────────────────────────────────────────────────────────
// Jobs
// ────────────────────────────────────────────────────────────
export const JOBS: Job[] = [
  {
    id: "j1",
    title: "Graphic Designer",
    company: "Rasa Bistro",
    companyId: "o1",
    niche: "creative",
    budget: "B$500",
    duration: "14 days",
    urgent: true,
    area: "Kiulap",
    when: "Starts this week",
    description: "Logo and branding refresh for our cafe relaunch.",
  },
  {
    id: "j2",
    title: "Pastry Chef (Part-time)",
    company: "Rasa Bistro",
    companyId: "o1",
    niche: "creative",
    budget: "B$8–12/hr",
    duration: "30 days",
    urgent: true,
    area: "Kiulap",
    when: "Morning shifts",
    description: "Help our morning pastry line — viennoiserie experience preferred.",
  },
  {
    id: "j3",
    title: "Frontend Developer",
    company: "PixelCraft Studio",
    companyId: "o2",
    niche: "tech",
    budget: "B$15–20/hr",
    duration: "21 days",
    urgent: false,
    area: "Gadong",
    when: "Flexible",
    description: "React developer for client dashboard project.",
  },
  {
    id: "j4",
    title: "Social Media Manager",
    company: "Nusantara Threads",
    companyId: "o3",
    niche: "fnb",
    budget: "B$400/mo",
    duration: "60 days",
    urgent: false,
    area: "Serusop",
    when: "Ongoing",
    description: "Manage Instagram & TikTok content for our seasonal launch.",
  },
  {
    id: "j5",
    title: "Event Photographer",
    company: "PixelCraft Studio",
    companyId: "o2",
    niche: "creative",
    budget: "B$250",
    duration: "1 day",
    urgent: true,
    area: "Gadong",
    when: "This Saturday",
    description: "Corporate event photography — full day coverage.",
  },
  {
    id: "j6",
    title: "Bookkeeper",
    company: "Borneo Ledger Co.",
    companyId: "o4",
    niche: "fnb",
    budget: "B$300/mo",
    duration: "Ongoing",
    urgent: false,
    area: "BSB",
    when: "Remote ok",
    description: "Monthly book-keeping for small retail client.",
  },
];

// Convenience: urgent posts for the home banner / discover.
export const URGENT_POSTS = JOBS.filter((j) => j.urgent);

// ────────────────────────────────────────────────────────────
// Community feed
// ────────────────────────────────────────────────────────────
export const FEED: FeedPost[] = [
  {
    id: "f1",
    author: "Afiqah Rahman",
    authorRole: "talent",
    niche: "creative",
    avatar: a(20),
    cover: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
    ago: "2h",
    body: "Just finished a branding project for a local cafe! Open for freelance work ✨",
    likes: 48,
    comments: 8,
    tags: ["#branding", "#freelance"],
  },
  {
    id: "f2",
    author: "Hafiz Rosli",
    authorRole: "talent",
    niche: "tech",
    avatar: a(12),
    ago: "5h",
    body: "Looking for a frontend mentor! Anyone available for a quick chat?",
    likes: 23,
    comments: 5,
    tags: ["#mentor", "#frontend"],
  },
  {
    id: "f3",
    author: "Rasa Bistro",
    authorRole: "business",
    niche: "creative",
    avatar: a(50),
    ago: "1d",
    body: "We're hiring! Pastry chef + graphic designer. DM if interested!",
    likes: 56,
    comments: 12,
    tags: ["#hiring", "#parttime"],
  },
];

// ────────────────────────────────────────────────────────────
// Chats
// ────────────────────────────────────────────────────────────
export const THREADS: ChatThread[] = [
  {
    id: "c1",
    name: "Rasa Bistro",
    role: "business",
    avatar: a(50),
    lastMessage: "Sounds great — when can you start?",
    ago: "10m",
    unread: 2,
    niche: "creative",
  },
  {
    id: "c2",
    name: "Hafiz Rosli",
    role: "talent",
    avatar: a(12),
    lastMessage: "I've sent over my portfolio 📎",
    ago: "1h",
    unread: 0,
    niche: "tech",
  },
  {
    id: "c3",
    name: "Sarah Lim",
    role: "talent",
    avatar: a(33),
    lastMessage: "Confirmed for Saturday morning.",
    ago: "Yesterday",
    unread: 0,
    niche: "fnb",
  },
];

export const MESSAGES: Record<string, ChatMessage[]> = {
  c1: [
    { id: "m1", threadId: "c1", from: "them", body: "Hi! Saw your design work — very nice ✨", time: "10:02" },
    { id: "m2", threadId: "c1", from: "me", body: "Thanks! Happy to chat about your branding project.", time: "10:05" },
    { id: "m3", threadId: "c1", from: "them", body: "Sounds great — when can you start?", time: "10:08" },
  ],
  c2: [
    { id: "m4", threadId: "c2", from: "them", body: "I've sent over my portfolio 📎", time: "9:30", attachment: { name: "portfolio.pdf", kind: "file" } },
  ],
  c3: [
    { id: "m5", threadId: "c3", from: "me", body: "Are you free Saturday morning?", time: "Yesterday" },
    { id: "m6", threadId: "c3", from: "them", body: "Confirmed for Saturday morning.", time: "Yesterday" },
  ],
};

// ────────────────────────────────────────────────────────────
// Leaderboard
// ────────────────────────────────────────────────────────────
export const LEADERBOARD: Record<"all" | Niche, LeaderboardEntry[]> = {
  all: [
    { rank: 1, name: "Afiqah Rahman", niche: "creative", points: 3120, avatar: a(20) },
    { rank: 2, name: "Hafiz Rosli", niche: "tech", points: 2840, avatar: a(12) },
    { rank: 3, name: "Sarah Lim", niche: "fnb", points: 2590, avatar: a(33) },
    { rank: 4, name: "Amirah Zulkarnain", niche: "creative", points: 2100, avatar: a(9) },
    { rank: 5, name: "Ryzal Aman", niche: "tech", points: 1950, avatar: a(14) },
    { rank: 6, name: "Fatin Suhaili", niche: "creative", points: 1780, avatar: a(45) },
  ],
  tech: [
    { rank: 1, name: "Hafiz Rosli", niche: "tech", points: 2840, avatar: a(12) },
    { rank: 2, name: "Ryzal Aman", niche: "tech", points: 1950, avatar: a(14) },
    { rank: 3, name: "Aqil Mansor", niche: "tech", points: 1430, avatar: a(7) },
  ],
  creative: [
    { rank: 1, name: "Afiqah Rahman", niche: "creative", points: 3120, avatar: a(20) },
    { rank: 2, name: "Amirah Zulkarnain", niche: "creative", points: 2100, avatar: a(9) },
    { rank: 3, name: "Fatin Suhaili", niche: "creative", points: 1780, avatar: a(45) },
  ],
  fnb: [
    { rank: 1, name: "Sarah Lim", niche: "fnb", points: 2590, avatar: a(33) },
    { rank: 2, name: "Hafiz Razak", niche: "fnb", points: 1320, avatar: a(18) },
    { rank: 3, name: "Khalid Bakar", niche: "fnb", points: 980, avatar: a(22) },
  ],
};

// ────────────────────────────────────────────────────────────
// Notifications
// ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: "n1", title: "Welcome to SparkHub!", text: "Complete your profile to get started.", time: "Just now" },
  { id: "n2", title: "New urgent job", text: "Rasa Bistro needs a Graphic Designer urgently.", time: "2h ago" },
  { id: "n3", title: "Application viewed", text: "PixelCraft Studio viewed your application.", time: "1d ago" },
];
