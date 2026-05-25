import { HERO_PORTRAIT_URL } from "./portfolio.js";
import {
  site,
  hero,
  statement,
  mission,
  stats,
  social,
  contactSection,
  footer,
  navLinks,
  skillsSection,
  projectsSection,
  projects,
  experienceSection,
  experience,
  sections,
  blogs,
} from "./portfolio.js";

export function getStaticPortfolio() {
  return {
    site,
    hero: { ...hero, image: hero.image || HERO_PORTRAIT_URL },
    statement,
    mission,
    stats,
    social,
    contactSection,
    footer,
    navLinks,
    skillsSection,
    projectsSection,
    projects: projects.map((p, i) => ({ ...p, id: p.id || `proj-${i}`, archived: p.archived ?? false })),
    experienceSection,
    experience: experience.map((e, i) => ({ ...e, id: e.id || `exp-${i}`, archived: e.archived ?? false })),
    sections,
    blogs: blogs.map((b, i) => ({ ...b, id: b.id || `blog-${i}`, archived: b.archived ?? false })),
  };
}

function asArray(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}

function validateSkills(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return false;
  return skills.every(
    (cat) =>
      cat &&
      typeof cat === "object" &&
      typeof cat.name === "string" &&
      Array.isArray(cat.items)
  );
}

/** Ensures API/CMS data always has the shape the public site expects, taking unmanaged data strictly from the static fallback. */
export function normalizePortfolio(raw) {
  const fallback = getStaticPortfolio();
  if (!raw || typeof raw !== "object" || Object.keys(raw).length === 0) {
    return fallback;
  }

  const rawSkills = raw.skills || raw.skillsSection?.categories;
  const skillsToUse = validateSkills(rawSkills) ? rawSkills : fallback.skillsSection.categories;

  return {
    ...fallback,
    
    // Partially managed: site (SettingsPage)
    site: {
      ...fallback.site,
      email: raw.site?.email ?? fallback.site.email,
      location: raw.site?.location ?? fallback.site.location,
      resumeUrl: raw.site?.resumeUrl ?? fallback.site.resumeUrl,
    },

    // Partially managed: hero (SettingsPage)
    hero: {
      ...fallback.hero,
      image: raw.hero?.image?.trim() ? raw.hero.image : fallback.hero.image,
    },

    // Partially managed: mission (AboutPage)
    mission: {
      ...fallback.mission,
      body: raw.mission?.body ?? fallback.mission.body,
      tags: asArray(raw.mission?.tags, fallback.mission.tags),
    },

    // Fully managed sections
    stats: asArray(raw.stats, fallback.stats),
    social: asArray(raw.social, fallback.social),
    projects: asArray(raw.projects, fallback.projects),
    experience: asArray(raw.experience, fallback.experience),
    blogs: asArray(raw.blogs, fallback.blogs),
    
    // Partially managed: skillsSection (SkillsPage manages categories via 'skills' array)
    skillsSection: {
      ...fallback.skillsSection,
      categories: skillsToUse,
    },
    // Add raw 'skills' so Admin can read/write it directly
    skills: skillsToUse,

    // Fully unmanaged sections (always take from static fallback)
    statement: fallback.statement,
    contactSection: fallback.contactSection,
    footer: fallback.footer,
    navLinks: fallback.navLinks,
    projectsSection: fallback.projectsSection,
    experienceSection: fallback.experienceSection,
    sections: fallback.sections,
  };
}

/**
 * Portfolio content — edit this file to update the site.
 */

/** Optional photo: place `hero-portrait.jpg` in the `public/` folder */
export const HERO_PORTRAIT_URL = "/hero-portrait.jpg";

export const site = {
  name: "Shubham Jani",
  title: "Full Stack Developer",
  initials: "SJ",
  domain: "shubham.dev",
  location: "Ahmedabad, India",
  email: "shubhamjani1731@gmail.com",
  resumeUrl: "/Shubham Jani Resume.pdf",
  availability: "Open for internships, freelance & collaborations",
};

