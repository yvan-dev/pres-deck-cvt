---
id: US-005
title: Harden deck navigation and projection behaviors
epic: Deck Foundation and Projection Reliability
agent: Frontend
phase: P4
priority: must
status: review
---

# US-005 - Harden deck navigation and projection behaviors

## Story

As a presenter, I want the shell navigation, projection controls, and recovery behaviors to feel reliable, so that I can deliver the talk without mouse-driven workarounds or live confusion.

## Acceptance Criteria

1. Given the deck shell, when keyboard interactions are exercised, then next, previous, home, end, overview, fullscreen, and black-screen behaviors all work consistently.
2. Given URL-based slide selection, when an invalid or out-of-range slide is requested, then the active slide is clamped safely to the valid deck range.
3. Given overview mode and black-screen mode, when the presenter enters and exits those states, then active slide context is preserved and the shell remains stable in fullscreen and local presentation conditions.

## Notes

- This is the core shell-hardening implementation story for the speaker experience.
