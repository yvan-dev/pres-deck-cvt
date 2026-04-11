import Link from "next/link";

/**
 * Placeholder de Phase 0 — valide la palette et les fonts.
 * Sera remplacé par <Deck /> en Phase 1.
 */
export default function Home() {
    return (
        <div className="relative flex h-screen w-full items-center justify-center px-8">
            <div className="relative flex max-w-3xl flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--aot-primary)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--aot-text-muted)]">
                        Phase 0 · Setup
                    </span>
                </div>

                <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-[color:var(--aot-text)] sm:text-6xl lg:text-7xl">
                    Le développement{" "}
                    <span className="aot-gradient-text">agentique</span>
                    <br />
                    à{" "}
                    <span className="font-mono text-[color:var(--aot-accent-hi)]">
                        AOT
                    </span>
                    .
                </h1>

                <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--aot-text-muted)] sm:text-xl">
                    Un CVT par{" "}
                    <span className="text-[color:var(--aot-text)]">
                        Yvan Gunewou
                    </span>
                    . Comprendre les 5 niveaux de maturité IA, mesurer où nous
                    sommes, viser le{" "}
                    <span className="text-[color:var(--aot-primary-hi)]">
                        niveau 3
                    </span>{" "}
                    et préparer le{" "}
                    <span className="text-[color:var(--aot-accent-hi)]">
                        niveau 4
                    </span>
                    .
                </p>

                <div className="flex flex-wrap gap-3 font-mono text-xs text-[color:var(--aot-text-dim)]">
                    <span className="aot-glass rounded-full px-3 py-1.5">
                        Next.js 16
                    </span>
                    <span className="aot-glass rounded-full px-3 py-1.5">
                        Tailwind v4
                    </span>
                    <span className="aot-glass rounded-full px-3 py-1.5">
                        Framer Motion
                    </span>
                    <span className="aot-glass rounded-full px-3 py-1.5">
                        Shiki
                    </span>
                    <span className="aot-glass rounded-full px-3 py-1.5">
                        100% IA-generated
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                    <Link
                        href="#"
                        className="group aot-glow flex h-12 items-center gap-2 rounded-full bg-[color:var(--aot-primary)] px-6 font-medium text-white transition-all hover:bg-[color:var(--aot-primary-hi)]"
                    >
                        Moteur de deck · Phase 1
                        <span className="transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
