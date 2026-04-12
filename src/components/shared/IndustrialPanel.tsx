import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type IndustrialPanelProps = {
    title?: string;
    eyebrow?: string;
    tone?: "neutral" | "primary" | "accent" | "signal";
    className?: string;
    children: ReactNode;
};

const TONE_CLASS: Record<NonNullable<IndustrialPanelProps["tone"]>, string> = {
    neutral: "",
    primary: "industrial-panel-primary",
    accent: "industrial-panel-accent",
    signal: "industrial-panel-signal",
};

export const IndustrialPanel = ({
    title,
    eyebrow,
    tone = "neutral",
    className,
    children,
}: IndustrialPanelProps) => {
    return (
        <section
            className={cn(
                "industrial-panel flex flex-col gap-4 p-5",
                TONE_CLASS[tone],
                className
            )}
        >
            {(eyebrow || title) && (
                <div className="flex flex-col gap-1.5">
                    {eyebrow ? <span className="industrial-kicker">{eyebrow}</span> : null}
                    {title ? (
                        <h3 className="text-xl font-semibold tracking-tight text-[color:var(--aot-text)]">
                            {title}
                        </h3>
                    ) : null}
                </div>
            )}
            {children}
        </section>
    );
};
