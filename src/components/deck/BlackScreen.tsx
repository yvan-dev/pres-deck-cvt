"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDeck } from "./DeckProvider";

/**
 * Écran noir temporaire (touche B) — pour interrompre visuellement
 * la projection pendant une anecdote, une question, etc.
 */
export const BlackScreen = () => {
    const { isBlackScreen } = useDeck();
    return (
        <AnimatePresence>
            {isBlackScreen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[60] bg-black"
                />
            )}
        </AnimatePresence>
    );
};
