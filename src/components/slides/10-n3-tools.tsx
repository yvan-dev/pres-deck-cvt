"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";

type Tool = {
    name: string;
    tagline: string;
    strengths: string[];
    recommended?: boolean;
};

const TOOLS: Tool[] = [
    {
        name: "Claude Code",
        tagline: "Terminal-first · lit l'intégralité du repo",
        strengths: [
            "Contexte projet complet (CLAUDE.md, règles, plans)",
            "Planifie avant de coder",
            "Exécute, lit les erreurs, corrige en autonomie",
            "Intégration git, tests, lint natifs",
        ],
        recommended: true,
    },
    {
        name: "Cursor Agent",
        tagline: "IDE-native · expérience intégrée VSCode",
        strengths: [
            "Composition dans l'éditeur",
            "Mode agent avec @codebase",
            "Diff visuel intégré",
        ],
    },
    {
        name: "Cline",
        tagline: "Open source · extension VSCode",
        strengths: [
            "Gratuit et transparente",
            "Configurable (modèle au choix)",
            "Bonne visibilité sur les actions",
        ],
    },
    {
        name: "Aider",
        tagline: "Terminal · git-aware",
        strengths: [
            "Commits automatiques",
            "Fonctionne avec n'importe quel LLM",
            "Idéal CLI-only",
        ],
    },
    {
        name: "Windsurf Cascade",
        tagline: "Codeium · multi-fichiers natif",
        strengths: [
            "Flows multi-fichiers fluides",
            "Mémoire de session avancée",
            "IDE Windsurf ou extension",
        ],
    },
];

const N3ToolsSlide = () => (
    <Slide slideKey={10} slideNumber={10} eyebrow="Partie 2 · Maturité">
        <div className="flex h-full flex-col gap-5">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SectionEyebrow
                    eyebrow="Zoom N3 · Les outils"
                    title="Choisir son agent guidé"
                />
            </motion.div>

            <div className="grid flex-1 grid-cols-5 gap-3">
                {TOOLS.map((tool, i) => (
                    <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * i + 0.1 }}
                        className="aot-glass flex flex-col gap-3 rounded-xl border p-4"
                        style={{
                            borderColor: tool.recommended
                                ? "rgba(23,229,23,0.45)"
                                : "var(--aot-border)",
                            boxShadow: tool.recommended
                                ? "0 0 20px rgba(23,229,23,0.1)"
                                : undefined,
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-start justify-between gap-1">
                                <h3 className="font-mono text-sm font-bold text-[color:var(--aot-text)]">
                                    {tool.name}
                                </h3>
                                {tool.recommended && (
                                    <span className="shrink-0 rounded bg-[color:var(--aot-primary)]/15 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider text-[color:var(--aot-primary)]">
                                        D2R2
                                    </span>
                                )}
                            </div>
                            <p className="text-[0.65rem] leading-snug text-[color:var(--aot-text-muted)]">
                                {tool.tagline}
                            </p>
                        </div>

                        <ul className="flex flex-col gap-1.5">
                            {tool.strengths.map((s) => (
                                <li
                                    key={s}
                                    className="flex items-start gap-1.5 text-[0.65rem] leading-snug text-[color:var(--aot-text)]"
                                >
                                    <span className="mt-0.5 shrink-0 text-[color:var(--aot-primary)]">
                                        ✓
                                    </span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>
    </Slide>
);

export default N3ToolsSlide;
