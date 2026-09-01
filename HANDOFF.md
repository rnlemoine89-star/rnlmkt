# RNL-MKT — developer handoff

Static website. **No build step, no dependencies, no package manager.** CSS and JS are
both shared across all five pages — `assets/css/site.css` and `assets/js/{analytics-init,
site}.js` — each page's `<head>`/`<body>` is just markup plus `<script src>`/`<link>`
references. Open a file in a browser and it works.

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
| `privacy.html` (EN) · `privacy-it.html` (IT) · `privacy-nl.html` (NL) · `privacy-de.html` (DE) · `privacy-fr.html` (FR) | Privacy policy, **one page per language**. `privacy-it.html` is the legally **authoritative** Italian version; the other four are convenience translations, each with a banner linking back to it (`privacy-it.html` in turn links out to all four). Published live Sep 2026 (`Privacy-Policy-RNLMKT-DRAFT.docx` at repo root is the original source): the draft banner, AI-drafted/not-legally-reviewed warning, inline "implementation note" callouts, and `[DA COMPLETARE]`-style placeholders have all been removed at the client's instruction, with legal review handled outside this repo. Each homepage's footer links to its own-language page (`index.html`→`privacy.html`, `portfolio-xx.html`→`privacy-xx.html`) with the label "Privacy Policy" (translated per language, e.g. `privacy-it.html` uses "Informativa sulla Privacy"). Each privacy page carries a **copy of its matching homepage's nav + footer** (nav section-anchors point back at that homepage, e.g. `portfolio-de.html#about`; the lang-switcher points at the sibling privacy pages) plus a shared page-scoped `<style>` block — so these are **not** part of `site.css`, and a nav/footer change on the five homepages must now be mirrored on their privacy pages too. German is formal **Sie**. The `<meta robots=noindex>` tag has been removed from all five (Sep 2026) so search engines can index them. |
| `assets/css/site.css` | Shared stylesheet for all five pages (see below) |
| `assets/js/analytics-init.js` | The GA4 `gtag` bootstrap snippet, loaded synchronously in `<head>` right after the async `gtag.js` loader — same position/timing as when it was inline |
| `assets/js/site.js` | Everything else: lead-magnet unlock, mobile menu, service/tools/pricing accordions, contact dropdown, email/phone de-obfuscation. Loaded at the end of `<body>`, same position as the old inline blocks |
| `assets/fonts/` | Self-hosted WOFF2 (see below) |
| `assets/logos/` | Tool icons for the "Tools & Software I work with" panel — **read `assets/logos/README.md`** |
| `assets/images/` | Portrait photography (`portrait.jpg`, `portrait-contact.jpg`) and the brand logo (`brand-logo.png`) |
| `assets/images/case-studies/` | Case-study screenshots (currently just `fabio-angelici.png`) |
| `assets/downloads/ai-marketing-diagnostic.pdf` (EN) · `-it`/`-de`/`-fr`/`-nl` siblings | The lead magnet, one PDF per language (5 pages, "The 10-Question AI Marketing Diagnostic"). Source `.docx` files live at repo root as `AI-Marketing-Diagnostic-RNLMKT[-xx].docx`. Replaced the old `conversion-checklist.pdf` lead magnet (Sep 2026) — that file and its `tools/conversion-checklist.html` print source have been deleted. |
| `vercel.json` | Response headers for the Vercel deploy (CSP, HSTS, etc. — see below) |
| `.nojekyll` / `CNAME` | Leftover GitHub Pages files, no longer needed once the domain is fully cut over to Vercel — safe to delete then |

## Running it locally

Any static file server, from the repo root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Do **not** open via `file://` — the Google Forms
embed and the font preloads misbehave under that scheme.

## Deployment

Moving to **Vercel**. Deploys are a manual upload of the whole project folder (via the
Vercel dashboard or `vercel deploy`) rather than a git-connected pipeline, since the
client doesn't use git — so whoever deploys needs the current folder from Fabio, not a
GitHub checkout. `vercel.json` at the repo root is read on both manual/CLI and
git-connected deploys and sets the security headers.

`CNAME` and `.nojekyll` are inert on Vercel — they're only meaningful to GitHub Pages.
Remove them once the domain is confirmed live on Vercel (custom domains there are
configured in the Vercel dashboard + DNS, not via a file in the repo).

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

**Nav breakpoints are per-language and were measured, not guessed.** Label lengths differ
— German is widest ("Wie ich unterstütze"). Since the CSS is now shared in one file, each
language's thresholds live as separate `@media` blocks scoped with `html:lang(xx)` (search
`assets/css/site.css` for "Nav \"tighten\"" and "Nav-collapse"):

| Page | Hide `.nav-links` (hamburger takes over) | Tighten nav font |
|---|---|---|
| EN | 780px | 970px |
| IT | 810px | 1010px |
| NL | 820px | 1020px |
| DE | 930px | 1150px |
| FR | 860px | 1070px |

If you change a nav label, re-measure that page's breakpoints and edit its `html:lang(xx)`
block in `site.css` — don't touch the other four languages' blocks. Sweeping 320–1440px
for horizontal overflow is the check.

**The services grid uses CSS subgrid** (`grid-template-rows: subgrid`) so the three cards
align row-for-row. On mobile the same markup becomes an accordion via `display: contents`
→ `display: block`. Don't flatten the wrapper div; it is load-bearing in both modes.

**Long compound words break the grid** if the columns aren't `minmax(0, 1fr)` — Dutch and
German produce unbreakable strings. The current CSS handles it; keep `overflow-wrap:
break-word`.

**Regenerating the PDF** after editing `tools/conversion-checklist.html` (run the local
server from the repo root first, see above):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --virtual-time-budget=10000 --print-to-pdf="$PWD/assets/downloads/conversion-checklist.pdf" "http://localhost:8000/tools/conversion-checklist.html"
```

---

## Known gaps — not bugs, just not done yet

1. **No SEO or social metadata on any page.** No `<meta name="description">`, no
   Open Graph / Twitter card tags, no `<link rel="alternate" hreflang="…">`. The favicon
   set is in place. The hreflang set matters most: five language variants currently have
   nothing telling search engines they are translations of each other.
2. **`assets/logos/nano-banana.svg` is missing** and is expected to stay missing (no
   official mark exists). An `onerror` handler drops that tile, so nothing breaks.
   `assets/logos/README.md` documents three further logo issues — a wrong-product Claude
   mark, a generic Microsoft mark standing in for Dynamics, and a dark Semrush app icon.
3. **Two of the three case studies are hidden**, pending real content. The markup is still
   in the file.
4. **No testimonials or social proof anywhere on the site.** Flagged in a conversion audit
   as the single biggest gap; content not yet available.
5. **Some dead code ships harmlessly in `site.css`/`site.js`.** A `.contact-form`/
   `.form-group`/`.form-row` CSS block and a `setLang()` JS function are never referenced
   by any page's markup (all five pages use the Google Form iframe and plain `onclick`
   language-switch buttons instead). Left in place rather than removed during the
   CSS/JS extraction to keep that change a pure move, not a behavior change — safe to
   delete next time either file is touched.

## House rules

- The hero headline (*"Marketing that moves your business."*) is a slogan and stays in
  **English on every language page**. It is not a translation oversight.
- German uses formal address (**Sie**) throughout — including UI strings, placeholders,
  and the WhatsApp pre-filled message. Keep it.
- Any copy change must be applied to **all five pages** or explicitly scoped to one.
