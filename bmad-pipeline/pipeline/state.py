"""
pipeline/state.py
État partagé du pipeline BMAD — LangGraph TypedDict
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Annotated, Any

from pydantic import BaseModel, Field
from typing_extensions import TypedDict


# ── Enums ────────────────────────────────────────────────────────────────────

class Phase(str, Enum):
    P1_ANALYSIS       = "P1"   # Phase 1 — Analyse
    P2_PLANNING       = "P2"   # Phase 2 — Planification
    P3_SOLUTIONING    = "P3"   # Phase 3 — Solutionnement
    P4_IMPLEMENTATION = "P4"   # Phase 4 — Implémentation
    DONE              = "DONE"
    FAILED            = "FAILED"


class GateStatus(str, Enum):
    PENDING  = "pending"   # Gate pas encore atteint
    WAITING  = "waiting"   # En attente de validation humaine
    APPROVED = "approved"  # Validé → pipeline continue
    REJECTED = "rejected"  # Refusé → pipeline bloque


class AgentStatus(str, Enum):
    IDLE       = "idle"
    RUNNING    = "running"
    DONE       = "done"
    FAILED     = "failed"


# ── Gate record ───────────────────────────────────────────────────────────────

class GateRecord(BaseModel):
    gate_id: str                        # ex: "P1_TO_P2"
    status: GateStatus = GateStatus.PENDING
    requested_at: datetime | None = None
    decided_at:   datetime | None = None
    decided_by:   str | None = None     # "human" | "auto"
    notes:        str = ""
    checklist:    dict[str, bool] = Field(default_factory=dict)

    def is_open(self) -> bool:
        return self.status == GateStatus.APPROVED

    def approve(self, by: str = "human", notes: str = "") -> None:
        self.status     = GateStatus.APPROVED
        self.decided_at = datetime.now(timezone.utc)
        self.decided_by = by
        self.notes      = notes

    def reject(self, by: str = "human", notes: str = "") -> None:
        self.status     = GateStatus.REJECTED
        self.decided_at = datetime.now(timezone.utc)
        self.decided_by = by
        self.notes      = notes


# ── Agent run record ──────────────────────────────────────────────────────────

class AgentRun(BaseModel):
    agent_name:  str
    phase:       Phase
    status:      AgentStatus = AgentStatus.IDLE
    started_at:  datetime | None = None
    finished_at: datetime | None = None
    output:      str = ""
    error:       str = ""
    artifacts:   list[str] = Field(default_factory=list)   # chemins produits

    @property
    def duration_s(self) -> float | None:
        if self.started_at and self.finished_at:
            return (self.finished_at - self.started_at).total_seconds()
        return None


# ── LangGraph state ───────────────────────────────────────────────────────────

def _merge_dict(a: dict, b: dict) -> dict:
    """Reducer : merge dicts, b wins on conflict."""
    return {**a, **b}

def _append_list(a: list, b: list) -> list:
    """Reducer : append lists."""
    return a + b


class PipelineState(TypedDict):
    # ── Projet ────────────────────────────────────────────────────────────────
    project_name:  str
    project_root:  str
    tasks_file:    str
    bmad_kit_path: str
    brief:         str

    # ── Progression ───────────────────────────────────────────────────────────
    current_phase: Phase
    phases_done:   Annotated[list[Phase], _append_list]

    # ── Gates humains (dict gate_id → GateRecord sérialisé) ──────────────────
    gates: Annotated[dict[str, Any], _merge_dict]

    # ── Runs des agents ───────────────────────────────────────────────────────
    agent_runs: Annotated[list[Any], _append_list]

    # ── Artefacts produits ────────────────────────────────────────────────────
    artifacts: Annotated[dict[str, str], _merge_dict]   # nom → chemin

    # ── Erreurs et logs ───────────────────────────────────────────────────────
    errors:   Annotated[list[str], _append_list]
    pipeline_log: Annotated[list[str], _append_list]

    # ── Sprints ──────────────────────────────────────────────────────────────
    current_sprint: int

    # ── Contrôle ──────────────────────────────────────────────────────────────
    abort: bool


# ── Helpers ───────────────────────────────────────────────────────────────────

def initial_state(
    brief: str,
    project_root: str,
    tasks_file: str,
    bmad_kit_path: str,
    project_name: str = "Projet BMAD",
) -> PipelineState:
    gates = {
        "P1_TO_P2": GateRecord(gate_id="P1_TO_P2").model_dump(),
        "P2_TO_P3": GateRecord(gate_id="P2_TO_P3").model_dump(),
        "P3_TO_P4": GateRecord(gate_id="P3_TO_P4").model_dump(),
    }
    return PipelineState(
        project_name=project_name,
        project_root=project_root,
        tasks_file=tasks_file,
        bmad_kit_path=bmad_kit_path,
        brief=brief,
        current_phase=Phase.P1_ANALYSIS,
        phases_done=[],
        gates=gates,
        agent_runs=[],
        artifacts={},
        errors=[],
        pipeline_log=[f"[{datetime.now(timezone.utc).isoformat()}] Pipeline initialisé"],
        current_sprint=1,
        abort=False,
    )


def load_gate(state: PipelineState, gate_id: str) -> GateRecord:
    if gate_id in state["gates"]:
        return GateRecord(**state["gates"][gate_id])
    return GateRecord(gate_id=gate_id)


def get_artifact(state: PipelineState, name: str) -> str | None:
    return state["artifacts"].get(name)
