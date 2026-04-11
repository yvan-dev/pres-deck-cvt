"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";

const FACTS = [
    {
        icon: "🏗️",
        title: "D2R2 — Tech Lead",
        detail:
            "Migration OutSystems → Java 21 / Next.js 16 / PostgreSQL. Projet en cours depuis 18 mois.",
    },
    {
        icon: "🤖",
        title: "Agent guidé au quotidien",
        detail:
            "Claude Code comme co-pilote : planning, implémentation, tests, review — supervisés à chaque étape.",
    },
    {
        icon: "🧪",
        title: "Projets perso N4",
        detail:
            "Orchestration BMAD Method + LangGraph. Validation gates, multi-agents spécialisés.",
    },
    {
        icon: "💡",
        title: "Ce deck est la preuve",
        detail:
            "100 % codé en mode agent guidé. Chaque slide : ticket → plan → implémentation → review.",
    },
] as const;

const WhoAmISlide = () => (
    <Slide slideKey={3} slideNumber={3} eyebrow="Partie 1 · Contexte">
        <div className="flex h-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
            {/* Identité */}
            <motion.div
                className="flex flex-col gap-4 lg:w-[36%]"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--aot-text-dim)]">
                        Présenté par
                    </span>
                    <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--aot-text)] lg:text-5xl">
                        Yvan Gunewou
                    </h2>
                    <span className="text-lg text-[color:var(--aot-text-muted)]">
                        Tech Lead · ACTON Technology
                    </span>
                </div>

                <blockquote className="border-l-2 border-[color:var(--aot-primary)] pl-4 font-mono text-sm italic leading-relaxed text-[color:var(--aot-text-muted)]">
                    &ldquo;Je suis un praticien, pas un théoricien. Tout ce que
                    vous allez voir ici, je le fais au quotidien.&rdquo;
                </blockquote>

                <div className="flex items-center gap-2 pt-2">
                    <div className="h-px flex-1 bg-[color:var(--aot-border)]" />
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[color:var(--aot-text-dim)]">
                        18 mois de pratique agentique
                    </span>
                    <div className="h-px flex-1 bg-[color:var(--aot-border)]" />
                </div>
            </motion.div>

            {/* Faits clés */}
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                {FACTS.map((fact, i) => (
                    <motion.div
                        key={fact.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                        className="aot-glass flex flex-col gap-2 rounded-xl border border-[color:var(--aot-border)] p-4"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{fact.icon}</span>
                            <h3 className="text-sm font-semibold text-[color:var(--aot-text)]">
                                {fact.title}
                            </h3>
                        </div>
                        <p className="text-xs leading-relaxed text-[color:var(--aot-text-muted)]">
                            {fact.detail}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </Slide>
);

export default WhoAmISlide;
