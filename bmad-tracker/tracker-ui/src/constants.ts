import type { AgentName, Phase, TaskPriority, TaskStatus } from '../types';

export const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog',       label: 'Backlog',     color: '#888780' },
  { id: 'ready-for-dev', label: 'Prêt à dev',  color: '#378ADD' },
  { id: 'inprogress',    label: 'En cours',    color: '#BA7517' },
  { id: 'review',        label: 'En revue',    color: '#993556' },
  { id: 'done',          label: 'Terminé',     color: '#3B6D11' },
];

export const PHASES: { id: Phase; label: string; agent: AgentName }[] = [
  { id: 'P1', label: 'Analyse',        agent: 'PM' },
  { id: 'P2', label: 'Planification',  agent: 'Archi' },
  { id: 'P3', label: 'Solutionnement', agent: 'Design' },
  { id: 'P4', label: 'Implémentation', agent: 'Backend' },
];

export const AGENT_COLORS: Record<AgentName, { bg: string; text: string; dot: string }> = {
  'PM':       { bg: '#E6F1FB', text: '#0C447C', dot: '#378ADD' },
  'SM':       { bg: '#DDE8F8', text: '#1A3D6E', dot: '#4A82C4' },
  'Archi':    { bg: '#EEEDFE', text: '#3C3489', dot: '#7F77DD' },
  'Design':   { bg: '#FBEAF0', text: '#72243E', dot: '#D4537E' },
  'Sécu':     { bg: '#FCEBEB', text: '#791F1F', dot: '#E24B4A' },
  'Backend':  { bg: '#FAEEDA', text: '#633806', dot: '#EF9F27' },
  'Frontend': { bg: '#EAF3DE', text: '#27500A', dot: '#639922' },
  'QA':       { bg: '#E1F5EE', text: '#085041', dot: '#1D9E75' },
  'DevOps':   { bg: '#F1EFE8', text: '#444441', dot: '#888780' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; bg: string; text: string }> = {
  must:   { label: 'Must',   bg: '#FCEBEB', text: '#A32D2D' },
  should: { label: 'Should', bg: '#FAEEDA', text: '#854F0B' },
  could:  { label: 'Could',  bg: '#EAF3DE', text: '#3B6D11' },
  wont:   { label: "Won't",  bg: '#F1EFE8', text: '#5F5E5A' },
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  backlog:          { label: 'Backlog',     color: '#888780' },
  'ready-for-dev':  { label: 'Prêt à dev', color: '#378ADD' },
  inprogress:       { label: 'En cours',    color: '#BA7517' },
  review:           { label: 'En revue',    color: '#993556' },
  done:             { label: 'Terminé',     color: '#3B6D11' },
};

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
