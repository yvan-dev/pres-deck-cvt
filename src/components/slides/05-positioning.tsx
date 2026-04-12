"use client";

import { ArrowUpRight, Milestone, ShieldAlert } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";
import { MaturityPositioningBoard } from "@/components/shared/MaturityPositioningBoard";

const rows = [
    {
        label: "AOT aujourd'hui",
        from: 2 as const,
        to: 2 as const,
        tone: "neutral" as const,
        note: "Assistant majoritaire",
    },
    {
        label: "Marché crédible",
        from: 2 as const,
        to: 3 as const,
        tone: "accent" as const,
        note: "Le centre de gravité glisse vers N3",
    },
    {
        label: "Référence avancée type EDF",
        from: 3 as const,
        to: 4 as const,
        tone: "signal" as const,
        note: "L'écart se crée sur l'orchestration",
    },
    {
        label: "AOT cible · 12 mois",
        from: 3 as const,
        to: 3 as const,
        tone: "primary" as const,
        note: "N3 standardisé",
    },
    {
        label: "AOT cible · 24 mois",
        from: 4 as const,
        to: 4 as const,
        tone: "primary" as const,
        note: "N4 ciblé",
    },
];

const PositioningSlide = () => {
    return (
        <Slide slideKey={5} slideNumber={5} eyebrow="Partie 1 · Contexte">
            <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
                <div className="max-w-5xl">
                    <div className="industrial-kicker">Positionnement</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Où en est AOT, et où devons-nous être ?
                    </h2>
                    <p className="mt-5 text-xl text-[color:var(--aot-text-muted)]">
                        La bonne marche n&apos;est ni prudente ni spectaculaire. Elle est utile.
                    </p>
                </div>

                <div className="grid grid-cols-[0.82fr_1.18fr] gap-6">
                    <div className="grid gap-5">
                        <IndustrialPanel eyebrow="Cap" title="Le prochain saut sain: N3" tone="primary">
                            <div className="flex items-center gap-4">
                                <div className="rounded-2xl border border-[rgba(23,229,23,0.2)] bg-[rgba(23,229,23,0.08)] p-4 text-[color:var(--aot-primary-hi)]">
                                    <Milestone size={22} />
                                </div>
                                <div className="text-base font-medium text-[color:var(--aot-text)]">
                                    Normaliser la délégation supervisée avant de promettre N4.
                                </div>
                            </div>
                        </IndustrialPanel>

                        <IndustrialPanel eyebrow="Risque" title="Deux erreurs à éviter" tone="signal">
                            <div className="grid gap-3">
                                <div className="liquid-pill rounded-2xl px-4 py-3 text-sm text-[color:var(--aot-text)]">
                                    1. Rester confortablement en N2
                                </div>
                                <div className="liquid-pill rounded-2xl px-4 py-3 text-sm text-[color:var(--aot-text)]">
                                    2. Vendre du N4 sans gouvernance
                                </div>
                            </div>
                        </IndustrialPanel>
                    </div>

                    <MaturityPositioningBoard rows={rows} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <IndustrialPanel eyebrow="Court terme" title="Stabiliser la pratique">
                        <div className="flex items-center gap-3 text-sm font-medium text-[color:var(--aot-text)]">
                            <ArrowUpRight size={16} />
                            <span>Prompt · plan · patch · test · revue</span>
                        </div>
                    </IndustrialPanel>

                    <IndustrialPanel eyebrow="Moyen terme" title="Choisir les flux N4" tone="accent">
                        <div className="flex items-center gap-3 text-sm font-medium text-[color:var(--aot-text)]">
                            <ArrowUpRight size={16} />
                            <span>Seulement là où les gates ont du levier</span>
                        </div>
                    </IndustrialPanel>

                    <IndustrialPanel eyebrow="Gouvernance" title="Créer une capacité transverse" tone="signal">
                        <div className="flex items-center gap-3 text-sm font-medium text-[color:var(--aot-text)]">
                            <ShieldAlert size={16} />
                            <span>Le sujet doit dépasser les initiatives individuelles</span>
                        </div>
                    </IndustrialPanel>
                </div>
            </div>
        </Slide>
    );
};

export default PositioningSlide;
