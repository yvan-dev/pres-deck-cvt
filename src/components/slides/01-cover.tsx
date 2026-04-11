"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";

/**
 * Slide 01 — Cover.
 * Titre, speaker, positionnement, preuve par l'exemple.
 */
const CoverSlide = () => {
    return (
        <Slide slideKey={1}>
            <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-center gap-3"
                    >
                        <div className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--aot-primary)]" />
                        <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[color:var(--aot-text-muted)]">
                            CVT · ACTON Technology
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="shrink-0"
                    >
                        <Image
                            src="/aot-academy-logo.png"
                            alt="AOT Academy — Think. Act. Code."
                            width={432}
                            height={176}
                            priority
                            className="h-12 w-auto lg:h-14 xl:h-16"
                        />
                    </motion.div>
                </div>

                <div className="flex flex-col gap-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-5xl text-6xl font-semibold leading-[1.05] tracking-tight text-[color:var(--aot-text)] lg:text-7xl xl:text-8xl"
                    >
                        Le développement
                        <br />
                        <span className="aot-gradient-text">agentique</span> à{" "}
                        <span className="font-mono text-[color:var(--aot-text)]">
                            AOT
                        </span>
                        <span className="text-[color:var(--aot-primary)]">
                            .
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="max-w-3xl text-xl leading-relaxed text-[color:var(--aot-text-muted)] lg:text-2xl"
                    >
                        Comprendre les 5 niveaux de maturité IA, mesurer où
                        nous sommes, viser le{" "}
                        <span className="text-[color:var(--aot-primary-hi)]">
                            niveau 3
                        </span>{" "}
                        et préparer le{" "}
                        <span className="text-[color:var(--aot-accent-hi)]">
                            niveau 4
                        </span>
                        .
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-end justify-between"
                >
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[color:var(--aot-text-dim)]">
                            Présenté par
                        </span>
                        <span className="text-lg font-medium text-[color:var(--aot-text)]">
                            Yvan Gunewou
                        </span>
                        <span className="font-mono text-xs text-[color:var(--aot-text-muted)]">
                            Tech Lead
                        </span>
                    </div>
                    <div className="hidden flex-col items-end gap-1 sm:flex">
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[color:var(--aot-text-dim)]">
                            Ce support est
                        </span>
                        <span className="font-mono text-xs text-[color:var(--aot-text-muted)]">
                            100 % codé en mode agent guidé
                        </span>
                        <span className="font-mono text-[0.6rem] text-[color:var(--aot-text-dim)]">
                            github.com/yvan-dev/pres-deck-cvt
                        </span>
                    </div>
                </motion.div>
            </div>
        </Slide>
    );
};

export default CoverSlide;
