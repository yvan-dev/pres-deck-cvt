---
id: US-009
title: Curate the D2R2 proof pack and evidence rules
epic: D2R2 Proof by Example
agent: PM
phase: P1
priority: must
status: inprogress
---

# US-009 - Curate the D2R2 proof pack and evidence rules

## Story

As a product owner, I want a curated set of D2R2 proof points, metrics assumptions, and fallback evidence rules, so that the proof section stays factual even before every asset is finalized.

## Acceptance Criteria

1. Given open D2R2 inputs in the PRD, when the evidence pack is curated, then workflow claims, metrics assumptions, screenshot targets, and fallback text are documented.
2. Given mixed certainty across current proof points, when the pack is finalized, then each claim is labeled as confirmed, estimated, or pending.
3. Given the deck must remain credible to sponsors and engineers, when proof points are selected, then each one directly supports the level-3 thesis and excludes weak tool-centric claims.

## Notes

- This story feeds both D2R2 implementation stories and constrains how missing evidence is presented.
- The repo already contains partial D2R2 inputs in `src/content/metrics.ts`, but the proof pack is not yet complete.
