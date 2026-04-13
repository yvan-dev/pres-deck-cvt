---
id: US-021
title: Establish deck foundation and presentation theming
epic: Deck Baseline and Opening Narrative
agent: Frontend
phase: P4
priority: must
status: review
---

# US-021 - Establish deck foundation and presentation theming

## Story

As a presenter, I want the deck app foundation, theme tokens, metadata, and shared content sources to be in place, so that every slide runs inside a stable branded presentation shell.

## Acceptance Criteria

1. Given the current Next.js deck app, when the foundation is reviewed, then the app entry route, metadata, fonts, CSS tokens, and shared content modules are wired consistently.
2. Given the deck is local-first, when the baseline is exercised, then the presentation launches from a single route and supports the documented dev, build, and lint commands.
3. Given projection-safe branding matters, when the theme foundation is reviewed, then the ACTON palette, typography, shell treatments, and focus styles support the current visual direction.

## Notes

- The repository already contains this baseline in `package.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and `src/content/*`.
