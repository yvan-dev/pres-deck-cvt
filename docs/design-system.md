---
title: pres-deck-cvt Design System
status: review
owner: Design
lastUpdated: 2026-04-13
sourceDocuments:
  - docs/prd.md
  - docs/architecture.md
  - plans/deck-plan.md
  - src/app/globals.css
  - src/app/layout.tsx
  - src/components/deck/Deck.tsx
  - src/components/deck/Slide.tsx
  - src/components/deck/SlideProgress.tsx
  - src/components/deck/SlideOverview.tsx
  - src/components/shared/IndustrialPanel.tsx
  - src/components/shared/MetricCard.tsx
  - src/components/shared/LevelCard.tsx
  - src/components/shared/MaturityOverview.tsx
  - src/components/shared/MaturityPositioningBoard.tsx
  - src/components/slides/01-cover.tsx
  - src/components/slides/02-summary.tsx
  - src/components/slides/03-whoami.tsx
  - src/components/slides/04-constat.tsx
  - src/components/slides/05-positioning.tsx
  - src/components/slides/06-maturity.tsx
relatedStories:
  - US-003
  - US-017
---

# pres-deck-cvt Design System

## 1. Purpose

This document defines the reusable visual and structural rules for a local-first presentation deck operated in a live room, from keyboard, under projection constraints.

It is not a generic website design system. It is a deck delivery system for one product:

- a 39-slide CVT narrative;
- a single-route Next.js presentation shell;
- a speaker-first operating model;
- honest proof and honest degradation when evidence is partial.

The system succeeds when new slides feel authored by the same hand, remain legible at distance, and reinforce the deck-first thesis instead of turning into a collection of disconnected UI experiments.

## 2. Product Experience Principles

### 2.1 Deck-first, not tool-first

Every visual decision must help the speaker move the story forward. Workflow detail appears only when it strengthens the argument.

### 2.2 Projection-safe by default

The room is the real device. Slides must survive washed-out projectors, imperfect contrast, and distance reading.

### 2.3 Local-first credibility

The deck itself must feel dependable without network assumptions. Visual patterns should communicate operational control, not cloud dependency or dashboard sprawl.

### 2.4 Honest proof

The deck may include approved proof, estimates, planned captures, or narrative substitutes. Each state must be visually and verbally explicit.

### 2.5 Calm command

The shell should feel like a controlled briefing environment. Motion is deliberate. Emphasis is intentional. Nothing should feel playful, nervous, or overloaded.

## 3. Current Visual Baseline

The current implementation already establishes the baseline to preserve:

- dark industrial canvas;
- green primary signal with cyan and amber supporting accents;
- glass-panel layering;
- subtle grid and scanline texture;
- strong display typography with restrained body typography;
- rounded but precise framing corners and docking surfaces.

Important clarification: the planning document still mentions an ACTON Blue palette, but the implemented shell in `src/app/globals.css` is currently greener and more operations-room-like. Future slide work should align with the existing shell rather than reintroducing a second competing palette.

Design keywords:

- industrial;
- premium;
- supervised;
- local-first;
- technical;
- controlled.

## 4. Shell Constraints

The design system must respect the runtime shell that already exists.

### 4.1 Frame and safe area

The slide viewport is fixed to `16 / 9` inside a centered frame. `Slide.tsx` reserves:

- a top utility band for eyebrow and slide number;
- interior margins around the main narrative content;
- a lower area that must tolerate the progress dock overlay.

Design rule:

- keep critical content inside the central safe rectangle;
- treat outer edges as decorative only;
- do not place dense copy or small labels near the bottom-most edge.

### 4.2 One active slide, one main message

`Deck.tsx` mounts one active slide at a time. Slides should therefore assume full narrative ownership for a moment rather than behaving like scrollable dashboards or multiplexed workspaces.

### 4.3 Overlay-aware layout

Overview mode, black screen, and the progress dock are shell-level layers. Slide layouts must not depend on custom top-right controls, floating debug UI, or presenter-only widgets inside the slide surface.

## 5. Tokens and Styling Rules

### 5.1 Color roles

Use the existing CSS tokens as the only source of truth.

| Token family | Role | Guidance |
| --- | --- | --- |
| `--aot-bg-*` | canvas and surfaces | maintain layered depth from shell to card |
| `--aot-text*` | hierarchy of legibility | use dim and muted text for metadata only |
| `--aot-primary*` | target state and active control | use for current focus, desired trajectory, positive control |
| `--aot-accent*` | structural explanation | use for models, supporting logic, neutral emphasis |
| `--aot-signal*` | bounded uncertainty or caution | use for warnings, tradeoffs, gates, constraints |
| `--aot-danger` | explicit failure or blocked state | reserve for rare hard failure messaging only |

### 5.2 Semantic usage

- `primary` means confidence, active state, or recommended direction.
- `accent` means explanation, structure, comparison, or model detail.
- `signal` means caution, open question, limit, or conditional path.
- `danger` means something is truly broken or non-credible to run live.

