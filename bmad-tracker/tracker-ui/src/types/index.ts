export type TaskStatus = 'backlog' | 'ready-for-dev' | 'inprogress' | 'review' | 'done';
export type TaskPriority = 'must' | 'should' | 'could' | 'wont';
export type AgentName = 'PM' | 'SM' | 'Archi' | 'Design' | 'Sécu' | 'Backend' | 'Frontend' | 'QA' | 'DevOps';
export type Phase = 'P1' | 'P2' | 'P3' | 'P4';

export interface LogEntry {
  ts: string;
  msg: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  agent: AgentName;
  phase: Phase;
  priority: TaskPriority;
  status: TaskStatus;
  sprint?: number | null;
  logs: LogEntry[];
}

export interface TasksData {
  project: string;
  updatedAt: string;
  tasks: Task[];
}

export type View = 'kanban' | 'timeline' | 'sprints' | 'agents' | 'gates';


// Re-export pipeline types
export type { GateStatus, PipelineStatus, Gate, PipelineState as PipelineStateData } from './pipeline';
