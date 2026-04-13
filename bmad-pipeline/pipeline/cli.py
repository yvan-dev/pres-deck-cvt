"""
pipeline/cli.py
Interface CLI du pipeline BMAD — Typer + Rich.

Commandes :
  bmad run       Démarrer le pipeline interactivement
  bmad status    Afficher l'état courant (via API)
  bmad gate      Approuver/refuser un gate (via API)
  bmad log       Afficher le journal du pipeline
  bmad serve     Démarrer l'API REST
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path

# Force UTF-8 on Windows to handle Unicode characters (✓, ✗, arrows, etc.)
if sys.platform == "win32":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import httpx
import typer
import uvicorn
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

PIPELINE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = PIPELINE_DIR / ".env"
load_dotenv(ENV_FILE if ENV_FILE.exists() else None)

app     = typer.Typer(name="bmad", help="BMAD Pipeline — orchestrateur agentique")
console = Console()

API_BASE = f"http://localhost:{os.getenv('API_PORT', 8000)}"


# ── Helpers ───────────────────────────────────────────────────────────────────

def _api(method: str, path: str, **kwargs) -> dict:
    try:
        r = httpx.request(method, f"{API_BASE}{path}", timeout=10, **kwargs)
        r.raise_for_status()
        return r.json()
    except httpx.ConnectError:
        console.print("[red]API non joignable. Lance d'abord : bmad serve[/red]")
        raise typer.Exit(1)
    except httpx.HTTPStatusError as e:
        console.print(f"[red]Erreur API {e.response.status_code}: {e.response.text}[/red]")
        raise typer.Exit(1)


def _resolve_from_pipeline_dir(raw_path: str) -> Path:
    path = Path(raw_path)
    if not path.is_absolute():
        path = PIPELINE_DIR / path
    return path.resolve()


def _default_project_root() -> Path:
    configured = os.getenv("PROJECT_ROOT")
    if configured:
        return _resolve_from_pipeline_dir(configured)

    repo_root = PIPELINE_DIR.parent
    if (repo_root / "bmad-tracker" / "tasks.json").exists():
        return repo_root.resolve()

    return Path.cwd().resolve()


def _default_tasks_file() -> Path:
    configured = os.getenv("TASKS_FILE")
    if configured:
        return _resolve_from_pipeline_dir(configured)
    return _resolve_from_pipeline_dir("../bmad-tracker/tasks.json")


def _default_bmad_kit() -> Path:
    configured = os.getenv("BMAD_KIT_PATH")
    if configured:
        return _resolve_from_pipeline_dir(configured)

    repo_bmad = PIPELINE_DIR.parent / "_bmad"
    if repo_bmad.exists():
        return repo_bmad.resolve()

    return _resolve_from_pipeline_dir("../_bmad")


# ── Commands ──────────────────────────────────────────────────────────────────

@app.command()
def run(
    brief_file: Path = typer.Option(
        None, "--brief", "-b",
        help="Fichier texte contenant le brief projet",
    ),
    project_root: Path = typer.Option(
        None, "--project", "-p",
        help="Racine du projet cible",
    ),
    tasks_file: Path = typer.Option(
        None, "--tasks", "-t",
        help="Chemin vers tasks.json",
    ),
    bmad_kit: Path = typer.Option(
        None, "--kit", "-k",
        help="Chemin vers le kit BMAD (.bmad/)",
    ),
    auto_approve: bool = typer.Option(
        False, "--auto-approve",
        help="Approuver tous les gates automatiquement (CI/CD)",
    ),
    headless: bool = typer.Option(
        False, "--headless",
        help="Démarrer via l'API (non interactif)",
    ),
):
    """Démarrer le pipeline BMAD complet."""
    # Résoudre les chemins
    project_root = (project_root or _default_project_root()).resolve()
    tasks = (tasks_file or _default_tasks_file()).resolve()
    kit = (bmad_kit or _default_bmad_kit()).resolve()

    if not tasks.exists():
        console.print(f"[red]tasks.json introuvable : {tasks}[/red]")
        raise typer.Exit(1)

    # Lire le brief
    if brief_file and brief_file.exists():
        brief = brief_file.read_text(encoding="utf-8")
    else:
        console.print("[yellow]Pas de fichier brief fourni — saisie interactive.[/yellow]")
        brief = typer.edit("# Décris ton projet ici\n\n")
        if not brief or brief.strip() == "# Décris ton projet ici":
            console.print("[red]Brief vide — abandon.[/red]")
            raise typer.Exit(1)

    project_name = project_root.name if headless else typer.prompt("Nom du projet", default=project_root.name)

    if headless:
        # Déléguer à l'API
        data = _api("POST", "/pipeline/start", json={
            "brief": brief,
            "project_root": str(project_root.resolve()),
            "tasks_file": str(tasks.resolve()),
            "bmad_kit_path": str(kit.resolve()),
            "project_name": project_name,
            "auto_approve": auto_approve,
        })
        console.print(Panel(
            f"[green]Pipeline démarré[/green]\n"
            f"Projet : {project_name}\n"
            f"Statut : {data['started_at']}",
            title="BMAD Pipeline",
        ))
        return

    # Mode interactif — lancer directement
    from pipeline.graph import compile_pipeline
    from pipeline.state import initial_state

    if auto_approve:
        os.environ["BMAD_AUTO_APPROVE"] = "true"

    state    = initial_state(
        brief=brief,
        project_root=str(project_root.resolve()),
        tasks_file=str(tasks.resolve()),
        bmad_kit_path=str(kit.resolve()),
        project_name=project_name,
    )
    pipeline = compile_pipeline()

    # Vérifier l'auth Codex CLI avant de lancer
    from pipeline.codex_runner import CodexRunner
    try:
        runner    = CodexRunner(str(kit.resolve()), str(project_root.resolve()), str(tasks.resolve()))
        auth_info = runner.get_auth_info()
        if not runner.check_auth():
            console.print("[red]Codex CLI n'est pas disponible ou pas correctement configuré.[/red]")
            console.print("Lance : [bold]codex login[/bold]")
            raise typer.Exit(1)
    except RuntimeError as e:
        console.print(f"[red]{e}[/red]")
        raise typer.Exit(1)

    console.print(Panel(
        f"[bold]BMAD Pipeline[/bold] — {project_name}\n"
        f"Auth         : [green]{auth_info}[/green]\n"
        f"Project root : {project_root.resolve()}\n"
        f"Tasks file   : {tasks.resolve()}\n"
        f"BMAD kit     : {kit.resolve()}",
        border_style="cyan",
    ))

    async def _run():
        import uvicorn
        import api.server as srv
        from pipeline.gates import get_pending_gates

        # ── Démarrer l'API REST en arrière-plan dans le même process ──────────
        # Partage le même module pipeline.gates → _gate_events visible du Kanban
        api_port = int(os.getenv("API_PORT", "8000"))
        uvicorn_config = uvicorn.Config(
            srv.app,
            host=os.getenv("API_HOST", "0.0.0.0"),
            port=api_port,
            log_level="warning",
        )
        server     = uvicorn.Server(uvicorn_config)
        api_task   = asyncio.create_task(server.serve())
        await asyncio.sleep(0.3)   # laisser le temps au serveur de bind le port

        console.print(f"[dim]API REST démarrée → http://localhost:{api_port}[/dim]")

        # Synchroniser l'état initial avec l'API
        srv._pipeline_state  = state
        srv._pipeline_status = "running"

        try:
            async for chunk in pipeline.astream(state):
                # Propager chaque mise à jour de node vers l'état API
                for node_state in chunk.values():
                    if isinstance(node_state, dict):
                        srv._pipeline_state = {**(srv._pipeline_state or {}), **node_state}
                pending = get_pending_gates()
                srv._pipeline_status = "waiting_gate" if pending else "running"

            srv._pipeline_status = "failed" if srv._pipeline_state.get("abort") else "done"

        finally:
            server.should_exit = True
            try:
                await asyncio.wait_for(api_task, timeout=3)
            except (asyncio.TimeoutError, asyncio.CancelledError):
                pass

    asyncio.run(_run())


@app.command(name="check-auth")
def check_auth(
    kit: Path = typer.Option(None, "--kit", "-k", help="Chemin vers le kit BMAD"),
    project_root: Path = typer.Option(None, "--project", "-p"),
):
    """Vérifier que Codex CLI est installé et afficher le type d'auth."""
    from pipeline.codex_runner import CodexRunner
    project = (project_root or _default_project_root()).resolve()
    kit_path = (kit or _default_bmad_kit()).resolve()
    try:
        runner = CodexRunner(str(kit_path), str(project), "/dev/null")
    except RuntimeError as e:
        console.print(f"[red]{e}[/red]")
        console.print("\nInstalle Codex CLI : [bold]npm install -g @openai/codex[/bold]")
        raise typer.Exit(1)

    ok       = runner.check_auth()
    auth_str = runner.get_auth_info()
    icon     = "✓" if ok else "✗"
    color    = "green" if ok else "red"

    table = Table(show_header=False, box=None)
    table.add_column(style="dim", width=22)
    table.add_column()
    table.add_row("Codex CLI",   f"[{color}]{icon} {runner._codex_bin}[/{color}]")
    table.add_row("Auth détectée", f"[{color}]{auth_str}[/{color}]")
    table.add_row("Statut",        f"[{color}]{'Prêt' if ok else 'Non authentifié'}[/{color}]")

    console.print(Panel(table, title="Auth Codex CLI", border_style=color))

    if not ok:
        console.print("\n[yellow]Pour te connecter avec ton compte ChatGPT :[/yellow]")
        console.print("  [bold]codex login[/bold]")
        console.print("\n[yellow]Ou avec une API Key OpenAI :[/yellow]")
        console.print("  set OPENAI_API_KEY=sk-...")
        raise typer.Exit(1)