### 5.3 Typography

The current shell uses:

- `Space Grotesk` for display headings;
- `IBM Plex Sans` for body copy;
- `IBM Plex Mono` for utility labels, metadata, commands, and evidence tags.

Projection scale guidance:

- hero heading: `64px` to `88px`;
- section heading: `48px` to `64px`;
- panel title: `24px` to `40px`;
- body copy: `22px` to `30px`;
- dense proof copy: `18px` to `22px`;
- metadata: `12px` to `16px`.

Hard rule:

- do not place essential content below roughly `18px` equivalent.

### 5.4 Surface language

The current components already define the right surface hierarchy:

- `industrial-shell` for full slide atmosphere;
- `industrial-panel` for grouped content;
- `liquid-dock` and `liquid-pill` for shell-adjacent navigation and compact callouts;
- `industrial-chip` and `industrial-kicker` for labels and metadata.

Do not create alternate card families unless they are promoted into shared primitives with a strong reason.

## 6. Projection Rules

These are non-negotiable.

### 6.1 Density

- one primary message per slide;
- one secondary proof layer per slide;
- no more than three emphasis zones at once;
- if content exceeds six atomic items, regroup it into cards, rows, or explicit stages.

### 6.2 Contrast

- headings and key proof must remain readable under weak projector contrast;
- avoid low-contrast tinted text on textured backgrounds;
- do not rely on color alone to distinguish important states.

### 6.3 Composition

- prefer 2-column or 3-column structures over dense matrices;
- reserve 4-column and 5-column grids for short cards only, as already used in summary and maturity slides;
- avoid long horizontal reading chains unless the slide is explicitly a flow.

### 6.4 Motion

- slide transitions: short and controlled;
- overlay transitions: faster than slide transitions;
- no perpetual animation on proof-heavy slides;
- use stagger only when it helps reading order, not as decoration.

## 7. Slide Pattern Catalogue

The deck should use a small set of repeatable slide patterns mapped to the 39-slide plan.

| Pattern | Best fit | Existing component base | Rules |
| --- | --- | --- | --- |
| Hero briefing | slides 1, 24, 29, 38 | `Slide` + `IndustrialPanel` | one headline, one trajectory statement, one support cluster |
| Chapter map | slide 2 | `IndustrialPanel` + `liquid-pill` | show the 7-part narrative without over-explaining |
| Speaker credibility | slide 3 | `IndustrialPanel` | proof of authority plus one clear intention statement |
| Market shift | slide 4 | `MetricCard` + `IndustrialPanel` | metrics on left or center, interpretation on right |
| Positioning board | slides 5, 15 | `MaturityPositioningBoard` | compare actors across maturity levels with concise row notes |
| Overview wall | slide 6 | `MaturityOverview` + `LevelCard` | explain all levels at once, highlight N3 and N4 explicitly |
| Single-level deep dive | slides 7, 8, 9, 12, 14 | `LevelCard` full variant | definition, tools, use cases, limits, operator stance |
| Practices or tools board | slides 10, 11, 13 | `IndustrialPanel` plus future shared matrices | max 3 to 4 clusters, avoid exhaustive tool dumps |
| Proof summary | slides 16, 23, 28, 37 | `IndustrialPanel` + future `RecapStrip` | start from outcome, not from process mechanics |
| Workflow flow | slides 17, 18, 25, 26, 27 | future `FlowDiagram` | use stages, gates, and handoffs; avoid microscopic labels |
| Artifact proof | slides 19, 20, 21, 36 | `IndustrialPanel` + future `EvidenceCard` | screenshot or fallback summary must state proof status |
| Metrics wall | slides 22, 33 | `MetricCard` | every number needs source, confidence, or estimate label |
| Roadmap strip | slide 32 | future `Timeline` | show now, next, later; do not create a product roadmap spreadsheet |
| Demo framing | slide 35 | `IndustrialPanel` + future `DemoGuardrailCard` | objective, audience lens, guardrails, fallback statement |
| Demo bridge | slide 36 | `IndustrialPanel` + `industrial-chip` | one bounded live objective; never a generic tool tour |
| Closing resource wall | slide 39 | `IndustrialPanel` | 3 or 4 grouped resources max, plus Q&A/contact anchor |

## 8. Pattern Rules by Narrative Segment

### 8.1 Part 1: Context and framing

Use high-authority compositions:

- large display headings;
- concise supporting body copy;
- a small number of proof cards;
- immediate narrative direction.

The first five slides should feel like a briefing, not like an article.

### 8.2 Part 2: Maturity model

Use comparison-heavy patterns:

- `LevelCard` as the primary language;
- shared visual logic across N1 to N5;
- explicit highlighting for N3 as the short-term target;
- signal styling for N4 governance;
- caution styling for N5 futurism.

### 8.3 Part 3: D2R2 proof

Use evidence-led patterns:

