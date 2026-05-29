import type { ComponentType } from "react";

import CoverSlide from "@/components/slides/01-cover";
import PositioningSlide from "@/components/slides/05-positioning";
import MaturitySlide from "@/components/slides/06-maturity";
import {
    AiPoleSlide,
    D2R2ProofSlide,
    DemoBriefingSlide,
    GovernanceSlide,
    IndustrialNarrativeMap,
    OperatingModelSlide,
    QaSlide,
    RoadmapSlide,
    SpeechTimingSlide,
} from "@/components/slides/industrial-refresh";

export type PartId = 1 | 2 | 3 | 4 | 5;

export type SlideMeta = {
    id: number;
    part: PartId;
    partLabel: string;
    title: string;
    component: ComponentType;
};

export const PARTS: Record<PartId, string> = {
    1: "Contexte",
    2: "Maturite",
    3: "Preuve",
    4: "Industrialisation",
    5: "Demo + decisions",
};

export const SLIDES: SlideMeta[] = [
    {
        id: 1,
        part: 1,
        partLabel: PARTS[1],
        title: "Le developpement agentique a AOT",
        component: CoverSlide,
    },
    {
        id: 2,
        part: 1,
        partLabel: PARTS[1],
        title: "Format 15 / 15 / 10",
        component: SpeechTimingSlide,
    },
    {
        id: 3,
        part: 1,
        partLabel: PARTS[1],
        title: "L'IA devient une unite d'execution",
        component: IndustrialNarrativeMap,
    },
    {
        id: 4,
        part: 2,
        partLabel: PARTS[2],
        title: "Positionnement AOT et cible",
        component: PositioningSlide,
    },
    {
        id: 5,
        part: 2,
        partLabel: PARTS[2],
        title: "Les 5 niveaux de maturite IA",
        component: MaturitySlide,
    },
    {
        id: 6,
        part: 3,
        partLabel: PARTS[3],
        title: "D2R2 comme preuve terrain",
        component: D2R2ProofSlide,
    },
    {
        id: 7,
        part: 3,
        partLabel: PARTS[3],
        title: "Mode operatoire N3",
        component: OperatingModelSlide,
    },
    {
        id: 8,
        part: 4,
        partLabel: PARTS[4],
        title: "N4 via BMAD et LangGraph",
        component: GovernanceSlide,
    },
    {
        id: 9,
        part: 4,
        partLabel: PARTS[4],
        title: "Pole IA transverse",
        component: AiPoleSlide,
    },
    {
        id: 10,
        part: 5,
        partLabel: PARTS[5],
        title: "Briefing demo live",
        component: DemoBriefingSlide,
    },
    {
        id: 11,
        part: 5,
        partLabel: PARTS[5],
        title: "Roadmap 90 jours",
        component: RoadmapSlide,
    },
    {
        id: 12,
        part: 5,
        partLabel: PARTS[5],
        title: "Questions et decisions",
        component: QaSlide,
    },
];
