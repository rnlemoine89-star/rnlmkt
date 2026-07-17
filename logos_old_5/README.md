# Tool logos

The "Tools & software I use" dropdown under **How I Help** loads its icons from this folder.
17 of 18 are in place. Until a file exists, that tile falls back to showing the tool's name
as text — so the site never shows a broken image, and each logo appears as soon as you add
it. No code changes needed.

## Still outstanding (2026-07-15)

| File | Status | What's needed |
|---|---|---|
| `nano-banana.svg` | **missing** | Tile currently shows the text "Nano Banana". |
| `claude.svg` | **wrong product** | This is the **Claude Code** mark (the pixel robot, `<title>Claude Code</title>`) — the developer CLI, not the Claude assistant. Replace with the Claude logo unless Claude Code is deliberate. |
| `microsoft-dynamics.svg` | **wrong product** | This is the generic **Microsoft** four-square corporate logo, not Dynamics 365. |
| `semrush.jpeg` | works, but heavy | Dark app-icon version, so it reads as a black box on the light tile. Keying the background out of a JPEG leaves a dark fringe, so grab the SVG / transparent PNG instead. |

Already fixed in place: `mailchimp.png` and `notebooklm.png` were cropped and had their flat
backgrounds keyed out (they were 87% / 92% empty canvas and rendered as specks); `notion.png`
had its margin trimmed (its white page is part of the mark, so it stays opaque);
`salesforce.svg` was missing a `viewBox` and would not scale; `meta-ads.svg` had a 3157x2105
bitmap embedded inside it (365KB) which was downscaled to 400px — 39KB, geometry untouched.

## What to download

Prefer **SVG**. Use the plain colour logo/logomark (not the white/"reverse" version — the
tiles have a light `#F3F3F3` background). Square logomarks look best; wide wordmarks also
work, they just render smaller. If a brand only offers a raster, a **transparent PNG** is
much better than a JPEG — JPEG can't carry transparency and can't be cleanly cut out later.

| Filename | Tool | Where to get it |
|---|---|---|
| `meta-ads.svg` | Meta Ads | https://www.facebook.com/brand/resources/meta/company-brand |
| `google-analytics.svg` | Google Analytics 4 | https://about.google/brand-resource-center/ |
| `n8n.svg` | n8n | https://n8n.io/press/ |
| `claude.svg` | Claude | https://www.anthropic.com/company (or press kit) |
| `notebooklm.svg` | NotebookLM | https://about.google/brand-resource-center/ |
| `perplexity.svg` | Perplexity | https://www.perplexity.ai/hub/media-kit |
| `chatgpt.svg` | ChatGPT | https://openai.com/brand/ |
| `canva.svg` | Canva | https://www.canva.com/newsroom/media-kit/ |
| `mailchimp.svg` | Mailchimp | https://mailchimp.com/about/brand-assets/ |
| `zapier.svg` | Zapier | https://zapier.com/press |
| `notion.svg` | Notion | https://www.notion.com/front-static/logo-ios.png (brand page: notion.com/brand) |
| `sprout-social.svg` | Sprout Social | https://sproutsocial.com/newsroom/ |
| `semrush.svg` | Semrush | https://www.semrush.com/company/press/media-kits/ |
| `nano-banana.svg` | Nano Banana | Google/Gemini brand resources |
| `miro.svg` | Miro | https://miro.com/press/ |
| `salesforce.svg` | Salesforce | https://www.salesforce.com/company/news-press/media-kit/ |
| `microsoft-dynamics.svg` | Microsoft Dynamics | https://learn.microsoft.com/en-us/dynamics365/get-started/icons |
| `shopify.svg` | Shopify | https://www.shopify.com/brand-assets |

## Notes

- Using a company's logo to state that you use their product is normally fine
  (nominative use), but follow each brand's guidelines — most ask that you don't recolour,
  distort, or imply partnership/endorsement.
- If you only have a PNG, save it at ~64px tall on a transparent background and change the
  extension in the three `portfolio*.html` files (search for `logos/`).
- The tile shows the logo at max 32px tall / 66% width, so very detailed logos will read
  poorly — prefer the compact logomark where a brand offers one.
