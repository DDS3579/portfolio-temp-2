import { FILL, type Maybe } from "./fill";

export interface Entry {
  /** Short mono tag: "Build", "Design", "Internship", "Founder"... */
  kind: string;
  role: string;
  org: Maybe;
  /** Label beside this stop on the rail (keep it under ~16 characters). */
  short: string;
  /** e.g. "2024 to present". [FILL] until supplied. */
  dates: Maybe;
  duration: Maybe;
  description: Maybe;
  /** Real numbers only. */
  figures?: { value: string; label: string }[];
  stack?: string[];
}

export const journeyCopy = { marker: "Region: Journey", title: "Journey" };

/**
 * Chronological order is a best guess: put the entries in the order they happened and add dates.
 * Rail dot i docks to JOURNEY_NODES[i] (content/constellation.ts), which must be at least as long.
 */
export const entries: Entry[] = [
  {
    kind: "Build",
    role: "Robotics and electronics",
    org: FILL,
    short: "Robotics",
    dates: FILL,
    duration: FILL,
    description: "More than ten robotics projects, built hands-on at medium level.",
    figures: [{ value: "10+", label: "robotics projects" }],
    stack: ["Robotics", "Electronics"],
  },
  {
    kind: "Design",
    role: "Web designer",
    org: FILL,
    short: "Web design",
    dates: "2024 to present",
    duration: FILL,
    description: "Designing websites since 2024.",
  },
  {
    kind: "Internship",
    role: "Design intern",
    org: "Cozmos & Co.",
    short: "Cozmos & Co.",
    dates: FILL,
    duration: FILL,
    description: FILL,
  },
  {
    kind: "Internship",
    role: "Next.js developer intern",
    org: "MeroSEO",
    short: "MeroSEO",
    dates: FILL,
    duration: FILL,
    description: FILL,
    stack: ["Next.js"],
  },
  {
    kind: "Founder",
    role: "Founder",
    org: "Digira",
    short: "Digira",
    dates: FILL,
    duration: FILL,
    description: "Founded Digira as an umbrella for a digital agency, esports tournaments and education.",
  },
  {
    kind: "Founder",
    role: "Digiragency, Esports, Education",
    org: "Digira",
    short: "Three branches",
    dates: FILL,
    duration: FILL,
    description: "Digiragency builds web products and AI agents. Digira Esports runs Mobile Legends: Bang Bang tournaments in Nepal.",
    figures: [
      { value: "3", label: "branches" },
      { value: "16", label: "teams in Esports Season 1.0" },
    ],
    stack: ["Next.js", "FastAPI", "n8n", "LangGraph", "Claude API"],
  },
  {
    kind: "Leadership",
    role: "President",
    org: "NSS Clubs",
    short: "NSS Clubs",
    dates: FILL,
    duration: FILL,
    description: "Leads the clubs and runs their events and Tech Fest.",
    figures: [{ value: "56+", label: "members" }],
  },
  {
    kind: "Build",
    role: "Electronics STEM projects",
    org: "Kathmandu",
    short: "STEM projects",
    dates: FILL,
    duration: FILL,
    description: "Building electronics-based STEM projects at high school level in Kathmandu.",
    stack: ["Electronics", "STEM"],
  },
  {
    kind: "Lab",
    role: "Lab projects",
    org: "Personal R&D",
    short: "Lab",
    dates: FILL,
    duration: FILL,
    description: "KrishiSaathi, NeuroSync and Cognitive Mirror: agriculture, neuroplasticity and personal AI.",
    stack: ["ESP32", "IoT", "Next.js"],
  },
];