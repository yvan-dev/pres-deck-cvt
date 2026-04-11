"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";

const PRACTICES = [
    {
        num: "01",
        title: "Spécifier avant de coder",
        detail:
            "Chaque tâche commence par un plan validé. Sans spec claire, l'agent divague. La qualité du prompt détermine la qualité du code.",
        tag: "PLAN FIRST",
    },
    {
        num: "02",
        title: "Contexte persistant (CLAUDE.md)",
        detail:
            "Un fichier de règles par projet : stack, conventions, architecture, workflow. L'agent le lit à chaque session — zéro répétition.",
        tag: "MÉMOIRE",
    },
    {
        num: "03",
        title: "Traçabilité des tâches (beads)",
        detail:
            "Chaque feature, bug ou tech debt a un bead. Le contexte survit aux redémarrages de session. Pas de bead = pas de tâche.",
        tag: "TRAÇABILITÉ",
    },
    {
        num: "04",
        title: "Supervision active",
        detail:
            "Valider à chaque étape clé. L'agent propose, le développeur décide. Ne jamais laisser tourner sans surveillance plus de 5-10 minutes.",
        tag: "CONTRÔLE",
    },
    {
        num: "05",
        title: "TDD systématique",
        detail:
            "Test d'abord, code ensuite — même en mode agent. Le coverage enforced à 80 % évite les hallucinations silencieuses.",
        tag: "QUALITÉ",
    },
    {
        num: "06",
        title: "Manager, pas subir",
        detail:
            "L'agent est un collaborateur junior très rapide. Il faut apprendre à déléguer intelligemment, relire et corriger le tir rapidement.",
        tag: "POSTURE",
    },
] as const;

const N3PracticesSlide = () => (
    <Slide slideKey={11} slideNumber={11} eyebrow="Partie 2 · Maturité">
        <div className="flex h-full flex-col gap-5">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SectionEyebrow
                    eyebrow="Zoom N3 · Les pratiques"
                    title="Comment travailler en mode agent"
                />
            </motion.div>

            <div className="grid flex-1 grid-cols-3 gap-3">
                {PRACTICES.map((p, i) => (
                    <motion.div
                        key={p.num}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.38, delay: 0.06 * i + 0.1 }}
                        className="aot-glass flex flex-col gap-2.5 rounded-xl border border-[color:var(--aot-border)] p-4"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-2xl font-bold text-[color:var(--aot-text-dim)]">
                                {p.num}
                            </span>
                            <span className="rounded bg-[color:var(--aot-primary)]/10 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-[color:var(--aot-primary)]">
                                {p.tag}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-[color:var(--aot-text)]">
                            {p.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-[color:var(--aot-text-muted)]">
                            {p.detail}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </Slide>
);

export default N3PracticesSlide;
