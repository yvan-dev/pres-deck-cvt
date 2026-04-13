"""
pipeline/tracker.py
Outil historique de gestion de tasks.json.
Conservé pour compatibilité de tests et usages de référence ; non branché au graphe LangGraph actuel.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Type

from pydantic import BaseModel, Field

try:
    from crewai.tools import BaseTool
except ModuleNotFoundError:
    class BaseTool(BaseModel):
        """Fallback minimal pour les environnements sans CrewAI."""
        pass


# ── Input schemas ─────────────────────────────────────────────────────────────

class UpdateStatusInput(BaseModel):
    task_id: str   = Field(..., description="ID du ticket (ex: 'US-008')")
    status:  str   = Field(..., description="Nouveau statut : backlog|ready-for-dev|inprogress|review|done")
    message: str   = Field(..., description="Message de log décrivant ce qui a été fait")


class AddLogInput(BaseModel):
    task_id: str   = Field(..., description="ID du ticket (ex: 'US-008')")
    message: str   = Field(..., description="Message de log à ajouter")


class ReadTasksInput(BaseModel):
    filter_agent: str | None = Field(
        None,
        description="Filtrer par agent (ex: 'Backend'). Laisser vide pour tout voir."
    )
    filter_status: str | None = Field(
        None,
        description="Filtrer par statut (ex: 'inprogress'). Laisser vide pour tout voir."
    )


# ── Tracker tool ──────────────────────────────────────────────────────────────

class TrackerTool(BaseTool):
    """
    Outil de gestion du tracker BMAD (tasks.json).
    Permet aux agents de lire l'état des tickets et de les mettre à jour.
    """
    name: str = "BMAD Tracker"
    description: str = (
        "Gère les tickets du projet dans tasks.json. "
        "Actions disponibles : read_tasks, update_status, add_log. "
        "Utiliser pour synchroniser le kanban après chaque action significative."
    )
    tasks_file: str

    def _run(self, action: str, **kwargs: Any) -> str:
        """
        action : 'read_tasks' | 'update_status' | 'add_log'
        """
        dispatch = {
            "read_tasks":    self._read_tasks,
            "update_status": self._update_status,
            "add_log":       self._add_log,
        }
        fn = dispatch.get(action)
        if not fn:
            return f"Action inconnue: '{action}'. Utiliser: {list(dispatch.keys())}"
        return fn(**kwargs)

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _load(self) -> dict:
        return json.loads(Path(self.tasks_file).read_text(encoding="utf-8"))

    def _save(self, data: dict) -> None:
        data["updatedAt"] = datetime.now(timezone.utc).isoformat()
        Path(self.tasks_file).write_text(
            json.dumps(data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    def _find_task(self, data: dict, task_id: str) -> dict | None:
        return next((t for t in data["tasks"] if t["id"] == task_id), None)

    # ── Actions ───────────────────────────────────────────────────────────────

    def _read_tasks(
        self,
        filter_agent: str | None = None,
        filter_status: str | None = None,
    ) -> str:
        data = self._load()
        tasks = data["tasks"]
        if filter_agent:
            tasks = [t for t in tasks if t.get("agent") == filter_agent]
        if filter_status:
            tasks = [t for t in tasks if t.get("status") == filter_status]

        summary = [
            f"Projet : {data['project']} | Dernière màj : {data['updatedAt']}",
            f"Tickets ({len(tasks)}) :",
        ]
        for t in tasks:
            logs_count = len(t.get("logs", []))
            last_log   = t["logs"][-1]["msg"] if t.get("logs") else "—"
            summary.append(
                f"  [{t['status']:12}] {t['id']} | @{t['agent']:8} | {t['phase']} "
                f"| {t['priority']:6} | {t['title']} "
                f"({logs_count} log(s), dernier: {last_log[:60]})"
            )
        return "\n".join(summary)

    def _update_status(self, task_id: str, status: str, message: str) -> str:
        VALID = {"backlog", "ready-for-dev", "inprogress", "review", "done"}
        if status not in VALID:
            return f"Statut invalide: '{status}'. Valeurs: {VALID}"

        data = self._load()
        task = self._find_task(data, task_id)
        if not task:
            ids = [t["id"] for t in data["tasks"]]
            return f"Ticket '{task_id}' introuvable. IDs: {ids}"

        prev_status  = task["status"]
        task["status"] = status
        task.setdefault("logs", []).append({
            "ts":  datetime.now(timezone.utc).isoformat(),
            "msg": message,
        })
        self._save(data)
        return (
            f"✓ {task_id} : {prev_status} → {status}\n"
            f"  Log : {message}"
        )

    def _add_log(self, task_id: str, message: str) -> str:
        data = self._load()
        task = self._find_task(data, task_id)
        if not task:
            return f"Ticket '{task_id}' introuvable."

        task.setdefault("logs", []).append({
            "ts":  datetime.now(timezone.utc).isoformat(),
            "msg": message,
        })
        self._save(data)
        return f"✓ Log ajouté à {task_id} : {message}"
