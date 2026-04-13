---
id: US-006
title: Implement reusable visual primitives and fallback states
epic: Deck Foundation and Projection Reliability
agent: Frontend
phase: P4
priority: should
status: review
---

# US-006 - Implement reusable visual primitives and fallback states

## Story

As a frontend developer, I want reusable slide primitives for diagrams, metrics, timelines, and fallback evidence blocks, so that later slide implementation stays consistent and faster to iterate.

## Acceptance Criteria

1. Given the approved architecture and design rules, when reusable primitives are implemented, then they cover comparison layouts, metrics, workflows, timelines, and fallback evidence states.
2. Given the ACTON design language, when the primitives are reviewed, then they align with existing tokens, surfaces, and projection-safe typography.
3. Given missing or evolving proof assets, when a fallback state is rendered, then it remains honest, audience-safe, and easy to replace later without restructuring the slide tree.

## Notes

- This story reduces repeated bespoke layout work in the content-heavy epics.
