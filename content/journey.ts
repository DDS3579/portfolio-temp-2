import { FILL, type Maybe } from "./fill";

export interface Entry {
  role: string;
  org: string;
  /** e.g. "2023 to 2024". [FILL] until supplied. */
  dates: Maybe;
  duration: Maybe;
  description: Maybe;
}

export const journeyCopy = { marker: "Region: Journey", title: "Journey" };

export const entries: Entry[] = [
  { role: "Early projects", org: "Self-directed", dates: FILL, duration: FILL, description: FILL },
  { role: "Design intern", org: "Cozmos & Co.", dates: FILL, duration: FILL, description: FILL },
  { role: "Next.js developer intern", org: "MeroSEO", dates: FILL, duration: FILL, description: FILL },
  {
    role: "Founder",
    org: "Digira",
    dates: FILL,
    duration: FILL,
    description: "Founded Digira as an umbrella for a digital agency, esports tournaments and education.",
  },
  {
    role: "Digiragency, Esports, Education",
    org: "Digira",
    dates: FILL,
    duration: FILL,
    description: "Digiragency builds web products and AI agents. Digira Esports runs Mobile Legends: Bang Bang tournaments in Nepal.",
  },
  {
    role: "President",
    org: "NSS Clubs",
    dates: FILL,
    duration: FILL,
    description: "Leads 56+ members, running the clubs' events and Tech Fest.",
  },
  {
    role: "Lab projects",
    org: "Personal R&D",
    dates: FILL,
    duration: FILL,
    description: "KrishiSaathi, NeuroSync and Cognitive Mirror: agriculture, neuroplasticity and personal AI.",
  },
];
