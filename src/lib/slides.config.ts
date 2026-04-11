import type { ComponentType } from "react";

import CoverSlide from "@/components/slides/01-cover";
import SummarySlide from "@/components/slides/02-summary";
import WhoAmISlide from "@/components/slides/03-who-am-i";
import ContextSlide from "@/components/slides/04-context";
import WhereWeAreSlide from "@/components/slides/05-where-we-are";
import OverviewSlide from "@/components/slides/06-overview";
import N1ChatSlide from "@/components/slides/07-n1-chat";
import N2CopilotSlide from "@/components/slides/08-n2-copilot";
import N3AgentSlide from "@/components/slides/09-n3-agent";
import N3ToolsSlide from "@/components/slides/10-n3-tools";
import N3PracticesSlide from "@/components/slides/11-n3-practices";
import N4HitlSlide from "@/components/slides/12-n4-hitl";
import N4ZoomSlide from "@/components/slides/13-n4-zoom";
import N5SwarmSlide from "@/components/slides/14-n5-swarm";
import PositioningSlide from "@/components/slides/15-positioning";
import { makePlaceholderSlide } from "@/components/slides/placeholder";

export type PartId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type SlideMeta = {
    id: number;
    part: PartId;
    partLabel: string;
    title: string;
    component: ComponentType;
};

/**
 * Les 7 parties et leur label affichable.
 */
export const PARTS: Record<PartId, string> = {
    1: "Contexte",
    2: "Maturité",
    3: "D2R2",
    4: "BMAD/LG",
    5: "Pôle IA",
    6: "Démo",
    7: "Clôture",
};

/**
 * Les 39 slides du deck.
 * Phase 1 : 2 slides réels + 37 placeholders.
 * Les placeholders seront remplacés au fil des Phases 3, 4 et 5.
 */
