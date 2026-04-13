"""
tests/test_pipeline.py
Tests unitaires du pipeline BMAD — state, gates, tracker, codex_runner.
"""
from __future__ import annotations

import json
import os
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from pipeline.state import (
    GateRecord, GateStatus, Phase,
    initial_state, load_gate,
)
from pipeline.tracker import TrackerTool


# ── Fixtures ──────────────────────────────────────────────────────────────────

SAMPLE_TASKS = {
    "project": "Test Project",
    "updatedAt": "2025-03-14T10:00:00Z",
    "tasks": [
        {
            "id": "US-001",
            "title": "PRD",
            "description": "Test",
            "agent": "PO",
            "phase": "P1",
            "priority": "must",
            "status": "todo",
            "logs": [],
        },
        {
            "id": "US-008",
            "title": "API auth",
            "description": "JWT",
            "agent": "Backend",
            "phase": "P4",
            "priority": "must",
            "status": "todo",
            "logs": [],
        },
    ],
}


@pytest.fixture
def tasks_file(tmp_path: Path) -> Path:
    f = tmp_path / "tasks.json"
    f.write_text(json.dumps(SAMPLE_TASKS, indent=2), encoding="utf-8")
    return f


@pytest.fixture
def tracker(tasks_file: Path) -> TrackerTool:
    return TrackerTool(tasks_file=str(tasks_file))


# ── State tests ───────────────────────────────────────────────────────────────

class TestPipelineState:
    def test_initial_state_has_all_gates(self):
        state = initial_state("test", "/tmp", "/tmp/tasks.json", "/tmp/kit")
        assert "P1_TO_P2" in state["gates"]
        assert "P2_TO_P3" in state["gates"]
        assert "P3_TO_P4" in state["gates"]

    def test_initial_phase_is_p1(self):
        state = initial_state("brief", "/tmp", "/tmp/t.json", "/tmp/kit")
        assert state["current_phase"] == Phase.P1_ANALYSIS

    def test_initial_abort_is_false(self):
        state = initial_state("brief", "/tmp", "/tmp/t.json", "/tmp/kit")
        assert state["abort"] is False

    def test_load_gate(self):
        state = initial_state("brief", "/tmp", "/tmp/t.json", "/tmp/kit")
        gate  = load_gate(state, "P1_TO_P2")
        assert isinstance(gate, GateRecord)
        assert gate.status == GateStatus.PENDING


class TestGateRecord:
    def test_approve(self):
        gate = GateRecord(gate_id="TEST")
        gate.approve(by="human", notes="LGTM")
        assert gate.status     == GateStatus.APPROVED
        assert gate.decided_by == "human"
        assert gate.notes      == "LGTM"
        assert gate.decided_at is not None

    def test_reject(self):
        gate = GateRecord(gate_id="TEST")
        gate.reject(by="human", notes="Manque les ADRs")
        assert gate.status == GateStatus.REJECTED
        assert "ADRs"      in gate.notes

    def test_is_open_only_when_approved(self):
        gate = GateRecord(gate_id="TEST")
        assert not gate.is_open()
        gate.approve()
        assert gate.is_open()


# ── Tracker tool tests ────────────────────────────────────────────────────────

