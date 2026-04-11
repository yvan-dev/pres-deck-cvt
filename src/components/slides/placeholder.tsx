import { Slide } from "@/components/deck/Slide";
import { PARTS, type PartId } from "@/lib/slides.config";

/**
 * Factory : retourne un composant Slide placeholder avec son titre et numéro.
 * Les placeholders matérialisent les slides à écrire, tout en maintenant
 * la navigation complète dès la Phase 1.
 */
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
                <div className="flex flex-1 flex-col items-start justify-center gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--aot-border)] bg-[color:var(--aot-bg-surface)]/60 px-4 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--aot-warning)]" />
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--aot-text-dim)]">
                            Slide à écrire
                        </span>
                    </div>
                    <h1 className="max-w-5xl text-5xl font-semibold leading-[1.1] tracking-tight text-[color:var(--aot-text)] lg:text-6xl">
                        {title}
                    </h1>
                    <p className="font-mono text-sm text-[color:var(--aot-text-muted)]">
                        {`slide_${String(id).padStart(2, "0")}.tsx — à implémenter en Phase ${
                            part <= 2 ? "3" : part <= 4 ? "4" : "5"
                        }`}
                    </p>
                </div>
            </Slide>
        );
    };
    PlaceholderSlide.displayName = `PlaceholderSlide${id}`;
    return PlaceholderSlide;
};
