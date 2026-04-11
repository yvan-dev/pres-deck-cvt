# pres-deck-cvt

> **Le développement agentique à AOT** — deck de présentation pour le CVT d'ACTON Technology, 100 % codé avec Claude Code.

Un CVT animé par **Yvan Gunewou** pour évangéliser le développement agentique chez AOT, proposer la création d'un pôle IA, et positionner l'équipe sur l'échelle de maturité IA.

Le site lui-même est **une preuve par l'exemple** : conçu, codé, testé et versionné via un workflow agent-guidé (niveau 3).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (config CSS-first)
- **Framer Motion** — transitions de slides
- **Shiki** — syntax highlighting
- **react-hotkeys-hook** — navigation clavier Keynote-like
- **next-themes** — dark par défaut
- **Geist Sans / Geist Mono** (via `next/font`)

## Design

Palette **ACTON Blue** — bleu électrique + teal sur fond noir profond. Ton enterprise crédible, moderne, adapté à une projection en salle de réunion.

Voir `src/app/globals.css` pour les tokens.

## Structure

```
src/
  app/                  Routes Next.js + globals.css
  components/
    deck/               Moteur de deck (Deck, Slide, navigation)
    slides/             Les 39 slides du deck
    shared/             Composants signature (LevelCard, MetricCard, etc.)
  content/
    levels.ts           Les 5 niveaux de maturité (source unique)
    metrics.ts          Métriques chiffrées
  lib/
    utils.ts            cn() helper
plans/
  deck-plan.md          Plan d'implémentation validé
  deck-outline.md       Script slide par slide
```

## Commandes

```bash
npm run dev         # dev server http://localhost:3000
npm run build       # build production
npm run start       # serve production build
npm run lint        # ESLint
```

## Arc narratif (39 slides · ~75 min + démo live)

1. **Contexte & cadrage** (5 slides)
2. **Les 5 niveaux de maturité IA** (10 slides) ⭐ cœur pédagogique
3. **Preuve par l'exemple — D2R2** (8 slides)
4. **Aller plus loin — BMAD + LangGraph** (5 slides)
5. **Le pôle IA AOT** (6 slides)
6. **Démo live** (3 slides + session live)
7. **Clôture** (2 slides)

## Navigation clavier (prévue en Phase 1)

| Touche | Action |
|---|---|
| `→` / `Espace` | Slide suivant |
| `←` | Slide précédent |
| `Home` / `End` | Premier / dernier slide |
| `Esc` | Mode overview (grille miniature) |
| `F` | Plein écran |
| `B` | Écran noir temporaire |

## Auteur

**Yvan Gunewou** · Tech Lead D2R2 · ACTON Technology
