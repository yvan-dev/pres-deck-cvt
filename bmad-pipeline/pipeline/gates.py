"""
pipeline/gates.py
Gestion des gates humains — points de pause dans le pipeline
où une validation manuelle est requise avant de continuer.

Trois modes de validation :
1. CLI interactif (terminal)
2. API REST (depuis le kanban ou un client externe)
3. Auto-approve (tests / mode headless)
"""
from __future__ import annotations

import asyncio
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.prompt import Confirm, Prompt

from .state import GateRecord, GateStatus, PipelineState, load_gate

console = Console()

# Registry partagé : gate_id → asyncio.Event (set quand approuvé/rejeté)
# Utilisé par l'API REST pour débloquer un gate en attente
_gate_events: dict[str, asyncio.Event] = {}
_gate_decisions: dict[str, tuple[bool, str]] = {}  # gate_id → (approved, notes)


# ── Public API ────────────────────────────────────────────────────────────────

async def wait_for_human_gate(
    gate_id: str,
    state: PipelineState,
    checklist_items: list[str],
    artifacts_to_show: list[str] | None = None,
    auto_approve: bool = False,
) -> tuple[bool, str]:
    """
    Met le pipeline en pause et attend une validation humaine.
    Retourne (approved: bool, notes: str).

    Si auto_approve=True (CI/CD headless), approuve automatiquement.
    """
    gate = load_gate(state, gate_id)
    gate.status       = GateStatus.WAITING
    gate.requested_at = datetime.now(timezone.utc)
    gate.checklist    = {item: False for item in checklist_items}

    if auto_approve:
        gate.approve(by="auto", notes="Auto-approuvé (mode headless)")
        console.print(f"[dim]Gate {gate_id} auto-approuvé[/dim]")
        return True, "auto"

    # Afficher le résumé dans le terminal
    _display_gate_summary(gate_id, state, checklist_items, artifacts_to_show)

    # Enregistrer l'event pour l'API REST
    event = asyncio.Event()
    _gate_events[gate_id]   = event
    _gate_decisions[gate_id] = (False, "")

    timeout = int(os.getenv("HUMAN_GATE_TIMEOUT", "3600"))

    console.print(
        f"\n[yellow]Gate [bold]{gate_id}[/bold] en attente de validation.[/yellow]\n"
        f"  • Valider via CLI : répondre ci-dessous\n"
        f"  • Valider via API : [cyan]POST http://localhost:{os.getenv('API_PORT', 8000)}"
        f"/gates/{gate_id}/approve[/cyan]\n"
        f"  • Timeout : {timeout}s\n"
    )

    # Mode CLI : demander directement dans le terminal
    # (non-bloquant si l'API est utilisée — l'event sera set par l'API)
    cli_task  = asyncio.create_task(_cli_gate_input(gate_id))
    api_task  = asyncio.create_task(_wait_for_api_decision(gate_id))

    try:
        done, pending = await asyncio.wait(
            {cli_task, api_task},
            timeout=timeout,
            return_when=asyncio.FIRST_COMPLETED,
        )
        for t in pending:
            t.cancel()

        if not done:
            console.print(f"[red]Gate {gate_id} : timeout atteint — pipeline bloqué.[/red]")
            return False, "timeout"

    except asyncio.CancelledError:
        return False, "cancelled"

    approved, notes = _gate_decisions.get(gate_id, (False, ""))
    _gate_events.pop(gate_id, None)
    _gate_decisions.pop(gate_id, None)

    if approved:
        console.print(f"\n[green]✓ Gate {gate_id} approuvé — pipeline continue.[/green]\n")
    else:
        console.print(f"\n[red]✗ Gate {gate_id} refusé : {notes}[/red]\n")

    return approved, notes


def resolve_gate_from_api(gate_id: str, approved: bool, notes: str = "") -> bool:
    """
    Appelé par l'API REST pour débloquer un gate en attente.
    Retourne False si le gate n'est pas en attente.
    """
    if gate_id not in _gate_events:
        return False
    _gate_decisions[gate_id] = (approved, notes)
    _gate_events[gate_id].set()
    return True


def get_pending_gates() -> list[str]:
    """Retourne les IDs des gates actuellement en attente."""
    return list(_gate_events.keys())


# ── Internals ─────────────────────────────────────────────────────────────────

async def _cli_gate_input(gate_id: str) -> None:
    """Lit l'input CLI de manière asynchrone."""
    loop = asyncio.get_event_loop()
    approved = await loop.run_in_executor(
        None,
        lambda: Confirm.ask(f"  Approuver le gate [bold]{gate_id}[/bold] ?", default=True),
    )
    notes = ""
    if not approved:
        notes = await loop.run_in_executor(
            None,
            lambda: Prompt.ask("  Raison du refus"),
        )
    _gate_decisions[gate_id] = (approved, notes)
    if gate_id in _gate_events:
        _gate_events[gate_id].set()


async def _wait_for_api_decision(gate_id: str) -> None:
    """Attend qu'une décision arrive via l'API REST."""
    while gate_id in _gate_events:
        if _gate_events[gate_id].is_set():
            return
        await asyncio.sleep(0.5)


def _display_gate_summary(
    gate_id: str,
    state: PipelineState,
    checklist_items: list[str],
    artifacts: list[str] | None,
) -> None:
    table = Table(title=f"Gate {gate_id} — Checklist", show_header=True, header_style="bold")
    table.add_column("Item", style="dim", width=60)
    table.add_column("Fichier attendu", width=40)

    for item in checklist_items:
        # Vérifier si l'artefact existe
        project_root = state.get("project_root", ".")
        exists = any(
            (Path(project_root) / p).exists()
            for p in (artifacts or [])
            if p in item.lower()
        )
        status = "[green]✓[/green]" if exists else "[yellow]?[/yellow]"
        table.add_row(f"{status} {item}", "")

    console.print(Panel(table, border_style="yellow"))

    if artifacts:
        console.print("[dim]Artefacts à valider :[/dim]")
        for a in artifacts:
            path = Path(state.get("project_root", ".")) / a
            icon = "✓" if path.exists() else "✗"
            color = "green" if path.exists() else "red"
            console.print(f"  [{color}]{icon}[/{color}] {a}")
