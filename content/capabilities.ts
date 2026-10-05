export interface Discipline {
  id: string;
  name: string;
  summary: string;
  /** Real numbers only. Rendered large under the summary. */
  figures?: { value: string; label: string }[];
  /** Mono line of tools. Hidden when empty. */
  stack: string[];
  topics: string[];
}

export const disciplines: Discipline[] = [
  {
    id: "design",
    name: "Web Design",
    summary: "Designing websites since 2024: layout, type and motion decided together, from the first sketch to the finished interaction.",
    figures: [{ value: "2024", label: "designing websites since" }],
    stack: [],
    topics: ["Design internship at Cozmos & Co.", "Interface and visual design", "Building from zero to launch"],
  },
  {
    id: "frontend",
    name: "Frontend Engineering",
    summary: "Interfaces that feel considered: fast, accessible, and animated with intent.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    topics: ["Animation and interaction design", "Premium web development", "Next.js development internship at MeroSEO"],
  },
  {
    id: "backend",
    name: "Backend & Agentic Systems",
    summary: "APIs, automations and AI agents that do real work, local-first where it counts.",
    stack: ["FastAPI", "n8n", "Ollama", "LangGraph", "Mastra", "Claude API", "ESP32/IoT"],
    topics: ["Architecture and scaling", "AI agents and automation", "IoT and sensor pipelines"],
  },
  {
    id: "iot",
    name: "IoT & Robotics",
    summary: "Hands-on electronics: more than ten robotics projects built, and STEM projects at high school level in Kathmandu.",
    figures: [{ value: "10+", label: "robotics projects, medium level" }],
    stack: ["ESP32", "IoT", "Electronics"],
    topics: ["STEM projects at high school level in Kathmandu", "Sensor systems on ESP32, as in KrishiSaathi", "Where AI meets IoT"],
  },
  {
    id: "product",
    name: "Product & Business",
    summary: "From the first idea to the pricing, payments and operations that keep it running.",
    stack: ["Pricing", "Client flows", "Finance"],
    topics: ["MVP development", "Building from zero to launch", "Running an agency and an esports league"],
  },
];

export const capabilitiesCopy = {
  marker: "Region: Capabilities",
  title: "Capabilities",
};