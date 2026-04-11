"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";

const LEVELS = ["N1", "N2", "N3 ⭐", "N4", "N5"] as const;
const LEVEL_COLORS = [
    "var(--aot-text-dim)",
    "var(--aot-border-strong)",
    "var(--aot-primary)",
    "var(--aot-accent)",
    "var(--aot-accent-hi)",
];

type Actor = {
    name: string;
    position: number; // 0-based index dans LEVELS
    range?: number; // si chevauchement, jusqu'où
    note: string;
    highlight?: boolean;
};

const ACTORS: Actor[] = [
    {
        name: "Marché (médiane)",
        position: 1,
        range: 2,
        note: "Majorité des équipes entre N2 et début N3",
    },
    {
        name: "EDF Digital",
        position: 2,
        range: 3,
        note: "Pionniers N3, expériences N4 en cours",
    },
    {
        name: "AOT — aujourd'hui",
        position: 1,
        note: "Copilote actif, pas encore d'agent guidé structuré",
        highlight: false,
    },
    {
        name: "AOT — cible CT",
        position: 2,
        note: "N3 généralisé à toutes les équipes dev",
        highlight: true,
    },
    {
        name: "AOT — cible MT",
        position: 3,
        note: "N4 sur les workflows critiques via pôle IA",
    },
];

const PositioningSlide = () => (
    <Slide slideKey={15} slideNumber={15} eyebrow="Partie 2 · Maturité">
        <div className="flex h-full flex-col gap-5">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SectionEyebrow
                    eyebrow="Positionnement"
                    title="Marché · EDF · AOT · Cibles"
                />
            </motion.div>

            {/* Ruler — niveaux */}
            <motion.div
                className="flex items-center gap-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                {LEVELS.map((lv, i) => (
                    <div
                        key={lv}
                        className="flex flex-1 flex-col items-center gap-1.5 border-l border-[color:var(--aot-border)] py-2 first:border-l-0"
                    >
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold text-[color:var(--aot-bg-base)]"
                            style={{ background: LEVEL_COLORS[i] }}
                        >
                            {i + 1}
                        </div>
                        <span
                            className="font-mono text-[0.6rem] font-medium"
                            style={{ color: LEVEL_COLORS[i] }}
                        >
                            {lv}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Actors */}
            <div className="flex flex-1 flex-col gap-2.5">
                {ACTORS.map((actor, i) => {
                    const col = actor.position; // 0-based
                    const span = actor.range !== undefined ? actor.range - actor.position : 1;

                    return (
                        <motion.div
                            key={actor.name}
                            className="grid grid-cols-5 items-center gap-0"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.38, delay: 0.12 + i * 0.07 }}
                        >
                            {/* Cellules vides avant */}
                            {Array.from({ length: col }).map((_, j) => (
                                <div key={j} className="px-1" />
                            ))}

                            {/* Barre positionnement */}
                            <div
                                className="flex flex-col gap-1 rounded-lg px-3 py-2"
                                style={{
                                    gridColumn: `span ${span + 1}`,
                                    background: actor.highlight
                                        ? "rgba(23,229,23,0.12)"
                                        : "var(--aot-bg-surface)",
                                    border: `1px solid ${actor.highlight ? "rgba(23,229,23,0.4)" : "var(--aot-border)"}`,
                                    boxShadow: actor.highlight
                                        ? "0 0 16px rgba(23,229,23,0.1)"
                                        : undefined,
                                }}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className="text-xs font-semibold"
                                        style={{
                                            color: actor.highlight
                                                ? "var(--aot-primary)"
                                                : "var(--aot-text)",
                                        }}
                                    >
                                        {actor.name}
                                        {actor.highlight && " ⭐"}
                                    </span>
                                </div>
                                <span className="text-[0.6rem] text-[color:var(--aot-text-muted)]">
                                    {actor.note}
                                </span>
                            </div>

                            {/* Cellules vides après */}
                            {Array.from({ length: 5 - col - (span + 1) }).map((_, j) => (
                                <div key={j} className="px-1" />
                            ))}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </Slide>
);

export default PositioningSlide;
