"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";

type SummaryItem = {
    part: number;
    title: string;
    detail: string;
    decision: string;
    tone?: "neutral" | "primary" | "accent" | "signal";
};

const SUMMARY: SummaryItem[] = [
    {
        part: 1,
        title: "Contexte & cadrage",
        detail: "Pourquoi le sujet a changé de nature et pourquoi AOT doit se positionner.",
        decision: "Nommer l'enjeu.",
    },
    {
        part: 2,
        title: "Les 5 niveaux de maturité IA",
        detail: "Une grille pour distinguer assistance, exécution supervisée et orchestration.",
        decision: "Choisir la vraie cible.",
        tone: "primary",
    },
    {
        part: 3,
        title: "Preuve par l'exemple · D2R2",
        detail: "Un workflow concret, déjà pratiqué, avec ses gains et ses limites.",
        decision: "Valider la crédibilité.",
        tone: "accent",
    },
    {
        part: 4,
        title: "Aller plus loin · BMAD + LangGraph",
        detail: "Comment passer d'un agent guidé à des workflows gouvernés.",
        decision: "Préparer N4.",
        tone: "signal",
    },
    {
        part: 5,
        title: "Le pôle IA AOT",
        detail: "Mission, périmètre, gouvernance, roadmap et KPIs.",
        decision: "Structurer l'exécution.",
    },
    {
        part: 6,
        title: "Démo live",
        detail: "Montrer le niveau de délégation réellement atteignable aujourd'hui.",
        decision: "Rendre tangible.",
        tone: "primary",
    },
    {
        part: 7,
        title: "Clôture & call to action",
        detail: "Décisions, prochaines étapes, contribution attendue.",
        decision: "Faire atterrir.",
    },
];

const SummarySlide = () => {
    return (
        <Slide slideKey={2} slideNumber={2} eyebrow="Partie 1 · Contexte">
            <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-8">
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="industrial-kicker">Plan de vol</div>
                        <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                            Sommaire
                        </h2>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--aot-text-muted)]">
                            Le deck suit une logique simple: nommer le terrain,
                            montrer la cible, prouver que le passage est déjà amorcé,
                            puis proposer un cadre d&apos;industrialisation.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <IndustrialPanel eyebrow="Fil rouge" title="Du buzz à la capacité" tone="primary">
                            <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                Le sujet n&apos;est pas “faut-il utiliser l&apos;IA ?”
                                mais “quel niveau de délégation et de gouvernance
                                voulons-nous institutionnaliser ?”.
                            </p>
                        </IndustrialPanel>

                        <IndustrialPanel eyebrow="Sortie attendue" title="Trois décisions de fin" tone="signal">
                            <ul className="space-y-2 text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                <li>Choisir N3 comme standard court terme.</li>
                                <li>Identifier les flux candidats à N4.</li>
                                <li>Nommer la structure qui porte l&apos;exécution.</li>
                            </ul>
                        </IndustrialPanel>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {SUMMARY.map((item, index) => (
                        <motion.div
                            key={item.part}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: index * 0.04 }}
                            className="h-full"
                        >
                            <IndustrialPanel
                                eyebrow={`Partie ${item.part}`}
                                title={item.title}
                                tone={item.tone ?? "neutral"}
                                className="h-full min-h-[10.2rem] justify-between"
                            >
                                <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                    {item.detail}
                                </p>
                                <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] px-4 py-3">
                                    <div className="industrial-kicker">But</div>
                                    <div className="mt-1 text-sm font-medium text-[color:var(--aot-text)]">
                                        {item.decision}
                                    </div>
                                </div>
                            </IndustrialPanel>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Slide>
    );
};

export default SummarySlide;
