import { useState } from 'react';
import { LayoutGrid, GitBranch, Users, Wifi, WifiOff, RefreshCw, ShieldCheck, Repeat } from 'lucide-react';
import { useTasksSSE } from './hooks/useTasksSSE';
import { usePipelineGates } from './hooks/usePipelineGates';
import { KanbanView } from './views/KanbanView';
import { TimelineView } from './views/TimelineView';
import { AgentsView } from './views/AgentsView';
import { GatesView } from './views/GatesView';
import { SprintsView } from './views/SprintsView';
import { TaskDetail } from './components/TaskDetail';
import type { AgentName, Task, TaskStatus, View } from './types';
import { formatDate } from './constants';

export default function App() {
  const { data, status, lastUpdate, updateTaskStatus } = useTasksSSE();
  const { pendingCount, connected: pipelineConnected, pipelineState } = usePipelineGates();

  const [view, setView]               = useState<View>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterAgent, setFilterAgent] = useState<AgentName | 'all'>('all');
  const [filterSprint, setFilterSprint] = useState<number | 'all'>('all');

  function handleStatusChange(id: string, newStatus: TaskStatus) {
    updateTaskStatus(id, newStatus);
  }

  const liveSelected = selectedTask && data
    ? data.tasks.find(t => t.id === selectedTask.id) ?? null
    : null;

  const tasks = data?.tasks ?? [];

  // Count assigned sprints for badge
  const sprintCount = new Set(tasks.filter(t => t.sprint != null).map(t => t.sprint)).size;

  const VIEWS: { id: View; label: string; Icon: typeof LayoutGrid; badge?: number }[] = [
    { id: 'kanban',   label: 'Kanban',   Icon: LayoutGrid },
    { id: 'timeline', label: 'Timeline', Icon: GitBranch },
    { id: 'sprints',  label: 'Sprints',  Icon: Repeat, badge: sprintCount || undefined },
    { id: 'agents',   label: 'Agents',   Icon: Users },
    { id: 'gates',    label: 'Gates',    Icon: ShieldCheck, badge: pendingCount },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="app-logo">BMAD</div>
          <div className="header-project">
            <span className="project-name">{data?.project ?? '—'}</span>
            <span className={`conn-badge conn-badge--${status}`}>
              {status === 'connected'
                ? <Wifi size={11} />
                : status === 'reconnecting'
                ? <RefreshCw size={11} className="spin" />
                : <WifiOff size={11} />}
              {status === 'connected' ? 'Live' : status === 'reconnecting' ? 'Reconnexion…' : 'Hors ligne'}
            </span>
            {pipelineConnected && pipelineState && (
              <span className={`conn-badge conn-badge--pipeline conn-badge--${pipelineState.status}`}>
                {pipelineState.status === 'waiting_gate'
                  ? <ShieldCheck size={11} />
                  : pipelineState.status === 'running'
                  ? <RefreshCw size={11} className="spin" />
                  : <ShieldCheck size={11} />}
                Pipeline
              </span>
            )}
          </div>
        </div>

        <nav className="header-nav">
          {VIEWS.map(({ id, label, Icon, badge }) => (
            <button
              key={id}
              className={`nav-btn${view === id ? ' active' : ''}${badge ? ' nav-btn--alert' : ''}`}
              onClick={() => setView(id)}
            >
              <Icon size={14} />
              {label}
              {!!badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="header-right">
          {lastUpdate && (
            <span className="last-update">
              Màj {formatDate(lastUpdate.toISOString())}
            </span>
          )}
        </div>
      </header>

      <main className="app-main">
        {status === 'connecting' && !data && (
          <div className="loading-screen">
            <RefreshCw size={24} className="spin" />
            <p>Connexion au serveur…</p>
          </div>
        )}

        {status === 'error' && !data && (
          <div className="error-screen">
            <WifiOff size={32} />
            <p>Impossible de se connecter au serveur</p>
            <code>Vérifiez que le serveur tourne sur localhost:3001</code>
          </div>
        )}

        {/* Gates view is always available — doesn't need tracker data */}
        {view === 'gates' && (
          <div className="view-container">
            <div className="view-main"><GatesView /></div>
          </div>
        )}

        {data && view !== 'gates' && (
          <div className={`view-container${liveSelected ? ' with-panel' : ''}`}>
            <div className="view-main">
              {view === 'kanban' && (
                <KanbanView
                  tasks={tasks}
                  onStatusChange={handleStatusChange}
                  onSelectTask={t => setSelectedTask(t)}
                  filterAgent={filterAgent}
                  onFilterAgent={setFilterAgent}
                  filterSprint={filterSprint}
                  onFilterSprint={setFilterSprint}
                />
              )}
              {view === 'timeline' && <TimelineView tasks={tasks} />}
              {view === 'sprints' && <SprintsView tasks={tasks} onSelectTask={t => setSelectedTask(t)} />}
              {view === 'agents' && <AgentsView tasks={tasks} onSelectTask={t => setSelectedTask(t)} />}
            </div>

            {liveSelected && (
              <div className="view-panel">
                <TaskDetail task={liveSelected} onClose={() => setSelectedTask(null)} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
