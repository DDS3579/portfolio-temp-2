import Link from "next/link";

export const metadata = { title: "Page not found | Divya Darsheel Sharma", robots: { index: false } };

/** Branded 404: the light is still on, the page just isn't on the map. */
export default function NotFound() {
  return (
    <main className="relative grid min-h-[100dvh] place-items-center px-[var(--gutter)] text-center">
      <div className="bg-grid" aria-hidden />
      <div className="relative z-20">
        <p className="mono text-muted">Region: Unknown</p>
        <h1 className="font-display mt-6 text-[clamp(2.75rem,1rem+8vw,8rem)]">
          Off the map<span className="period-dot" aria-hidden="true" />
        </h1>
        <p className="t-body mx-auto mt-6 text-muted">That page doesn&apos;t exist, or it moved.</p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-text px-7 text-[0.9375rem] font-medium text-bg transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90"
        >
          Back to the start
        </Link>
      </div>
      <div className="bg-grain" aria-hidden />
    </main>
  );
}
