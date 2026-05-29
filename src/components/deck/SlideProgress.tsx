"use client";

import { SLIDES } from "@/lib/slides.config";
import { useDeck } from "./DeckProvider";

const PARTS = Array.from(new Set(SLIDES.map((slide) => slide.part)));

export const SlideProgress = () => {
    const { current, total } = useDeck();
    const percent = ((current + 1) / total) * 100;
    const currentSlide = SLIDES[current];

    return (
        <div className="deck-progress flex items-center gap-3 px-3.5 py-2">
            <span className="deck-progress__part rounded-full px-2.5 py-1 font-mono text-[0.62rem] uppercase text-[color:var(--aot-text-muted)]">
                P{currentSlide.part} / {currentSlide.partLabel}
            </span>

            <div className="hidden min-w-0 flex-1 items-center gap-2.5 lg:flex">
                {PARTS.map((part) => (
                    <span
                        key={part}
                        className={`h-1 w-8 rounded-full transition-colors ${
                            part === currentSlide.part
                                ? "bg-[color:var(--aot-primary)]"
                                : "bg-[color:var(--aot-track)]"
                        }`}
                    />
                ))}

                <span className="truncate text-xs text-[color:var(--aot-text-dim)]">
                    {currentSlide.title}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[color:var(--aot-track)]">
                    <div
                        className="h-full rounded-full bg-[color:var(--aot-primary)] transition-[width] duration-300 ease-out"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <span className="font-mono text-[0.66rem] uppercase text-[color:var(--aot-text-dim)]">
                    {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
            </div>
        </div>
    );
};