- show one artifact or one proof type per slide;
- separate observed proof from interpretation;
- place estimate labels in the card itself, not in speaker notes;
- if a real screenshot is missing, replace it with a labeled summary panel instead of a vague placeholder.

### 8.4 Part 4: BMAD and LangGraph

Use governed-flow patterns:

- focus on stages and human checkpoints;
- explain why the gate exists before describing its mechanics;
- avoid turning these slides into pipeline internals or implementation trivia.

### 8.5 Part 5: AI pole proposition

Use strategy-to-action patterns:

- mission card;
- pillar board;
- roadmap strip;
- KPI wall;
- contribution call-to-action.

This section should feel operational and adoptable, not abstract.

### 8.6 Part 6: Live demo

Use bounded live patterns:

- intro slide frames the audience lens;
- live slide acts as a bridge, not as a fake reproduction of the demo tool;
- recap slide extracts meaning even after a partial or skipped demo.

### 8.7 Part 7: Closure

Use calm, low-friction patterns:

- fewer moving pieces;
- clear next steps;
- memorable takeaway;
- visible resource path and contact anchor.

## 9. Component Coherence Rules

The existing component set already defines the shared vocabulary. New slide work should reuse it deliberately.

### 9.1 Existing shared primitives to preserve

| Component | Use as | Do not turn into |
| --- | --- | --- |
| `Slide` | mandatory outer shell | a per-slide customization playground |
| `IndustrialPanel` | default grouped content container | a generic div replacement everywhere |
| `MetricCard` | quantified proof block | a decorative stat tile without source context |
| `LevelCard` | maturity explanation block | a catch-all card for unrelated topics |
| `MaturityOverview` | part-2 anchor | a dumping ground for extra maturity content |
| `MaturityPositioningBoard` | cross-actor maturity comparison | a dense spreadsheet replacement |
| `SlideProgress` | presenter orientation | a content surface for narrative material |
| `SlideOverview` | non-linear recovery tool | a permanent navigation sidebar |
| `BlackScreen` | temporary audience reset | a hidden mode for presenter-only actions |

### 9.2 Near-term shared primitives to add when needed

| Primitive | Needed for | Contract |
| --- | --- | --- |
| `EvidenceCard` | slides 19 to 21 and 36 | asset, caption, relevance, proof status |
| `FlowDiagram` | workflow and governance slides | stage ordering, gate nodes, readable labels |
| `Timeline` | roadmap and maturity journey | explicit time anchors and outcome labels |
| `DecisionPanel` | positioning and AI pole rationale | recommendation plus tradeoff framing |
| `DemoGuardrailCard` | slide 35 | objective, scope boundary, fallback promise |
| `RecapStrip` | slides 23, 28, 37, 38 | 3 takeaway points max |

Shared rule:

- if the same composition appears on at least two slides, promote it into `src/components/shared`.

## 10. Honest Fallback States

This deck cannot pretend that every proof asset exists.

### 10.1 Proof status taxonomy

| Status | Meaning | Visual treatment | Copy treatment |
| --- | --- | --- | --- |
| Approved proof | validated metric or approved asset | primary or accent emphasis | plain factual wording |
| Estimate | plausible but not finalized | signal treatment plus estimate chip | include confidence note |
| Planned capture | known missing asset | muted panel with explicit absence | state what will eventually be captured |
| Fallback summary | narrative substitute for missing live proof | elevated neutral panel | say directly that this is a fallback summary |
| Blocked live state | demo should not be run | danger used sparingly | explain why the live path is being skipped |

### 10.2 Copy rules

- never imply an asset exists if it does not;
- never frame an estimate as measured fact;
- never hide a missing proof item by deleting the idea entirely;
- always preserve the narrative lesson, even if the evidence format changes.

### 10.3 Placeholder rule

The current placeholder slides are acceptable during production because they preserve deck continuity. They are not acceptable as presentation-ready endpoints. Production slides must replace them with real narrative patterns and explicit evidence states.

## 11. Demo Framing Rules

The live demo is part of the deck, not a side show.

### 11.1 Slide 35: frame before switching context

Must show:

- the exact live objective;
- what the audience should pay attention to;
- what is intentionally out of scope;
- the fallback promise if the live path is shortened.

### 11.2 Slide 36: bounded live bridge

Must choose one of three honest states:

- live execution;
- partial proof;
- skipped live path with explicit summary.

The slide itself should remain visually stable even if the presenter leaves the deck momentarily.

### 11.3 Slide 37: recap with authority

Must recover the room with:

- three lessons maximum;
- one maturity-level interpretation;
- one control or governance takeaway.

No apology slide. No vague “it kind of worked” messaging.

## 12. Acceptance Target

The design system is ready when:

- new slides reuse the current shell and shared primitives coherently;
- projection rules are enforced consistently across all sections;
- D2R2 proof and live-demo fallbacks stay explicit and credible;
- the current green/cyan industrial shell remains the visual source of truth;
- the finished deck reads as one controlled local-first presentation system.
