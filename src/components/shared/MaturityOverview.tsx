import { MATURITY_LEVELS } from "@/content/levels";
import { LevelCard } from "./LevelCard";
import { IndustrialPanel } from "./IndustrialPanel";

export const MaturityOverview = () => (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
            <IndustrialPanel eyebrow="Lecture rapide" title="Une échelle, deux vrais sauts" tone="primary">
                <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                    Le vrai changement n&apos;est pas entre N1 et N2. Il se situe au
                    passage vers l&apos;agent guidé, puis vers le workflow orchestré.
                </p>
            </IndustrialPanel>

            <IndustrialPanel eyebrow="Décision" title="Ce que vise ce deck" tone="signal">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="industrial-kicker">Court terme</div>
                        <p className="mt-2 text-sm text-[color:var(--aot-text)]">
                            Installer N3 comme standard d&apos;équipe.
                        </p>
                    </div>
                    <div>
                        <div className="industrial-kicker">Moyen terme</div>
                        <p className="mt-2 text-sm text-[color:var(--aot-text)]">
                            Structurer N4 sur les workflows à fort levier.
                        </p>
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
            <IndustrialPanel eyebrow="N2" title="Assistance locale">
                <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                    Gains réels mais limités: le développeur reste chef
                    d&apos;orchestre sur chaque micro-étape.
                </p>
            </IndustrialPanel>

            <IndustrialPanel eyebrow="N3" title="Exécution supervisée" tone="primary">
                <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                    Le prompt devient une délégation de travail avec plan,
                    implémentation, test et contrôle humain.
                </p>
            </IndustrialPanel>

            <IndustrialPanel eyebrow="N4" title="Automation gouvernée" tone="signal">
                <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                    Le levier supplémentaire vient des gates, de l&apos;observabilité
                    et de la composition de rôles agents.
                </p>
            </IndustrialPanel>
        </div>
    </div>
);
