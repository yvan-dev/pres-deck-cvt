"use client";

import { SLIDES } from "@/lib/slides.config";
import { useDeck } from "./DeckProvider";

const PARTS = Array.from(new Set(SLIDES.map((slide) => slide.part)));

export const SlideProgress = () => {
    const { current, total } = useDeck();
    const percent = ((current + 1) / total) * 100;
    const currentSlide = SLIDES[current];

    return (
        <div className="liquid-dock flex items-center gap-4 px-4 py-2.5">
            <span className="liquid-pill rounded-full px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[color:var(--aot-text-muted)]">
                P{currentSlide.part} · {currentSlide.partLabel}
            </span>

            <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
                {PARTS.map((part) => (
                    <span
                        key={part}
                        className={`h-1.5 w-7 rounded-full ${
                            part === currentSlide.part
                                ? "bg-[color:var(--aot-primary)]"
                                : "bg-[rgba(255,255,255,0.08)]"
                        }`}
                    />
                ))}

                <span className="truncate text-xs text-[color:var(--aot-text-dim)]">
                    {currentSlide.title}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="liquid-pill h-2 w-28 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)] p-[2px]">
                    <div
                        className="h-full rounded-full bg-[color:var(--aot-primary)] shadow-[0_0_18px_rgba(23,229,23,0.35)] transition-[width] duration-300 ease-out"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--aot-text-dim)]">
                    {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
            </div>
        </div>
    );
};
