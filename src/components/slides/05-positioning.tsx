"use client";

import Image from "next/image";
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
        note: "Assistance locale dominante",
    },
    {
        label: "Marché crédible",
        from: 2 as const,
        to: 3 as const,
        tone: "accent" as const,
        note: "Les équipes avancées basculent vers N3",
    },
    {
        label: "AOT cible 12 mois",
        from: 3 as const,
        to: 3 as const,
        tone: "primary" as const,
        note: "Agent guidé comme standard projet",
    },
    {
        label: "AOT cible 24 mois",
        from: 4 as const,
        to: 4 as const,
        tone: "signal" as const,
        note: "N4 seulement sur flux gouvernés",
    },
];

const PositioningSlide = () => {
    return (
        <Slide slideKey={4} slideNumber={4} eyebrow="Partie 2 / Positionnement">
            <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-7">
                <div className="flex flex-col justify-between gap-5">
                    <div>
                        <div className="industrial-kicker">Positionnement</div>
                        <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-[color:var(--aot-text)]">
                            AOT doit stabiliser N3 avant de vendre N4.
                        </h2>
                    </div>

                    <div className="relative min-h-[15rem] overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                        <Image
                            src="/generated/ai-maturity-levels.png"
                            alt="Positionnement AOT sur les niveaux de maturité IA"
                            fill
                            className="object-cover"
                            sizes="40vw"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.58)_100%)]" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="industrial-kicker text-white/70">Cap sain</div>
                            <div className="mt-1 text-2xl font-semibold text-white">
                                N3 robuste / N4 ciblé
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <IndustrialPanel eyebrow="Cap" title="Standardiser N3" tone="primary">
                            <div className="flex items-center gap-3 text-sm font-medium text-[color:var(--aot-text)]">
                                <Milestone size={17} />
                                <span>Prompt / plan / patch / test / revue</span>
                            </div>
                        </IndustrialPanel>
                        <IndustrialPanel eyebrow="Risque" title="Sauter trop vite" tone="signal">
                            <div className="flex items-center gap-3 text-sm font-medium text-[color:var(--aot-text)]">
                                <ShieldAlert size={17} />
                                <span>N4 sans gates = dette de contrôle</span>
                            </div>
                        </IndustrialPanel>
                    </div>
                </div>

                <div className="flex flex-col justify-between gap-5">
                    <MaturityPositioningBoard rows={rows} className="min-h-0 flex-1" />

                    <IndustrialPanel eyebrow="Message public" title="La maturité IA est une pratique, pas une licence outil." tone="accent">
                        <div className="flex items-center gap-3 text-base font-medium text-[color:var(--aot-text)]">
                            <ArrowUpRight size={18} />
                            <span>Le vrai différenciant: cadrer, vérifier, capitaliser.</span>
                        </div>
                    </IndustrialPanel>
                </div>
            </div>
        </Slide>
    );
};

export default PositioningSlide;
