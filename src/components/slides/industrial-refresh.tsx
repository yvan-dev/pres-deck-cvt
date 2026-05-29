"use client";

import Image from "next/image";
import {
    ArrowRight,
    Bot,
    Boxes,
    Braces,
    CheckCircle2,
    ClipboardCheck,
    Code2,
    Factory,
    GitPullRequest,
    Layers3,
    Network,
    PlayCircle,
    Radar,
    Route,
    ShieldCheck,
    Sparkles,
    Target,
    Timer,
    UsersRound,
} from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";
import { RMC_METRICS } from "@/content/metrics";

const workflow = [
    { label: "Intent", detail: "besoin metier + contrainte", icon: Radar },
    { label: "Plan", detail: "scope, fichiers, tests", icon: ClipboardCheck },
    { label: "Code", detail: "patch supervise", icon: Code2 },
    { label: "Gate", detail: "lint, build, review", icon: GitPullRequest },
];

const demoSteps = [
    "partir d'une demande produit concrete",
    "laisser l'agent investiguer le repo",
    "faire coder une evolution limitee",
    "verifier les tests et les compromis",
];

const roadmap = [
    {
        horizon: "0-30 j",
        title: "Standardiser N3",
        detail: "template de demande, criteres de review, checklists projet",
    },
    {
        horizon: "30-60 j",
        title: "Mesurer",
        detail: "temps cycle, taux de reprise, bugs, qualite des specs",
    },
    {
        horizon: "60-90 j",
        title: "Piloter N4",
        detail: "un flux a gates fortes, observabilite, rollback humain",
    },
];

const agendaItems = [
    {
        title: "Comprendre les niveaux IA",
        detail: "N1 à N5, et pourquoi N3 est le prochain standard utile.",
        icon: Layers3,
        tone: "primary" as const,
    },
    {
        title: "Positionner AOT",
        detail: "Ce que nous faisons déjà, ce qui manque pour rendre la pratique robuste.",
        icon: Target,
        tone: "accent" as const,
    },
    {
        title: "Prouver avec RMC",
        detail: "Un cas terrain pour montrer demande, plan, patch, validation.",
        icon: ShieldCheck,
        tone: "signal" as const,
    },
    {
        title: "Structurer le pôle IA",
        detail: "Standards, veille, workflows, formation et marchés développeurs augmentés.",
        icon: Factory,
        tone: "primary" as const,
    },
    {
        title: "Rendre la démo tangible",
        detail: "Montrer au public ce qui change dans le delivery quotidien.",
        icon: PlayCircle,
        tone: "accent" as const,
    },
    {
        title: "Décider la suite",
        detail: "N3 sur pilotes, N4 ciblé, mandat transverse clair.",
        icon: CheckCircle2,
        tone: "signal" as const,
    },
];

const levelPrimer = [
    {
        level: "N1",
        title: "Chat",
        detail: "Question / réponse hors contexte projet.",
    },
    {
        level: "N2",
        title: "Copilote",
        detail: "Assistance locale dans l'IDE ou le fichier courant.",
    },
    {
        level: "N3",
        title: "Agent guidé",
        detail: "Tâche complète déléguée, avec plan, patch, tests et revue humaine.",
        tone: "primary" as const,
    },
    {
        level: "N4",
        title: "Workflow gouverné",
        detail: "Chaîne d'agents avec gates, traces et points de reprise.",
        tone: "signal" as const,
    },
    {
        level: "N5",
        title: "Essaim autonome",
        detail: "Agents qui collaborent en autonomie, encore peu mature en production.",
    },
];

export const RmcProofSlide = () => (
    <Slide slideKey={6} slideNumber={6} eyebrow="Partie 3 / Preuve terrain">
        <div className="grid h-full grid-cols-[0.92fr_1.08fr] gap-7">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">RMC</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-[color:var(--aot-text)]">
                        La preuve n&apos;est pas théorique.
                    </h2>
                    <p className="mt-5 max-w-xl text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                        Le workflow agentique a déjà servi à livrer. Le sujet est maintenant de rendre cette pratique reproductible.
                    </p>
                </div>

                <IndustrialPanel eyebrow="Message" title="N3 est le prochain standard de delivery" tone="primary">
                    <div className="text-base font-medium text-[color:var(--aot-text)]">
                        Un agent bien cadré produit un plan, un patch et une preuve de validation.
                    </div>
                </IndustrialPanel>
            </div>

            <div className="grid min-h-0 grid-rows-[1fr_auto] gap-4">
                <div className="relative min-h-0 overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/rmc-proof.png"
                        alt="Illustration de preuve terrain RMC"
                        fill
                        className="object-cover"
                        sizes="52vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.52)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="industrial-kicker text-white/70">Flux visible</div>
                        <div className="mt-1 text-2xl font-semibold text-white">
                            demande / plan / patch / validation
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {RMC_METRICS.slice(0, 4).map((metric, index) => (
                        <IndustrialPanel
                            key={metric.id}
                            eyebrow={metric.isEstimate ? "Estimation" : "Mesure"}
                            title={metric.value}
                            tone={index === 0 || index === 2 ? "primary" : index === 3 ? "signal" : "neutral"}
                            className="gap-2 p-4"
                        >
                            <div className="text-xs font-medium leading-relaxed text-[color:var(--aot-text-muted)]">
                                {metric.label}
                            </div>
                        </IndustrialPanel>
                    ))}
                </div>
            </div>
        </div>
    </Slide>
);

