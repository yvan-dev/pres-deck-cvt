---
id: US-019
title: Polish the full 39-slide deck and validate presentation regressions
epic: Demo Framing, Closure, and Release Readiness
agent: QA
phase: P4
priority: must
status: backlog
---

# US-019 - Polish the full 39-slide deck and validate presentation regressions

## Story

As a QA reviewer, I want the complete deck flow, navigation, readability, and polish validated, so that the speaker can rehearse and present without critical regressions.

## Acceptance Criteria

1. Given the full slide set is implemented, when the deck is validated, then all 39 slides are reachable, correctly ordered, and free of production-blocking placeholders.
2. Given the presenter depends on shell controls, when regression testing is performed, then keyboard navigation, overview, fullscreen, black-screen mode, and progress all pass the agreed checks.
3. Given the deck is intended for projected delivery, when quality validation is completed, then readability, motion behavior, fallback states, and visual polish are reviewed and any blocking issues are captured before the CVT run.

## Notes

- This story should produce actionable findings, not just a pass/fail statement.