class TestTrackerTool:
    def test_read_all_tasks(self, tracker: TrackerTool):
        result = tracker._run("read_tasks")
        assert "US-001" in result
        assert "US-008" in result

    def test_read_filtered_by_agent(self, tracker: TrackerTool):
        result = tracker._run("read_tasks", filter_agent="PO")
        assert "US-001" in result
        assert "US-008" not in result

    def test_read_filtered_by_status(self, tracker: TrackerTool):
        result = tracker._run("read_tasks", filter_status="todo")
        assert "US-001" in result

    def test_update_status_valid(self, tracker: TrackerTool, tasks_file: Path):
        result = tracker._run("update_status",
                              task_id="US-001", status="inprogress", message="Démarrage")
        assert "inprogress" in result
        data = json.loads(tasks_file.read_text(encoding="utf-8"))
        task = next(t for t in data["tasks"] if t["id"] == "US-001")
        assert task["status"] == "inprogress"
        assert len(task["logs"]) == 1
        assert task["logs"][0]["msg"] == "Démarrage"

    def test_update_status_invalid(self, tracker: TrackerTool):
        result = tracker._run("update_status",
                              task_id="US-001", status="invalide", message="test")
        assert "invalide" in result.lower() or "invalid" in result.lower()

    def test_update_status_unknown_id(self, tracker: TrackerTool):
        result = tracker._run("update_status",
                              task_id="US-999", status="done", message="test")
        assert "introuvable" in result or "not found" in result.lower()

    def test_add_log(self, tracker: TrackerTool, tasks_file: Path):
        tracker._run("add_log", task_id="US-008", message="Premier log")
        tracker._run("add_log", task_id="US-008", message="Second log")
        data = json.loads(tasks_file.read_text())
        task = next(t for t in data["tasks"] if t["id"] == "US-008")
        assert len(task["logs"]) == 2
        assert task["logs"][1]["msg"] == "Second log"

    def test_log_has_iso_timestamp(self, tracker: TrackerTool, tasks_file: Path):
        tracker._run("add_log", task_id="US-001", message="Test ts")
        data = json.loads(tasks_file.read_text())
        task = next(t for t in data["tasks"] if t["id"] == "US-001")
        ts   = task["logs"][0]["ts"]
        datetime.fromisoformat(ts.replace("Z", "+00:00"))

    def test_unknown_action(self, tracker: TrackerTool):
        result = tracker._run("unknown_action")
        assert "inconnu" in result.lower() or "unknown" in result.lower()

    def test_tasks_json_stays_valid_after_multiple_writes(
        self, tracker: TrackerTool, tasks_file: Path
    ):
        for i in range(10):
            tracker._run("add_log", task_id="US-001", message=f"Log {i}")
        data = json.loads(tasks_file.read_text())
        assert len(data["tasks"]) == 2

    def test_updated_at_is_refreshed(self, tracker: TrackerTool, tasks_file: Path):
        import time
        original = json.loads(tasks_file.read_text())["updatedAt"]
        time.sleep(0.01)
        tracker._run("update_status", task_id="US-001", status="done", message="done")
        updated = json.loads(tasks_file.read_text())["updatedAt"]
        assert updated != original


# ── Codex runner tests (mocked — ne nécessite pas Codex CLI installé) ─────────

