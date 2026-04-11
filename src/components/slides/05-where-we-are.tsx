"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";

type Position = {
    label: string;
    level: string;
    levelNum: number;
    description: string;
    items: string[];
    color: string;
    badge?: string;
};

const POSITIONS: Position[] = [
    {
        label: "Aujourd'hui",
        level: "N2 — Copilote",
        levelNum: 2,
        description:
            "GitHub Copilot actif. Mais l'IA reste un assistant passif — le développeur est pilote à 100 %.",
        items: [
            "Autocomplétion en IDE",
            "Copier-coller depuis le chat",
            "Pas d'orchestration multi-étapes",
        ],
        color: "var(--aot-border-strong)",
    },
    {
        label: "Cible court terme",
        level: "N3 — Agent guidé",
        levelNum: 3,
        description:
            "L'IA investigue, planifie, code et teste de façon semi-autonome. Le développeur valide et supervise.",
        items: [
            "Claude Code / Cursor Agent",
            "Plans d'implémentation validés",
            "TDD supervisé, beads, CLAUDE.md",
        ],
        color: "var(--aot-primary)",
        badge: "⭐ Objectif",
    },
    {
        label: "Cible moyen terme",
        level: "N4 — HITL",
        levelNum: 4,
        description:
            "Chaînes d'agents spécialisés en quasi-autonomie. L'humain valide uniquement aux gates critiques.",
        items: [
            "BMAD Method + LangGraph",
            "Pipeline spec → implémentation",
            "Observabilité & gouvernance IA",
        ],
        color: "var(--aot-accent)",
        badge: "🎯 Vision",
    },
];

const WhereWeAreSlide = () => (
    <Slide slideKey={5} slideNumber={5} eyebrow="Partie 1 · Contexte">
        <div className="flex h-full flex-col gap-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SectionEyebrow
                    eyebrow="Diagnostic"
                    title="Où en est AOT ? Où aller ?"
                />
            </motion.div>

            <div className="grid flex-1 grid-cols-3 gap-4">
                {POSITIONS.map((pos, i) => (
                    <motion.div
                        key={pos.label}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                        className="aot-glass flex flex-col gap-4 rounded-xl border p-5"
                        style={{
                            borderColor: `${pos.color}40`,
                            boxShadow:
                                i === 1
                                    ? "0 0 24px rgba(23,229,23,0.1)"
                                    : undefined,
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-0.5">
                                <span
                                    className="font-mono text-[0.6rem] uppercase tracking-widest"
                                    style={{ color: pos.color }}
                                >
                                    {pos.label}
                                </span>
                                <h3
                                    className="text-lg font-bold"
                                    style={{ color: pos.color }}
                                >
                                    {pos.level}
                                </h3>
                            </div>
                            {pos.badge && (
                                <span
                                    className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider"
                                    style={{
                                        background: `${pos.color}18`,
                                        color: pos.color,
                                        border: `1px solid ${pos.color}40`,
                                    }}
                                >
                                    {pos.badge}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            {pos.description}
                        </p>

                        {/* Items */}
                        <ul className="mt-auto flex flex-col gap-1.5">
                            {pos.items.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-2 text-xs text-[color:var(--aot-text)]"
                                >
                                    <span
                                        className="mt-0.5 shrink-0"
                                        style={{ color: pos.color }}
                                    >
                                        ›
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Indicateur niveau */}
                        <div className="flex items-center gap-1.5 border-t border-[color:var(--aot-border)] pt-3">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <div
                                    key={n}
                                    className="h-1 flex-1 rounded-full transition-all"
                                    style={{
                                        background:
                                            n <= pos.levelNum
                                                ? pos.color
                                                : "var(--aot-bg-elevated)",
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </Slide>
);

export default WhereWeAreSlide;
