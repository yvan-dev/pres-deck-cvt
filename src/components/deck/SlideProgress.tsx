"use client";

import { useDeck } from "./DeckProvider";

/**
 * Barre de progression + compteur (bas de l'écran).
 * Reste subtile pour ne pas voler l'attention.
 */
export const SlideProgress = () => {
    const { current, total } = useDeck();
    const percent = ((current + 1) / total) * 100;

    return (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20">
            <div className="h-[2px] w-full bg-[color:var(--aot-border-subtle)]">
                <div
                    className="h-full bg-[color:var(--aot-primary)] transition-[width] duration-300 ease-out"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="flex items-center justify-between px-6 py-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--aot-text-dim)]">
                <span>CVT · AOT</span>
                <span>
                    {String(current + 1).padStart(2, "0")}
                    <span className="text-[color:var(--aot-text-dim)]/50">
                        {" / "}
                        {String(total).padStart(2, "0")}
                    </span>
                </span>
            </div>
        </div>
    );
};
