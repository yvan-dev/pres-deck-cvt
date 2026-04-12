"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SLIDES } from "@/lib/slides.config";
import { cn } from "@/lib/utils";
import { useDeck } from "./DeckProvider";

export const SlideOverview = () => {
    const { isOverview, closeOverview, goTo, current } = useDeck();

    return (
        <AnimatePresence>
            {isOverview ? (
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
                        initial={{ scale: 0.97, opacity: 0.95 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.97, opacity: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="industrial-panel h-[88vh] w-[92vw] overflow-y-auto rounded-[24px] p-8"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-8 flex items-end justify-between gap-6">
                            <div className="max-w-2xl">
                                <div className="industrial-kicker">Mode overview</div>
                                <h2 className="font-display mt-2 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--aot-text)]">
                                    Cartographie du deck
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                    Utilise cette vue pour sauter rapidement entre les
                                    chapitres pendant les questions ou les relectures.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeOverview}
                                className="industrial-chip"
                            >
                                Fermer · Esc
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {SLIDES.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => goTo(index)}
                                    className={cn(
                                        "industrial-panel group flex aspect-[16/10] flex-col justify-between p-4 text-left transition-all duration-150",
                                        index === current
                                            ? "industrial-panel-primary scale-[1.02]"
                                            : "hover:border-[rgba(137,255,157,0.3)] hover:bg-[rgba(255,255,255,0.02)]"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="industrial-kicker">
                                                P{slide.part} · {slide.partLabel}
                                            </div>
                                            <div className="mt-2 text-sm font-medium leading-snug text-[color:var(--aot-text)]">
                                                {slide.title}
                                            </div>
                                        </div>
                                        <span
                                            className={cn(
                                                "rounded-full border px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.15em]",
                                                index === current
                                                    ? "border-[rgba(23,229,23,0.35)] text-[color:var(--aot-primary-hi)]"
                                                    : "border-[color:var(--aot-border-subtle)] text-[color:var(--aot-text-dim)]"
                                            )}
                                        >
                                            {String(slide.id).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs text-[color:var(--aot-text-dim)]">
                                            {index === current ? "Slide active" : "Aller ici"}
                                        </span>
                                        <span
                                            className={`h-1.5 w-14 rounded-full ${
                                                index === current
                                                    ? "bg-[color:var(--aot-primary)]"
                                                    : "bg-[rgba(255,255,255,0.08)]"
                                            }`}
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};
