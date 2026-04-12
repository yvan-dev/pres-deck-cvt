"use client";

import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";
import { MaturityPositioningBoard } from "@/components/shared/MaturityPositioningBoard";

const rows = [
    {
        label: "AOT aujourd'hui",
        from: 2 as const,
        to: 2 as const,
        tone: "neutral" as const,
        note: "Usage réel mais encore principalement assistant.",
    },
    {
        label: "Marché crédible",
        from: 2 as const,
        to: 3 as const,
        tone: "accent" as const,
        note: "Le centre de gravité se déplace vers N3.",
    },
    {
        label: "Référence avancée type EDF",
        from: 3 as const,
        to: 4 as const,
        tone: "signal" as const,
        note: "L'avance se joue sur l'orchestration et les gates.",
    },
    {
        label: "AOT cible · 12 mois",
        from: 3 as const,
        to: 3 as const,
        tone: "primary" as const,
        note: "N3 solide et partagé.",
    },
    {
        label: "AOT cible · 24 mois",
        from: 4 as const,
        to: 4 as const,
        tone: "primary" as const,
        note: "N4 sur workflows sélectionnés.",
    },
];

const PositioningSlide = () => {
    return (
        <Slide slideKey={5} slideNumber={5} eyebrow="Partie 1 · Contexte">
            <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
                <div className="max-w-5xl">
                    <div className="industrial-kicker">Positionnement</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Où en est AOT, et où devons-nous être ?
                    </h2>
                    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--aot-text-muted)]">
                        Le sujet n&apos;est pas d&apos;être en retard ou en avance. Le
                        sujet est de choisir une marche réaliste, utile et
                        institutionnalisable.
                    </p>
                </div>

                <div className="grid grid-cols-[0.84fr_1.16fr] gap-6">
                    <div className="grid gap-5">
                        <IndustrialPanel eyebrow="Lecture" title="AOT n'a pas besoin de brûler les étapes." tone="primary">
                            <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                Le prochain saut sain consiste à rendre N3 normal,
                                outillé et transmissible. Ce n&apos;est qu&apos;ensuite que N4
                                devient intéressant à plus grande échelle.
                            </p>
                        </IndustrialPanel>

                        <IndustrialPanel eyebrow="Risque" title="Deux erreurs symétriques" tone="signal">
                            <ul className="space-y-2 text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                <li>Se satisfaire d&apos;un N2 confortable mais plafonnant.</li>
                                <li>Promettre du N4 sans gouvernance ni signaux fiables.</li>
                            </ul>
                        </IndustrialPanel>
                    </div>

                    <MaturityPositioningBoard rows={rows} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <IndustrialPanel eyebrow="Cap court terme" title="Stabiliser la pratique">
                        <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            Prompting de délégation, plan d&apos;exécution, tests, revue
                            et preuve deviennent un standard de travail.
                        </p>
                    </IndustrialPanel>

                    <IndustrialPanel eyebrow="Cap moyen terme" title="Choisir les flux N4" tone="accent">
                        <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            Identifier les workflows à gates où l&apos;orchestration
                            apporte un vrai multiple, pas juste un effet démo.
                        </p>
                    </IndustrialPanel>

                    <IndustrialPanel eyebrow="Cap orga" title="Créer une capacité transverse" tone="signal">
                        <p className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            La montée en maturité ne doit pas reposer sur quelques
                            individus motivés mais sur une structure qui porte les pratiques.
                        </p>
                    </IndustrialPanel>
                </div>
            </div>
        </Slide>
    );
};

export default PositioningSlide;
