# ADR 001: Single-Route Deck Shell and Canonical Slide Registry

- Status: Accepted
- Date: 2026-04-13
- Related stories: `US-002`

## Context

The repository is not building a multi-page product. It is building one presentation deck. The current implementation already uses:

- one public route at `/`;
- one client deck shell in `src/components/deck/Deck.tsx`;
- one query-parameter navigation model in `DeckProvider`;
- one canonical slide registry in `src/lib/slides.config.ts`.

The main architectural risk is fragmentation: per-slide routing, duplicated ordering metadata, or slide registration outside the registry.

## Decision

Keep the runtime as a single-route deck with `slides.config.ts` as the only canonical slide map.

That means:

- `/` remains the deck entry route;
- `?slide=` remains the only public runtime navigation parameter;
- slide order, titles, part labels, and mounted component ownership remain centralized in `slides.config.ts`;
- new slide work replaces placeholder entries in the registry rather than adding alternate routing structures.

## Consequences

Positive:

- stable deep links for rehearsal and review;
- no mismatch between overview, progress dock, and actual slide order;
- lower implementation overhead for the remaining 33 slides;
- easier AI-agent consistency because slide registration lives in one file.

Trade-offs:

- slide-level routing and route metadata stay intentionally minimal;
- deck-wide changes still pass through the registry file;
- quick-jump behavior stays bounded by the central runtime model rather than route expansion.

## Rejected alternatives

- Route per slide:
  this adds routing complexity without helping a live deck.
- Slide-local self-registration:
  this creates ordering drift and weakens the overview/progress shell.
