"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";

const cards = [
    {
        eyebrow: "Terrain",
        title: "Je parle depuis la delivery, pas depuis la veille.",
        detail:
            "Le point de départ n'est pas une étude abstraite. C'est un workflow projet qui tourne déjà, avec ses coûts, ses frictions et ses bénéfices.",
    },
    {
        eyebrow: "Posture",
        title: "Ni évangéliste naïf, ni gardien du status quo.",
        detail:
            "L'enjeu est de tirer de la vitesse sans perdre la discipline d'ingénierie, le contrôle et la capacité de revue.",
    },
    {
        eyebrow: "Intention",
        title: "Donner à AOT un langage commun pour décider.",
        detail:
            "Le but de ce deck est d'outiller une décision collective, pas de démontrer que l'IA est impressionnante.",
    },
];

const evidence = [
    { value: "~70", label: "beads visibles sur la période" },
    { value: "~40", label: "PR estimées via workflow agentique" },
    { value: "N3", label: "niveau déjà pratiqué sur D2R2" },
];

const WhoAmISlide = () => {
    return (
        <Slide slideKey={3} slideNumber={3} eyebrow="Partie 1 · Contexte">
            <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-8">
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="industrial-kicker">Qui je suis</div>
                        <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                            Je porte ce sujet depuis le terrain.
                        </h2>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--aot-text-muted)]">
                            Tech Lead sur D2R2, j&apos;ai utilisé les agents pour
                            produire, relire, cadrer et accélérer le delivery. Ce
                            retour d&apos;expérience m&apos;intéresse moins comme démo que
                            comme base d&apos;industrialisation.
                        </p>
                    </div>

                    <IndustrialPanel eyebrow="Ce que tu peux attendre de cette présentation" title="Une lecture praticable" tone="primary">
                        <ul className="space-y-3 text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            <li>Des catégories simples pour éviter les débats flous.</li>
                            <li>Des signaux concrets issus d&apos;un projet réel.</li>
                            <li>Une proposition d&apos;atterrissage organisationnel pour AOT.</li>
                        </ul>
                    </IndustrialPanel>
                </div>

                <div className="grid grid-rows-[auto_auto_1fr] gap-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="grid grid-cols-3 gap-4"
                    >
                        {evidence.map((item, index) => (
                            <IndustrialPanel
                                key={item.label}
                                eyebrow={index === 2 ? "Niveau" : "Preuve"}
                                title={item.value}
                                tone={index === 2 ? "primary" : "neutral"}
                                className="justify-between"
                            >
                                <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                    {item.label}
                                </p>
                            </IndustrialPanel>
                        ))}
                    </motion.div>

                    <IndustrialPanel eyebrow="Rôle" title="Pourquoi je porte ce deck" tone="accent">
                        <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            Parce que le plus grand risque n&apos;est pas de rater une
                            démo. C&apos;est de rester durablement au niveau 2 alors que
                            le marché, les clients et les équipes les plus offensives
                            commencent à structurer le niveau 3.
                        </p>
                    </IndustrialPanel>

                    <div className="grid grid-cols-3 gap-4">
                        {cards.map((card, index) => (
                            <motion.div
                                key={card.eyebrow}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.04 * index }}
                            >
                                <IndustrialPanel
                                    eyebrow={card.eyebrow}
                                    title={card.title}
                                    className="h-full"
                                >
                                    <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                        {card.detail}
                                    </p>
                                </IndustrialPanel>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default WhoAmISlide;
