"use client";
import { useEffect } from "react";
import { chapters } from "@/content/chapters";
import { capabilities } from "@/content/index";
import { collectFill } from "@/content/fill";
import { journey } from "@/content/index";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { branches, lab, secondary } from "@/content/ventures";

/** Dev only: list every missing [FILL] field once. Renders nothing. */
export default function DevWarnings() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const missing = [
      ...collectFill(site, "site"),
      ...collectFill(chapters, "chapters"),
      ...collectFill({ branches, secondary, lab }, "ventures"),
      ...collectFill(journey, "journey"),
      ...collectFill(capabilities, "capabilities"),
      ...collectFill(testimonials, "testimonials"),
    ];
    if (missing.length) console.warn(`[content] ${missing.length} missing [FILL] fields:\n` + missing.map((m) => ` - ${m}`).join("\n"));
  }, []);
  return null;
}
