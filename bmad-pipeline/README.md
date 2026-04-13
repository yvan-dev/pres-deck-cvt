# BMAD Pipeline — LangGraph + Codex CLI

Orchestrateur agentique du workflow BMAD.
**Codex CLI** est le moteur d'exécution de chaque agent — via login ChatGPT ou API key OpenAI.

## Architecture

```
bmad-pipeline/
├── pipeline/
│   ├── graph.py          ← Graphe LangGraph (topologie, parallélisme, gates)
│   ├── agents.py         ← 8 AgentRunner (wrappent CodexRunner)
│   ├── codex_runner.py   ← Moteur : subprocess `codex exec` par agent
│   ├── gates.py          ← Human-in-the-loop (CLI + API REST asyncio)
│   ├── tracker.py        ← Outil → lit/écrit tasks.json
│   ├── state.py          ← TypedDict LangGraph + modèles Pydantic
│   └── cli.py            ← Interface CLI (Typer + Rich)
├── api/
│   └── server.py         ← API REST FastAPI
├── tests/
│   └── test_pipeline.py  ← Tests unitaires (state, gates, tracker, runner mocked)
├── pyproject.toml
└── .env.example
```

## Topologie du graphe

```
START
  ↓
[P1a] PM — PRD + epics
  ↓
[P1b] SM — Stories + tickets (tasks.json)
  ↓
⏸ GATE P1→P2  ← validation humaine
  ↓
[P2] Architecte — Architecture + ADRs
  ↓
⏸ GATE P2→P3  ← validation humaine
  ↓
[P3a] UX Expert  ──┐  parallèle
[P3b] Sécurité   ──┤
                     ↓
[P3c] IR Check — Readiness d'implémentation
  ↓
⏸ GATE P3→P4  ← validation humaine
  ↓
[P4a] Sprint Planning (SM)
  ↓
[P4b] Backend   ──┐  parallèle (Codex CLI × 2 simultanés)
[P4c] Frontend  ──┤
                  ↓ sync
[P4d] Code Review
  ↓
[P4e] QA        ──┐  parallèle
[P4f] Sécu Audit──┤
                  ↓ sync
[P4g] DevOps
  ↓
END
```

## Installation

```bash
cd bmad-pipeline
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
```

## Auth — Codex CLI

```bash
# 1. Installer Codex CLI (une seule fois)
npm install -g @openai/codex

# 2. Se connecter avec son compte ChatGPT
codex login

# 3. Vérifier que le pipeline détecte bien l'auth
bmad check-auth
```

Alternative : définir `OPENAI_API_KEY` dans `.env` ou l'environnement shell.

## Utilisation

### Mode interactif (abonnement Pro/Max)

```bash
# Vérifier l'auth d'abord
bmad check-auth

# Démarrer le pipeline
bmad run --brief brief.txt

# Variante explicite
bmad run --brief brief.txt --project .. --tasks ../bmad-tracker/tasks.json --kit ../_bmad
```

### Mode API (CI/CD ou contrôle depuis le kanban)

```bash
# Terminal 1
bmad serve

# Terminal 2
bmad run --brief brief.txt --headless

# Voir l'état
bmad status

# Approuver un gate
bmad gate P1_TO_P2 --approve --notes "PRD validé"

# Via curl (depuis le kanban)
curl -X POST http://localhost:8000/gates/P1_TO_P2/approve \
  -H "Content-Type: application/json" \
  -d '{"notes": "Approuvé"}'
```

### Mode auto (headless, tous les gates passés)

```bash
bmad run --brief brief.txt --auto-approve
# ou
BMAD_AUTO_APPROVE=true bmad run --brief brief.txt --headless
```

## Comment Codex CLI exécute chaque agent

Pour chaque phase, `CodexRunner` :

1. Charge en priorité les skills/workflows BMAD natifs Codex depuis `.agents/skills/`
2. Utilise `_bmad/bmm/config.yaml` et les artefacts `_bmad-output/` comme contexte BMAD local
3. Bascule sur le layout legacy `_bmad/bmm/agents/*.md` si présent
4. Charge le protocole tracker depuis `.bmad-tracker-protocol.md`, `_bmad/tracker-protocol.md` ou le kit si disponible
5. Charge `docs/PROJECT-CONTEXT.md` ou `docs/project-context.md` si présent
6. Construit un prompt complet et l'envoie à Codex via stdin
7. Lance `codex exec --cd <project_root> --dangerously-bypass-approvals-and-sandbox`
8. Codex CLI lit/écrit les fichiers du projet et met à jour tasks.json
9. Le kanban (SSE) détecte les changements et se met à jour en temps réel

## Tests

```bash
pytest tests/ -v
# Tests du runner Codex mockés — aucun appel réseau requis
```

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `OPENAI_API_KEY` | API Key OpenAI (alternative au login) | — |
| `PROJECT_ROOT` | Racine du projet cible | `..` |
| `TASKS_FILE` | Chemin vers tasks.json | `../bmad-tracker/tasks.json` |
| `BMAD_KIT_PATH` | Chemin vers le kit BMAD | `../_bmad` |
| `CODEX_AGENT_TIMEOUT` | Timeout par agent (s) | `600` |
| `CODEX_MODEL_STRATEGIC` | Modèle prioritaire agents critiques | défaut Codex |
| `CODEX_MODEL_EXECUTION` | Modèle prioritaire agents d'exécution | défaut Codex |
| `CODEX_EXEC_MODE` | `permissive` ou `sandboxed` | `permissive` |
| `CODEX_SANDBOX_MODE` | Sandbox si mode sandboxed | `workspace-write` |
| `HUMAN_GATE_TIMEOUT` | Timeout gates humains (s) | `3600` |
| `BMAD_AUTO_APPROVE` | Auto-approuver les gates | `false` |
| `API_PORT` | Port API REST | `8000` |
