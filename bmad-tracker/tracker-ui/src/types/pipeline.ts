// Types pour l'API pipeline (port 8000)

export type GateStatus = 'pending' | 'waiting' | 'approved' | 'rejected';
export type PipelineStatus = 'idle' | 'running' | 'waiting_gate' | 'done' | 'failed';

export interface Gate {
  gate_id:     string;
  status:      GateStatus;
  requested_at: string | null;
  decided_at:   string | null;
  decided_by:   string | null;
  notes:        string;
  checklist:    Record<string, boolean>;
}

export interface PipelineState {
  status:          PipelineStatus;
  current_phase:   string | null;
  current_sprint:  number | null;
  phases_done:     string[];
  pending_gates:   string[];
  agents_running:  string[];
  last_log:        string | null;
  started_at:      string | null;
  artifacts:       Record<string, string>;
  errors:          string[];
}

export const GATE_LABELS: Record<string, { title: string; phase: string; desc: string }> = {
  P1_TO_P2: {
    title: 'Validation Analyse',
    phase: 'Analyse → Planification',
    desc:  'Le PRD, les epics et le backlog MoSCoW sont-ils complets et prêts pour la planification ?',
  },
  P2_TO_P3: {
    title: 'Validation Planification',
    phase: 'Planification → Solutionnement',
    desc:  'L\'architecture et les ADRs sont-ils validés pour démarrer le solutionnement ?',
  },
  P3_TO_P4: {
    title: 'Validation Solutionnement + IR',
    phase: 'Solutionnement → Implémentation',
    desc:  'Le design, le threat model et le check IR sont-ils approuvés pour démarrer l\'implémentation ?',
  },
};

/** Résout les labels de gate — supporte les gates dynamiques SPRINT_N */
export function getGateLabel(gateId: string): { title: string; phase: string; desc: string } {
  if (GATE_LABELS[gateId]) return GATE_LABELS[gateId];
  const m = gateId.match(/^SPRINT_(\d+)$/);
  if (m) {
    const n = m[1];
    return {
      title: `Validation Sprint ${n}`,
      phase: `Sprint ${n} — Implémentation`,
      desc:  `Les livrables du Sprint ${n} sont-ils conformes ? Code review, QA et audit sécurité validés ?`,
    };
  }
  return { title: gateId, phase: gateId, desc: '' };
}
