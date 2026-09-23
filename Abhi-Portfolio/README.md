# Abhishek Singh · Portfolio

A single-page portfolio built with **Next.js 16 (App Router, static export)**, React 19, Tailwind CSS, GSAP and Lenis smooth scrolling.

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # ESLint (eslint-config-next), fails on any warning
npm run build    # static site in out/
npm start        # serve out/ locally
```

## Editing content

All content lives in **`src/data/portfolio.js`**:

- Text in `[square brackets]` is a placeholder and shows on the page exactly as written until you replace it.
- Empty strings (`''`) and empty lists (`[]`) hide what they control. No URL means no button, so there are never dead links.
- The logos in the rotating skills ring (`toolLogos`) are placeholders chosen only to demo the ring. Replace them with the tools you use, and add any new icon to `src/lib/toolIcons.js`.

Put images in `public/images/` (WebP, at most about 1600px wide) and your résumé at `public/resume.pdf`. Then set `personal.resume.url` to `/resume.pdf` and `personal.resume.preview` to a first-page image, and the Resume buttons appear.

After you fill in your details, regenerate the social-preview image `src/app/opengraph-image.jpg`: take a 1200×630 screenshot of the hero.

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical/OG links and the sitemap |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Optional form backend (Formspree URL, or `https://api.web3forms.com/submit`) |
| `NEXT_PUBLIC_CONTACT_ACCESS_KEY` | Web3Forms access key (only for Web3Forms) |
| `BASE_PATH` | Build-only sub-path, e.g. `/portfolio` for `user.github.io/portfolio` |

How the contact form sends: with an endpoint, it posts JSON and shows success or error feedback on the page. Without one, it opens the visitor's email app addressed to `personal.email`. With neither, it tells the visitor it isn't set up yet.

`NEXT_PUBLIC_*` values are included in the public JavaScript bundle, which is expected for these form services. Don't put private secrets in them.

## Deploy

`.github/workflows/deploy.yml` lints, builds and publishes `out/` to GitHub Pages on every push to `main`. It sets `BASE_PATH` automatically. Add the optional variables under Settings → Secrets and variables → Actions → Variables. For a custom domain, add `public/CNAME`.

`out/` is a plain static site, so it also works on Netlify, Vercel, Cloudflare Pages or any static host.

## Structure

```
src/
  app/                 layout (fonts, SEO, theme), page, robots, sitemap, icon, OG image
  data/portfolio.js    ← all content
  components/          one file per section; ui/ holds Button, Dialog, Reveal, Toast, Counter
    GrainBackground.jsx  grain background in plain SVG + CSS masks (no WebGL, same on every GPU)
  lib/                 hooks, smooth scroll (Lenis + GSAP), nav sections, icon maps
```

## Accessibility and motion

- Native `<dialog>` for the résumé, certificate viewer and mobile menu. Focus stays inside, Escape closes, and focus returns to the trigger.
- A skip link, visible focus rings, labelled fields, and live-region toasts.
- With `prefers-reduced-motion`, smooth scrolling is off, the marquee and ring stop, reveals and counters show their final state, and the physics toy is hidden.

## Credits

Fonts are Inter, Plus Jakarta Sans, Lora and Playfair Display (SIL OFL), self-hosted by `next/font`. Tool logos are from [simple-icons](https://simpleicons.org) (CC0); the brands belong to their owners. The layout and interactions are inspired by tarunkaushik.tech. No content or assets were copied from it.
