// The constellation state table. One shared set of nodes; every section defines a layout for them.
// Coordinates are normalized viewport units (0..1). `anchor` binds a node to a DOM element
// ([data-node-anchor="..."]) in the live layer; x/y is the fallback and what <ConstellationStatic> uses.

export const NODE_IDS = [
  "root", "agency", "esports", "education", "nss",
  "lab-krishi", "lab-neurosync", "lab-mirror",
  "h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8",
] as const;
export type NodeId = (typeof NODE_IDS)[number];

export const NODE_LABELS: Partial<Record<NodeId, string>> = {
  root: "Digira",
  agency: "Digiragency",
  esports: "Digira Esports",
  education: "Digira Education",
  nss: "NSS Clubs",
  "lab-krishi": "KrishiSaathi",
  "lab-neurosync": "NeuroSync",
  "lab-mirror": "Cognitive Mirror",
};

export type StateName =
  | "hero" | "origin" | "build" | "scale" | "conglomerate" | "work" | "journey" | "rest" | "contact";

/** Order the layer walks through as the page scrolls. */
export const STATE_ORDER: StateName[] = [
  "hero", "origin", "build", "scale", "conglomerate", "work", "journey", "rest", "contact",
];

export interface NodeSpec {
  x: number;
  y: number;
  anchor?: string;
  /** Base brightness 0..1 (dynamic states override). */
  lit?: number;
  /** Alpha 0..1, default 1. */
  a?: number;
  /** Radius multiplier, default 1. */
  r?: number;
    /** Size the node to its DOM anchor (only the hero period uses this). */
  fit?: boolean;
}
export interface EdgeSpec {
  a: NodeId;
  b: NodeId;
  /** Strength multiplier. */
  k?: number;
  /** Ignore node alpha (an edge that grows into empty space). */
  free?: boolean;
  /** Journey scrub: index in the chain; the edge draws with progress. */
  draw?: number;
}
export interface StateSpec {
  nodes: Partial<Record<NodeId, NodeSpec>>;
  edges: EdgeSpec[];
  labelAll?: boolean;
  dynamicLit?: "nearest" | "journey";
  /** Global opacity of the layer in this state. */
  dim?: number;
  pulse?: boolean;
}

/** Journey rail: entry i docks to node JOURNEY_NODES[i]. Must be at least as long as entries. */
export const JOURNEY_NODES: NodeId[] = ["h1", "h2", "h3", "root", "agency", "nss", "lab-krishi"];

const journeyNodes: StateSpec["nodes"] = {};
JOURNEY_NODES.forEach((id, i) => {
  journeyNodes[id] = {
    x: 0.42,
    y: 0.2 + (0.6 * i) / (JOURNEY_NODES.length - 1),
    anchor: `journey-${i}`,
    lit: 0.3,
  };
});
const journeyEdges: EdgeSpec[] = JOURNEY_NODES.slice(1).map((id, i) => ({
  a: JOURNEY_NODES[i]!,
  b: id,
  draw: i,
}));

export const STATES: Record<StateName, StateSpec> = {
  hero: {
        nodes: { root: { x: 0.62, y: 0.38, anchor: "hero-period", lit: 1, fit: true } },
    edges: [],
  },
  origin: {
    nodes: {
      root: { x: 0.2, y: 0.5, lit: 1 },
      h1: { x: 0.36, y: 0.5, a: 0 },
    },
    edges: [{ a: "root", b: "h1", k: 0.55, free: true }],
  },
  build: {
    // A browser-window wireframe: frame, header rule, sidebar rule, and root as the first block.
    nodes: {
      root: { x: 0.3, y: 0.53, lit: 1 },
      h1: { x: 0.07, y: 0.27, lit: 0.25 },
      h2: { x: 0.4, y: 0.27, lit: 0.25 },
      h3: { x: 0.4, y: 0.73, lit: 0.25 },
      h4: { x: 0.07, y: 0.73, lit: 0.25 },
      h5: { x: 0.07, y: 0.37, lit: 0.25 },
      h6: { x: 0.4, y: 0.37, lit: 0.25 },
      h7: { x: 0.19, y: 0.37, lit: 0.25 },
      h8: { x: 0.19, y: 0.73, lit: 0.25 },
    },
    edges: [
      { a: "h1", b: "h2" }, { a: "h2", b: "h3" }, { a: "h3", b: "h4" }, { a: "h4", b: "h1" },
      { a: "h5", b: "h6" }, { a: "h7", b: "h8" },
    ],
  },
  scale: {
    nodes: {
      root: { x: 0.14, y: 0.5, lit: 1 },
      agency: { x: 0.36, y: 0.3, lit: 0.8 },
      esports: { x: 0.38, y: 0.5, lit: 0.8 },
      education: { x: 0.36, y: 0.7, lit: 0.8 },
    },
    edges: [
      { a: "root", b: "agency" }, { a: "root", b: "esports" }, { a: "root", b: "education" },
    ],
  },
  conglomerate: {
    nodes: {
      root: { x: 0.22, y: 0.5, lit: 1, r: 1.25 },
      agency: { x: 0.36, y: 0.32, lit: 0.75 },
      esports: { x: 0.4, y: 0.5, lit: 0.75 },
      education: { x: 0.36, y: 0.68, lit: 0.75 },
      nss: { x: 0.1, y: 0.3, lit: 0.6 },
      "lab-krishi": { x: 0.08, y: 0.66, lit: 0.5 },
      "lab-neurosync": { x: 0.15, y: 0.8, lit: 0.5 },
      "lab-mirror": { x: 0.28, y: 0.84, lit: 0.5 },
    },
    edges: [
      { a: "root", b: "agency" }, { a: "root", b: "esports" }, { a: "root", b: "education" },
      { a: "root", b: "nss" }, { a: "root", b: "lab-krishi" }, { a: "root", b: "lab-neurosync" },
      { a: "root", b: "lab-mirror" },
    ],
    labelAll: true,
  },
  work: {
    nodes: {
      root: { x: 0.04, y: 0.16, anchor: "work-title", lit: 0.7 },
      agency: { x: 0.04, y: 0.34, anchor: "row-agency" },
      esports: { x: 0.04, y: 0.5, anchor: "row-esports" },
      education: { x: 0.04, y: 0.66, anchor: "row-education" },
      nss: { x: 0.04, y: 0.8, anchor: "row-nss" },
      "lab-krishi": { x: 0.2, y: 0.92, anchor: "lab-krishi" },
      "lab-neurosync": { x: 0.5, y: 0.94, anchor: "lab-neurosync" },
      "lab-mirror": { x: 0.8, y: 0.96, anchor: "lab-mirror" },
    },
    edges: [
      { a: "root", b: "agency" }, { a: "agency", b: "esports" }, { a: "esports", b: "education" },
      { a: "education", b: "nss" }, { a: "nss", b: "lab-krishi" },
      { a: "lab-krishi", b: "lab-neurosync" }, { a: "lab-neurosync", b: "lab-mirror" },
    ],
    dynamicLit: "nearest",
  },
  journey: { nodes: journeyNodes, edges: journeyEdges, dynamicLit: "journey" },
  rest: {
    nodes: { root: { x: 0.93, y: 0.5, lit: 0.8 } },
    edges: [],
    dim: 0.7,
  },
  contact: {
    nodes: { root: { x: 0.78, y: 0.36, anchor: "contact-node", lit: 1, r: 3.2 } },
    edges: [],
    pulse: true,
  },
};
