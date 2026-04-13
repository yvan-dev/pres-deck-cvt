---
stepsCompleted:
  - "step-01-validate-prerequisites"
  - "step-02-design-epics"
  - "step-03-create-stories"
  - "step-04-final-validation"
inputDocuments:
  - "_bmad/bmm/config.yaml"
  - "docs/prd.md"
  - "README.md"
  - "plans/deck-plan.md"
  - "src/lib/slides.config.ts"
  - "src/components/deck/Deck.tsx"
  - "src/components/deck/DeckProvider.tsx"
  - "src/components/deck/Slide.tsx"
  - "src/components/deck/SlideOverview.tsx"
  - "src/components/deck/SlideProgress.tsx"
  - "src/components/deck/BlackScreen.tsx"
  - "src/components/shared/IndustrialPanel.tsx"
  - "src/components/shared/LevelCard.tsx"
  - "src/components/shared/MaturityOverview.tsx"
  - "src/components/shared/MaturityPositioningBoard.tsx"
  - "src/components/shared/MetricCard.tsx"
  - "src/components/slides/01-cover.tsx"
  - "src/components/slides/02-summary.tsx"
  - "src/components/slides/03-whoami.tsx"
  - "src/components/slides/04-constat.tsx"
  - "src/components/slides/05-positioning.tsx"
  - "src/components/slides/06-maturity.tsx"
  - "src/app/layout.tsx"
  - "src/app/page.tsx"
  - "src/app/globals.css"
  - "src/content/levels.ts"
  - "src/content/metrics.ts"
  - "docs/architecture.md"
  - "docs/design-system.md"
  - "docs/ux-flows.md"
---

# pres-deck-cvt - Epic Breakdown

## Overview

This document provides the corrected deck-first epic and story breakdown for `pres-deck-cvt`.
It reflects the repository as it actually exists today:

- the product is the CVT presentation deck, not the BMAD workflow;
- the current codebase already contains a working presentation shell, shared visual primitives, and slides 1 to 6;
- slides 7 to 39 remain registered in `src/lib/slides.config.ts` but still resolve to placeholder components;
- architecture, design-system, and UX documents are useful inputs only where they support the current deck product;
- future backend, auth, database, or editorial extensions mentioned in supporting docs are not part of the required deck backlog unless the deck itself needs them.

## Requirements Inventory

### Functional Requirements

FR1: The product must preserve the validated 39-slide, 7-part narrative structure for the CVT deck.
FR2: The presenter must be able to advance and reverse slides from the keyboard without using a mouse.
FR3: The presenter must be able to jump to the first and last slide from the keyboard.
FR4: The presenter must be able to toggle fullscreen mode during the presentation.
FR5: The presenter must be able to toggle a temporary black screen and return to the active slide without losing position.
FR6: The presenter must be able to open an overview of the full deck and jump directly to any slide.
FR7: The deck must keep progression and chapter context visible during delivery without cluttering the screen.
FR8: The deck must maintain a stable 16:9 presentation frame suitable for local rehearsal and room projection.
FR9: The backlog must explicitly track the existing implemented foundation, deck engine, shared components, and slides 1 to 6.
FR10: The backlog must replace the current placeholder factory output with production slide components from slide 7 onward.
FR11: The maturity section must explain the five AI maturity levels, the N2-to-N3 shift, and AOT's target positioning clearly.
FR12: The D2R2 section must present credible proof through workflow explanation, real or honest fallback artifacts, metrics, and lessons.
FR13: The BMAD and LangGraph section must explain governed progression to level 4 without turning the deck into workflow documentation.
FR14: The AI pole section must present a credible proposal covering urgency, mission, pillars, roadmap, KPI logic, and contribution path.
FR15: The live demo must be framed, bounded, and recoverable inside the deck through intro, anchor, and recap slides.
FR16: The deck must remain understandable and persuasive even if proof assets or the live demo are partial or degraded.
FR17: The closure must land next steps, resources, and contact information clearly.
FR18: Product-facing slide content must remain in French.
FR19: Metrics, screenshots, branding assets, and speaker metadata must be updateable later without redesigning the shell.
FR20: The final product must support local build, rehearsal, and final presentation delivery, with optional remote preview only if it remains secondary.

