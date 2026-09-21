# Alpha Squared — 2026 site

Ground-up rebuild of [alphasquared.ca](https://alphasquared.ca), executed against the
**EternaCloud** reference ([dribbble shot](https://dribbble.com/shots/26682683-Case-Study-Website-Design-for-EternaCloud) ·
[live demo](https://www.eternacloud.com)). Pure static HTML/CSS/JS — no build step.

This supersedes `../alphasquared-website/`, which used the right colour tokens but
CSS keyframes + IntersectionObserver only. The reference's feel comes almost entirely
from smooth-scroll-synced, scrubbed motion, which CSS alone can't produce — so the
motion layer here runs the same stack the reference does.

## Stack

| Reference uses | We use | Note |
|---|---|---|
| GSAP 3.12 + ScrollTrigger + CustomEase | same | scroll-linked reveals, counters, parallax |
| Lenis 1.x smooth scroll | same | feeds ScrollTrigger off one RAF loop |
| SplitType | same | per-word / per-line masked heading reveals |
| Mazzard H (paid) | **Poppins** 400/500/600 | closest free geometric; already the AS brand face |
| UnicornStudio (hosted WebGL) | **hand-built canvas** | see "Generated visuals" |
| Webflow CMS | static files | — |

All libraries load from CDN. No API keys, no accounts.

## Design tokens (`css/style.css` `:root`)

Sampled directly off the live reference:

- Dark base `#101418`; deep footer `#090c0f`; light-sheet headings `#0d2b38`
- Button gradient `#1c4eff → #12b8b0 → #fe881b`
- Dark-section text gradient `#2ba7ff → #2fd9cf → #fe881b`
- Light-sheet text gradient `#0f9e97 → #1b4dfe → #6d6cff` (teal→blue)
- Headings weight **500**, letter-spacing `-0.03em`, line-height `1.1`
- Buttons: 10px radius, 1px gradient ring around a solid gradient core, fill slides
  toward orange on hover

## Macro structure

Dark hero → dark content → **one continuous white sheet** (44px rounded top corners
overlapping the dark) with dark content as inset rounded panels → light final CTA with
a lavender bloom → dark footer. This is the reference's page architecture.

## Generated visuals (`js/main.js`)

The reference's illustrations are bespoke 3D renders and hosted WebGL shaders. These are
built from scratch in canvas/SVG, themed to trucking rather than data centres:

| Id | What it is |
|---|---|
| `heroViz` | **dot-matrix world map**, delivery cities pulsing, Edmonton labelled |
| `proofViz` | dispatch-board abstraction — job bars flowing across lanes |
| `globeViz` | fibonacci-sphere wireframe globe with a gradient rim |
| `radarViz` | radar sweep with blips that brighten as the sweep passes |

The hero arc is CSS: a conic gradient masked to a thin rim band, on a circle whose
geometry was measured off the reference (centre `(50%, 767px)`, rim radius `917px` at
1440×900). Mobile drops the ring for corner blooms — on a tall, narrow viewport no
circle can cross the side edges near the top without also showing its bottom.

### The hero map

The original isometric grid was replaced because it read as a generic data-centre
abstraction and said nothing about the work. The map **is** the credibility claim that the
stat band directly beneath it quantifies. The hero is also ~190px shorter as a result.

Land comes from **Natural Earth 110m**, rasterised at build time to a 210×84 bit mask,
packed and base64'd into `LAND_B64` in `js/main.js` — 2,940 chars, no runtime data
dependency. Regenerate with the build script rather than editing the constant by hand:

```bash
python3 buildmask.py   # scratchpad script; fetches the GeoJSON and patches main.js
```

Hand-splitting that string across source lines is how a stray character got in once,
which threw `atob` and took down all of `init()` — the page sat on a 0% splash. Two
guards now exist: every init step is wrapped so a failing visual can't kill the page, and
the loader has a wall-clock `setTimeout` fallback (rAF is throttled in background tabs, so
a page opened in one could otherwise stay on the splash until focused).

City markers are drawn at exact lat/lng and are independent of the mask, so coastal cities
render correctly even where a 1.7°/cell grid puts them in a sea cell.

## Positioning

Leads with **capability + track record**, with **Trucking & Transport as the flagship
vertical** given its own full-width block on the homepage and a dedicated page.

- **Proof:** Alliance Driveaway Solutions — dispatch web dashboard + native iOS/Android
  driver apps, 350+ drivers, 48 US states + Canada. Laravel / Vue / Swift / Kotlin.
- **Credibility:** operating since 2012 (Edmonton), 265+ projects, 17 countries, 52 repeat.
- **Capability:** AI already in production (voice agents, OCR, agentic assistants).
- **Structure:** Canadian principal (Abdullah) + senior global engineering bench.

Facts sourced from `../2026-06-04-upwork-engine/knowledge_base/profile.md` and
`master-proposal-generator.md`.

## Final structure — decided 2026-07-28

**Direction A is the website. Direction B is the Driveaway product.** Two properties,
cross-linked.

| File | Design | Ships to | Role |
|---|---|---|---|
| `index.html` | **A** | alphasquared.ca | Agency homepage |
| `trucking.html` | **A** | alphasquared.ca/trucking | The vertical page. Carries the Alliance case study and hands off to the product. |
| `index-trucking-b.html` | **B** | *the product domain* | The Driveaway Dispatch Platform site |

### How they link

- `trucking.html` → a full-width **product band** after the Alliance case study, with a
  CSS-drawn miniature of the product site, linking to B.
- `index.html` footer → "Driveaway Dispatch Platform ↗", plus a compact preview card
  inside the trucking block.
- B → **three** links back to A: the top bar ("Built by ⟨logo⟩"), the footer attribution,
  and the footer nav.

The product preview is **drawn in CSS, not a pasted screenshot** — it stays crisp at any
DPI and can't go stale when the product site changes. Swap it for a real screenshot once
the product domain is live and the design is frozen.

### Brand assets (`assets/`)

Generated from `A2 Logo.jpeg` — white background removed and colour un-premultiplied so
edges stay clean on dark surfaces. Exact brand colours sampled from the source:
**blue `#1560BD`**, wordmark grey `#6D6D6D`, tagline grey `#888888`.

| File | Use |
|---|---|
| `logo-full.png` | Full lockup, colour — light backgrounds (nav) |
| `logo-full-white.png` | Full lockup, white — dark backgrounds (footers, B's top bar) |
| `logo-mark.png` / `logo-mark-white.png` | α² mark alone, for favicons and tight spaces |

### Locked decisions (2026-07-28, Abdullah + Awais)

Recorded in full at the top of
`../alpha-squared/2026-07-28-trucking-transportation-market-research.md`:

- **Trucking / driveaway is the primary niche.** Supersedes the Jul 26 close that had
  industrial/energy primary.
- **Alliance Driveaway naming rights are cleared.** No longer a blocker anywhere.
- **The trucking product gets its own domain** — it ships as platform + implementation +
  monthly retainer, so it's a product brand, not a service line. Rationale and the
  alphasquared.ca / product-domain content split are in §13 of the research.
- **The three AEO pages go on the product domain, not alphasquared.ca** — "driveaway
  dispatch software" is a product query. Secure the name and domain *before* writing them;
  migrating later throws away the authority they accrue.

### Direction A vs Direction B

Direction B exists because the EternaCloud aesthetic is right for the agency and likely
wrong for a VP of Operations comparing dispatch systems. Sampled from the category's own
leaders (measured off their live sites, 2026-07-28):

| | Truckbase | Motive | **Direction A** | **Direction B** |
|---|---|---|---|---|
| Background | White | White | Dark slate `#101418` | White / steel |
| Ink | Navy `#001A46` | Near-black | White on slate | Near-black navy `#0b1220` |
| Heading weight | 700 | 500 | 500 | **700** |
| Accent | Blue + coral | Almost none | Blue→teal→orange gradient | Trust blue + high-vis amber |
| Radii | 4–10px | tight | 10–44px | 5–8px |
| Media | 257 images | 34 images + 11 video | generated canvas | product UI mock |

Neither leader uses a dark base or gradient glow. B follows the category: light,
high-contrast, bold type, tight radii, a real dispatch-board mock instead of an abstract
visual, a comparison **table** (this audience reads tables), and restrained functional
motion. It is also materially lighter — vanilla JS, no GSAP/Lenis/SplitType (~4KB vs
~140KB of libraries) — and the page is 7,049px tall against A's 9,222px. Density reads as
substance to an operator.

Assets are fully separate (`css/operator.css`, `js/operator.js`), so choosing one does not
constrain the other.

### Trucking version — what drives the copy

Every section maps to the research rather than to generic vertical marketing:

| Section | Source |
|---|---|
| Hero + "four broken assumptions" | §7 Gap 1 — the driveaway software vacuum |
| Six platform modules | §7 Gaps 3, 4, 5, 6, 7 |
| "Why now" numbers (−2.3%, $520k, 5–12%) | §4.1, §4.3, §4.2 — attributed on-page |
| Buyer's-alternative comparison | §11 pricing logic, MC-12's buyer's-alternative test |
| Four-step ladder (free benchmark → audit → deploy → stay on) | §11 offer ladder |

Prices from the §11 ladder are deliberately **not** on the page — mid-market buyers
expect a scoped conversation. Add them if you want to pre-qualify harder.

## Remaining pages

| File | Status |
|---|---|
| `services.html` | not yet built — nav/footer already link to it |
| `case-studies.html` | not yet built |
| `about.html` | not yet built |

## Local preview

```bash
python3 -m http.server 8741 --directory "/Users/mac/Documents/Alpha Squared/Portfolio/Latest/alphasquared-2026"
```

Also registered in `.claude/launch.json` as `alphasquared-2026`.

## ⚠️ Confirm before launch

- ~~**Alliance Driveaway naming rights.**~~ ✅ **Cleared 2026-07-28.** The name is used
  freely across the trucking pages.
- **Client naming rights (general).** Chevron / ExxonMobil / ADNOC are named as *end users of
  FluidsData*, and Levi Strauss / Salesforce / Honeywell as places Abdullah has worked —
  not as Alpha Squared clients. The current wording ("work delivered for teams at",
  "used by teams at") reflects that, but confirm permission before going live.
- **Industry statistics** on the trucking page (−2.3% margin, $520k, 5–12%) are attributed
  on-page to ATRI / Verisk CargoNet / FMCSA / ATA via the research doc. Re-verify against
  the primary sources before publishing — they are the page's credibility.
- **"Live truck tracking and intelligent assignment are in build"** is stated as
  in-progress, not shipped. Keep it that way until it ships.
- **Rizwan's bio** on the homepage is written from the workspace's own notes; have him
  approve the wording.
- **Contact** points at `mailto:hello@alphasquared.ca` — swap for the real inbox or a
  form endpoint.
- **Stats** (265+ projects, 17 countries, 350+ drivers, 48 states) come from the profile
  fact sheet. Verify before publishing.
- **Analytics** — none installed.
- Google Fonts loads from `fonts.googleapis.com`; self-host if you want zero third-party
  requests.

## Accessibility / resilience

- Everything is readable with JS disabled — reveal start-states are gated behind a
  `.js-on` class that only JS adds.
- `prefers-reduced-motion` kills transforms, stops the canvas rotations, and reveals all
  content immediately.
- Canvas loops skip work when their element is off-screen.
