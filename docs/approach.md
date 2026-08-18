# Approach — working notes

Draft strategy doc for the Pets Are Kids senior Shopify dev assessment. This is the working version — condense into something short and client-readable before sending (see "Deliverables" at bottom).

## Brief recap

- Convert the Figma LP into a production-ready Shopify build. Mobile-first.
- Quality over coverage: 1–2 sections built to a real production standard beats a rushed full page.
- Base theme: Dawn (already scaffolded in this repo).
- Deliverables: public GitHub repo, publicly viewable live preview (no password), short recording.
- Recording must cover: judgment calls, reusability structure, how a non-technical teammate could use this with AI, how build speed was kept from becoming tech debt, how AI was used in the workflow.

## Scope decision

**Open — needs a decision before starting build.**

The Figma page has ~15 stacked sections (hero, trust badges, guarantee, ingredients, testimonials, FAQ, etc.). Candidates for the 1–2 sections to build to full production standard:

- **Hero section** (`18:36` in Figma) — headline, rating line, CTA button, guarantee line, 3-icon trust row. Strongest CRO signal, most reusable across future LPs, good showcase of settings/blocks (icon row is a natural block type).
- [Second section TBD — pick something structurally different from the hero to show range, e.g. testimonials or FAQ (accordion/block-heavy) rather than another static content block.]

Recommendation: hero + one block-heavy section (testimonials or FAQ) — shows both "static content section done well" and "repeating block pattern done well" in one recording.

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
- [ ] (add more as they come up during build)

## Keeping build speed from becoming tech debt

- Run Lighthouse/PageSpeed against the dev preview before calling a section done — flag anything that regresses LCP/CLS (usually hero image loading strategy and web font loading).
- Lean on native `<img>` responsive attributes (`srcset`/`sizes`) and Shopify's `image_url` filters rather than hand-rolled breakpoints.
- No new JS dependencies unless Dawn doesn't already solve the problem — check `assets/` for an existing pattern before writing a new script.
- Liquid kept boring and readable over clever: favor straightforward `{% for block in section.blocks %}` loops over deep snippet nesting, since the brief explicitly says the muscle being tested is turning a design into a *clean* build fast, not a maximally abstracted one.

## AI workflow notes

- Figma MCP used to pull structured node data (text content, layout, spacing) directly from the design file rather than eyeballing a screenshot — keeps copy and dimensions accurate to source.
- Claude Code used for scaffolding section Liquid/schema and iterating against the local `shopify theme dev` preview.
- [Add specifics as the build progresses — this section becomes the "how AI was used" part of the recording.]
- Reusability-via-AI angle for the recording: once schema/blocks/naming conventions are established here, a non-technical teammate could hand a new Figma variant + this repo to an AI coding tool and get a new section/page variant scaffolded in the same pattern, without a developer in the loop for every CRO test.

## Deliverables checklist

- [ ] 1–2 sections built to production standard
- [ ] Pushed to public GitHub repo
- [ ] Live preview link, password removed / publicly viewable
- [ ] Recording: judgment calls, reusability structure, AI-enabled non-dev workflow, speed-vs-tech-debt process, AI usage in this build
- [ ] This doc condensed into something short and readable to send alongside the recording
