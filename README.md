# The Stewart Law Practice — Website

Modern redesign of the website for **The Stewart Law Practice, PC** (Alpharetta, GA) — a boutique law firm serving Georgia families in estate planning, elder law, probate, and Social Security matters.

## Live site

**Preview URL:** https://stewart-law-website-production.up.railway.app

(Pointing the real `thestewartlawpractice.com` domain will replace this once DNS is updated.)

## Stack

Pure static HTML / CSS / JavaScript. No build step. No framework. Drop the folder on any host.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Folder structure

```
.
├── index.html              Home
├── about.html              About the firm
├── team.html               Attorneys + staff
├── estate-planning.html    Practice area
├── elder-law.html          Practice area
├── probate.html            Practice area
├── social-security.html    Practice area
├── faq.html                16 honest answers
├── resources.html          Blog + GA legal resources
├── contact.html            Form + map + office info
├── 404.html                Fallback page
├── sitemap.xml
├── robots.txt
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── images/
```

## Brand

- Primary: `#6B1F2E` (burgundy, from the crest)
- Accent: `#C8A968` (gold)
- Accent (highlight): `#B23A3A` (warm red, hero keyword)
- Surface: `#FAF6EF` (war