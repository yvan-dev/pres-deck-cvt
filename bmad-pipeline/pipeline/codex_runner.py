"""
pipeline/codex_runner.py
Exécute chaque agent du pipeline via Codex CLI.

Architecture :
  LangGraph node → CodexRunner.run_agent() → subprocess `codex exec`
                                           → lit/écrit le projet
                                           → met à jour tasks.json
"""
from __future__ import annotations

import json
import os
import queue
import shutil
import subprocess
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

if sys.platform == "win32":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from rich.console import Console

console = Console()

AGENT_TIMEOUT = int(os.getenv("CODEX_AGENT_TIMEOUT", "600"))
CODEX_EXEC_MODE = os.getenv("CODEX_EXEC_MODE", "permissive").lower()
DEBUG_ENV_TRUE_VALUES = {"1", "true", "yes", "on"}

# Ancien layout BMAD (hérité d'instructions historiques du pipeline).
LEGACY_NATIVE_AGENT_NAMES: dict[str, str] = {
    "pm": "pm",
    "po": "pm",
    "sm": "sm",
    "archi": "architect",
    "architect": "architect",
    "design": "ux-designer",
    "ux": "ux-designer",
    "backend": "dev",
    "frontend": "dev",
    "dev": "dev",
    "qa": "qa",
}

# Layout réellement produit par `npx bmad-method install --tools codex`.
# On assemble plusieurs fichiers de skill/workflow pour donner à Codex un contexte exploitable.
PM_PIPELINE_NATIVE_BUNDLE: list[str] = [
    ".agents/skills/bmad-agent-pm/SKILL.md",
    ".agents/skills/bmad-create-prd/SKILL.md",
    ".agents/skills/bmad-create-prd/templates/prd-template.md",
]

CODEX_NATIVE_SKILL_BUNDLES: dict[str, list[str]] = {
    "pm": [
        ".agents/skills/bmad-agent-pm/SKILL.md",
        ".agents/skills/bmad-create-prd/SKILL.md",
        ".agents/skills/bmad-create-prd/workflow.md",
    ],
    "po": [
        ".agents/skills/bmad-agent-pm/SKILL.md",
        ".agents/skills/bmad-create-prd/SKILL.md",
        ".agents/skills/bmad-create-prd/workflow.md",
    ],
    "sm": [
        ".agents/skills/bmad-create-epics-and-stories/SKILL.md",
        ".agents/skills/bmad-create-epics-and-stories/workflow.md",
    ],
    "archi": [
        ".agents/skills/bmad-agent-architect/SKILL.md",
        ".agents/skills/bmad-create-architecture/SKILL.md",
        ".agents/skills/bmad-create-architecture/workflow.md",
    ],
    "architect": [
        ".agents/skills/bmad-agent-architect/SKILL.md",
        ".agents/skills/bmad-create-architecture/SKILL.md",
        ".agents/skills/bmad-create-architecture/workflow.md",
    ],
    "design": [
        ".agents/skills/bmad-agent-ux-designer/SKILL.md",
        ".agents/skills/bmad-create-ux-design/SKILL.md",
        ".agents/skills/bmad-create-ux-design/workflow.md",
    ],
    "ux": [
        ".agents/skills/bmad-agent-ux-designer/SKILL.md",
        ".agents/skills/bmad-create-ux-design/SKILL.md",
        ".agents/skills/bmad-create-ux-design/workflow.md",
    ],
    "backend": [
        ".agents/skills/bmad-agent-dev/SKILL.md",
        ".agents/skills/bmad-quick-dev/SKILL.md",
        ".agents/skills/bmad-quick-dev/workflow.md",
    ],
    "frontend": [
        ".agents/skills/bmad-agent-dev/SKILL.md",
        ".agents/skills/bmad-quick-dev/SKILL.md",
        ".agents/skills/bmad-quick-dev/workflow.md",
    ],
    "dev": [
        ".agents/skills/bmad-agent-dev/SKILL.md",
        ".agents/skills/bmad-quick-dev/SKILL.md",
        ".agents/skills/bmad-quick-dev/workflow.md",
    ],
    "qa": [
        ".agents/skills/bmad-qa-generate-e2e-tests/SKILL.md",
        ".agents/skills/bmad-qa-generate-e2e-tests/workflow.md",
    ],
    "analyst": [
        ".agents/skills/bmad-agent-analyst/SKILL.md",
    ],
}

