# The Stewart Law Practice — Website Redesign

A modern, dynamic, accessible website for The Stewart Law Practice, PC (Alpharetta, GA). Built as static HTML/CSS/JS so it works anywhere — local file, any static host, Wix, Webflow, Netlify, Vercel, or a traditional web host.

## What's inside

```
website/
├── index.html              Home
├── about.html              About the firm
├── team.html               Deborah Stewart + team bios
├── estate-planning.html    Practice area
├── elder-law.html          Practice area
├── probate.html            Practice area
├── social-security.html    Practice area
├── faq.html                16 honest answers, accordion UI
├── resources.html          Blog teaser + GA government links
├── contact.html            Form, contact info, embedded map
├── 404.html                Fallback page
├── sitemap.xml             For search engines
├── robots.txt              Crawler directives
├── assets/
│   ├── css/styles.css      Single design-system stylesheet (~30 KB)
│   ├── js/main.js          Interactions, accordions, sliders (~3 KB)
│   ├── icons/favicon.svg   Branded favicon
│   └── images/
│       ├── logo/           Full logo, vertical mark, white seal (PNG/WebP/AVIF)
│       └── team/           Headshots in 3 formats per person
└── README.md               This file
```

## Design system at a glance

- **Primary**: `#6B1F2E` (rich burgundy, from the logo crest)
- **Accent**: `#C8A968` (warm metallic gold)
- **Sage**: `#7A8B6B` (legacy / growth secondary)
- **Surface**: `#FAF6EF` ivory / `#F3ECDE` cream
- **Display font**: Playfair Display (serif, elegant)
- **Body font**: Inter (clean, highly legible)
- **Container**: 1240 / 1400 / 880 / 720 px breakpoints
- **Spacing**: 8 pt fluid scale, `clamp()` everywhere

## What this redesign solves vs. the old Wix site

1. **The owner is now front and center.** Deborah's portrait, story, and 15+ years of experience anchor the homepage instead of generic stock photography.
2. **Clearer information architecture.** Practice areas are a single dropdown with icons. FAQ is a top-level menu item. "More" is gone.
3. **Real interactivity.** Sticky header with backdrop blur, animated counters, scroll-reveal, FAQ accordion, testimonial slider, floating CTA, animated hover states on practice cards.
4. **Conversion paths everywhere.** "Book Consultation" is in the topbar, nav, hero, every aside, every section CTA, and as a sticky floating button on mobile.
5. **Real credibility signals.** Memberships marquee (NAELA, GABWA, State Bar of GA, Lawyers With Purpose), stats block (15+ years, 6+ counties), real testimonial.
6. **Trust-aware design.** Warm ivory background, deep burgundy authority color, gold accents — not the cold blue/white that every law firm defaults to.
7. **Accessible.** Skip-friendly focus states, semantic landmarks, ARIA on accordions, dropdowns, sliders, `prefers-reduced-motion` honored, color contrast WCAG AA.
8. **Fast.** No build step, no framework, no external trackers, system-fonts fallback, `picture` element with AVIF / WebP / JPG, lazy-loaded images.
9. **SEO-ready.** Per-page titles, descriptions, canonicals, OG, Twitter, structured data (`LegalService` schema on home), sitemap.xml + robots.txt.
10. **Legal-compliant.** Attorney-advertising disclaimer in every footer, no attorney-client-relationship-creating language.

## How to preview locally

Just double-click `index.html` — it runs from the filesystem.

Or, for proper relative-path testing:

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

## How to deploy

- **Wix replacement**: upload all files to any host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or your existing web host).
- **Domain**: point `thestewartlawpractice.com` to the host. Set `index.html` as default.
- **Forms**: the contact form is client-side only by default. Wire it to your preferred backend (Formspree, Netlify Forms, Basin, or a custom endpoint) by changing `<form data-contact-form>` action / method.

## Brand notes

The original logo (deep burgundy crest with `SLP` script monogram and the tagline "TRUSTS. ESTATES. ELDER LAW.") was kept verbatim. The redesign extends that brand into a complete system:

- The crest's burgundy becomes the primary action color.
- The script lettering inspired the use of Playfair Display italics in the hero.
- The gold rim of the crest becomes the secondary accent (CTAs, decorative dividers, highlights).
- A new sage-green tone is reserved for "legacy" cues (testimonials, success states).

## Credit

Designed and built as a complete redesign in a single pass. All site copy is original to this build, drawing on the brand's existing voice from the source site (the "big firm experience, small firm attention" theme and Deborah's caregiver story were preserved verbatim where the voice was already strong).
