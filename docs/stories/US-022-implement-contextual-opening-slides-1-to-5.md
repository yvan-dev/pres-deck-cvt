---
id: US-022
title: Implement contextual opening slides 1 to 5
epic: Deck Baseline and Opening Narrative
agent: Frontend
phase: P4
priority: must
status: review
---

# US-022 - Implement contextual opening slides 1 to 5

## Story

As an audience member, I want the opening context slides to establish the talk's scope, urgency, and AOT positioning, so that the maturity and proof sections start from a clear narrative baseline.

## Acceptance Criteria

1. Given slides 1 to 5 are registered in `src/lib/slides.config.ts`, when the opening block is reviewed, then cover, summary, speaker stance, market shift, and AOT positioning are implemented as production slides.
2. Given the intro section sets the tone for the whole deck, when these slides are reviewed, then they reuse shared panels, metrics, and positioning patterns rather than bespoke one-off shells.
3. Given the opening must establish the deck-first thesis, when slides 1 to 5 are presented, then they frame the objective, urgency, and AOT target clearly in French.

## Notes

- The repository already contains these slides in `src/components/slides/01-cover.tsx` through `05-positioning.tsx`.
