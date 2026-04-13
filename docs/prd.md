---
stepsCompleted:
  - "pipeline-prd"
inputDocuments:
  - "_bmad/bmm/config.yaml"
  - "bmad-tracker/tasks.json"
  - "README.md"
  - "plans/deck-plan.md"
  - "src/lib/slides.config.ts"
  - "src/components/deck/Deck.tsx"
workflowType: "prd"
---

# Product Requirements Document - pres-deck-cvt

**Auteur :** Yvang  
**Date :** 2026-04-12  
**Langue produit :** français

## 1. Résumé exécutif

`pres-deck-cvt` est une application Next.js 16 / React 19 / TypeScript qui sert de deck de présentation pour le CVT d'ACTON Technology sur le développement agentique et les avancées de l'IA chez AOT.

Le produit à livrer n'est pas le pipeline BMAD, le tracker ni les validation gates. Le produit principal est un deck web premium, projetable et navigable, capable de soutenir une présentation d'environ 75 minutes, d'expliquer les 5 niveaux de maturité IA, de démontrer le workflow D2R2, de présenter BMAD + LangGraph, de défendre la création d'un pôle IA AOT et d'encadrer une démo live sans rupture d'expérience.

Le cadrage produit doit donc rester deck-first :

- la narration prime sur le workflow de fabrication ;
- la qualité de projection prime sur la sophistication invisible ;
- la crédibilité métier prime sur la démonstration d'outillage ;
- le backlog doit dériver du deck, pas l'inverse.

## 2. Vision produit

Livrer un site de présentation crédible, moderne, navigable et projetable qui transforme une thèse complexe sur l'IA agentique en un récit compréhensible, mémorisable et défendable pour un public mixte AOT.

Le deck doit simultanément :

1. expliquer les 5 niveaux de maturité IA avec un centre de gravité clair sur le niveau 3 ;
2. prouver par l'exemple, via D2R2, que le mode agent guidé produit déjà de la valeur ;
3. montrer comment BMAD + LangGraph permettent un passage maîtrisé vers le niveau 4 ;
4. convertir cette démonstration en proposition concrète de création d'un pôle IA AOT ;
5. rester robuste pendant une présentation live et une démo projetée.

## 3. Problème à résoudre

Le CVT a besoin d'un support qui fasse plus que "des slides jolies". Il doit convaincre, en une seule séance, que :

- l'IA agentique est déjà praticable dans un contexte engineering sérieux ;
- AOT peut viser le niveau 3 à court terme sans se raconter d'histoire ;
- le niveau 4 a du sens uniquement avec contrôle humain et validation gates ;
- un pôle IA AOT répond à un besoin réel de formation, veille, R&D et gouvernance ;
- la démonstration live sert le propos au lieu de le fragiliser.

Le risque principal est simple : si le projet dérive vers le pipeline BMAD comme "produit", le deck perd en clarté, en qualité de projection et en force persuasive.

## 4. Contexte et état actuel

Les sources de vérité produit retenues pour ce PRD sont :

- `README.md`
- `plans/deck-plan.md`
- `src/lib/slides.config.ts`
- `src/components/deck/Deck.tsx`

Constats actuels du dépôt :

- l'arc narratif de référence est de 39 slides réparties en 7 parties ;
- le moteur de deck existe déjà avec progression, overview, écran noir, plein écran et hotkeys clavier ;
- les slides 1 à 6 sont implémentées ;
- les slides 7 à 39 existent encore majoritairement sous forme de placeholders ;
- `plans/deck-outline.md` est demandé dans le brief mais absent du dépôt à la date de rédaction.

## 5. Objectifs produit

### Objectifs primaires

- Livrer un deck 100 % français, complet et présentable pour le CVT.
- Préserver la structure cible de 39 slides et l'arc narratif validé en 7 parties.
- Assurer une expérience de projection fluide, stable et pilotable au clavier.
- Rendre les 5 niveaux de maturité IA pédagogiques et actionnables.
- Utiliser D2R2 comme preuve terrain crédible du niveau 3.
- Expliquer BMAD + LangGraph comme extension maîtrisée vers le niveau 4.
- Soutenir un argumentaire clair pour la création d'un pôle IA AOT.

