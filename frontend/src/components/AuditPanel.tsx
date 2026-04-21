import React from 'react';
import { useAuditLog } from '../hooks/useAuditLog';
import { StatusBadge } from './StatusBadge';

export function AuditPanel({ requestId }: { requestId: string | null }) {
  const { deployment, loading } = useAuditLog(requestId);

  if (!requestId) {
    return (
      <div className="dashed-panel" style={{ height: 'calc(100% - 48px)', margin: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-mute)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>
        Awaiting telemetry link
      </div>
    );
  }

  if (loading || !deployment) {
    return (
      <div className="dashed-panel" style={{ height: 'calc(100% - 48px)', margin: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-mute)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>
        Establishing stream...
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '40px' }}>
      
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-mute)', marginBottom: '8px', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
          NODE IDENTIFIER: {deployment.id}
        </div>
        <div style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px', letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: '1' }}>
          {deployment.title}
        </div>
        <div>
          <StatusBadge status={deployment.status} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', marginBottom: '40px' }}>
        <div style={{ background: 'var(--bg)', padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-mute)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Environment</div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', textTransform: 'uppercase' }}>{deployment.environment}</div>
        </div>
        <div style={{ background: 'var(--bg)', padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-mute)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Version Tag</div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>{deployment.version_tag}</div>
        </div>
        <div style={{ background: 'var(--bg)', padding: '24px', gridColumn: 'span 2' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-mute)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authoring Identity</div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>{deployment.requested_by.split('@')[0]}</div>
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>Execution Manifest</div>
        <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-dim)', whiteSpace: 'pre-wrap' }}>{deployment.release_notes}</div>
      </div>

      {deployment.rejection_reason && (
        <div className="dashed-panel" style={{ border: '1px dashed var(--red)', padding: '24px', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--red)', marginBottom: '12px' }}>Lockout Report</div>
          <pre style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{deployment.rejection_reason}</pre>
        </div>
      )}

      <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '24px' }}>Telemetry Sequence</div>
      
      <div style={{ position: 'relative', marginLeft: '6px', paddingTop: '16px' }}>
        <div style={{ content: '""', position: 'absolute', left: '0', top: '0', bottom: '0', width: '1px', background: 'var(--border-dashed)' }}></div>
        {deployment.audit_log?.map((entry, idx) => {
           let dotColor = 'var(--text-mute)';
           if (entry.new_status === 'APPROVED') { dotColor = 'var(--green)'; }
           else if (entry.new_status === 'REJECTED') { dotColor = 'var(--red)'; }
           else if (entry.new_status === 'VALIDATING') { dotColor = 'var(--purple)'; }
           else if (entry.new_status === 'MANUAL_REVIEW') { dotColor = 'var(--yellow)'; }
           
           const isLast = idx === deployment.audit_log!.length - 1;

           return (
            <div key={entry.id} style={{ position: 'relative', paddingLeft: '24px', marginBottom: isLast ? '0' : '40px' }}>
              <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '11px', height: '11px', background: dotColor }}></div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="dim-text">{entry.old_status}</span> 
                <span className="mute-text">→</span> 
                <span style={{ color: dotColor }}>{entry.new_status}</span> 
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-dim)' }}>
                {entry.reason}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-mute)', marginTop: '8px', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
                {entry.actor} // {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}
