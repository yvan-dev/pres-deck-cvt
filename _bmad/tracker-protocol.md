# Tracker Protocol - pres-deck-cvt

`bmad-tracker/tasks.json` is the single source of truth for agentic execution tracking in this repository.

## Mandatory rules

- Read `bmad-tracker/tasks.json` before updating any ticket.
- Preserve valid JSON at all times.
- Update only the ticket(s) relevant to the current task unless the task explicitly asks for a full backlog rewrite.
- Keep logs short, factual, and directly tied to repository work.
- Update `updatedAt` whenever you modify the file.

## Ticket lifecycle

- Move a ticket to `inprogress` when active work starts.
- Move a ticket to `review` when the requested work is completed and ready for validation.
- Move a ticket to `done` only when the corresponding validation step is explicitly complete.
- Use `backlog` for not-started items.
- Use `ready-for-dev` only when a story has been selected and prepared for implementation.

## Log format

Append logs as:

```json
{ "ts": "ISO-8601 timestamp", "msg": "short factual update" }
```

Good examples:

- `PRD reframed around the deck product and live presentation goals.`
- `Slide navigation hotkeys implemented and verified locally.`
- `Story backlog reset pending clean regeneration from corrected PRD.`

Bad examples:

- long narrative summaries
- speculative statements
- references to unrelated sample projects

## Project-specific guidance

- The main product is the CVT presentation deck, not the BMAD pipeline itself.
- Tickets, logs, and backlog updates must stay aligned with the deck product, its narrative arc, and its presentation quality requirements.
- Treat BMAD, tracker, gates, and pipeline automation as delivery support unless the task explicitly concerns workflow maintenance.

## Full backlog rewrites

Only rewrite the full `tasks.json` when the current task explicitly requires backlog generation or normalization, for example:

- PRD-to-stories decomposition
- sprint planning selection
- deliberate schema-safe cleanup

When doing a full rewrite:

- preserve the stable schema: `id`, `title`, `description`, `agent`, `phase`, `priority`, `status`, `sprint`, `logs`
- keep existing valid tickets if they still match the corrected product context
- remove stale or contradictory entries only when the source artifact has been explicitly superseded
