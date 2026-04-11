import { MATURITY_LEVELS } from "@/content/levels";
import { LevelCard } from "./LevelCard";

/**
 * Slide 6 — Vue d'ensemble des 5 niveaux sur une seule slide.
 * 5 LevelCard compact en grille + markers de positionnement AOT.
 */
export const MaturityOverview = () => (
    <div className="flex h-full flex-col gap-6">
        {/* Grille 5 niveaux */}
        <div className="grid flex-1 grid-cols-5 gap-3">
            {MATURITY_LEVELS.map((level) => {
                const positionLabel =
                    level.id === 2
                        ? "AOT aujourd'hui"
                        : level.isShortTermTarget
                          ? "Cible CT ⭐"
                          : level.isMidTermTarget
                            ? "Cible MT 🎯"
                            : undefined;

                return (
                    <LevelCard
                        key={level.id}
                        level={level}
                        variant="compact"
                        positionLabel={positionLabel}
                    />
                );
            })}
        </div>

        {/* Légende */}
        <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[color:var(--aot-border-strong)]" />
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[color:var(--aot-text-dim)]">
                    Marché ~N2-N3
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[color:var(--aot-accent)]" />
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[color:var(--aot-text-dim)]">
                    EDF ~N3-N4
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[color:var(--aot-primary)]" />
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[color:var(--aot-text-dim)]">
                    AOT cible N3 court terme
                </span>
            </div>
        </div>
    </div>
);