export const hero = {
  availabilityBadge: "AVAILABLE FOR NEW WORK",
  firstName: "Shubham",
  lastName: "Jani.",
  roles: ["Python & Flask Engineer", "Full Stack Developer", "FastAPI & SvelteKit Builder"],
  bio:
    "M.Sc. Computer Applications & IT at Gujarat University. I build real-world products with Python, Flask, FastAPI, and SvelteKit — from construction platforms to voice AI assistants.",
  techTag: "Python • Flask • FastAPI",
  shippedLabel: "shipped 4+",
  statusLabel: "STATUS",
  statusText: "Currently building real-world products",
  serverStatus: "Spinning up Servers",
  image: HERO_PORTRAIT_URL,
  imageAlt: "Shubham Jani portrait",
};

export const statement = {
  title: { before: "A student builder with a ", highlight: "product mind.", after: "" },
  subtitle:
    "I love turning real-world problems into elegant, usable software — one focused project at a time.",
};

export const mission = {
  eyebrow: "MISSION",
  title: {
    before: "I build digital products that feel ",
    highlight: "obvious to use",
    after: " — fast, practical, and rooted in solving genuine problems.",
  },
  body:
    "Computer Applications student at Gujarat University. I ship full-stack apps with Python, Flask, FastAPI, and SvelteKit — including BuildTrack (construction management) and Sarthi (voice AI assistant).",
  tags: [
    "FULL STACK",
    "PYTHON / FLASK",
    "FASTAPI",
    "SVELTEKIT",
    "SQL / SQLITE",
    "OPENCV / AI",
  ],
};

export const stats = [
  { value: "4+", label: "PROJECTS SHIPPED", color: "#7dd3fc" },
  { value: "12+", label: "TECH STACKS MASTERED", color: "#60a5fa" },
  { value: "850+", label: "GITHUB COMMITS", color: "#22d3ee" },
  { value: "2,000+", label: "COFFEE/CODE HOURS", color: "#c4b5fd" },
];

