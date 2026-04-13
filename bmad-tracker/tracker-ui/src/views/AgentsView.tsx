import type { Task, AgentName } from '../types';
import { AGENT_COLORS, STATUS_CONFIG } from '../constants';

interface Props { tasks: Task[]; onSelectTask: (t: Task) => void }

const ALL_AGENTS: AgentName[] = ['PM', 'SM', 'Archi', 'Design', 'Sécu', 'Backend', 'Frontend', 'QA', 'DevOps'];

export function AgentsView({ tasks, onSelectTask }: Props) {
  return (
    <div className="agents-view">
      {ALL_AGENTS.map(agent => {
        const agentTasks = tasks.filter(t => t.agent === agent);
        const done = agentTasks.filter(t => t.status === 'done').length;
        const active = agentTasks.filter(t => t.status === 'inprogress' || t.status === 'review').length;
        const color = AGENT_COLORS[agent];

        return (
          <div key={agent} className="agent-card">
            <div className="agent-card-header" style={{ borderColor: color.dot }}>
              <div className="agent-avatar" style={{ background: color.bg, color: color.text }}>
                {agent.slice(0, 2).toUpperCase()}
              </div>
              <div className="agent-card-meta">
                <span className="agent-name">{agent}</span>
                <span className="agent-counters">
                  <span style={{ color: '#3B6D11' }}>{done} terminés</span>
                  {active > 0 && <span style={{ color: '#BA7517' }}> · {active} en cours</span>}
                  <span style={{ color: '#888' }}> · {agentTasks.length} total</span>
                </span>
              </div>
              <div className="agent-pct-circle">
                <svg viewBox="0 0 36 36" width="44" height="44">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#e8e6df" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke={color.dot} strokeWidth="3"
                    strokeDasharray={`${agentTasks.length ? Math.round(done / agentTasks.length * 94) : 0} 94`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span className="agent-pct-label" style={{ color: color.text }}>
                  {agentTasks.length ? Math.round(done / agentTasks.length * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="agent-tasks-list">
              {agentTasks.length === 0 && <p className="agent-no-tasks">Aucun ticket assigné</p>}
              {agentTasks.map(t => {
                const sc = STATUS_CONFIG[t.status];
                return (
                  <div key={t.id} className="agent-task-row" onClick={() => onSelectTask(t)}>
                    <span className="agent-task-dot" style={{ background: sc.color }} />
                    <span className="agent-task-id">{t.id}</span>
                    <span className="agent-task-title">{t.title}</span>
                    {t.sprint != null && <span className="agent-task-sprint">S{t.sprint}</span>}
                    <span className="agent-task-status" style={{ color: sc.color }}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
