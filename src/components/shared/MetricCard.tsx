import { cn } from "@/lib/utils";
import type { Metric } from "@/content/metrics";

type MetricCardProps = {
    metric: Metric;
    /** "primary" (défaut) = vert signature · "accent" = vert medium */
    accent?: "primary" | "accent";
    className?: string;
};

/**
 * Carte chiffrée pour slides Contexte et D2R2.
 * Valeur en hero vert monospace, label + source en dessous.
 */
export const MetricCard = ({
    metric,
    accent = "primary",
    className,
}: MetricCardProps) => {
    const accentVar =
        accent === "primary"
            ? "var(--aot-primary)"
            : "var(--aot-accent-hi)";

    return (
        <div
            className={cn(
                "aot-glass flex flex-col gap-2 rounded-xl p-5",
                "border-l-2",
                className
            )}
            style={{ borderLeftColor: accentVar }}
        >
            <div
                className="font-mono text-4xl font-bold leading-none lg:text-5xl"
                style={{ color: accentVar }}
            >
                {metric.value}
            </div>

            <div className="text-sm font-medium leading-snug text-[color:var(--aot-text)] lg:text-base">
                {metric.label}
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                <span className="font-mono text-[0.6rem] leading-tight text-[color:var(--aot-text-dim)]">
                    {metric.source}
                </span>
                {metric.isEstimate && (
                    <span className="shrink-0 rounded border border-[color:var(--aot-border)] px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-[color:var(--aot-text-dim)]">
                        est.
                    </span>
                )}
            </div>
        </div>
    );
};
