"use client";
import * as m from "motion/react-m";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/ease";
import { scrollToId, scrollToTop } from "@/lib/scroll";

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
          aria-label={`${site.name}, back to top`}
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

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-full border border-white/15 text-text lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </SheetTrigger>
            <SheetContent title="Menu">
              <ul className="mt-10 flex flex-1 flex-col gap-2">
                {site.nav.map((n, i) => (
                  <m.li
                    key={n.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.08 }}
                  >
                    <SheetClose asChild>
                      <a
                        href={`#${n.id}`}
                        onClick={go(n.id)}
                        className="font-display flex min-h-14 items-center text-5xl"
                        aria-current={active === n.id ? "location" : undefined}
                      >
                        {n.label}
                      </a>
                    </SheetClose>
                  </m.li>
                ))}
              </ul>
              <m.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 + site.nav.length * 0.08 }}
              >
                <SheetClose asChild>
                  <a href="#contact" onClick={go("contact")} className={buttonClass("solid", "w-full")}>
                    Let&apos;s Build
                  </a>
                </SheetClose>
              </m.div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