### NonFunctional Requirements

NFR1: The implementation must remain aligned with the current Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v4 stack.
NFR2: The deck must continue to use `src/lib/slides.config.ts` as the canonical slide registry.
NFR3: The presentation shell must remain local-first and must not depend on network connectivity for the core delivery path.
NFR4: The deck must preserve strong contrast, typography scale, and information hierarchy for projected displays.
NFR5: The product must keep a coherent visual language across all slides by reusing shared patterns and existing tokens.
NFR6: Motion and transitions must feel deliberate, support presentation rhythm, and respect reduced-motion preferences.
NFR7: The shell must not regress on keyboard navigation, URL-based resume, overview mode, fullscreen, or black-screen behavior.
NFR8: The deck must not ship with production-blocking placeholders in the presentation-ready version.
NFR9: Claims, examples, and metrics must remain defensible and clearly labeled when estimates or fallbacks are used.
NFR10: The deck must stay deck-first; workflow support artifacts must not introduce visible complexity into the presentation.
NFR11: The repository should remain auditable and easy to evolve by keeping shared facts in reusable content modules and shared components.
NFR12: The final delivery path must support `npm run dev`, `npm run build`, and presentation rehearsal without repository archaeology.

### Additional Requirements

- `plans/deck-outline.md` is referenced in the task brief and README, but the file does not exist in the repository at the time of this rewrite.
- `src/lib/slides.config.ts` confirms that slides 1 to 6 are implemented and slides 7 to 39 still use `makePlaceholderSlide(...)`.
- The existing deck shell already provides URL-based slide state, keyboard controls, overview mode, progress display, fullscreen toggle, and black-screen mode.
- The existing repo already contains reusable presentation primitives in `src/components/shared` and structured narrative content in `src/content`.
- Supporting documents in `docs/architecture.md`, `docs/design-system.md`, and `docs/ux-flows.md` are valid inputs only where they reinforce the deck runtime, shared component model, or demo framing.
- Future API, auth, protected preview, database, or editorial flows mentioned in architecture/ADR docs are explicitly additive possibilities and do not justify mandatory backend stories for the current deck.
- The placeholder slide factory is a temporary continuity device, not a production implementation target.
- Optional Vercel preview is a delivery support path, not a core product requirement.

### UX Design Requirements

UX-DR1: The deck must preserve the established ACTON visual direction already present in `src/app/globals.css` and the implemented slides.
UX-DR2: Every slide must remain projection-safe through typography size, spacing, contrast, and restrained density.
UX-DR3: The overview screen must expose the full slide map with part labels, slide numbers, titles, and active-slide emphasis.
UX-DR4: The progress dock must remain persistent, discreet, and understandable at a glance while presenting.
UX-DR5: Black-screen mode must interrupt the visual field immediately and restore the same slide context without side effects.
UX-DR6: Motion must feel controlled rather than decorative, and reduced-motion expectations must remain respected.
UX-DR7: Keyboard-driven interactions and focus handling must stay visible and usable in the shell.
UX-DR8: Missing D2R2 captures or degraded demo conditions must resolve to honest fallback states rather than silent omissions.
UX-DR9: New slide production work must reuse shared patterns instead of inventing unrelated one-off layouts.
UX-DR10: The deck must feel like one intentional, premium, enterprise-ready presentation rather than a collection of isolated screens.

### FR Coverage Map

