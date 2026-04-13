import type { Task } from '../types';
import { PHASES, AGENT_COLORS, STATUS_CONFIG } from '../constants';

interface Props { tasks: Task[] }

export function TimelineView({ tasks }: Props) {
  return (
    <div className="timeline-view">
      {PHASES.map((phase, pi) => {
        const phaseTasks = tasks.filter(t => t.phase === phase.id);
        const done = phaseTasks.filter(t => t.status === 'done').length;
        const inprog = phaseTasks.filter(t => t.status === 'inprogress' || t.status === 'review').length;
        const total = phaseTasks.length;
        const pct = total ? Math.round(done / total * 100) : 0;

        const phaseStatus = done === total && total > 0 ? 'done'
          : inprog > 0 ? 'active' : 'pending';

        const agentColor = AGENT_COLORS[phase.agent];

        return (
          <div key={phase.id} className="timeline-phase">
            <div className="tl-phase-head">
              <div className={`tl-step-dot tl-step-dot--${phaseStatus}`}>
                {phaseStatus === 'done' ? '✓' : pi + 1}
              </div>
              <div className="tl-phase-info">
                <div className="tl-phase-label">
                  <strong>{phase.id}</strong> — {phase.label}
                  <span className="tl-agent-badge" style={{ background: agentColor.bg, color: agentColor.text }}>
                    @{phase.agent}
                  </span>
                </div>
                <div className="tl-progress-bar">
                  <div className="tl-progress-fill" style={{
                    width: `${pct}%`,
                    background: phaseStatus === 'done' ? '#3B6D11' : phaseStatus === 'active' ? '#BA7517' : '#B4B2A9',
                  }} />
                </div>
                <span className="tl-pct">{done}/{total} terminés ({pct}%)</span>
              </div>
            </div>

            {phaseTasks.length > 0 && phase.id === 'P4' && (() => {
              const sprints = [...new Set(phaseTasks.map(t => t.sprint).filter((s): s is number => s != null))].sort((a, b) => a - b);
              const unassigned = phaseTasks.filter(t => t.sprint == null);
              return (
                <>
                  {sprints.map(s => {
                    const sprintTasks = phaseTasks.filter(t => t.sprint === s);
                    const sDone = sprintTasks.filter(t => t.status === 'done').length;
                    return (
                      <div key={s} className="tl-sprint-group">
                        <div className="tl-sprint-header">
                          <span className="tl-sprint-label">Sprint {s}</span>
                          <span className="tl-sprint-count">{sDone}/{sprintTasks.length}</span>
                        </div>
                        <div className="tl-tasks-grid">
                          {sprintTasks.map(task => {
                            const sc = STATUS_CONFIG[task.status];
                            return (
                              <div key={task.id} className="tl-task-chip">
                                <span className="tl-chip-dot" style={{ background: sc.color }} />
                                <span className="tl-chip-id">{task.id}</span>
                                <span className="tl-chip-title">{task.title}</span>
                                <span className="tl-chip-status" style={{ color: sc.color }}>{sc.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {unassigned.length > 0 && (
                    <div className="tl-sprint-group">
                      <div className="tl-sprint-header">
                        <span className="tl-sprint-label tl-sprint-label--backlog">Backlog P4</span>
                        <span className="tl-sprint-count">{unassigned.length} stories</span>
                      </div>
                      <div className="tl-tasks-grid">
                        {unassigned.map(task => {
                          const sc = STATUS_CONFIG[task.status];
                          return (
                            <div key={task.id} className="tl-task-chip">
                              <span className="tl-chip-dot" style={{ background: sc.color }} />
                              <span className="tl-chip-id">{task.id}</span>
                              <span className="tl-chip-title">{task.title}</span>
                              <span className="tl-chip-status" style={{ color: sc.color }}>{sc.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {phaseTasks.length > 0 && phase.id !== 'P4' && (
              <div className="tl-tasks-grid">
                {phaseTasks.map(task => {
                  const sc = STATUS_CONFIG[task.status];
                  return (
                    <div key={task.id} className="tl-task-chip">
                      <span className="tl-chip-dot" style={{ background: sc.color }} />
                      <span className="tl-chip-id">{task.id}</span>
                      <span className="tl-chip-title">{task.title}</span>
                      <span className="tl-chip-status" style={{ color: sc.color }}>{sc.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {pi < PHASES.length - 1 && <div className="tl-connector" />}
          </div>
        );
      })}
    </div>
  );
}
