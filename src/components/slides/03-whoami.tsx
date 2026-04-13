"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, Gauge, Scale, Wrench } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";

const evidence = [
    { value: "~70", label: "beads", tone: "accent" as const },
    { value: "~40", label: "PR estimées", tone: "neutral" as const },
    { value: "N3", label: "déjà pratiqué", tone: "primary" as const },
];

const stance = [
    {
        icon: BriefcaseBusiness,
        title: "Terrain réel",
        detail: "delivery avant théorie",
    },
    {
        icon: Gauge,
        title: "Lecture orientée résultat",
        detail: "vitesse, qualité, contrôle",
    },
    {
        icon: Scale,
        title: "Posture équilibrée",
        detail: "ni hype ni rejet",
    },
    {
        icon: Wrench,
        title: "But",
        detail: "outiller une décision",
    },
];

const WhoAmISlide = () => {
    return (
        <Slide slideKey={3} slideNumber={3} eyebrow="Partie 1 · Contexte">
            <div className="grid h-full grid-cols-[0.92fr_1.08fr] gap-8">
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="industrial-kicker">Qui je suis</div>
                        <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                            Je parle depuis la delivery.
                        </h2>
                        <p className="mt-5 max-w-xl text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                            Développeur. Workflow agentique déjà pratiqué. Regard orienté exécution.
                        </p>
                    </div>

                    <IndustrialPanel eyebrow="Intention" title="Donner à AOT un langage commun" tone="primary">
                        <div className="text-lg font-medium text-[color:var(--aot-text)]">
                            Pas une démo de plus. Un cadre pour décider.
                        </div>
                    </IndustrialPanel>
                </div>

                <div className="grid grid-rows-[auto_1fr] gap-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="grid grid-cols-3 gap-4"
                    >
                        {evidence.map((item) => (
                            <IndustrialPanel
                                key={item.label}
                                eyebrow="Signal"
                                title={item.value}
                                tone={item.tone}
                                className="justify-between"
                            >
                                <div className="text-sm text-[color:var(--aot-text-muted)]">
                                    {item.label}
                                </div>
                            </IndustrialPanel>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        {stance.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.04 }}
                                >
                                    <IndustrialPanel title={item.title} className="h-full justify-between">
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
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default WhoAmISlide;
