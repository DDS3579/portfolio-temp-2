"use client";
import Coordinates from "@/components/Coordinates";
import { site } from "@/content/site";
import { scrollToTop } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="relative mx-auto max-w-[1440px] px-[var(--gutter)] pb-10">
      <div className="flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>© {site.name}</p>
        <Coordinates />
        <div className="flex items-center gap-6">
          <span>Built with Next.js</span>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); scrollToTop(); }}
            className="inline-flex min-h-11 items-center text-text hover:underline"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