FR1: Epic 1 - Lock the approved structure and keep the opening narrative baseline aligned with the real deck.
FR2: Epic 1 - Preserve next and previous navigation in the existing shell.
FR3: Epic 1 - Preserve first and last slide jumps in the existing shell.
FR4: Epic 1 - Preserve fullscreen support in the existing shell.
FR5: Epic 1 - Preserve black-screen recovery in the existing shell.
FR6: Epic 1 - Preserve overview jump navigation across the full deck.
FR7: Epic 1 - Preserve chapter and progress context during delivery.
FR8: Epic 1 - Preserve the 16:9 presentation frame and branded shell.
FR9: Epic 1 - Explicitly track the foundation, shell, shared components, and implemented opening slides already in the repo.
FR10: Epic 2, Epic 3, Epic 4, Epic 5, Epic 6 - Replace placeholders with production slides from slide 7 onward.
FR11: Epic 2 - Deliver the maturity pedagogy and AOT positioning story.
FR12: Epic 3 - Deliver the D2R2 proof section with evidence, metrics, and lessons.
FR13: Epic 4 - Deliver the governed level-4 explanation for BMAD and LangGraph.
FR14: Epic 5 - Deliver the AI pole proposal.
FR15: Epic 6 - Deliver demo framing, demo anchor, and recap.
FR16: Epic 3, Epic 6 - Preserve meaning through evidence fallbacks and degraded demo paths.
FR17: Epic 6 - Deliver a clear closure and contact path.
FR18: Epic 1, Epic 2, Epic 3, Epic 4, Epic 5, Epic 6 - Keep product-facing deck content in French.
FR19: Epic 1, Epic 3, Epic 5 - Keep facts, metrics, and assets replaceable without changing structure.
FR20: Epic 6 - Deliver build, rehearsal, and optional preview readiness for the final deck.

## Epic List

### Epic 1: Deck Baseline and Opening Narrative
Lock the deck-first scope, preserve the foundation and shell already implemented in the repo, and keep slides 1 to 6 as a stable opening baseline for the rest of the build.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR18, FR19

### Epic 2: AI Maturity Pedagogy Core
Replace the maturity placeholders with production slides that clearly teach the five levels, the near-term level-3 target, and the positioning logic for AOT.
**FRs covered:** FR10, FR11, FR18

### Epic 3: D2R2 Proof by Example
Turn D2R2 into a credible proof block that shows guided agentic delivery through workflow, artifacts, metrics, and lessons without overselling the evidence.
**FRs covered:** FR10, FR12, FR16, FR18, FR19

### Epic 4: Governed Scale-Up with BMAD and LangGraph
Explain the move from level 3 to level 4 as a governed progression with human control, validation gates, and clear narrative value for the audience.
**FRs covered:** FR10, FR13, FR18

### Epic 5: AI Pole Proposal for AOT
Translate the technical narrative into an actionable, measured, and credible organizational proposal for an AI pole at AOT.
**FRs covered:** FR10, FR14, FR18, FR19

### Epic 6: Demo Framing, Closure, and Delivery Readiness
Bound the live segment, finish the closing sequence, and prepare the final deck for rehearsal, regression review, and presentation delivery.
**FRs covered:** FR10, FR15, FR16, FR17, FR18, FR20

## Epic 1: Deck Baseline and Opening Narrative

Protect the implemented baseline already visible in the repo so the remaining work extends a stable deck rather than re-arguing foundations.

### Story 1.1: Lock deck scope and evidence inventory (US-001)

As a deck owner,
I want the final narrative scope, source-of-truth slide inventory, and missing evidence list to be explicit,
So that the backlog stays focused on the CVT deck instead of its delivery workflow.

**Acceptance Criteria:**

**Given** `docs/prd.md`, `README.md`, and `plans/deck-plan.md`
**When** the scope baseline is reviewed
**Then** the 39-slide and 7-part structure is confirmed as the delivery target
**And** open inputs such as D2R2 metrics, screenshots, CVT date, and brand assets are captured.

### Story 1.2: Define the deck architecture and content model (US-002)

