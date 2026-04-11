"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";

const BMAD_PHASES = [
    { label: "Analyst", role: "PRD & specs", icon: "📋" },
    { label: "Architect", role: "Design technique", icon: "🏛️" },
    { label: "Dev", role: "Implémentation", icon: "⚡" },
    { label: "QA", role: "Validation & tests", icon: "✅" },
];

const LANGGRAPH_CONCEPTS = [
    {
        term: "Nodes",
        def: "Agents ou fonctions spécialisés (dev, reviewer, tester…)",
    },
    {
        term: "Edges",
        def: "Transitions conditionnelles entre nodes",
    },
    {
        term: "State",
        def: "Mémoire partagée entre tous les agents du graph",
    },
    {
        term: "Human node",
        def: "Gate de validation humaine à insérer à tout moment",
    },
    {
        term: "Checkpoint",
        def: "Sauvegarde d'état pour reprendre ou rollback",
    },
];

const N4ZoomSlide = () => (
    <Slide slideKey={13} slideNumber={13} eyebrow="Partie 2 · Maturité">
        <div className="flex h-full flex-col gap-5">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SectionEyebrow
                    eyebrow="Zoom N4 · Les outils"
                    title="BMAD Method + LangGraph"
                />
            </motion.div>

            <div className="grid flex-1 grid-cols-2 gap-6">
                {/* BMAD */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    className="aot-glass flex flex-col gap-4 rounded-xl border border-[color:var(--aot-primary)]/30 p-5"
                >
                    <div className="flex flex-col gap-1">
                        <h3 className="font-mono text-lg font-bold text-[color:var(--aot-primary)]">
                            BMAD Method
                        </h3>
                        <p className="text-xs text-[color:var(--aot-text-muted)]">
                            Business-Mode AI Development — orchestrer des agents
                            spécialisés par rôle, avec gates de validation entre
                            chaque phase.
                        </p>
                    </div>

                    {/* Pipeline visuel */}
                    <div className="flex items-center gap-1.5">
                        {BMAD_PHASES.map((phase, i) => (
                            <div
                                key={phase.label}
                                className="flex flex-1 flex-col items-center gap-1"
                            >
                                <div className="flex w-full flex-col items-center gap-1">
                                    {i > 0 && (
                                        <div className="absolute -ml-3 mt-3 text-[color:var(--aot-text-dim)]">
                                            →
                                        </div>
                                    )}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--aot-bg-elevated)] text-lg">
                                        {phase.icon}
                                    </div>
                                    <span className="font-mono text-[0.6rem] font-bold text-[color:var(--aot-primary)]">
                                        {phase.label}
                                    </span>
                                    <span className="text-center text-[0.55rem] text-[color:var(--aot-text-dim)]">
                                        {phase.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg border border-[color:var(--aot-border)] bg-[color:var(--aot-bg-elevated)] p-3">
                        <p className="font-mono text-[0.65rem] leading-relaxed text-[color:var(--aot-text-muted)]">
                            Chaque agent produit un artefact validé (PRD, ADR,
                            code, rapport de tests) avant que le suivant
                            commence. Le développeur ne valide qu&apos;aux{" "}
                            <span className="text-[color:var(--aot-primary)]">
                                gates critiques
                            </span>
                            .
                        </p>
                    </div>
                </motion.div>

                {/* LangGraph */}
                <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                    className="aot-glass flex flex-col gap-4 rounded-xl border border-[color:var(--aot-accent)]/30 p-5"
                >
                    <div className="flex flex-col gap-1">
                        <h3 className="font-mono text-lg font-bold text-[color:var(--aot-accent)]">
                            LangGraph
                        </h3>
                        <p className="text-xs text-[color:var(--aot-text-muted)]">
                            Framework Python de LangChain pour orchestrer des
                            agents sous forme de graphes d&apos;états. Idéal pour
                            les workflows avec boucles et validation humaine.
                        </p>
                    </div>

                    <ul className="flex flex-col gap-2">
                        {LANGGRAPH_CONCEPTS.map((c) => (
                            <li
                                key={c.term}
                                className="flex items-start gap-3 rounded-lg bg-[color:var(--aot-bg-elevated)] px-3 py-2"
                            >
                                <span className="shrink-0 font-mono text-xs font-bold text-[color:var(--aot-accent)]">
                                    {c.term}
                                </span>
                                <span className="text-xs text-[color:var(--aot-text-muted)]">
                                    {c.def}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </div>
    </Slide>
);

export default N4ZoomSlide;
