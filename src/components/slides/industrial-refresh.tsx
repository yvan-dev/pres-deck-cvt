"use client";

import Image from "next/image";
import {
    ArrowRight,
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
    UsersRound,
} from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { IndustrialPanel } from "@/components/shared/IndustrialPanel";
import { RMC_METRICS } from "@/content/metrics";

const workflow = [
    { label: "Intent", detail: "besoin metier + contrainte", icon: Radar, image: "/generated/ai-maturity-levels.png" },
    { label: "Plan", detail: "scope, fichiers, tests", icon: ClipboardCheck, image: "/generated/agent-workflow.png" },
    { label: "Code", detail: "patch supervise", icon: Code2, image: "/generated/loc-ratio-ai-human.png" },
    { label: "Gate", detail: "lint, build, review", icon: GitPullRequest, image: "/generated/ai-industrial-hero.png" },
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

const aiPoleReasons = [
    {
        title: "Uniformiser",
        detail: "Même vocabulaire, mêmes garde-fous, mêmes critères de validation.",
        icon: ShieldCheck,
        tone: "primary" as const,
    },
    {
        title: "Faire le tri",
        detail: "Beaucoup d'outils IA, peu de choix réellement industrialisables.",
        icon: Radar,
        tone: "accent" as const,
    },
    {
        title: "Optimiser",
        detail: "Des workflows adaptés aux projets, pas des recettes génériques.",
        icon: Route,
        tone: "signal" as const,
    },
    {
        title: "Préparer",
        detail: "Former les consultants aux marchés des développeurs augmentés.",
        icon: UsersRound,
        tone: "primary" as const,
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

const PanelImage = ({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) => (
    <div className={`relative min-h-[6.25rem] overflow-hidden rounded-[14px] border border-[color:var(--aot-border-subtle)] ${className ?? ""}`}>
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="24vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.38)_100%)]" />
    </div>
);

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
                        src="/generated/loc-ratio-ai-human.png"
                        alt="Illustration du partage entre génération IA et reprise humaine du code"
                        fill
                        className="object-cover"
                        sizes="52vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.52)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="industrial-kicker text-white/70">Flux visible</div>
                        <div className="mt-1 text-2xl font-semibold text-white">
                            génération IA / reprise humaine / validation
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
                                <PanelImage
                                    src={item.image}
                                    alt={`Illustration ${item.label}`}
                                />
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

            <div className="grid grid-cols-3 gap-3">
                {[
                    "Plan avant patch",
                    "Preuve apres patch",
                    "Revue humaine",
                ].map((rule, index) => (
                    <div
                        key={rule}
                        className="industrial-chip justify-center py-3 text-center"
                        data-tone={index === 1 ? "primary" : index === 2 ? "signal" : undefined}
                    >
                        {rule}
                    </div>
                ))}
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

export const WhyAiPoleSlide = () => (
    <Slide slideKey={9} slideNumber={9} eyebrow="Partie 4 / Pôle IA">
        <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-7">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">Pourquoi maintenant</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-[color:var(--aot-text)]">
                        AOT a besoin d&apos;un pôle IA.
                    </h2>
                    <p className="mt-5 max-w-xl text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                        L&apos;IA avance trop vite pour rester une somme d&apos;initiatives individuelles.
                    </p>
                </div>

                <IndustrialPanel eyebrow="Thèse" title="Le pôle IA transforme l'expérimentation en capacité." tone="primary">
                    <div className="text-base font-medium text-[color:var(--aot-text)]">
                        Il met de l&apos;ordre dans les outils, les méthodes et la montée en compétence.
                    </div>
                </IndustrialPanel>
            </div>

            <div className="grid min-h-0 grid-rows-[1fr_auto] gap-4">
                <div className="relative min-h-0 overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/ai-pole-hub.png"
                        alt="Illustration d'un pôle IA transverse"
                        fill
                        className="object-cover"
                        sizes="52vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="industrial-kicker text-white/70">Mission</div>
                        <div className="mt-1 text-2xl font-semibold text-white">
                            standards / veille / workflows / marché
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {aiPoleReasons.map((item) => {
                        const Icon = item.icon;

                        return (
                            <IndustrialPanel
                                key={item.title}
                                eyebrow="Besoin"
                                title={item.title}
                                tone={item.tone}
                                className="gap-2 p-4"
                            >
                                <Icon size={18} className="text-[color:var(--aot-text-muted)]" />
                                <div className="text-xs leading-relaxed text-[color:var(--aot-text-muted)]">
                                    {item.detail}
                                </div>
                            </IndustrialPanel>
                        );
                    })}
                </div>
            </div>
        </div>
    </Slide>
);

export const AiPoleSlide = () => (
    <Slide slideKey={10} slideNumber={10} eyebrow="Partie 4 / Capacité transverse">
        <div className="grid h-full grid-cols-[1.05fr_0.95fr] gap-7">
            <div className="grid grid-cols-2 gap-4">
                <IndustrialPanel eyebrow="1" title="Standards" tone="primary" className="justify-between">
                    <PanelImage src="/generated/agent-workflow.png" alt="Standards de delivery agentique" />
                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                        Prompts, checklists, sécurité, critères de définition of done.
                    </div>
                </IndustrialPanel>
                <IndustrialPanel eyebrow="2" title="Enablement" className="justify-between">
                    <PanelImage src="/generated/ai-maturity-levels.png" alt="Formation et montée en compétence IA" />
                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                        Formation courte, pairing, bibliothèque d&apos;exemples.
                    </div>
                </IndustrialPanel>
                <IndustrialPanel eyebrow="3" title="Outillage" tone="accent" className="justify-between">
                    <PanelImage src="/generated/loc-ratio-ai-human.png" alt="Outils et traces d'exécution IA" />
                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                        Templates repo, agents, observabilité, coûts et traces.
                    </div>
                </IndustrialPanel>
                <IndustrialPanel eyebrow="4" title="Gouvernance" tone="signal" className="justify-between">
                    <PanelImage src="/generated/ai-industrial-hero.png" alt="Gouvernance et contrôle humain" />
                    <div className="text-sm leading-relaxed text-[color:var(--aot-text-muted)]">
                        Usages autorisés, contrôle humain, capitalisation des risques.
                    </div>
                </IndustrialPanel>
            </div>

            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">Modèle opératoire</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Une capacité partagée, pas un centre de coûts.
                    </h2>
                    <p className="mt-5 text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                        Le pôle IA aide les projets à livrer mieux, plus vite, avec moins de variabilité.
                    </p>
                </div>
                <div className="grid gap-4">
                    <div className="relative min-h-[13.5rem] overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                        <Image
                            src="/generated/ai-pole-hub.png"
                            alt="Hub transverse du pôle IA"
                            fill
                            className="object-cover"
                            sizes="42vw"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
                    </div>
                    <Factory className="text-[color:var(--aot-primary)]" size={58} />
                </div>
            </div>
        </div>
    </Slide>
);

export const DemoBriefingSlide = () => (
    <Slide slideKey={11} slideNumber={11} eyebrow="Partie 5 / Démo">
        <div className="relative h-full overflow-hidden rounded-[24px] border border-[color:var(--aot-border-subtle)]">
            <Image
                src="/generated/demo-stage.png"
                alt="Scène de démonstration du workflow agentique"
                fill
                className="object-cover"
                sizes="90vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.46)_48%,rgba(0,0,0,0.18)_100%)]" />

            <div className="absolute inset-0 grid grid-cols-[0.92fr_1.08fr] gap-7 p-8">
                <div className="flex flex-col justify-center">
                    <div className="industrial-kicker text-white/70">Live</div>
                    <h2 className="font-display mt-4 text-[7.5rem] font-semibold leading-[0.82] tracking-[-0.08em] text-white">
                        Démo
                    </h2>
                    <p className="mt-7 max-w-lg text-2xl leading-snug text-white/78">
                        Vous allez voir comment une demande devient un plan, puis une modification vérifiée.
                    </p>
                </div>

                <div className="flex items-end justify-end">
                    <div className="max-w-xl rounded-[24px] border border-white/12 bg-[rgba(5,10,8,0.58)] p-7 text-right backdrop-blur-xl">
                        <div className="industrial-kicker text-white/60">Objectif public</div>
                        <div className="mt-3 text-3xl font-semibold leading-tight text-white">
                            Voir le contrôle humain pendant l&apos;exécution IA.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Slide>
);

export const RoadmapSlide = () => (
    <Slide slideKey={12} slideNumber={12} eyebrow="Partie 5 / Atterrissage">
        <div className="grid h-full grid-cols-[0.94fr_1.06fr] gap-7">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">Prochaines étapes</div>
                    <h2 className="font-display mt-4 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-[color:var(--aot-text)]">
                        Une trajectoire en 90 jours.
                    </h2>
                    <p className="mt-5 text-xl leading-relaxed text-[color:var(--aot-text-muted)]">
                        Courte pour apprendre. Structurée pour mesurer.
                    </p>
                </div>

                <IndustrialPanel eyebrow="Décision attendue" title="Valider N3 comme standard AOT sur les projets pilotes" tone="primary">
                    <div className="text-base font-medium text-[color:var(--aot-text)]">
                        Puis choisir un seul flux N4 mesurable, avec sponsor et critères d&apos;arrêt.
                    </div>
                </IndustrialPanel>
            </div>

            <div className="grid grid-rows-[1fr_auto] gap-4">
                <div className="relative min-h-0 overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/ai-pole-hub.png"
                        alt="Illustration de trajectoire de pôle IA"
                        fill
                        className="object-cover"
                        sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
                </div>

                <div className="grid grid-cols-3 gap-4">
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
            </div>
        </div>
    </Slide>
);

export const QaSlide = () => (
    <Slide slideKey={13} slideNumber={13} eyebrow="Questions / Décisions">
        <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-8">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="industrial-kicker">Clôture</div>
                    <h2 className="font-display mt-4 text-7xl font-semibold leading-[0.92] tracking-[-0.07em] text-[color:var(--aot-text)]">
                        Ce qu&apos;il faut décider maintenant.
                    </h2>
                </div>

                <div className="relative min-h-0 flex-1 overflow-hidden rounded-[22px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/ai-industrial-hero.png"
                        alt="Illustration de décisions IA industrielles"
                        fill
                        className="object-cover"
                        sizes="42vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.58)_100%)]" />
                </div>
            </div>

            <div className="grid gap-4">
                {[
                    { icon: Target, title: "Adopter N3", detail: "comme pratique standard sur les projets pilotes" },
                    { icon: ShieldCheck, title: "Encadrer N4", detail: "sur un workflow choisi, avec gates et traces" },
                    { icon: CheckCircle2, title: "Mandater le pôle IA", detail: "pour standards, enablement, outillage et gouvernance" },
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
