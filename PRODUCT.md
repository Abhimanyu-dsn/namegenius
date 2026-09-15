# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui. Dev: `npm run dev` from this directory.

## Users

General audience — anyone naming a company, product, or project who needs viable options quickly, without a specialized naming background.

## Product Purpose

NameGenius helps people move from a rough idea to a shortlist of names they can realistically own. Success means the user finds names that fit their concept, pass an ownability check (domains now; trademarks planned), and can be saved and compared without losing progress.

## Positioning

Ownability-first naming: domain availability, trademark viability, and brand-fit signals in one flow — not just a list of clever words. The product thesis is that a good name is one you can register, defend, and grow into.

## Operating Context

- Primary surfaces today: name brief (`/`) for input; results (`/results`) for browsing suggestion cards; shortlist (`/shortlist`) for saved names.
- Users describe a name, project description, competitors/keywords, and TLD preference on `/`, then navigate to `/results` to view and refresh suggestion cards.
- Brief fields and refresh seed travel in URL query params (`lib/search-params.ts`); shortlist persists in browser `localStorage`.
- Current build is a functional UI prototype: suggestions and domain status come from mock data (`lib/mock-data.ts`), not live APIs.

## Capabilities and Constraints

**Shipped (UI / client):**

- S1 brief (`/`): name, description (1000 char cap), competitors & keywords, TLD preference, **Find names** navigation to results.
- S2 results (`/results`): five-card suggestion grid, **Edit search** back to brief, **Regenerate** (mock seed swap across three pools), TLD chip filtering from brief.
- Per-card: domain + availability badge, brand match score, TLD chips, save to shortlist, **Check availability** and **More like this** (prototype feedback only; not wired to external services).
- Shortlist page with empty state and clear-all.

**Planned (confirmed, not implemented):**

- Real-time trademark catalog search (UI copy references this today; treat as planned capability, not current fact).
- Live domain availability checks beyond mock TLD status.

**Terminology:**

- **Suggestion card** — a generated name option with match and domain signals.
- **Brand match** — contextual fit score derived from user inputs (currently computed from mock/heuristic logic).
- **Shortlist** — user-curated saved names.

**Open decisions:**

- Backend/API provider for domains and trademarks.
- Authentication, billing, and persistence beyond localStorage.
- Whether “Engine version v3.2-PRO” remains product copy or becomes real packaging.

## Brand Commitments

- Product name: **NameGenius**
- Tagline: **Find a name you can own**
- Metadata description: check domain availability and generate on-brand name suggestions.
- Existing UI uses restrained monochrome actions on result cards, Inter typography, and uppercase section labels on brief fields; header retains orange accent on logo and shortlist badge.

## Evidence on Hand

- Mock name templates and generation logic: `lib/mock-data.ts`
- Brand match heuristics: `lib/brand-match.ts`
- No real customer testimonials, case studies, benchmark data, or press assets in the repository — future marketing must not fabricate these.

## Product Principles

1. **Ownability over cleverness** — surface whether a name can be owned (domain, and eventually trademark) before the user falls in love with it.
2. **Context-rich generation** — suggestions should reflect concept, competitors, and description, not random word lists.
3. **Shortlist as workspace** — naming is comparative; saving and revisiting options is core, not an extra.
4. **Honest signals** — distinguish mock/planned capabilities from live data; do not imply trademark or domain checks that are not wired.
5. **Low friction entry** — users can explore default suggestions without filling every field first.

## Accessibility & Inclusion

No product-specific accessibility standard confirmed yet. Default web affordances apply (semantic structure, labels on inputs, keyboard-reachable controls).
