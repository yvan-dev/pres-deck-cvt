import { MATURITY_LEVELS } from "@/content/levels";
import { LevelCard } from "./LevelCard";
import { IndustrialPanel } from "./IndustrialPanel";

export const MaturityOverview = () => (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
        <div className="grid grid-cols-[1fr_1fr] gap-6">
            <IndustrialPanel eyebrow="Lecture rapide" title="Le vrai saut est N2 → N3" tone="primary">
                <div className="text-base font-medium text-[color:var(--aot-text)]">
                    On passe de l&apos;assistance locale à l&apos;exécution supervisée.
                </div>
            </IndustrialPanel>

            <IndustrialPanel eyebrow="Décision" title="Ce deck vise N3 puis N4" tone="signal">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="industrial-kicker">12 mois</div>
                        <div className="mt-2 font-medium text-[color:var(--aot-text)]">
                            N3 standard
                        </div>
                    </div>
                    <div>
                        <div className="industrial-kicker">24 mois</div>
                        <div className="mt-2 font-medium text-[color:var(--aot-text)]">
                            N4 ciblé
                        </div>
                    </div>
                </div>
            </IndustrialPanel>
        </div>

        <div className="grid flex-1 grid-cols-5 gap-4">
            {MATURITY_LEVELS.map((level) => {
                const positionLabel =
                    level.id === 2
                        ? "AOT aujourd'hui"
                        : level.isShortTermTarget
                          ? "cible 12 mois"
                          : level.isMidTermTarget
                            ? "cible 24 mois"
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

        <div className="grid grid-cols-3 gap-4">
            <IndustrialPanel eyebrow="N2" title="Assistance">
                <div className="text-sm font-medium text-[color:var(--aot-text)]">
                    Le dev pilote tout.
                </div>
            </IndustrialPanel>

            <IndustrialPanel eyebrow="N3" title="Délégation" tone="primary">
                <div className="text-sm font-medium text-[color:var(--aot-text)]">
                    L&apos;agent exécute sous contrôle humain.
                </div>
            </IndustrialPanel>

            <IndustrialPanel eyebrow="N4" title="Orchestration" tone="signal">
                <div className="text-sm font-medium text-[color:var(--aot-text)]">
                    Les gates deviennent le levier.
                </div>
            </IndustrialPanel>
        </div>
    </div>
);
