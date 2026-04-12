"use client";

import { Slide } from "@/components/deck/Slide";
import { MaturityOverview } from "@/components/shared/MaturityOverview";

const MaturitySlide = () => {
    return (
        <Slide slideKey={6} slideNumber={6} eyebrow="Partie 2 · Maturité">
            <div className="grid h-full grid-rows-[auto_1fr] gap-6">
                <div className="max-w-5xl">
                    <div className="industrial-kicker">Cadre de lecture</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Les 5 niveaux de maturité IA
                    </h2>
                    <p className="mt-5 text-xl text-[color:var(--aot-text-muted)]">
                        5 niveaux. 2 vrais sauts. 1 trajectoire utile pour AOT.
                    </p>
                </div>

                <MaturityOverview />
            </div>
        </Slide>
    );
};

export default MaturitySlide;
