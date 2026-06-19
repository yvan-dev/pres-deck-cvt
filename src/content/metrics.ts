/**
 * Métriques chiffrées — source unique.
 * Estimations sourcées sur le workflow agentique RMC et études marché publiques.
 * À affiner quand les chiffres réels seront disponibles.
 */

export type Metric = {
    id: string;
    label: string;
    value: string;
    trend?: "up" | "down" | "neutral";
    source: string;
    isEstimate: boolean;
};

export const MARKET_METRICS: Metric[] = [
    {
        id: "dev-ai-adoption",
        label: "Développeurs utilisant l'IA en 2024",
        value: "76%",
        trend: "up",
        source: "Stack Overflow Developer Survey 2024",
        isEstimate: false,
    },
    {
        id: "agent-growth",
        label: "Croissance adoption agents IA 2023→2025",
        value: "×8",
        trend: "up",
        source: "GitHub / Anthropic reports 2024",
        isEstimate: false,
    },
    {
        id: "copilot-productivity",
        label: "Gain productivité avec Copilot",
        value: "+55%",
        trend: "up",
        source: "GitHub Copilot Productivity Study 2023",
        isEstimate: false,
    },
    {
        id: "bugs-reduction",
        label: "Réduction bugs détectés en review",
        value: "-40%",
        trend: "down",
        source: "GitClear / SonarSource 2024",
        isEstimate: false,
    },
    {
        id: "automatable-tasks",
        label: "Tâches dev automatisables",
        value: "60-70%",
        trend: "up",
        source: "McKinsey State of AI 2024",
        isEstimate: false,
    },
];

export const RMC_METRICS: Metric[] = [
    {
        id: "beads-created",
        label: "Beads créés sur la période",
        value: "~70",
        source: "Kanban RMC — estimation visible",
        isEstimate: true,
    },
    {
        id: "prs-delivered",
        label: "PR livrées via Claude Code",
        value: "~40",
        source: "Estimation à confirmer via git log",
        isEstimate: true,
    },
    {
        id: "loc-ratio",
        label: "Code nouveau généré par l'IA puis repris par l'humain",
        value: "80 / 20",
        source: "LOC = lignes de code · estimation workflow agent guidé N3",
        isEstimate: true,
    },
    {
        id: "feature-time",
        label: "Temps moyen par feature",
        value: "÷3",
        trend: "down",
        source: "Avant : 2-3 jours · Après : 0,5-1 jour",
        isEstimate: true,
    },
    {
        id: "test-coverage",
        label: "Couverture tests enforced",
        value: "80%+",
        source: "TDD workflow du projet (.claude/rules)",
        isEstimate: false,
    },
    {
        id: "bug-investigation",
        label: "Temps investigation bug",
        value: "-60%",
        trend: "down",
        source: "Base de connaissance LEARNED: dans beads",
        isEstimate: true,
    },
    {
        id: "reprompts",
        label: "Re-prompts moyens par bead",
        value: "1-2",
        source: "Reflet de la qualité du plan initial",
        isEstimate: true,
    },
    {
        id: "onboarding",
        label: "Temps onboarding d'un dev",
        value: "÷4",
        trend: "down",
        source: "Jours → heures · CLAUDE.md + skills",
        isEstimate: true,
    },
];