### Objectifs secondaires

- Faire du deck lui-même une preuve discrète de delivery agentique discipliné.
- Réutiliser la structure du support pour de futures présentations internes.
- Permettre une répétition simple et une démo live bien encadrée.

## 6. Non-objectifs

- Construire un produit autonome centré sur BMAD, le tracker ou les gates.
- Refaire la stratégie IA complète d'AOT dans ce MVP.
- Dépasser le format deck pour devenir un site marketing ou un portail documentaire.
- Ajouter des fonctionnalités annexes qui n'améliorent ni la narration ni la projection.
- Étendre la présentation au-delà des 39 slides sans décision explicite.

## 7. Personas

### Persona 1 - Yvan, speaker et owner du deck

- Prépare et anime le CVT.
- A besoin d'un support fiable, lisible, élégant et facile à piloter.
- Veut se concentrer sur le discours, pas sur l'outil de présentation.

### Persona 2 - Audience technique AOT

- Regroupe développeurs, tech leads, architectes et profils delivery.
- Attend des distinctions claires entre niveaux, outils, pratiques et limites.
- Rejette les effets de mode et demande des preuves concrètes.

### Persona 3 - Sponsors et décideurs AOT

- Évaluent la pertinence business et organisationnelle d'un pôle IA.
- Veulent un discours crédible, mesuré et actionnable.
- Cherchent une trajectoire de mise en œuvre avec garde-fous, pas une vision floue.

## 8. Jobs To Be Done

- Quand il présente, Yvan veut dérouler le deck de bout en bout sans rupture de rythme liée à l'outil.
- Quand l'audience technique découvre les 5 niveaux, elle veut comprendre ce qui change réellement entre chaque niveau.
- Quand les sponsors évaluent la proposition, ils veulent relier maturité IA, valeur opérationnelle et gouvernance.
- Quand une démo live survient, l'audience veut qu'elle éclaire le propos au lieu de créer un hors-sujet.

## 9. Proposition de valeur

Un deck web de niveau enterprise qui combine pédagogie, preuve terrain et proposition organisationnelle, tout en restant compatible avec les contraintes réelles d'une projection en salle et d'une démonstration live.

## 10. Périmètre MVP

Le MVP est le minimum nécessaire pour tenir le CVT complet avec crédibilité, fluidité et maîtrise.

### Inclus dans le MVP

- Application deck Next.js 16 en format 16:9 avec expérience plein écran.
- 39 slides complètes réparties en 7 parties cohérentes.
- Navigation clavier fiable pour avancer, reculer, aller au début, à la fin, ouvrir l'overview, activer le plein écran et basculer l'écran noir.
- Progression visuelle discrète et utile en présentation.
- Partie 2 solide sur les 5 niveaux de maturité IA.
- Partie 3 solide sur D2R2 avec workflow, exemples, métriques et apprentissages.
- Partie 4 solide sur BMAD + LangGraph comme passage au niveau 4.
- Partie 5 solide sur le pôle IA AOT avec mission, piliers, roadmap et KPIs.
- Partie 6 préparant et absorbant la démo live.
- Partie 7 fermant le récit avec prochaines étapes, ressources et contact.

### Hors périmètre MVP

- Produit autonome pour piloter BMAD ou le tracker.
- Analytics avancées ou back-office éditorial.
- Refonte massive des processus internes AOT.
- Industrialisation au-delà de ce qui est requis pour livrer et projeter le deck.
- Fonctionnalités de partage, publication ou collaboration qui n'apportent rien au CVT immédiat.

## 11. Fonctionnalités Must / Should / Could

### Must Have

