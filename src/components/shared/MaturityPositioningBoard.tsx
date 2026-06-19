import { cn } from "@/lib/utils";

type PositioningRow = {
    label: string;
    from: 1 | 2 | 3 | 4 | 5;
    to: 1 | 2 | 3 | 4 | 5;
    tone?: "neutral" | "primary" | "accent" | "signal";
    note?: string;
};

type MaturityPositioningBoardProps = {
    rows: PositioningRow[];
    className?: string;
};

const toneClasses: Record<
    NonNullable<PositioningRow["tone"]>,
    {
        line: string;
        chip: string;
    }
> = {
    neutral: {
        line: "bg-[rgba(112,128,118,0.55)]",
        chip: "border-[color:var(--aot-border-subtle)] text-[color:var(--aot-text-muted)]",
    },
    primary: {
        line: "bg-[color:var(--aot-primary)]",
        chip: "border-[rgba(23,229,23,0.35)] text-[color:var(--aot-primary-hi)]",
    },
    accent: {
        line: "bg-[color:var(--aot-accent)]",
        chip: "border-[rgba(77,216,255,0.35)] text-[color:var(--aot-accent-hi)]",
    },
    signal: {
        line: "bg-[color:var(--aot-signal)]",
        chip: "border-[rgba(255,191,91,0.4)] text-[color:var(--aot-signal-hi)]",
    },
};

export const MaturityPositioningBoard = ({
    rows,
    className,
}: MaturityPositioningBoardProps) => {
    return (
        <div
            className={cn(
                "industrial-panel overflow-hidden p-0",
                className
            )}
        >
            <div className="grid grid-cols-[1.35fr_repeat(5,minmax(0,1fr))] border-b border-[color:var(--aot-border-subtle)] bg-[color:var(--aot-bg-panel)]">
                <div className="px-4 py-3" />
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className="border-l border-[color:var(--aot-border-subtle)] px-3 py-3 text-center"
                    >
                        <div className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--aot-text-dim)]">
                            N{level}
                        </div>
                        <div className="mt-1 text-sm font-medium text-[color:var(--aot-text)]">
                            {level === 1 && "Chat"}
                            {level === 2 && "Copilote"}
                            {level === 3 && "Agent"}
                            {level === 4 && "HITL"}
                            {level === 5 && "Swarm"}
                        </div>
                    </div>
                ))}
            </div>

            <div className="divide-y divide-[color:var(--aot-border-subtle)]">
                {rows.map((row) => {
                    const tone = toneClasses[row.tone ?? "neutral"];

                    return (
                        <div
                            key={`${row.label}-${row.from}-${row.to}`}
                            className="grid grid-cols-[1.35fr_repeat(5,minmax(0,1fr))]"
                        >
                            <div className="flex flex-col justify-center gap-1 px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[color:var(--aot-text)]">
                                        {row.label}
                                    </span>
                                    <span
                                        className={cn(
                                            "rounded-full border bg-[color:var(--aot-chip-bg)] px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.12em]",
                                            tone.chip
                                        )}
                                    >
                                        N{row.from}
                                        {row.to !== row.from ? ` -> N${row.to}` : ""}
                                    </span>
                                </div>
                                {row.note ? (
                                    <span className="text-xs text-[color:var(--aot-text-muted)]">
                                        {row.note}
                                    </span>
                                ) : null}
                            </div>

                            <div className="relative col-span-5 grid grid-cols-5">
                                {Array.from({ length: 5 }).map((_, index) => {
                                    const column = index + 1;
                                    const isActive =
                                        column >= row.from && column <= row.to;

                                    return (
                                        <div
                                            key={column}
                                            className="relative border-l border-[color:var(--aot-border-subtle)] px-3 py-4"
                                        >
                                            <div className="absolute left-1/2 top-1/2 h-px w-[70%] -translate-x-1/2 -translate-y-1/2 bg-[color:var(--aot-track)]" />
                                            {isActive ? (
                                                <div
                                                    className={cn(
                                                        "absolute left-[14%] right-[14%] top-1/2 h-3 -translate-y-1/2 rounded-full",
                                                        tone.line
                                                    )}
                                                />
                                            ) : null}
                                            {column === row.from ? (
                                                <div className="absolute left-[12%] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-[color:var(--aot-border-strong)] bg-[color:var(--aot-bg-surface)] shadow-[0_0_0_2px_var(--aot-bg-panel)]" />
                                            ) : null}
                                            {column === row.to ? (
                                                <div
                                                    className={cn(
                                                        "absolute right-[12%] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-[color:var(--aot-border-strong)] shadow-[0_0_0_2px_var(--aot-bg-panel)]",
                                                        tone.line
                                                    )}
                                                />
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
