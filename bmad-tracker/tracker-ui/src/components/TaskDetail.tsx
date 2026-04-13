import { X, Clock, Tag, User, Layers, Repeat } from 'lucide-react';
import type { Task } from '../types';
import { AGENT_COLORS, PRIORITY_CONFIG, STATUS_CONFIG, formatDate } from '../constants';

interface Props {
  task: Task;
  onClose: () => void;
}

export function TaskDetail({ task, onClose }: Props) {
  const agentColor = AGENT_COLORS[task.agent] ?? { bg: '#F1EFE8', text: '#444441', dot: '#888780' };
  const prio = PRIORITY_CONFIG[task.priority] ?? { label: task.priority, bg: '#F1EFE8', text: '#5F5E5A' };
  const statusCfg = STATUS_CONFIG[task.status] ?? { label: task.status, color: '#888780' };

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div>
          <span className="detail-id">{task.id}</span>
          <h2 className="detail-title">{task.title}</h2>
        </div>
        <button className="detail-close" onClick={onClose}><X size={16} /></button>
      </div>

      <p className="detail-desc">{task.description}</p>

      <div className="detail-meta-grid">
        <div className="detail-meta-item">
          <User size={13} />
          <span className="dmi-label">Agent</span>
          <span className="dmi-value" style={{ background: agentColor.bg, color: agentColor.text }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: agentColor.dot, display: 'inline-block', marginRight: 5 }} />
            {task.agent}
          </span>
        </div>
        <div className="detail-meta-item">
          <Layers size={13} />
          <span className="dmi-label">Phase</span>
          <span className="dmi-value plain">{task.phase}</span>
        </div>
        <div className="detail-meta-item">
          <Tag size={13} />
          <span className="dmi-label">Priorité</span>
          <span className="dmi-value" style={{ background: prio.bg, color: prio.text }}>{prio.label}</span>
        </div>
        <div className="detail-meta-item">
          <Clock size={13} />
          <span className="dmi-label">Statut</span>
          <span className="dmi-value plain" style={{ color: statusCfg.color }}>● {statusCfg.label}</span>
        </div>
        {task.sprint != null && (
          <div className="detail-meta-item">
            <Repeat size={13} />
            <span className="dmi-label">Sprint</span>
            <span className="dmi-value sprint-badge">Sprint {task.sprint}</span>
          </div>
        )}
      </div>

      <div className="detail-logs-section">
        <h3 className="detail-logs-title">Logs agent</h3>
        {task.logs && task.logs.length > 0 ? (
          <div className="logs-timeline">
            {[...task.logs].reverse().map((log, i) => (
              <div key={i} className="log-entry">
                <div className="log-dot" />
                <div className="log-content">
                  <span className="log-ts">{formatDate(log.ts)}</span>
                  <p className="log-msg">{log.msg}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="logs-empty">Aucun log pour l'instant</p>
        )}
      </div>
    </div>
  );
}
