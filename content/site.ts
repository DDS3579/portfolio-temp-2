import { FILL, type Maybe } from "./fill";

// NEXT_PUBLIC_* must be referenced literally so Next can inline them at build time.
const env = {
  github: process.env.NEXT_PUBLIC_GITHUB_URL,
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
  x: process.env.NEXT_PUBLIC_X_URL,
  email: process.env.NEXT_PUBLIC_EMAIL,
};
const fromEnv = (v: string | undefined): Maybe => (v && v.trim() ? v.trim() : FILL);

export const site = {
  name: "Divya Darsheel Sharma",
  short: "DDS",
  role: "Founder & Full Stack Developer",
  tagline: "Founder by ambition, developer by craft, designer by eye.",
  url: "https://divyadsharma.com.np",
  title: "Divya Darsheel Sharma | Founder & Full Stack Developer",
  description:
    "Divya Darsheel Sharma is a founder and full stack developer in Kathmandu, building products, systems and businesses under Digira.",
  location: "Kathmandu, Nepal",
  coordinates: { label: "Kathmandu", lat: "27.7172° N", lng: "85.3240° E" },
  links: {
    github: fromEnv(env.github),
    linkedin: fromEnv(env.linkedin),
    x: fromEnv(env.x),
    email: fromEnv(env.email),
  },
  form: {
    endpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
    web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
  },
  nav: [
    { id: "work", label: "Work" },
    { id: "capabilities", label: "Capabilities" },
    { id: "journey", label: "Journey" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    label: "Divya Darsheel Sharma",    // The first word of each line is the role (set heavy); the rest of the line is the qualifier (set light).
    lines: ["Founder by ambition,", "developer by craft,", "designer by eye"],
    support:
      "Crafting products, systems, and digital experiences from first idea to scalable reality.",
    ctaPrimary: "View Work",
    ctaSecondary: "Start a Project",
    proof: ["Digira: 3 branches", "NSS Clubs: 56+ members", "Kathmandu, Nepal", "Open to projects"],
  },
  contact: {
    heading: "Let's build something exceptional.",
    text: "Open to collaborations, product ideas, and ambitious projects.",
    projectTypes: ["Website", "Web app", "AI agent or automation", "Esports or event", "Something else"],
  },
} as const;
