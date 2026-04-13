---
id: US-023
title: Implement slide 6 maturity overview anchor
epic: Deck Baseline and Opening Narrative
agent: Frontend
phase: P4
priority: must
status: review
---

# US-023 - Implement slide 6 maturity overview anchor

## Story

As an audience member, I want a strong maturity overview slide before the detailed levels, so that the rest of the section has a clear frame of reference.

## Acceptance Criteria

1. Given slide 6 is registered in `src/lib/slides.config.ts`, when the maturity overview is reviewed, then it clearly presents all five levels, the N2-to-N3 inflection, and AOT target markers.
2. Given the deck already exposes centralized maturity content, when the overview is updated later, then the slide continues to draw from shared content modules and shared cards instead of duplicated slide-local facts.
3. Given projection readability matters, when the slide is reviewed, then labels, chips, autonomy signals, and positioning markers remain legible at a glance.

## Notes

- The repository already contains this slide in `src/components/slides/06-maturity.tsx` and its supporting shared/content modules.
