"use client";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { scrollToId, scrollToTop } from "@/lib/scroll";

const MobileMenu = dynamic(() => import("./MobileMenu"), { ssr: false });

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((cur) => (cur === e.target.id ? null : cur));
        }
      },
      // a thin band across the middle of the viewport decides "you are here"
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const ids = site.nav.map((n) => n.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const id = ric(() => { void import("./MobileMenu"); });
    return () => { if (window.cancelIdleCallback) window.cancelIdleCallback(id as number); };
  }, []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // let the sheet unlock scrolling first
    window.setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--nav-h)]">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 border-b border-border bg-bg/60 backdrop-blur-xl transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-full max-w-[1440px] items-center justify-between px-[var(--gutter)]"
      >
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); scrollToTop(); }}
          aria-label={`DDS, ${site.name}, back to top`}
          className="font-display text-xl font-bold tracking-tight"
        >
          {site.short}
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {site.nav.map((n) => {
            const on = active === n.id;
            return (
              <li key={n.id} className="relative">
                <a
                  href={`#${n.id}`}
                  onClick={go(n.id)}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center text-[0.9375rem] transition-colors duration-300",
                    on ? "text-text" : "text-muted hover:text-text",
                  )}
                >
                  {n.label}
                </a>
                <span
                  aria-hidden
                  className={cn(
                    "mono pointer-events-none absolute left-1/2 top-[calc(50%+0.9rem)] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[10px] text-key transition-opacity duration-300",
                    on ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="size-1 rounded-full bg-key" />
                  you are here
                </span>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact" onClick={go("contact")} className={buttonClass("ghost", "hidden lg:inline-flex")}>
            Let&apos;s Build
          </a>

          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => { setMounted(true); setOpen(true); }}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-text lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          {mounted && <MobileMenu open={open} onOpenChange={setOpen} active={active} go={go} />}
        </div>
      </nav>
    </header>
  );
}
