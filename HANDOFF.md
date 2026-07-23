# RNL-MKT — developer handoff

Static website. **No build step, no dependencies, no package manager.** Every page is a
single self-contained HTML file with its CSS in an inline `<style>` block and its JS in an
inline `<script>` block. Open a file in a browser and it works.

Contact: Roseline Lemoine · studio@rnlmkt.com

---

## Files

| Path | What it is |
|---|---|
| `index.html` | English (canonical) |
| `portfolio-it.html` | Italian |
| `portfolio-nl.html` | Dutch |
| `portfolio-de.html` | German |
| `portfolio-fr.html` | French |
| `conversion-checklist.html` | Print source for the lead-magnet PDF |
| `conversion-checklist.pdf` | The lead magnet itself (4 pages, generated from the above) |
| `RNL_MKT_FINALVERSION.png` | Brand logo — header, hero, footer, and the PDF header |
| `portrait.jpg` / `portrait-contact.jpg` | Photography |
| `fonts/` | Self-hosted WOFF2 (see below) |
| `logos/` | Tool icons for the "Tools & Software I work with" panel — **read `logos/README.md`** |
| `fabio-angelici/` | Case-study screenshot |
| `.nojekyll` | Required — stops GitHub Pages running the files through Jekyll |

## Running it locally

Any static file server. From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Do **not** open via `file://` — the Google Forms
embed and the font preloads misbehave under that scheme.

## Deployment

Currently GitHub Pages, served from the repo root. `.nojekyll` must stay at the root.
Nothing to compile; push the files as they are.

---

## Third-party integrations

**Google Analytics 4** — `G-HK5004VRP4`. The gtag snippet is the first thing inside
`<head>` on all five pages. One custom event is fired: `lead_magnet_download`, with the
page language as a parameter.

**Contact form** — an embedded Google Form (`<iframe>`, `loading="lazy"`). The iframe is
hidden below 720px; phone/WhatsApp/mail buttons take its place on mobile.

**Lead magnet** — the email is POSTed to a second Google Form's `formResponse` endpoint
with `mode: 'no-cors'`, then the PDF download is revealed. Endpoint and field id are at
the top of the IIFE in each page's `<script>` block. Two notes:

- The unlock is **client-side only**. It captures willing visitors; it does not protect
  the PDF. That is normal for a lead magnet.
- The download is revealed **even if the POST fails**, so a network error never leaves
  someone without the file they were promised. Deliberate — don't "fix" it.
- Unlock state persists via `localStorage` under `rnlmkt_checklist_unlocked`.

---

## Conventions worth knowing before you edit

**Fonts are self-hosted on purpose.** DM Serif Display + DM Sans as local WOFF2, not the
Google Fonts CDN. The client is EU-based and the CDN sends visitor IPs to Google. Please
don't switch to the CDN.

**Email and phone are obfuscated.** They are base64 in `data-e` / `data-t` attributes and
decoded by a small script (`.jmail` / `.jtel` classes). This is anti-scraping, not
security. If you edit an address, edit the base64, not the visible text.

**Nav breakpoints are per-language and were measured, not guessed.** Label lengths differ,
so each file has its own thresholds — German is widest ("Wie ich unterstütze"):

| Page | Hide `.nav-links` (hamburger takes over) | Tighten nav font |
|---|---|---|
| EN | 780px | 970px |
| IT | 810px | 1010px |
| NL | 820px | 1020px |
| DE | 930px | 1150px |
| FR | 860px | 1070px |

If you change a nav label, re-measure that page's breakpoints. Sweeping 320–1440px for
horizontal overflow is the check.

**The services grid uses CSS subgrid** (`grid-template-rows: subgrid`) so the three cards
align row-for-row. On mobile the same markup becomes an accordion via `display: contents`
→ `display: block`. Don't flatten the wrapper div; it is load-bearing in both modes.

**Long compound words break the grid** if the columns aren't `minmax(0, 1fr)` — Dutch and
German produce unbreakable strings. The current CSS handles it; keep `overflow-wrap:
break-word`.

**Regenerating the PDF** after editing `conversion-checklist.html`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --virtual-time-budget=10000 --print-to-pdf="$PWD/conversion-checklist.pdf" "http://localhost:8000/conversion-checklist.html"
```

---

## Known gaps — not bugs, just not done yet

1. **No SEO or social metadata on any page.** No `<meta name="description">`, no
   Open Graph / Twitter card tags, no `<link rel="alternate" hreflang="…">`, no favicon.
   The hreflang set matters most: five language variants currently have nothing telling
   search engines they are translations of each other.
2. **`logos/nano-banana.svg` is missing** and is expected to stay missing (no official
   mark exists). An `onerror` handler drops that tile, so nothing breaks. `logos/README.md`
   documents three further logo issues — a wrong-product Claude mark, a generic Microsoft
   mark standing in for Dynamics, and a dark Semrush app icon.
3. **"Book a free call" CTAs point at `#contact`.** A Calendly link is planned. There is a
   `<!-- TODO -->` comment above each hero CTA block and a second occurrence in
   `.cta-strip` on every page — two per page.
4. **Two of the three case studies are hidden**, pending real content. The markup is still
   in the file.
5. **No testimonials or social proof anywhere on the site.** Flagged in a conversion audit
   as the single biggest gap; content not yet available.

## House rules

- The hero headline (*"Marketing that moves your business."*) is a slogan and stays in
  **English on every language page**. It is not a translation oversight.
- German uses formal address (**Sie**) throughout — including UI strings, placeholders,
  and the WhatsApp pre-filled message. Keep it.
- Any copy change must be applied to **all five pages** or explicitly scoped to one.