export const OperatingModelSlide = () => (
    <Slide slideKey={7} slideNumber={7} eyebrow="Partie 3 / Mode opératoire">
        <div className="grid h-full grid-rows-[auto_1fr_auto] gap-5">
            <div className="flex items-end justify-between gap-8">
                <div className="max-w-5xl">
                    <div className="industrial-kicker">Industrialiser N3</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Le process doit encadrer l&apos;agent.
                    </h2>
                </div>
                <div className="hidden max-w-md text-right text-lg leading-relaxed text-[color:var(--aot-text-muted)] xl:block">
                    On déploie une façon de travailler, pas seulement un outil.
                </div>
            </div>

            <div className="grid min-h-0 grid-cols-[1.05fr_0.95fr] gap-5">
                <div className="grid grid-cols-2 gap-4">
                {workflow.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div key={item.label} className="relative">
                            <IndustrialPanel
                                eyebrow={`Gate ${index + 1}`}
                                title={item.label}
                                tone={index === 2 ? "primary" : index === 3 ? "signal" : "neutral"}
                                className="h-full justify-between"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-sm font-medium text-[color:var(--aot-text-muted)]">
                                        {item.detail}
                                    </div>
                                    <div className="rounded-2xl border border-[color:var(--aot-border-subtle)] bg-[color:var(--aot-icon-bg)] p-3 text-[color:var(--aot-text-muted)]">
                                        <Icon size={18} />
                                    </div>
                                </div>
                            </IndustrialPanel>
                            {index < workflow.length - 1 ? (
                                <ArrowRight className="absolute right-[-1rem] top-1/2 hidden -translate-y-1/2 text-[color:var(--aot-text-dim)] xl:block" size={16} />
                            ) : null}
                        </div>
                    );
                })}
                </div>

                <div className="relative min-h-0 overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/agent-workflow.png"
                        alt="Illustration du workflow agentique supervisé"
                        fill
                        className="object-cover"
                        sizes="44vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="industrial-kicker text-white/70">Principe</div>
                        <div className="mt-1 text-2xl font-semibold text-white">
                            L&apos;agent agit / l&apos;humain arbitre
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <IndustrialPanel eyebrow="Regle" title="Toujours un plan avant le patch" />
                <IndustrialPanel eyebrow="Regle" title="Toujours une preuve apres le patch" tone="primary" />
                <IndustrialPanel eyebrow="Regle" title="Toujours une revue humaine" tone="signal" />
            </div>
        </div>
    </Slide>
);

export const GovernanceSlide = () => (
    <Slide slideKey={8} slideNumber={8} eyebrow="Partie 4 / N4 cible">
        <div className="grid h-full grid-cols-[0.92fr_1.08fr] gap-7">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">BMAD / LangGraph</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-[color:var(--aot-text)]">
                        N4 uniquement là où les gates ont du levier.
                    </h2>
                    <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                        L&apos;objectif n&apos;est pas l&apos;autonomie maximale. C&apos;est le contrôle explicite des flux qui méritent une orchestration.
                    </p>
                </div>

                <IndustrialPanel eyebrow="Décision" title="Piloter un seul workflow N4 avant généralisation" tone="signal">
                    <div className="text-base font-medium text-[color:var(--aot-text)]">
                        Un flux candidat: spécification / implémentation / review / release notes.
                    </div>
                </IndustrialPanel>
            </div>

            <div className="grid min-h-0 grid-rows-[1fr_auto] gap-4">
                <div className="relative min-h-0 overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/agent-workflow.png"
                        alt="Illustration d'orchestration avec gates de validation"
                        fill
                        className="object-cover"
                        sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="industrial-kicker text-white/70">N4 utile</div>
                        <div className="mt-1 text-2xl font-semibold text-white">
                            orchestration / traces / reprise
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    <IndustrialPanel eyebrow="BMAD" title="Rôles" tone="primary" className="p-4" />
                    <IndustrialPanel eyebrow="LangGraph" title="Gates" tone="accent" className="p-4" />
                    <IndustrialPanel eyebrow="Humain" title="Arbitrage" className="p-4" />
                    <IndustrialPanel eyebrow="Risque" title="Rollback" tone="signal" className="p-4" />
                </div>
            </div>
        </div>
    </Slide>
);

