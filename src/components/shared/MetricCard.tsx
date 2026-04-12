import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metric } from "@/content/metrics";

type MetricCardProps = {
    metric: Metric;
    accent?: "primary" | "accent" | "signal";
    className?: string;
};

const trendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
};

const accentMap = {
    primary: {
        color: "var(--aot-primary-hi)",
        panel: "industrial-panel-primary",
    },
    accent: {
        color: "var(--aot-accent-hi)",
        panel: "industrial-panel-accent",
    },
    signal: {
        color: "var(--aot-signal-hi)",
        panel: "industrial-panel-signal",
    },
};

export const MetricCard = ({
    metric,
    accent = "primary",
    className,
}: MetricCardProps) => {
    const theme = accentMap[accent];
    const TrendIcon = trendIcon[metric.trend ?? "neutral"];

    return (
        <div
            className={cn(
                "industrial-panel flex h-full flex-col gap-4 p-5",
                theme.panel,
                className
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="industrial-kicker">Signal marché</div>
                <div
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-[rgba(255,255,255,0.02)]"
                    style={{ borderColor: `${theme.color}55`, color: theme.color }}
                >
                    <TrendIcon size={16} />
                </div>
            </div>

            <div
                className="font-display text-5xl font-semibold leading-none tracking-[-0.06em]"
                style={{ color: theme.color }}
            >
                {metric.value}
            </div>

            <div className="text-base font-medium leading-snug text-[color:var(--aot-text)]">
                {metric.label}
            </div>

            <div className="mt-auto flex items-center justify-between gap-3">
                <span className="max-w-[75%] text-xs leading-relaxed text-[color:var(--aot-text-dim)]">
                    {metric.source}
                </span>
                {metric.isEstimate ? (
                    <span className="industrial-chip">Est.</span>
                ) : (
                    <span className="industrial-chip" data-tone="accent">
                        Source
                    </span>
                )}
            </div>
        </div>
    );
};
