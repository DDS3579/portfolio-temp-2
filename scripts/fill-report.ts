// Usage: npm run fill-report  -> prints every [FILL] still in /content
import { collectFill } from "../content/fill";
import { site } from "../content/site";
import { chapters } from "../content/chapters";
import { branches, lab, secondary } from "../content/ventures";
import { entries } from "../content/journey";
import { testimonials, SHOW_TESTIMONIALS } from "../content/testimonials";

const groups: Record<string, unknown> = {
  site, chapters, "ventures.branches": branches, "ventures.secondary": secondary, "ventures.lab": lab,
  journey: entries, ...(SHOW_TESTIMONIALS ? { testimonials } : {}),
};
let n = 0;
for (const [k, v] of Object.entries(groups)) {
  const m = collectFill(v, k);
  n += m.length;
  m.forEach((p) => console.log(p));
}
console.log(`\n${n} missing fields` + (SHOW_TESTIMONIALS ? "" : " (testimonials are off, so their 9 placeholders are not counted)"));