export const AiPoleSlide = () => (
    <Slide slideKey={9} slideNumber={9} eyebrow="Partie 4 - Capacite transverse">
        <div className="grid h-full grid-rows-[auto_1fr] gap-7">
            <div className="flex items-end justify-between gap-8">
                <div className="max-w-5xl">
                    <div className="industrial-kicker">Pole IA</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Sortir des initiatives individuelles.
                    </h2>
                    <p className="mt-5 text-xl text-[color:var(--aot-text-muted)]">
                        Pour tenir la qualite, l&apos;IA doit devenir une capacite partagee.
                    </p>
                </div>
                <Factory className="mb-2 text-[color:var(--aot-primary)]" size={52} />
            </div>

            <div className="grid grid-cols-4 gap-4">
                <IndustrialPanel eyebrow="1" title="Standards" tone="primary">
                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                        prompts, checklists, securite, criteres de definition of done.
                    </div>
                </IndustrialPanel>
                <IndustrialPanel eyebrow="2" title="Enablement">
                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                        formation courte, pairing, bibliotheque d&apos;exemples.
                    </div>
                </IndustrialPanel>
                <IndustrialPanel eyebrow="3" title="Outillage" tone="accent">
                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                        templates repo, agents, observabilite, couts et traces.
                    </div>
                </IndustrialPanel>
                <IndustrialPanel eyebrow="4" title="Gouvernance" tone="signal">
                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                        usages autorises, controle humain, capitalisation des risques.
                    </div>
                </IndustrialPanel>
            </div>
        </div>
    </Slide>
);

export const DemoBriefingSlide = () => (
    <Slide slideKey={10} slideNumber={10} eyebrow="Partie 5 - Demo">
        <div className="grid h-full grid-cols-[0.92fr_1.08fr] gap-7">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">15 minutes demo</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Montrer le controle, pas la magie.
                    </h2>
                    <p className="mt-5 text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                        La demo doit rendre visible le passage demande - plan - patch - verification.
                    </p>
                </div>

                <IndustrialPanel eyebrow="Fallback" title="Si le live bloque, montrer le diff et les checks" tone="signal">
                    <div className="text-base font-medium text-[color:var(--aot-text)]">
                        Le message reste le meme: l&apos;agent travaille, l&apos;humain pilote.
                    </div>
                </IndustrialPanel>
            </div>

            <div className="grid gap-4">
                {demoSteps.map((step, index) => (
                    <IndustrialPanel
                        key={step}
                        eyebrow={`Sequence ${index + 1}`}
                        title={step}
                        tone={index === 2 ? "primary" : index === 3 ? "signal" : "neutral"}
                    >
                        <div className="flex items-center gap-3 text-sm text-[color:var(--aot-text-muted)]">
                            <PlayCircle size={17} />
                            <span>{index < 2 ? "preparer le terrain" : "rendre la preuve visible"}</span>
                        </div>
                    </IndustrialPanel>
                ))}
            </div>
        </div>
    </Slide>
);

export const RoadmapSlide = () => (
    <Slide slideKey={11} slideNumber={11} eyebrow="Partie 5 - Atterrissage">
        <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
            <div className="max-w-5xl">
                <div className="industrial-kicker">Prochaines etapes</div>
                <h2 className="font-display mt-4 text-6xl font-semibold tracking-[-0.06em] text-[color:var(--aot-text)]">
                    Une trajectoire en 90 jours.
                </h2>
                <p className="mt-5 text-xl text-[color:var(--aot-text-muted)]">
                    Suffisamment courte pour apprendre. Suffisamment structuree pour mesurer.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {roadmap.map((item, index) => (
                    <IndustrialPanel
                        key={item.horizon}
                        eyebrow={item.horizon}
                        title={item.title}
                        tone={index === 0 ? "primary" : index === 2 ? "signal" : "neutral"}
                        className="justify-between"
                    >
                        <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            {item.detail}
                        </div>
                    </IndustrialPanel>
                ))}
            </div>

            <IndustrialPanel eyebrow="Decision attendue" title="Valider N3 comme standard AOT sur les projets pilotes" tone="primary">
                <div className="text-base font-medium text-[color:var(--aot-text)]">
                    Puis selectionner un seul flux N4 mesurable, avec sponsor et criteres d&apos;arret.
                </div>
            </IndustrialPanel>
        </div>
    </Slide>
);

