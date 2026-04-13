import { CheckCircle, Circle, Clock, PlayCircle, AlertTriangle } from 'lucide-react';
import type { Task } from '../types';
import { AGENT_COLORS, PRIORITY_CONFIG, STATUS_CONFIG } from '../constants';

interface Props {
  tasks: Task[];
  onSelectTask: (t: Task) => void;
}

const STATUS_ORDER: Record<string, number> = {
  inprogress: 0, review: 1, 'ready-for-dev': 2, done: 3, backlog: 4,
};

function sprintStatus(tasks: Task[]): 'done' | 'active' | 'planned' {
  if (tasks.length === 0) return 'planned';
  if (tasks.every(t => t.status === 'done')) return 'done';
  if (tasks.some(t => t.status === 'inprogress' || t.status === 'review')) return 'active';
  return 'planned';
}

export function SprintsView({ tasks, onSelectTask }: Props) {
  // Gather sprints
  const sprintMap = new Map<number, Task[]>();
  const backlog: Task[] = [];

  for (const t of tasks) {
    if (t.sprint != null) {
      if (!sprintMap.has(t.sprint)) sprintMap.set(t.sprint, []);
      sprintMap.get(t.sprint)!.push(t);
    } else if (t.phase === 'P4') {
      backlog.push(t);
    }
  }

  const sprintNums = [...sprintMap.keys()].sort((a, b) => a - b);
  const hasAnySprint = sprintNums.length > 0;

  return (
    <div className="sprints-view">
      {!hasAnySprint && (
        <div className="sprints-empty">
          <AlertTriangle size={22} />
          <p>Aucun sprint planifié</p>
          <span>
            Les sprints apparaitront ici quand le pipeline atteindra la Phase 4 (Implémentation).
            <br />
            Le Scrum Master assignera les stories aux sprints automatiquement.
          </span>
          {backlog.length > 0 && (
            <p className="sprints-empty-count">
              {backlog.length} stories P4 en attente de planification sprint
            </p>
          )}
        </div>
      )}

      {sprintNums.map(num => {
        const sprintTasks = sprintMap.get(num)!;
        const sorted = [...sprintTasks].sort((a, b) =>
          (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
        );
        const done = sprintTasks.filter(t => t.status === 'done').length;
        const inprog = sprintTasks.filter(t => t.status === 'inprogress' || t.status === 'review').length;
        const total = sprintTasks.length;
        const pct = total ? Math.round(done / total * 100) : 0;
        const ss = sprintStatus(sprintTasks);

        return (
          <div key={num} className={`sprint-card sprint-card--${ss}`}>
            <div className="sprint-header">
              <div className="sprint-header-left">
                {ss === 'done'
                  ? <CheckCircle size={18} className="sprint-icon sprint-icon--done" />
                  : ss === 'active'
                  ? <PlayCircle size={18} className="sprint-icon sprint-icon--active" />
                  : <Circle size={18} className="sprint-icon sprint-icon--planned" />}
                <h3 className="sprint-title">Sprint {num}</h3>
                <span className={`sprint-status-badge sprint-status-badge--${ss}`}>
                  {ss === 'done' ? 'Terminé' : ss === 'active' ? 'En cours' : 'Planifié'}
                </span>
              </div>
              <div className="sprint-header-right">
                <span className="sprint-counter">{done}/{total}</span>
                <span className="sprint-pct">{pct}%</span>
              </div>
            </div>

            <div className="sprint-progress">
              <div className="sprint-progress-bar">
                <div
                  className="sprint-progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: ss === 'done' ? '#3B6D11' : '#EF9F27',
                  }}
                />
              </div>
            </div>

            <div className="sprint-tasks">
              <div className="sprint-tasks-header">
                <span>Ticket</span>
                <span>Titre</span>
                <span>Agent</span>
                <span>Priorité</span>
                <span>Statut</span>
              </div>
              {sorted.map(t => {
                const ac = AGENT_COLORS[t.agent] ?? { bg: '#F1EFE8', text: '#444441', dot: '#888780' };
                const pr = PRIORITY_CONFIG[t.priority] ?? { label: t.priority, bg: '#F1EFE8', text: '#5F5E5A' };
                const sc = STATUS_CONFIG[t.status] ?? { label: t.status, color: '#888780' };
                return (
                  <div key={t.id} className="sprint-task-row" onClick={() => onSelectTask(t)}>
                    <span className="sprint-task-id">{t.id}</span>
                    <span className="sprint-task-title">{t.title}</span>
                    <span className="sprint-task-agent" style={{ background: ac.bg, color: ac.text }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ac.dot, display: 'inline-block', marginRight: 4 }} />
                      {t.agent}
                    </span>
                    <span className="sprint-task-prio" style={{ background: pr.bg, color: pr.text }}>{pr.label}</span>
                    <span className="sprint-task-status" style={{ color: sc.color }}>● {sc.label}</span>
                  </div>
                );
              })}
            </div>

            {inprog > 0 && (
              <div className="sprint-footer">
                <Clock size={12} />
                <span>{inprog} en cours / revue</span>
              </div>
            )}
          </div>
        );
      })}

      {backlog.length > 0 && (
        <div className="sprint-card sprint-card--backlog">
          <div className="sprint-header">
            <div className="sprint-header-left">
              <Circle size={18} className="sprint-icon sprint-icon--backlog" />
              <h3 className="sprint-title">Backlog P4</h3>
              <span className="sprint-status-badge sprint-status-badge--backlog">Non planifié</span>
            </div>
            <div className="sprint-header-right">
              <span className="sprint-counter">{backlog.length} stories</span>
            </div>
          </div>
          <div className="sprint-tasks">
            <div className="sprint-tasks-header">
              <span>Ticket</span>
              <span>Titre</span>
              <span>Agent</span>
              <span>Priorité</span>
              <span>Statut</span>
            </div>
            {backlog.map(t => {
              const ac = AGENT_COLORS[t.agent] ?? { bg: '#F1EFE8', text: '#444441', dot: '#888780' };
              const pr = PRIORITY_CONFIG[t.priority] ?? { label: t.priority, bg: '#F1EFE8', text: '#5F5E5A' };
              const sc = STATUS_CONFIG[t.status] ?? { label: t.status, color: '#888780' };
              return (
                <div key={t.id} className="sprint-task-row" onClick={() => onSelectTask(t)}>
                  <span className="sprint-task-id">{t.id}</span>
                  <span className="sprint-task-title">{t.title}</span>
                  <span className="sprint-task-agent" style={{ background: ac.bg, color: ac.text }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: ac.dot, display: 'inline-block', marginRight: 4 }} />
                    {t.agent}
                  </span>
                  <span className="sprint-task-prio" style={{ background: pr.bg, color: pr.text }}>{pr.label}</span>
                  <span className="sprint-task-status" style={{ color: sc.color }}>● {sc.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
