"use client";

import { AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback } from "react";
import { DeckProvider, useDeck } from "./DeckProvider";
import { SlideProgress } from "./SlideProgress";
import { SlideOverview } from "./SlideOverview";
import { BlackScreen } from "./BlackScreen";
import { SLIDES } from "@/lib/slides.config";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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

    useHotkeys("right,space,pagedown", () => next(), [next]);
    useHotkeys("left,pageup", () => previous(), [previous]);
    useHotkeys("home", () => first(), [first]);
    useHotkeys("end", () => last(), [last]);

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

    useHotkeys("b", () => toggleBlackScreen(), [toggleBlackScreen]);

    const handleFullscreen = useCallback(() => {
        if (typeof document === "undefined") return;

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    useHotkeys("f", handleFullscreen, [handleFullscreen]);

    useHotkeys(
        "1,2,3,4,5,6,7,8,9",
        (_event, handler) => {
            const key = handler.keys?.[0];
            if (!key) return;

            const index = parseInt(key, 10) - 1;
            if (!Number.isNaN(index)) goTo(index);
        },
        [goTo]
    );

    const currentSlide = SLIDES[current];
    if (!currentSlide) return null;

    const SlideComponent = currentSlide.component;
    const frameStyle = {
        aspectRatio: "16 / 9",
        width: "calc(100vw - 2.2rem)",
        maxWidth: "calc((100vh - 6.4rem) * 16 / 9)",
        maxHeight: "calc(100vh - 6.4rem)",
        height: "auto",
    } as const;

    return (
        <div className="relative flex h-screen w-screen items-center justify-center bg-[color:var(--aot-bg-base)]">
            <div className="relative" style={frameStyle}>
                <div
                    className="relative h-full w-full overflow-hidden rounded-[28px]"
                    style={{ boxShadow: "var(--aot-frame-shadow)" }}
                >
                    <AnimatePresence mode="wait">
                        <SlideComponent key={current} />
                    </AnimatePresence>
                </div>
            </div>

            <div className="pointer-events-none absolute right-[calc(50vw-min(50vw-1.1rem,(100vh-6.4rem)*8/9)+1rem)] top-[1rem] z-30">
                <ThemeToggle />
            </div>

            <div
                className="pointer-events-none absolute bottom-[0.6rem] left-1/2 z-20 w-[calc(100vw-3rem)] max-w-[calc((100vh-6.4rem)*16/9)] -translate-x-1/2"
            >
                <SlideProgress />
            </div>

            <SlideOverview />
            <BlackScreen />
        </div>
    );
};

export const Deck = () => {
    return (
        <DeckProvider total={SLIDES.length}>
            <DeckInner />
        </DeckProvider>
    );
};
