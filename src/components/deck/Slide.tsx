"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SlideProps = {
    children: ReactNode;
    className?: string;
    /** Identifier used for animation key (defaults to random) */
    slideKey?: string | number;
    /** Eyebrow label shown top-left (ex: "Partie 2 · Maturité") */
    eyebrow?: string;
    /** Slide number shown top-right */
    slideNumber?: number;
};

/**
 * Frame 16:9 avec transition fade + padding cohérent.
 * L'enfant est placé dans un conteneur qui respecte le ratio quelle que soit la taille écran.
 */
export const Slide = ({
    children,
    className,
    slideKey,
    eyebrow,
    slideNumber,
}: SlideProps) => {
    return (
        <motion.div
            key={slideKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
                "relative h-full w-full overflow-hidden",
                "flex flex-col",
                className
            )}
        >
            {(eyebrow || slideNumber !== undefined) && (
                <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-[4%] pt-[3%]">
                    {eyebrow ? (
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--aot-text-dim)]">
                            {eyebrow}
                        </span>
                    ) : (
                        <span />
                    )}
                    {slideNumber !== undefined && (
                        <span className="font-mono text-[0.65rem] text-[color:var(--aot-text-dim)]">
                            {String(slideNumber).padStart(2, "0")}
                        </span>
                    )}
                </div>
            )}
            <div className="flex flex-1 flex-col justify-center px-[6%] py-[5%]">
                {children}
            </div>
        </motion.div>
    );
};
