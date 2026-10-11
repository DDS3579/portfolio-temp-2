"use client";
import * as m from "motion/react-m";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/content/site";
import { EASE } from "@/lib/ease";

export default function MobileMenu({
  open,
  onOpenChange,
  active,
  go,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  active: string | null;
  go: (id: string) => (e: React.MouseEvent) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
  );
}
