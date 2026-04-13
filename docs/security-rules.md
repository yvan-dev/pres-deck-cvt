---
title: pres-deck-cvt Security Rules
status: review
owner: Security
lastUpdated: 2026-04-13
sourceDocuments:
  - docs/architecture.md
  - docs/threat-model.md
relatedStories:
  - US-004
---

# pres-deck-cvt Security Rules

## 1. Purpose

These rules define the minimum security bar for `pres-deck-cvt`. They apply to the public deck, local rehearsal builds, optional remote previews, and any future protected editorial features. The intent is practical: keep the presentation path safe, keep sensitive material out of the deck, and prevent future feature work from introducing avoidable OWASP-class flaws.

## 2. Security Baseline

Non-negotiable baseline:

1. The main presentation route must remain usable without remote auth, database access, or third-party API availability.
2. Public deck rendering may only use approved in-repo content, sanitized text, and static assets.
3. Secrets, tokens, internal URLs, and confidential identifiers must never appear in slide content, screenshots, or client bundles.
4. Any future protected preview or editorial feature must enforce authorization on the server side, not in the client.
5. Every future API must be optional for deck rendering and must fail without breaking the live presentation route.

## 3. OWASP Mapping

| OWASP area | Project rule |
| --- | --- |
| A01 Broken Access Control | Protected features require server-side authorization checks at the Route Handler and DAL boundary. |
| A02 Cryptographic Failures | Secrets stay server-side only; never embed credentials or sensitive exports in slides or assets. |
| A03 Injection | Do not render untrusted HTML in slides; sanitize external text before storage or rendering. |
| A04 Insecure Design | Keep the public deck path separate from optional protected workflows and require offline-capable fallbacks. |
| A05 Security Misconfiguration | Remote previews must use host/platform protection before custom auth is considered. |
| A06 Vulnerable and Outdated Components | Dependency updates must be reviewed, pinned through lockfiles, and verified in build output. |
| A07 Identification and Authentication Failures | If auth is introduced, session validation happens on the server and not only in layouts or client hooks. |
| A08 Software and Data Integrity Failures | Evidence assets and typed content must come from reviewed repository changes with provenance. |
| A09 Security Logging and Monitoring Failures | Protected editorial mutations require audit events with actor, target, and timestamp. |
| A10 SSRF / request abuse style risks | Future outbound fetches must be explicit, justified, and never required by the live deck path. |

## 4. Rules for the Public Presentation Surface

1. Supported runtime input is minimal.
   Only deck navigation state such as `?slide=` may affect presentation behavior on the public route.

2. Query parameters must stay bounded and deterministic.
   Navigation input must be parsed as an integer, clamped to known slide bounds, and must not control content loading, auth, or external fetches.

3. The public route must be offline-capable.
   A presenter must still be able to rehearse and present when the network is unavailable.

4. Public rendering must not require authentication.
   Any future login ceremony belongs to preview/editorial paths only.

5. New public runtime flags are forbidden unless documented.
   If a future query parameter or route variant changes behavior, it must be explicitly documented in the threat model and reviewed for abuse cases.

## 5. Rules for Content and Slide Rendering

1. `src/lib/slides.config.ts` is the canonical slide registry.
   No slide may be injected dynamically from user input or an unreviewed remote source.

2. Shared narrative facts belong in typed content modules.
   This keeps evidence review and provenance auditable in Git.

3. Do not render untrusted HTML.
   `dangerouslySetInnerHTML` is prohibited for evidence, notes, or imported text unless a security review explicitly approves a sanitization pipeline.

4. External text must be sanitized at ingestion.
   Quotes, notes, metrics annotations, or imported summaries must be normalized to plain text or a restricted safe format before rendering.

5. Screenshots and exported images must be redacted before commit.
   Remove secrets, emails, internal hostnames, personal data, and unrelated tabs or windows.

6. Any code snippet shown in slides must be scrubbed.
   Tokens, private repositories, internal paths, and customer data must be removed.

## 6. Rules for Client and Server Boundaries

1. Client components must not import secret-bearing modules.
   Future database clients, auth adapters, or secret utilities belong under server-only boundaries such as `src/lib/server` or `src/lib/dal`.

2. Layouts are not authorization controls.
   If a protected route group is introduced, each sensitive read or mutation must still be enforced server-side.

3. Route Handlers are external boundaries, not internal transport.
   Server-rendered code must not call the app's own `/api/*` routes just to fetch data for the deck.