As an architect,
I want the current slide registry, content modules, and deck shell boundaries documented,
So that later implementation work extends the existing deck instead of fragmenting it.

**Acceptance Criteria:**

**Given** the current `Deck`, `DeckProvider`, and `slides.config.ts`
**When** the architecture story is completed
**Then** slide registration, content ownership, and shared component boundaries are documented
**And** future backend possibilities are clearly marked as non-blocking for the current deck.

### Story 1.3: Define projection-safe visual and interaction patterns (US-003)

As a designer,
I want a reusable visual and interaction system for the deck,
So that all slides remain coherent, premium, and projection-safe.

**Acceptance Criteria:**

**Given** the ACTON token system and current implemented slides
**When** the design system is defined
**Then** typography, spacing, panel patterns, motion rules, and focus behavior are specified
**And** new slide work is guided toward reuse instead of one-off styling.

### Story 1.4: Establish deck foundation and presentation theming (US-021)

As a presenter,
I want the deck app foundation, theme tokens, metadata, and shared content sources to be in place,
So that every slide runs inside a stable branded presentation shell.

**Acceptance Criteria:**

**Given** the current Next.js deck app
**When** the foundation is reviewed
**Then** the app entry route, metadata, fonts, CSS tokens, and shared content modules are wired consistently
**And** the presentation launches from a single deck route.

### Story 1.5: Harden deck navigation and projection behaviors (US-005)

As a presenter,
I want the shell navigation, projection controls, and recovery behaviors to feel reliable,
So that I can deliver the talk without mouse-driven workarounds or live confusion.

**Acceptance Criteria:**

**Given** the presentation shell
**When** keyboard interactions are exercised
**Then** next, previous, home, end, overview, fullscreen, and black-screen behaviors work consistently
**And** invalid `?slide=` values are clamped safely to the valid deck range.

### Story 1.6: Implement reusable visual primitives and fallback states (US-006)

As a frontend developer,
I want reusable slide primitives and honest fallback states,
So that later slide implementation stays consistent and faster to iterate.

**Acceptance Criteria:**

**Given** the approved visual system
**When** shared primitives are reviewed
**Then** panels, level cards, metric cards, and other reusable patterns are available for slide production
**And** missing-proof states remain honest, audience-safe, and replaceable later.

### Story 1.7: Implement contextual opening slides 1 to 5 (US-022)

As an audience member,
I want the opening context slides to establish the talk's scope, urgency, and AOT positioning,
So that the maturity and proof sections start from a clear narrative baseline.

**Acceptance Criteria:**

**Given** slides 1 to 5 are registered in `slides.config.ts`
**When** the opening block is reviewed
**Then** cover, summary, speaker stance, market shift, and AOT positioning are implemented as production slides
**And** they align with the shared design system and deck-first message.

### Story 1.8: Implement slide 6 maturity overview anchor (US-023)

As an audience member,
I want a strong maturity overview slide before the detailed levels,
So that the rest of the section has a clear frame of reference.

**Acceptance Criteria:**

**Given** slide 6 is registered in `slides.config.ts`
**When** the maturity overview is reviewed
**Then** it clearly presents all five levels, the N2-to-N3 inflection, and AOT target markers
**And** it uses centralized maturity content rather than slide-local duplicated facts.

## Epic 2: AI Maturity Pedagogy Core

Complete the central teaching sequence so the audience understands the maturity model beyond the already implemented overview slide.

### Story 2.1: Build slides 7 to 10 for N1, N2, N3, and N3 tools (US-007)

As a technical audience member,
I want the early maturity slides to explain what changes from chat to copilots to guided agents,
So that I understand why level 3 is the practical short-term target for AOT.

**Acceptance Criteria:**

**Given** slides 7 to 10 are placeholders
**When** the story is implemented
**Then** production slides exist for N1, N2, N3, and N3 tooling in French
**And** each slide clearly distinguishes posture, value, limits, and representative tooling.

