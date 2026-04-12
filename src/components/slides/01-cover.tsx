"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bot, Factory, Radar, Target } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";

const markers = [
    {
        icon: Radar,
        label: "Point de départ",
        value: "N2 majoritaire",
        tone: "accent" as const,
    },
    {
        icon: Target,
        label: "Cap 12 mois",
        value: "N3 stabilisé",
        tone: "primary" as const,
    },
    {
        icon: Factory,
        label: "Vision",
        value: "IA industrialisée",
        tone: "signal" as const,
    },
];

const path = [
    { step: "01", label: "Cadrer" },
    { step: "02", label: "Positionner" },
    { step: "03", label: "Prouver" },
    { step: "04", label: "Industrialiser" },
];

const CoverSlide = () => {
    return (
        <Slide slideKey={1} contentClassName="px-[5.2%] py-[4.6%]">
            <div className="grid h-full grid-cols-[1.16fr_0.84fr] gap-8">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="industrial-chip" data-tone="primary">
                            CVT · Executive Briefing
                        </span>
                        <span className="industrial-chip" data-tone="accent">
                            AOT · Delivery & IA
                        </span>
                    </div>

                    <div className="max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="industrial-kicker"
                        >
                            Think · Act · Code
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.04 }}
                            className="font-display mt-5 text-[5rem] font-semibold leading-[0.92] tracking-[-0.08em] text-[color:var(--aot-text)]"
                        >
                            Transformer
                            <br />
                            l&apos;IA en{" "}
                            <span className="aot-gradient-text">capacité industrielle</span>
                            <br />
                            chez AOT.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.08 }}
                            className="mt-7 max-w-2xl text-xl leading-relaxed text-[color:var(--aot-text-muted)]"
                        >
                            5 niveaux de maturité. 1 cible claire. 1 trajectoire crédible.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.12 }}
                        className="grid grid-cols-3 gap-4"
                    >
                        {markers.map((marker) => {
                            const Icon = marker.icon;

                            return (
                                <IndustrialPanel
                                    key={marker.label}
                                    eyebrow={marker.label}
                                    title={marker.value}
                                    tone={marker.tone}
                                    className="min-h-[10rem] justify-between"
                                >
                                    <div className="flex items-center gap-3 text-[color:var(--aot-text-dim)]">
                                        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
                                            <Icon size={18} />
                                        </div>
                                        <span className="text-sm">Signal de lecture</span>
                                    </div>
                                </IndustrialPanel>
                            );
                        })}
                    </motion.div>
                </div>

                <div className="flex flex-col gap-5">
                    <IndustrialPanel className="gap-5 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="industrial-kicker">Présenté par</div>
                                <div className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--aot-text)]">
                                    Yvan Gunewou
                                </div>
                                <div className="mt-2 text-sm text-[color:var(--aot-text-muted)]">
                                    Tech Lead D2R2 · workflow agentique terrain
                                </div>
                            </div>

                            <Image
                                src="/aot-academy-logo.png"
                                alt="AOT Academy"
                                width={432}
                                height={176}
                                priority
                                className="h-14 w-auto opacity-90"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[rgba(23,229,23,0.2)] bg-[rgba(23,229,23,0.06)] p-4">
                                <div className="industrial-kicker">Terrain</div>
                                <div className="mt-2 text-2xl font-semibold text-[color:var(--aot-text)]">
                                    D2R2
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[rgba(77,216,255,0.2)] bg-[rgba(77,216,255,0.06)] p-4">
                                <div className="industrial-kicker">Mode</div>
                                <div className="mt-2 text-2xl font-semibold text-[color:var(--aot-text)]">
                                    Agent guidé
                                </div>
                            </div>
                        </div>
                    </IndustrialPanel>

                    <IndustrialPanel eyebrow="Trajectoire de la présentation" title="Du constat à la capacité">
                        <div className="mt-1 grid grid-cols-4 gap-3">
                            {path.map((item, index) => (
                                <div key={item.step} className="relative">
                                    <div className="liquid-pill rounded-2xl px-3 py-4 text-center">
                                        <div className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--aot-text-dim)]">
                                            {item.step}
                                        </div>
                                        <div className="mt-2 text-sm font-medium text-[color:var(--aot-text)]">
                                            {item.label}
                                        </div>
                                    </div>
                                    {index < path.length - 1 ? (
                                        <div className="absolute left-[calc(100%-0.2rem)] top-1/2 hidden h-px w-4 -translate-y-1/2 bg-[rgba(255,255,255,0.16)] lg:block" />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </IndustrialPanel>

                    <IndustrialPanel eyebrow="Message clé" title="L'IA n'est plus un outil d'assistance.">
                        <div className="flex items-center gap-4">
                            <div className="rounded-2xl border border-[rgba(23,229,23,0.2)] bg-[rgba(23,229,23,0.08)] p-4 text-[color:var(--aot-primary-hi)]">
                                <Bot size={22} />
                            </div>
                            <div className="text-lg font-medium text-[color:var(--aot-text)]">
                                Elle devient une unité d&apos;exécution supervisée.
                            </div>
                        </div>
                    </IndustrialPanel>
                </div>
            </div>
        </Slide>
    );
};

export default CoverSlide;
