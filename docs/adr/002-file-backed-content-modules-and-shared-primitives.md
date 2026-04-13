# ADR 002: File-Backed Content Modules and Shared Primitives

- Status: Accepted
- Date: 2026-04-13
- Related stories: `US-002`

## Context

The deck already mixes two healthy patterns:

- reusable typed data in `src/content/levels.ts` and `src/content/metrics.ts`;
- reusable visual primitives in `src/components/shared/*`.

The unfinished sections will add more narrative data: D2R2 proof points, BMAD and LangGraph flow descriptions, AI pole roadmap content, demo guardrails, and closure resources.

If those facts are embedded ad hoc inside slide files, later refinements will require broad rewrites and make consistency harder to preserve.

## Decision

Keep reusable narrative facts file-backed under `src/content/*` and reusable UI blocks under `src/components/shared/*`.

Apply the following rule:

- if data is reused, structured, or likely to evolve independently from one slide layout, it belongs in `src/content/*`;
- if a visual pattern appears on multiple slides, it belongs in `src/components/shared/*`;
- slide files should compose these inputs, not become the long-term source of truth.

## Consequences

Positive:

- metrics, maturity definitions, and future evidence data can change without redesigning the slide tree;
- shared primitives keep the deck visually coherent;
- Git diffs stay focused on either content or layout instead of both at once;
- AI-agent implementation work has clearer boundaries.

Trade-offs:

- small one-off slide copy may still remain local to the slide;
- introducing new typed content modules adds a bit of upfront structure work;
- implementers must decide deliberately when to promote local constants into shared sources.

## Rejected alternatives

- Put all content directly in slide files:
  faster initially, but it scales poorly across 39 slides.
- Add a CMS or remote data source now:
  this adds runtime and editorial complexity with no benefit for the current deck-first product.
