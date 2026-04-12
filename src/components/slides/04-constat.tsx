"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, ClipboardCheck, GitPullRequest, SearchCheck } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { MetricCard } from "@/components/shared/MetricCard";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";
import { MARKET_METRICS } from "@/content/metrics";

const flow = [
    { icon: SearchCheck, label: "Investiguer" },
    { icon: ClipboardCheck, label: "Planifier" },
    { icon: Bot, label: "Exécuter" },
    { icon: GitPullRequest, label: "Valider" },
];

const decisions = [
    "N3 devient le vrai saut utile",
    "Le process vaut plus que l'outil",
    "Rester à N2 crée un retard silencieux",
];

const ConstatSlide = () => {
    return (
        <Slide slideKey={4} slideNumber={4} eyebrow="Partie 1 · Contexte">
            <div className="grid h-full grid-rows-[auto_auto_1fr] gap-6">
                <div className="max-w-5xl">
                    <div className="industrial-kicker">Le constat</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                        En 18 mois, le sujet est passé de l&apos;assistance à l&apos;exécution.
                    </h2>
                    <p className="mt-5 text-xl text-[color:var(--aot-text-muted)]">
                        Le prompt ne déclenche plus une réponse. Il déclenche un travail.
                    </p>
                </div>

                <IndustrialPanel eyebrow="Nouveau flux de travail" title="Le prompt devient une délégation">
                    <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-3">
                        {flow.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.label} className="relative">
                                    <div className="liquid-pill rounded-2xl px-4 py-5 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[color:var(--aot-text-muted)]">
                                            <Icon size={20} />
                                        </div>
                                        <div className="mt-3 text-sm font-medium text-[color:var(--aot-text)]">
                                            {item.label}
                                        </div>
                                    </div>
                                    {index < flow.length - 1 ? (
                                        <div className="absolute right-[-0.95rem] top-1/2 hidden -translate-y-1/2 text-[color:var(--aot-text-dim)] lg:block">
                                            <ArrowRight size={16} />
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </IndustrialPanel>

                <div className="grid grid-cols-[1.08fr_0.92fr] gap-6">
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

                    <IndustrialPanel eyebrow="Ce qu'il faut retenir" title="3 lectures" tone="signal">
                        <div className="grid gap-3">
                            {decisions.map((item, index) => (
                                <div
                                    key={item}
                                    className="liquid-pill rounded-2xl px-4 py-3 text-sm font-medium text-[color:var(--aot-text)]"
                                >
                                    {index + 1}. {item}
                                </div>
                            ))}
                        </div>
                    </IndustrialPanel>
                </div>
            </div>
        </Slide>
    );
};

export default ConstatSlide;
