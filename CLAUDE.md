# CLAUDE.md — rules for working on this codebase

This is `rnlmkt.com`, a static marketing site with no build step and no
dependencies, edited directly by the client via AI prompting ("vibe coding")
with no developer review in between. That means whatever assistant is
reading this **is the only safety check before a change goes live**. Follow
these rules literally, don't skip steps to save time, and ask before doing
anything you're not sure about rather than guessing.

Read `HANDOFF.md` first for the full architecture, file table, and
per-language conventions. This file is the rules; `HANDOFF.md` is the map.

## Non-negotiable architecture rules

1. **Zero build step, zero dependencies, no package manager.** Don't add
   npm, a bundler, a framework, or a `node_modules` folder. Every file must
   keep working when opened by a plain static file server. If a request
   seems to require build tooling, say so and propose a non-build
   alternative instead of quietly adding one.
2. **Five pages must stay in sync.** `index.html` (EN, canonical) plus
   `portfolio-{it,de,fr,nl}.html` share `assets/css/site.css` and
   `assets/js/*.js` already — but headline copy, nav labels, meta tags, and
   anything else still written per-file must be changed in **all five**
   unless the request explicitly scopes it to one language. Before finishing
   any content change, grep all five files to confirm you didn't miss one.
3. **Nav breakpoints are measured, not guessed** (see `HANDOFF.md`). If you
   change a nav label's length in any language, re-measure and update that
   language's `html:lang(xx)` block in `assets/css/site.css` — don't touch
   the other four.
4. **Fonts stay self-hosted** (`assets/fonts/`, WOFF2). Never switch to the
   Google Fonts CDN — the client is EU-based and the CDN sends visitor IPs
   to Google.
5. **Email/phone stay obfuscated.** They're base64 in `data-e`/`data-t`
   attributes, decoded by the `.jmail`/`.jtel` script in `assets/js/site.js`.
   To change an address, re-encode the base64 — don't just edit visible text.
6. **House rules from `HANDOFF.md`:** the hero headline stays in English on
   every page (not a translation bug); German uses formal **Sie** throughout;
   don't "fix" the lead magnet's client-side-only unlock or the fact it
   reveals the download even when the POST fails — both are deliberate.
7. Don't delete a file just because it looks unused from one page — grep the
   **whole repo** (all HTML, `HANDOFF.md`, CSS, JS) for its filename first.

## Security rules

1. **Never commit secrets, API keys, or tokens.** This site has none today —
   keep it that way. Form endpoints (Google Forms) are not secrets, they're
   public by design; don't treat adding one as an exception to this rule.
2. **Any new external resource updates `vercel.json`.** New analytics,
   embeds, fonts, scripts, or images from a new domain need that domain
   added to the matching CSP directive (`script-src`, `connect-src`,
   `frame-src`, `img-src`, `style-src`). If you add an integration and skip
   this, it will silently fail to load once deployed on Vercel — test for
   that, don't just assume it works because it works locally (CSP isn't
   enforced by a plain local file server).
3. Every `target="_blank"` link needs `rel="noopener"`.
4. All external links and resources must be HTTPS.
5. **Never use `innerHTML`/`outerHTML`/`document.write` with anything other
   than a fixed, hardcoded string.** This site has zero user-generated
   content today (no comments, no reviews, no accounts). The moment that
   changes — even something as small as echoing a name back on a form — is
   the moment XSS becomes a real risk here. Treat any such request as
   security-sensitive, not routine.
6. Don't add inline `onclick`/`href` values built by concatenating anything
   that isn't a fixed string.
7. If you're asked to add a form, a login, file uploads, or anything that
   stores or displays visitor-supplied data: stop and flag that this is a
   bigger change than the rest of this site's model (static, no backend, no
   stored user data) and confirm the approach before building it.

## Workflow rules

1. **Verify before calling a change done:** start a local static server
   (`python3 -m http.server` from the repo root) and confirm every page you
   touched, plus every asset whose path you changed, actually loads (curl or
   browser). Run `node --check` on any JS file you edited. Don't skip this
   because a change "looks simple."
2. **If git is set up in this environment,** use a separate branch only for
   changes with real risk of breaking the live site — moving/renaming/
   deleting files, editing the shared `assets/css/site.css` or
   `assets/js/*.js`, touching `vercel.json`, restructuring folders. Small,
   contained edits (copy tweaks, a color, one page's text) can go straight
   to the main branch — branching every single change adds overhead without
   adding safety.
3. **Never push to GitHub, and never upload/deploy to Vercel, without an
   explicit go-ahead in that session.** Committing or merging locally never
   implies permission to publish — ask every time.
4. **Update `HANDOFF.md`** whenever you change the file structure, add a new
   asset category, or change a documented convention (breakpoints, fonts,
   deployment). A stale handoff doc is worse than none, because it's trusted.
5. Don't introduce new abstractions, refactors, or "improvements" beyond
   what was asked. If you spot something else worth fixing (dead code, a
   stale doc, a missing header), mention it — don't silently fix it as a
   drive-by.

## Deployment context

- The site is mid-migration from **GitHub Pages** (custom domain via the
  `CNAME` file, `.nojekyll` at root) to **Vercel**. Deploys to Vercel are a
  **manual folder upload** (dashboard or `vercel deploy`), not a
  git-connected pipeline — whoever deploys needs the current project
  folder, not a GitHub checkout.
- Don't remove `CNAME`/`.nojekyll` until the Vercel cutover is confirmed
  live — they're what currently keeps the real site working.
- `vercel.json` holds the response headers (CSP, HSTS, `X-Content-Type-
  Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`) for
  the Vercel deploy. GitHub Pages can't serve custom headers at all, which
  is the whole reason this file exists — keep it current as integrations
  change (see security rule 2 above).

## Where to look

- `HANDOFF.md` — full architecture, file table, per-language conventions,
  known gaps.
- `assets/logos/README.md` — tool logo sourcing and licensing notes.
