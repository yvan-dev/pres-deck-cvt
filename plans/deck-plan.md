# Plan d'implémentation — `pres-deck-cvt`

> **Validé** par Yvan Gunewou le 2026-04-11.
> Ce document est la source de vérité pour l'implémentation du deck.

## Contexte

- **Événement :** CVT ACTON Technology animé par Yvan Gunewou
- **Objectif 1 :** évangéliser le développement agentique et positionner AOT sur l'échelle de maturité IA (cible : niveau 3)
- **Objectif 2 :** justifier et cadrer la création d'un pôle IA interne (formation, veille, R&D, gouvernance)
- **Objectif 3 :** le support lui-même est une preuve par l'exemple — 100 % codé en mode agent guidé
- **Format :** slide deck style keynote en Next.js 16 + Tailwind v4 + Framer Motion + shadcn-lite
- **Durée :** > 1h — atelier technique avec démos live
- **Langue :** FR
- **Palette :** ACTON Blue (bleu électrique + teal sur fond noir profond, ton enterprise)

## Arc narratif — 39 slides · 7 parties

### Partie 1 — Contexte & cadrage (5 slides · ~10 min)
1. Cover — « Le développement agentique à AOT » + speaker + date
2. Agenda
3. Qui je suis — Tech Lead D2R2, démarche IA personnelle
4. Le constat — ce qui a changé en 18 mois (chiffres marché)
5. La question — où en est AOT ? où devrait-on être ?

### Partie 2 — Les 5 niveaux de maturité (10 slides · ~20 min) ⭐ cœur
6. Vue d'ensemble des 5 niveaux
7. N1 — Chat
8. N2 — Copilote
9. N3 — Agent guidé ⭐ cible court terme
10. Zoom N3 : outils (Claude Code, Cursor, Cline, Aider…)
11. Zoom N3 : pratiques (Plan mode, CLAUDE.md, skills, TDD guidé)
12. N4 — Human in the Loop
13. Zoom N4 : BMAD + LangGraph + validation gates
14. N5 — Swarm
15. Positionnement : Marché / EDF / AOT / Personnel / Cibles

### Partie 3 — Preuve par l'exemple : D2R2 (N3) (8 slides · ~15 min)
16. D2R2 en 1 slide — migration OutSystems → Java/Next
17. Workflow mis en place — beads + Claude Code + verification gate
18. Diagramme détaillé — du ticket au PR
19. Exemple réel : un bead (screenshot kanban)
20. Exemple réel : un plan d'implémentation
21. Exemple réel : un recap + LEARNED
22. Métriques D2R2 chiffrées
23. Apprentissages clés

### Partie 4 — Aller plus loin : BMAD + LangGraph (N4) (5 slides · ~10 min)
24. Pourquoi N4 ? — limites de N3 à dépasser
25. BMAD en 1 schéma — Brief → PRD → Archi → Stories → Dev → QA
26. LangGraph : les validation gates — diagramme de flow
27. Exemple concret de workflow complet
28. Retours d'expérience — coûts, pièges, bonnes pratiques

### Partie 5 — Le pôle IA AOT (6 slides · ~10 min)
29. Pourquoi un pôle IA maintenant
30. Mission & positionnement
31. Les 4 piliers : Formation · Veille · R&D · Gouvernance
32. Roadmap T0 → T+3 → T+6 → T+12 mois
33. KPIs & mesures de succès
34. Comment rejoindre / contribuer

### Partie 6 — Démo live (3 slides + live ~15-20 min)
35. Transition démo — « ce que vous allez voir »
36. *[Live Claude Code sur tâche D2R2 réelle]*
37. Retour démo — points clés

### Partie 7 — Clôture (2 slides)
38. Prochaines étapes + appel à action
39. Q&A + ressources + contact

## Phases d'implémentation

| # | Phase | Livrable | Statut |
|---|---|---|---|
| 0 | Setup | Next.js + Tailwind + palette + fonts + structure | **in progress** |
| 1 | Moteur de deck | `<Deck>`, `<Slide>`, hotkeys, overview, progress, transitions | pending |
| 2 | Design system | `LevelCard`, `MetricCard`, `CodeBlock`, `FlowDiagram`, `Timeline`, `MaturityChart` | pending |
| 3 | Contenu P1+P2 | Slides 1-15 (contexte + 5 niveaux) | pending |
| 4 | Contenu P3+P4 | Slides 16-28 (D2R2 + BMAD/LangGraph) | pending |
| 5 | Contenu P5+P6+P7 | Slides 29-39 (pôle IA + démo + clôture) | pending |
| 6 | Polish + QA | Animations finales, vérification Playwright, dark/light | pending |
| 7 | Déploiement | Build statique + Vercel optionnel | pending |

## Décisions prises

- **Framework :** Next.js 16 (stable) + App Router + Tailwind v4 (CSS-first config)
- **Langue :** 100 % français
- **Palette :** ACTON Blue — `#030712` base, `#3b82f6` primary, `#14b8a6` accent
- **Speaker :** Yvan Gunewou
- **Repo :** `github.com:yvan-dev/pres-deck-cvt` (privé) — commits sémantiques utilisés comme preuve live pendant la présentation
- **Hébergement :** local d'abord, Vercel optionnel
- **Métriques :** estimations qualitatives, source unique dans `src/content/metrics.ts`, à affiner avec vrais chiffres D2R2 plus tard
- **Screenshots D2R2 :** 1 fourni (kanban beads), captures complémentaires à prendre dans une session dédiée sur le repo D2R2

## Questions ouvertes

- [ ] Logo AOT officiel à récupérer / créer
- [ ] Captures D2R2 complémentaires (liste précise à définir)
- [ ] Chiffres réels D2R2 (beads fermés, LOC IA, PRs mergées)
- [ ] Date exacte du CVT
