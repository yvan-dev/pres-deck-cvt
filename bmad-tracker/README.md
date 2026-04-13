# BMAD Tracker

Dashboard de suivi temps réel du workflow agentique BMAD.
Synchronisé via `tasks.json` (file watcher + SSE) — les agents écrivent dans le fichier, l'UI se met à jour instantanément.

## Architecture

```
bmad-tracker/
├── tasks.json              ← Source de vérité — édité par les agents
├── server/                 ← Express + chokidar + SSE (port 3001)
│   ├── index.js
│   └── package.json
├── tracker-ui/             ← React + Vite (port 5173)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── hooks/useTasksSSE.ts    ← Connexion SSE temps réel
│   │   ├── views/
│   │   │   ├── KanbanView.tsx      ← Drag & drop @dnd-kit
│   │   │   ├── TimelineView.tsx    ← Progression par phase BMAD
│   │   │   └── AgentsView.tsx      ← Vue par agent avec %
│   │   ├── components/
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskDetail.tsx      ← Logs agent en temps réel
│   │   └── types/index.ts
│   └── package.json
└── package.json            ← Script racine (démarre tout)
```

## Installation

```bash
# 1. Installer toutes les dépendances
cd bmad-tracker
npm run install:all

# 2. Démarrer serveur + UI en une commande
npm run dev
```

Ouvre http://localhost:5173

## Démarrage séparé

```bash
# Terminal 1 — serveur file watcher + SSE
npm run dev:server

# Terminal 2 — app React
npm run dev:ui
```

## Comment les agents mettent à jour les tickets

### Format tasks.json

```json
{
  "project": "Mon Projet",
  "updatedAt": "2025-03-14T10:00:00Z",
  "tasks": [
    {
      "id": "US-001",
      "title": "Titre de la story",
      "description": "Description courte",
      "agent": "Backend",
      "phase": "P4",
      "priority": "must",
      "status": "inprogress",
      "logs": [
        { "ts": "2025-03-14T10:00:00Z", "msg": "Implémentation démarrée" },
        { "ts": "2025-03-14T11:30:00Z", "msg": "Endpoints /login et /refresh créés" }
      ]
    }
  ]
}
```

### Valeurs valides

| Champ | Valeurs |
|---|---|
| `agent` | `PM` / `SM` / `Archi` / `Design` / `Sécu` / `Backend` / `Frontend` / `QA` / `DevOps` |
| `phase` | `P1` / `P2` / `P3` / `P4` |
| `priority` | `must` / `should` / `could` / `wont` |
| `status` | `backlog` / `ready-for-dev` / `todo` / `inprogress` / `review` / `done` |

### Intégration dans les agents BMAD

À ajouter dans les instructions d'agent ou dans le prompt pipeline :

```markdown
## Mise à jour du tracker

À chaque changement de statut ou log significatif, mettre à jour tasks.json :

1. Lire tasks.json
2. Trouver le ticket par son ID
3. Modifier le champ `status` et/ou ajouter une entrée dans `logs`
4. Mettre à jour `updatedAt` avec l'horodatage courant
5. Écrire le fichier — le dashboard se met à jour automatiquement
```

### Exemple d'instruction pour Codex CLI

```
Charge le contexte agent BMAD backend du projet.
Implémente US-008 (API auth JWT).
À chaque étape significative, mets à jour tasks.json :
- Passe US-008.status à "inprogress" au démarrage
- Ajoute des logs au fur et à mesure
- Passe à "review" quand l'implémentation est terminée
```

### Script helper (optionnel) — update-task.js

```js
// Permet aux agents de mettre à jour une tâche en CLI
// Usage: node update-task.js US-008 inprogress "Message de log"
import { readFileSync, writeFileSync } from 'fs';

const [,, id, status, msg] = process.argv;
const data = JSON.parse(readFileSync('./tasks.json', 'utf-8'));
const task = data.tasks.find(t => t.id === id);
if (!task) { console.error('Task not found:', id); process.exit(1); }

if (status) task.status = status;
if (msg) task.logs.push({ ts: new Date().toISOString(), msg });
data.updatedAt = new Date().toISOString();
writeFileSync('./tasks.json', JSON.stringify(data, null, 2));
console.log(`✓ ${id} → ${status ?? task.status}`);
```

## API REST (serveur port 3001)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/events` | Stream SSE (init + updates) |
| `GET` | `/tasks` | Tous les tickets |
| `PATCH` | `/tasks/:id` | Modifier status/priority/title |
| `POST` | `/tasks/:id/log` | Ajouter un log `{ msg: "..." }` |

### Exemples curl

```bash
# Passer US-008 en inprogress
curl -X PATCH http://localhost:3001/tasks/US-008 \
  -H "Content-Type: application/json" \
  -d '{"status": "inprogress"}'

# Ajouter un log
curl -X POST http://localhost:3001/tasks/US-008/log \
  -H "Content-Type: application/json" \
  -d '{"msg": "Endpoints /login et /refresh implémentés"}'
```

## Vues disponibles

| Vue | Description |
|---|---|
| **Kanban** | 5 colonnes drag & drop, filtre par agent, métriques live |
| **Timeline** | Progression par phase BMAD (P1→P4) avec barre de progression |
| **Agents** | Carte par agent avec % d'avancement et liste des tickets |
| **Détail** | Panel latéral avec logs agent en temps réel (clic sur un ticket) |

## Connexion avec Jira MCP (prochaine étape)

Le fichier `tasks.json` peut être synchronisé bidirectionnellement avec Jira via un script de bridge :
- `tasks.json → Jira` : à chaque modification, pousser le statut via l'API Jira / MCP
- `Jira → tasks.json` : polling ou webhook Jira pour mettre à jour le fichier local

Ce bridge sera généré lors de l'intégration MCP Jira.

---

## Docker — utilisation plug and play

### Démarrage en une commande

```bash
docker compose up --build
```

→ **http://localhost:5173** — l'app est disponible après ~30s (build React inclus)

### Arrêt

```bash
docker compose down
```

### Rebuild après modification du code

```bash
docker compose up --build
```

### Architecture Docker

```
┌─────────────────────────────────────────────────┐
│  Hôte                                           │
│                                                 │
│  tasks.json  ←── agents / update-task.js        │
│      │                                          │
│      │ bind mount                               │
│      ▼                                          │
│  ┌──────────────────┐   ┌──────────────────┐    │
│  │ bmad-tracker-    │   │ bmad-tracker-ui  │    │
│  │ server           │   │ (Nginx :80)      │    │
│  │ (Express :3001)  │◄──│ proxy /tasks     │    │
│  │ chokidar watcher │   │ proxy /events    │    │
│  └──────────────────┘   └────────┬─────────┘    │
│                                  │ :5173        │
└──────────────────────────────────┼──────────────┘
                                   ▼
                          http://localhost:5173
```

**Flux SSE en Docker** : `tasks.json` est modifié sur l'hôte → chokidar (dans le conteneur server) détecte le changement via bind mount → broadcast SSE → Nginx (conteneur ui) proxie l'event → React re-render.

### Les agents mettent à jour tasks.json depuis l'hôte

```bash
# Directement depuis la racine du projet (hôte) :
node update-task.js US-008 inprogress "Implémentation démarrée"

# Ou via l'API REST exposée par le conteneur :
curl -X PATCH http://localhost:3001/tasks/US-008 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

> Note : le port 3001 n'est pas exposé publiquement dans docker-compose par défaut.
> Pour exposer l'API, ajouter `ports: - "3001:3001"` au service `server`.
