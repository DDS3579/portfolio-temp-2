import { FILL, type Maybe } from "./fill";
import type { NodeId } from "./constellation";

export interface Story {
  context: Maybe;
  challenge: Maybe;
  outcome: Maybe;
}
export interface Links {
  live: Maybe;
  github: Maybe;
  caseStudy: Maybe;
}

export interface Branch extends Story {
  slug: "digiragency" | "digira-esports" | "digira-education";
  node: NodeId;
  name: string;
  category: string;
  role: Maybe;
  stack: Maybe<string[]>;
  links: Links;
  /** Optional real screenshot in /public/work/<slug>.webp with its size. Falls back to the generated composition. */
  image: Maybe<{ src: string; width: number; height: number; alt: string }>;
    /** Real numbers only. When present they replace the outcome sentence visually (it stays for screen readers). */
  figures?: { value: string; label: string }[];
}

export const umbrella = {
  name: "Digira",
  line: "One umbrella, three branches: a digital agency, esports tournaments in Nepal, and education.",
};

export const branches: Branch[] = [
  {
    slug: "digiragency",
    node: "agency",
    name: "Digiragency",
    category: "Digital agency",
    role: "Backend, AI agents and finance",
    context: "A digital agency under Digira with a small team covering frontend, marketing and client acquisition.",
    challenge: "Serving Nepal and international clients from one agency, with separate pricing in NPR and USD and payment flows for both.",
    outcome: "Launch roadmap, client-to-payment flows and a service catalog spanning web development and AI agents are in place.",
    stack: ["Next.js", "FastAPI", "TypeScript", "Tailwind", "n8n", "Ollama", "LangGraph", "Mastra", "Claude API"],
    links: { live: FILL, github: FILL, caseStudy: FILL },
    image: FILL,
  },
  {
    slug: "digira-esports",
    node: "esports",
    name: "Digira Esports",
    category: "Esports tournaments",
    role: FILL,
    context: "Online Mobile Legends: Bang Bang tournaments for players across Nepal.",
    challenge: "Growing from a 16-team first season to a 32-team, five-day format with sponsors and two concurrent livestreams.",
    outcome: "Season 1.0 drew 16 teams, over 100k Instagram views and more than 5,000 accounts reached.",
        figures: [
      { value: "16", label: "teams in Season 1.0" },
      { value: "100k+", label: "Instagram views" },
      { value: "5,000+", label: "accounts reached" },
    ],
    stack: FILL,
    links: { live: FILL, github: FILL, caseStudy: FILL },
    image: FILL,
  },
  {
    slug: "digira-education",
    node: "education",
    name: "Digira Education",
    category: "Education",
    role: FILL,
    context: FILL,
    challenge: FILL,
    outcome: FILL,
    stack: FILL,
    links: { live: FILL, github: FILL, caseStudy: FILL },
    image: FILL,
  },
];

export interface Secondary {
  slug: string;
  node?: NodeId;
  name: string;
  role: string;
  line: Maybe;
  links: Links;
}

export const secondary: Secondary[] = [
  {
    slug: "nss-clubs",
    node: "nss",
    name: "NSS Clubs",
    role: "President",
    line: "Leads 56+ members and runs the clubs' events and Tech Fest.",
    links: { live: FILL, github: FILL, caseStudy: FILL },
  },
  {
    slug: "cozmos",
    name: "Cozmos & Co.",
    role: "Design internship",
    line: FILL,
    links: { live: FILL, github: FILL, caseStudy: FILL },
  },
  {
    slug: "meroseo",
    name: "MeroSEO",
    role: "Next.js development internship",
    line: FILL,
    links: { live: FILL, github: FILL, caseStudy: FILL },
  },
];

export interface LabItem {
  slug: string;
  node: NodeId;
  name: string;
  line: string;
  stack: Maybe<string[]>;
  links: Links;
}

export const lab: LabItem[] = [
  {
    slug: "krishisaathi",
    node: "lab-krishi",
    name: "KrishiSaathi",
    line: "Nepali-language agricultural advisory that reads field conditions from ESP32 IoT sensors.",
    stack: ["ESP32", "IoT"],
    links: { live: FILL, github: FILL, caseStudy: FILL },
  },
  {
    slug: "neurosync",
    node: "lab-neurosync",
    name: "NeuroSync",
    line: "A neuroplasticity and habit tracker with a 3D dotted brain that shows daily progress.",
    stack: ["Next.js"],
    links: { live: FILL, github: FILL, caseStudy: FILL },
  },
  {
    slug: "cognitive-mirror",
    node: "lab-mirror",
    name: "Cognitive Mirror",
    line: "A personal AI twin with a cognitive-fidelity research layer, tested on a 50-decision evaluation set.",
    stack: FILL,
    links: { live: FILL, github: FILL, caseStudy: FILL },
  },
];

export const workCopy = {
  marker: "Region: Selected Work",
  title: "Selected Work",
  subtitle: "A few projects that reflect product thinking, engineering, and design execution.",
  labTitle: "Lab / Experiments",
};