### Story 2.2: Build slides 11 to 15 for practices, N4, N5, and positioning (US-008)

As a sponsor or engineer,
I want the later maturity slides to explain disciplined level-3 practice and the governed path beyond it,
So that the positioning of AOT and the target trajectory feel concrete and credible.

**Acceptance Criteria:**

**Given** slides 11 to 15 are placeholders
**When** the story is implemented
**Then** production slides exist for N3 practices, N4, BMAD plus LangGraph, N5, and the positioning view
**And** the section keeps level 3 as the credible center of gravity for AOT.

## Epic 3: D2R2 Proof by Example

Convert D2R2 from a narrative promise into an evidence-backed section that stays honest about what is confirmed, estimated, or still pending.

### Story 3.1: Curate the D2R2 proof pack and evidence rules (US-009)

As a product owner,
I want a curated set of D2R2 proof points, metrics assumptions, and fallback evidence rules,
So that the proof section stays factual even before every asset is finalized.

**Acceptance Criteria:**

**Given** open D2R2 inputs in the PRD and current repo
**When** the evidence pack is curated
**Then** workflow claims, metrics assumptions, screenshot targets, and fallback wording are documented
**And** each proof item is labeled as confirmed, estimated, or pending.

### Story 3.2: Build slides 16 to 19 for D2R2 context, workflow, and bead proof (US-010)

As an audience member,
I want the opening D2R2 slides to show what the project is and how the workflow operates,
So that I can connect the maturity model to a concrete engineering example.

**Acceptance Criteria:**

**Given** slides 16 to 19 are placeholders
**When** the story is implemented
**Then** slides exist for the D2R2 overview, workflow, ticket-to-PR flow, and bead example
**And** each slide uses approved real assets or explicit fallback representations.

### Story 3.3: Build slides 20 to 23 for plan, recap, metrics, and lessons (US-011)

As a sponsor or technical reviewer,
I want the rest of the D2R2 section to show execution detail, outcomes, and honest lessons,
So that I can judge whether the level-3 approach is repeatable and worth scaling.

**Acceptance Criteria:**

**Given** slides 20 to 23 are placeholders
**When** the story is implemented
**Then** production slides exist for a plan example, recap plus LEARNED, metrics, and key lessons
**And** estimated values remain clearly marked as estimates.

## Epic 4: Governed Scale-Up with BMAD and LangGraph

Explain the next maturity step without letting the presentation drift into internal workflow documentation or speculative product features.

### Story 4.1: Formalize the governed level-4 narrative and workflow model (US-012)

As an architect,
I want the level-4 story framed around governance, human control, and validation flow,
So that later slide implementation teaches the right reasons to move beyond level 3.

**Acceptance Criteria:**

**Given** the PRD calls for BMAD and LangGraph content
**When** the architecture framing is written
**Then** it explains the limits of level 3, the role of BMAD stages, the role of LangGraph gates, and the human-in-the-loop principle
**And** it avoids presenting orchestration as the product itself.

### Story 4.2: Build slides 24 to 28 for BMAD and LangGraph progression (US-013)

As an audience member,
I want the level-4 section to show why governance matters and what the workflow actually looks like,
So that the move from level 3 to level 4 feels justified rather than speculative.

**Acceptance Criteria:**

**Given** slides 24 to 28 are placeholders
**When** the story is implemented
**Then** production slides exist for why N4 matters, the BMAD flow, LangGraph validation gates, a concrete workflow, and experience feedback
**And** the section remains French, deck-first, and audience-readable.

## Epic 5: AI Pole Proposal for AOT

Translate the technical argument into an operational proposal that is actionable for sponsors and credible for engineers.

### Story 5.1: Define the AI pole proposition, mission, pillars, and KPI hypotheses (US-014)

As a product strategist,
I want the AI pole proposal articulated as a concrete operating model,
So that the closing business case is anchored in mission, roadmap, and measurable outcomes.

