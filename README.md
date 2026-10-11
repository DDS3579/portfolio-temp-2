# divyadsharma.com.np

Static Next.js 16 site (App Router, `output: "export"`), Tailwind v4, motion, Lenis, raw WebGL2.

```bash
npm install
cp .env.example .env.local   # form endpoint + public links
npm run dev
npm run build                # static site in ./out
npm run fill-report          # every [FILL] still missing
```

## Swap in real content
- Everything lives in `/content`. Any value equal to `FILL` renders nothing (no dead links, no empty boxes).
  In dev the console lists all missing fields; `npm run fill-report` prints them too.
- Links: set `NEXT_PUBLIC_GITHUB_URL / LINKEDIN_URL / X_URL / EMAIL` (site links) or fill `links.*` per venture in `content/ventures.ts`.
- Contact form: set `NEXT_PUBLIC_FORM_ENDPOINT` (Formspree URL, or Web3Forms URL plus `NEXT_PUBLIC_WEB3FORMS_KEY`).
  With no endpoint the form falls back to `mailto:` if an email is set.
- Screenshots: put `public/work/<slug>.webp`, then set `image: { src, width, height, alt }` on the venture. Until then a generated composition shows.
- Resume: drop `public/resume.pdf` and rebuild; the button appears automatically.
- Testimonials: fill real quotes, then set `SHOW_TESTIMONIALS = true` in `content/testimonials.ts`.
- Journey: if you add or remove entries, keep `JOURNEY_NODES` (content/constellation.ts) at least as long as `entries`.

## How the constellation works
`content/constellation.ts` is the state table: one shared set of 16 nodes, a layout per section
(hero, origin, build, scale, conglomerate, work, journey, rest, contact). `components/constellation/engine.ts`
maps scroll to a scalar across those states, blends positions with easeInOutCubic, and springs the result.
Nodes bind to DOM via `data-node-anchor`. Below 1024px, on coarse pointers, or with reduced motion the layer
is not mounted and sections render `<ConstellationStatic>`.

## Deploy on Vercel (divyadsharma.com.np)
1. Push the repo to GitHub, then Import Project on Vercel. Framework preset: Next.js (the static export is detected automatically).
2. Add the environment variables from `.env.example` under Settings, Environment Variables (at least `NEXT_PUBLIC_FORM_ENDPOINT` once you have a form service).
3. Settings, Domains: add `divyadsharma.com.np` and `www.divyadsharma.com.np`. Vercel shows the exact DNS records to create at your .com.np registrar (normally an A record for the apex and a CNAME for www). Use the values Vercel shows, not ones from memory.
4. Add your resume at `public/resume.pdf`; the Download Resume button appears on the next build.
5. `vercel.json` sets security headers and caching. Fingerprinted assets under `/_next/static` are cached forever by Vercel automatically.

## Where things live
- About text and portrait: `content/about.ts` (put the photo in `public/about/` and fill `portrait`).
- Capabilities: `content/capabilities.ts`. Journey: `content/journey.ts`. Work: `content/ventures.ts`.