- Conserver la structure de 39 slides et les 7 parties du récit.
- Remplacer les placeholders des slides 7 à 39 par du contenu réellement présentable.
- Garantir une navigation clavier robuste et cohérente avec un usage keynote-like.
- Préserver le plein écran, l'overview, la progression et l'écran noir pendant la présentation.
- Expliquer clairement les 5 niveaux de maturité IA, avec niveau 3 comme cible court terme.
- Présenter D2R2 comme preuve tangible d'un mode agent guidé en production.
- Expliquer BMAD + LangGraph comme mécanisme de montée en maturité, pas comme fin en soi.
- Défendre la création d'un pôle IA AOT avec une proposition crédible, mesurée et concrète.
- Maintenir une lisibilité projection élevée sur toutes les slides.
- Garder le produit côté présentation en français.

### Should Have

- Montrer que le deck est lui-même une preuve secondaire de delivery agentique discipliné.
- Intégrer des métriques D2R2 même partielles, tant qu'elles restent honnêtes et contextualisées.
- Tolérer des assets réels manquants temporairement sans casser la narration.
- Offrir des repères de répétition et de navigation rapide utiles au speaker.
- Structurer la démo live comme un segment narratif intégré au deck.

### Could Have

- Déploiement Vercel pour revue distante.
- Réutilisation des composants visuels pour d'autres talks AOT.
- Variante post-événement plus légère pour partage interne.
- Aides speaker additionnelles si elles restent invisibles pour l'audience et sans coût d'usage.

## 12. Exigences fonctionnelles détaillées

### Expérience de présentation

- Le presenter doit pouvoir naviguer sans souris.
- Le ratio 16:9 doit rester stable et exploitable sur écran de salle.
- L'interface ne doit pas détourner l'attention du contenu.
- Le deck doit rester utilisable localement sans dépendance réseau critique.

### Contenu et narration

- Chaque partie doit faire progresser le récit vers la décision attendue.
- Les slides de maturité doivent clarifier les différences de posture, d'outillage et de gouvernance entre les niveaux.
- Les slides D2R2 doivent montrer des preuves crédibles : workflows, artefacts, métriques, apprentissages.
- Les slides BMAD + LangGraph doivent expliquer le human-in-the-loop et les validation gates sans noyer l'audience dans un atelier process.
- Les slides sur le pôle IA doivent convertir la compréhension acquise en proposition d'action AOT.

### Démo live

- La démo doit être introduite, bornée et refermée par le deck.
- Le deck doit rester compréhensible même si la démo est raccourcie ou perturbée.
- Une slide de retour démo doit expliciter les enseignements à retenir.

## 13. Arc narratif produit

L'arc de livraison de référence est :

1. Contexte et cadrage.
2. Les 5 niveaux de maturité IA.
3. Preuve par l'exemple avec D2R2.
4. BMAD + LangGraph pour aller plus loin.
5. Proposition de pôle IA AOT.
6. Démo live.
7. Clôture et appel à l'action.

Le workflow agentique n'apparaît dans le deck que lorsqu'il renforce la crédibilité du propos. Il ne doit jamais décentrer le récit.

## 14. Epics produit

### Epic 1 - Fiabiliser l'expérience de deck et de projection

Finaliser le moteur de présentation, l'ergonomie speaker et la stabilité d'affichage pour un usage réel en salle.

### Epic 2 - Construire le cœur pédagogique sur les 5 niveaux de maturité IA

Produire les slides 6 à 15 pour rendre la montée en maturité claire, concrète et mémorisable.

### Epic 3 - Démontrer la valeur du niveau 3 via D2R2

Produire les slides 16 à 23 pour faire de D2R2 une preuve crédible de valeur et d'apprentissages.

### Epic 4 - Expliquer la montée vers le niveau 4 avec BMAD + LangGraph

Produire les slides 24 à 28 pour montrer les limites du niveau 3 et l'intérêt d'une orchestration gouvernée.

### Epic 5 - Transformer le récit en proposition de pôle IA AOT

Produire les slides 29 à 34 pour articuler mission, piliers, roadmap et KPIs du pôle IA.

### Epic 6 - Encadrer la démo live et la clôture

Produire et fiabiliser les slides 35 à 39 afin de sécuriser la démonstration et la conclusion.

## 15. KPIs produit

### KPIs de livraison

- 39 slides intégrées dans la configuration finale du deck.
- 7 parties couvertes sans trou narratif.
- 0 placeholder résiduel dans la version prête à présenter.
- 0 régression critique sur navigation, plein écran, overview ou écran noir.