4. Public DTOs and protected DTOs must be separate.
   Draft notes, reviewer comments, and approval metadata must never be returned to the public deck path.

5. Secrets must remain runtime-scoped.
   Environment variables intended for server use must not be prefixed or exposed in ways that place them into the client bundle.

## 7. Rules for Future Authentication and Authorization

1. Prefer platform protection first.
   For remote previews, use hosting-level preview protection before building custom login flows.

2. Keep the role model small.
   At minimum distinguish presenter/viewer access from editor/reviewer/admin access.

3. Enforce least privilege.
   A user may only read or mutate the evidence, rehearsal, or preview data required for their role.

4. Protect every mutation.
   Any future `POST`, `PATCH`, `PUT`, or `DELETE` Route Handler must verify session, role, and request origin.

5. Record audit events for protected actions.
   Approval changes, evidence edits, preview publication changes, and rehearsal submissions must be attributable.

## 8. Rules for Assets, Evidence, and Data Handling

1. Every future evidence asset should carry provenance.
   Store source, approval status, and notes in a typed model such as `EvidenceAsset`.

2. Evidence may be shown only if approved or deliberately marked as fallback.
   Missing or draft evidence must not be presented as confirmed proof.

3. Personal or confidential data must be minimized.
   If a screenshot can be replaced by a cropped or redrawn visual, prefer that.

4. Rehearsal records are protected operational data.
   If stored later, they must not be exposed through public deck responses.

5. Imported data must degrade safely.
   If a protected data source is unavailable, use a prepared summary or local fallback instead of surfacing raw errors to the audience.

## 9. Demo Guardrails and Fallback Rules

1. The live demo must never require typing or displaying secrets.

2. The live demo must have a pre-approved fallback for every unstable step.
   Acceptable fallbacks include screenshots, prerecorded outputs, or a summary slide that states what would have been shown.

3. If a remote service becomes slow or unavailable, stop using it.
   Switch to the prepared fallback immediately rather than debugging in front of the audience.

4. Demo data must be curated.
   Use sanitized repositories, prompts, screenshots, and examples that are safe for a mixed audience.

5. The deck must remain credible under degraded conditions.
   A fallback slide must distinguish clearly between live output, prepared evidence, and hypothesis.

6. No hidden operator shortcuts.
   Presenter-only controls that materially change content must be documented and tested before rehearsal.

## 10. Rules for APIs and Network Use

1. New APIs must be optional to the deck runtime.

2. Keep endpoints narrow.
   Expose only the fields needed by the caller, with explicit DTOs and consistent error envelopes.

3. Rate-limit public-facing endpoints.
   Prefer host-level controls when possible.

4. Validate all request input.
   Parse, bound, and reject malformed parameters rather than coercing them silently.

5. Avoid unnecessary outbound fetches.
   The deck should not depend on remote calls for content that can be bundled at build time.

## 11. Rules for Dependencies and Delivery

1. Build output must be reviewable.
   Dependency additions, especially rendering or networking libraries, must be justified against the small attack surface expected for a presentation app.

2. Lockfiles are part of the security boundary.
   Do not bypass the lockfile when updating packages.

3. Prefer fewer runtime dependencies.
   Every new package must have a clear value on the deck path or protected preview path.

4. Verify the production build path.
   `npm run build` must succeed without hidden environment requirements for the public deck.

## 12. Required Review Gates

Security review is required when a change does any of the following:

- adds a new query parameter or route that changes deck behavior;
- introduces a new Route Handler;
- introduces auth, sessions, cookies, or preview protection logic;
- adds evidence ingestion, upload, or editorial metadata;
- adds remote data fetching to the deck or preview path;
- adds rendering of imported rich text or HTML;
- adds screenshots or assets originating from internal systems.

## 13. Implementation Checklist

- Public deck works locally without network access.
- `?slide=` remains bounded navigation-only input.
- No secrets or confidential data appear in `src/content/*`, `public/**`, or slide code.
- No client component imports server-only modules.
- Any future protected endpoint enforces session and role checks server-side.
- Any future editorial mutation writes an audit event.
- Every demo-critical external dependency has a documented fallback.

## 14. Enforcement

These rules are part of the architectural contract for the deck product. If a future feature conflicts with them, the default decision is to protect the presentation path first and move the feature behind an optional protected boundary.
