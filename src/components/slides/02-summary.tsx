"use client";

import { motion } from "framer-motion";
import {
    Blocks,
    Bot,
    Building2,
    CheckCircle2,
    Network,
    Presentation,
    Radar,
} from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";

type SummaryItem = {
    part: number;
    title: string;
    detail: string;
    icon: typeof Radar;
    tone?: "neutral" | "primary" | "accent" | "signal";
};

const SUMMARY: SummaryItem[] = [
    {
        part: 1,
        title: "Contexte",
        detail: "Nommer l'enjeu",
        icon: Radar,
    },
    {
        part: 2,
        title: "Maturité IA",
        detail: "Choisir la cible",
        icon: Blocks,
        tone: "primary",
    },
    {
        part: 3,
        title: "RMC",
        detail: "Prouver le terrain",
        icon: Bot,
        tone: "accent",
    },
    {
        part: 4,
        title: "BMAD / LangGraph",
        detail: "Préparer N4",
        icon: Network,
        tone: "signal",
    },
    {
        part: 5,
        title: "Pôle IA",
        detail: "Structurer l'exécution",
        icon: Building2,
    },
    {
        part: 6,
        title: "Démo",
        detail: "Rendre tangible",
        icon: Presentation,
        tone: "primary",
    },
    {
        part: 7,
        title: "Clôture",
        detail: "Faire atterrir",
        icon: CheckCircle2,
    },
];

const SummarySlide = () => {
    return (
        <Slide slideKey={2} slideNumber={2} eyebrow="Partie 1 · Contexte">
            <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
                <div className="flex items-end justify-between gap-8">
                    <div className="max-w-4xl">
                        <div className="industrial-kicker">Plan de vol</div>
                        <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                            Sommaire
                        </h2>
                        <p className="mt-5 text-lg text-[color:var(--aot-text-muted)]">
                            7 chapitres. 1 seule logique: cadrer, positionner, prouver, industrialiser.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="liquid-pill rounded-2xl px-4 py-3 text-center">
                            <div className="industrial-kicker">slides</div>
                            <div className="mt-1 text-2xl font-semibold text-[color:var(--aot-text)]">
                                39
                            </div>
                        </div>
                        <div className="liquid-pill rounded-2xl px-4 py-3 text-center">
                            <div className="industrial-kicker">cible</div>
                            <div className="mt-1 text-2xl font-semibold text-[color:var(--aot-text)]">
                                N3
                            </div>
                        </div>
                        <div className="liquid-pill rounded-2xl px-4 py-3 text-center">
                            <div className="industrial-kicker">preuve</div>
                            <div className="mt-1 text-2xl font-semibold text-[color:var(--aot-text)]">
                                RMC
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {SUMMARY.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.part}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.03 }}
                            >
                                <IndustrialPanel
                                    eyebrow={`Partie ${item.part}`}
                                    title={item.title}
                                    tone={item.tone ?? "neutral"}
                                    className="h-full min-h-[9.8rem] justify-between"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-sm font-medium text-[color:var(--aot-text-muted)]">
                                            {item.detail}
                                        </div>
                                        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3 text-[color:var(--aot-text-muted)]">
                                            <Icon size={18} />
                                        </div>
                                    </div>
                                </IndustrialPanel>
                            </motion.div>
                        );
                    })}

                    <IndustrialPanel
                        eyebrow="Sortie attendue"
                        title="3 décisions"
                        tone="signal"
                        className="justify-between"
                    >
                        <div className="grid gap-2 text-sm text-[color:var(--aot-text-muted)]">
                            <div>1 · N3 comme standard</div>
                            <div>2 · N4 sur flux choisis</div>
                            <div>3 · Structure transverse</div>
                        </div>
                    </IndustrialPanel>
                </div>

                <div className="industrial-panel flex items-center gap-4 px-5 py-4">
                    <div className="rounded-2xl border border-[rgba(23,229,23,0.2)] bg-[rgba(23,229,23,0.08)] p-3 text-[color:var(--aot-primary-hi)]">
                        <Network size={20} />
                    </div>
                    <div className="text-base font-medium text-[color:var(--aot-text)]">
                        Le deck ne raconte pas l&apos;IA en général. Il raconte un passage maîtrisé de N2 vers N3.
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default SummarySlide;