export const social = [
  { label: "GitHub", href: "https://github.com/shubham-Jani17", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shubhamjani", icon: "linkedin" },
  { label: "Email", href: "mailto:shubhamjani1731@gmail.com", icon: "mail" },
];

export const contactSection = {
  eyebrow: "GET IN TOUCH",
  title: { before: "Let's build ", highlight: "something", after: " great." },
  subtitle:
    "Whether you have a brief, an idea, or just want to chat about craft — my inbox is open.",
  statusBadge: "OPEN FOR INTERNSHIPS, FREELANCE & COLLABORATIONS",
  infoTitle: "Reply within 24 hours.",
  infoBody:
    "I'm currently looking for full-stack internships, freelance projects and meaningful collaborations — especially around Python, FastAPI and applied AI.",
  responseTime: "avg. response time • ~6 hours",
  placeholders: {
    name: "Jane Doe",
    email: "jane@company.com",
    message: "Tell me about your project, timelines, and what success looks like…",
  },
};

export const footer = {
  tagline:
    "Engineered, designed and shipped with obsessive attention to detail. Built with React, Tailwind and Framer Motion.",
  navigate: [
    [
      { id: "about", label: "About" },
      { id: "projects", label: "Projects" },
      { id: "blog", label: "Blog" },
    ],
    [
      { id: "skills", label: "Skills" },
      { id: "experience", label: "Experience" },
      { id: "contact", label: "Contact" },
    ],
  ],
  designedIn: "Designed in Figma",
  shippedFrom: "Ahmedabad",
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export const skillsSection = {
  eyebrow: "SKILLS",
  title: { before: "Tools I bend to ", highlight: "my", after: " will." },
  subtitle: "A focused stack chosen for performance, longevity and developer happiness.",
  orbit: [
    "JavaScript",
    "SvelteKit",
    "Bootstrap",
    "SQLite",
    "Git",
    "FastAPI",
    "Flask",
    "OpenCV",
    "Python",
    "MySQL",
    "Tailwind",
    "SQLAlchemy",
  ],
  categories: [
    {
      name: "Frontend",
      items: [
        { name: "HTML & CSS", level: 95 },
        { name: "JavaScript", level: 88 },
        { name: "Bootstrap", level: 90 },
        { name: "Tailwind", level: 85 },
        { name: "SvelteKit", level: 78 },
      ],
    },
    {
      name: "Backend & Data",
      items: [
        { name: "Python", level: 92 },
        { name: "Flask", level: 90 },
        { name: "FastAPI", level: 85 },
        { name: "SQL / MySQL", level: 86 },
        { name: "SQLAlchemy", level: 82 },
      ],
    },
    {
      name: "AI & IoT",
      items: [
        { name: "OpenCV", level: 82 },
        { name: "Face Recognition", level: 80 },
        { name: "NLP / Voice AI", level: 72 },
        { name: "IoT Prototyping", level: 70 },
        { name: "Computer Vision", level: 78 },
      ],
    },
    {
      name: "Tools & Concepts",
      items: [
        { name: "Git & GitHub", level: 92 },
        { name: "VS Code", level: 95 },
        { name: "SQLite", level: 88 },
        { name: "EmailJS / FormSubmit", level: 84 },
        { name: "DBMS / OOP", level: 90 },
      ],
    },
  ],
};

export const projectsSection = {
  eyebrow: "SELECTED WORK",
  title: { before: "Projects I'm ", highlight: "proud", after: " of." },
  subtitle: "A small selection of recent products — each one shipped with obsessive care.",
};

export const projects = [
  {
    title: "BuildTrack",
    category: "FULL STACK",
    description:
      "Construction management platform for tracking sites, materials, and teams — built with Flask and SQLite for real deployment.",
    image: "",
    tags: ["FLASK", "PYTHON", "SQLITE"],
    liveUrl: "",
    repoUrl: "https://github.com/yourusername/buildtrack",
  },
  {
    title: "Sarthi Voice Assistant AI",
    category: "AI",
    description:
      "Voice-first assistant with NLP pipeline, FastAPI backend, and SvelteKit UI for hands-free task flows.",
    image: "",
    tags: ["SVELTEKIT", "FASTAPI", "PYTHON", "NLP"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/sarthi",
  },
  {
    title: "IoT Smart Monitor",
    category: "IOT",
    description: "Sensor dashboard with real-time readings, alerts, and lightweight edge integration.",
    image: "",
    tags: ["PYTHON", "IOT", "FLASK"],
    liveUrl: "",
    repoUrl: "https://github.com/yourusername/iot-monitor",
  },
];

export const experienceSection = {
  eyebrow: "MY JOURNEY",
  title: {
    before: "A timeline of ",
    craft: "craft",
    mid: " & ",
    growth: "growth",
    after: ".",
  },
  subtitle:
    "Education, projects, and hands-on building — each chapter shaping how I design and ship software.",
};

export const experience = [
  {
    period: "2025 — 2027",
    title: "M.Sc. (CA & IT)",
    subtitle: "K. S. School of Business Management & IT",
    description:
      "Postgraduate focus on advanced computing, databases, and applied software engineering with research-oriented projects.",
    tech: ["FULL STACK", "AI", "DBMS"],
  },
  {
    period: "2023 — 2025",
    title: "Student Builder · Freelance",
    subtitle: "Independent / Client work",
    description:
      "Shipped portfolio and client apps with Python, Flask, FastAPI, and SvelteKit — from APIs to polished UIs.",
    tech: ["PYTHON", "FLASK", "SVELTEKIT"],
  },
  {
    period: "2021 — 2023",
    title: "B.Sc. Computer Applications",
    subtitle: "Gujarat University",
    description:
      "Built foundations in programming, OOP, web fundamentals, and capstone demos with measurable outcomes.",
    tech: ["OOP", "SQL", "WEB"],
  },
  {
    period: "2020 — Present",
    title: "Projects & Open Source",
    subtitle: "Self-directed learning",
    description:
      "BuildTrack, Sarthi Voice AI, and IoT experiments — learning by shipping real-world products end to end.",
    tech: ["FASTAPI", "OPENCV", "IOT"],
  },
];

export const sections = {
  blogs: true,
};

export const blogs = [
  {
    title: "Building BuildTrack from scratch",
    excerpt: "Lessons from shipping a Flask app for construction teams.",
    url: "https://medium.com/@you/post",
    date: "2025-01-15",
  },
];




