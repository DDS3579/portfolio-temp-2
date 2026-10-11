import { has } from "@/content/fill";
import { SHOW_TESTIMONIALS, testimonials, testimonialsCopy } from "@/content/testimonials";

export default function Testimonials() {
  if (!SHOW_TESTIMONIALS) return null;
  const real = testimonials.filter((t) => has(t.quote));
  if (!real.length) return null;
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="mx-auto max-w-[1440px] px-[var(--gutter)] py-28">
      <h2 id="testimonials-title" className="font-display t-section">{testimonialsCopy.title}</h2>
      <ul className="mt-14 grid gap-10 md:grid-cols-3">
        {real.map((t, i) => (
          <li key={i} className="border-t border-border pt-6">
            <blockquote className="text-lg leading-relaxed">{t.quote}</blockquote>
            {(has(t.name) || has(t.role)) && (
              <p className="mt-5 text-sm text-muted">{[t.name, t.role].filter(has).join(", ")}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
