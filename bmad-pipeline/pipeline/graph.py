"""
pipeline/graph.py
Graphe LangGraph — aligné BMAD v6.1.0 (4 phases officielles).

Topologie :
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
  [P3c] IR Check — Vérification de Disponibilité d'Implémentation
    ↓
  ⏸ GATE P3→P4  ← validation humaine
    ↓
  [P4a] Sprint Planning (SM)
    ↓
  [P4b] Dev Backend  ──┐  parallèle
  [P4c] Dev Frontend ──┤
                       ↓ sync
  [P4d] Code Review
    ↓
  [P4e] QA           ──┐  parallèle
  [P4f] Sécu Audit   ──┤
                       ↓ sync
  [P4g] DevOps
    ↓
  END
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

if sys.platform == "win32":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from langgraph.graph import END, START, StateGraph
from rich.console import Console

from .agents import build_agents
from .gates  import wait_for_human_gate
from .state  import GateRecord, Phase, PipelineState

console = Console()


# ── Helpers ───────────────────────────────────────────────────────────────────

def _log(state: PipelineState, msg: str) -> list[str]:
    full = f"[{datetime.now(timezone.utc).isoformat()}] {msg}"
    console.print(f"[cyan]▸[/cyan] {msg}")
    return [full]


def _agents(state: PipelineState):
    return build_agents(
        bmad_kit_path=state["bmad_kit_path"],
        tasks_file=state["tasks_file"],
        project_root=state["project_root"],
    )


def _auto_approve() -> bool:
    return os.getenv("BMAD_AUTO_APPROVE", "false").lower() == "true"

MAX_STORIES_PER_SPRINT = int(os.getenv("BMAD_STORIES_PER_SPRINT", "5"))
MAX_SPRINTS            = int(os.getenv("BMAD_MAX_SPRINTS", "10"))


# ══════════════════════════════════════════════════════════════════════════════
# PHASE 1 — ANALYSE : PM + SM
# ══════════════════════════════════════════════════════════════════════════════

def node_phase1_pm(state: PipelineState) -> dict:
    """Agent PM : produit le PRD et les epics."""
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 1 — Analyse — PM (PRD + epics)")
    a = _agents(state)

    task = f"""
Brief projet :

{state['brief']}

Ton travail :
1. Produire docs/prd.md (vision, personas, périmètre MVP, epics, KPIs)
2. Identifier les fonctionnalités Must/Should/Could
3. Documenter les contraintes techniques et business

Projet : {state['project_name']}
Racine : {state['project_root']}
"""
    ok, out = a["pm"].run(task)
    return {
        "current_phase": Phase.P1_ANALYSIS,
        "artifacts":    {"prd": "docs/prd.md"},
        "pipeline_log": logs + [f"[P1 PM] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 1 PM : {out[:200]}"],
        "abort":        not ok,
    }


def node_phase1_sm(state: PipelineState) -> dict:
    """Agent SM : lit le PRD et crée TOUS les tickets dans tasks.json."""
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 1 — Analyse — SM (génération des tickets tasks.json)")
    a = _agents(state)

    task = f"""
Lis les sources suivantes dans {state['project_root']} avant de produire le backlog :
- docs/prd.md
- README.md
- plans/deck-plan.md
- plans/deck-outline.md si le fichier existe
- src/lib/slides.config.ts
- src/components/deck/
- src/components/shared/
- src/components/slides/

Ton travail (CRITIQUE) :
1. Faire d'abord un inventaire fidèle de l'existant :
   - ce qui est déjà implémenté dans le repo
   - ce qui est partiellement implémenté
   - ce qui reste à faire pour finaliser l'application/deck
2. Produire un backlog deck-first complet aligné sur le produit réel :
   - le produit principal est le deck CVT `pres-deck-cvt`
   - le pipeline BMAD, le tracker et les gates sont seulement le workflow de développement
   - le backlog doit couvrir le deck lui-même, pas transformer le workflow en produit
3. Le backlog DOIT explicitement inclure des tickets pour l'existant déjà codé, au minimum :
   - le setup/foundation
   - le moteur de deck et la navigation
   - les composants partagés déjà présents
   - les slides déjà implémentées (aujourd'hui 1 à 6 d'après `src/lib/slides.config.ts`)
