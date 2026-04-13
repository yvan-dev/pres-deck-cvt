# ADR 003: Honest Proof Assets and Fallback States

- Status: Accepted
- Date: 2026-04-13
- Related stories: `US-002`, `US-009`

## Context

The deck needs to prove level-3 value through D2R2, but the repository does not yet contain the full evidence pack:

- D2R2 screenshots are still pending;
- several metrics are still estimates;
- slides 7 to 39 are currently placeholders.

The deck must stay credible to engineers and sponsors even while evidence is still being assembled.

## Decision

Adopt explicit honesty as an architectural rule for proof content and degraded states.

That means:

- placeholder slides are allowed during production but are treated as temporary scaffolding only;
- estimated metrics remain visibly labeled as estimates;
- missing screenshots or live-demo steps degrade to labeled fallback summaries;
- only sanitized, approved runtime assets are committed under `public/**`;
- the deck must never imply that a proof asset exists when it is still pending.

## Consequences

Positive:

- the deck remains trustworthy while assets are incomplete;
- D2R2 proof can improve iteratively without structural rewrites;
- fallback behavior supports rehearsal and live delivery under imperfect conditions.

Trade-offs:

- some slides will look intentionally incomplete until proof assets arrive;
- authors must curate provenance and redaction before committing evidence;
- the team cannot hide uncertainty behind polished visuals.

## Rejected alternatives

- Fake or heavily implied proof states:
  unacceptable for a technical CVT.
- Block all progress until every proof asset exists:
  too rigid and unnecessary for the current production phase.