DEFAULT_TRACKER_PROTOCOL = (
    "À chaque étape significative, mets à jour tasks.json :\n"
    "- Passe l'élément concerné en 'inprogress' au démarrage\n"
    "- Ajoute des logs d'avancement courts et factuels\n"
    "- Passe en 'review' ou 'done' quand le travail demandé est terminé\n"
    "- Si tu crées de nouvelles stories, réécris tasks.json complètement avec un JSON valide\n"
    "- Préserve un schéma stable : id, title, description, agent, phase, priority, status, sprint, logs\n"
)

BUILTIN_AGENT_FALLBACKS: dict[str, str] = {
    "sm": (
        "# Scrum Master — fallback interne\n"
        "Tu transformes le PRD en backlog exécutable.\n"
        "Produis docs/stories/, _bmad-output/planning-artifacts/epics.md et réécris tasks.json proprement.\n"
        "Structure les stories avec critères d'acceptation, priorité, phase BMAD et agent responsable."
    ),
    "secu": (
        "# Security Reviewer — fallback interne\n"
        "Analyse la solution sous l'angle sécurité. Produis threat model, risques, mitigations et mets à jour tasks.json."
    ),
    "security": (
        "# Security Reviewer — fallback interne\n"
        "Analyse la solution sous l'angle sécurité. Produis threat model, risques, mitigations et mets à jour tasks.json."
    ),
    "devops": (
        "# DevOps Engineer — fallback interne\n"
        "Prépare CI/CD, Docker, déploiement et observabilité. Mets à jour tasks.json à chaque étape significative."
    ),
    "qa": (
        "# QA Engineer — fallback interne\n"
        "Vérifie l'implémentation, complète les tests si nécessaire et mets à jour tasks.json avec l'état de validation."
    ),
}
PM_PIPELINE_OVERRIDE = (
    "# Override pipeline PM\n"
    "Tu n'es pas en atelier de découverte interactif mais dans un run pipeline headless.\n"
    "Règles supplémentaires obligatoires :\n"
    "- N'exécute PAS l'architecture step-file BMAD complète ni les menus de continuation\n"
    "- N'ouvre PAS `steps-c/*`, `steps/*`, `data/*.csv` ni d'autres fichiers de facilitation sauf si la tâche l'exige explicitement\n"
    "- Ne mène PAS d'interview, ne pose PAS de questions, ne simule PAS de workshop\n"
    "- Traite le brief courant comme source de vérité prioritaire si le dépôt contient un ancien contexte contradictoire\n"
    "- Utilise en priorité le brief, tasks.json, `_bmad/bmm/config.yaml`, `docs/PROJECT-CONTEXT.md`, `README.md` et `plans/deck-plan.md` si utile\n"
    "- Le produit principal est l'application/deck décrite par `README.md` et `plans/deck-plan.md`; le pipeline BMAD, le tracker et les gates sont seulement le workflow de développement, sauf si le brief demande explicitement l'inverse\n"
    "- Si le dépôt mentionne un workflow agentique, traite-le comme un moyen de livraison et de démonstration, pas comme le coeur du produit à cadrer dans le PRD\n"
    "- Le PRD doit d'abord cadrer le deck CVT, son arc narratif, son expérience de projection, sa crédibilité métier, son contenu et ses démonstrations\n"
    "- Produis directement `docs/prd.md` en une seule passe structurée\n"
    "- Si un template PRD est fourni, utilise sa structure mais sans lancer le workflow interactif\n"
    "- Réduis l'exploration du dépôt au strict nécessaire pour finaliser le PRD rapidement\n"
    "- Avant que `docs/prd.md` n'existe, tu peux seulement lire le contexte minimal et ajouter de courts logs aux tickets PM existants\n"
    "- N'efface PAS, ne recrée PAS et ne réorganise PAS entièrement `tasks.json` avant d'avoir écrit `docs/prd.md`\n"
    "- N'ajoute PAS de stories P2/P3/P4 et ne normalise PAS le backlog avant que `docs/prd.md` soit terminé\n"
    "- Une fois `docs/prd.md` écrit, fais seulement une mise à jour tracker minimale et factuelle puis termine\n"
    "- Mets à jour les tickets PM dans tasks.json avec des logs factuels courts puis termine\n"
)


