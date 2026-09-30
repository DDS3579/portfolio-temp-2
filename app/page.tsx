import { existsSync } from "node:fs";
import { join } from "node:path";
import dynamic from "next/dynamic";
import DevWarnings from "@/components/DevWarnings";
import MotionProvider from "@/components/motion/MotionProvider";
import Backdrop from "@/components/sections/Backdrop";
const Capabilities = dynamic(() => import("@/components/sections/Capabilities"));
const Chapters = dynamic(() => import("@/components/sections/Chapters"));
const Contact = dynamic(() => import("@/components/sections/Contact"));
const Footer = dynamic(() => import("@/components/sections/Footer"));
import Hero from "@/components/sections/Hero";
const Journey = dynamic(() => import("@/components/sections/Journey"));
import Navbar from "@/components/sections/Navbar";
const Philosophy = dynamic(() => import("@/components/sections/Philosophy"));
import Testimonials from "@/components/sections/Testimonials";
const Work = dynamic(() => import("@/components/sections/Work"));

export default function Page() {
  // Resolved at build time: the Download Resume button only exists if /public/resume.pdf does.
  const hasResume = existsSync(join(process.cwd(), "public", "resume.pdf"));
  return (
    <MotionProvider>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[90] -translate-y-20 rounded-full bg-text px-5 py-3 text-sm font-medium text-bg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Backdrop />
      <Navbar />
      <main id="main" className="relative z-20">
        <Hero />
        <Chapters />
        <Work />
        <Capabilities />
        <Journey />
        <Philosophy />
        <Testimonials />
        <Contact hasResume={hasResume} />
      </main>
      <div className="relative z-20">
        <Footer />
      </div>
      <DevWarnings />
    </MotionProvider>
  );
}
