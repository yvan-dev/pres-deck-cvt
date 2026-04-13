---
id: US-001
title: Lock deck scope and evidence inventory
epic: Deck Foundation and Projection Reliability
agent: PM
phase: P1
priority: must
status: review
---

# US-001 - Lock deck scope and evidence inventory

## Story

As a deck owner, I want the final narrative scope, source-of-truth slide inventory, and missing evidence list to be explicit, so that the backlog stays focused on the CVT deck rather than delivery tooling.

## Acceptance Criteria

1. Given `docs/prd.md`, `README.md`, and `plans/deck-plan.md`, when the scope baseline is reviewed, then the 39-slide and 7-part narrative structure is confirmed as the delivery target and each part has a documented purpose.
2. Given the open inputs identified by the PRD, when the evidence inventory is produced, then D2R2 metrics, screenshots, CVT date, and AOT brand assets are classified as either required inputs or approved fallbacks.
3. Given later decomposition work, when new stories are created, then none of them reframe BMAD, the tracker, or validation gates as the product itself.

## Notes

- This story protects the deck-first framing called out as critical in the PRD.
- The outputs of this story feed every later planning and implementation story.
