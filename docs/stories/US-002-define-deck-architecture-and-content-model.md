---
id: US-002
title: Define the deck architecture and content model
epic: Deck Foundation and Projection Reliability
agent: Archi
phase: P2
priority: must
status: review
---

# US-002 - Define the deck architecture and content model

## Story

As a solution architect, I want a clear slide architecture and content model around the existing shell, so that implementation work extends the current Next.js deck instead of fragmenting it.

## Acceptance Criteria

1. Given the existing `Deck`, `DeckProvider`, and `slides.config.ts`, when the architecture is defined, then slide registration, shared content modules, and component ownership are documented with `slides.config.ts` kept as the canonical deck map.
2. Given future refinements to metrics, screenshots, metadata, and branding, when content-source conventions are specified, then those inputs can change without requiring slide-tree redesign.
3. Given the current placeholder pattern for slides 7 to 39, when the architecture is finalized, then the plan explicitly replaces placeholder factories with production slide components.

## Notes

- No standalone architecture document exists in the repo, so this story formalizes architecture from the current implementation and PRD.