class CodexRunner:
    """
    Exécute un agent BMAD via Codex CLI.

    Chaque appel ouvre un sous-processus `codex exec` avec :
    - Le prompt complet de l'agent (fichier .md)
    - Le protocole tracker
    - Le contexte projet (PROJECT-CONTEXT.md)
    - La tâche spécifique à exécuter
    - Le chemin de tasks.json pour les mises à jour
    """

    def __init__(
        self,
        bmad_kit_path: str,
        project_root: str,
        tasks_file: str,
    ):
        self.bmad_kit_path = Path(bmad_kit_path).resolve()
        self.project_root = Path(project_root).resolve()
        self.tasks_file = Path(tasks_file).resolve()
        self._codex_bin = self._find_codex()

    def _find_codex(self) -> str:
        """Trouve le binaire codex dans le PATH."""
        bin_path = shutil.which("codex")
        if not bin_path:
            raise RuntimeError(
                "Codex CLI introuvable. "
                "Installe-le : npm install -g @openai/codex"
            )
        return bin_path

    def _load_file(self, path: Path) -> str:
        return path.read_text(encoding="utf-8") if path.exists() else ""

    def _load_existing_bundle(self, relative_paths: list[str]) -> str:
        sections: list[str] = []
        loaded_files: list[str] = []

        for relative_path in relative_paths:
            full_path = self.project_root / relative_path
            if not full_path.exists():
                continue
            content = self._load_file(full_path).strip()
            if not content:
                continue
            loaded_files.append(relative_path)
            sections.append(f"# Source BMAD native: {relative_path}\n{content}")

        if loaded_files:
            console.print(
                f"[dim]  Bundle BMAD natif chargé ({len(loaded_files)} fichier(s)) : "
                f"{', '.join(loaded_files)}[/dim]"
            )

        return "\n\n---\n\n".join(sections)

    def _load_legacy_native_agent(self, agent_id: str) -> str:
        legacy_name = LEGACY_NATIVE_AGENT_NAMES.get(agent_id)
        if not legacy_name:
            return ""

        legacy_path = self.project_root / "_bmad" / "bmm" / "agents" / f"{legacy_name}.md"
        if legacy_path.exists():
            console.print(f"[dim]  Agent {agent_id} → natif legacy ({legacy_path.name})[/dim]")
            return self._load_file(legacy_path)

        return ""

    def _load_inline_fallback(self, agent_id: str) -> str:
        if agent_id in BUILTIN_AGENT_FALLBACKS:
            console.print(f"[yellow]  Agent {agent_id} → fallback interne[/yellow]")
            return BUILTIN_AGENT_FALLBACKS[agent_id]

        console.print(f"[yellow]  Agent {agent_id} : aucun fichier trouvé (BMAD natif + kit) — fallback générique[/yellow]")
        return (
            f"# Agent {agent_id} — fallback générique\n"
            "Exécute la tâche demandée de manière autonome et non interactive. "
            "Lis le contexte projet, produis les livrables attendus, mets à jour tasks.json, "
            "et termine avec un résumé bref et factuel."
        )

    def _load_pm_pipeline_bundle(self) -> str:
        bundle = self._load_existing_bundle(PM_PIPELINE_NATIVE_BUNDLE)
        if bundle:
            console.print("[dim]  Agent PM → bundle pipeline compact[/dim]")
        return bundle

    def _load_agent_md(self, agent_id: str) -> str:
        """
        Charge les instructions agent avec priorité :
          1. BMAD Codex natif : {project_root}/.agents/skills/... + workflows associés
          2. BMAD legacy      : {project_root}/_bmad/bmm/agents/{name}.md
          3. Kit maison       : {bmad_kit_path}/agents/{agent_id}-agent.md
          4. Fallback interne : instructions minimales embarquées
        """
        if agent_id in {"pm", "po"}:
            pm_bundle = self._load_pm_pipeline_bundle()
            if pm_bundle:
                return pm_bundle

        native_bundle = self._load_existing_bundle(CODEX_NATIVE_SKILL_BUNDLES.get(agent_id, []))
        if native_bundle:
            return native_bundle

        legacy_agent = self._load_legacy_native_agent(agent_id)
        if legacy_agent:
            return legacy_agent

        kit_path = self.bmad_kit_path / "agents" / f"{agent_id}-agent.md"
        if kit_path.exists():
            console.print(f"[dim]  Agent {agent_id} → kit configuré ({kit_path.name})[/dim]")
            return self._load_file(kit_path)

        return self._load_inline_fallback(agent_id)

    def _load_tracker_protocol(self) -> str:
        candidates = [
            self.project_root / ".bmad-tracker-protocol.md",
            self.project_root / "_bmad" / "tracker-protocol.md",
            self.bmad_kit_path / "tracker-protocol.md",
        ]
        for path in candidates:
            if path.exists():
                console.print(f"[dim]  Tracker protocol → {path}[/dim]")
                return self._load_file(path)
        console.print("[yellow]  Tracker protocol introuvable — fallback interne[/yellow]")
        return DEFAULT_TRACKER_PROTOCOL

    def _load_project_context(self) -> str:
        candidates = [
            self.project_root / "docs" / "PROJECT-CONTEXT.md",
            self.project_root / "docs" / "project-context.md",
            self.project_root / "PROJECT-CONTEXT.md",
            self.project_root / "project-context.md",
        ]
        for path in candidates:
            if path.exists():
                return self._load_file(path)
        return ""

    def _agent_pipeline_override(self, agent_id: str) -> str:
        if agent_id in {"pm", "po"}:
            return PM_PIPELINE_OVERRIDE
        return ""

    def _agent_execution_contract(self, agent_id: str) -> str:
        if agent_id not in {"pm", "po"}:
            return ""
        return (
            "# Ordre d'exécution imposé\n"
            "1. Lire uniquement le contexte minimal requis par la tâche.\n"
            "2. Écrire `docs/prd.md` complètement avant toute réécriture structurelle du backlog.\n"
            "3. Après création du PRD, ajouter au plus une mise à jour tracker minimale sur les tickets PM existants.\n"
            "4. Ne pas créer de nouvelles stories hors PM dans ce run.\n"
            "5. Terminer immédiatement après le PRD et le mini update tracker."
        )

    def _build_prompt(
        self,
        agent_id: str,
        task_description: str,
        extra_context: str = "",
    ) -> str:
        """
        Construit le prompt complet envoyé à Codex CLI.
        Structure :
          1. Rôle et instructions de l'agent (fichier .md)
          2. Protocole tracker
          3. Contexte projet courant
          4. Tâche spécifique
        """
        agent_md = self._load_agent_md(agent_id)
        protocol = self._load_tracker_protocol()
        context = self._load_project_context()

        override = self._agent_pipeline_override(agent_id)

        parts = [
            "# MODE PIPELINE — Exécution automatique non-interactive",
            "> Tu es en mode pipeline automatisé. Règles absolues :",
            "> - **NE PAS** afficher de menu, de greeting ni demander de confirmation",
            "> - **NE PAS** attendre de saisie utilisateur (il n'y en aura pas)",
            "> - Ignorer toute instruction `WAIT for user input` ou `PRESENT the numbered menu`",
            "> - Si des instructions BMAD référencent des workflows/steps locaux, les suivre de façon autonome sans pause utilisateur",
            "> - Exécuter DIRECTEMENT et COMPLÈTEMENT la tâche décrite en section `# Ta tâche`",
            "> - Produire tous les fichiers livrables demandés dans le projet",
            "> - Mettre à jour tasks.json à chaque étape significative",
            "> - Terminer par un résumé concis du travail accompli",
            "",
            "---",
            "# Instructions de l'agent",
            agent_md,
        ]

        if override:
            parts += ["", "---", "# Override pipeline spécifique", override]

        execution_contract = self._agent_execution_contract(agent_id)
        if execution_contract:
            parts += ["", "---", execution_contract]

        parts += ["", "---", "# Protocole Tracker", protocol]

        if context:
            parts += ["", "---", "# Contexte projet courant", context]

        if extra_context:
            parts += ["", "---", "# Contexte supplémentaire", extra_context]

        parts += [
            "",
            "---",
            "# Ta tâche",
            task_description,
            "",
            f"**Chemin tasks.json** (pour tes mises à jour) : `{self.tasks_file}`",
            f"**Racine projet** : `{self.project_root}`",
            "**Ressources BMAD locales** : `.agents/skills` si présent, sinon `_bmad/` et le kit fourni",
        ]

        return "\n".join(parts)

    def _debug_enabled(self) -> bool:
        return os.getenv("CODEX_RUNNER_DEBUG", "false").lower() in DEBUG_ENV_TRUE_VALUES

    def _debug_dir(self) -> Path:
        configured = os.getenv("CODEX_RUNNER_DEBUG_DIR", "").strip()
        base = Path(configured) if configured else self.project_root / "_bmad-output" / "codex-debug"
        if not base.is_absolute():
            base = self.project_root / base
        base.mkdir(parents=True, exist_ok=True)
        return base

    def _append_debug_line(self, path: Path, line: str) -> None:
        with path.open("a", encoding="utf-8") as fh:
            fh.write(line.rstrip("\n") + "\n")

    def _extract_event_summary(self, payload: object) -> str:
        if isinstance(payload, str):
            return payload.strip()
        if isinstance(payload, list):
            for item in payload:
                summary = self._extract_event_summary(item)
                if summary:
                    return summary
            return ""
        if isinstance(payload, dict):
            for key in ("message", "text", "content", "delta", "summary", "title", "reason"):
                if key in payload:
                    summary = self._extract_event_summary(payload[key])
                    if summary:
                        return summary
            for value in payload.values():
                summary = self._extract_event_summary(value)
                if summary:
                    return summary
        return ""

    def _summarize_event_line(self, line: str) -> str:
        raw = line.strip()
        if not raw:
            return ""

        try:
            event = json.loads(raw)
        except json.JSONDecodeError:
            return raw[:240]

        event_type = (
            event.get("type")
            or event.get("event")
            or event.get("kind")
            or "event"
        )
        summary = self._extract_event_summary(event)
        if summary:
            summary = " ".join(summary.split())
            if len(summary) > 240:
                summary = summary[:237] + "..."
            return f"{event_type}: {summary}"
        return str(event_type)

    def _build_cmd(
        self,
        model: str | None = None,
        json_output: bool = False,
        last_message_path: Path | None = None,
    ) -> list[str]:
        cmd = [
            self._codex_bin,
            "exec",
            "--cd", str(self.project_root),
        ]

        if CODEX_EXEC_MODE == "permissive":
            cmd.append("--dangerously-bypass-approvals-and-sandbox")
        else:
            cmd += ["--sandbox", os.getenv("CODEX_SANDBOX_MODE", "workspace-write")]

        if model:
            cmd += ["--model", model]

        if json_output:
            cmd.append("--json")

        if last_message_path is not None:
            cmd += ["--output-last-message", str(last_message_path)]

        return cmd

    def _run_agent_with_debug(
        self,
        agent_id: str,
        prompt: str,
        timeout: int,
        model: str | None,
        fallback_model: str | None,
    ) -> tuple[bool, str]:
        debug_dir = self._debug_dir()
        run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
        base_name = f"{run_id}-{agent_id}"
        prompt_path = debug_dir / f"{base_name}.prompt.md"
        stdout_path = debug_dir / f"{base_name}.stdout.jsonl"
        stderr_path = debug_dir / f"{base_name}.stderr.log"
        summary_path = debug_dir / f"{base_name}.summary.log"
        last_message_path = debug_dir / f"{base_name}.last-message.txt"

        prompt_path.write_text(prompt, encoding="utf-8")
        cmd = self._build_cmd(model=model, json_output=True, last_message_path=last_message_path)

        self._append_debug_line(summary_path, f"started_at={datetime.now(timezone.utc).isoformat()}")
        self._append_debug_line(summary_path, f"agent={agent_id}")
        self._append_debug_line(summary_path, f"timeout={timeout}")
        self._append_debug_line(summary_path, f"cwd={self.project_root}")
        self._append_debug_line(summary_path, f"prompt_path={prompt_path}")
        self._append_debug_line(summary_path, f"stdout_path={stdout_path}")
        self._append_debug_line(summary_path, f"stderr_path={stderr_path}")
        self._append_debug_line(summary_path, f"last_message_path={last_message_path}")
        self._append_debug_line(summary_path, f"command={' '.join(cmd)}")
        if fallback_model:
            self._append_debug_line(summary_path, f"fallback_model_ignored={fallback_model}")

        console.print(f"[dim]Debug Codex activé → {summary_path}[/dim]")

        process = subprocess.Popen(
            cmd,
            cwd=str(self.project_root),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            bufsize=1,
            env={**os.environ},
        )

        assert process.stdin is not None
        assert process.stdout is not None
        assert process.stderr is not None

        process.stdin.write(prompt)
        process.stdin.close()

        event_queue: queue.Queue[tuple[str, str | None]] = queue.Queue()

        def _reader(stream, source: str) -> None:
            try:
                for line in iter(stream.readline, ""):
                    event_queue.put((source, line))
            finally:
                event_queue.put((source, None))

        stdout_thread = threading.Thread(target=_reader, args=(process.stdout, "stdout"), daemon=True)
        stderr_thread = threading.Thread(target=_reader, args=(process.stderr, "stderr"), daemon=True)
        stdout_thread.start()
        stderr_thread.start()

        start_monotonic = time.monotonic()
        last_activity = start_monotonic
        last_heartbeat = start_monotonic
        heartbeat_secs = int(os.getenv("CODEX_RUNNER_HEARTBEAT_SECS", "20"))
        stdout_done = False
        stderr_done = False
        stdout_lines: list[str] = []
        stderr_lines: list[str] = []
        event_count = 0

        while True:
            now = time.monotonic()
            if now - start_monotonic > timeout:
                process.kill()
                msg = (
                    f"Agent {agent_id} timeout après {timeout}s "
                    f"(debug: {summary_path})"
                )
                self._append_debug_line(summary_path, msg)
                console.print(f"[red]{msg}[/red]")
                return False, msg

            try:
                source, line = event_queue.get(timeout=1)
            except queue.Empty:
                if process.poll() is None and now - last_heartbeat >= heartbeat_secs:
                    heartbeat = (
                        f"heartbeat elapsed={int(now - start_monotonic)}s "
                        f"last_activity={int(now - last_activity)}s events={event_count}"
                    )
                    self._append_debug_line(summary_path, heartbeat)
                    console.print(f"[dim]{heartbeat}[/dim]")
                    last_heartbeat = now
                if process.poll() is not None and stdout_done and stderr_done:
                    break
                continue

            if line is None:
                if source == "stdout":
                    stdout_done = True
                else:
                    stderr_done = True
                if process.poll() is not None and stdout_done and stderr_done:
                    break
                continue

            last_activity = time.monotonic()
            if source == "stdout":
                stdout_lines.append(line)
                self._append_debug_line(stdout_path, line.rstrip("\n"))
                event_count += 1
                summary = self._summarize_event_line(line)
                if summary:
                    trace = f"stdout[{event_count}] {summary}"
                    self._append_debug_line(summary_path, trace)
                    console.print(f"[dim]{trace}[/dim]")
            else:
                stderr_lines.append(line)
                self._append_debug_line(stderr_path, line.rstrip("\n"))
                summary = " ".join(line.split())
                if summary:
                    trace = f"stderr {summary[:240]}"
                    self._append_debug_line(summary_path, trace)
                    console.print(f"[yellow dim]{trace}[/yellow dim]")

        returncode = process.wait(timeout=5)
        duration = time.monotonic() - start_monotonic
        self._append_debug_line(summary_path, f"returncode={returncode}")
        self._append_debug_line(summary_path, f"duration_secs={duration:.2f}")

        output = ""
        if last_message_path.exists():
            output = last_message_path.read_text(encoding="utf-8").strip()

        if not output:
            output = "".join(stdout_lines).strip()

        if returncode != 0:
            err = "".join(stderr_lines).strip()
            if not err:
                err = output
            console.print(f"[red]Agent {agent_id} exit {returncode}[/red]")
            return False, err or f"Échec agent {agent_id} (debug: {summary_path})"

        console.print(f"[green]✓ Agent {agent_id} terminé[/green]")
        console.print(f"[dim]Trace d'exécution Codex → {summary_path}[/dim]")
        return True, output

    def run_agent(
        self,
        agent_id: str,
        task_description: str,
        extra_context: str = "",
        timeout: int | None = None,
        model: str | None = None,
        fallback_model: str | None = None,
    ) -> tuple[bool, str]:
        """
        Exécute un agent via Codex CLI.

        Retourne (success: bool, output: str).
        fallback_model est conservé pour compatibilité, mais ignoré par Codex CLI.
        """
        prompt = self._build_prompt(agent_id, task_description, extra_context)
        t_out = timeout or AGENT_TIMEOUT

        model_info = f" model={model}" if model else ""
        fallback_info = f" fallback={fallback_model} (ignored)" if fallback_model else ""
        console.print(
            f"[cyan]▸ Codex CLI[/cyan] agent=[bold]{agent_id}[/bold]"
            f"{model_info}{fallback_info} timeout={t_out}s cwd={self.project_root}"
        )

        if self._debug_enabled():
            return self._run_agent_with_debug(
                agent_id=agent_id,
                prompt=prompt,
                timeout=t_out,
                model=model,
                fallback_model=fallback_model,
            )

        cmd = self._build_cmd(model=model)

        try:
            result = subprocess.run(
                cmd,
                cwd=str(self.project_root),
                input=prompt,
                capture_output=True,
                text=True,
                encoding="utf-8",
                timeout=t_out,
                env={**os.environ},
            )

            output = result.stdout.strip()
            if result.returncode != 0:
                err = result.stderr.strip()
                console.print(f"[red]Agent {agent_id} exit {result.returncode}[/red]")
                if err:
                    console.print(f"[red dim]{err[:300]}[/red dim]")
                return False, err or output

            console.print(f"[green]✓ Agent {agent_id} terminé[/green]")
            return True, output

        except subprocess.TimeoutExpired:
            msg = f"Agent {agent_id} timeout après {t_out}s"
            console.print(f"[red]{msg}[/red]")
            return False, msg

        except Exception as e:
            msg = f"Agent {agent_id} erreur : {e}"
            console.print(f"[red]{msg}[/red]")
            return False, msg

    def check_auth(self) -> bool:
        """Vérifie que Codex CLI est installé et répond."""
        try:
            result = subprocess.run(
                [self._codex_bin, "--version"],
                capture_output=True, text=True, timeout=10,
            )
            return result.returncode == 0
        except Exception:
            return False

    def get_auth_info(self) -> str:
        """Retourne le type d'auth probable pour Codex CLI."""
        if os.getenv("OPENAI_API_KEY"):
            return "API Key OpenAI"
        return "Login Codex CLI (ChatGPT) ou configuration locale"
