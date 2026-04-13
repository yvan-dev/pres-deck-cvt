---
id: US-003
title: Define projection-safe visual and interaction patterns
epic: Deck Foundation and Projection Reliability
agent: Design
phase: P3
priority: must
status: review
---

# US-003 - Define projection-safe visual and interaction patterns

## Story

As a UX designer, I want an explicit visual system for projection, pacing, and reusable slide layouts, so that the deck remains coherent, legible, and premium across all 39 slides.

## Acceptance Criteria

1. Given the ACTON token system in `src/app/globals.css`, when the visual system is defined, then it covers typography, spacing, contrast, panel styles, diagram patterns, metric patterns, and CTA layouts without discarding the current brand direction.
2. Given live presentation constraints, when interaction guidance is documented, then overview mode, progress display, focus visibility, and reduced-motion behavior are all addressed.
3. Given later slide implementation stories, when reusable patterns are specified, then they can be applied consistently across maturity, D2R2, BMAD, AI pole, and closing slides.

## Notes

- This is a P3 design-system story, not a code-only implementation task.
