import { useState } from 'react';
import {
  DndContext, DragEndEvent, DragOverEvent, PointerSensor,
  useSensor, useSensors, DragOverlay, DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus, AgentName } from '../types';
import { TaskCard } from '../components/TaskCard';
import { COLUMNS, AGENT_COLORS } from '../constants';

interface Props {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onSelectTask: (t: Task) => void;
  filterAgent: AgentName | 'all';
  onFilterAgent: (a: AgentName | 'all') => void;
  filterSprint: number | 'all';
  onFilterSprint: (s: number | 'all') => void;
}

const AGENTS: (AgentName | 'all')[] = ['all', 'PM', 'SM', 'Archi', 'Design', 'Sécu', 'Backend', 'Frontend', 'QA', 'DevOps'];

function DroppableColumn({ col, tasks, onSelect }: {
  col: typeof COLUMNS[0]; tasks: Task[]; onSelect: (t: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div className={`kb-col${isOver ? ' kb-col--over' : ''}`} ref={setNodeRef}>
      <div className="kb-col-header">
        <span className="kb-col-title" style={{ color: col.color }}>{col.label}</span>
        <span className="kb-col-count">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="kb-col-cards">
          {tasks.length === 0 && <div className="kb-empty">Aucun ticket</div>}
          {tasks.map(t => <TaskCard key={t.id} task={t} onSelect={onSelect} />)}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanView({ tasks, onStatusChange, onSelectTask, filterAgent, onFilterAgent, filterSprint, onFilterSprint }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Collect unique sprint numbers for filter buttons
  const sprintNumbers = [...new Set(tasks.map(t => t.sprint).filter((s): s is number => s != null))].sort((a, b) => a - b);

  const visible = tasks
    .filter(t => filterAgent === 'all' || t.agent === filterAgent)
    .filter(t => filterSprint === 'all' || t.sprint === filterSprint);
  const byCol = (colId: TaskStatus) => visible.filter(t => t.status === colId);

  const total = visible.length;
  const done = visible.filter(t => t.status === 'done').length;
  const inprog = visible.filter(t => t.status === 'inprogress').length;
  const pct = total ? Math.round(done / total * 100) : 0;

  function handleDragStart(e: DragStartEvent) {
    setActiveTask(tasks.find(t => t.id === e.active.id) ?? null);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;
    const colId = COLUMNS.find(c => c.id === over.id)?.id
      ?? tasks.find(t => t.id === over.id)?.status;
    if (colId && colId !== tasks.find(t => t.id === active.id)?.status) {
      onStatusChange(String(active.id), colId as TaskStatus);
    }
  }

  return (
    <div className="kanban-view">
      <div className="kb-toolbar">
        <div className="kb-filters">
          {AGENTS.map(a => (
            <button
              key={a}
              className={`kb-filter-btn${filterAgent === a ? ' active' : ''}`}
              style={a !== 'all' && filterAgent === a ? {
                background: AGENT_COLORS[a as AgentName].bg,
                color: AGENT_COLORS[a as AgentName].text,
                borderColor: AGENT_COLORS[a as AgentName].dot,
              } : {}}
              onClick={() => onFilterAgent(a)}
            >
              {a === 'all' ? 'Tous' : a}
            </button>
          ))}
        </div>
        {sprintNumbers.length > 0 && (
          <div className="kb-filters kb-sprint-filters">
            <button
              className={`kb-filter-btn kb-sprint-btn${filterSprint === 'all' ? ' active' : ''}`}
              onClick={() => onFilterSprint('all')}
            >
              Tous sprints
            </button>
            {sprintNumbers.map(s => (
              <button
                key={s}
                className={`kb-filter-btn kb-sprint-btn${filterSprint === s ? ' active' : ''}`}
                onClick={() => onFilterSprint(s)}
              >
                Sprint {s}
              </button>
            ))}
          </div>
        )}
        <div className="kb-stats">
          <span className="kb-stat"><strong>{total}</strong> tickets</span>
          <span className="kb-stat"><strong>{done}</strong> terminés</span>
          <span className="kb-stat"><strong>{inprog}</strong> en cours</span>
          <span className="kb-stat progress-pct" style={{ color: pct === 100 ? '#3B6D11' : undefined }}>
            <strong>{pct}%</strong>
          </span>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kb-board">
          {COLUMNS.map(col => (
            <DroppableColumn key={col.id} col={col} tasks={byCol(col.id)} onSelect={onSelectTask} />
          ))}
        </div>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onSelect={() => {}} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
