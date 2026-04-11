/**
 * Les 5 niveaux de maturité IA — source unique de vérité.
 * Utilisé par les slides de la Partie 2 (vue d'ensemble + détails).
 */

export type MaturityLevel = {
    id: 1 | 2 | 3 | 4 | 5;
    slug: "chat" | "copilot" | "agent" | "hitl" | "swarm";
    label: string;
    tagline: string;
    definition: string;
    autonomy: number; // 0-100 — part d'autonomie IA
    tools: string[];
    useCases: string[];
    limits: string[];
    weakSignal: string;
    horizon: "present" | "short-term" | "mid-term" | "long-term";
    isShortTermTarget?: boolean;
    isMidTermTarget?: boolean;
    accentColor: "slate" | "blue" | "primary" | "accent" | "teal";
};

export const MATURITY_LEVELS: MaturityLevel[] = [
    {
        id: 1,
        slug: "chat",
        label: "Chat",
        tagline: "Q&A basique",
        definition:
            "Je pose une question dans une interface de chat, je copie-colle la réponse dans mon code.",
        autonomy: 5,
        tools: ["ChatGPT", "Claude.ai", "Gemini", "Mistral Chat", "Perplexity"],
        useCases: [
            "Questions ponctuelles",
            "Rédaction de documentation",
            "Explications de concepts",
            "Recherche d'API ou de syntaxe",
        ],
        limits: [
            "Aucun contexte projet",
            "Copier-coller fragile et sans traçabilité",
            "Hallucinations non détectables par l'utilisateur",
            "Aucune exécution ni validation",
        ],
        weakSignal: "« J'ai essayé ChatGPT mais ça comprend pas mon code »",
        horizon: "present",
        accentColor: "slate",
    },
    {
        id: 2,
        slug: "copilot",
        label: "Copilote",
        tagline: "Assistance contextualisée",
        definition:
            "L'IA lit mon fichier ouvert et complète le code pendant que je tape, ligne par ligne.",
        autonomy: 25,
        tools: [
            "GitHub Copilot",
            "Cursor (tab)",
            "JetBrains AI Assistant",
            "Tabnine",
            "Codeium",
        ],
        useCases: [
            "Autocomplétion intelligente",
            "Génération de tests unitaires",
            "Refactor local",
            "Génération de boilerplate",
        ],
        limits: [
            "Reste centré sur le fichier courant",
            "Pas d'orchestration multi-étapes",
            "Le dev reste pilote à 100%",
            "Gain réel plafonné à ~20-30%",
        ],
        weakSignal:
            "« Copilot est activé mais on s'en sert surtout pour l'autocomplétion »",
        horizon: "present",
        accentColor: "blue",
    },
    {
        id: 3,
        slug: "agent",
        label: "Agent guidé",
        tagline: "Exécution supervisée",
        definition:
            "Je décris une tâche en langage naturel. L'IA investigue, planifie, code, teste — je valide à chaque palier.",
        autonomy: 65,
        tools: [
            "Claude Code",
            "Cursor Agent",
            "Cline",
            "Aider",
            "Windsurf Cascade",
        ],
        useCases: [
            "Implémenter une feature multi-fichiers",
            "Corriger un bug en autonomie supervisée",
            "Refactor cross-modules",
            "Explorer un repo inconnu",
            "Générer et exécuter des tests",
        ],
        limits: [
            "Apprentissage : savoir « manager un agent »",
            "Fatigue cognitive de validation",
            "Coût d'une bonne spécification",
            "Gain 2-5× sur les tâches bien cadrées",
        ],
        weakSignal:
            "« Sur D2R2, on livre des features en quelques heures là où il fallait des jours »",
        horizon: "short-term",
        isShortTermTarget: true,
        accentColor: "primary",
    },
    {
        id: 4,
        slug: "hitl",
        label: "Human in the Loop",
        tagline: "Workflow automatisé contrôlé",
        definition:
            "Des chaînes d'agents spécialisés tournent en quasi-autonomie. L'humain valide uniquement aux gates critiques.",
        autonomy: 85,
        tools: [
            "BMAD Method",
            "LangGraph",
            "CrewAI",
            "AutoGen",
            "Claude Agent SDK",
        ],
        useCases: [
            "Pipeline spec → implémentation",
            "PRs auto-reviewées avec gates",
            "Refactoring massif orchestré",
            "Veille et data extraction automatisées",
        ],
        limits: [
            "Coût infrastructure IA plus élevé",
            "Observabilité & gouvernance nécessaires",
            "Compétences de flow engineering",
            "Gestion des dérives à formaliser",
        ],
        weakSignal:
            "« Mes projets perso tournent en BMAD + LangGraph avec des gates de validation »",
        horizon: "mid-term",
        isMidTermTarget: true,
        accentColor: "accent",
    },
    {
        id: 5,
        slug: "swarm",
        label: "Swarm",
        tagline: "Essaim autonome",
        definition:
            "Des agents collaborent, se critiquent et s'auto-améliorent sans supervision humaine continue.",
        autonomy: 98,
        tools: [
            "MetaGPT",
            "ChatDev",
            "AutoGen Swarm",
            "Devin (mode autonome)",
            "Agents auto-spawnés",
        ],
        useCases: [
            "Équipe virtuelle (PM + Archi + Dev + QA)",
            "R&D automatisée sur problèmes ouverts",
            "Agents qui créent d'autres agents",
            "Marketplace d'agents spécialisés",
        ],
        limits: [
            "Immature en production",
            "Risques de dérive comportementale",
            "Explicabilité difficile",
            "Gouvernance non standardisée",
        ],
        weakSignal: "Horizon 12-24 mois sur des usages industriels ciblés",
        horizon: "long-term",
        accentColor: "teal",
    },
];

export const getLevelById = (id: number): MaturityLevel | undefined =>
    MATURITY_LEVELS.find((level) => level.id === id);
