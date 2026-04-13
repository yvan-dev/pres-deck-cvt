---
id: US-020
title: Prepare the local build, optional preview, and rehearsal handoff
epic: Demo Framing, Closure, and Release Readiness
agent: DevOps
phase: P4
priority: should
status: inprogress
---

# US-020 - Prepare the local build, optional preview, and rehearsal handoff

## Story

As a delivery owner, I want a reliable local build path, optional Vercel preview, and rehearsal checklist, so that the final deck can be reviewed and presented under real operating conditions.

## Acceptance Criteria

1. Given the deck is local-first, when delivery readiness is finalized, then the local build and run path is documented and repeatable.
2. Given remote review may still help, when preview support is prepared, then optional Vercel deployment remains available without becoming a runtime dependency for the product.
3. Given the speaker needs to rehearse under real conditions, when the handoff is completed, then it includes a concise checklist for navigation, fullscreen, demo readiness, and fallback behavior.

## Notes

- Optional remote preview remains secondary, but local build and rehearsal readiness are part of the required delivery path.
- The repo already documents the basic local commands and optional preview direction, but the rehearsal handoff is not complete yet.
