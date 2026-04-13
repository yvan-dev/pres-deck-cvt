"""
api/server.py
API REST FastAPI — contrôle du pipeline depuis le kanban ou un client externe.

Endpoints :
  POST /pipeline/start          Démarrer un nouveau pipeline
  GET  /pipeline/status         État courant du pipeline
  GET  /pipeline/log            Journal complet
  POST /gates/{gate_id}/approve Approuver un gate humain
  POST /gates/{gate_id}/reject  Refuser un gate humain
  GET  /gates/pending           Lister les gates en attente
  GET  /health                  Healthcheck
"""
from __future__ import annotations

import asyncio
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pipeline.gates import get_pending_gates, resolve_gate_from_api
from pipeline.graph import compile_pipeline
from pipeline.state import Phase, PipelineState, initial_state


# ── Shared state ──────────────────────────────────────────────────────────────

_pipeline_state:  PipelineState | None = None
_pipeline_task:   asyncio.Task | None  = None
_pipeline_status: str = "idle"   # idle | running | waiting_gate | done | failed


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="BMAD Pipeline API",
    version="1.0.0",
    description="Contrôle du pipeline agentique BMAD via REST",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restreindre en prod
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response models ─────────────────────────────────────────────────

class StartPipelineRequest(BaseModel):
    brief:        str
    project_root: str
    tasks_file:   str
    bmad_kit_path: str
    project_name: str = "Projet BMAD"
    auto_approve: bool = False


class GateDecisionRequest(BaseModel):
    notes: str = ""


class PipelineStatusResponse(BaseModel):
    status:        str
    current_phase: str | None
    phases_done:   list[str]
    pending_gates: list[str]
    agents_running: list[str]
    last_log:      str | None
    started_at:    str | None
    artifacts:     dict[str, str]
    errors:        list[str]


# ── Background pipeline runner ────────────────────────────────────────────────

async def _run_pipeline(request: StartPipelineRequest) -> None:
    global _pipeline_state, _pipeline_status

    if request.auto_approve:
        os.environ["BMAD_AUTO_APPROVE"] = "true"

    state = initial_state(
        brief=request.brief,
        project_root=request.project_root,
        tasks_file=request.tasks_file,
        bmad_kit_path=request.bmad_kit_path,
        project_name=request.project_name,
    )
    _pipeline_state  = state
    _pipeline_status = "running"

    pipeline = compile_pipeline()
    _started_at = datetime.now(timezone.utc).isoformat()

    try:
        async for chunk in pipeline.astream(state):
            # Mettre à jour l'état partagé à chaque étape
            for node_name, node_state in chunk.items():
                if isinstance(node_state, dict):
                    _pipeline_state = {**_pipeline_state, **node_state}

            pending = get_pending_gates()
            _pipeline_status = "waiting_gate" if pending else "running"

        _pipeline_status = "failed" if _pipeline_state.get("abort") else "done"

    except Exception as e:
        _pipeline_status = "failed"
        if _pipeline_state:
            _pipeline_state["errors"] = _pipeline_state.get("errors", []) + [str(e)]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "ts": datetime.now(timezone.utc).isoformat()}


@app.post("/pipeline/start", status_code=202)
async def start_pipeline(
    request: StartPipelineRequest,
    background_tasks: BackgroundTasks,
):
    global _pipeline_task, _pipeline_status

    if _pipeline_status == "running":
        raise HTTPException(409, "Un pipeline est déjà en cours d'exécution.")

    _pipeline_status = "running"
    background_tasks.add_task(_run_pipeline, request)

    return {
        "message": "Pipeline démarré",
        "project": request.project_name,
        "started_at": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/pipeline/status", response_model=PipelineStatusResponse)
async def pipeline_status():
    state = _pipeline_state
    log   = state["pipeline_log"] if state else []

    return PipelineStatusResponse(
        status=_pipeline_status,
        current_phase=state["current_phase"] if state else None,
        phases_done=[p for p in (state.get("phases_done") or [])],
        pending_gates=get_pending_gates(),
        agents_running=[
            r["agent_name"]
            for r in (state.get("agent_runs") or [])
            if r.get("status") == "running"
        ],
        last_log=log[-1] if log else None,
        started_at=log[0] if log else None,
        artifacts=state.get("artifacts", {}) if state else {},
        errors=state.get("errors", []) if state else [],
    )


@app.get("/pipeline/log")
async def pipeline_log():
    if not _pipeline_state:
        return {"log": []}
    return {"log": _pipeline_state.get("pipeline_log", [])}


@app.get("/gates/pending")
async def pending_gates():
    return {"pending": get_pending_gates()}


@app.post("/gates/{gate_id}/approve", status_code=200)
async def approve_gate(gate_id: str, body: GateDecisionRequest):
    ok = resolve_gate_from_api(gate_id, approved=True, notes=body.notes)
    if not ok:
        raise HTTPException(
            404,
            f"Gate '{gate_id}' introuvable ou non en attente. "
            f"Gates en attente : {get_pending_gates()}",
        )
    return {
        "gate_id": gate_id,
        "decision": "approved",
        "notes": body.notes,
        "ts": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/gates/{gate_id}/reject", status_code=200)
async def reject_gate(gate_id: str, body: GateDecisionRequest):
    ok = resolve_gate_from_api(gate_id, approved=False, notes=body.notes)
    if not ok:
        raise HTTPException(
            404,
            f"Gate '{gate_id}' introuvable ou non en attente.",
        )
    return {
        "gate_id": gate_id,
        "decision": "rejected",
        "notes": body.notes,
        "ts": datetime.now(timezone.utc).isoformat(),
    }