4. Le backlog DOIT aussi couvrir tout le restant nécessaire pour terminer le deck :
   - slides restantes
   - polish
   - QA
   - build/rehearsal/deployment si réellement requis par README ou plans
5. Pour chaque story, créer une entrée dans tasks.json avec :
   - id : US-XXX (numérotation séquentielle)
   - title : titre court de la story
   - description : description en 1 phrase
   - agent : l'agent BMAD responsable (PM/Archi/Design/Sécu/Backend/Frontend/QA/DevOps)
   - phase : phase BMAD (P1 à P4)
   - priority : must/should/could
   - status : reflète la réalité du repo
     - `done`, `review` ou `inprogress` pour le travail déjà visible dans le code ou les docs
     - `backlog` seulement pour le travail réellement restant
   - logs : []
6. Réécrire tasks.json COMPLET avec toutes les stories du projet réel
7. Remplacer les tickets obsolètes, théoriques ou hors-scope par des tickets alignés sur le produit réel
8. Produire _bmad-output/planning-artifacts/epics.md avec le listing consolidé des epics
9. Produire docs/stories/ avec les stories détaillées (critères d'acceptation)

IMPORTANT : Les phases sont alignées BMAD v6 :
  P1 = Analyse (brief, PRD)
  P2 = Planification (architecture, ADRs)
  P3 = Solutionnement (UX, sécurité, design system)
  P4 = Implémentation (dev backend, frontend, QA, DevOps)

GARDE-FOUS OBLIGATOIRES :
- N'invente PAS de stories backend/auth/API/base de données/persistance/session/admin/preview protégé
  sauf si ces besoins sont explicitement requis par `README.md`, `plans/deck-plan.md`, `plans/deck-outline.md`
  ou par du code déjà présent dans le repo.
- Ne transforme PAS des idées futures ou options d'architecture en stories must-have.
- Si un élément n'est qu'une possibilité future, n'en fais pas un ticket P4 must.
- Le backlog final doit représenter l'état réel du dépôt et le travail réel restant pour finir le deck.
- Si `tasks.json` actuel contient des tickets incohérents avec le produit réel, corrige-les.

tasks.json à réécrire : {state['tasks_file']}

Format tasks.json :
{{
  "project": "{state['project_name']}",
  "updatedAt": "[timestamp ISO]",
  "tasks": [
    {{
      "id": "US-001",
      "title": "...",
      "description": "...",
      "agent": "PM",
      "phase": "P1",
      "priority": "must",
      "status": "backlog",
      "sprint": null,
      "logs": []
    }}
  ]
}}
Note : le champ "sprint" est null pour les nouvelles stories (sera assigné lors du Sprint Planning P4).
"""
    ok, out = a["sm"].run(task)
    return {
        "artifacts":    {"backlog": "docs/stories/", "tasks_json": str(state["tasks_file"]), "epics": "_bmad-output/planning-artifacts/epics.md"},
        "pipeline_log": logs + [f"[P1 SM] Tickets créés : {out[:300]}"],
        "errors":       [] if ok else [f"Phase 1 SM : {out[:200]}"],
        "abort":        not ok,
    }


async def node_gate_p1_p2(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Gate P1→P2 — Validation PRD + tickets")
    approved, notes = await wait_for_human_gate(
        gate_id="P1_TO_P2", state=state,
        checklist_items=[
            "PRD complet (vision, personas, périmètre, epics, KPIs)",
            "tasks.json réécrit avec les vrais tickets du projet",
            "Epics consolidés dans _bmad-output/planning-artifacts/epics.md",
            "Stories Must avec critères d'acceptation",
            "MVP délimité clairement",
        ],
        artifacts_to_show=["docs/prd.md", "docs/stories/", "_bmad-output/planning-artifacts/epics.md"],
        auto_approve=_auto_approve(),
    )
    gate = state["gates"]["P1_TO_P2"].copy()
    gate["status"]     = "approved" if approved else "rejected"
    gate["decided_at"] = datetime.now(timezone.utc).isoformat()
    gate["notes"]      = notes
    return {
        "gates":       {"P1_TO_P2": gate},
        "abort":       not approved,
        "pipeline_log": logs,
        "phases_done": [Phase.P1_ANALYSIS] if approved else [],
    }


# ══════════════════════════════════════════════════════════════════════════════
# PHASE 2 — PLANIFICATION : Architecte
# ══════════════════════════════════════════════════════════════════════════════

def node_phase2_architect(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 2 — Planification — Architecte (architecture + ADRs)")
    a = _agents(state)

    task = f"""
Lis docs/prd.md, README.md, plans/deck-plan.md et le code existant du deck dans {state['project_root']}.

Ton travail :
1. Concevoir l'architecture technique du deck réel tel qu'il existe dans le repo
2. Produire docs/architecture.md (shell de présentation, registre des slides, composants partagés, sources de contenu, fallback assets, runtime local-first)
3. Produire ≥ 3 ADRs dans docs/adr/ uniquement sur des sujets réellement pertinents pour ce deck
   - exemples pertinents : structure du shell, organisation du contenu, stratégie de fallback/preuve, contraintes de projection/runtime
   - exemples NON pertinents sauf preuve contraire dans le repo : backend dédié, BDD, auth, session, API
4. Mettre à jour tasks.json : passer les tickets @Archi en "inprogress" puis "review"
"""
    ok, out = a["archi"].run(task)
    return {
        "current_phase": Phase.P2_PLANNING,
        "artifacts":    {"architecture": "docs/architecture.md", "adr": "docs/adr/"},
        "pipeline_log": logs + [f"[P2] Archi : {out[:300]}"],
        "errors":       [] if ok else [f"Phase 2 Archi : {out[:200]}"],
        "abort":        not ok,
    }


async def node_gate_p2_p3(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Gate P2→P3 — Validation architecture")
    approved, notes = await wait_for_human_gate(
        gate_id="P2_TO_P3", state=state,
        checklist_items=[
            "Schéma d'architecture lisible",
            "Stack justifiée avec trade-offs (ADRs)",
            "Modèle de contenu / composants documenté",
            "≥ 3 ADRs produits",
        ],
        artifacts_to_show=["docs/architecture.md", "docs/adr/"],
        auto_approve=_auto_approve(),
    )
    gate = state["gates"]["P2_TO_P3"].copy()
    gate["status"]     = "approved" if approved else "rejected"
    gate["decided_at"] = datetime.now(timezone.utc).isoformat()
    gate["notes"]      = notes
    return {
        "gates":       {"P2_TO_P3": gate},
        "abort":       not approved,
        "pipeline_log": logs,
        "phases_done": [Phase.P2_PLANNING] if approved else [],
    }


# ══════════════════════════════════════════════════════════════════════════════
# PHASE 3 — SOLUTIONNEMENT : UX + Sécu (parallèle) + IR Check
# ══════════════════════════════════════════════════════════════════════════════

def node_phase3_ux(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 3 — Solutionnement — UX Expert (parallèle)")
    a = _agents(state)
    task = f"""
Lis docs/prd.md, docs/architecture.md, plans/deck-plan.md et le code du shell deck dans {state['project_root']}.
Produis docs/design-system.md et docs/ux-flows.md pour un deck local-first :
- patterns de slides
- règles de projection
- interactions clavier
- framing de démo live
- fallback states honnêtes
- cohérence avec les composants déjà présents
Mets à jour tasks.json pour les tickets @Design.
"""
    ok, out = a["design"].run(task)
    return {
        "artifacts":    {"design_system": "docs/design-system.md", "ux_flows": "docs/ux-flows.md"},
        "pipeline_log": logs + [f"[P3 UX] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 3 UX : {out[:200]}"],
    }


def node_phase3_security(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 3 — Solutionnement — Sécurité (parallèle)")
    a = _agents(state)
    task = f"""
Lis docs/architecture.md, README.md, plans/deck-plan.md et le shell deck dans {state['project_root']}.
Produis docs/threat-model.md et docs/security-rules.md pour le produit réel :
- route de présentation locale/publique
- captures, assets et preuves D2R2
- démo live et fallback
- éventuelles extensions futures protégées seulement comme options
Ne présuppose PAS d'auth, de base de données ou d'API obligatoires sur le chemin critique du deck.
Mets à jour tasks.json pour les tickets @Sécu.
"""
    ok, out = a["secu"].run(task)
    return {
        "artifacts":    {"threat_model": "docs/threat-model.md", "security_rules": "docs/security-rules.md"},
        "pipeline_log": logs + [f"[P3 Sécu] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 3 Sécu : {out[:200]}"],
    }


def node_phase3_ir_check(state: PipelineState) -> dict:
    """Vérification de Disponibilité d'Implémentation (IR) — BMAD Phase 3."""
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 3 — IR Check — Vérification de Disponibilité d'Implémentation")
    a = _agents(state)
    task = f"""
Lis les documents suivants dans {state['project_root']} :
- docs/prd.md
- docs/architecture.md
- docs/design-system.md
- docs/ux-flows.md
- docs/threat-model.md
- docs/security-rules.md
- _bmad-output/planning-artifacts/epics.md

Ton travail (IR — Implementation Readiness Check) :
1. Valider l'alignement entre le PRD, l'UX, l'Architecture et les Epics/Stories
2. Vérifier que chaque epic Must a des stories avec critères d'acceptation
3. Vérifier que les flux UX couvrent les epics Must
4. Vérifier qu'il n'y a pas de menace critique sans mitigation
5. Vérifier que les stories restent deck-first et n'introduisent pas de backend/auth/API fictifs non requis
5. Produire un rapport de disponibilité dans _bmad-output/planning-artifacts/ir-report.md
6. Si des problèmes bloquants sont trouvés, les lister clairement

Ne bloque PAS le pipeline — signale les problèmes, le gate humain décidera.
"""
    ok, out = a["archi"].run(task)
    return {
        "current_phase": Phase.P3_SOLUTIONING,
        "artifacts":    {"ir_report": "_bmad-output/planning-artifacts/ir-report.md"},
        "pipeline_log": logs + [f"[P3 IR] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 3 IR Check : {out[:200]}"],
    }


async def node_gate_p3_p4(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Gate P3→P4 — Validation UX + sécu + IR")
    approved, notes = await wait_for_human_gate(
        gate_id="P3_TO_P4", state=state,
        checklist_items=[
            "Design system complet",
            "UX flows pour tous les epics Must",
            "Threat model STRIDE complet",
            "0 menace Critique sans mitigation",
            "IR Check validé — alignement PRD/UX/Architecture/Epics",
        ],
        artifacts_to_show=[
            "docs/design-system.md", "docs/ux-flows.md",
            "docs/threat-model.md",  "docs/security-rules.md",
            "_bmad-output/planning-artifacts/ir-report.md",
        ],
        auto_approve=_auto_approve(),
    )
    gate = state["gates"]["P3_TO_P4"].copy()
    gate["status"]     = "approved" if approved else "rejected"
    gate["decided_at"] = datetime.now(timezone.utc).isoformat()
    gate["notes"]      = notes
    return {
        "gates":       {"P3_TO_P4": gate},
        "abort":       not approved,
        "pipeline_log": logs,
        "phases_done": [Phase.P3_SOLUTIONING] if approved else [],
    }


# ══════════════════════════════════════════════════════════════════════════════
# PHASE 4 — IMPLÉMENTATION : Sprint Planning → Dev → CR → QA → DevOps
# ══════════════════════════════════════════════════════════════════════════════

def node_phase4_sprint_planning(state: PipelineState) -> dict:
    """Agent SM : planifie le sprint courant (sélectionne N stories max)."""
    if state["abort"]:
        return {}
    sprint_num = state["current_sprint"]
    logs = _log(state, f"Phase 4 — Sprint {sprint_num} — Planning (SM)")
    a = _agents(state)
    task = f"""
Lis _bmad-output/planning-artifacts/epics.md et tasks.json dans {state['project_root']}.

C'est le **Sprint {sprint_num}**. Ton travail :
1. Analyser les stories restantes en "backlog" (priorité must > should > could)
2. Sélectionner au maximum **{MAX_STORIES_PER_SPRINT} stories** pour ce sprint
   - Respecter les dépendances réelles du backlog courant
   - Exemples pour ce deck : shell/primitives avant batchs de slides, preuve D2R2 avant certaines slides de preuve, polish après implémentation du contenu
   - Prioriser : must d'abord, puis should, puis could
   - Regrouper les stories liées quand c'est pertinent
   - Si une story déjà `inprogress` est un prérequis direct d'une story candidate, rattache-la au sprint courant via le champ `sprint`
     ou reporte la story candidate au backlog ; ne planifie jamais une story dépendante dans un sprint sans traiter explicitement son prérequis
3. Passer UNIQUEMENT les stories sélectionnées de "backlog" à "ready-for-dev" dans tasks.json
4. IMPORTANT : Ajouter le champ "sprint": {sprint_num} à chaque story sélectionnée
   - Ce champ permet au Kanban UI d'afficher et filtrer par sprint
   - Les stories des sprints précédents gardent leur numéro de sprint
5. NE PAS toucher aux stories déjà "done", "inprogress" ou "review"
6. Mettre à jour _bmad-output/implementation-artifacts/sprint-status.yaml avec le plan du Sprint {sprint_num}
7. Documenter les dépendances et l'ordre d'implémentation recommandé
8. N'invente PAS de stories techniques nouvelles hors backlog validé

Format tasks.json pour chaque story sélectionnée :
  {{ "id": "US-xxx", ..., "sprint": {sprint_num}, "status": "ready-for-dev", ... }}

Format sprint-status.yaml (BMAD) :
  - Sprint: {sprint_num}
  - Stories sélectionnées: [liste]
  - Ordre d'implémentation: [liste ordonnée]
  - Dépendances: [liste]

tasks.json : {state['tasks_file']}
"""
    ok, out = a["sm"].run(task)
    return {
        "current_phase": Phase.P4_IMPLEMENTATION,
        "artifacts":    {f"sprint_{sprint_num}_plan": "_bmad-output/implementation-artifacts/sprint-status.yaml"},
        "pipeline_log": logs + [f"[P4 Sprint {sprint_num}] {out[:300]}"],
        "errors":       [] if ok else [f"Sprint {sprint_num} Planning : {out[:200]}"],
        "abort":        not ok,
    }


def node_phase4_backend(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    sprint_num = state["current_sprint"]
    logs = _log(state, f"Phase 4 — Sprint {sprint_num} — Dev Backend (parallèle)")
    a = _agents(state)
    task = f"""
Sprint {sprint_num}.
Lis docs/architecture.md et docs/security-rules.md dans {state['project_root']}.
Consulte tasks.json pour identifier les stories @Backend en "ready-for-dev" (ce sont celles du sprint courant).

IMPORTANT :
- S'il n'y a aucune story @Backend prête pour ce sprint, n'invente rien :
  ajoute au plus un log factuel indiquant qu'aucun backend n'est requis et termine.
- N'introduis PAS de backend, API, auth, base de données ou persistance par défaut.
- N'implémente du backend que si des stories @Backend existent explicitement dans tasks.json.

Cycle BMAD pour chaque story @Backend sélectionnée :
1. Passer la story de "ready-for-dev" à "inprogress" dans tasks.json
2. Implémenter uniquement le backend explicitement demandé par la story
3. Passer la story à "review" dans tasks.json
4. Ajouter un log décrivant ce qui a été implémenté
"""
    ok, out = a["backend"].run(task)
    return {
        "pipeline_log": logs + [f"[P4 Backend] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 4 Backend : {out[:200]}"],
    }


def node_phase4_frontend(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    sprint_num = state["current_sprint"]
    logs = _log(state, f"Phase 4 — Sprint {sprint_num} — Dev Frontend (parallèle)")
    a = _agents(state)
    task = f"""
Sprint {sprint_num}.
Lis docs/design-system.md, docs/ux-flows.md, docs/architecture.md et le code existant dans {state['project_root']}.
Consulte tasks.json pour identifier les stories @Frontend en "ready-for-dev" (ce sont celles du sprint courant).

Cycle BMAD pour chaque story :
1. Passer la story de "ready-for-dev" à "inprogress" dans tasks.json
2. Implémenter le code pour le deck réel :
   - shell
   - composants partagés
   - slides
   - contenu structuré
   - polish de projection
3. Passer la story à "review" dans tasks.json
4. Ajouter un log décrivant ce qui a été implémenté

Mets à jour tasks.json pour les tickets @Frontend.
"""
    ok, out = a["frontend"].run(task)
    return {
        "pipeline_log": logs + [f"[P4 Frontend] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 4 Frontend : {out[:200]}"],
    }


def node_sync_phase4_dev(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    return {
        "pipeline_log": _log(state, "Sync P4 dev — Backend + Frontend terminés"),
    }


def node_phase4_code_review(state: PipelineState) -> dict:
    """Code Review — BMAD Phase 4 CR step."""
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 4 — Implémentation — Code Review")
    a = _agents(state)
    task = f"""
Lis le code implémenté dans {state['project_root']}.
Lis docs/architecture.md et docs/security-rules.md pour vérifier la conformité.

Ton travail (Code Review — BMAD CR) :
1. Vérifier la conformité du code avec l'architecture réelle du deck
2. Vérifier les règles de sécurité pertinentes pour ce produit :
   - route de présentation
   - paramètres d'URL bornés
   - assets/preuves sûrs
   - absence de dépendance réseau critique
3. Identifier les bugs potentiels et les code smells
4. Passer les stories validées de "review" à "done" dans tasks.json
5. Si des corrections sont nécessaires, ajouter un log détaillé et laisser en "review"
"""
    ok, out = a["qa"].run(task)
    return {
        "pipeline_log": logs + [f"[P4 CR] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 4 Code Review : {out[:200]}"],
    }


def node_phase4_qa(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 4 — Implémentation — QA (parallèle)")
    a = _agents(state)
    task = f"""
Valide l'implémentation dans {state['project_root']}.
Produis docs/test-strategy.md et docs/qa-report.md orientés deck :
- ordre et accessibilité des 39 slides
- navigation clavier
- overview
- black screen
- fullscreen
- lisibilité et fallback states
Mets à jour tasks.json : done si OK, review si bugs.
"""
    ok, out = a["qa"].run(task)
    return {
        "artifacts":    {"qa_report": "docs/qa-report.md"},
        "pipeline_log": logs + [f"[P4 QA] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 4 QA : {out[:200]}"],
    }


def node_phase4_secu_audit(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 4 — Implémentation — Audit sécurité (parallèle)")
    a = _agents(state)
    task = f"""
Audite le code dans {state['project_root']} contre les règles de sécurité du deck :
- sécurité de la route de présentation
- absence de secrets / captures sensibles
- fallback de démo
- dépendances réseau optionnelles seulement
- OWASP quand c'est pertinent pour les extensions futures, sans présupposer un backend SaaS
Produis docs/security-audit.md.
Mets à jour tasks.json : done si 0 finding critique, review sinon.
"""
    ok, out = a["secu"].run(task)
    return {
        "artifacts":    {"security_audit": "docs/security-audit.md"},
        "pipeline_log": logs + [f"[P4 Sécu Audit] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 4 Sécu Audit : {out[:200]}"],
    }


def node_sync_phase4_qa(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    return {
        "pipeline_log": _log(state, "Sync P4 QA — QA + Audit terminés"),
    }


async def node_gate_sprint(state: PipelineState) -> dict:
    """Gate de fin de sprint — validation humaine des livrables du sprint."""
    if state["abort"]:
        return {}
    sprint_num = state["current_sprint"]
    gate_id = f"SPRINT_{sprint_num}"
    logs = _log(state, f"Gate Sprint {sprint_num} — Validation livrables sprint")

    approved, notes = await wait_for_human_gate(
        gate_id=gate_id, state=state,
        checklist_items=[
            f"Stories du Sprint {sprint_num} implémentées correctement",
            "Code review validé — pas de finding bloquant",
            "Tests QA passés",
            "Audit sécurité OK — pas de vulnérabilité critique",
        ],
        artifacts_to_show=[
            "docs/qa-report.md",
            "docs/security-audit.md",
            "_bmad-output/implementation-artifacts/sprint-status.yaml",
        ],
        auto_approve=_auto_approve(),
    )
    gate = state["gates"].get(gate_id, GateRecord(gate_id=gate_id).model_dump()).copy()
    gate["status"]     = "approved" if approved else "rejected"
    gate["decided_at"] = datetime.now(timezone.utc).isoformat()
    gate["notes"]      = notes
    return {
        "gates":        {gate_id: gate},
        "abort":        not approved,
        "pipeline_log": logs,
    }


def node_sprint_increment(state: PipelineState) -> dict:
    """Incrémente le compteur de sprint pour la prochaine itération."""
    old = state["current_sprint"]
    new = old + 1
    return {
        "current_sprint": new,
        "pipeline_log": _log(state, f"Sprint {old} terminé → Sprint {new}"),
    }


def _sprint_routing(state: PipelineState) -> str:
    """Décide si un sprint supplémentaire est nécessaire ou si on passe au DevOps."""
    if state.get("abort"):
        return "abort"
    sprint_num = state["current_sprint"]
    if sprint_num >= MAX_SPRINTS:
        console.print(f"[yellow]  Max sprints ({MAX_SPRINTS}) atteint → passage au DevOps[/yellow]")
        return "devops"
    try:
        tasks_data = json.loads(Path(state["tasks_file"]).read_text(encoding="utf-8"))
        remaining = [
            t for t in tasks_data.get("tasks", [])
            if t.get("status") in ("backlog", "ready-for-dev")
            and t.get("priority") in ("must", "should")
        ]
        if remaining:
            console.print(f"[cyan]  → {len(remaining)} stories must/should restantes → sprint suivant[/cyan]")
            return "next_sprint"
    except Exception as e:
        console.print(f"[yellow]  Erreur lecture tasks.json : {e} → fin implémentation[/yellow]")
    console.print("[green]  → Toutes les stories must/should terminées → DevOps[/green]")
    return "devops"


def node_phase4_devops(state: PipelineState) -> dict:
    if state["abort"]:
        return {}
    logs = _log(state, "Phase 4 — Implémentation — DevOps (build + preview + handoff)")
    a = _agents(state)
    task = f"""
Produis pour {state['project_root']} :
- la documentation de build/rehearsal/deployment adaptée à un deck Next.js local-first
- un workflow CI minimal utile au produit réel (lint/tests/build)
- une option de preview distante seulement si elle reste secondaire
- aucun artefact Docker/backend superflu s'il n'est pas requis par le repo
- docs/deployment.md (runbook)
Mets à jour tasks.json pour les tickets @DevOps.
"""
    ok, out = a["devops"].run(task)
    return {
        "phases_done":  [Phase.P4_IMPLEMENTATION, Phase.DONE],
        "pipeline_log": logs + [f"[P4 DevOps] {out[:300]}"],
        "errors":       [] if ok else [f"Phase 4 DevOps : {out[:200]}"],
    }


def node_end(state: PipelineState) -> dict:
    if state["abort"]:
        console.print("\n[red bold]Pipeline interrompu.[/red bold]")
        if state.get("errors"):
            console.print(f"[red dim]{state['errors'][-1]}[/red dim]")
        return {"current_phase": Phase.FAILED}
    console.print("\n[green bold]✓ Pipeline BMAD terminé.[/green bold]")
    return {"current_phase": Phase.DONE}


# ── Routing ───────────────────────────────────────────────────────────────────

def _should_continue(state: PipelineState) -> str:
    return "abort" if state.get("abort") else "continue"


# ── Graph builder ─────────────────────────────────────────────────────────────

def build_graph() -> StateGraph:
    g = StateGraph(PipelineState)

    # ── Phase 1 — Analyse ──────────────────────────────────────────────────
    g.add_node("phase1_pm",          node_phase1_pm)
    g.add_node("phase1_sm",          node_phase1_sm)
    g.add_node("gate_p1_p2",         node_gate_p1_p2)

    # ── Phase 2 — Planification ────────────────────────────────────────────
    g.add_node("phase2_architect",   node_phase2_architect)
    g.add_node("gate_p2_p3",         node_gate_p2_p3)

    # ── Phase 3 — Solutionnement ───────────────────────────────────────────
    g.add_node("fanout_p3",          lambda state: {})
    g.add_node("phase3_ux",          node_phase3_ux)
    g.add_node("phase3_security",    node_phase3_security)
    g.add_node("phase3_ir_check",    node_phase3_ir_check)
    g.add_node("gate_p3_p4",         node_gate_p3_p4)

    # ── Phase 4 — Implémentation (boucle multi-sprint BMAD) ─────────────────
    g.add_node("phase4_sprint",      node_phase4_sprint_planning)
    g.add_node("fanout_p4_dev",      lambda state: {})
    g.add_node("phase4_backend",     node_phase4_backend)
    g.add_node("phase4_frontend",    node_phase4_frontend)
    g.add_node("sync_p4_dev",        node_sync_phase4_dev)
    g.add_node("phase4_cr",          node_phase4_code_review)
    g.add_node("fanout_p4_qa",       lambda state: {})
    g.add_node("phase4_qa",          node_phase4_qa)
    g.add_node("phase4_secu_audit",  node_phase4_secu_audit)
    g.add_node("sync_p4_qa",         node_sync_phase4_qa)
    g.add_node("gate_sprint",        node_gate_sprint)
    g.add_node("sprint_increment",   node_sprint_increment)
    g.add_node("phase4_devops",      node_phase4_devops)
    g.add_node("end",                node_end)

    # ── Edges ──────────────────────────────────────────────────────────────

    # P1 Analyse
    g.add_edge(START,             "phase1_pm")
    g.add_edge("phase1_pm",       "phase1_sm")
    g.add_edge("phase1_sm",       "gate_p1_p2")
    g.add_conditional_edges("gate_p1_p2", _should_continue,
                            {"continue": "phase2_architect", "abort": "end"})

    # P2 Planification
    g.add_edge("phase2_architect","gate_p2_p3")
    g.add_conditional_edges("gate_p2_p3", _should_continue,
                            {"continue": "fanout_p3", "abort": "end"})

    # P3 Solutionnement (parallèle UX + Sécu → IR Check séquentiel)
    g.add_edge("fanout_p3",       "phase3_ux")
    g.add_edge("fanout_p3",       "phase3_security")
    g.add_edge("phase3_ux",       "phase3_ir_check")
    g.add_edge("phase3_security", "phase3_ir_check")
    g.add_edge("phase3_ir_check", "gate_p3_p4")
    g.add_conditional_edges("gate_p3_p4", _should_continue,
                            {"continue": "phase4_sprint", "abort": "end"})

    # P4 Implémentation — Boucle multi-sprint
    #   Sprint Planning → [Backend ‖ Frontend] → CR → [QA ‖ Audit] → Gate Sprint
    #     → stories restantes ? → sprint suivant (boucle)
    #     → terminé ?           → DevOps → END
    g.add_edge("phase4_sprint",    "fanout_p4_dev")
    g.add_edge("fanout_p4_dev",    "phase4_backend")
    g.add_edge("fanout_p4_dev",    "phase4_frontend")
    g.add_edge("phase4_backend",   "sync_p4_dev")
    g.add_edge("phase4_frontend",  "sync_p4_dev")
    g.add_edge("sync_p4_dev",      "phase4_cr")
    g.add_edge("phase4_cr",        "fanout_p4_qa")
    g.add_edge("fanout_p4_qa",     "phase4_qa")
    g.add_edge("fanout_p4_qa",     "phase4_secu_audit")
    g.add_edge("phase4_qa",        "sync_p4_qa")
    g.add_edge("phase4_secu_audit","sync_p4_qa")
    g.add_edge("sync_p4_qa",       "gate_sprint")
    g.add_conditional_edges("gate_sprint", _sprint_routing, {
        "next_sprint": "sprint_increment",
        "devops":      "phase4_devops",
        "abort":       "end",
    })
    g.add_edge("sprint_increment", "phase4_sprint")  # ← boucle !
    g.add_edge("phase4_devops",    "end")
    g.add_edge("end", END)

    return g


def compile_pipeline():
    return build_graph().compile()
