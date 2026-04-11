"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";

type AgendaItem = {
    part: number;
    title: string;
    duration: string;
    detail: string;
    highlight?: boolean;
};

const AGENDA: AgendaItem[] = [
    {
        part: 1,
        title: "Contexte & cadrage",
        duration: "~10 min",
        detail: "Pourquoi ce CVT, où en est le marché",
    },
    {
        part: 2,
        title: "Les 5 niveaux de maturité IA",
        duration: "~20 min",
        detail: "Chat → Copilote → Agent guidé → HITL → Swarm",
        highlight: true,
    },
    {
        part: 3,
        title: "Preuve par l'exemple — D2R2",
        duration: "~15 min",
        detail: "Workflow réel, beads, Claude Code, métriques",
    },
    {
        part: 4,
        title: "Aller plus loin — BMAD + LangGraph",
        duration: "~10 min",
        detail: "Validation gates, orchestration multi-agents",
    },
    {
        part: 5,
        title: "Le pôle IA AOT",
        duration: "~10 min",
        detail: "Mission, piliers, roadmap, KPIs",
    },
    {
        part: 6,
        title: "Démo live",
        duration: "~15-20 min",
        detail: "Claude Code sur une tâche D2R2 réelle",
        highlight: true,
    },
    {
        part: 7,
        title: "Clôture & Q&A",
        duration: "~10 min",
        detail: "Prochaines étapes et appel à action",
    },
];

const AgendaSlide = () => {
    return (
        <Slide
            slideKey={2}
            slideNumber={2}
            eyebrow="Partie 1 · Contexte"
        >
            <div className="flex h-full flex-col gap-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-2"
                >
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--aot-text-dim)]">
                        Ordre du jour
                    </span>
                    <h2 className="text-5xl font-semibold tracking-tight text-[color:var(--aot-text)] lg:text-6xl">
                        Agenda
                    </h2>
                </motion.div>

                <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
                    {AGENDA.map((item, i) => (
                        <motion.div
                            key={item.part}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 * i }}
                            className={`group flex items-start gap-5 rounded-xl border p-5 transition-all ${
                                item.highlight
                                    ? "border-[color:var(--aot-primary)]/40 bg-[color:var(--aot-primary)]/5"
                                    : "border-[color:var(--aot-border)] bg-[color:var(--aot-bg-surface)]/40"
                            }`}
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-mono text-lg font-bold ${
                                    item.highlight
                                        ? "bg-[color:var(--aot-primary)] text-white"
                                        : "bg-[color:var(--aot-bg-elevated)] text-[color:var(--aot-text-muted)]"
                                }`}
                            >
                                {String(item.part).padStart(2, "0")}
                            </div>
                            <div className="flex flex-1 flex-col gap-1">
                                <div className="flex items-baseline justify-between gap-3">
                                    <h3 className="text-lg font-semibold text-[color:var(--aot-text)]">
                                        {item.title}
                                    </h3>
                                    <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[color:var(--aot-text-dim)]">
                                        {item.duration}
                                    </span>
                                </div>
                                <p className="text-sm text-[color:var(--aot-text-muted)]">
                                    {item.detail}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Slide>
    );
};

export default AgendaSlide;
