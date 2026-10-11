import { FILL, type Maybe } from "./fill";

export interface Chapter {
  id: "origin" | "build" | "scale" | "conglomerate";
  region: string;
  numeral: string;
  heading: string;
  /** Body copy. [FILL] when there is no real fact to state yet. */
  body: Maybe;
}

export const chapters: Chapter[] = [
  {
    id: "origin",
    region: "Region: Origin",
    numeral: "1",
    heading: "Every empire starts with a first line of code.",
    body: FILL, // first things built
  },
  {
    id: "build",
    region: "Region: Build",
    numeral: "2",
    heading: "Design. Engineer. Ship.",
    body: "A design internship at Cozmos & Co., a Next.js development internship at MeroSEO, and the backend and AI agent work behind Digiragency.",
  },
  {
    id: "scale",
    region: "Region: Scale",
    numeral: "3",
    heading: "From product to business.",
    body: "Digira grew from one idea into three branches: a digital agency, esports tournaments in Nepal, and education.",
  },
  {
    id: "conglomerate",
    region: "Region: Conglomerate",
    numeral: "4",
    heading: "Ambition becomes infrastructure.",
    body: "The Digira umbrella, NSS Clubs, and a Lab of experiments in agriculture, neuroscience and personal AI.",
  },
];

export const chapterRail = ["Origin", "Build", "Scale", "Conglomerate"] as const;
