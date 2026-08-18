# Approach — working notes

Draft strategy doc for the Pets Are Kids senior Shopify dev assessment. This is the working version — condense into something short and client-readable before sending (see "Deliverables" at bottom).

## Brief recap

- Convert the Figma LP into a production-ready Shopify build. Mobile-first.
- Quality over coverage: 1–2 sections built to a real production standard beats a rushed full page.
- Base theme: Horizon (repo was re-scaffolded from Dawn to Horizon mid-build; see AI workflow notes below).
- Deliverables: public GitHub repo, publicly viewable live preview (no password), short recording.
- Recording must cover: judgment calls, reusability structure, how a non-technical teammate could use this with AI, how build speed was kept from becoming tech debt, how AI was used in the workflow.

## Scope decision

**Resolved.** Built two sections, deliberately chosen to be structurally different so the recording can show range rather than the same pattern twice:

- **Hero** (`sections/pak-hero.liquid`, Figma node `18:36`) — headline, rating line, CTA, guarantee, 3-icon trust row, before/after image comparison. Strongest CRO signal; showcases a static CTA rendered through Horizon's own stock `button` block, plus a real merchant-addable/reorderable block type for the trust icons.
- **FAQ** (`sections/pak-faq.liquid`, Figma node `18:666`) — accordion built on native `<details>`/`<summary>`, zero custom JS. Showcases a pure repeating-block section (`pak-faq-item`) and a different technical pattern (disclosure/accordion) than the Hero.

## Technical approach

- Online Store 2.0 conventions throughout: independent sections in `sections/`, added via `templates/index.json`, fully editable in the theme editor. This matches how Dawn itself is built and is what "reusable, not one-off" means in Shopify terms.
- Reuse Dawn's existing CSS conventions/utility classes and JS patterns (e.g. `component-*.css` naming, existing button/badge styles) instead of introducing a parallel styling system — keeps the diff small and keeps future devs from having to learn a second convention.
- New section files named descriptively and namespaced to avoid clashing with Dawn's stock sections, e.g. `sections/pak-hero.liquid`, `sections/pak-testimonials.liquid` (`pak` = Pets Are Kids, makes custom vs. stock sections obvious at a glance).

## Reusability plan (naming, schema, blocks)

- Every piece of copy, every image, and every repeatable unit (icon+label pairs, testimonial cards, FAQ rows) goes through the schema as a `setting` or `block` — nothing hardcoded that a CRO tester would plausibly want to change.
- Blocks used for anything that repeats a variable number of times (trust icons, testimonials, FAQ items) so a non-technical teammate can add/remove/reorder from the theme editor without touching code.
- Section-level settings for one-off structural toggles (e.g. show/hide guarantee badge, CTA button text/link) rather than burying them in theme.liquid or global settings.
- Sensible defaults + `presets` block in the schema so a new instance of the section drops in with realistic placeholder content already filled in — this is also what makes it easy for someone to spin up a variant fast.

## Judgment calls log

Track decisions made where the Figma/brief left things open, with the reasoning, so this can be read straight into the recording:

- [ ] Countdown timer in the top announcement bar — Figma shows a static "15:35:10", need to decide if this ships as a real live countdown (JS) or stays a static/editable string for CRO copy testing.
- [ ] Image placeholders — brief says leave as-is or source own. Decision: [TBD]
- [ ] Rating stars / review count — likely a static setting rather than pulling live from an app integration, since no reviews app is specified.
- [x] **Hero headline line breaks** — Figma's H1 layer has manual line breaks baked in ("A Natural Way / to Protect Your / Dog's Spine"). Shipped as a single plain-text setting with CSS `text-wrap: balance` + `max-width` instead of hardcoded `<br>` tags. A merchant-typed replacement headline of a different length would break badly with hardcoded breaks; letting CSS wrap it holds up across screen sizes and edited copy.
- [x] **Icon substitutions** — Horizon's stock icon set (`blocks/icon.liquid`) has no literal "spine/nerve" or "mushroom" icon. Mapped: heart → nerve/spine health, check_box → vet-formulated, leaf → mushrooms/natural. Close enough visually, fully swappable per-instance since the icon is a real block setting, not hardcoded markup.
- [x] **CTA as a static theme block, not a section setting** — Rather than adding `cta_label`/`cta_link` settings on the hero section, the CTA renders via `{% content_for 'block', type: 'button', id: 'hero_cta' %}`, a static (fixed-position, non-reorderable, non-duplicable) instance of Horizon's own stock `button` block. This gets us Horizon's real button styling/settings (color, width, style variant) for free and keeps one canonical button implementation in the theme instead of a second hand-rolled one.
- [x] **Trust-icon row as real merchant-addable blocks** — matches the Figma's repeating 3-icon pattern, but built as genuine reorderable/removable/addable `pak-trust-icon` blocks (not a fixed 3-item loop) so a CRO test can try 2, 4, or reordered icons from the theme editor with no code change.
- [x] **Small promo badge nearly missed** — first pass at cataloguing the hero's contents (before building) missed a floating "35% Off + Free Gifts" badge overlapping the before/after image pair (distinct from the top-of-page announcement bar, which has the same copy plus a countdown). Caught it re-reading the actual `get_design_context` output before building, not after. Added as its own optional section setting (`promo_badge_text`, blank to hide).
- [x] **Static blocks excluded from `block_order`** — Shopify's schema validator rejects a static block id appearing in `block_order` (confirmed via the official `shopify-liquid` skill's `validate.mjs`). `block_order` only lists the dynamic/addable blocks (the trust icons); the static CTA button is rendered by its own explicit `content_for` call.
- [x] **`templates/index.json` requires every section key to appear in `order`** — orphaning the old stock `hero_jVaWmY` entry (leaving it defined but unlisted) failed Shopify's real upload validation ("Section id must exist in order"), not just theme-check. Removed it outright rather than leaving dead data, since a page shouldn't ship two stacked hero-style sections anyway.
- [x] **FAQ has no designed expanded state or answer copy** — the Figma only shows the 5 FAQ rows collapsed, with a "+" icon; there's no expanded/answer styling in the design at all, and no answer text. Built it as a native `<details>`/`<summary>` accordion (zero JS, accessible by default, `+`/`−` toggle via pure CSS), styled the expanded answer consistently with the page's existing muted body-copy treatment, and wrote placeholder answer copy myself using deliberately soft, non-overclaiming language ("many pet parents notice," not guaranteed outcomes) since this is a supplement product — reusing the same 90-day guarantee framing already established in the Hero for consistency.

