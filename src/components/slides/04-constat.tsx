"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { MetricCard } from "@/components/shared/MetricCard";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";
import { MARKET_METRICS } from "@/content/metrics";

const shifts = [
    {
        title: "Le prompt devient une délégation de travail.",
        detail:
            "On ne demande plus seulement une réponse. On demande une investigation, un plan, un patch, un test et une justification.",
    },
    {
        title: "Le coût marginal du prototype s'effondre.",
        detail:
            "Ce qui prenait des jours devient faisable en heures. La différence se déplace de la production brute vers le cadrage et la validation.",
    },
    {
        title: "La valeur se concentre sur le process.",
        detail:
            "Les équipes qui gagnent ne sont pas celles qui ont activé l'IA, mais celles qui savent gouverner son exécution.",
    },
    {
        title: "Rester à N2 crée un retard silencieux.",
        detail:
            "Le gap avec les équipes déjà en N3 n'est pas spectaculaire au début, puis devient structurel sur la vitesse de delivery.",
    },
];

const ConstatSlide = () => {
    return (
        <Slide slideKey={4} slideNumber={4} eyebrow="Partie 1 · Contexte">
            <div className="grid h-full grid-rows-[auto_1fr] gap-6">
                <div className="max-w-5xl">
                    <div className="industrial-kicker">Le constat</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                        En 18 mois, le sujet est passé de l&apos;assistance à
                        l&apos;exécution.
                    </h2>
                    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--aot-text-muted)]">
                        L&apos;impact réel ne vient plus du simple copilote. Il vient
                        de la capacité à déléguer des blocs de travail entiers à des
                        agents, sous contrôle humain.
                    </p>
                </div>

                <div className="grid grid-cols-[1.08fr_0.92fr] gap-6">
                    <div className="grid grid-rows-[auto_1fr] gap-5">
                        <div className="grid grid-cols-4 gap-4">
                            {MARKET_METRICS.slice(0, 4).map((metric, index) => (
                                <motion.div
                                    key={metric.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.04 }}
                                >
                                    <MetricCard
                                        metric={metric}
                                        accent={
                                            index === 0
                                                ? "primary"
                                                : index === 1
                                                  ? "accent"
                                                  : "signal"
                                        }
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {shifts.map((shift, index) => (
                                <IndustrialPanel
                                    key={shift.title}
                                    eyebrow={`Signal ${index + 1}`}
                                    title={shift.title}
                                    className="h-full"
                                >
                                    <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                        {shift.detail}
                                    </p>
                                </IndustrialPanel>
                            ))}
                        </div>
                    </div>

                    <IndustrialPanel eyebrow="Conséquence pour AOT" title="Le vrai sujet n'est pas l'outil, c'est le mode opératoire." tone="signal">
                        <div className="space-y-4 text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            <p>
                                Si AOT reste majoritairement en logique N2, nous
                                captons de la commodité locale mais nous laissons
                                passer le saut de productivité, d&apos;onboarding et de
                                vitesse de cycle apporté par N3.
                            </p>
                            <p>
                                À l&apos;inverse, viser trop tôt N4 sans avoir un N3
                                discipliné produira de la dette, de la confusion et
                                des démonstrateurs impressionnants mais peu fiables.
                            </p>
                        </div>

                        <div className="industrial-rule" />

                        <div className="grid gap-3">
                            <div className="rounded-2xl border border-[rgba(23,229,23,0.2)] bg-[rgba(23,229,23,0.05)] px-4 py-3">
                                <div className="industrial-kicker">Décision 1</div>
                                <div className="mt-1 text-sm font-medium text-[color:var(--aot-text)]">
                                    Nommer N3 comme horizon d&apos;équipe court terme.
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[rgba(255,191,91,0.24)] bg-[rgba(255,191,91,0.05)] px-4 py-3">
                                <div className="industrial-kicker">Décision 2</div>
                                <div className="mt-1 text-sm font-medium text-[color:var(--aot-text)]">
                                    Préparer N4 seulement sur les flux à fort levier.
                                </div>
                            </div>
                        </div>
                    </IndustrialPanel>
                </div>
            </div>
        </Slide>
    );
};

export default ConstatSlide;
