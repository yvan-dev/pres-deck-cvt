"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SLIDES } from "@/lib/slides.config";
import { cn } from "@/lib/utils";
import { useDeck } from "./DeckProvider";

/**
 * Mode overview (touche Esc) — grille cliquable des 39 slides.
 * Permet de naviguer rapidement pendant les Q&A.
 */
export const SlideOverview = () => {
    const { isOverview, closeOverview, goTo, current } = useDeck();

    return (
        <AnimatePresence>
            {isOverview && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: "var(--aot-bg-overlay)" }}
                    onClick={closeOverview}
                >
                    <motion.div
                        initial={{ scale: 0.96 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="aot-glass h-[85vh] w-[90vw] overflow-y-auto rounded-xl p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-[color:var(--aot-text)]">
                                    Vue d&apos;ensemble
                                </h2>
                                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--aot-text-dim)]">
                                    {SLIDES.length} slides · {"Esc"} pour fermer
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeOverview}
                                className="font-mono text-xs uppercase tracking-[0.15em] text-[color:var(--aot-text-muted)] hover:text-[color:var(--aot-text)]"
                            >
                                Fermer
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {SLIDES.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => goTo(index)}
                                    className={cn(
                                        "group relative aspect-[16/9] overflow-hidden rounded-lg border text-left transition-all",
                                        index === current
                                            ? "border-[color:var(--aot-primary)] ring-2 ring-[color:var(--aot-primary)]/30"
                                            : "border-[color:var(--aot-border)] hover:border-[color:var(--aot-primary-hi)]"
                                    )}
                                    style={{
                                        background: "var(--aot-bg-surface)",
                                    }}
                                >
                                    <div className="flex h-full flex-col justify-between p-3">
                                        <div className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[color:var(--aot-text-dim)]">
                                            P{slide.part} · {slide.partLabel}
                                        </div>
                                        <div className="text-xs font-medium leading-tight text-[color:var(--aot-text)] line-clamp-3">
                                            {slide.title}
                                        </div>
                                        <div className="font-mono text-[0.55rem] text-[color:var(--aot-text-dim)]">
                                            {String(slide.id).padStart(2, "0")}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
