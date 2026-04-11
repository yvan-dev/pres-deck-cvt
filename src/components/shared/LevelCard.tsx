import { cn } from "@/lib/utils";
import type { MaturityLevel } from "@/content/levels";

/* ── Mapping palette AOT ───────────────────────────────────────────────────
 * Les accentColor de levels.ts héritent de l'ancienne palette ACTON Blue.
 * On les traduit ici vers les tokens AOT verts officiels.
 * N1 slate  → text-dim  (grisé, "déjà dépassé")
 * N2 blue   → border-strong (vert très discret, niveau courant)
 * N3 primary→ primary   (vert signature, cible ⭐)
 * N4 accent → accent    (vert medium, mid-term)
 * N5 teal   → accent-hi (vert clair, vision lointaine)
 * ─────────────────────────────────────────────────────────────────────── */
const ACCENT: Record<MaturityLevel["accentColor"], string> = {
    slate:   "var(--aot-text-dim)",
    blue:    "var(--aot-border-strong)",
    primary: "var(--aot-primary)",
    accent:  "var(--aot-accent)",
    teal:    "var(--aot-accent-hi)",
};

/* ── Types ─────────────────────────────────────────────────────────────── */
type LevelCardProps = {
    level: MaturityLevel;
    variant?: "compact" | "full";
    /** Affiche le badge de positionnement AOT si fourni */
    positionLabel?: string;
    className?: string;
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
const AutonomyBar = ({
    value,
    color,
}: {
    value: number;
    color: string;
}) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[color:var(--aot-text-dim)]">
                Autonomie IA
            </span>
            <span
                className="font-mono text-[0.7rem] font-bold"
                style={{ color }}
            >
                {value}%
            </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-[color:var(--aot-bg-elevated)]">
            <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${value}%`, background: color }}
            />
        </div>
    </div>
);

/* ── Variant compact ───────────────────────────────────────────────────── */
const LevelCardCompact = ({
    level,
    positionLabel,
    className,
}: Omit<LevelCardProps, "variant">) => {
    const color = ACCENT[level.accentColor];
    const isTarget = level.isShortTermTarget || level.isMidTermTarget;

    return (
        <div
            className={cn(
                "aot-glass flex flex-col gap-4 rounded-xl p-4",
                "border transition-all",
                isTarget
                    ? "border-[color:var(--aot-primary)]/50"
                    : "border-[color:var(--aot-border)]",
                className
            )}
            style={isTarget ? { boxShadow: "0 0 20px rgba(23,229,23,0.12)" } : undefined}
        >
            {/* Numéro */}
            <div className="flex items-center justify-between">
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-bold text-[color:var(--aot-bg-base)]"
                    style={{ background: color }}
                >
                    N{level.id}
                </div>
                {level.isShortTermTarget && (
                    <span className="text-sm" title="Cible court terme AOT">
                        ⭐
                    </span>
                )}
                {level.isMidTermTarget && (
                    <span className="text-sm" title="Cible moyen terme AOT">
                        🎯
                    </span>
                )}
            </div>

            {/* Titre + tagline */}
            <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-semibold text-[color:var(--aot-text)]">
                    {level.label}
                </h3>
                <p className="text-xs text-[color:var(--aot-text-muted)]">
                    {level.tagline}
                </p>
            </div>

            {/* Outils (3 max) */}
            <div className="flex flex-col gap-1">
                {level.tools.slice(0, 3).map((tool) => (
                    <span
                        key={tool}
                        className="font-mono text-[0.6rem] text-[color:var(--aot-text-dim)]"
                    >
                        {tool}
                    </span>
                ))}
                {level.tools.length > 3 && (
                    <span className="font-mono text-[0.6rem] text-[color:var(--aot-text-dim)]">
                        +{level.tools.length - 3}
                    </span>
                )}
            </div>

            {/* Barre d'autonomie */}
            <div className="mt-auto">
                <AutonomyBar value={level.autonomy} color={color} />
            </div>

            {/* Badge position AOT */}
            {positionLabel && (
                <div
                    className="rounded-md px-2 py-1 text-center font-mono text-[0.6rem] uppercase tracking-wider"
                    style={{
                        background: `${color}18`,
                        color,
                        border: `1px solid ${color}40`,
                    }}
                >
                    {positionLabel}
                </div>
            )}
        </div>
    );
};

/* ── Variant full ──────────────────────────────────────────────────────── */
const LevelCardFull = ({
    level,
    className,
}: Omit<LevelCardProps, "variant" | "positionLabel">) => {
    const color = ACCENT[level.accentColor];

    return (
        <div className={cn("flex h-full flex-col gap-6 lg:flex-row lg:gap-8", className)}>
            {/* Colonne gauche — identité + définition + autonomie */}
            <div className="flex flex-col gap-5 lg:w-[38%]">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-base font-bold text-[color:var(--aot-bg-base)]"
                        style={{ background: color }}
                    >
                        N{level.id}
                    </div>
                    {level.isShortTermTarget && (
                        <span
                            className="rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest"
                            style={{
                                background: `${color}18`,
                                color,
                                border: `1px solid ${color}40`,
                            }}
                        >
                            ⭐ Cible court terme
                        </span>
                    )}
                    {level.isMidTermTarget && (
                        <span
                            className="rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest"
                            style={{
                                background: `${color}18`,
                                color,
                                border: `1px solid ${color}40`,
                            }}
                        >
                            🎯 Cible moyen terme
                        </span>
                    )}
                </div>

                {/* Titre + tagline */}
                <div className="flex flex-col gap-1">
                    <h2
                        className="text-4xl font-bold tracking-tight lg:text-5xl"
                        style={{ color }}
                    >
                        {level.label}
                    </h2>
                    <p className="text-lg font-medium text-[color:var(--aot-text-muted)]">
                        {level.tagline}
                    </p>
                </div>

                {/* Définition */}
                <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)] lg:text-base">
                    {level.definition}
                </p>

                {/* Autonomie */}
                <AutonomyBar value={level.autonomy} color={color} />

                {/* Signal faible — quote */}
                <blockquote
                    className="mt-auto border-l-2 pl-3 font-mono text-[0.7rem] italic leading-relaxed text-[color:var(--aot-text-dim)]"
                    style={{ borderLeftColor: color }}
                >
                    {level.weakSignal}
                </blockquote>
            </div>

            {/* Colonne droite — outils + useCases + limits */}
            <div className="flex flex-1 flex-col gap-5">
                {/* Outils */}
                <div className="flex flex-col gap-2">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--aot-text-dim)]">
                        Outils
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {level.tools.map((tool) => (
                            <span
                                key={tool}
                                className="rounded-md px-2.5 py-1 font-mono text-xs"
                                style={{
                                    background: `${color}12`,
                                    color,
                                    border: `1px solid ${color}30`,
                                }}
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Cas d'usage */}
                <div className="flex flex-col gap-2">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--aot-text-dim)]">
                        Cas d&apos;usage
                    </span>
                    <ul className="flex flex-col gap-1.5">
                        {level.useCases.map((uc) => (
                            <li
                                key={uc}
                                className="flex items-start gap-2 text-sm text-[color:var(--aot-text)]"
                            >
                                <span
                                    className="mt-0.5 shrink-0 text-xs"
                                    style={{ color }}
                                >
                                    ✓
                                </span>
                                {uc}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Limites */}
                <div className="flex flex-col gap-2">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--aot-text-dim)]">
                        Limites
                    </span>
                    <ul className="flex flex-col gap-1.5">
                        {level.limits.map((limit) => (
                            <li
                                key={limit}
                                className="flex items-start gap-2 text-sm text-[color:var(--aot-text-muted)]"
                            >
                                <span className="mt-0.5 shrink-0 text-xs text-[color:var(--aot-warning)]">
                                    ⚠
                                </span>
                                {limit}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

/* ── Export principal ──────────────────────────────────────────────────── */
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
