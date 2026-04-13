"""
pipeline/agents.py
Agents BMAD — résolution des fichiers agents avec priorité :

  Priorité 1 — BMAD natif Codex (.agents/skills/ + _bmad/bmm/config.yaml présents) :
    → CodexRunner assemble les skills/workflows depuis {project_root}/.agents/skills/
    → Appui éventuel sur _bmad/ pour la config et les artefacts
    → Fallback automatique sur legacy/kit si un agent natif est manquant

  Priorité 2 — BMAD legacy :
    → CodexRunner charge depuis {project_root}/_bmad/bmm/agents/{name}.md

  Priorité 3 — Kit BMAD configuré (fallback) :
    → CodexRunner charge depuis {bmad_kit_path}/agents/{agent}-agent.md

  Priorité 4 — Fallback interne :
    → Instructions minimales embarquées pour SM/Sécu/DevOps/QA et générique sinon
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from .codex_runner import CodexRunner


@dataclass
class AgentRunner:
    """Wrapper unifié pour CodexRunner."""
    agent_id: str
    role:     str
    _runner:  CodexRunner
    timeout:  int = 600
    model:    str | None = None       # ex: modèle explicite supporté par Codex CLI
    fallback_model: str | None = None # modèle de repli si le principal est surchargé

    def run(self, task_description: str, extra_context: str = "") -> tuple[bool, str]:
        return self._runner.run_agent(
            agent_id=self.agent_id,
            task_description=task_description,
            extra_context=extra_context,
            timeout=self.timeout,
            model=self.model,
            fallback_model=self.fallback_model,
        )


def _is_bmad_native_installed(project_root: str) -> bool:
    """
    Détecte si BMAD natif Codex est installé dans le projet.
    Supporte :
      - installation Codex actuelle → .agents/skills/bmad-agent-pm + _bmad/config.yaml
      - layout legacy éventuel     → _bmad/bmm/agents/pm.md
    """
    p = Path(project_root)
    codex_layout = (
        (p / ".agents" / "skills" / "bmad-agent-pm" / "SKILL.md").exists()
        and (p / "_bmad" / "bmm" / "config.yaml").exists()
    )
    legacy_layout = (p / "_bmad" / "bmm" / "agents" / "pm.md").exists()
    return codex_layout or legacy_layout


def build_agents(
    bmad_kit_path: str,
    tasks_file: str,
    project_root: str = ".",
) -> dict[str, AgentRunner]:
    """
    Construit les agents. CodexRunner résout automatiquement :
      1. BMAD natif Codex → .agents/skills/... + workflows associés
      2. BMAD legacy      → _bmad/bmm/agents/{native_name}.md
      3. Kit configuré    → {bmad_kit_path}/agents/{agent_id}-agent.md
      4. Fallback interne → instructions embarquées
    """
    runner = CodexRunner(
        bmad_kit_path=bmad_kit_path,
        project_root=project_root,
        tasks_file=tasks_file,
    )

    native = _is_bmad_native_installed(project_root)
    from rich.console import Console
    if native:
        Console().print("[dim]Mode agents : BMAD natif Codex (.agents/skills + _bmad) avec fallback legacy/kit configuré[/dim]")
    else:
        Console().print("[dim]Mode agents : fallback legacy/kit configuré uniquement[/dim]")

    # Modèle Codex préféré par agent
    # Les agents critiques (archi, secu) utilisent le modèle stratégique
    # Les agents de production (dev, frontend, backend) utilisent le modèle d'exécution
    # None = modèle par défaut de Codex CLI
    strategic_model = os.getenv("CODEX_MODEL_STRATEGIC")
    execution_model = os.getenv("CODEX_MODEL_EXECUTION")

    MODELS: dict[str, tuple[str | None, str | None]] = {
        # agent_id: (model, fallback_model)
        "pm":       (strategic_model, execution_model),
        "po":       (strategic_model, execution_model),
        "sm":       (strategic_model, execution_model),
        "archi":    (strategic_model, execution_model),
        "design":   (execution_model, None),
        "ux":       (execution_model, None),
        "secu":     (strategic_model, execution_model),
        "security": (strategic_model, execution_model),
        "backend":  (execution_model, None),
        "frontend": (execution_model, None),
        "dev":      (execution_model, None),
        "qa":       (execution_model, None),
        "devops":   (execution_model, None),
    }

    # Timeouts adaptés à la complexité de chaque phase
    TIMEOUTS = {
        "pm":       480,   # P1 : PRD — agent PM BMAD
        "po":       480,
        "sm":       900,   # Création tickets — agent SM BMAD (lit PRD + génère tous les tickets)
        "archi":    720,   # P2 : architecture complexe
        "design":   600,   # P3a : design system
        "ux":       600,
        "secu":     600,   # P3b + P5b : threat model + audit
        "security": 600,
        "backend":  900,   # P4a : implémentation
        "frontend": 900,   # P4b : implémentation
        "dev":      900,
        "qa":       600,   # P5a : validation
        "devops":   600,   # P6 : CI/CD
    }

    ROLES = {
        "pm":       "Product Manager",
        "po":       "Product Owner",
        "sm":       "Scrum Master",
        "archi":    "Architecte logiciel",
        "design":   "Designer UI/UX",
        "ux":       "UX Expert",
        "secu":     "Responsable Sécurité",
        "security": "Responsable Sécurité",
        "backend":  "Développeur Backend",
        "frontend": "Développeur Frontend",
        "dev":      "Développeur",
        "qa":       "QA Engineer",
        "devops":   "DevOps / SRE",
    }

    return {
        agent_id: AgentRunner(
            agent_id=agent_id,
            role=role,
            _runner=runner,
            timeout=TIMEOUTS.get(agent_id, 600),
            model=MODELS.get(agent_id, (None, None))[0],
            fallback_model=MODELS.get(agent_id, (None, None))[1],
        )
        for agent_id, role in ROLES.items()
    }
