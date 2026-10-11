"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  title,
}: {
  className?: string;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60 data-[state=open]:animate-[fade-plain_0.3s_ease]" />
      <Dialog.Content
        aria-describedby={undefined}
        className={cn(
          "fixed inset-0 z-[80] flex flex-col bg-bg/85 px-[var(--gutter)] pt-5 pb-10 backdrop-blur-2xl focus:outline-none",
          className,
        )}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        <div className="flex justify-end">
          <Dialog.Close
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full border border-white/15 text-text"
          >
            <X className="size-5" aria-hidden />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
