/** Sentinel for content that has not been supplied yet. The UI omits it; dev console lists it. */
export const FILL = "[FILL]" as const;
export type Fill = typeof FILL;
export type Maybe<T = string> = T | Fill;

export function has<T>(v: T | Fill | undefined | null): v is T {
  return v !== undefined && v !== null && v !== FILL && v !== ("" as unknown);
}

/** Walk any content object and return the path of every [FILL]. */
export function collectFill(node: unknown, path = ""): string[] {
  if (node === FILL) return [path];
  if (Array.isArray(node)) return node.flatMap((n, i) => collectFill(n, `${path}[${i}]`));
  if (node && typeof node === "object")
    return Object.entries(node).flatMap(([k, v]) => collectFill(v, path ? `${path}.${k}` : k));
  return [];
}
