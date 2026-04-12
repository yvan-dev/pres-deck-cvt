import {
    Bot,
    CircleEllipsis,
    Layers3,
    Sparkles,
    Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MaturityLevel } from "@/content/levels";

const ACCENT: Record<MaturityLevel["accentColor"], string> = {
    slate: "var(--aot-text-dim)",
    blue: "var(--aot-accent)",
    primary: "var(--aot-primary)",
    accent: "var(--aot-signal)",
    teal: "var(--aot-accent-hi)",
};

const ICONS: Record<MaturityLevel["slug"], typeof CircleEllipsis> = {
    chat: CircleEllipsis,
    copilot: Sparkles,
    agent: Bot,
    hitl: Workflow,
    swarm: Layers3,
};

type LevelCardProps = {
    level: MaturityLevel;
    variant?: "compact" | "full";
    positionLabel?: string;
    className?: string;
};

const AutonomyBar = ({
    value,
    color,
}: {
    value: number;
    color: string;
}) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <span className="industrial-kicker">Autonomie IA</span>
            <span className="font-mono text-[0.72rem] font-semibold" style={{ color }}>
                {value}%
            </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
            <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                    width: `${value}%`,
                    background: `linear-gradient(90deg, ${color}AA, ${color})`,
                }}
            />
        </div>
    </div>
);

const LevelCardCompact = ({
    level,
    positionLabel,
    className,
}: Omit<LevelCardProps, "variant">) => {
    const color = ACCENT[level.accentColor];
    const Icon = ICONS[level.slug];
    const toneClass =
        level.id === 3
            ? "industrial-panel-primary"
            : level.id === 4
              ? "industrial-panel-signal"
              : level.id >= 2
                ? "industrial-panel-accent"
                : "";

    return (
        <div
            className={cn(
                "industrial-panel flex h-full flex-col gap-4 p-4",
                toneClass,
                className
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-[rgba(255,255,255,0.03)]"
                        style={{ borderColor: `${color}55`, color }}
                    >
                        <Icon size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="industrial-kicker">Niveau {level.id}</span>
                        <span className="text-lg font-semibold text-[color:var(--aot-text)]">
                            {level.label}
                        </span>
                    </div>
                </div>

                {positionLabel ? (
                    <span
                        className="rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em]"
                        style={{
                            borderColor: `${color}55`,
                            color,
                            background: `${color}12`,
                        }}
                    >
                        {positionLabel}
                    </span>
                ) : null}
            </div>

            <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                {level.tagline}
            </p>

            <div className="industrial-rule" />

            <div className="flex flex-wrap gap-2">
                {level.tools.slice(0, 3).map((tool) => (
                    <span
                        key={tool}
                        className="rounded-full border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em]"
                        style={{
                            borderColor: `${color}35`,
                            color,
                            background: `${color}10`,
                        }}
                    >
                        {tool}
                    </span>
                ))}
            </div>

            <div className="mt-auto">
                <AutonomyBar value={level.autonomy} color={color} />
            </div>
        </div>
    );
};

const LevelCardFull = ({
    level,
    className,
}: Omit<LevelCardProps, "variant" | "positionLabel">) => {
    const color = ACCENT[level.accentColor];
    const Icon = ICONS[level.slug];

    return (
        <div className={cn("grid h-full grid-cols-[0.88fr_1.12fr] gap-6", className)}>
            <section className="industrial-panel flex flex-col gap-5 p-6">
                <div className="flex items-center gap-4">
                    <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-[rgba(255,255,255,0.02)]"
                        style={{ borderColor: `${color}55`, color }}
                    >
                        <Icon size={24} />
                    </div>
                    <div>
                        <div className="industrial-kicker">Niveau {level.id}</div>
                        <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-[color:var(--aot-text)]">
                            {level.label}
                        </h2>
                    </div>
                </div>

                <p className="text-lg text-[color:var(--aot-text-muted)]">
                    {level.tagline}
                </p>

                <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                    {level.definition}
                </p>

                <AutonomyBar value={level.autonomy} color={color} />

                <blockquote
                    className="mt-auto border-l pl-4 font-mono text-[0.72rem] leading-relaxed text-[color:var(--aot-text-dim)]"
                    style={{ borderLeftColor: `${color}70` }}
                >
                    {level.weakSignal}
                </blockquote>
            </section>

            <div className="grid gap-5">
                <section className="industrial-panel p-5">
                    <div className="industrial-kicker">Outils dominants</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {level.tools.map((tool) => (
                            <span
                                key={tool}
                                className="rounded-full border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em]"
                                style={{
                                    borderColor: `${color}35`,
                                    color,
                                    background: `${color}10`,
                                }}
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="industrial-panel grid grid-cols-2 gap-5 p-5">
                    <div>
                        <div className="industrial-kicker">Cas d&apos;usage</div>
                        <ul className="mt-4 space-y-2.5">
                            {level.useCases.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-2 text-sm leading-relaxed text-[color:var(--aot-text)]"
                                >
                                    <span
                                        className="mt-1.5 h-1.5 w-1.5 rounded-full"
                                        style={{ background: color }}
                                    />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="industrial-kicker">Limites</div>
                        <ul className="mt-4 space-y-2.5">
                            {level.limits.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-2 text-sm leading-relaxed text-[color:var(--aot-text-muted)]"
                                >
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[color:var(--aot-signal)]" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export const LevelCard = ({
    level,
    variant = "compact",
    positionLabel,
    className,
}: LevelCardProps) => {
    if (variant === "full") {
        return <LevelCardFull level={level} className={className} />;
    }

    return (
        <LevelCardCompact
            level={level}
            positionLabel={positionLabel}
            className={className}
        />
    );
};
