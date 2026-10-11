import { FILL, type Maybe } from "./fill";

export const about = {
  marker: "Region: About",
  title: "About",
  lead: "I'm a passionate student, a founder, and the MD of Digira, working as a strategist.",
  body: "I'm a full stack web developer who also works with AI agents and systems, and I help students build IoT projects.",
  roles: ["Student", "Founder", "MD, Digira", "Strategist", "Full stack developer"],
  portrait: FILL as Maybe<{ src: string; width: number; height: number; alt: string }>,
};
