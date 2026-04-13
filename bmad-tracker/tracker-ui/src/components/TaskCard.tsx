import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { AGENT_COLORS, PRIORITY_CONFIG } from '../constants';

interface Props {
  task: Task;
  onSelect: (t: Task) => void;
}

export function TaskCard({ task, onSelect }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const agentColor = AGENT_COLORS[task.agent] ?? { bg: '#F1EFE8', text: '#444441', dot: '#888780' };
  const prio = PRIORITY_CONFIG[task.priority] ?? { label: task.priority, bg: '#F1EFE8', text: '#5F5E5A' };
  const hasLogs = task.logs && task.logs.length > 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(task)}
      className="task-card"
    >
      <div className="card-top-row">
        <span className="card-id">{task.id}</span>
        <span className="card-prio" style={{ background: prio.bg, color: prio.text }}>{prio.label}</span>
      </div>
      <div className="card-title">{task.title}</div>
      <div className="card-desc">{task.description}</div>
      <div className="card-footer-row">
        <span className="card-agent-badge" style={{ background: agentColor.bg, color: agentColor.text }}>
          <span className="agent-dot" style={{ background: agentColor.dot }} />
          {task.agent}
        </span>
        <span className="card-meta">
          <span className="card-phase">{task.phase}</span>
          {task.sprint != null && <span className="card-sprint">S{task.sprint}</span>}
          {hasLogs && <span className="card-log-dot" title={`${task.logs.length} log(s)`} />}
        </span>
      </div>
    </div>
  );
}
