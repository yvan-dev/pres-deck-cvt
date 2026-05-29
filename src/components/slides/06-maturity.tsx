"use client";

import Image from "next/image";
import { Bot, CircleEllipsis, Layers3, Sparkles, Workflow } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";
import { MATURITY_LEVELS } from "@/content/levels";

const icons = [CircleEllipsis, Sparkles, Bot, Workflow, Layers3];

const MaturitySlide = () => {
    return (
        <Slide slideKey={5} slideNumber={5} eyebrow="Partie 2 / Maturité">
            <div className="grid h-full grid-rows-[auto_1fr_auto] gap-5">
                <div className="flex items-end justify-between gap-8">
                    <div className="max-w-5xl">
                        <div className="industrial-kicker">Cadre de lecture</div>
                        <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                            Les 5 niveaux de maturité IA
                        </h2>
                    </div>
                    <div className="hidden max-w-md text-right text-lg leading-relaxed text-[color:var(--aot-text-muted)] xl:block">
                        Le deck se concentre sur le passage N2 → N3.
                    </div>
                </div>

                <div className="grid min-h-0 grid-cols-[1.08fr_0.92fr] gap-5">
                    <div className="grid grid-cols-5 gap-3">
                        {MATURITY_LEVELS.map((level, index) => {
                            const Icon = icons[index];
                            const isTarget = level.id === 3;

                            return (
                                <IndustrialPanel
                                    key={level.id}
                                    eyebrow={`N${level.id}`}
                                    title={level.label}
                                    tone={isTarget ? "primary" : level.id === 4 ? "signal" : "neutral"}
                                    className="justify-between p-4"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--aot-border-subtle)] bg-[color:var(--aot-icon-bg)] text-[color:var(--aot-primary-hi)]">
                                        <Icon size={18} />
                                    </div>
                                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                        {level.tagline}
                                    </div>
                                    <div className="mt-auto h-1.5 overflow-hidden rounded-full bg-[color:var(--aot-track)]">
                                        <div
                                            className="h-full rounded-full bg-[color:var(--aot-primary)]"
                                            style={{ width: `${level.autonomy}%` }}
                                        />
                                    </div>
                                </IndustrialPanel>
                            );
                        })}
                    </div>

                    <div className="relative min-h-0 overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                        <Image
                            src="/generated/ai-maturity-levels.png"
                            alt="Illustration des cinq niveaux de maturité IA"
                            fill
                            className="object-cover"
                            sizes="42vw"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="industrial-kicker text-white/70">Lecture immédiate</div>
                            <div className="mt-1 text-2xl font-semibold text-white">
                                N3 = déléguer, contrôler, vérifier
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <IndustrialPanel eyebrow="N2" title="Le développeur pilote tout" />
                    <IndustrialPanel eyebrow="N3" title="L'agent exécute sous contrôle" tone="primary" />
                    <IndustrialPanel eyebrow="N4" title="Les gates pilotent le workflow" tone="signal" />
                </div>
            </div>
        </Slide>
    );
};

export default MaturitySlide;
