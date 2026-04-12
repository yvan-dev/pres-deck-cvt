"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Radar, ShieldCheck, Target } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";

const proofPoints = [
    {
        eyebrow: "Pourquoi maintenant",
        title: "L'IA n'est plus une interface, c'est une capacité d'exécution.",
    },
    {
        eyebrow: "Cible",
        title: "Faire du niveau 3 un standard opérationnel crédible chez AOT.",
    },
    {
        eyebrow: "Preuve",
        title: "Le deck s'appuie sur un workflow déjà vécu sur D2R2.",
    },
];

const coverSignals = [
    {
        icon: Radar,
        eyebrow: "Mandat",
        title: "Aligner un niveau de maturité commun",
        detail:
            "Mettre des mots, des preuves et une cible claire sur l'usage de l'IA dans les équipes de delivery.",
        tone: "accent" as const,
    },
    {
        icon: Target,
        eyebrow: "Objectif 12 mois",
        title: "Stabiliser N3",
        detail:
            "Passer d'initiatives individuelles à un mode opératoire partagé, outillé et mesurable.",
        tone: "primary" as const,
    },
    {
        icon: ShieldCheck,
        eyebrow: "Angle",
        title: "Industrialiser sans folklore",
        detail:
            "Conserver la rigueur projet, la qualité et la gouvernance au lieu de vendre de la magie.",
        tone: "signal" as const,
    },
];

const statPills = [
    "39 slides",
    "7 chapitres",
    "niveau 3 comme cible",
    "D2R2 comme terrain",
];

const CoverSlide = () => {
    return (
        <Slide slideKey={1} contentClassName="px-[5.2%] py-[4.6%]">
            <div className="grid h-full grid-cols-[1.22fr_0.78fr] gap-8">
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
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                            className="industrial-kicker"
                        >
                            Think · Act · Code
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.05 }}
                            className="font-display mt-5 text-[4.8rem] font-semibold leading-[0.93] tracking-[-0.08em] text-[color:var(--aot-text)]"
                        >
                            Transformer
                            <br />
                            l&apos;IA en{" "}
                            <span className="aot-gradient-text">capacité industrielle</span>
                            <br />
                            chez AOT.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.12 }}
                            className="mt-8 max-w-3xl text-xl leading-relaxed text-[color:var(--aot-text-muted)]"
                        >
                            Comprendre les 5 niveaux de maturité IA, situer AOT
                            sans complaisance, viser un niveau 3 robuste puis
                            préparer un niveau 4 gouverné.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.18 }}
                            className="mt-8 flex flex-wrap gap-3"
                        >
                            {statPills.map((pill, index) => (
                                <span
                                    key={pill}
                                    className="industrial-chip"
                                    data-tone={index === 2 ? "primary" : undefined}
                                >
                                    {pill}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.24 }}
                        className="grid grid-cols-3 gap-4"
                    >
                        {proofPoints.map((point) => (
                            <IndustrialPanel
                                key={point.eyebrow}
                                eyebrow={point.eyebrow}
                                title={point.title}
                                className="min-h-[11rem] justify-between"
                            >
                                <div className="flex items-center gap-2 text-sm text-[color:var(--aot-text-dim)]">
                                    <ArrowUpRight size={15} />
                                    <span>Décision attendue, pas simple inspiration.</span>
                                </div>
                            </IndustrialPanel>
                        ))}
                    </motion.div>
                </div>

                <div className="flex flex-col gap-5">
                    <IndustrialPanel className="gap-6 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="industrial-kicker">Présenté par</div>
                                <div className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--aot-text)]">
                                    Yvan Gunewou
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                    Tech Lead D2R2 · porteur du workflow agentique
                                    terrain · focus delivery et industrialisation.
                                </p>
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

                        <div className="industrial-rule" />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[rgba(23,229,23,0.2)] bg-[rgba(23,229,23,0.06)] p-4">
                                <div className="industrial-kicker">Position actuelle</div>
                                <div className="mt-2 text-2xl font-semibold text-[color:var(--aot-text)]">
                                    N2 majoritaire
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[rgba(255,191,91,0.24)] bg-[rgba(255,191,91,0.07)] p-4">
                                <div className="industrial-kicker">Ambition</div>
                                <div className="mt-2 text-2xl font-semibold text-[color:var(--aot-text)]">
                                    N3 stabilisé
                                </div>
                            </div>
                        </div>
                    </IndustrialPanel>

                    {coverSignals.map((signal) => {
                        const Icon = signal.icon;

                        return (
                            <IndustrialPanel
                                key={signal.eyebrow}
                                eyebrow={signal.eyebrow}
                                title={signal.title}
                                tone={signal.tone}
                                className="gap-3"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3 text-[color:var(--aot-text-muted)]">
                                        <Icon size={18} />
                                    </div>
                                    <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                        {signal.detail}
                                    </p>
                                </div>
                            </IndustrialPanel>
                        );
                    })}
                </div>
            </div>
        </Slide>
    );
};

export default CoverSlide;