## Keeping build speed from becoming tech debt

- Run Lighthouse/PageSpeed against the dev preview before calling a section done — flag anything that regresses LCP/CLS (usually hero image loading strategy and web font loading).
- **Gotcha worth remembering**: `{% content_for 'blocks' %}` auto-wraps every rendered theme block in its own `<div class="shopify-block">`. A sibling-combinator CSS rule (`.item + .item`) written inside the block file itself will silently never match, since the actual DOM siblings are the wrapper divs, not the block's own root element. Spacing between repeated blocks belongs on the parent container (flex/grid `gap`), not as inter-block margin — caught this in the FAQ section when spacing changes weren't showing up despite the CSS syncing correctly.
- Lean on native `<img>` responsive attributes (`srcset`/`sizes`) and Shopify's `image_url` filters rather than hand-rolled breakpoints.
- No new JS dependencies unless Dawn doesn't already solve the problem — check `assets/` for an existing pattern before writing a new script.
- Liquid kept boring and readable over clever: favor straightforward `{% for block in section.blocks %}` loops over deep snippet nesting, since the brief explicitly says the muscle being tested is turning a design into a *clean* build fast, not a maximally abstracted one.

## AI workflow notes

- Figma MCP used to pull structured node data (text content, layout, spacing) directly from the design file rather than eyeballing a screenshot — keeps copy and dimensions accurate to source.
- Claude Code used for scaffolding section Liquid/schema and iterating against the local `shopify theme dev` preview.
- Added a personal `.claude/skills/` pack mid-build, including the official Shopify `shopify-liquid` skill (enforces Liquid/schema validation against Shopify's own docs via `search_docs.mjs`/`validate.mjs` before code is considered done) and two of my own skills carried over from other client work (`dose-theme-development`, `dose-section-architecture`) encoding conventions I use day to day — BEM naming, semantic size tokens instead of raw `h1`–`h6`, no hardcoded px values, eager-loading/`fetchpriority: high` for above-the-fold LCP images, WebKit `backdrop-filter` prefixing, `min_blocks`/`max_blocks` UX guardrails on schema.
- Explicit judgment call: those two personal skills reference a different (client) repo's specific files (`dose-section.liquid`, `AGENTS.md`, `DESIGN.md`) that don't exist here, and one rule calls for deleting "legacy" theme files on replacement — which would mean deleting Shopify's own stock Horizon files in this repo. Decided to import the *principles* only, adapted to Horizon's actual token names and file structure, and to leave the literal client-specific architecture and the file-deletion rule out — applying a client's internal repo policy to an unrelated assessment repo verbatim would have been the wrong call.
- Reusability-via-AI angle for the recording: once schema/blocks/naming conventions are established here, a non-technical teammate could hand a new Figma variant + this repo to an AI coding tool and get a new section/page variant scaffolded in the same pattern, without a developer in the loop for every CRO test.

## Deliverables checklist

- [x] 1–2 sections built to production standard (Hero + FAQ, both validated and live-tested)
- [ ] Pushed to public GitHub repo — remote connected (`github.com/muayKenny/p4k`), earlier commit pushed; this session's changes (FAQ section, docs updates) still need a commit + push
- [ ] Live preview link, password removed / publicly viewable — dev store still has the storefront password gate on; needs to come off (or a password-bypass link shared) before sending the link
- [ ] Recording: judgment calls, reusability structure, AI-enabled non-dev workflow, speed-vs-tech-debt process, AI usage in this build
- [ ] This doc condensed into something short and readable to send alongside the recording
