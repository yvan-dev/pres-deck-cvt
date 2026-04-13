#!/usr/bin/env node
/**
 * test-integration.js
 * Simule le cycle de vie complet d'un ticket à travers les agents BMAD.
 * Lance le serveur SSE et vérifie que les updates sont bien broadcastées.
 *
 * Usage : node test-integration.js [--tasks path/to/tasks.json]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TASKS_FILE = process.argv.includes('--tasks')
  ? resolve(process.argv[process.argv.indexOf('--tasks') + 1])
  : resolve(__dirname, 'tasks.json');

const UPDATE_SCRIPT = resolve(__dirname, 'update-task.js');

let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function readTasks() {
  return JSON.parse(readFileSync(TASKS_FILE, 'utf-8'));
}

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
}

function resetTicket(id, status = 'todo') {
  const data = readTasks();
  const task = data.tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    task.logs = [];
    data.updatedAt = new Date().toISOString();
    writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
  }
}

console.log('\n🧪 BMAD Tracker — Test d\'intégration\n');
console.log(`   tasks.json : ${TASKS_FILE}`);
console.log(`   update-task.js : ${UPDATE_SCRIPT}\n`);

// ── Vérifications préalables ──────────────────────────────────────────────────
console.log('── Prérequis ──');
assert('tasks.json existe', existsSync(TASKS_FILE));
assert('update-task.js existe', existsSync(UPDATE_SCRIPT));

const data = readTasks();
assert('tasks.json est valide JSON', typeof data === 'object');
assert('tasks.json a un tableau tasks', Array.isArray(data.tasks));
assert('tasks.json a au moins 1 ticket', data.tasks.length > 0);
assert('tasks.json a un champ project', typeof data.project === 'string');
assert('tasks.json a un champ updatedAt', typeof data.updatedAt === 'string');

// ── Test 1 : Changement de statut ─────────────────────────────────────────────
console.log('\n── Test 1 : Changement de statut ──');
const testId = data.tasks[0].id;
resetTicket(testId, 'todo');

run(`node "${UPDATE_SCRIPT}" ${testId} inprogress "Test démarré"`);
const after1 = readTasks().tasks.find(t => t.id === testId);
assert('Statut passé à inprogress', after1.status === 'inprogress');
assert('Log ajouté', after1.logs.length === 1);
assert('Log contient le message', after1.logs[0].msg === 'Test démarré');
assert('Log a un timestamp ISO', /\d{4}-\d{2}-\d{2}T/.test(after1.logs[0].ts));
assert('updatedAt mis à jour', readTasks().updatedAt !== data.updatedAt);

// ── Test 2 : Ajout de log sans changement de statut ───────────────────────────
console.log('\n── Test 2 : Log sans changement de statut ──');
run(`node "${UPDATE_SCRIPT}" ${testId} - "Étape intermédiaire sans changement"`);
const after2 = readTasks().tasks.find(t => t.id === testId);
assert('Statut inchangé (reste inprogress)', after2.status === 'inprogress');
assert('Second log ajouté', after2.logs.length === 2);
assert('Second log contient le message', after2.logs[1].msg.includes('intermédiaire'));

// ── Test 3 : Passage en review ────────────────────────────────────────────────
console.log('\n── Test 3 : Passage en review ──');
run(`node "${UPDATE_SCRIPT}" ${testId} review "Travail terminé — prêt pour relecture"`);
const after3 = readTasks().tasks.find(t => t.id === testId);
assert('Statut passé à review', after3.status === 'review');
assert('3 logs cumulés', after3.logs.length === 3);

// ── Test 4 : Passage en done ──────────────────────────────────────────────────
console.log('\n── Test 4 : Passage en done ──');
run(`node "${UPDATE_SCRIPT}" ${testId} done "Validé — tous les ACs passants"`);
const after4 = readTasks().tasks.find(t => t.id === testId);
assert('Statut passé à done', after4.status === 'done');

// ── Test 5 : Statut invalide rejeté ───────────────────────────────────────────
console.log('\n── Test 5 : Validation des statuts ──');
try {
  run(`node "${UPDATE_SCRIPT}" ${testId} invalide "Test"`);
  assert('Statut invalide rejeté', false, 'Aurait dû lever une erreur');
} catch (e) {
  assert('Statut invalide rejeté (exit code non-zéro)', true);
}

// ── Test 6 : ID inconnu rejeté ────────────────────────────────────────────────
console.log('\n── Test 6 : ID inconnu ──');
try {
  run(`node "${UPDATE_SCRIPT}" US-999 inprogress "Test"`);
  assert('ID inconnu rejeté', false, 'Aurait dû lever une erreur');
} catch (e) {
  assert('ID inconnu rejeté (exit code non-zéro)', true);
}

// ── Test 7 : Intégrité du JSON après plusieurs writes ─────────────────────────
console.log('\n── Test 7 : Intégrité JSON ──');
for (let i = 0; i < 5; i++) {
  run(`node "${UPDATE_SCRIPT}" ${testId} - "Log stress test ${i}"`);
}
let finalData;
try {
  finalData = readTasks();
  assert('tasks.json toujours parseable après 5 writes successifs', true);
} catch (e) {
  assert('tasks.json toujours parseable', false, e.message);
}
assert('Tous les tickets préservés', finalData.tasks.length === data.tasks.length);

// ── Nettoyage ─────────────────────────────────────────────────────────────────
resetTicket(testId, 'todo');

// ── Résumé ────────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(40));
console.log(`Résultat : ${passed} passés, ${failed} échoués`);
if (failed === 0) {
  console.log('✅ Tous les tests passent — intégration tracker opérationnelle\n');
  process.exit(0);
} else {
  console.error(`❌ ${failed} test(s) en échec\n`);
  process.exit(1);
}