**Acceptance Criteria:**

**Given** the deck must defend the creation of an AI pole
**When** the proposition is defined
**Then** it includes urgency, mission, the four pillars, roadmap logic, KPI hypotheses, and contributor pathways
**And** it stays compatible with pragmatic early-stage adoption.

### Story 5.2: Build slides 29 to 31 for urgency, mission, and pillars (US-015)

As a decision-maker,
I want the first AI pole slides to show why action is needed now and what the pole would do,
So that the organizational proposal feels urgent and structured.

**Acceptance Criteria:**

**Given** slides 29 to 31 are placeholders
**When** the story is implemented
**Then** production slides exist for urgency, mission and positioning, and the four pillars
**And** they connect directly to the earlier maturity and D2R2 evidence.

### Story 5.3: Build slides 32 to 34 for roadmap, KPIs, and contribution path (US-016)

As a sponsor,
I want the second AI pole block to show when value appears and how success will be measured,
So that I can evaluate the proposal as a practical next step instead of a generic ambition statement.

**Acceptance Criteria:**

**Given** slides 32 to 34 are placeholders
**When** the story is implemented
**Then** production slides exist for roadmap, KPIs and success measures, and the contribution path
**And** evolving assumptions can be updated later without changing the section structure.

## Epic 6: Demo Framing, Closure, and Delivery Readiness

Complete the live-demo wrapper, endgame slides, and delivery readiness work so the speaker can rehearse and present with confidence.

### Story 6.1: Define live-demo guardrails and fallback rules (US-004)

As a security reviewer,
I want the live-demo segment bounded by explicit guardrails and fallback rules,
So that the deck remains credible and safe even if live conditions change.

**Acceptance Criteria:**

**Given** a live Claude Code segment is planned
**When** the guardrail definition is completed
**Then** approved data, forbidden sensitive content, and fallback paths are documented
**And** captured artifacts are safe to project in front of a mixed audience.

### Story 6.2: Design the demo framing and recap pattern (US-017)

As a speaker,
I want a designed intro, anchor, and recap pattern for the live demo,
So that the demo supports the talk even when live conditions are imperfect.

**Acceptance Criteria:**

**Given** the live segment is part of the narrative rather than the whole product
**When** the framing pattern is defined
**Then** it covers what the audience should watch, what counts as success, and how to recover if the demo is shortened
**And** the recap pattern still works after a partial or skipped demo.

### Story 6.3: Build slides 35 to 39 for demo framing and closure (US-018)

As an audience member,
I want the end of the deck to prepare me for the live demo and then close with clear next steps,
So that the presentation lands even if the live segment varies in length.

**Acceptance Criteria:**

**Given** slides 35 to 39 are placeholders
**When** the story is implemented
**Then** production slides exist for demo transition, live-demo anchor, demo recap, next steps, and Q&A/resources/contact
**And** the full closing sequence remains French and presentation-ready.

### Story 6.4: Polish the full 39-slide deck and validate presentation regressions (US-019)

As a QA reviewer,
I want the complete deck flow, navigation, readability, and polish validated,
So that the speaker can rehearse and present without critical regressions.

**Acceptance Criteria:**

**Given** the full slide set is implemented
**When** the deck is validated
**Then** all 39 slides are reachable, correctly ordered, and free of production-blocking placeholders
**And** shell controls, readability, motion behavior, and fallback states are reviewed for presentation readiness.

### Story 6.5: Prepare the local build, optional preview, and rehearsal handoff (US-020)

As a delivery owner,
I want a reliable local build path, optional preview path, and rehearsal checklist,
So that the final deck can be reviewed and presented under real operating conditions.

**Acceptance Criteria:**

**Given** the deck is local-first
**When** delivery readiness is finalized
**Then** the local build and run path is documented and repeatable
**And** the rehearsal handoff covers navigation, fullscreen, demo readiness, and fallback behavior.
