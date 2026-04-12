import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";
import { PARTS, type PartId } from "@/lib/slides.config";

export const makePlaceholderSlide = (
    id: number,
    part: PartId,
    title: string
) => {
    const PlaceholderSlide = () => {
        return (
            <Slide
                slideKey={id}
                slideNumber={id}
                eyebrow={`Partie ${part} · ${PARTS[part]}`}
            >
                <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-8">
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-wrap gap-3">
                            <span className="industrial-chip" data-tone="signal">
                                Slide à écrire
                            </span>
                            <span className="industrial-chip">Phase {part <= 2 ? "03" : part <= 4 ? "04" : "05"}</span>
                        </div>

                        <div className="max-w-4xl">
                            <div className="industrial-kicker">Backlog narratif</div>
                            <h1 className="font-display mt-4 text-6xl font-semibold leading-[0.98] tracking-[-0.06em] text-[color:var(--aot-text)]">
                                {title}
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--aot-text-muted)]">
                                Cette slide n&apos;est plus un écran vide. Elle garde la
                                continuité du design, explicite son statut et préserve la
                                lisibilité du deck pendant la construction.
                            </p>
                        </div>

                        <div className="industrial-kicker">
                            src/components/slides/slide_{String(id).padStart(2, "0")}.tsx
                        </div>
                    </div>

                    <IndustrialPanel eyebrow="Implémentation" title="Ce qu'il reste à produire">
                        <ul className="space-y-3 text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            <li>Concevoir le message unique de la slide.</li>
                            <li>Choisir le bon gabarit visuel.</li>
                            <li>Ajouter une preuve visuelle ou métrique.</li>
                            <li>Relier la slide à la décision attendue.</li>
                        </ul>
                    </IndustrialPanel>
                </div>
            </Slide>
        );
    };

    PlaceholderSlide.displayName = `PlaceholderSlide${id}`;
    return PlaceholderSlide;
};