export const QaSlide = () => (
    <Slide slideKey={12} slideNumber={12} eyebrow="Q/R - 10 minutes">
        <div className="grid h-full grid-cols-[1fr_1fr] gap-8">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">Questions / Reponses</div>
                    <h2 className="font-display mt-4 text-7xl font-semibold leading-[0.92] tracking-[-0.07em] text-[color:var(--aot-text)]">
                        Ce qu&apos;il faut decider maintenant.
                    </h2>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <IndustrialPanel eyebrow="15 min" title="speech">
                        <Timer size={20} className="text-[color:var(--aot-text-muted)]" />
                    </IndustrialPanel>
                    <IndustrialPanel eyebrow="15 min" title="demo" tone="primary">
                        <Bot size={20} className="text-[color:var(--aot-primary-hi)]" />
                    </IndustrialPanel>
                    <IndustrialPanel eyebrow="10 min" title="Q/R" tone="signal">
                        <UsersRound size={20} className="text-[color:var(--aot-signal-hi)]" />
                    </IndustrialPanel>
                </div>
            </div>

            <div className="grid gap-4">
                {[
                    { icon: Target, title: "Adopter N3", detail: "comme pratique standard sur les projets pilotes" },
                    { icon: ShieldCheck, title: "Encadrer N4", detail: "sur un workflow choisi, avec gates et traces" },
                    { icon: CheckCircle2, title: "Mandater le pole IA", detail: "pour standards, enablement, outillage et gouvernance" },
                ].map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <IndustrialPanel
                            key={item.title}
                            eyebrow={`Decision ${index + 1}`}
                            title={item.title}
                            tone={index === 0 ? "primary" : index === 1 ? "signal" : "neutral"}
                        >
                            <div className="flex items-center justify-between gap-5">
                                <div className="text-base text-[color:var(--aot-text-muted)]">
                                    {item.detail}
                                </div>
                                <Icon size={24} className="text-[color:var(--aot-text-muted)]" />
                            </div>
                        </IndustrialPanel>
                    );
                })}
            </div>
        </div>
    </Slide>
);

export const SpeechTimingSlide = () => (
    <Slide slideKey={2} slideNumber={2} eyebrow="Sommaire">
        <div className="grid h-full grid-cols-[0.88fr_1.12fr] gap-7">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">Plan de lecture</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.95] tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Ce que le deck doit rendre clair.
                    </h2>
                    <p className="mt-5 max-w-xl text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                        Comprendre les niveaux, prouver le mode agent guidé, puis décider comment AOT l&apos;industrialise.
                    </p>
                </div>

                <div className="relative min-h-[14rem] overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/ai-maturity-levels.png"
                        alt="Progression visuelle des niveaux de maturité IA"
                        fill
                        className="object-cover"
                        sizes="38vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="industrial-kicker text-white/70">Fil rouge</div>
                        <div className="mt-1 text-2xl font-semibold text-white">
                            N2 aujourd&apos;hui / N3 comme standard
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {agendaItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <IndustrialPanel
                            key={item.title}
                            eyebrow={`Point ${index + 1}`}
                            title={item.title}
                            tone={item.tone}
                            className="justify-between"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                                    {item.detail}
                                </div>
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--aot-border-subtle)] bg-[color:var(--aot-icon-bg)] text-[color:var(--aot-text-muted)]">
                                    <Icon size={18} />
                                </div>
                            </div>
                        </IndustrialPanel>
                    );
                })}
            </div>
        </div>
    </Slide>
);

export const IndustrialNarrativeMap = () => (
    <Slide slideKey={3} slideNumber={3} eyebrow="Niveaux IA">
        <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-7">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">Cadre commun</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-[color:var(--aot-text)]">
                        N1, N2, N3: de quoi parle-t-on ?
                    </h2>
                    <p className="mt-5 text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                        Le saut utile n&apos;est pas d&apos;avoir un outil IA. C&apos;est de déléguer une tâche complète sans perdre le contrôle.
                    </p>
                </div>

                <div className="relative min-h-[13rem] overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/ai-maturity-levels.png"
                        alt="Echelle visuelle des niveaux IA"
                        fill
                        className="object-cover"
                        sizes="40vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,transparent_72%)]" />
                    <div className="absolute bottom-4 left-4 max-w-md">
                        <div className="industrial-kicker text-white/70">Cible pragmatique</div>
                        <div className="mt-1 text-2xl font-semibold text-white">
                            N3 robuste avant N4
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-3">
                {levelPrimer.map((item) => (
                    <IndustrialPanel
                        key={item.level}
                        eyebrow={item.level}
                        title={item.title}
                        tone={item.tone ?? "neutral"}
                        className="gap-2.5 p-4"
                    >
                        <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                            {item.detail}
                        </div>
                    </IndustrialPanel>
                ))}
            </div>
        </div>
    </Slide>
);

export const IndustrialIcons = {
    Boxes,
    Braces,
    Layers3,
    Network,
    Route,
    Sparkles,
};
