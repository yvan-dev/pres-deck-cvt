"use client";

import { AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback } from "react";
import { DeckProvider, useDeck } from "./DeckProvider";
import { SlideProgress } from "./SlideProgress";
import { SlideOverview } from "./SlideOverview";
import { BlackScreen } from "./BlackScreen";
import { SLIDES } from "@/lib/slides.config";

/**
 * Contenu interne — consomme le context.
 * Gère : hotkeys, rendu du slide courant, layer overview + black.
 */
const DeckInner = () => {
    const {
        current,
        next,
        previous,
        first,
        last,
        toggleOverview,
        closeOverview,
        isOverview,
        toggleBlackScreen,
        goTo,
    } = useDeck();

    // Navigation slides
    useHotkeys("right,space,pagedown", () => next(), [next]);
    useHotkeys("left,pageup", () => previous(), [previous]);
    useHotkeys("home", () => first(), [first]);
    useHotkeys("end", () => last(), [last]);

    // Mode overview
    useHotkeys(
        "escape",
        () => {
            if (isOverview) {
                closeOverview();
            } else {
                toggleOverview();
            }
        },
        [isOverview, toggleOverview, closeOverview]
    );

    // Écran noir temporaire
    useHotkeys("b", () => toggleBlackScreen(), [toggleBlackScreen]);

    // Plein écran
    const handleFullscreen = useCallback(() => {
        if (typeof document === "undefined") return;
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);
    useHotkeys("f", handleFullscreen, [handleFullscreen]);

    // Jump rapide avec touches numériques (1-9 = slides 1-9, utile pour début)
    useHotkeys(
        "1,2,3,4,5,6,7,8,9",
        (_e, handler) => {
            const key = handler.keys?.[0];
            if (!key) return;
            const idx = parseInt(key, 10) - 1;
            if (!Number.isNaN(idx)) goTo(idx);
        },
        [goTo]
    );

    const currentSlide = SLIDES[current];
    if (!currentSlide) return null;
    const SlideComponent = currentSlide.component;

    return (
        <div className="relative flex h-screen w-screen items-center justify-center bg-[color:var(--aot-bg-base)]">
            {/* Frame 16:9 centré et contraint */}
            <div
                className="relative overflow-hidden"
                style={{
                    aspectRatio: "16 / 9",
                    width: "100vw",
                    maxWidth: "calc(100vh * 16 / 9)",
                    maxHeight: "100vh",
                    height: "auto",
                }}
            >
                <AnimatePresence mode="wait">
                    <SlideComponent key={current} />
                </AnimatePresence>
                <SlideProgress />
            </div>

            <SlideOverview />
            <BlackScreen />
        </div>
    );
};

/**
 * Racine exportée — wrap <DeckInner /> dans <DeckProvider />.
 */
export const Deck = () => {
    return (
        <DeckProvider total={SLIDES.length}>
            <DeckInner />
        </DeckProvider>
    );
};
