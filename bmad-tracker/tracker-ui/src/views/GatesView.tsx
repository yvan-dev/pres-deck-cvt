import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Zap, AlertCircle, Clock } from 'lucide-react';
import { usePipelineGates } from '../hooks/usePipelineGates';
import { getGateLabel } from '../types/pipeline';
import type { PipelineStatus } from '../types/pipeline';

const PHASE_COLORS: Record<string, string> = {
  P1: '#378ADD', P2: '#7F77DD', P3: '#D4537E', P4: '#EF9F27',
};

const STATUS_CONFIG: Record<PipelineStatus, { label: string; color: string }> = {
  idle:         { label: 'En attente',   color: '#888780' },
  running:      { label: 'En cours',     color: '#378ADD' },
  waiting_gate: { label: 'Gate ouvert',  color: '#EF9F27' },
  done:         { label: 'Terminé',      color: '#3B6D11' },
  failed:       { label: 'Échoué',       color: '#E24B4A' },
};

export function GatesView() {
  const { pipelineState, pendingCount, connected, approve, reject, refresh } = usePipelineGates();
  const [deciding, setDeciding]   = useState<string | null>(null);
  const [notes, setNotes]         = useState<Record<string, string>>({});
  const [feedback, setFeedback]   = useState<Record<string, 'approved' | 'rejected' | null>>({});

  const pending  = pipelineState?.pending_gates ?? [];
  const ps       = pipelineState?.status ?? 'idle';
  const sc       = STATUS_CONFIG[ps];

  async function handleDecision(gateId: string, approved: boolean) {
    setDeciding(gateId);
    const ok = approved
      ? await approve(gateId, notes[gateId])
      : await reject(gateId, notes[gateId]);
    setDeciding(null);
    if (ok) setFeedback(f => ({ ...f, [gateId]: approved ? 'approved' : 'rejected' }));
  }

  return (
    <div className="gates-view">

      {/* Pipeline status bar */}
      <div className="pipeline-status-bar">
        <div className="psb-left">
          <span className="psb-dot" style={{ background: sc.color }} />
          <span className="psb-label">Pipeline</span>
          <span className="psb-status" style={{ color: sc.color }}>{sc.label}</span>
          {pipelineState?.current_phase && (
            <span className="psb-phase"
              style={{ background: PHASE_COLORS[pipelineState.current_phase] + '22',
                       color: PHASE_COLORS[pipelineState.current_phase] }}>
              {pipelineState.current_phase}
            </span>
          )}
          {pipelineState?.current_sprint && pipelineState.current_phase === 'P4' && (
            <span className="psb-sprint">Sprint {pipelineState.current_sprint}</span>
          )}
        </div>
        <div className="psb-right">
          {!connected && <span className="psb-offline">API pipeline hors ligne</span>}
          <button className="psb-refresh" onClick={refresh}><RefreshCw size={13} /></button>
        </div>
      </div>

      {/* Not connected */}
      {!connected && (
        <div className="gates-offline">
          <AlertCircle size={20} />
          <div>
            <p className="gates-offline-title">API pipeline non joignable</p>
            <p className="gates-offline-sub">Démarre le pipeline : <code>bmad serve</code></p>
          </div>
        </div>
      )}

      {/* No pending gates */}
      {connected && pending.length === 0 && (
        <div className="gates-empty">
          {ps === 'idle' && <>
            <Zap size={20} />
            <p>Aucun pipeline actif</p>
            <span>Lance <code>bmad run --brief brief.txt</code> pour démarrer</span>
          </>}
          {ps === 'running' && <>
            <RefreshCw size={20} className="spin" />
            <p>Pipeline en cours d'exécution</p>
            <span>Les gates s'afficheront ici quand une validation sera requise</span>
          </>}
          {ps === 'done' && <>
            <CheckCircle size={20} style={{ color: '#3B6D11' }} />
            <p style={{ color: '#3B6D11' }}>Pipeline terminé</p>
            <span>Toutes les phases ont été complétées avec succès</span>
          </>}
          {ps === 'failed' && <>
            <XCircle size={20} style={{ color: '#E24B4A' }} />
            <p style={{ color: '#E24B4A' }}>Pipeline en erreur</p>
            <span>{pipelineState?.errors?.slice(-1)[0] ?? 'Vérifier les logs : bmad log'}</span>
          </>}
        </div>
      )}

      {/* Pending gates */}
      {connected && pending.length > 0 && (
        <div className="gates-list">
          {pending.map(gateId => {
            const meta     = getGateLabel(gateId);
            const isBusy   = deciding === gateId;
            const done     = feedback[gateId];

            return (
              <div key={gateId} className={`gate-card${done ? ` gate-card--${done}` : ''}`}>
                <div className="gate-card-header">
                  <div>
                    <div className="gate-phase-pill">{meta?.phase ?? gateId}</div>
                    <h3 className="gate-title">{meta?.title ?? gateId}</h3>
                    <p className="gate-desc">{meta?.desc}</p>
                  </div>
                  <Clock size={16} className="gate-clock" />
                </div>

                {/* Artefacts produits */}
                {pipelineState?.artifacts && Object.keys(pipelineState.artifacts).length > 0 && (
                  <div className="gate-artifacts">
                    <p className="gate-artifacts-label">Artefacts produits</p>
                    <div className="gate-artifacts-list">
                      {Object.entries(pipelineState.artifacts).map(([k, v]) => (
                        <span key={k} className="gate-artifact-chip">{v}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes input */}
                {!done && (
                  <div className="gate-notes">
                    <input
                      type="text"
                      placeholder="Notes optionnelles (raison d'approbation ou de refus)…"
                      value={notes[gateId] ?? ''}
                      onChange={e => setNotes(n => ({ ...n, [gateId]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleDecision(gateId, true)}
                      disabled={isBusy}
                    />
                  </div>
                )}

                {/* Buttons */}
                {!done ? (
                  <div className="gate-actions">
                    <button
                      className="gate-btn gate-btn--approve"
                      onClick={() => handleDecision(gateId, true)}
                      disabled={isBusy}
                    >
                      {isBusy ? <RefreshCw size={13} className="spin" /> : <CheckCircle size={13} />}
                      Approuver
                    </button>
                    <button
                      className="gate-btn gate-btn--reject"
                      onClick={() => handleDecision(gateId, false)}
                      disabled={isBusy}
                    >
                      <XCircle size={13} />
                      Refuser
                    </button>
                  </div>
                ) : (
                  <div className={`gate-feedback gate-feedback--${done}`}>
                    {done === 'approved'
                      ? <><CheckCircle size={14} /> Approuvé — pipeline continue</>
                      : <><XCircle size={14} /> Refusé — pipeline bloqué</>
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pipeline log (dernières lignes) */}
      {connected && pipelineState?.last_log && (
        <div className="gates-log">
          <p className="gates-log-label">Dernier log</p>
          <p className="gates-log-entry">{pipelineState.last_log}</p>
        </div>
      )}

      {/* Phases done */}
      {connected && (pipelineState?.phases_done?.length ?? 0) > 0 && (
        <div className="gates-phases">
          {pipelineState!.phases_done.map(p => (
            <span key={p} className="phase-done-chip">{p}</span>
          ))}
        </div>
      )}

    </div>
  );
}