export const SLIDES: SlideMeta[] = [
    // ── Partie 1 — Contexte (5)
    { id: 1, part: 1, partLabel: PARTS[1], title: "Le développement agentique à AOT", component: CoverSlide },
    { id: 2, part: 1, partLabel: PARTS[1], title: "Sommaire", component: SummarySlide },
    { id: 3, part: 1, partLabel: PARTS[1], title: "Qui je suis", component: WhoAmISlide },
    { id: 4, part: 1, partLabel: PARTS[1], title: "Le constat — ce qui a changé en 18 mois", component: ContextSlide },
    { id: 5, part: 1, partLabel: PARTS[1], title: "Où en est AOT ? Où devrait-on être ?", component: WhereWeAreSlide },

    // ── Partie 2 — Maturité (10)
    { id: 6, part: 2, partLabel: PARTS[2], title: "Vue d'ensemble — 5 niveaux de maturité", component: OverviewSlide },
    { id: 7, part: 2, partLabel: PARTS[2], title: "N1 — Chat", component: N1ChatSlide },
    { id: 8, part: 2, partLabel: PARTS[2], title: "N2 — Copilote", component: N2CopilotSlide },
    { id: 9, part: 2, partLabel: PARTS[2], title: "N3 — Agent guidé ⭐", component: N3AgentSlide },
    { id: 10, part: 2, partLabel: PARTS[2], title: "Zoom N3 : les outils", component: N3ToolsSlide },
    { id: 11, part: 2, partLabel: PARTS[2], title: "Zoom N3 : les pratiques", component: N3PracticesSlide },
    { id: 12, part: 2, partLabel: PARTS[2], title: "N4 — Human in the Loop", component: N4HitlSlide },
    { id: 13, part: 2, partLabel: PARTS[2], title: "Zoom N4 : BMAD + LangGraph", component: N4ZoomSlide },
    { id: 14, part: 2, partLabel: PARTS[2], title: "N5 — Swarm", component: N5SwarmSlide },
    { id: 15, part: 2, partLabel: PARTS[2], title: "Positionnement — Marché / EDF / AOT / Cibles", component: PositioningSlide },

    // ── Partie 3 — D2R2 (8)
    { id: 16, part: 3, partLabel: PARTS[3], title: "D2R2 en 1 slide", component: makePlaceholderSlide(16, 3, "D2R2 en 1 slide") },
    { id: 17, part: 3, partLabel: PARTS[3], title: "Workflow mis en place", component: makePlaceholderSlide(17, 3, "Workflow mis en place") },
    { id: 18, part: 3, partLabel: PARTS[3], title: "Diagramme — du ticket au PR", component: makePlaceholderSlide(18, 3, "Diagramme — du ticket au PR") },
    { id: 19, part: 3, partLabel: PARTS[3], title: "Exemple réel : un bead", component: makePlaceholderSlide(19, 3, "Exemple réel : un bead") },
    { id: 20, part: 3, partLabel: PARTS[3], title: "Exemple réel : un plan d'implémentation", component: makePlaceholderSlide(20, 3, "Exemple réel : un plan d'implémentation") },
    { id: 21, part: 3, partLabel: PARTS[3], title: "Exemple réel : un recap + LEARNED", component: makePlaceholderSlide(21, 3, "Exemple réel : un recap + LEARNED") },
    { id: 22, part: 3, partLabel: PARTS[3], title: "Métriques D2R2", component: makePlaceholderSlide(22, 3, "Métriques D2R2") },
    { id: 23, part: 3, partLabel: PARTS[3], title: "Apprentissages clés", component: makePlaceholderSlide(23, 3, "Apprentissages clés") },

    // ── Partie 4 — BMAD/LangGraph (5)
    { id: 24, part: 4, partLabel: PARTS[4], title: "Pourquoi N4 ?", component: makePlaceholderSlide(24, 4, "Pourquoi N4 ?") },
    { id: 25, part: 4, partLabel: PARTS[4], title: "BMAD en 1 schéma", component: makePlaceholderSlide(25, 4, "BMAD en 1 schéma") },
    { id: 26, part: 4, partLabel: PARTS[4], title: "LangGraph : validation gates", component: makePlaceholderSlide(26, 4, "LangGraph : validation gates") },
    { id: 27, part: 4, partLabel: PARTS[4], title: "Exemple concret de workflow", component: makePlaceholderSlide(27, 4, "Exemple concret de workflow") },
    { id: 28, part: 4, partLabel: PARTS[4], title: "Retours d'expérience", component: makePlaceholderSlide(28, 4, "Retours d'expérience") },

    // ── Partie 5 — Pôle IA (6)
    { id: 29, part: 5, partLabel: PARTS[5], title: "Pourquoi un pôle IA maintenant", component: makePlaceholderSlide(29, 5, "Pourquoi un pôle IA maintenant") },
    { id: 30, part: 5, partLabel: PARTS[5], title: "Mission & positionnement", component: makePlaceholderSlide(30, 5, "Mission & positionnement") },
    { id: 31, part: 5, partLabel: PARTS[5], title: "Les 4 piliers", component: makePlaceholderSlide(31, 5, "Les 4 piliers") },
    { id: 32, part: 5, partLabel: PARTS[5], title: "Roadmap T0 → T+12 mois", component: makePlaceholderSlide(32, 5, "Roadmap T0 → T+12 mois") },
    { id: 33, part: 5, partLabel: PARTS[5], title: "KPIs & mesures de succès", component: makePlaceholderSlide(33, 5, "KPIs & mesures de succès") },
    { id: 34, part: 5, partLabel: PARTS[5], title: "Comment rejoindre / contribuer", component: makePlaceholderSlide(34, 5, "Comment rejoindre / contribuer") },

    // ── Partie 6 — Démo (3)
    { id: 35, part: 6, partLabel: PARTS[6], title: "Transition démo", component: makePlaceholderSlide(35, 6, "Transition démo") },
    { id: 36, part: 6, partLabel: PARTS[6], title: "Démo live Claude Code", component: makePlaceholderSlide(36, 6, "Démo live Claude Code") },
    { id: 37, part: 6, partLabel: PARTS[6], title: "Retour démo", component: makePlaceholderSlide(37, 6, "Retour démo") },

    // ── Partie 7 — Clôture (2)
    { id: 38, part: 7, partLabel: PARTS[7], title: "Prochaines étapes + appel à action", component: makePlaceholderSlide(38, 7, "Prochaines étapes + appel à action") },
    { id: 39, part: 7, partLabel: PARTS[7], title: "Q&A + ressources + contact", component: makePlaceholderSlide(39, 7, "Q&A + ressources + contact") },
];