@app.command()
def status():
    """Afficher l'état courant du pipeline."""
    data = _api("GET", "/pipeline/status")

    color = {
        "idle": "dim", "running": "cyan",
        "waiting_gate": "yellow", "done": "green", "failed": "red",
    }.get(data["status"], "white")

    table = Table(show_header=False, box=None)
    table.add_column(style="dim", width=20)
    table.add_column()

    table.add_row("Statut",        f"[{color}]{data['status']}[/{color}]")
    table.add_row("Phase courante", data.get("current_phase") or "—")
    table.add_row("Phases done",   ", ".join(data.get("phases_done") or []) or "—")
    table.add_row("Artefacts",     ", ".join(data.get("artifacts", {}).keys()) or "—")

    pending = data.get("pending_gates", [])
    if pending:
        table.add_row(
            "Gates en attente",
            f"[yellow bold]{', '.join(pending)}[/yellow bold]",
        )

    errors = data.get("errors", [])
    if errors:
        table.add_row("Erreurs", f"[red]{errors[-1]}[/red]")

    if data.get("last_log"):
        table.add_row("Dernier log", Text(data["last_log"][:80], style="dim"))

    console.print(Panel(table, title="BMAD Pipeline — Status", border_style=color))


@app.command()
def gate(
    gate_id: str = typer.Argument(..., help="ID du gate (ex: P1_TO_P2)"),
    approve: bool = typer.Option(True, "--approve/--reject", help="Approuver ou refuser"),
    notes: str = typer.Option("", "--notes", "-n", help="Notes optionnelles"),
):
    """Approuver ou refuser un gate humain."""
    action = "approve" if approve else "reject"
    data = _api("POST", f"/gates/{gate_id}/{action}", json={"notes": notes})
    icon = "✓" if approve else "✗"
    color = "green" if approve else "red"
    console.print(
        f"[{color}]{icon} Gate {gate_id} {data['decision']}"
        f"{f' — {notes}' if notes else ''}[/{color}]"
    )


@app.command()
def log(
    tail: int = typer.Option(20, "--tail", "-n", help="Nombre de lignes à afficher"),
):
    """Afficher le journal du pipeline."""
    data = _api("GET", "/pipeline/log")
    entries = data.get("log", [])[-tail:]
    for entry in entries:
        console.print(f"[dim]{entry}[/dim]")


@app.command()
def serve(
    host: str = typer.Option(os.getenv("API_HOST", "0.0.0.0"), "--host"),
    port: int = typer.Option(int(os.getenv("API_PORT", "8000")), "--port"),
    reload: bool = typer.Option(False, "--reload"),
):
    """Démarrer l'API REST du pipeline."""
    console.print(f"[cyan]API BMAD Pipeline → http://{host}:{port}[/cyan]")
    console.print(f"  Docs : http://localhost:{port}/docs\n")
    uvicorn.run("api.server:app", host=host, port=port, reload=reload)


if __name__ == "__main__":
    app()
