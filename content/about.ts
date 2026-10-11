import { FILL, type Maybe } from "./fill";

export const about = {
  marker: "Region: About",
  title: "About",
  /** Lead statement (large). */
  lead: "I'm a passionate student, a founder, and the MD of Digira, working as a strategist.",
  /** Supporting paragraph. */
  body: "I'm a full stack web developer who also works with AI agents and systems, and I help students build IoT projects.",
  /** Mono line, roles only. */
  roles: ["Student", "Founder", "MD, Digira", "Strategist", "Full stack developer"],
  /** Drop a portrait in /public/about/portrait.webp and fill this in. Until then a monogram frame shows. */
  portrait: FILL as Maybe<{ src: string; width: number; height: number; alt: string }>,
};
