export interface Discipline {
  id: string;
  name: string;
  summary: string;
  stack: string[];
  topics: string[];
}

export const disciplines: Discipline[] = [
  {
    id: "frontend",
    name: "Frontend Engineering",
    summary: "Interfaces that feel considered: fast, accessible, and animated with intent.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    topics: ["Animation and interaction design", "Premium web development", "Building from zero to launch"],
  },
  {
    id: "backend",
    name: "Backend & Agentic Systems",
    summary: "APIs, automations and AI agents that do real work, local-first where it counts.",
    stack: ["FastAPI", "n8n", "Ollama", "LangGraph", "Mastra", "Claude API", "ESP32/IoT"],
    topics: ["Architecture and scaling", "AI agents and automation", "IoT and sensor pipelines"],
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