class TestCodexRunner:
    def test_build_prompt_includes_agent_md(self, tmp_path: Path, tasks_file: Path):
        """Le prompt doit contenir le contenu du fichier agent .md."""
        from pipeline.codex_runner import CodexRunner

        kit = tmp_path / ".bmad"
        agents_dir = kit / "agents"
        agents_dir.mkdir(parents=True)
        (agents_dir / "po-agent.md").write_text("# PO Agent\ntu es le PO", encoding="utf-8")
        (kit / "tracker-protocol.md").write_text("# Protocol\nrègle 1", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        prompt = runner._build_prompt("po", "Écris le PRD")
        assert "tu es le PO" in prompt
        assert "règle 1"    in prompt
        assert "Écris le PRD" in prompt

    def test_build_prompt_prefers_codex_native_skill_bundle(self, tmp_path: Path, tasks_file: Path):
        """Les agents non-PM doivent intégrer les skills/workflows natifs complets."""
        from pipeline.codex_runner import CodexRunner

        skill_dir = tmp_path / ".agents" / "skills" / "bmad-agent-architect"
        skill_dir.mkdir(parents=True)
        (skill_dir / "SKILL.md").write_text("# Winston\nNative Architect persona", encoding="utf-8")

        arch_dir = tmp_path / ".agents" / "skills" / "bmad-create-architecture"
        arch_dir.mkdir(parents=True)
        (arch_dir / "SKILL.md").write_text("# create-architecture\nUse workflow", encoding="utf-8")
        (arch_dir / "workflow.md").write_text("Step 1: define architecture", encoding="utf-8")

        bmad_cfg = tmp_path / "_bmad" / "bmm"
        bmad_cfg.mkdir(parents=True)
        (bmad_cfg / "config.yaml").write_text("project_name: demo", encoding="utf-8")

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "tracker-protocol.md").write_text("tracker from kit", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        prompt = runner._build_prompt("archi", "Créer l'architecture")
        assert "Native Architect persona" in prompt
        assert "Step 1: define architecture" in prompt
        assert "tracker from kit" in prompt

    def test_build_prompt_pm_uses_compact_pipeline_bundle(self, tmp_path: Path, tasks_file: Path):
        """Le PM pipeline doit charger un bundle compact sans workflow step-file complet."""
        from pipeline.codex_runner import CodexRunner

        pm_dir = tmp_path / ".agents" / "skills" / "bmad-agent-pm"
        pm_dir.mkdir(parents=True)
        (pm_dir / "SKILL.md").write_text("# John\nNative PM persona", encoding="utf-8")

        prd_dir = tmp_path / ".agents" / "skills" / "bmad-create-prd"
        prd_dir.mkdir(parents=True)
        (prd_dir / "SKILL.md").write_text("# create-prd\nUse workflow", encoding="utf-8")
        (prd_dir / "workflow.md").write_text("Step 1: gather requirements", encoding="utf-8")
        (prd_dir / "templates").mkdir(parents=True)
        (prd_dir / "templates" / "prd-template.md").write_text("# PRD template", encoding="utf-8")

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "tracker-protocol.md").write_text("tracker from kit", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        prompt = runner._build_prompt("pm", "Créer le PRD")
        assert "Native PM persona" in prompt
        assert "# PRD template" in prompt
        assert "Step 1: gather requirements" not in prompt
        assert "N'exécute PAS l'architecture step-file BMAD complète" in prompt
        assert "N'efface PAS, ne recrée PAS et ne réorganise PAS entièrement `tasks.json`" in prompt
        assert "Écrire `docs/prd.md` complètement avant toute réécriture structurelle du backlog" in prompt

    def test_build_prompt_uses_default_tracker_protocol_when_missing(self, tmp_path: Path, tasks_file: Path):
        """Sans tracker-protocol dédié, le fallback interne doit être injecté."""
        from pipeline.codex_runner import CodexRunner

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "agents" / "po-agent.md").write_text("po role", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        prompt = runner._build_prompt("po", "Écris le PRD")
        assert "mets à jour tasks.json" in prompt
        assert "Préserve un schéma stable" in prompt

    def test_build_prompt_includes_project_context(self, tmp_path: Path, tasks_file: Path):
        """Si PROJECT-CONTEXT.md existe, il doit apparaître dans le prompt."""
        from pipeline.codex_runner import CodexRunner

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "tracker-protocol.md").write_text("protocol", encoding="utf-8")

        docs = tmp_path / "docs"
        docs.mkdir()
        (docs / "PROJECT-CONTEXT.md").write_text("Phase courante : P2", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        prompt = runner._build_prompt("archi", "Fais l'archi")
        assert "Phase courante : P2" in prompt

    def test_run_agent_success(self, tmp_path: Path, tasks_file: Path):
        """Un subprocess qui se termine avec code 0 → (True, output)."""
        from pipeline.codex_runner import CodexRunner

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "tracker-protocol.md").write_text("", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        mock_result        = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout     = "PRD créé avec succès"
        mock_result.stderr     = ""

        with patch("subprocess.run", return_value=mock_result):
            ok, out = runner.run_agent("po", "Écris le PRD")

        assert ok  is True
        assert "PRD créé" in out

    def test_run_agent_failure(self, tmp_path: Path, tasks_file: Path):
        """Un subprocess qui retourne code != 0 → (False, stderr)."""
        from pipeline.codex_runner import CodexRunner

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "tracker-protocol.md").write_text("", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        mock_result            = MagicMock()
        mock_result.returncode = 1
        mock_result.stdout     = ""
        mock_result.stderr     = "auth error"

        with patch("subprocess.run", return_value=mock_result):
            ok, out = runner.run_agent("po", "Écris le PRD")

        assert ok  is False
        assert "auth error" in out

    def test_run_agent_timeout(self, tmp_path: Path, tasks_file: Path):
        """Un timeout → (False, message de timeout)."""
        import subprocess
        from pipeline.codex_runner import CodexRunner

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "tracker-protocol.md").write_text("", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        with patch("subprocess.run", side_effect=subprocess.TimeoutExpired("codex", 1)):
            ok, out = runner.run_agent("po", "Écris le PRD", timeout=1)

        assert ok  is False
        assert "timeout" in out.lower()

    def test_get_auth_info_api_key(self, tmp_path: Path, tasks_file: Path):
        """Avec une API Key dans l'env → détecte 'API Key'."""
        from pipeline.codex_runner import CodexRunner

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "tracker-protocol.md").write_text("", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        with patch.dict(os.environ, {"OPENAI_API_KEY": "sk-test"}):
            info = runner.get_auth_info()
        assert "API Key" in info

    def test_get_auth_info_oauth(self, tmp_path: Path, tasks_file: Path):
        """Sans API Key dans l'env → détecte Codex CLI local."""
        from pipeline.codex_runner import CodexRunner

        kit = tmp_path / ".bmad"
        (kit / "agents").mkdir(parents=True)
        (kit / "tracker-protocol.md").write_text("", encoding="utf-8")

        with patch("shutil.which", return_value="/usr/bin/codex"):
            runner = CodexRunner(str(kit), str(tmp_path), str(tasks_file))

        env_without_key = {k: v for k, v in os.environ.items() if k != "OPENAI_API_KEY"}
        with patch.dict(os.environ, env_without_key, clear=True):
            info = runner.get_auth_info()
        assert "Codex CLI" in info or "configuration locale" in info


class TestGraphPrompts:
    def test_phase1_sm_prompt_inventories_existing_repo_and_blocks_fake_backend(
        self, tmp_path: Path, tasks_file: Path
    ):
        from pipeline.graph import node_phase1_sm

        sm_agent = MagicMock()
        sm_agent.run.return_value = (True, "ok")
        state = initial_state("brief", str(tmp_path), str(tasks_file), str(tmp_path / "_bmad"))

        with patch("pipeline.graph._agents", return_value={"sm": sm_agent}):
            node_phase1_sm(state)

        prompt = sm_agent.run.call_args[0][0]
        assert "README.md" in prompt
        assert "plans/deck-plan.md" in prompt
        assert "src/lib/slides.config.ts" in prompt
        assert "slides déjà implémentées (aujourd'hui 1 à 6" in prompt
        assert "setup/foundation" in prompt
        assert "N'invente PAS de stories backend/auth/API/base de données" in prompt
        assert "Le backlog final doit représenter l'état réel du dépôt" in prompt

    def test_phase2_architect_prompt_is_deck_first_not_backend_first(
        self, tmp_path: Path, tasks_file: Path
    ):
        from pipeline.graph import node_phase2_architect

        archi_agent = MagicMock()
        archi_agent.run.return_value = (True, "ok")
        state = initial_state("brief", str(tmp_path), str(tasks_file), str(tmp_path / "_bmad"))

        with patch("pipeline.graph._agents", return_value={"archi": archi_agent}):
            node_phase2_architect(state)

        prompt = archi_agent.run.call_args[0][0]
        assert "plans/deck-plan.md" in prompt
        assert "shell de présentation" in prompt
        assert "fallback assets" in prompt
        assert "backend dédié, BDD, auth, session, API" in prompt

    def test_phase4_backend_prompt_noops_when_no_backend_story(self, tmp_path: Path, tasks_file: Path):
        from pipeline.graph import node_phase4_backend

        backend_agent = MagicMock()
        backend_agent.run.return_value = (True, "ok")
        state = initial_state("brief", str(tmp_path), str(tasks_file), str(tmp_path / "_bmad"))

        with patch("pipeline.graph._agents", return_value={"backend": backend_agent}):
            node_phase4_backend(state)

        prompt = backend_agent.run.call_args[0][0]
        assert "S'il n'y a aucune story @Backend prête pour ce sprint, n'invente rien" in prompt
        assert "N'introduis PAS de backend, API, auth, base de données ou persistance par défaut" in prompt
        assert "Implémente le backend complet" not in prompt

    def test_phase4_code_review_prompt_is_deck_specific(self, tmp_path: Path, tasks_file: Path):
        from pipeline.graph import node_phase4_code_review

        qa_agent = MagicMock()
        qa_agent.run.return_value = (True, "ok")
        state = initial_state("brief", str(tmp_path), str(tasks_file), str(tmp_path / "_bmad"))

        with patch("pipeline.graph._agents", return_value={"qa": qa_agent}):
            node_phase4_code_review(state)

        prompt = qa_agent.run.call_args[0][0]
        assert "architecture réelle du deck" in prompt
        assert "paramètres d'URL bornés" in prompt
        assert "JWT, bcrypt, rate limiting, CORS" not in prompt

    def test_phase4_devops_prompt_is_local_first_deck_delivery(self, tmp_path: Path, tasks_file: Path):
        from pipeline.graph import node_phase4_devops

        devops_agent = MagicMock()
        devops_agent.run.return_value = (True, "ok")
        state = initial_state("brief", str(tmp_path), str(tasks_file), str(tmp_path / "_bmad"))

        with patch("pipeline.graph._agents", return_value={"devops": devops_agent}):
            node_phase4_devops(state)

        prompt = devops_agent.run.call_args[0][0]
        assert "deck Next.js local-first" in prompt
        assert "aucun artefact Docker/backend superflu" in prompt
        assert "docker-compose.yml" not in prompt

    def test_phase4_sprint_prompt_handles_inprogress_prerequisites(self, tmp_path: Path, tasks_file: Path):
        from pipeline.graph import node_phase4_sprint_planning

        sm_agent = MagicMock()
        sm_agent.run.return_value = (True, "ok")
        state = initial_state("brief", str(tmp_path), str(tasks_file), str(tmp_path / "_bmad"))

        with patch("pipeline.graph._agents", return_value={"sm": sm_agent}):
            node_phase4_sprint_planning(state)

        prompt = sm_agent.run.call_args[0][0]
        assert "story déjà `inprogress` est un prérequis direct" in prompt
        assert "ne planifie jamais une story dépendante dans un sprint sans traiter explicitement son prérequis" in prompt


class TestCliDefaults:
    def test_default_project_root_uses_env_relative_to_pipeline_dir(self):
        from pipeline import cli

        with patch.dict(os.environ, {"PROJECT_ROOT": ".."}, clear=False):
            assert cli._default_project_root() == cli.PIPELINE_DIR.parent.resolve()

    def test_default_tasks_file_uses_env_relative_to_pipeline_dir(self):
        from pipeline import cli

        with patch.dict(os.environ, {"TASKS_FILE": "../bmad-tracker/tasks.json"}, clear=False):
            expected = (cli.PIPELINE_DIR.parent / "bmad-tracker" / "tasks.json").resolve()
            assert cli._default_tasks_file() == expected

    def test_default_bmad_kit_prefers_repo_bmad(self):
        from pipeline import cli

        with patch.dict(os.environ, {}, clear=True):
            assert cli._default_bmad_kit() == (cli.PIPELINE_DIR.parent / "_bmad").resolve()
