"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SlideProps = {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    slideKey?: string | number;
    eyebrow?: string;
    slideNumber?: number;
};

const Corner = ({
    className,
}: {
    className: string;
}) => (
    <div
        className={cn(
            "absolute z-[1] h-6 w-6 border-[color:var(--aot-border-strong)]/60",
            className
        )}
    />
);

export const Slide = ({
    children,
    className,
    contentClassName,
    slideKey,
    eyebrow,
    slideNumber,
}: SlideProps) => {
    return (
        <motion.div
            key={slideKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className={cn(
                "industrial-shell industrial-grid relative flex h-full w-full flex-col overflow-hidden",
                className
            )}
        >
            <Corner className="left-[2.2%] top-[2.3%] border-l border-t" />
            <Corner className="right-[2.2%] top-[2.3%] border-r border-t" />
            <Corner className="bottom-[4.4%] left-[2.2%] border-b border-l" />
            <Corner className="bottom-[4.4%] right-[2.2%] border-b border-r" />

            {(eyebrow || slideNumber !== undefined) && (
                <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-[4.6%] pt-[3.1%]">
                    {eyebrow ? (
                        <div className="flex items-center gap-3">
                            <span className="industrial-dot" />
                            <span className="industrial-kicker">{eyebrow}</span>
                        </div>
                    ) : (
                        <span />
                    )}
                    {slideNumber !== undefined ? (
                        <div className="industrial-chip">
                            Slide {String(slideNumber).padStart(2, "0")}
                        </div>
                    ) : null}
                </div>
            )}

            <div className="aot-logo-mark absolute right-[13.2%] top-[3.05%] z-10 flex items-center rounded-full px-2.5 py-2">
                <Image
                    src="/aot-logo.svg"
                    alt="AOT"
                    width={48}
                    height={48}
                    style={{ width: "auto", height: "28px" }}
                    priority={slideNumber === 1}
                />
            </div>

            <div
                className={cn(
                    "relative z-[2] flex flex-1 flex-col justify-center px-[5.4%] pb-[7.2%] pt-[8.1%]",
                    contentClassName
                )}
            >
                {children}
            </div>
        </motion.div>
    );
};
