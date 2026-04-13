#!/usr/bin/env node
/**
 * update-task.js — CLI helper pour mettre à jour tasks.json
 * Usage:
 *   node update-task.js <id> <status> [message]
 *   node update-task.js US-008 inprogress "Implémentation démarrée"
 *   node update-task.js US-008 done "Tous les tests passent"
 *   node update-task.js US-008 - "Log sans changement de statut"  (- = pas de changement)
 *
 * Statuts valides: backlog | todo | inprogress | review | done
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TASKS_FILE = resolve(__dirname, 'tasks.json');

const VALID_STATUSES = ['backlog', 'todo', 'inprogress', 'review', 'done'];

const [,, id, status, ...msgParts] = process.argv;
const msg = msgParts.join(' ');

if (!id) {
  console.error('Usage: node update-task.js <id> <status|-> [message]');
  console.error('Exemple: node update-task.js US-008 inprogress "Démarrage implémentation"');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(TASKS_FILE, 'utf-8'));
} catch (e) {
  console.error('Erreur lecture tasks.json:', e.message);
  process.exit(1);
}

const task = data.tasks.find(t => t.id === id);
if (!task) {
  console.error(`Ticket "${id}" introuvable.`);
  console.error('IDs disponibles:', data.tasks.map(t => t.id).join(', '));
  process.exit(1);
}

const prevStatus = task.status;

if (status && status !== '-') {
  if (!VALID_STATUSES.includes(status)) {
    console.error(`Statut invalide: "${status}"`);
    console.error('Valeurs valides:', VALID_STATUSES.join(' | '));
    process.exit(1);
  }
  task.status = status;
}

if (msg) {
  if (!task.logs) task.logs = [];
  task.logs.push({ ts: new Date().toISOString(), msg });
}

data.updatedAt = new Date().toISOString();

try {
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2), 'utf-8');
} catch (e) {
  console.error('Erreur écriture tasks.json:', e.message);
  process.exit(1);
}

const statusChanged = status && status !== '-' && status !== prevStatus;
console.log(`✓ ${id} — "${task.title}"`);
if (statusChanged) console.log(`  statut : ${prevStatus} → ${task.status}`);
if (msg) console.log(`  log    : ${msg}`);
if (!statusChanged && !msg) console.log('  (aucune modification)');
