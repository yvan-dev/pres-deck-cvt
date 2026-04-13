# ADR 004: Local-First, Projection-Safe Runtime

- Status: Accepted
- Date: 2026-04-13
- Related stories: `US-012`, `US-020`

## Context

The deck is meant for a live presentation in real projection conditions. Reliability matters more than architectural ambition. The current app already runs with:

- local TypeScript content modules;
- static assets from `public/**`;
- browser-managed fullscreen;
- no required remote API, auth flow, or database.

Introducing online dependencies into the main deck path would increase rehearsal and presentation risk.

## Decision

Keep the presentation runtime local-first and projection-safe.

This means:

- the main deck route must render from bundled code, local content modules, and static assets only;
- no database, API, or auth dependency may be placed on the critical presentation path;
- every live-demo-dependent message must also have a prepared non-live fallback;
- projection readability, keyboard navigation, and fullscreen behavior are first-order runtime requirements.

## Consequences

Positive:

- the deck can be rehearsed and presented with minimal operational dependency;
- failure modes stay understandable and controllable;
- the live demo remains a bounded proof surface, not a single point of failure.

Trade-offs:

- remote editorial features remain out of scope for the core runtime;
- richer dynamic preview workflows, if ever needed, must stay clearly off the critical path;
- future contributors must resist adding convenience fetches or protected flows to `/`.

## Rejected alternatives

- Remote-first presentation runtime:
  too fragile for live delivery.
- Treat the live demo as the only proof path:
  this weakens the deck whenever conditions degrade.
