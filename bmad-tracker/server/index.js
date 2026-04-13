import express from 'express';
import cors from 'cors';
import chokidar from 'chokidar';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configuredTasksFile = process.env.TASKS_FILE;
const TASKS_FILE = configuredTasksFile
  ? (isAbsolute(configuredTasksFile)
      ? configuredTasksFile
      : resolve(__dirname, configuredTasksFile))
  : resolve(__dirname, '../tasks.json');
const PORT = process.env.PORT ?? 3001;

const app = express();
app.use(cors());
app.use(express.json());

// SSE clients registry
const clients = new Set();

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach(res => {
    try { res.write(payload); } catch (_) { clients.delete(res); }
  });
  console.log(`[SSE] broadcast "${event}" → ${clients.size} client(s)`);
}

function readTasks() {
  try {
    return JSON.parse(readFileSync(TASKS_FILE, 'utf-8'));
  } catch (e) {
    console.error('[ERROR] Cannot read tasks.json:', e.message);
    return null;
  }
}

// ── Routes ──────────────────────────────────────────────────────────────────

// SSE stream
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current state immediately on connect
  const data = readTasks();
  if (data) res.write(`event: init\ndata: ${JSON.stringify(data)}\n\n`);

  // Heartbeat every 25s to keep connection alive
  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch (_) { clearInterval(heartbeat); }
  }, 25000);

  clients.add(res);
  console.log(`[SSE] Client connected (total: ${clients.size})`);

  req.on('close', () => {
    clients.delete(res);
    clearInterval(heartbeat);
    console.log(`[SSE] Client disconnected (total: ${clients.size})`);
  });
});

// GET all tasks
app.get('/tasks', (req, res) => {
  const data = readTasks();
  if (!data) return res.status(500).json({ error: 'Cannot read tasks.json' });
  res.json(data);
});

// PATCH task status (manual update from UI drag & drop)
app.patch('/tasks/:id', (req, res) => {
  const data = readTasks();
  if (!data) return res.status(500).json({ error: 'Cannot read tasks.json' });

  const task = data.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const allowed = ['status', 'priority', 'title', 'description'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  // Auto-add a log entry on status change
  if (req.body.status && req.body.status !== task.status) {
    task.logs = task.logs || [];
    task.logs.push({
      ts: new Date().toISOString(),
      msg: `Statut changé → ${req.body.status} (via UI)`,
    });
  }

  data.updatedAt = new Date().toISOString();
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  // chokidar will pick up the change and broadcast — no manual broadcast needed
  res.json(task);
});

// POST add log entry to a task
app.post('/tasks/:id/log', (req, res) => {
  const data = readTasks();
  if (!data) return res.status(500).json({ error: 'Cannot read tasks.json' });

  const task = data.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.logs = task.logs || [];
  task.logs.push({ ts: new Date().toISOString(), msg: req.body.msg });
  data.updatedAt = new Date().toISOString();
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  res.json(task);
});

// ── Pipeline / Gates — relay to FastAPI pipeline (port 8000) or fallback stubs ──

const PIPELINE_API = process.env.PIPELINE_API ?? 'http://localhost:8000';

async function proxyOrFallback(req, res, path, fallbackData) {
  try {
    const upstream = await fetch(`${PIPELINE_API}${path}`, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      ...(req.method === 'POST' ? { body: JSON.stringify(req.body) } : {}),
      signal: AbortSignal.timeout(2000),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch {
    // Pipeline not running — return stub
    res.json(fallbackData);
  }
}

app.get('/pipeline/status', (req, res) => proxyOrFallback(req, res, '/pipeline/status', {
  status: 'idle', current_phase: null, current_sprint: null, phases_done: [], pending_gates: [],
  agents_running: [], last_log: null, started_at: null, artifacts: {}, errors: [],
}));
app.get('/pipeline/log', (req, res) => proxyOrFallback(req, res, '/pipeline/log', { log: [] }));
app.get('/gates/pending', (req, res) => proxyOrFallback(req, res, '/gates/pending', { pending: [] }));
app.post('/gates/:gateId/approve', (req, res) => proxyOrFallback(req, res, `/gates/${req.params.gateId}/approve`, { error: 'Pipeline not running' }));
app.post('/gates/:gateId/reject', (req, res) => proxyOrFallback(req, res, `/gates/${req.params.gateId}/reject`, { error: 'Pipeline not running' }));
app.get('/health', (req, res) => proxyOrFallback(req, res, '/health', { status: 'ok', pipeline: 'offline' }));

// ── File watcher ─────────────────────────────────────────────────────────────

let debounceTimer = null;
chokidar.watch(TASKS_FILE, { persistent: true, awaitWriteFinish: { stabilityThreshold: 200 } })
  .on('change', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log('[WATCHER] tasks.json changed — broadcasting update');
      const data = readTasks();
      if (data) broadcast('update', data);
    }, 100);
  });

app.listen(PORT, () => {
  console.log(`\n🚀 BMAD Tracker Server running on http://localhost:${PORT}`);
  console.log(`   Watching: ${TASKS_FILE}`);
  console.log(`   SSE endpoint: http://localhost:${PORT}/events\n`);
});
