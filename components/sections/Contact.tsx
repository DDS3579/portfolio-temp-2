"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import ConstellationStatic from "@/components/constellation/ConstellationStatic";
import { useLitSurface } from "@/components/constellation/useLitSurface";
import Coordinates from "@/components/Coordinates";
import Reveal from "@/components/motion/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { Button, buttonClass } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { has } from "@/content/fill";
import { site } from "@/content/site";
import { useTier } from "@/lib/tier";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact({ hasResume }: { hasResume: boolean }) {
  const tier = useTier();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const litRef = useLitSurface<HTMLDivElement>();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const email = site.links.email;
  const { endpoint, web3formsKey } = site.form;

  const startProject = () => {
    formRef.current?.scrollIntoView({ block: "center" });
    window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 350);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) { setStatus("sent"); return; } // honeypot: pretend success
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      type: String(fd.get("type") ?? ""),
      message: String(fd.get("message") ?? "").trim(),
    };
    const next: Errors = {};
    if (data.name.length < 2) next.name = "Add your name.";
    if (!EMAIL_RE.test(data.email)) next.email = "Add an email address I can reply to.";
    if (data.message.length < 10) next.message = "Tell me a little about the project (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }

    const mailto = () => {
      if (!has(email)) return false;
      const body = `${data.message}\n\nFrom: ${data.name} (${data.email})\nProject type: ${data.type}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Project enquiry: ${data.type}`)}&body=${encodeURIComponent(body)}`;
      return true;
    };

    if (!endpoint) {
      if (mailto()) { setStatus("sent"); return; }
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, ...(web3formsKey ? { access_key: web3formsKey, subject: `Project enquiry: ${data.type}` } : {}) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const socials = [
    { label: "GitHub", url: site.links.github, Icon: ArrowUpRight },
    { label: "LinkedIn", url: site.links.linkedin, Icon: ArrowUpRight },
    { label: "X", url: site.links.x, Icon: ArrowUpRight },
    { label: "Email", url: has(email) ? `mailto:${email}` : "[FILL]", Icon: Mail },
  ].filter((s) => has(s.url));

  return (
    <section
      id="contact"
      data-zone="contact"
      aria-labelledby="contact-title"
      className="relative mx-auto max-w-[1440px] px-[var(--gutter)] pt-28 pb-24 lg:pt-44"
    >
      <div className="relative grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal>
            <SectionMarker className="mb-6">Region: Contact</SectionMarker>
            <h2 id="contact-title" className="font-display t-section max-w-[14ch]">{site.contact.heading}</h2>
            <p className="t-body mt-6 text-muted">{site.contact.text}</p>
          </Reveal>
        </div>
        {/* the constellation converges here */}
        <div className="relative hidden lg:col-span-4 lg:block">
          <span aria-hidden data-node-anchor="contact-node" className="absolute top-16 left-1/2 size-px" />
          {tier === "lite" && <ConstellationStatic state="contact" className="max-w-[180px]" />}
        </div>
        {tier === "lite" && (
          <div className="lg:hidden">
            <ConstellationStatic state="contact" className="max-w-[140px]" />
          </div>
        )}
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div ref={litRef} className="lit-surface rounded-xl border border-border p-6 md:p-10">
            {status === "sent" ? (
              <div role="status" aria-live="polite" className="py-10">
                <h3 className="font-display text-4xl">Message sent.</h3>
                <p className="t-body mt-4 text-muted">Thanks. I read every message and will reply to the email you gave.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Start a project" className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="c-name">Name</Label>
                    <Input ref={nameRef} id="c-name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-e" : undefined} />
                    {errors.name && <p id="c-name-e" className="mt-2 text-sm text-[#f0958b]">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="c-email">Email</Label>
                    <Input id="c-email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-e" : undefined} />
                    {errors.email && <p id="c-email-e" className="mt-2 text-sm text-[#f0958b]">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="c-type">Project type</Label>
                  <Select id="c-type" name="type" defaultValue={site.contact.projectTypes[0]}>
                    {site.contact.projectTypes.map((t) => (
                      <option key={t} value={t} className="bg-surface">{t}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="c-message">Message</Label>
                  <Textarea id="c-message" name="message" aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-e" : undefined} />
                  {errors.message && <p id="c-message-e" className="mt-2 text-sm text-[#f0958b]">{errors.message}</p>}
                </div>
                {/* honeypot */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
                </div>
                {status === "error" && (
                  <p role="alert" className="text-sm text-[#f0958b]">
                    {endpoint || has(email)
                      ? "That didn't send. Check your connection and try again"
                      : "The form isn't connected to an inbox yet."}
                    {has(email) && (
                      <> or email <a className="underline" href={`mailto:${email}`}>{email}</a>.</>
                    )}
                  </p>
                )}
                <div>
                  <Button type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending" : "Send message"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
          <div className="flex flex-wrap gap-3">
            <Button onClick={startProject}>Start a Project</Button>
            {has(site.links.github) && (
              <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost")}>
                View GitHub
              </a>
            )}
            {hasResume && (
              <a href="/resume.pdf" download className={buttonClass("ghost")}>
                Download Resume
              </a>
            )}
          </div>
          {socials.length > 0 && (
            <ul className="mt-10 grid gap-1 border-t border-border pt-6">
              {socials.map(({ label, url, Icon }) => (
                <li key={label}>
                  <a
                    href={url as string}
                    {...(label !== "Email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex min-h-11 items-center gap-3 text-muted transition-colors duration-300 hover:text-text"
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <Coordinates className="mt-10" />
        </Reveal>
      </div>
    </section>
  );
}
