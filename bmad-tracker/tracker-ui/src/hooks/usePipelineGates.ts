import { useCallback, useEffect, useRef, useState } from 'react';
import type { Gate, PipelineState } from '../types/pipeline';

const PIPELINE_API = import.meta.env.VITE_PIPELINE_API ?? '';
const POLL_INTERVAL = 3000; // ms

interface UsePipelineGatesResult {
  pipelineState: PipelineState | null;
  gates:         Record<string, Gate>;
  pendingCount:  number;
  connected:     boolean;
  approve:       (gateId: string, notes?: string) => Promise<boolean>;
  reject:        (gateId: string, notes?: string) => Promise<boolean>;
  refresh:       () => void;
}

export function usePipelineGates(): UsePipelineGatesResult {
  const [pipelineState, setPipelineState] = useState<PipelineState | null>(null);
  const [gates, setGates]                 = useState<Record<string, Gate>>({});
  const [connected, setConnected]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const [statusRes, gatesRes] = await Promise.all([
        fetch(`${PIPELINE_API}/pipeline/status`),
        fetch(`${PIPELINE_API}/gates/pending`),
      ]);

      if (!statusRes.ok || !gatesRes.ok) {
        setConnected(false);
        return;
      }

      const statusData: PipelineState      = await statusRes.json();
      const { pending }: { pending: string[] } = await gatesRes.json();

      setPipelineState(statusData);
      setConnected(true);

      // Fetch detail for each pending gate
      const gateDetails: Record<string, Gate> = {};
      await Promise.all(
        pending.map(async (gateId) => {
          try {
            // API retourne l'état dans /pipeline/status.gates — on le reconstruit
            gateDetails[gateId] = {
              gate_id:      gateId,
              status:       'waiting',
              requested_at: statusData.started_at,
              decided_at:   null,
              decided_by:   null,
              notes:        '',
              checklist:    {},
            };
          } catch {
            // ignore
          }
        })
      );
      setGates(gateDetails);

    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    timerRef.current = setInterval(fetchStatus, POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchStatus]);

  const decide = useCallback(
    async (gateId: string, approved: boolean, notes = ''): Promise<boolean> => {
      const action = approved ? 'approve' : 'reject';
      try {
        const res = await fetch(`${PIPELINE_API}/gates/${gateId}/${action}`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ notes }),
        });
        if (res.ok) {
          await fetchStatus(); // refresh immédiat
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [fetchStatus]
  );

  return {
    pipelineState,
    gates,
    pendingCount: pipelineState?.pending_gates?.length ?? 0,
    connected,
    approve: (id, notes) => decide(id, true,  notes),
    reject:  (id, notes) => decide(id, false, notes),
    refresh: fetchStatus,
  };
}