### KPIs d'expérience de présentation

- Le speaker peut dérouler une répétition complète sans blocage outil.
- La lisibilité projetée reste satisfaisante sur l'ensemble du deck.
- Les transitions n'introduisent pas de latence ou de rupture perceptible.
- La démo live peut être ouverte et fermée sans perte de compréhension.

### KPIs de crédibilité métier

- Le deck rend compréhensible et défendable la cible AOT niveau 3.
- Le deck présente une trajectoire crédible vers un niveau 4 gouverné.
- Le deck produit un argumentaire exploitable sur la création d'un pôle IA AOT.

## 16. Contraintes techniques

- Stack imposée : Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4.
- Les conventions de la version de Next.js utilisée dans le dépôt doivent être respectées.
- Le moteur de deck existant autour de `Deck`, `DeckProvider` et `slides.config.ts` doit rester la base d'évolution.
- Le produit doit rester performant et stable en mode plein écran local.
- Le ratio 16:9, le contraste, la lisibilité et la fluidité des transitions sont des contraintes produit de premier ordre.
- La navigation clavier est un besoin central, pas un bonus.
- Les contenus doivent pouvoir évoluer sans refonte complète de la structure des slides.
- Les assets réels D2R2 peuvent arriver plus tard, mais le deck doit être structuré pour les accueillir proprement.
- Le workflow BMAD et le tracker ne doivent pas injecter de complexité visible dans l'expérience de projection.

## 17. Contraintes business

- Le support doit rester crédible pour une audience mixte technique et décideur au sein d'ACTON Technology.
- Le discours doit vendre une ambition réaliste, pas une maturité surestimée.
- Les preuves D2R2 doivent rester défendables, même si certaines métriques sont initialement estimées.
- La proposition de pôle IA doit être progressive, concrète et compatible avec un démarrage pragmatique.
- Le deck doit convaincre sans transformer la présentation en démonstration de tooling pour initiés.
- La thèse principale à soutenir est : AOT doit se structurer autour de l'IA maintenant, avec un cadre maîtrisé.

## 18. Dépendances et intrants

- `README.md` pour le positionnement produit et l'arc général.
- `plans/deck-plan.md` pour la structure des 39 slides et les objectifs de chaque partie.
- `src/lib/slides.config.ts` pour l'état réel du deck et la liste des slides.
- `src/components/deck/Deck.tsx` pour les capacités actuelles de projection et de navigation.

Intrants encore à préciser :

- métriques réelles D2R2 ;
- captures supplémentaires de workflow D2R2 ;
- date exacte du CVT ;
- éventuels assets de marque AOT.

## 19. Risques principaux

- Le deck reste trop orienté "process de fabrication" et pas assez orienté valeur métier.
- La qualité visuelle ou la lisibilité projection est insuffisante pour un contexte enterprise.
- Les sections D2R2, BMAD/LangGraph ou pôle IA restent trop génériques faute de preuves concrètes.
- La démo live casse le rythme ou fragilise la fin de la présentation.
- Le backlog de réalisation dérive vers du support workflow au lieu de terminer les slides et l'expérience de projection.

## 20. Hypothèses et points ouverts

- Le plan validé à 39 slides reste la référence tant qu'aucune décision explicite ne le remplace.
- `plans/deck-outline.md` étant absent, `plans/deck-plan.md` et le code actuel font foi.
- Les métriques D2R2 peuvent être raffinées plus tard sans changer l'ossature du deck.
- Certaines preuves visuelles peuvent être temporaires pendant la production si elles restent explicites et crédibles.

## 21. Recommandation de livraison

La suite du delivery doit rester simple :

1. terminer les slides manquantes et supprimer tous les placeholders ;
2. préserver la qualité de projection et la fiabilité du moteur de deck ;
3. renforcer les preuves D2R2, BMAD/LangGraph et pôle IA ;
4. utiliser BMAD, le tracker et les gates uniquement comme support de fabrication et de pilotage.

Tout backlog ou lot de stories ultérieur doit être dérivé de ce cadrage deck-first.
